import fs from 'fs';
import path from 'path';
import branch from './branch.js';
import trunk from './trunk.js';
import ora from 'ora';

(async () => {
  const spinner = ora('rm dist files').start();
  try {
    fs.rmSync(path.join(process.cwd(), 'dist'), { recursive: true, force: true });
    spinner.succeed();
  } catch (e) {
    spinner.fail(e.toString());
  }

  await trunk();
  await branch();

  const tr = JSON.parse(String(fs.readFileSync(path.join(process.cwd(), 'dist', 'trunk', 'index.json'))));
  const br = JSON.parse(String(fs.readFileSync(path.join(process.cwd(), 'dist', 'branch', 'index.json'))));

  spinner.start('generate index.json');
  try {
    const pkg = JSON.parse(String(fs.readFileSync(path.join(process.cwd(), 'package.json'))));
    fs.writeFileSync(path.join(process.cwd(), 'dist', 'index.json'), JSON.stringify({
      name: pkg.name,
      deps: tr,
      apps: br,
    }));
    spinner.succeed();
  } catch (e) {
    spinner.fail(e.toString());
    throw e;
  }
})();

