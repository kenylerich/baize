# 标准通用 Vibe Coding 开发环境（Agent Harness）搭建指南

> 目标：总结业界（Anthropic、OpenAI、LangChain、Thoughtworks/Martin Fowler、Mitchell Hashimoto）关于"长时任务 Agent Harness"的最新实践，沉淀出一套**标准的、通用的开发环境搭建方法**，使团队能够以 Vibe Coding（人类掌舵、Agent 划桨）的方式完成长周期任务，同时保证高质量输出。
>
> 整理日期：2026-09-14。所有结论均来自文末列出的公开资料。
>
> 零基础读者请直接使用配套实施篇《[vibe-coding-harness-plan.md](../solution/vibe-coding-harness-plan.md)》（本篇为设计依据与出处汇总）。

---

## 0. TL;DR（一页结论）

1. **模型是引擎，Harness 是整车**。Agent = 模型 + Harness（系统提示词、工具、沙箱、验证回路、记忆）。同一个模型换不同 Harness，表现差异是量级的（LangChain 实测同一模型仅优化 Harness 可显著拉分）。
2. **Harness 的每一处设计，本质上都是在编码一个"当前模型做不到什么"的假设**（Anthropic）。模型升级后要回头删脚手架，Harness 是随模型演进持续简化的资产。
3. **上下文是最稀缺资源**。给它地图，而不是 1000 页说明书（OpenAI）；知识放仓库 `docs/` 作为系统记录，`AGENTS.md` 只做目录。
4. **把状态写进文件系统和 git，而不是上下文里**。进度文件 + 特性清单 + 描述性 commit，使 Agent 崩溃/换会话后可无损恢复（Anthropic、Mitchell）。
5. **验证回路是一等公民**。没有"机器可判定的完成标准"，就没有长任务的质量。端到端浏览器测试、hook 自动跑测试、生成器-评估器架构、自定义 linter（报错信息即修复指令）。
6. **一次一个特性，小步提交，每步验证**（Anthropic 长任务失败模式的头号解药）。
7. **Agent 挣扎不是"再努力一点"的信号，而是环境缺失的信号**：缺工具？缺护栏？缺文档？把答案回灌进仓库（OpenAI、Thoughtworks）。
8. **约束架构边界，放权局部实现**（enforce invariants, not implementations）。分层依赖、结构性测试、品味不变量，编码一次、处处生效。
9. **熵必须用 Agent 治理 Agent**：后台"垃圾回收"Agent、文档园艺 Agent、质量评分，小步持续还债，而不是周五人肉清理 AI slop。
10. **安全边界前置**：凭据入 vault + 代理，沙箱内不可见 token；环境按"牲畜"而非"宠物"管理（Anthropic Managed Agents）。

---

## 1. 什么是 Harness，为什么它决定 Vibe Coding 的成败

**定义**：Harness（挽具/执行框架）是包裹在模型外围的一切工程设施——系统提示词、工具与技能（MCP）、沙箱与运行环境、验证与反馈回路、记忆与知识库、编排与恢复机制。

**关键认知**（来自各来源的交叉验证）：

| 认知 | 出处 |
|---|---|
| Agent = Model + Harness；Harness 是把"一次性模型调用"变成"可靠工作引擎"的全部工程 | LangChain《The Anatomy of an Agent Harness》 |
| Harness 中每个组件都在编码一个关于"模型不能做什么"的假设；模型变强时 Harness 应随之简化 | Anthropic《Harness design for long-running apps》 |
| 工程师的新职责不再是写代码，而是**设计环境、表达意图、构建反馈回路** | OpenAI《Harness engineering》 |
| 早期进展慢，不是模型不行，而是**环境欠规定（underspecified）**——缺工具、缺抽象、缺结构 | OpenAI / Thoughtworks 一致结论 |
| Harness 工程化 = 模板化"黄金路径" + 计算性/推理性"传感器"（sensors）持续测量代码库健康度 | Martin Fowler / Thoughtworks 备忘录 |

**对"长任务 + 高质量"这个目标，Harness 要同时解决四个问题：**

