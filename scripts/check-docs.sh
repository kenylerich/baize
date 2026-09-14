#!/usr/bin/env bash
# 文档体检脚本（文档门禁）：链接有效性 / 双语配对 / 翻译新鲜度 / 状态行 / 指纹清单
# 语言约定：默认文件名（*.md）= 英文权威版；*.zh.md = 中文翻译
# 用法：bash scripts/check-docs.sh   （本地运行，或在 CI 中作为合并门禁）
# 退出码：0=通过；1=有错误（提醒不阻塞）
set -uo pipefail
cd "$(dirname "$0")/.." || exit 1
errors=0

echo "== [1/5] 链接有效性 =="
for f in $(find . -name '*.md' -not -path './.git/*'); do
  dir=$(dirname "$f")
  for l in $(grep -oE '\]\([^)#]+\)' "$f" 2>/dev/null | sed -E 's/^\]\(|\)$//g'); do
    case "$l" in http*|mailto:*|'#'*) continue ;; esac
    if [ ! -e "$dir/$l" ]; then
      echo "  [死链] $f -> $l"
      errors=$((errors+1))
    fi
  done
done

echo "== [2/5] 双语配对（登记在案的权威文档必须有中文翻译 *.zh.md）=="
AUTH=(
  "README.md"
  "docs/README.md"
  "docs/research/harness-best-practices.md"
  "docs/solution/vibe-coding-harness-plan.md"
  "docs/solution/quality-gates.md"
)
for a in "${AUTH[@]}"; do
  zh="${a%.md}.zh.md"
  if [ -f "$a" ] && [ ! -f "$zh" ]; then
    echo "  [缺中文翻译] $a"
    errors=$((errors+1))
  fi
done

echo "== [3/5] 翻译新鲜度（中文翻译不应落后英文权威版）=="
for pair in "README.md README.zh.md" \
            "docs/README.md docs/README.zh.md" \
            "docs/research/harness-best-practices.md docs/research/harness-best-practices.zh.md" \
            "docs/solution/vibe-coding-harness-plan.md docs/solution/vibe-coding-harness-plan.zh.md" \
            "docs/solution/quality-gates.md docs/solution/quality-gates.zh.md"; do
  set -- $pair; a=$1; zh=$2
  [ -f "$a" ] && [ -f "$zh" ] || continue
  ad=$(git log -1 --format=%ct -- "$a" 2>/dev/null || echo 0)
  zd=$(git log -1 --format=%ct -- "$zh" 2>/dev/null || echo 0)
  if [ "${ad:-0}" -gt "${zd:-0}" ]; then
    echo "  [落后提醒] $zh 落后于英文权威版（英文最后更新：$(date -d "@$ad" +%F 2>/dev/null || echo "$ad")）"
  fi
done

echo "== [4/5] 状态行（所有文档必须有 > status: 行）=="
for f in $(find . -name '*.md' -not -path './.git/*'); do
  if ! grep -q "status:" "$f"; then
    echo "  [缺状态行] $f"
    errors=$((errors+1))
  fi
done

echo "== [5/5] 文档指纹（MANIFEST.sha256）=="
if ! bash scripts/doc-fingerprint.sh verify; then
  errors=$((errors+1))
fi

echo "== 结果 =="
if [ "$errors" -gt 0 ]; then
  echo "未通过：$errors 个错误（提醒不阻塞合并，但请尽快处理）"
  exit 1
fi
echo "通过"
exit 0
