import fs from 'fs';
import path from 'path';
import ora from 'ora';
import { buildFile } from './rollup.js';


export default async function build() {
  const inputDir = path.join(process.cwd(), 'src', 'trunk');
  const outputDir = path.join(process.cwd(), 'dist', 'trunk');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  const files = fs.readdirSync(inputDir);
  const trunk = [];
  for (const file of files) {
    const spinner = ora(`build trunk/${file}`).start();
    try {
      await buildFile({ inputFile: path.join(inputDir, file), outputFile: path.join(outputDir, file) });
      const {
        name,
        version,
        description,
        license
      } = JSON.parse(String(fs.readFileSync(path.join(process.cwd(), 'node_modules', file.substring(0, file.length - '.js'.length), 'package.json'))));
      trunk.push({ name, version, description, license, dist: path.join('trunk', file) });
    } finally {
      spinner.succeed();
    }
  }
  fs.writeFileSync(path.join(outputDir, 'index.json'), JSON.stringify(trunk));
}
