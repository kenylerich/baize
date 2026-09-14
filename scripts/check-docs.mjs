#!/usr/bin/env node
// 文档体检脚本（文档门禁）：链接有效性 / 双语配对 / 翻译新鲜度 / 状态行 / 指纹清单
// 语言约定：默认文件名（*.md）= 英文权威版；*.zh.md = 中文翻译
// 用法：node scripts/check-docs.mjs   （本地运行，或在 CI 中作为合并门禁）
// 退出码：0=通过；1=有错误（提醒不阻塞）
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { verifyManifest } from './doc-fingerprint.mjs';

export const AUTH_PAIRS = [
  'README.md',
  'docs/README.md',
  'docs/research/harness-best-practices.md',
  'docs/solution/vibe-coding-harness-plan.md',
  'docs/solution/quality-gates.md',
  'docs/decisions/README.md',
  'docs/decisions/20260914-infra-boundary-decisions.md',
  'docs/decisions/20260915-doc-lifecycle-and-bilingual.md',
  'docs/decisions/20260915-multi-platform-quality-gates.md',
  'docs/decisions/20260915-version-fingerprints.md',
  'docs/plans/README.md',
  'docs/plans/deferred-blueprints.md',
  'docs/plans/agile-gap-analysis.md',
  'docs/plans/roadmap.md',
  'docs/plans/translation-status.md',
  'docs/plans/sprints/README.md',
  'docs/plans/sprints/S2026-01.md',
  'docs/templates/README.md',
  'docs/templates/AGENTS.md',
  'docs/templates/progress.md',
  'docs/templates/main-loop-prompt.md',
  'docs/templates/architecture.md',
  'docs/templates/quality.md',
  'docs/templates/ci/README.md',
  'docs/adapters/README.md',
  'docs/adapters/adapter-card-template.md',
];

export const FRESHNESS_PAIRS = [
  ['README.md', 'README.zh.md'],
  ['docs/README.md', 'docs/README.zh.md'],
  ['docs/research/harness-best-practices.md', 'docs/research/harness-best-practices.zh.md'],
  ['docs/solution/vibe-coding-harness-plan.md', 'docs/solution/vibe-coding-harness-plan.zh.md'],
  ['docs/solution/quality-gates.md', 'docs/solution/quality-gates.zh.md'],
];

export function markdownFiles(root = process.cwd()) {
  const out = [];
  const walk = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (e.name === '.git' || e.name === 'node_modules') continue;
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith('.md')) out.push(path.relative(root, p).split(path.sep).join('/'));
    }
  };
  walk(root);
  return out.sort();
}

export function findDeadLinks(root = process.cwd()) {
  const dead = [];
  for (const rel of markdownFiles(root)) {
    const dir = path.dirname(path.join(root, rel));
    const text = fs.readFileSync(path.join(root, rel), 'utf8');
    for (const m of text.matchAll(/\]\(([^)#]+)\)/g)) {
      const target = m[1].trim();
      if (/^(https?:|mailto:|#)/.test(target)) continue;
      if (!fs.existsSync(path.resolve(dir, decodeURI(target)))) dead.push({ file: rel, target });
    }
  }
  return dead;
}

export function missingTranslations(root = process.cwd(), auth = AUTH_PAIRS) {
  return auth.filter(
    (a) => fs.existsSync(path.join(root, a)) && !fs.existsSync(path.join(root, a.replace(/\.md$/, '.zh.md')))
  );
}

export function findMissingStatus(root = process.cwd()) {
  return markdownFiles(root).filter((rel) => !fs.readFileSync(path.join(root, rel), 'utf8').includes('status:'));
}

// 中文翻译的内容级检查：*.zh.md 必须真的包含中文（防止"改名未翻译"的假翻译）。
// 返回 CJK 字符数低于 minCjk 的可疑文件。
export function suspectUntranslated(root = process.cwd(), minCjk = 10) {
  return markdownFiles(root)
    .filter((rel) => rel.endsWith('.zh.md'))
    .filter((rel) => {
      const cjk = fs.readFileSync(path.join(root, rel), 'utf8').match(/[\u4e00-\u9fff]/g);
      return !cjk || cjk.length < minCjk;
    });
}

function gitTime(file, root = process.cwd()) {
  try {
    return Number(execFileSync('git', ['log', '-1', '--format=%ct', '--', file], { cwd: root }).toString().trim());
  } catch {
    return 0;
  }
}

export function translationLag(root = process.cwd(), pairs = FRESHNESS_PAIRS) {
  return pairs.flatMap(([en, zh]) => {
    const enPath = path.join(root, en);
    const zhPath = path.join(root, zh);
    if (!fs.existsSync(enPath) || !fs.existsSync(zhPath)) return [];
    const enTime = gitTime(en, root);
    const zhTime = gitTime(zh, root);
    return enTime > zhTime
      ? [`  [落后提醒] ${zh} 落后于英文权威版（英文最后更新：${new Date(enTime * 1000).toISOString().slice(0, 10)}）`]
      : [];
  });
}

export function runAllChecks(root = process.cwd()) {
  const report = [];
  let errors = 0;

  report.push('== [1/5] 链接有效性 ==');
  for (const { file, target } of findDeadLinks(root)) {
    report.push(`  [死链] ${file} -> ${target}`);
    errors += 1;
  }

  report.push('== [2/5] 双语配对（登记在案的权威文档必须有中文翻译 *.zh.md）==');
  for (const a of missingTranslations(root)) {
    report.push(`  [缺中文翻译] ${a}`);
    errors += 1;
  }

  report.push('== [3/5] 翻译新鲜度（中文翻译不应落后英文权威版）==');
  for (const w of translationLag(root)) report.push(w);

  report.push('== [4/5] 状态行与中文内容检查（.zh.md 必须真的含中文）==');
  for (const f of findMissingStatus(root)) {
    report.push(`  [缺状态行] ${f}`);
    errors += 1;
  }
  for (const f of suspectUntranslated(root)) {
    report.push(`  [疑似未翻译] ${f}（.zh.md 内容不含中文）`);
    errors += 1;
  }

  report.push('== [5/5] 文档指纹（MANIFEST.sha256）==');
  const fp = verifyManifest(root);
  for (const l of fp.lines) report.push(l);
  if (!fp.ok) errors += 1;

  report.push('== 结果 ==');
  if (errors > 0) report.push(`未通过：${errors} 个错误（提醒不阻塞合并，但请尽快处理）`);
  else report.push('通过');
  return { errors, report };
}

function main() {
  const { errors, report } = runAllChecks(process.cwd());
  for (const line of report) console.log(line);
  if (errors > 0) process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
