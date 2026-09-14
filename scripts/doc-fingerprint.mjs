#!/usr/bin/env node
// 文档指纹机制（Node 版）：清单生成/校验 + 版本指纹 + 版本变更清单 + 历史版本复核 + 打版本标签
// 受管范围：所有 *.md + scripts 下的 *.mjs/*.sh + .github 与 infra 下的 *.yml/*.yaml + 根 package.json
// 版本模型：tag → commit → MANIFEST.sha256 → 单文件 SHA256（逐层可校验）
// 用法：
//   node scripts/doc-fingerprint.mjs generate          # 重新生成清单（与文件变更同一提交）
//   node scripts/doc-fingerprint.mjs verify            # 校验工作区与清单一致（体检/CI 自动调用）
//   node scripts/doc-fingerprint.mjs id                # 输出当前版本指纹（集合 SHA256 前 12 位）
//   node scripts/doc-fingerprint.mjs changes <ref>     # 对比任意版本(tag/commit)与当前的文件级变更
//   node scripts/doc-fingerprint.mjs verify-ref <ref>  # 复核任意历史版本的完整性
//   node scripts/doc-fingerprint.mjs tag <name>        # 校验通过后打内嵌版本指纹的附注标签
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export const MANIFEST = 'MANIFEST.sha256';
const sha256 = (buf) => createHash('sha256').update(buf).digest('hex');
const toPosix = (p) => p.split(path.sep).join('/');

export function listManagedFiles(root = process.cwd()) {
  const found = new Set();
  const walkAll = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (e.name === '.git' || e.name === 'node_modules') continue;
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walkAll(p);
      else if (e.name.endsWith('.md')) found.add(toPosix(path.relative(root, p)));
    }
  };
  walkAll(root);
  const extraExt = new Set(['.mjs', '.sh', '.yml', '.yaml']);
  const walkExtra = (dir) => {
    if (!fs.existsSync(dir)) return;
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walkExtra(p);
      else if (extraExt.has(path.extname(e.name))) found.add(toPosix(path.relative(root, p)));
    }
  };
  for (const d of ['scripts', '.github', 'infra']) walkExtra(path.join(root, d));
  if (fs.existsSync(path.join(root, 'package.json'))) found.add('package.json');
  return [...found].sort();
}

export function fileHashes(root = process.cwd()) {
  return listManagedFiles(root).map((rel) => ({ rel, hash: sha256(fs.readFileSync(path.join(root, rel))) }));
}

export function generate(root = process.cwd()) {
  const lines = fileHashes(root).map(({ rel, hash }) => `${hash}  ${rel}`);
  fs.writeFileSync(path.join(root, MANIFEST), lines.join('\n') + '\n');
  return { count: lines.length };
}

export function parseManifest(text) {
  return new Map(
    text
      .split('\n')
      .filter(Boolean)
      .map((line) => {
        const i = line.indexOf('  ');
        return [line.slice(i + 2), line.slice(0, i)];
      })
  );
}

export function verifyManifest(root = process.cwd()) {
  const mpath = path.join(root, MANIFEST);
  if (!fs.existsSync(mpath)) return { ok: false, lines: ['  [错误] 清单不存在，先运行 generate'] };
  const expected = parseManifest(fs.readFileSync(mpath, 'utf8'));
  const current = new Map(fileHashes(root).map(({ rel, hash }) => [rel, hash]));
  const problems = [];
  for (const [rel, hash] of expected) {
    const actual = current.get(rel);
    if (actual === undefined) problems.push(`    [清单文件缺失] ${rel}`);
    else if (actual !== hash) problems.push(`    [指纹不一致] ${rel}`);
    current.delete(rel);
  }
  for (const rel of current.keys()) problems.push(`    [清单外新文件] ${rel}`);
  return problems.length
    ? { ok: false, lines: problems }
    : { ok: true, lines: [`  指纹校验通过（${expected.size} 个文件与清单一致）`] };
}

export function setId(root = process.cwd()) {
  return sha256(fs.readFileSync(path.join(root, MANIFEST))).slice(0, 12);
}

