import plugins, { replace } from '@lucide/rollup-plugins';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { qwikVite } from '@builder.io/qwik/optimizer';
import excludeDependenciesFromBundle from "rollup-plugin-exclude-dependencies-from-bundle";
import pkg from './package.json' assert { type: 'json' };


const { dependencies = {}, peerDependencies = {} } = pkg;
const makeRegex = (dep) => new RegExp(`^${dep}(/.*)?$`);
const excludeAll = (obj) => Object.keys(obj).map(makeRegex);

const packageName = 'LucideQwik';
const outputFileName = 'lucide-qwik';
const outputDir = 'dist';
const inputs = ['src/lucide-qwik.ts'];
const bundles = [
  {
    format: 'umd',
    inputs,
    outputDir,
    minify: true,
  },
  {
    format: 'umd',
    inputs,
    outputDir,
  },
  {
    format: 'cjs',
    inputs,
    outputDir,
    aliasesSupport: true
  },
  {
    format: 'esm',
    inputs,
    outputDir,
    preserveModules: true,
    aliasesSupport: true
  },
];

const configs = bundles
  .map(({ inputs, outputDir, format, minify, preserveModules, aliasesSupport }) =>
    inputs.map(input => ({
      input,
      plugins: [
        // excludeDependenciesFromBundle(),
        // qwikVite(),
        // This for aliases, only for esm
        ...(
          !aliasesSupport ? [
            replace({
              "export * from './aliases';": '',
              "export * as icons from './icons';": '',
              delimiters: ['', ''],
              preventAssignment: false,
            }),
          ] : []
        ),
        qwikVite(),
        ...plugins(pkg, minify)
      ],
      external: [
        'react/jsx-runtime',
      ],
      output: {
        name: packageName,
        ...(preserveModules
          ? {
              dir: `${outputDir}/${format}`,
            }
          : {
              file: `${outputDir}/${format}/${outputFileName}${minify ? '.min' : ''}.js`,
            }),
        format,
        preserveModules,
        sourcemap: true,
        globals: {
          'react/jsx-runtime': 'qwik',
        }
      },
    })),
  )
  .flat();

export default configs;
