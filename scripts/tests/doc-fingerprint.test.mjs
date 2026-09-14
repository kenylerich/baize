import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { changesFromManifests, generate, listManagedFiles, setId, verifyManifest } from '../doc-fingerprint.mjs';

// 构造一个隔离的临时"迷你仓库"：README.md + scripts/tool.mjs
const sandbox = () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'fingerprint-test-'));
  fs.writeFileSync(path.join(dir, 'README.md'), '# demo\n');
  fs.mkdirSync(path.join(dir, 'scripts'));
  fs.writeFileSync(path.join(dir, 'scripts', 'tool.mjs'), 'export const x = 1;\n');
  return dir;
};

test('listManagedFiles 收录 *.md 与 scripts 下的 .mjs', () => {
  const files = listManagedFiles(sandbox());
  assert.deepEqual(files, ['README.md', 'scripts/tool.mjs']);
});

test('generate 产出 POSIX 两空格格式清单；verify 未改动时通过', () => {
  const dir = sandbox();
  const { count } = generate(dir);
  assert.equal(count, 2);
  const manifest = fs.readFileSync(path.join(dir, 'MANIFEST.sha256'), 'utf8');
  const lines = manifest.trim().split('\n');
  assert.equal(lines.length, 2);
  for (const line of lines) assert.match(line, /^[0-9a-f]{64}  \S+$/);
  assert.equal(verifyManifest(dir).ok, true);
});

test('verify 检测篡改：改一个字节即失败并指出文件', () => {
  const dir = sandbox();
  generate(dir);
  fs.writeFileSync(path.join(dir, 'README.md'), '# demo tampered\n');
  const r = verifyManifest(dir);
  assert.equal(r.ok, false);
  assert.ok(r.lines.join('\n').includes('[指纹不一致] README.md'));
});

test('verify 检测清单外新文件', () => {
  const dir = sandbox();
  generate(dir);
  fs.writeFileSync(path.join(dir, 'extra.md'), 'x\n');
  const r = verifyManifest(dir);
  assert.equal(r.ok, false);
  assert.ok(r.lines.join('\n').includes('[清单外新文件] extra.md'));
});

test('setId：同内容相同，内容变化则变化', () => {
  const dir = sandbox();
  generate(dir);
  const id1 = setId(dir);
  assert.equal(id1, setId(dir));
  fs.writeFileSync(path.join(dir, 'README.md'), '# changed\n');
  generate(dir);
  assert.notEqual(id1, setId(dir));
});

test('changesFromManifests 识别新增/修改/删除', () => {
  const dir = sandbox();
  generate(dir);
  const oldText = fs.readFileSync(path.join(dir, 'MANIFEST.sha256'), 'utf8');
  fs.writeFileSync(path.join(dir, 'README.md'), '# modified\n');       // 修改
  fs.writeFileSync(path.join(dir, 'added.md'), 'new\n');               // 新增
  fs.rmSync(path.join(dir, 'scripts', 'tool.mjs'));                    // 删除
  const out = changesFromManifests(oldText, dir).join('\n');
  assert.ok(out.includes('[修改] README.md'));
  assert.ok(out.includes('[新增] added.md'));
  assert.ok(out.includes('[删除] scripts/tool.mjs'));
});
