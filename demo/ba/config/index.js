const path = require('path')

const config = {
  projectName: 'csp-ba',
  date: '2026-4-20',
  designWidth: 750,
  deviceRatio: { 640: 2.34 / 2, 750: 1, 828: 1.81 / 2 },
  sourceRoot: '.',
  outputRoot: 'dist',
  framework: 'react',
  compiler: { type: 'webpack5' },
  plugins: ['@tarojs/plugin-framework-react', '@tarojs/plugin-platform-weapp', '@tarojs/plugin-platform-h5'],
  alias: {
    '@': path.resolve(__dirname, '..'),
  },
  sass: {
    resource: [path.resolve(__dirname, '../styles/variables.scss')],
  },
  defineConstants: {},
  copy: {
    patterns: [
      { from: 'images/', to: 'dist/images/' },
    ],
    options: {},
  },
  weapp: {
    module: {
      postcss: {
        autoprefixer: { enable: true },
      },
    },
  },
  h5: {
    router: { mode: 'hash' },
    publicPath: '/',
    staticDirectory: 'static',
    devServer: {},
    postcss: {
      autoprefixer: { enable: true },
    },
  },
}

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, {
      env: { defineConstants: { ENV: '"development"' } },
    })
  }
  return merge({}, config, {
    env: { defineConstants: { ENV: '"production"' } },
  })
}