1. **上下文有限**：长任务的全部必要状态 > 任何上下文窗口 → 状态必须外化。
2. **任务有主观维度**："好看、优雅、高质量"无法单靠代码判定 → 需要生成器-评估器与评分标准。
3. **运行会中断**：崩溃、上下文打满、模型升级 → 必须 crash-only 可恢复。
4. **熵会累积**：Agent 复制仓库里已有的坏模式 → 必须有机械约束 + 周期性 GC。

---

## 2. 资料来源与逐篇要点

### 2.1 Anthropic《Effective harnesses for long-running agents》
（场景：一个编码 Agent 独立跑 8 小时，从零实现一个 200+ 特性的应用）

- **双 Agent 模式**：
  - **Initializer Agent**：跑 `init.sh` 搭脚手架；**把全部特性写成一个 JSON 清单，每个特性初始都标记为"未通过/失败"**；建立 `claude-progress.txt` 进度文件；启动 dev server；用浏览器自动化（如 Puppeteer MCP）完成一次端到端验证；git 提交。完成后退出——它的使命是给主 Agent 造一个"完好定义的世界"。
  - **Coding Agent**：循环执行"读进度 → 领一个特性 → 实现 → 端到端测试通过才标记完成 → commit + 更新进度文件"。
- **核心纪律**：
  - **一次只做一个特性**（多特性并行 = 烂尾半成品，是头号失败模式）。
  - **端到端验证后才允许勾选完成**，单元测试不足以防"看起来对但跑不起来"。
  - **进度文件 + 描述性 commit** 是跨会话记忆：新会话靠 `git log` + 进度文件重建全部状态。
- **会话恢复仪式（warm-up ritual）**：`pwd` → 读 git log → 读进度文件 → 读特性清单 → 起服务 → 跑一次 e2e 冒烟 → 继续干活。开头 2-3 分钟"重读世界"，避免基于幻觉继续。
- **官方失败模式表（务必内化）**：

| 失败模式 | 表现 | 缓解措施 |
|---|---|---|
| 不问澄清问题 | 错误前提被焊死在实现里 | 提示词要求"先提问、等待回答再动手" |
| 偏离规格 / 偷工减料 | 特性缺失或假实现 | 每步强制 git commit；在存根处留 `# TASK: Implement feature X` 注释，恢复会话先 `grep -r "TASK: Implement"` 抓偷懒 |
| 同时开多个特性 | 一堆半残特性 | 明确指令：一次一个特性 |
| 不记录进度 | 崩溃后全忘 | 每步 commit + 进度文件 + 描述性 commit message |
| 在难题上卡死 | 空烧 token | 允许"记录卡点 → 跳过或求助"，不要死磕 |
| 不管理上下文 | 无关内容挤占 token 预算 | 关掉不用的编辑器 tab；不读无关图片 |

### 2.2 Anthropic《Harness design for long-running apps》
（场景：用 Claude 生成整个 Next.js 应用，质量要求"设计品味"这种主观维度）

- **生成器-评估器架构**（灵感同 GAN）：
  - **Planner Agent**：生成产品概念与执行计划（`plan.md`）；
  - **Generator Agent**：按"冲刺合同（sprint contract）"实现一个功能单元，输出实现文档；
  - **Evaluator Agent**：按**书面评分标准**给产物打分——设计质量、原创性、工艺（craft）、功能完成度；评分构成 Generator 下一轮的输入。
- **三个关键机制**：
  1. **冲刺合同**：限定"这一轮只交付什么、按什么标准验收"，防止范围蔓延与上下文超载。
  2. **上下文焦虑（context anxiety）管理**：宁可**定期整体重置上下文 + 靠文档交接**，也不要无限 compaction——重置 = 换新员工并给交接文档，比"记忆模糊的老员工"更可靠。
  3. **Agent 间只通过文件通信**：`plan.md`、`implementation.md`、`grading.md`，而非消息传递——文件可版本化、可恢复、可审计。
- **模型-共同进化**：随着模型变强，逐版删除脚手架（例如后来直接去掉"冲刺"构造，一个 Agent 一口气完成多步）。**Harness 应保持最小化，只保留模型当前仍做不到的部分。**
- 实测数据点：应用生成总耗时/成本中，**评估环节占比可观但值得**——主观质量主要靠评估器反复打磨出来。

