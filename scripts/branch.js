import fs from 'fs';
import path from 'path';
import { buildFile } from './rollup.js';
import ora from 'ora';


export default async function build() {
  const inputDir = path.join(process.cwd(), 'src', 'branch');
  const outputDir = path.join(process.cwd(), 'dist', 'branch');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  const types = fs.readdirSync(inputDir);
  const trunks = fs.readdirSync(path.join(process.cwd(), 'src', 'trunk'))
    .map(e => e.substring(0, e.length - '.js'.length));
  const obj = {};
  for (const type of types) {
    const typePath = path.join(inputDir, type);
    const stats = fs.lstatSync(typePath);
    if (!stats.isDirectory()) {
      continue;
    }
    const items = fs.readdirSync(typePath);
    const branch = [];
    for (const item of items) {
      const space = path.join(typePath, item);
      const stats = fs.lstatSync(space);
      if (!stats.isDirectory()) {
        continue;
      }
      const spinner = ora(`build branch/${type}/${item}.js`).start();
      try {
        const buffer = fs.readFileSync(path.join(space, 'index.json'));
        const metadata = JSON.parse(String(buffer));
        const output = path.join(outputDir, type);
        if (!fs.existsSync(output)) {
          fs.mkdirSync(output, { recursive: true });
        }
        if (metadata.icon) {
          const icon = path.join(space, metadata.icon);
          if (fs.existsSync(icon)) {
            fs.copyFileSync(icon, path.join(output, item + '.ico'));
            metadata.icon = path.join('branch', type, item + '.ico');
          } else {
            throw `icon not found: ${icon}`;
          }
        }
        metadata.dist = path.join('branch', type, item + '.js');
        await buildFile({
          metadata,
          inputFile: path.join(space, metadata.entry),
          outputFile: path.join(output, item + '.js'),
          external: trunks,
        });
        delete metadata.entry;
        branch.push(metadata);
      } finally {
        spinner.succeed();
      }
    }
    obj[type] = branch;
  }
  fs.writeFileSync(path.join(outputDir, 'index.json'), JSON.stringify(obj));
}
