#!/usr/bin/env bash
# 文档指纹机制：为全部受管文件生成 / 校验 SHA256 指纹清单（MANIFEST.sha256）
# 受管范围：所有 *.md + scripts/*.sh + .github/workflows/*.yml + infra/**/*.yml
# 用法：
#   bash scripts/doc-fingerprint.sh generate   # 文档/脚本变更后重新生成清单（与变更同一提交）
#   bash scripts/doc-fingerprint.sh verify     # 校验工作区与清单是否一致（体检/CI 自动调用）
set -uo pipefail
cd "$(dirname "$0")/.." || exit 1
MANIFEST="MANIFEST.sha256"

files() {
  {
    find . -name '*.md' -not -path './.git/*'
    find scripts .github infra -type f \( -name '*.sh' -o -name '*.yml' \) 2>/dev/null
  } | sed 's#^\./##' | LC_ALL=C sort
}

case "${1:-verify}" in
  generate)
    files | while read -r f; do sha256sum "$f"; done > "$MANIFEST.tmp"
    mv "$MANIFEST.tmp" "$MANIFEST"
    echo "清单已生成：$MANIFEST（$(wc -l < "$MANIFEST") 个文件）。请与本次文档变更放在同一提交里。"
    ;;
  verify)
    if [ ! -f "$MANIFEST" ]; then
      echo "  [错误] 清单不存在，先运行：bash scripts/doc-fingerprint.sh generate"
      exit 1
    fi
    if sha256sum -c "$MANIFEST" --quiet 2>/dev/null; then
      echo "  指纹校验通过（$(wc -l < "$MANIFEST") 个文件与清单一致）"
      exit 0
    fi
    echo "  [指纹不一致] 以下文件与清单不符（被修改但未重新生成清单，或被篡改）："
    sha256sum -c "$MANIFEST" 2>/dev/null | grep -v ': OK$' | sed 's/^/    /' || true
    comm -13 <(cut -d' ' -f3- "$MANIFEST" | LC_ALL=C sort) <(files) | sed 's/^/    [清单外新文件] /'
    exit 1
    ;;
  *)
    echo "用法：bash scripts/doc-fingerprint.sh generate|verify"
    exit 1
    ;;
esac
