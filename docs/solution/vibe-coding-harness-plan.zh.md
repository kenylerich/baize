# Vibe Coding 开发环境搭建 · 完整实施方案
> status: Active（生效；中文翻译版；英文为权威版本）

> **定位**：本文是"完整落地方案"（实施篇），面向**零基础读者**——先帮你把思路从零理顺，再给出一套可执行的搭建方案，覆盖**嵌入式开发与全部软件领域**。
> **理论依据与文章出处**见调研篇《[harness-best-practices.zh.md](../research/harness-best-practices.zh.md)》。
> **建议读法**：第一部分通读（约 30 分钟建立认知）→ 第二部分精读（方案核心）→ 直接跳到第三部分你所在的领域 → 按第四部分路线图开干。

---

# 第一部分 思路整理：从零理解 Vibe Coding 与 Harness

## 1.1 AI 辅助开发已经走到哪一步了

| 阶段 | 形态 | 人的角色 | 适合的任务 |
|---|---|---|---|
| ① 补全时代 | Copilot 式自动补全 | 写代码，AI 补几个词 | 一切，AI 只是打字加速器 |
| ② 对话时代 | ChatGPT/Cursor 聊天窗口 | 提问、复制粘贴代码 | 单点问题、小函数、代码解释 |
| ③ **自主 Agent 时代** | Claude Code / Codex CLI / 自主模式 | **下指令、定验收、看结果** | **整页功能、修 bug、跨文件重构、批量任务** |
| ④ 编排时代 | 多 Agent 协作、托管平台 | 只定方向与优先级 | 数周级长任务、大规模并行开发 |

**Vibe Coding 指的就是第 ③④ 阶段的工作方式**：人不再逐行读代码，而是用自然语言描述意图 → Agent 自主完成实现 → 靠**自动验证**保证质量。人的产出从"代码"变成"**意图 + 验收标准 + 环境设计**"。

## 1.2 为什么"直接让 AI 做个大项目"会失败

把一个 agentic 工具直接扔进大项目，几乎必然出现以下四个问题（这是所有来源一致验证的）：

| 障碍 | 现象（你一定会见到的） | 根因 |
|---|---|---|
| **失忆** | 会话一断/上下文一满，AI 忘了之前做了什么，重复劳动甚至推倒重来 | 模型上下文窗口有限，而长任务的全部必要状态 > 窗口 |
| **无据** | AI 声称"已完成、已测试"，实际跑不起来 | 它没有"亲自动手验证"的工具和纪律，只在"想象中"完成了 |
| **迷路** | 改着改着偏题、偷工减料、留一堆半成品 | 任务没有显式拆解成可勾选清单，AI 在模糊目标下自由发挥 |
| **熵增** | 复制仓库里的坏模式，文档和代码逐渐互相矛盾，越写越乱 | 没有机械化的约束与周期性清理，坏味道无人管 |

## 1.3 核心解法：Harness（给 AI 造一个"工作台"）

**心智模型：模型是外请的天才工程师，Harness 是你为它准备的工作台。**

天才工程师能力很强，但它是"新来的"：每次上班（新会话）对公司一无所知、记性有限、看不见真实世界。你要给它：

1. **新手包**（知识库）：公司有哪些规矩、代码怎么分层、文档在哪——但只给目录，别给 1000 页手册；
2. **任务看板**（任务清单 + 进度文件）：做什么、做到哪了、卡在哪，全部写下来，不靠脑子记；
3. **验收工具**（验证回路）：一条命令就能判定"做对了没有"，不通过不许打勾；
4. **安全围栏**（权限与隔离）：它只能在自己的沙盒里干活，碰不到生产密钥，改坏了能一键回滚；
5. **交接制度**（会话仪式）：每次上班先花 3 分钟读"上次干到哪"，再继续干。

只要这五样齐了，同一个模型的表现会有**量级**差异——这就是"Harness 工程"，也是本文档要帮你搭建的全部内容。

> 一句话总结：**AI 写代码的质量上限由模型决定，质量下限由 Harness 决定；长任务能不能做成，几乎完全取决于 Harness。**

## 1.4 关键术语表（小白版）

