import path from 'path'
import rpt2 from 'rollup-plugin-typescript2'
import replace from '@rollup/plugin-replace'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'

if (!process.env.TARGET) {
  throw new Error('TARGET package must be specified via --environment flag.')
}

const packagesDir = path.resolve(__dirname, 'packages')
const packageDir = path.resolve(packagesDir, process.env.TARGET)

const pkg = require(path.resolve(packageDir, `package.json`))

const banner = `/*!
  * ${pkg.name} v${pkg.version}
  * (c) ${new Date().getFullYear()} ${pkg.author}
  * @license MIT
  */`

export default {
  input: `src/index.ts`,
  external: ['vue', '@vue/composition-api'],
  output: {
    file: pkg.module,
    format: `es`,
    sourcemap: true,
    banner,
    externalLiveBindings: false,
    globals: {
      vue: 'Vue',
      '@vue/composition-api': 'vueCompositionApi'
    }
  },
  plugins: [
    rpt2({
      check: true,
      tsconfig: path.resolve(__dirname, './tsconfig.json'),
      cacheRoot: path.resolve(__dirname, './node_modules/.rts2_cache'),
      tsconfigOverride: {
        compilerOptions: {
          sourceMap: true,
          declaration: true,
          declarationMap: true
        },
        exclude: ['packages/*/__tests__', 'packages/*/test-dts']
      }
    }),
    replace({
      preventAssignment: true,
      values: {
        __VERSION__: `"${pkg.version}"`,
        __DEV__: false
      }
    }),
    resolve(),
    commonjs(),
    terser({
      module: true,
      compress: {
        ecma: 2015,
        pure_getters: true
      }
    })
  ]
}
