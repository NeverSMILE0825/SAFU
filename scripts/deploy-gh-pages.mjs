import { cp, mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = resolve(import.meta.dirname, '..');
const dist = resolve(root, 'dist');
const worktree = resolve(root, '.gh-pages-worktree');
const liveUrl = 'https://neversmile0825.github.io/SAFU/';

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd ?? root,
    stdio: options.stdio ?? 'inherit',
    shell: true,
    env: {
      ...process.env,
      GIT_AUTHOR_NAME: process.env.GIT_AUTHOR_NAME || 'NeverSMILE0825',
      GIT_AUTHOR_EMAIL: process.env.GIT_AUTHOR_EMAIL || 'NeverSMILE0825@users.noreply.github.com',
      GIT_COMMITTER_NAME: process.env.GIT_COMMITTER_NAME || process.env.GIT_AUTHOR_NAME || 'NeverSMILE0825',
      GIT_COMMITTER_EMAIL: process.env.GIT_COMMITTER_EMAIL || process.env.GIT_AUTHOR_EMAIL || 'NeverSMILE0825@users.noreply.github.com',
    },
  });
  if ((result.status ?? 1) !== 0) {
    throw new Error(`Command failed: ${command} ${args.join(' ')}`);
  }
  return result;
}

console.log('Building site…');
run('npm', ['run', 'build']);

await rm(worktree, { recursive: true, force: true });
run('git', ['fetch', 'origin', 'gh-pages'], { stdio: 'pipe' });
run('git', ['worktree', 'prune'], { stdio: 'pipe' });
run('git', ['worktree', 'add', '-B', 'gh-pages', worktree, 'origin/gh-pages']);

const existing = await readdir(worktree);
await Promise.all(
  existing
    .filter((name) => name !== '.git')
    .map((name) => rm(resolve(worktree, name), { recursive: true, force: true })),
);

await cp(dist, worktree, { recursive: true });
await writeFile(resolve(worktree, '.nojekyll'), '');

run('git', ['add', '-A'], { cwd: worktree });
const status = spawnSync('git', ['status', '--porcelain'], {
  cwd: worktree,
  encoding: 'utf8',
  shell: true,
});
if (!status.stdout.trim()) {
  console.log('\n✓ gh-pages already up to date.');
  console.log(`✓ Live site: ${liveUrl}\n`);
} else {
  run('git', ['commit', '-m', 'Publish SAFU site to GitHub Pages'], { cwd: worktree });
  run('git', ['push', 'origin', 'gh-pages'], { cwd: worktree });
  console.log(`\n✓ Published. Live site: ${liveUrl}\n`);
}

run('git', ['worktree', 'remove', worktree, '--force'], { stdio: 'pipe' });
await rm(worktree, { recursive: true, force: true });
