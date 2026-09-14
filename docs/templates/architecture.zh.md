# 架构（模板）
> status: Active（生效；中文翻译版；权威版本为英文 [architecture.md](./architecture.md)）

> 用途：目标项目仓库的架构说明骨架。复制到目标仓库 docs/architecture.md 后按注释填写。
> 治理要求：本文件描述"铁律"，违反即 CI 失败；实现细节写进对应代码模块的文档，不写在这里。

## 分层

```
Types → Config → Repo → Service → Runtime → UI
```

- 每层的职责（一句话一层）：
  - Types：
  - Config：
  - Repo：
  - Service：
  - Runtime：
  - UI：

## 依赖规则（方向，违反即失败）

- 只允许上层依赖下层：
- 跨域关注点（auth/遥测/开关）唯一入口：
- 禁止事项（示例：UI 直接访问 Repo、业务代码 include 硬件寄存器头）：

## 铁律（逐条可被 linter/结构性测试强制）

1. 边界处必须显式解析数据形状
2. 结构化日志；禁止 YOLO 式数据探测
3. …

## 校验挂钩（本架构如何被校验）

- 结构性测试位置：
- 自定义 linter 规则：
- e2e 入口（verify.sh 调用）：