| 术语 | 意思 | 类比 |
|---|---|---|
| 上下文（Context） | 模型单次工作时能"看到"的全部内容 | 工程师的桌面，只有一张桌子大 |
| Token | 模型计量的文本单位 | 桌面面积的度量 |
| Context Rot / 上下文腐烂 | 塞得越满、越杂，模型表现越差 | 桌上堆满杂物后干活变慢 |
| AGENTS.md | 给 Agent 看的仓库说明文件（事实标准） | 新员工入职第一页的"地图" |
| MCP | 模型连接外部工具的通用协议（浏览器、数据库……） | 工程师的"工具插座"标准 |
| Hook / 钩子 | 在 Agent 每次保存/提交后自动触发检查的机制 | 保存即编译的编辑器 |
| 沙箱（Sandbox） | 隔离的执行环境（容器/虚拟机），坏了就扔 | 一次性手套/工位隔离间 |
| Worktree | 同一仓库同时检出多份，互不干扰 | 每个任务一张独立桌子 |
| E2E 测试（端到端） | 从真实入口（如浏览器/串口）验证整条链路 | 验收员实际用一遍产品 |
| 生成器-评估器 | 一个 Agent 干活，另一个 Agent 按标准打分 | 作者与审稿人 |
| Compaction | 把长对话压缩成摘要继续干 | 给工程师做记忆摘除手术 |
| Ralph 循环 | Agent 自驱"干活→自检→修→再干"直到完成 | 定了闹钟的自我迭代 |
| GC Agent（垃圾回收） | 周期性跑的 Agent，专找坏模式/文档腐烂并修复 | 每周保洁阿姨 |
| HIL（硬件在环） | 真实硬件板子接入自动验证流程 | 汽车下线前的真车检测线 |

---

# 第二部分 总体方案：一套骨架 + 领域适配器

## 2.1 核心设计思想

**问题**：开发领域五花八门（后端、前端、桌面、移动、游戏、嵌入式……），每个领域的"构建、运行、验证"完全不同，怎么用一套方案支持全部？

**答案**（本方案的核心公式）：

```
完整 Harness = 通用核心（80%，所有领域一模一样）
             + 领域适配器（20%，每个领域回答固定的 5 个问题）
```

- 通用核心解决"失忆、迷路、熵增"——与领域无关，做一次全体复用；
- 领域适配器解决"无据"（怎么自动判定做对了）——每个领域填一张固定的**适配卡**。

## 2.2 通用核心：五大子系统与标准仓库结构

标准仓库结构（所有领域通用，只增不改）：

```
repo/
├── AGENTS.md               # ① 知识库入口：≤100行地图，指向下层文档
├── docs/
│   ├── architecture.md     # 分层规则 + 依赖方向（Agent 必须遵守的铁律）
│   ├── quality.md          # 质量评分与已知差距
│   ├── decisions/          # 决策日志（为什么这么设计）
│   └── plans/              # 执行计划（active/ 进行中，done/ 归档）
├── tasks/
│   ├── feature-list.json   # ② 任务看板：特性清单，验收标准=可执行命令
│   └── progress.md         # ② 进度文件：上次做了什么/卡点/下一步
├── scripts/                # ③④ 适配器落点：四个标准脚本 + 工具脚本
│   ├── build.sh            #   一键构建
│   ├── run.sh              #   一键运行（可无头则无头）
│   ├── verify.sh           #   一键验证（0/非0 退出码，机器可判定）
│   ├── observe.sh          #   一键观测（日志/截图/串口…）
│   ├── smoke.sh            #   冒烟：服务/设备是否健康
│   └── screenshot.sh 等    #   领域专属工具
├── .claude/ 或等价目录      # ⑤ skills、hooks（提交后自动 lint/test）
├── src/ …                  # 按约定分层
└── tests/ …                # 单测 + 结构性测试 + e2e
```

五大子系统与它解决的问题：

| 子系统 | 组成 | 解决 |
|---|---|---|
| ① 知识库 | AGENTS.md（目录）+ docs/（正文）+ CI 校验文档新鲜度 | 迷路（AI 不懂规矩） |
| ② 任务与进度 | feature-list.json + progress.md + git commit 纪律 | 失忆、迷路 |
| ③ 验证回路 | 四个标准脚本 + hook 自动触发 + 评分标准 | 无据（质量无保障） |
| ④ 环境与工具 | 沙箱/容器、四个脚本所依赖的工具链、浏览器/仿真器等 | 无据（AI 无法动手） |
| ⑤ 安全围栏 | 凭据 vault + 代理、分支保护、人工合并门禁 | 安全与不可逆风险 |

## 2.3 领域适配器：每个领域只需回答 5 个问题

接入任何新领域 = 填一张**适配卡**。五个问题是固定的：

