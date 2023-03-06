import fs from 'fs';
import path from 'path';
import branch from './branch.js';
import trunk from './trunk.js';
import ora from 'ora';

(async () => {
  const spinner = ora('rm dist files').start();
  fs.rmSync(path.join(process.cwd(), 'dist'), { recursive: true, force: true });
  spinner.succeed();

  await trunk();
  await branch();

  const tr = JSON.parse(String(fs.readFileSync(path.join(process.cwd(), 'dist', 'trunk', 'index.json'))));
  const br = JSON.parse(String(fs.readFileSync(path.join(process.cwd(), 'dist', 'branch', 'index.json'))));

  spinner.start('generate index.json');
  fs.writeFileSync(path.join(process.cwd(), 'dist', 'index.json'), JSON.stringify({
    deps: tr,
    apps: br,
  }));
  spinner.succeed();
})();

