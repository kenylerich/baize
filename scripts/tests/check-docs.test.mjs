import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { findDeadLinks, findMissingStatus, missingTranslations, runAllChecks, suspectUntranslated } from '../check-docs.mjs';

const repoRoot = path.resolve(import.meta.dirname, '../..');

// 构造隔离的文档沙箱：README.md（含状态行、一个死链）、docs/good.md（无状态行）、README.zh.md（真实中文）
const sandbox = () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'checkdocs-test-'));
  fs.mkdirSync(path.join(dir, 'docs'), { recursive: true });
  fs.writeFileSync(
    path.join(dir, 'README.md'),
    '> status: Active\n\n[good](docs/good.md) [dead](docs/missing.md)\n'
  );
  fs.writeFileSync(path.join(dir, 'docs', 'good.md'), '# good\n');
  fs.writeFileSync(
    path.join(dir, 'README.zh.md'),
    '> status: Active（生效；中文翻译版；权威版本为英文 README.md）\n'
  );
  return dir;
};

test('findDeadLinks 只报死链，放过有效链接与外链', () => {
  const dir = sandbox();
  const dead = findDeadLinks(dir);
  assert.equal(dead.length, 1);
  assert.equal(dead[0].file, 'README.md');
  assert.equal(dead[0].target, 'docs/missing.md');
});

test('missingTranslations：权威文档缺 *.zh.md 时报告', () => {
  const dir = sandbox();
  assert.deepEqual(missingTranslations(dir, ['README.md']), []);
  fs.rmSync(path.join(dir, 'README.zh.md'));
  assert.deepEqual(missingTranslations(dir, ['README.md']), ['README.md']);
});

test('findMissingStatus 找出没有状态行的文档', () => {
  const dir = sandbox();
  assert.deepEqual(findMissingStatus(dir), ['docs/good.md']);
});

test('suspectUntranslated：英文内容的 .zh.md 判为疑似未翻译，真实中文放过', () => {
  const dir = sandbox();
  fs.writeFileSync(path.join(dir, 'docs', 'bad.zh.md'), '# Decision Record (English content only)\n');
  assert.deepEqual(suspectUntranslated(dir), ['docs/bad.zh.md']);
  assert.deepEqual(suspectUntranslated(dir).includes('README.zh.md'), false);
});

test('runAllChecks：错误计数包含死链/状态行/假翻译/指纹', () => {
  const dir = sandbox();
  fs.writeFileSync(path.join(dir, 'docs', 'bad.zh.md'), 'English only content, no Chinese at all\n');
  const { errors, report } = runAllChecks(dir);
  const text = report.join('\n');
  assert.ok(text.includes('[死链]'));
  assert.ok(text.includes('[缺状态行] docs/good.md'));
  assert.ok(text.includes('[疑似未翻译] docs/bad.zh.md'));
  assert.ok(text.includes('[错误] 清单不存在'));
  assert.ok(errors >= 4);
});

test('CLI 集成：真实仓库体检通过', () => {
  const out = execFileSync(process.execPath, [path.join(repoRoot, 'scripts', 'check-docs.mjs')], {
    cwd: repoRoot,
    encoding: 'utf8',
  });
  assert.match(out, /通过/);
});