### 2.3 Anthropic《Managed Agents: Decoupling the brain from the hands》
（场景：把 Agent 从"宠物"变"牲畜"，规模化运行数百个长任务 Agent）

- **三方解耦**：
  - **大脑（brain）**：模型 + Harness（提示词、技能、编排）；
  - **双手（hands）**：沙箱与工具集（可按任务 provisioning 不同规格）；
  - **会话（session）**：上下文状态本身，建模为**事件流的位置切片**，独立于任何一次模型调用存活。
- **最小接口抽象**（自建平台可直接照抄）：
  - `execute(name, input) → string`：调用工具/技能；
  - `provision({resources})`：按需供给环境（虚拟机、网络、浏览器等）；
  - `wake(sessionId)` / `getSession(id)`：唤醒/恢复任意会话；
  - `emitEvent(id, event)` / `getEvents()`：事件溯源式记录。
- **工程收益**：首次响应时间（TTFT）大幅优化（预热快照 + 复用环境）；任一沙箱死了换个新的继续跑，会话状态无损。
- **安全模型（重点）**：凭据**永远不进入沙箱可达范围**——token 存 vault，沙箱内的工具调用走**带鉴权的代理（proxy）**，Agent 只见能力不见凭据；git 推送等出站操作由平台层持有凭据并代理执行。
- **元 Harness（meta-harness）**：用这套抽象描述的 Harness 本身可以被另一个 Agent 编排——"管理 Agent 的 Agent"。

### 2.4 Mitchell Hashimoto《My AI adoption journey》
（场景：个人开发者把 AI 从"聊天玩具"用到"全职 teammate"的六阶段）

1. **扔掉聊天框，用真 Agent**（能读写文件、跑命令、自己验证的那种）。
2. **复现你自己的工作**：让 Agent 重做你刚做完的任务，观察差异——这是建立信任和发现 Harness 缺口的最好方法。配套技巧：
   - **把会话切成明确的任务**，一个会话一件事；
   - **规划会话与执行会话分离**：先让 Agent 出计划，人审完，再开执行会话照计划干活；
   - **给 Agent 验证手段**：让它能自己确认"做对了"。
3. **下班时间跑 Agent**：适合"模糊探索"型任务（深研究、并行试想法、issue/PR 分诊）——注意此时要的是**报告（report）而不是回复（response）**，早上人审报告。
4. **外包"稳赢任务"**（slam dunks）：模式清晰、验证容易的活全交出去；此时人可以**关掉通知去干别的事**——这是从"监督者"到"委托者"的转折点。
5. **工程化 Harness（本文档的民间版）**：
   - 每当 Agent 犯某个错，**顺手改 AGENTS.md**，把教训沉淀为规则，而不是下次口头纠正；
   - **把常用验证动作写成脚本**（如截图脚本），Agent 调脚本而不是人贴截图；
   - **给测试跑器加过滤**：把相关测试名/过滤参数传给 Agent，让它忽略无关失败，节省大量无效排查。
6. **永远有一个 Agent 在跑**：彻底完成心态转变——人类是调度与验收者。

### 2.5 Martin Fowler / Thoughtworks《Harness engineering memo》
（场景：咨询公司视角，把 harness 工程推广为组织能力）

- **两个核心构件**：
  - **Guides（引导）**：把"我们期望的架构/品味"变成 Agent 可执行的东西；
  - **Sensors（传感器）**：持续测量代码库是否偏离期望的机制。其中：
    - **计算性评估**：编译、单元测试、契约测试、自定义 linter——确定性判定；
    - **推理性评估**：用 LLM 判定主观维度（如"这段代码是否符合我们的 DDD 风格"）——用模型评模型。
