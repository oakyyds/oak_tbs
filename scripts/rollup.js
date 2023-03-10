import fs from 'fs';
import path from 'path';
import { rollup } from 'rollup';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { defineRollupSwcMinifyOption, defineRollupSwcOption, minify, swc } from 'rollup-plugin-swc3';
import json from '@rollup/plugin-json';
import cleanup from 'rollup-plugin-cleanup';
import { walk } from 'estree-walker';

export async function buildFile(options) {
  const { metadata, inputFile, outputFile, external } = options;
  const input = path.normalize(inputFile);
  const build = await rollup({
    input: input,
    external: external,
    plugins: [
      json(),
      commonjs(),
      nodeResolve(),
      cleanup({ comments: 'none' }),
      swc(defineRollupSwcOption({
        minify: true,
        jsc: {
          target: 'es2020',
          minify: {
            compress: {
              booleans_as_integers: true,
              dead_code: true,
              drop_console: true,
            },
            mangle: true,
          }
        }
      })),
      minify(defineRollupSwcMinifyOption({
        compress: {
          drop_console: true,
          dead_code: true,
          drop_debugger: true,
        },
        format: {
          comments: false,
        }
      })),
      {
        name: 'inject-metadata',
        transform(code, module) {
          if (metadata && module === inputFile) {
            const ast = this.parse(code);
            const methods = [];
            const dependencies = [];
            walk(ast, {
              enter(node) {
                if (node.type === 'ExportNamedDeclaration') {
                  methods.push(node.declaration.id.name);
                } else if (node.type === 'ImportDeclaration' && external) {
                  const imp = node.source.value;
                  if (external.indexOf(imp) >= 0) {
                    dependencies.push(imp);
                  }
                }
              }
            });
            methods.push('metadata');
            metadata.methods = methods;
            if (dependencies.length) {
              metadata.dependencies = dependencies;
            }
            return `${code}\n\nexport function metadata(){return ${JSON.stringify(metadata)};}`;
          }
        }
      },
    ],
  });
  const file = path.normalize(outputFile);
  const output = await build.generate({
    format: 'esm',
    file: file,
  });
  await build.close();
  fs.writeFileSync(file, output.output[0].code);
}