| # | 问题 | 落点 | 质量要求 |
|---|---|---|---|
| Q1 | **怎么构建？**（build） | `scripts/build.sh` | 一次命令，零交互，报错信息可读（报错即修复指令） |
| Q2 | **怎么运行？**（run） | `scripts/run.sh` | 能无头/自动化启动；依赖的服务一并拉起 |
| Q3 | **怎么自动判定做对了？**（verify） | `scripts/verify.sh` | **最重要**。必须是机器可判定的 0/非 0；"看起来对"不算对 |
| Q4 | **怎么看见它？**（observe） | `scripts/observe.sh` | 给 Agent 的"眼睛和耳朵"：日志、截图、串口、波形 |
| Q5 | **环境怎么隔离与复原？**（sandbox） | 容器/VM/模拟器快照/设备锁 | 每个任务独立环境，坏了即焚、秒级重建 |

> **这一张卡就是"支持全部领域"的秘密**：通用核心写一次，新领域只需要工程师花 1-3 天填卡、写脚本、调传感器。附录 A 给出空白卡模板。

## 2.4 验证难度分级：决定接入顺序

所有开发领域按"自动验证的难度"分为四级（**这同时就是接入顺序**——从易到难，每级沉淀的经验直接复用到下一级）：

| 级别 | 特征 | 领域 | 验证手段核心 |
|---|---|---|---|
| **T1 纯逻辑** | 无界面、无硬件，主机上直接判定 | 后端/服务化、CLI 脚本、数据工程、数据库、算法/科学计算、IaC/DevOps、AI·ML·LLM 应用、技术文档 | 测试套件 + 断言 + 契约校验 |
| **T2 有界面** | 需要让 Agent "看见"界面 | Web 前端、桌面应用、移动应用、浏览器扩展、游戏 | 模拟器/无头渲染 + 截图 + 控件树断言 |
| **T3 重运行时** | 依赖底层系统行为 | 操作系统/内核模块、编译器/DSL、数据库引擎、网络协议栈 | VM/QEMU + sanitizer + fuzzing |
| **T4 有硬件** | 涉及物理世界 | 嵌入式（MCU/RTOS/嵌入式 Linux/驱动）、FPGA/RTL、IoT 整机 | **三级验证金字塔**：主机单测 → 板级仿真 → 硬件在环 |

## 2.5 长任务运行 SOP（人机协作流程，所有领域通用）

```
阶段0 初始化（一次性）
  init.sh 搭脚手架 → 与人一起把需求写成 feature-list.json（验收标准=可执行命令）
  → 跑通一次冒烟 → 首次 commit

阶段1 每个会话开工仪式（3分钟）
  pwd → git log -20 → 读 progress.md → 读 feature-list.json
  → 跑 smoke.sh 确认环境健康 → 开始干活

阶段2 单特性主循环（核心节拍）
  选 1 个特性（不并行）→ 有歧义先提问 → 实现
  → verify.sh 通过才算完成 → 勾选清单 + 更新 progress.md → 描述性 commit

阶段3 恢复与求助
  上下文满了/崩了 → 新会话走开工仪式续命
  卡死 30 分钟 → 写清卡点入 progress.md → 跳过或升级给人，不死磕

人的角色
  定优先级、定验收标准、把关不可逆动作（发布/上真机/apply）
  每次 Agent 犯错 → 把教训回灌进文档/工具/lint（而不是口头纠正）
```

---

# 第三部分 全领域适配手册

## 3.0 适配总表（速查矩阵）