- **Harness 模板 = 新服务模板 / 黄金路径**：组织把"标准 harness"做进服务脚手架（含 Agent 指令、验证脚本、约束配置），新项目开箱即得。
- **约束运行时换自主性**：给 AI 更强自主权的前提，是**更严格的架构描述、强制边界、标准化结构**。同时组织层面应**收敛技术栈**（越少花样，Agent 越可靠）。
- **上下文工程三件套**：知识库（系统记录）+ 可观测性（日志/指标对 Agent 可读）+ 浏览器（Agent 能看 UI）。
- **垃圾回收 Agent**：周期性起 Agent 检查文档与实现不一致、架构违规，直接开修复 PR。
- **迭代心法**："当 Agent 挣扎时，把它当作信号：识别缺了什么——工具、护栏、文档——回灌进仓库。"

### 2.6 OpenAI《Harness engineering: leveraging Codex in an agent-first world》⭐ 补充调研
（场景：3 名工程师 + Codex，数周内交付约 100 万行代码、约 1500 个 PR，**0 行人写代码**，吞吐约 3.5 PR/人/天）

- **核心哲学：人类掌舵（steer），Agent 执行（execute）**。工程师通过提示词交互系统：描述任务 → Agent 实现 → 开 PR → Agent 自审 + 请求其他 Agent 评审 → 迭代到所有评审 Agent 满意（即 Ralph Wiggum 循环）→ 可自动合并。人类评审逐渐变为可选。
- **仓库知识 = 系统记录**：
  - **给 Codex 一张地图，而不是 1000 页说明书**：`AGENTS.md` 约 100 行，只是**目录**；真正的知识库在结构化 `docs/`（设计文档带索引与验证状态、架构图、按域分级的质量文档）。
  - 大而全的指令文件四大罪：挤占上下文 / 全都"重要"等于全不重要 / 立刻腐烂 / 无法机械校验。
  - **渐进式披露（progressive disclosure）**：小而稳定的入口 + 指向下层的指针；用 **linter 和 CI 作业机械校验**知识库的结构、交叉链接与新鲜度。
  - **计划是一等公民工件**：小改动用轻量计划，复杂工作用带进度日志与决策日志的执行计划，全部入库版本化。
  - 仓库之外的知识等于不存在：Slack 里的架构共识若不落仓库，对 Agent 与三个月后的新人同样不可见。
- **Agent 可读性（legibility）优先**：应用按 **git worktree 可启动**（每个变更独立实例）；接入 **Chrome DevTools Protocol** + DOM 快照/截图/导航技能；**每个 worktree 一套临时可观测性栈**（Agent 可用 LogQL 查日志、PromQL 查指标，任务结束销毁）。于是"确保启动 <800ms""四条关键旅程 span 不超 2s"这类提示词变得可执行。
- **机械 enforcing 架构与品味**：
  - 固定分层 `Types → Config → Repo → Service → Runtime → UI`，跨域关注点（auth/遥测/开关）只能经 Providers 单一入口；依赖方向由**自定义 linter + 结构性测试**强制；
  - 自定义 lint 的**报错信息直接写入修复指令**（报错即提示词）；
  - "品味不变量"：强制结构化日志、命名约定、文件大小上限等；
  - 原则：**约束不变量，不微观管理实现**（如强制"边界处必须解析数据形状"，但不指定用哪个库）。
- **技术选型向 Agent 倾斜**："无聊"技术（组合性好、API 稳定、训练语料多）更易被 Agent 正确建模；必要时让 Agent 自己重写小工具，换取完全在仓库内可推理（例：不用 `p-limit`，自己写带 100% 覆盖率的并发 map helper）。
- **吞吐改变合并哲学**：最少的阻塞式合并门禁；PR 短命；flaky 测试用重跑而非无限阻塞——**修正很便宜，等待很贵**（低吞吐环境勿照抄）。
- **熵治理 = GC**：曾用每周 20% 人力清"AI slop"，不可持续；改为把**黄金原则**（共享工具包优于手搓 helper、禁止 YOLO 式数据探测等）编码入仓库 + **后台 Codex 任务周期扫描偏差、更新质量评分、开定向重构 PR**（多数 1 分钟内可审、自动合并）。技术债如高息贷款，小步持续偿还。
- **完全自主闭环已出现**：单条提示词驱动 Agent 完成"验证现状 → 复现 bug → 录失败视频 → 修复 → 驱动应用验证 → 录解决视频 → 开 PR → 回应评审 → 修构建 → 仅在需要人类判断时上报 → 合并"。
- **元方法论**：遇到失败几乎从不"再试一次"，而是问"**缺了什么能力？如何让它对 Agent 既可读（legible）又可强制（enforceable）？**"，并且**让 Codex 自己写修复**。

