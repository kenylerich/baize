# Gitea 评审门禁部署包（终极方案 B1，未启用）
> status: Active（生效）

> **什么时候打开本包**：出现"第二个提交主体"——来了第二个同事，或 Agent 提交量大到人肉把关不过来。
> 决策依据：`docs/decisions/20260914-infra-boundary-decisions.zh.md`（D3 门禁、D5 容灾）。
> 状态登记：`docs/plans/deferred-blueprints.zh.md` B1。

## 1. 部署（10 分钟）

```bash
docker compose up -d
# 浏览器打开 http://localhost:3000 完成初始化（数据库选内置 SQLite 即可）
```

团队场景：把这套 compose 放到**常开服务器/NAS** 上，同事用内网 IP 访问，本文件其余步骤不变。

## 2. 迁移现有仓库

```bash
git remote add gitea http://localhost:3000/<账号>/baize.git
git push gitea main
```

## 3. 启用评审门禁（四步）

1. 仓库 → 设置 → 分支 → 添加保护分支 `main`
2. 勾选：**禁用直接 push**、**要求至少 1 个 Approve**、**有驳回则阻止合并**
3. 启用状态检查，任务名填 `verify`（与第 4 节 workflow 一致）
4. 团队约定：所有改动走 PR；Agent 开的 PR 打 `agent` 标签，人按标签抽查

## 4. CI 门禁（Gitea Actions + act_runner）

首次配置：Gitea 管理后台（站点管理 → Actions → Runners）生成注册 token，填入 `docker-compose.yml` 中 `GITEA_RUNNER_REGISTRATION_TOKEN`，然后 `docker compose up -d act_runner`。

在业务仓库添加 `.gitea/workflows/verify.yml`（语法兼容 GitHub Actions，最小示例）：

```yaml
name: verify
on: [pull_request]
jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: ./scripts/verify.sh
```

## 5. 异地备份镜像（B2）

仓库 → 设置 → 推送镜像（Push Mirror）→ 添加目标 `https://github.com/kenylerich/baize.git`，凭据使用**细粒度 PAT**（仅此仓库、仅写权限）。Gitea 按周期自动同步全部提交到 GitHub——此后 GitHub 从"权威仓库"降级为"异地备份副本"。

## 6. 备份与恢复（B4，启用 Gitea 后需要）

- **备份**：定期拷贝 `./gitea-data` 目录；或整包导出：`docker exec gitea su git -c 'gitea dump'`
- **恢复**：解包到新的 gitea-data 卷 → `docker compose up -d`
- **原则**：git 提交本身已由第 5 节镜像备到 GitHub；本节备份的是 git 之外的东西——审批记录、issue、账号。
