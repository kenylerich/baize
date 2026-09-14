# 决策记录：指纹在版本管理中的应用（D11）
> status: Active（中文翻译版；权威版本为英文 [20260915-version-fingerprints.md](./20260915-version-fingerprints.md)）

- 日期：2026-09-15
- 状态：已接受
- 关联：D8（防篡改，20260915-doc-lifecycle-and-bilingual.md）、`scripts/doc-fingerprint.mjs`、`MANIFEST.sha256`、`.gitattributes`

## D11 每个版本由"集合指纹"唯一标识，并内嵌进标签

- **决定**：一个版本 = 通过 `doc-fingerprint.mjs tag <name>` 创建的附注 git 标签。脚本先校验清单与工作区一致，再把**集合指纹**（`MANIFEST.sha256` 的 SHA256 前 12 位）写入标签信息。配套命令：`id`（输出当前集合指纹）、`changes <ref>`（任意两版本间的文件级 新增/修改/删除 清单）、`verify-ref <ref>`（依据历史版本自带的清单复核其完整性）。
- **版本链**：`tag → commit → MANIFEST.sha256 → 单文件 SHA256`。每一层都可独立校验；集合指纹唯一标识整套文档的状态——两份拷贝若 12 位指纹相同，即可证明内容完全一致，且无需访问仓库。
- **理由**：commit 哈希标识的是提交而非人类可比对的内容状态；单文件指纹回答不了"整套文档是哪个版本"。清单衍生的集合指纹 + 标签内嵌值让版本自描述、可离线验证，并使版本变更清单可以机械生成（发布说明）。
- **前置修正**：指纹可移植要求所有机器上文件字节一致——已新增 `.gitattributes`（`* text=auto eol=lf`）强制检出为 LF；否则 Windows 的 CRLF 转换会破坏指纹复算。
- **否决的备选**：文档内手写版本号（D7 已否决）；只依赖 commit 哈希（不透明且比对需访问仓库）；在目录里保存每版本清单副本（双份真相）。