### 2.7 LangChain《The Anatomy of an Agent Harness》
（场景：Harness 组件的系统化分类）

- **Harness 组件清单**（做自检用）：
  1. **系统提示词**：角色、规则、输出约定；
  2. **工具 / 技能 / MCP**：受控的能力面；技能=按需加载的程序性知识（渐进式披露）；
  3. **捆绑基础设施**：文件系统（持久存储——跨会话状态的家）、**沙箱**（隔离、快照、必须有趁手默认工具：运行时、git、测试、浏览器）、**bash**（万能工具：curl/jq 等一切垫片）、浏览器（看 UI、e2e）；
  4. **编排**：子 Agent（隔离上下文的并行探索）、handoffs、模型路由（贵模型决策/便宜模型执行）；
  5. **Hook 与中间件**：在工具调用前后插逻辑——**自动跑测试/格式化/lint 的自验证回路就挂在这里**。
- **记忆**：`AGENTS.md` 是最小可行记忆；进阶 = 文件系统 + 分层检索。
- **长视野（long horizon）技术**：Ralph 循环（自驱迭代直到完成）、先规划后执行、hook 挂测试套件自验证、**文件系统做持久状态**。
- **Context rot 对策**：compaction（摘要压缩）、工具调用结果卸载到文件、技能按需加载。
- **结论**：模型与 Harness **共同进化**；Harness 优化的杠杆极大（同模型下优化 Harness 即可在基准上大幅提分）。

---

## 3. 跨来源共识：八条设计原则

把六家实践叠在一起，几乎每条都被至少两家独立验证：

1. **状态外化**：任务状态、进度、决策、知识全部落在仓库文件 + git，上下文只是缓存。*"文件即记忆，git 即历史。"*（Anthropic 进度文件、OpenAI 执行计划、LangChain 文件系统）
2. **地图式上下文**：入口指令短而稳定，知识分层渐进披露，且有机械手段校验新鲜度。（OpenAI、LangChain、Thoughtworks）
3. **机器可判定的"完成"**：每个任务必须有验证脚本/e2e/评分标准；不通过不算完成。（Anthropic、Mitchell、OpenAI、Thoughtworks）
4. **单特性节奏**：一次一个特性 → 验证 → commit → 更新进度，是长任务不烂尾的底层节拍。（Anthropic、OpenAI 短命 PR）
5. **挣扎 = 环境缺陷**：Agent 反复失败的正确响应是补工具/护栏/文档，而不是换措辞重试。（OpenAI、Mitchell、Thoughtworks）
6. **约束边界、放权实现**：分层 + 依赖方向 + 品味不变量机械强制；实现细节交给 Agent。（OpenAI、Thoughtworks、Anthropic）
7. **Agent 治理熵**：文档园艺、GC、质量评分全部 Agent 化、周期化、小步化。（OpenAI、Thoughtworks）
8. **Harness 随模型简化**：定期重审 Harness，删除"模型已经会了"的脚手架；Harness 是负债管理，不是越多越好。（Anthropic、LangChain）

---

## 4. 标准通用开发环境蓝图

### 4.1 分层架构

```
┌─────────────────────────────────────────────────────────┐
│  人类（掌舵）：定优先级、写验收标准、评报告、审关键 PR      │
├─────────────────────────────────────────────────────────┤
│  编排层：任务分解(Planner) / 执行(Coder) / 评估(Evaluator) │
│          子Agent、模型路由、Ralph循环、恢复(wake)          │
├─────────────────────────────────────────────────────────┤
│  知识层：AGENTS.md(目录) + docs/(系统记录)                 │
│          特性清单 / 执行计划 / 进度文件 / 决策日志          │
├─────────────────────────────────────────────────────────┤
│  验证层：e2e浏览器测试 / 单测+过滤跑器 / 自定义linter      │
│          结构性测试 / hook自验证回路 / 评分标准             │
├─────────────────────────────────────────────────────────┤
│  环境层：沙箱(容器/worktree) + 运行时 + git + bash         │
│          浏览器自动化(CDP/MCP) + 临时可观测性栈             │
├─────────────────────────────────────────────────────────┤
│  安全层：vault凭据 + 鉴权代理 / 沙箱不可见token / 审计事件流 │
└─────────────────────────────────────────────────────────┘
```