| 领域 | 级别 | 构建 | 运行 | 自动验证（传感器） | 观测 | 隔离 |
|---|---|---|---|---|---|---|
| 后端/服务化 | T1 | 包管理构建 | 本地/compose 起服务 | 单测+契约测试+集成测试 | 结构化日志+指标 | 容器+临时依赖 |
| CLI/脚本 | T1 | 编译或直跑 | 命令行 | golden file+property 测试 | stdout | 容器 |
| 数据工程/数据库 | T1 | — | 小样本管道跑通 | 行数/校验和对账+迁移测试 | 数据质量报告 | 临时 DB 容器 |
| 算法/科学计算 | T1 | 编译 | 函数调用 | 数值断言+property+性能预算 | 基准报告 | 容器 |
| IaC/DevOps | T1 | fmt/validate | plan/kind 集群 | 策略检查+部署冒烟 | plan diff | 隔离账号/本地集群 |
| AI/ML/LLM 应用 | T1 | — | 小样本训练/调用 | 评测集阈值+evals | 指标/token 成本 | 容器(可选 GPU) |
| 技术文档 | T1 | — | — | 链接/一致性 lint | — | — |
| Web 前端 | T2 | dev server/build | 无头浏览器 | Playwright e2e+视觉回归 | 截图+DOM+console | 无头浏览器容器 |
| 桌面应用 | T2 | 构建+打包 | Xvfb/真窗口 | 控件树断言+截图比对 | 截图+应用日志 | Xvfb/VM |
| 移动应用 | T2 | gradle/xcodebuild | 模拟器 | Espresso/XCUITest/Maestro | 截图+logcat | 模拟器（KVM/macOS） |
| 浏览器扩展 | T2 | 打包 | 带扩展的浏览器 | Playwright 加载扩展测试 | 截图+后台页 console | 无头浏览器 |
| 游戏 | T2 | 引擎构建 | 无头/实机运行 | PlayMode 测试+输入回放+性能预算 | 帧率+截图+watchdog | 无头渲染容器 |
| 系统/内核/协议 | T3 | 本地/交叉编译 | VM/QEMU | sanitizer+fuzzing+一致性测试 | strace/gdb/串口 | VM/QEMU |
| 数据库引擎 | T3 | 编译 | 实例 | SQL 逻辑测试+崩溃恢复测试 | 性能计数器 | 容器/VM |
| 嵌入式 MCU | T4 | 交叉编译 | 仿真器/真板 | **三级金字塔**（见 3.4） | 串口/RTT/波形 | 工具链容器+仿真+设备锁 |
| 嵌入式 Linux | T4 | Yocto/Buildroot | QEMU/开发板 | 单测+启动/驱动测试+HIL | 串口控制台 | 容器+QEMU+真板 |
| FPGA/RTL | T4 | 综合（Verilator/Yosys） | 仿真 | 仿真断言+lint+形式化+上板 | 波形 VCD | 容器+仿真器+板卡 |

## 3.1 T1 纯逻辑类（最容易，建议全部先行接入）

### 3.1.1 后端/服务化（API、微服务、定时任务、中间件）

- **构建**：语言标准工具（Maven/Gradle、go build、pip/uv、cargo）。
- **运行**：`docker compose up` 一次拉起应用+数据库+消息队列；或 testcontainers 按 PR 起临时真依赖。
- **验证（传感器）**：
  - 契约优先：OpenAPI/protobuf schema 校验，前后端契约测试防漂移；
  - 三层测试：单元 → 集成（真 DB/真 MQ）→ 端到端（起服务后 curl/HTTP 客户端断言）；
  - 性能预算：关键接口 P99 延迟阈值写进 verify。
- **观测**：强制结构化日志（Agent 用 grep 查询极准）；`/metrics` 端点；错误堆栈完整输出。
- **隔离**：每任务独立 compose 项目名 + 临时卷；端口范围分配表避免冲突。
- **坑**：临时端口/数据卷冲突是最常见的"玄学失败"——在 run.sh 里统一管理端口与清理。

### 3.1.2 CLI 工具与脚本

- **验证**：golden file 测试（固定输入断言输出快照）；property-based 测试（Hypothesis / fast-check / fscheck）自动生成用例；shellcheck/shellfmt 挂 hook。
- **观测**：stdout 即一切；复杂 CLI 提供 `--json` 输出模式供 Agent 判定。

### 3.1.3 数据工程 / 数据库

- **验证**：每个 PR 用临时数据库跑迁移 **up/down 幂等测试**；数据管道用"输入快照 → 输出 golden 对比"；对账传感器（行数/checksum/抽样断言）；schema 变更 diff 审查；大表查询走 explain + 行数阈值。
- **观测**：数据质量报告（空值率、分布漂移）作为 verify 的一部分。

### 3.1.4 算法 / 科学计算

- **验证**：数值断言（参考实现/解析解对拍，浮点容差显式声明）；property 测试；性能预算（criterion/pytest-benchmark，超阈值即失败）。
- **坑**：要求 Agent 在 verify 中**固定随机种子**，否则结果不可复现。

### 3.1.5 DevOps / IaC / 云基础设施

- **验证**：`terraform fmt/validate/plan`（解析 plan JSON 判定增删改是否超预期）；OPA/conftest 策略检查（禁 0.0.0.0/0、必打标签等）；K8s 用 kind/k3d 本地集群 + helm lint/template + kubeconform + 部署冒烟探活。
- **⚠️ 安全红线**：`apply`、`kubectl apply --context=prod`、删除资源属于**外向不可逆动作**，永远人工批准——写进 AGENTS.md 铁律，不靠模型自觉。

### 3.1.6 AI / ML / LLM 应用

