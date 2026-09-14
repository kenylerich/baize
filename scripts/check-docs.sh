#!/usr/bin/env bash
# 文档体检脚本（文档门禁）：链接有效性 / 双语配对 / 翻译新鲜度 / 存量状态行
# 用法：bash scripts/check-docs.sh   （本地运行，或在 CI 中作为合并门禁）
# 退出码：0=通过；1=有错误（提醒不阻塞）
set -uo pipefail
cd "$(dirname "$0")/.." || exit 1
errors=0

echo "== [1/4] 链接有效性 =="
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

echo "== [2/4] 双语配对（登记在案的成对文档必须有 .en.md）=="
PAIRS=(
  "README.md"
  "docs/README.md"
  "docs/research/harness-best-practices.zh.md"
  "docs/solution/vibe-coding-harness-plan.zh.md"
)
for z in "${PAIRS[@]}"; do
  if [[ "$z" == *.zh.md ]]; then e="${z%.zh.md}.en.md"; else e="${z%.md}.en.md"; fi
  if [ -f "$z" ] && [ ! -f "$e" ]; then
    echo "  [缺英文版] $z"
    errors=$((errors+1))
  fi
done

echo "== [3/4] 翻译新鲜度（英文版不应落后中文权威版）=="
for pair in "README.md README.en.md" \
            "docs/README.md docs/README.en.md" \
            "docs/research/harness-best-practices.zh.md docs/research/harness-best-practices.en.md" \
            "docs/solution/vibe-coding-harness-plan.zh.md docs/solution/vibe-coding-harness-plan.en.md"; do
  set -- $pair; z=$1; e=$2
  [ -f "$z" ] && [ -f "$e" ] || continue
  zd=$(git log -1 --format=%ct -- "$z" 2>/dev/null || echo 0)
  ed=$(git log -1 --format=%ct -- "$e" 2>/dev/null || echo 0)
  if [ "${zd:-0}" -gt "${ed:-0}" ]; then
    echo "  [落后提醒] $e 落后于中文权威版（中文最后更新：$(date -d "@$zd" +%F 2>/dev/null || echo "$zd")）"
  fi
done

echo "== [4/4] 状态行（新文档必须有，存量逐步补）=="
for f in README.md docs/README.md docs/research/harness-best-practices.zh.md docs/solution/vibe-coding-harness-plan.zh.md; do
  [ -f "$f" ] && ! grep -q "status:" "$f" && echo "  [提醒] 缺 status 行: $f"
done

echo "== 结果 =="
if [ "$errors" -gt 0 ]; then
  echo "未通过：$errors 个错误（提醒不阻塞合并，但请尽快处理）"
  exit 1
fi
echo "通过"
exit 0