### 4.2 标准仓库脚手架（模板）

```
repo/
├── AGENTS.md                  # ≤100行：地图与目录，不是百科
├── init.sh                    # 一键初始化：装依赖、起服务、造数据、冒烟验证
├── scripts/                   # 所有验证动作脚本化（Agent 的"手"）
│   ├── test.sh                # 测试跑器（支持过滤器参数）
│   ├── verify-feature.sh      # 单特性 e2e 验证
│   ├── screenshot.sh          # UI 截图
│   ├── smoke.sh               # 冒烟：服务起得来、首页可访问
│   └── check-docs.sh          # 知识库新鲜度/交叉链接校验
├── docs/
│   ├── architecture.md        # 分层图 + 依赖方向规则
│   ├── quality.md             # 按域/按层的质量评分与差距
│   ├── decisions/             # 决策日志（ADR）
│   └── plans/                 # 执行计划（active/ done/ debt.md）
├── tasks/
│   ├── feature-list.json      # 特性清单：全部初始标记 false/failed
│   └── progress.md            # 进度文件：已完成/进行中/卡点/下一步
├── .claude/ 或等价 agent 配置  # skills、hooks（提交后自动跑 lint/test）
├── src/…                      # 固定分层：types→config→repo→service→runtime→ui
└── tests/…                    # 单测 + 结构性测试 + e2e
```

**各文件职责要点：**

