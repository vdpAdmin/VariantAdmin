'use strict'

const path = require('path')
const defaultSettings = require('./src/settings.js')

function resolve (dir) {
  return path.join(__dirname, dir)
}

const appName = defaultSettings.title || 'Variant Admin' // page title

const JarvisPlugin = require('webpack-jarvis')  // webpack日志查看插件
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')
const smp = new SpeedMeasurePlugin({
  // outputFormat: 'humanVerbose'
  outputFormat: 'human'
})
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')

const serverUrl = defaultSettings.serverUrl || 'http://localhost:8080'

const IS_PROD = process.env.NODE_ENV === 'production'
const mvdir = require('mvdir');
if (IS_PROD) {
  mvdir('index_template/index_prod.html', 'public/index.html', { copy: true });
} else {
  mvdir('index_template/index_dev.html', 'public/index.html', { copy: true });
}

module.exports = {
  assetsDir: './',

  /* 开启vue运行时模板编译功能！！ */
  runtimeCompiler: true,

  lintOnSave: false,

  productionSourceMap: false,

  /* 指定node_modules目录中需要做babel转译的依赖库 */
  transpileDependencies: [
      'element-ui',
  ],

  css: {
    loaderOptions: {
      scss: {
        /* 自动引入全局scss文件 */
        prependData: `@import "./src/styles/global.scss";`
      }
    }
  },

  devServer: {
    host: 'localhost',
    port: 8088,
    open: true,
    proxy: {
      '/api': {
        target: serverUrl,
        // ws: true,  //是否proxy websockets
        secure: false, //https设置为true
        changeOrigin: true, //是否需要支持跨域处理
        pathRewrite: {
          '^/api': ''
        }
      }
    },
    public: '127.0.0.1:8088'
  },

  configureWebpack: (config) => {
    smp.wrap(
        {
          // provide the app's title in webpack's name field, so that
          // it can be accessed in index.html to inject the correct title.
          name: appName,
          devtool: 'source-map', /* 用于IDEA调试Vue项目js代码 */
          // devtool: 'eval', /* 加快构建速度！！ */
          //devtool: 'cheap-source-map',
          resolve: {
            alias: {
              '@': resolve('src')
            }
          },
          plugins: [
            /* webpack日志查看插件 */
            /*
            new JarvisPlugin({
              watchOnly: false,
              port: 3001
            }),
            */

          ]
        }
    )

    if (IS_PROD) { /* 仅生产环境使用 */
      config.plugins = [
        ...config.plugins,

        /* 将css和js注入index.html */
        new HtmlWebpackPlugin({
          title: appName,
          //template: IS_PROD ? './public/index.html' : './public/index.html',
          template: './public/index.html',
          chunks: ['app'],  /* 只注入app*.js和app*.css以及chunk-vendors*.js和chunk-vendors*.css!! */
        }),

        /* gzip压缩js、css文件 */
        /* 注意：如果build出现Cannot read property ‘tapPromise‘ of undefined错误，需要安装低版本插件，解决方法如下：
          1.先卸载插件：npm uninstall compression-webpack-plugin
          2.安装指定版本插件：npm i -D compression-webpack-plugin@5.0.1
         */
        new CompressionPlugin({
          test: /\.js$|\.css$/,
          deleteOriginalAssets: false // 是否删除原文件
        })
      ]
    }
  },

  chainWebpack: config => {
    /* 配置svg图标自动加载 begin */
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
    /* 配置svg图标自动加载 end */

    if (IS_PROD) {
      /* CDN打包，需要修改index.html加入CDN资源 */
      config.externals({
        'vue': 'Vue',
        'element-ui': 'ELEMENT',
        'quill': 'Quill',
      })
    }

  },

}
