const { defineConfig } = require('@vue/cli-service')
const { VantResolver } = require('unplugin-vue-components/resolvers');
const ComponentsPlugin = require('unplugin-vue-components/webpack');
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: "./",
  lintOnSave: false,
  configureWebpack: {
    plugins: [
      ComponentsPlugin({
        resolvers: [VantResolver()],
      }),
    ],
    output: {
      filename: 'js/[name].[hash].bundle.js',
      chunkFilename: 'js/[name].[hash].chunk.js',
    }
  },
  css: {
    extract: {
        filename: `css/[name].[hash].css`,
        chunkFilename: `css/chunk.[id].[hash].css`,
    }
  },
})