- **AGENTS.md**：只写"还有什么文档、去哪找、仓库铁律（≤10条）"。教训沉淀的默认去处是 `docs/` 对应文件，AGENTS.md 只加一行指针——防止它膨胀成没人维护的天书。
- **feature-list.json**：长任务的"工作合同"。每项含 id、名称、验收标准（可执行命令）、status。**初始化时全部 false**——这利用了模型"把失败项变绿"的目标导向。
- **progress.md**：结构固定：`上次会话做了什么 / 当前卡点 / 下一步 / 已知坑`。每个特性完成后必须更新。
- **plans/**：小任务轻量计划；大任务执行计划（目标、里程碑、进度日志、决策日志）入库版本化。

### 4.3 长任务运行协议（SOP）

**阶段 0 · 初始化（Initializer Agent / 一次性）**
1. 跑 `init.sh` 搭脚手架（CI、格式化、包管理、框架、AGENTS.md 本身都可由 Agent 生成）；
2. 与人共同把需求写成 feature-list.json（**验收标准必须是可执行命令**）；
3. 起 dev server，跑通一次 e2e 冒烟，证明"世界完好"；
4. 首次 commit。此后退出。

**阶段 1 · 每个会话开工仪式（warm-up ritual，2-3 分钟）**
```
pwd → git log --oneline -20 → 读 progress.md → 读 feature-list.json
→ 跑 smoke.sh 确认服务健康 → grep -r "TASK: " 抓历史偷工减料 → 继续干活
```
目的：基于事实而非幻觉重建世界观。

**阶段 2 · 单特性循环（主循环）**
```
选 1 个未完成特性（按优先级，不并行）
→ 澄清：有歧义先提问（或写入 progress.md 的"卡点"）再动手
→ 实现 → verify-feature.sh 通过（e2e，非仅单测）
→ 勾选 feature-list + 更新 progress.md
→ commit（描述性 message：做了什么、为什么）
```

**阶段 3 · 恢复与降级**
- 上下文打满/崩溃 → 新会话重走开工仪式，从进度文件续命；
- 卡死 → 记录卡点到 progress.md → 跳过该特性或升级给人，**不死磕**；
- 模型/版本变更 → 重审 Harness，删掉"模型已会"的脚手架。

### 4.4 质量保障体系

1. **客观维度——传感器（机械判定）**
   - 提交/推送钩子自动跑 lint + 单测（自验证回路挂在 hook/中间件上）；
   - 自定义 linter 强制架构分层、依赖方向、命名、日志规范，**报错文本内嵌修复指令**；
   - 结构性测试守护分层边界；测试跑器支持过滤器（传相关测试名，避免无关失败干扰）。
2. **主观维度——评估器（推理判定）**
   - Evaluator Agent 按书面评分标准（如：设计质量 / 原创性 / 工艺 / 功能）打分并输出改进建议，作为 Generator 下轮输入；
   - 评分标准由人初始定义，并按"评估器挑出的错误实际上并不存在"这类误报持续调优；
   - UI 类验收用浏览器自动化截图 + DOM 快照，让"好看"可被看见、可比对。
3. **评审网络**
   - PR 短命；Agent 自审 + 互审（agent-to-agent review），人只审高风险/关键判断；flaky 以重跑处理，别让人等。
4. **知识库治理**
   - CI 校验 docs 结构与交叉链接；doc-gardening Agent 周期扫描"文档与代码不符"并开修复 PR。

### 4.5 环境与工具标准（Agent 的"身体"）

- **每个 git worktree 一个可启动的应用实例** + **一套临时可观测性栈**（日志可 LogQL、指标可 PromQL，任务结束即焚）；
- 浏览器自动化（CDP 或 MCP）+ 截图脚本，Agent 能复现 bug、验证修复；
- 沙箱默认工具齐全：运行时、git、测试框架、bash、常用垫片（jq/curl）——**缺工具是进展缓慢的第一原因**；
- 凭据走 vault + 鉴权代理，沙箱不可见 token；出站（git push 等）由平台层代理。

### 4.6 熵治理（GC 循环）

- 把"黄金原则"写入 docs（例：共享工具包优先；禁止 YOLO 式数据探测——边界必须校验）；
- 后台 GC Agent 周期运行：扫描坏模式偏差 → 更新 quality.md 评分 → 开小步重构 PR（多数可自动合并）；
- 人为品味反馈的唯一去向：**文档或工具**。文档不够就升级为 lint——"capture once, enforce everywhere"。

---

## 5. 人机分工（Vibe Coding 的工作方式）

| 人类（掌舵） | Agent（划桨） |
|---|---|
| 定优先级、写验收标准与评分标准 | 规划细化、实现、测试、修复 |
| 把用户反馈翻译成验收条件 | 自审、互审、回应评审、开合 PR |
| 审关键判断点（仅在需要 judgment 时上报） | 文档园艺、GC、质量评分 |
| 每次 Agent 犯错 → 回灌 harness（改文档/加工具/加 lint） | 复现、验证、录制视频等一切可机械化动作 |

**实践节奏**（Mitchell 阶段模型的团队版）：
- **规划会话与执行会话分离**：先出计划人审，再开执行会话照办；
- 白天委托"稳赢任务"，**关通知干自己的事**；下班挂"模糊探索"任务，早上收**报告**；
- **永远有一个 Agent 在跑**；
- 吞吐上来后合并门禁从简：**修正便宜，等待昂贵**——但此条仅适用于验证回路健全的仓库。

---

## 6. 演进策略：Harness 是会过期的资产

- Harness 每条规则/工具/脚手架 = 一条"模型当前做不到 X"的假设；
- 模型每次升级，做一次 **Harness 减法审计**：哪些脚手架可以删？（Anthropic 的实例：从三 Agent 冲刺制简化到单 Agent 直通；OpenAI 的实例：从人肉周五清 slop 到 GC Agent，再到全自动闭环）
- 相反方向同样成立：**发现新失败模式 → 立即物化为工具/文档/lint**。一减一加，Harness 始终保持最小而足够。

---

## 7. 反模式清单（踩坑汇总）

1. ❌ 巨型 AGENTS.md 百科全书 → 膨胀、腐烂、不可校验。✅ 目录 + 分层 docs。
2. ❌ 让 Agent 并行开多个特性 → 半残特性堆。✅ 单特性节拍。
3. ❌ 只跑单测就标记完成 → "看起来对，跑不起来"。✅ e2e 验证才算完。
4. ❌ 无限 compaction 硬撑长会话 → 记忆模糊的老员工。✅ 定期重置 + 文档交接。
5. ❌ Agent 失败后换措辞重试 N 次 → 空烧。✅ 问"缺什么工具/护栏/文档"，回灌仓库。
6. ❌ 微观管理实现细节（指定库、指定写法）→ 抹平模型优势。✅ 只强制不变量与边界。
7. ❌ 人肉清 AI slop（每周 20% 人力）→ 不可持续。✅ 黄金原则 + GC Agent。
8. ❌ 知识散在 Slack/文档外/人脑 → 对 Agent 不存在。✅ 一切落仓库。
9. ❌ 凭据放沙箱环境变量 → 泄漏面。✅ vault + 代理。
10. ❌ 把 progress 只写在上下文里 → 崩溃即失忆。✅ 文件 + git。
11. ❌ 用人类评审流程硬卡 Agent 吞吐 → 人成为瓶颈。✅ agent-to-agent 评审 + 抽样人审。
12. ❌ Harness 一次性搭完从不回收 → 模型升级后脚手架反而添乱。✅ 定期减法审计。

---

## 8. 从零落地 Checklist

**Day 1（半天）：**
- [ ] 空 git 仓库 + `init.sh`（框架、包管理、格式化、CI 骨架）
- [ ] ≤100 行 AGENTS.md（只做目录）
- [ ] `docs/architecture.md`（分层 + 依赖方向）
- [ ] `scripts/smoke.sh` + `scripts/test.sh`（带过滤器）
- [ ] 浏览器自动化接入 + `scripts/screenshot.sh`
- [ ] 首个 commit

**第一周：**
- [ ] 需求 → feature-list.json（验收标准=可执行命令，全部初始 false）
- [ ] progress.md 建立并纳入 SOP
- [ ] hook：提交/PR 自动 lint + test；自定义 linter 报错内嵌修复指令
- [ ] worktree 可启动应用 + 临时日志/指标栈
- [ ] 凭据 vault + 代理（token 不进沙箱）

**第一个月：**
- [ ] Evaluator 评分标准书面化并调优（防误报）
- [ ] docs 质量评分 quality.md + CI 校验知识库新鲜度
- [ ] doc-gardening / GC Agent 定时任务上线
- [ ] 会话仪式固化进 AGENTS.md；规划/执行会话分离成为团队习惯
- [ ] 首次 Harness 减法审计

---

## 附录 A · 模板集（已迁移）

可复制的正式模板已迁移至 [`docs/templates/`](../templates/)，作为唯一权威来源维护：

| 模板 | 用途 |
|---|---|
| [AGENTS.md](../templates/AGENTS.md) | 仓库知识库入口骨架（≤100 行的"地图"） |
| [feature-list.json](../templates/feature-list.json) | 任务看板：特性清单，验收标准=可执行命令 |
| [progress.md](../templates/progress.md) | 进度文件：上次会话 / 卡点 / 下一步 / 已知坑 |
| [main-loop-prompt.md](../templates/main-loop-prompt.md) | 单特性主循环标准提示词 |

---

## 参考文献

1. Anthropic — [Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
2. Anthropic — [Harness design for long-running application development](https://www.anthropic.com/engineering/harness-design-long-running-apps)
3. Mitchell Hashimoto — [My AI adoption journey](https://mitchellh.com/writing/my-ai-adoption-journey)
4. Martin Fowler / Thoughtworks — [Harness engineering – first thoughts](https://martinfowler.com/articles/exploring-gen-ai/harness-engineering-memo.html)
5. LangChain — [The Anatomy of an Agent Harness](https://www.langchain.com/blog/the-anatomy-of-an-agent-harness)
6. Anthropic — [Scaling Managed Agents: Decoupling the brain from the hands](https://www.anthropic.com/engineering/managed-agents)
7. OpenAI — [Harness engineering: leveraging Codex in an agent-first world](https://openai.com/index/harness-engineering/)（补充调研）