- **验证**（这是 AI 领域的 verify.sh，思路与本文档完全同构）：
  - 训练类：小数据集过拟合冒烟（loss 应趋于 0）；固定种子可复现；评测集+指标阈值（掉了即失败）；
  - LLM 应用类：golden 问答集 + 评分器（promptfoo/deepeval/自建 evals）；轨迹评测（Agent 走的步骤对不对）；成本/延迟预算。
- **观测**：token 用量、延迟、失败率当指标看。
- **隔离**：API key 走代理（见 2.2⑤），沙箱内无明文密钥。

### 3.1.7 技术文档

最容易的试点领域：链接检查、术语一致性 lint、示例代码可运行性测试就是 verify.sh。适合作为团队第一个"一周见效"的练手项目。

## 3.2 T2 有界面类（核心：给 Agent 一双"眼睛"）

**通用原则**：
1. **DOM/控件树优先于像素截图**（省 token、可精确断言），截图用于"好看/布局"判断与视觉回归；
2. **状态注入**：应用提供测试钩子（deep link、启动参数、固定种子数据），让 Agent 直接进入目标状态，不用盲点 20 步；
3. **console error 监听即失败**：任何控制台报错直接判 verify 失败；
4. 视觉回归：golden 截图 + 容差对比，UI 改动需显式更新基线。

### 3.2.1 Web 前端

- 运行：dev server；验证：Playwright e2e 三层（组件 → 页面 → 关键旅程）；无头浏览器跑在容器里。
- 观测：DOM 快照、逐页截图、console/网络错误。

### 3.2.2 桌面应用

| 技术栈 | 验证方案 |
|---|---|
| Electron | Playwright `_electron.launch`（DOM 断言+截图，方案最成熟） |
| Tauri | tauri-driver（WebDriver 协议） |
| Qt (Widgets/QML) | Qt Test / QML Test 单测；GUI 级用 Squish（商业）或 Linux AT-SPI（pyatspi/dogtail）；截图比对 |
| WPF/WinForms (Windows) | FlaUI / WinAppDriver（需 Windows runner） |
| GTK (Linux) | AT-SPI 辅助功能树 |
| 跨平台 (Flutter desktop 等) | flutter integration_test + 截图 |

- **运行**：Linux 上用 Xvfb 虚拟显示实现"无头跑 GUI"；Windows 可用独立 VM。
- **打包验证**：verify 最后一步把产出的安装包（MSI/deb/AppImage）装进干净环境启动冒烟——"能装、能开"也是验收标准。

### 3.2.3 移动应用

- **Android**：Gradle Managed Devices / Emulator（CI 机器需 KVM 硬件加速）；Espresso（代码级 UI 测试）+ **Maestro**（YAML 写流程，对 Agent 极友好）；观测：`adb exec-out screencap` 截图 + logcat。
- **iOS**：必须 macOS runner；xcodebuild test + XCUITest；模拟器截图。
- **跨平台**：Flutter integration_test、RN 用 Detox/Maestro。
- **坑**：模拟器冷启动慢——用快照/预热情境，把"起模拟器"放 run.sh 固定化。

### 3.2.4 浏览器扩展

- Playwright 以 `--load-extension` 启动持久化上下文，分别验证 popup / options 页 / content script；MV3 service worker 的 console 日志纳入断言。

### 3.2.5 游戏开发

- **测试框架**：Unity Test Framework（EditMode 测逻辑、PlayMode 测集成）、Godot：GUT + `--headless`、Unreal：Automation Framework。
- **传感器组合**：
  - **输入回放**：录制固定输入序列回放，断言角色状态/关卡事件且不崩溃——这是游戏版 e2e；
  - golden 截图（带容差）验证渲染不回归；
  - **性能预算**：帧率/帧时间/加载时长超阈值即失败；
  - watchdog：检测卡死/黑屏。
- **主观维度**："好不好玩"交给生成器-评估器评分 + 真人抽样试玩，别试图完全自动化。

## 3.3 T3 重运行时类

- **系统软件/内核模块/驱动**：sanitizer 全家桶（ASan/TSan/UBSan）+ valgrind 挂 CI；fuzzing（AFL++/libFuzzer，可接 OSS-Fuzz）；内核模块在 QEMU + initramfs 里冒烟（9p 共享源码目录免重打包）；观测：串口控制台 + gdb remote。
- **编译器/DSL**：对拍测试（与参考实现差分）、语料库回归、自举测试；fuzz 变异源码。
- **数据库引擎**：SQL 逻辑测试套件 + 崩溃恢复测试（kill -9 后重启断言一致性）+ 性能计数器预算。
- **网络协议栈**：scapy/packetdrill 做一致性测试；抓包 golden 对比；混沌注入（丢包/乱序/延迟）作为 verify 的可选档位。