export function changesFromManifests(oldText, root = process.cwd()) {
  const oldM = parseManifest(oldText);
  const newM = parseManifest(fileHashes(root).map(({ rel, hash }) => `${hash}  ${rel}`).join('\n'));
  const out = [];
  for (const [rel, hash] of newM) {
    if (!oldM.has(rel)) out.push(`  [新增] ${rel}`);
    else if (oldM.get(rel) !== hash) out.push(`  [修改] ${rel}`);
  }
  for (const rel of oldM.keys()) if (!newM.has(rel)) out.push(`  [删除] ${rel}`);
  return out;
}

const git = (args, root = process.cwd()) => execFileSync('git', args, { cwd: root, maxBuffer: 1 << 26 });
const tryGit = (args, root = process.cwd()) => {
  try { return git(args, root).toString().trim(); } catch { return null; }
};

export function gitManifest(ref, root = process.cwd()) {
  return git(['show', `${ref}:${MANIFEST}`], root).toString();
}

export function gitExtract(ref, destDir, root = process.cwd()) {
  const tar = git(['archive', ref], root);
  execFileSync('tar', ['-xf', '-', '-C', destDir], { input: tar });
}

export function verifyRef(ref, root = process.cwd()) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'fingerprint-'));
  try {
    gitExtract(ref, tmp, root);
    const r = verifyManifest(tmp);
    const head = `  版本 ${ref} ` + (r.ok ? '完整性复核通过（该版本全部文件与其清单一致）' : '存在与清单不一致的文件：');
    return { ok: r.ok, lines: [head, ...r.lines] };
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

function safe(fn, fallback) {
  try { return fn(); } catch { return fallback; }
}

function main() {
  const [cmd, arg] = process.argv.slice(2);
  const root = process.cwd();
  switch (cmd ?? 'verify') {
    case 'generate': {
      const { count } = generate(root);
      console.log(`清单已生成：${MANIFEST}（${count} 个文件）。请与本次文件变更放在同一提交里。`);
      break;
    }
    case 'verify': {
      const r = verifyManifest(root);
      for (const l of r.lines) console.log(l);
      if (!r.ok) process.exitCode = 1;
      break;
    }
    case 'id': {
      if (!fs.existsSync(path.join(root, MANIFEST))) { console.error('清单不存在，先 generate'); process.exitCode = 1; break; }
      console.log(`版本指纹(set-fingerprint): ${setId(root)}`);
      console.log(`受管文件数: ${parseManifest(fs.readFileSync(path.join(root, MANIFEST), 'utf8')).size}`);
      console.log(`当前提交: ${safe(() => tryGit(['rev-parse', '--short', 'HEAD'], root), '未提交')}`);
      console.log(`最近标签: ${safe(() => tryGit(['describe', '--tags', '--abbrev=0'], root), '无')}`);
      break;
    }
    case 'changes': {
      if (!arg) { console.error('用法: changes <ref>'); process.exitCode = 1; break; }
      console.log(`== 相对版本 ${arg} 的文件级变更 ==`);
      for (const l of changesFromManifests(gitManifest(arg, root), root)) console.log(l);
      break;
    }
    case 'verify-ref': {
      if (!arg) { console.error('用法: verify-ref <ref>'); process.exitCode = 1; break; }
      const r = verifyRef(arg, root);
      for (const l of r.lines) console.log(l);
      if (!r.ok) process.exitCode = 1;
      break;
    }
    case 'tag': {
      if (!arg) { console.error('用法: tag <name>（如 archive-2026-10）'); process.exitCode = 1; break; }
      const r = verifyManifest(root);
      if (!r.ok) { console.error('[错误] 清单校验未通过，禁止打标签'); process.exitCode = 1; break; }
      const id = setId(root);
      const count = parseManifest(fs.readFileSync(path.join(root, MANIFEST), 'utf8')).size;
      git(['tag', '-a', arg, '-m', `set-fingerprint: ${id} | files: ${count} | generated by scripts/doc-fingerprint.mjs`], root);
      console.log(`已创建标签 ${arg}（内嵌版本指纹 ${id}，${count} 个文件）。推送：git push origin ${arg}`);
      break;
    }
    default:
      console.log('用法: doc-fingerprint.mjs generate|verify|id|changes <ref>|verify-ref <ref>|tag <name>');
      process.exitCode = 1;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
