# 领域适配卡：<领域名>
> status: Active（生效）

- 级别：T1/T2/T3/T4（判定标准见[实施篇 2.4](../solution/vibe-coding-harness-plan.zh.md)）

## Q1 构建 → scripts/build.sh

- 命令：…
- 成功判定：退出码 0
- 报错信息是否含修复指引：是/否（应为"是"）

## Q2 运行 → scripts/run.sh

- 方式：无头 / 模拟器 / 真机
- 依赖服务：…
- 就绪判定（smoke）：…

## Q3 验证 → scripts/verify.sh

- 分层：单元 / 集成 / e2e / 静态
- 关键断言：…
- 性能/体积预算：…

## Q4 观测 → scripts/observe.sh

- 眼睛（视觉证据）：截图 / DOM / 控件树 / 串口 / 波形
- 耳朵（日志证据）：日志位置与格式

## Q5 隔离

- 环境类型：容器 / VM / 模拟器 / 设备锁
- 复原方式与耗时：…
- 资源冲突点：…（端口/设备/共享文件）

## 领域铁律（同步写入目标仓库 docs/architecture.md）

- …

## 已知坑（持续补充）

- …