## 3.4 T4 硬件类（重点：嵌入式）⭐

### 3.4.1 嵌入式 Harness 的总纲：三级验证金字塔

嵌入式最难的地方在于：**不是每行代码都能（或应该）上真板验证**。解法是分层：

```
        ┌──────────────────────┐
        │  L3 硬件在环 (HIL)     │  真板+真外设：烧录、上电复位、串口断言
        │  少量关键路径，贵而慢    │  （发布门禁）
        ├──────────────────────┤
        │  L2 板级仿真           │  QEMU / Renode / Wokwi：固件真跑在
        │  大部分集成逻辑，快而稳   │  仿真板上，串口输出可断言
        ├──────────────────────┤
        │  L1 主机单元测试        │  业务逻辑与硬件解耦后，在 PC 上秒级跑
        │  每次修改必跑（Agent 主战场）│ （Ceedling/Unity、GoogleTest+FFF）
        └──────────────────────┘
```

**L1 的前提是一个架构铁律：业务逻辑与硬件访问解耦。** 通过 HAL 接口 + mock/fake 隔离寄存器与外设，让 80% 的逻辑（状态机、协议解析、控制算法）在 PC 上测试。这条要写进 `docs/architecture.md` 并用检查脚本强制（例如：业务模块禁止直接 include 芯片寄存器头文件）。

### 3.4.2 各层落地要点

**L1 主机单测（Agent 主战场）**
- 工具：Ceedling/Unity/CMock（C 生态标准）、GoogleTest + FFF（fake function framework）、CppUTest。
- build.sh 就是"PC 编译+跑单测"，秒级反馈，Agent 每次修改自动跑。

**L2 板级仿真**
- **QEMU**（qemu-system-arm 等）：官方板卡模型，固件可真跑；适合启动流程、驱动框架、RTOS 移植验证。
- **Renode**：专为 IoT 设计，可仿真多板互联 + 传感器/外设模型，支持 Robot Framework 集成测试——多节点 IoT 的首选。
- **Wokwi**：ESP32/树莓派 Pico 等有官方 CLI，CI 友好。
- **pytest-embedded**（ESP-IDF 官方）：统一的"构建→烧录→串口断言"测试框架模式，其他平台可借鉴其结构。
- 断言手段：串口输出正则匹配（"BOOT OK"）、仿真器状态查询、固件内存/符号分析。

**L3 硬件在环（HIL）**
- 烧录：OpenOCD / pyOCD / J-Link 脚本化；
- **上电复位用 USB 继电器**（解决"板子死了只能人去拔线"的运维黑洞）；
- 观测：串口日志采集断言、SEGGER RTT、必要时逻辑分析仪/示波器采样作为产物附件；
- **设备锁**：真板是共享资源，任务领取时加锁，防止两个 Agent 同时烧一块板；
- 多板农场进阶：USB hub + 继电器阵列 + 标签化设备管理。

**静态传感器（嵌入式特色，权重极高）**
- MISRA-C / CERT-C 规则集、cppcheck、clang-tidy；`-Werror` 编译；
- **固件体积预算**（size 超限即失败）、栈使用深度静态分析——嵌入式资源是硬约束，必须做成传感器。

### 3.4.3 嵌入式知识库的特殊要求（Agent 的"芯片手册替身"）

Agent 没法读芯片，也没法做实验——**文档必须替它做这两件事**：
- `docs/hardware/` 收录：芯片 Datasheet/参考手册**要点摘录**（寄存器表、时序约束）、板卡硬件版本差异矩阵、引脚分配表、Flash/内存布局图；
- **铁律**：寄存器级代码必须引用 docs 出处；没有出处的"合理猜测"直接 verify 拒绝（这是嵌入式最容易翻车的点——Agent 会自信地编造寄存器行为）。

### 3.4.4 嵌入式各细分场景

