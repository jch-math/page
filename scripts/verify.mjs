import { spawnSync } from 'node:child_process';
import process from 'node:process';

const repository = process.env.GITHUB_REPOSITORY ?? 'jch-math/page';
const owner = process.env.GITHUB_REPOSITORY_OWNER ?? repository.split('/')[0];
const environment = {
  ...process.env,
  GITHUB_REPOSITORY: repository,
  GITHUB_REPOSITORY_OWNER: owner,
};

run('内容与目录测试', ['--test', 'tests/content-schema.test.ts', 'tests/content-catalog.test.ts']);
run('Astro 类型检查', ['node_modules/astro/bin/astro.mjs', 'check']);
run('GitHub Pages 生产构建', ['node_modules/astro/bin/astro.mjs', 'build']);
run('构建产物检查', ['scripts/verify-dist.mjs']);

function run(label, args) {
  console.log(`\n[verify] ${label}`);
  const result = spawnSync(process.execPath, args, {
    cwd: process.cwd(),
    env: environment,
    stdio: 'inherit',
  });

  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
