import ts from 'rollup-plugin-typescript2';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import path from 'path';

export default {
  input: 'src/index.ts',
  output: {
    file: path.resolve('dist/bundle.js'),
    format: 'iife', //增加了一个自执行函数
    sourcemap: true,
  },
  plugins: [ts(), nodeResolve()],
};