| 场景 | 构建 | L2 仿真 | L3 真机 | 特殊传感器 |
|---|---|---|---|---|
| MCU 裸机/RTOS（STM32/ESP32/Zephyr/FreeRTOS） | arm-none-eabi-gcc / idf.py / west build | QEMU、Renode、Wokwi | OpenOCD/J-Link + 继电器复位 | 固件体积、栈深、功耗采样 |
| 嵌入式 Linux（Yocto/Buildroot） | bitbake（大磁盘容器） | QEMU 跑根文件系统 | 开发板 + 串口控制台 | 启动时间预算、根文件系统 diff |
| 内核/驱动 | 交叉编译 | QEMU + initramfs 冒烟 | 目标机 | 崩溃日志（oops/panic）检测 |
| FPGA/RTL (Verilog/VHDL) | Verilator/Yosys 综合 | 仿真波形断言 + lint + 形式化验证 | 上板比特流加载 | 波形（VCD）golden 对比 |
| IoT 整机（端云联调） | 固件+云两端 | Renode 多节点 + 本地云栈 | 真机+生产云灰度 | 端到端消息对账 |

> 更外围的电路/PCB 设计（KiCad 等）也能纳入同一框架：`kicad-cli` 的 ERC/DRC 检查就是现成的 verify.sh，但属于低优先级扩展。

---

# 第四部分 分阶段实施路线图

> 原则：**从 T1 试点到全领域铺开，每级经验复用**。不建议一上来就啃嵌入式或全平台。

## Phase 0 · 认知对齐与首个试点（第 1-2 周）

- 选 1 个 **T1 项目**（首选：内部工具/CLI/小服务，或技术文档库练手）；
- 1 名"Harness 工程师"（可兼职）+ 1 名业务工程师；
- 验收标准：
  - [ ] 仓库具备 2.2 全部要素（AGENTS.md、tasks/、scripts/ 四脚本）；
  - [ ] 跑通"单特性主循环"至少 10 次；
  - [ ] 记录 5 个以上"Agent 挣扎点"并各回灌一次（改文档/加脚本）。

## Phase 1 · 通用核心模板化（第 3-6 周）

- 把 Phase 0 的仓库抽成 **repo-template**（含 AGENTS.md 骨架、四脚本框架、hook 配置、CI）；
- 加第二个领域（建议 Web 前端，T2 门槛最低）验证"通用核心 + 适配卡"公式；
- 建立每周 30 分钟 **Harness 例会**：过一遍本周挣扎点 → 回灌；
- 验收标准：
  - [ ] 新项目从模板到跑通首次主循环 < 半天；
  - [ ] 前端适配卡完成（Playwright + 截图 + console 监听）。

## Phase 2 · 按业务线补齐适配器（第 2-3 月）

按团队业务优先级逐个建设，每条业务线指定 1 名 Agent Coach（负责该领域适配卡与知识库）：

- [ ] 后端/服务化（compose 栈 + 契约测试）；
- [ ] 桌面（对应技术栈按 3.2.2 选型）；
- [ ] **嵌入式 L1+L2**（先主机单测 + QEMU/Renode，HIL 后置到 Phase 3）；
- [ ] 移动（Android 先行，iOS 视 macOS runner 资源）。

## Phase 3 · 平台化与治理（第 4-6 月）

- [ ] 质量评分体系（docs/quality.md）：Evaluator Agent 按书面标准给产物打分；
- [ ] **GC Agent 定时任务**：扫描文档腐烂、坏模式、架构违规，开小步修复 PR；
- [ ] 嵌入式 L3 设备农场（继电器复位 + 设备锁）；
- [ ] **Harness 减法审计**：模型升级后删掉过时脚手架；
- [ ] 质量看板：各项目 verify 通过率、评分趋势、slop 指标。

## Phase 4 · 规模化（长期）

- [ ] Managed-agent 抽象（brain/hands/session 解耦，wake/getSession 恢复任意会话）；
- [ ] Agent 互审（agent-to-agent review）+ 人审抽样；合并门禁自动化分级；
- [ ] 多 Agent 编排：规划-生成-评估流水线跑数周级长任务。

---

# 第五部分 环境底座：标准镜像矩阵与 Runner 要求

| 镜像/Runner | 服务领域 | 关键内容 | 特殊硬件要求 |
|---|---|---|---|
| base-agent | 通用 | git、bash、jq、python/uv、node、文本三件套 | 无 |
| web | 前端/扩展 | node LTS + Playwright + 无头 Chromium | 无 |
| backend | 服务端 | JVM/Go/Python + Docker + 临时 PG/Redis | 无（或 DinD） |
| desktop-linux | 桌面 | Qt/GTK + **Xvfb** + AT-SPI | 无 |
| desktop-windows | WPF 等 | Windows + FlaUI/WinAppDriver | Windows 机器 |
| mobile-android | Android | JDK + Android SDK + Emulator + Maestro | **KVM 硬件加速** |
| mobile-ios | iOS | macOS + Xcode + 模拟器 | **必须 macOS** |
| embedded-mcu | MCU/RTOS | arm-none-eabi-gcc、cmake、Ceedling、OpenOCD/pyOCD、QEMU、Renode | L3 需物理机+USB 透传+继电器 |
| embedded-linux | Yocto 等 | bitbake 容器（大磁盘 200G+）、QEMU、串口透传 | 同上 |
| fpga | RTL | Verilator/iverilog/Yosys（商业工具另配 license runner） | L3 上板需专用机 |
| ml | AI/ML | 常见框架 + CUDA 运行时 | GPU（可选） |

**Runner 规划要点**：Android 模拟器与多数嵌入式仿真需要嵌套虚拟化（Linux KVM / macOS HVF），选机器时确认；HIL 设备农场是唯一必须接物理硬件的部分，放到 Phase 3 再投入。

---

# 第六部分 治理与演进（让系统活过半年）

1. **Harness 工程师**（新角色，可兼职起步）：维护通用模板、镜像矩阵、跨团队经验回灌。
2. **每周回灌例会**（30 分钟）：各业务线过一遍"本周 Agent 挣扎点"→ 当场决定：改文档？加脚本？加 lint？——**挣扎是环境缺陷的信号，不是重试的信号**。
3. **评分与看板**：docs/quality.md 记录各领域质量评分；GC Agent 维持新鲜度。
4. **减法审计**（模型每次大升级后）：Harness 每条规则都是"模型做不到某事"的假设，过时就删。**Harness 是资产，但只保留最小而足够的部分。**
5. **安全不变量**（永不放宽）：凭据入 vault + 代理，沙箱无密钥；发布/上真机/apply 等不可逆动作永远人工批准；受保护分支 + 人审合并门禁。

---

# 第七部分 FAQ（零基础常见疑虑）

**Q1：我完全没接触过，第一步做什么？**
一台电脑 + 一个 agentic CLI 工具（Claude Code / Codex CLI / Cursor agent 任一）+ 一个 T1 试点项目。按 2.2 建仓库结构，按 2.5 跑主循环。**一天足以跑通第一次。**

**Q2：AI 生成的代码质量能信吗？**
不信代码，信验证。所有"完成"必须由 verify.sh 判定（e2e 级），主观维度靠 Evaluator 评分，人只抽查关键路径。质量下限由 Harness 兜底，这正是本方案的全部意义。

**Q3：会不会把现有项目改坏？**
worktree 隔离（每个任务一份独立检出）+ 每步 commit（随时回滚）+ 受保护分支 + 人工合并门禁。最坏情况：丢弃那个 worktree，零损失。

**Q4：密钥和数据安全怎么办？**
凭据进 vault，Agent 通过鉴权代理使用能力而拿不到明文密钥；外向动作（发布、发消息、apply）永远人工批准；沙箱按任务即焚。

**Q5：需要多大投入？**
起步：1 名兼职 Harness 工程师 + 1 条业务线即可（Phase 0-1）。铺开期每条业务线 +0.5 人力做适配卡维护。设备农场等重资产放到 Phase 3。

**Q6：和现有 CI/CD 是什么关系？**
verify 层就是 CI。Harness 的本质变化是：验证从"人触发、合并前跑"变成"Agent 自触发、每步都跑"，CI 门禁一条不少。

**Q7：换个模型/换工具，方案要重写吗？**
不用。通用核心与领域适配器都是模型无关的（文件、脚本、git）；模型升级只意味着"可以做减法审计，删掉过时脚手架"。

---

# 附录

## A. 领域适配卡

空白适配卡模板已迁移至 [`docs/adapters/adapter-card-template.md`](../adapters/adapter-card-template.md)；各领域适配卡将随 Phase 2 在该目录下逐个建立。

## B. 仓库模板文件清单

可复制的正式模板位于 [`docs/templates/`](../templates/)：AGENTS.md、feature-list.json、progress.md、main-loop-prompt.md（Phase 1 将补充 build/run/verify/observe/smoke 五个脚本骨架）。

## C. 术语速查

见第一部分 1.4 术语表。

## 参考资料

完整来源与逐篇要点见调研篇《[harness-best-practices.zh.md](../research/harness-best-practices.zh.md)》。主要来源：Anthropic（长任务 harness ×2、Managed Agents）、OpenAI（Harness engineering）、LangChain（Anatomy of an Agent Harness）、Martin Fowler/Thoughtworks（Harness engineering memo）、Mitchell Hashimoto（My AI adoption journey）。
