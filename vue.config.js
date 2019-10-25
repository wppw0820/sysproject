// 导入路径和webpack
const path = require('path')
const webpack = require('webpack')
// 路径处理
function resolve(dir) {
  return path.join(__dirname, dir)
}
// vue 配置
module.exports = {
  // 完成开发环境和生产环境的 服务地址配置
  publicPath: process.env.NODE_ENV === "production" ? "./" : "/",
  // 关闭生产环境下的 代码调试功能
  productionSourceMap: false,
  pages: {
    index: {
      entry: './src/main.js',
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    }
  },
  configureWebpack: {
    plugins: [
      // 忽略 moment.js的locale 文件
      new webpack.IgnorePlugin(/^\.\/locales$/, /moment$/),
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "windows.jQuery": "jquery"
      })

    ]
  },
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@$', resolve('src'))
      .set('@api', resolve('src/api'))
      .set('@assets', resolve('src/assets'))
      .set('@comp', resolve('src/components'))
      .set('@views', resolve('src/views'))
      .set('@layout', resolve('src/layout'))
      .set('@static', resolve('src/static'))
    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .oneOf('inline')
      .resourceQuery(/inline/)
      .use('vue-svg-icon-loader')
      .loader('vue-svg-icon-loader')
      .end()
      .end()
      .oneOf('external')
      .use('file-loader')
      .loader('file-loader')
      .options({
        name: 'assets/[name].[hash:8].[ext]'
      })
  },
  css: {
    // 开启开发环境下的 css 样式调试功能
    sourceMap: true,
    loaderOptions: {
      less: {
        modifyVars: {
          /* less 变量覆盖，用于自定义element 主题  */
          'primary-color': '#1890FF', // #F5222D
          'link-color': '#3485FF', // #F5222D
          'font-size-base': '16px' // 主字号
          /*
          'border-radius-base': '4px',
          */
        },
        javascriptEnabled: true
      },
      // 设置自适应
      postcss: {
        plugins: [
          require('postcss-px2rem')({
            remUnit: 192
          })
        ]
      }
    }
  },
  devServer: {
    // development server port 8000 这开发环境服务器配置也可以充当代理的角色
    // http请求时在本地的静态服务器找对应的资源能找到就返回 如果映射不到 直接发送代理之后的远程服务器 去请求 
    port: 8000,
    host: 'localhost',
    // open:true, //自动打开浏览器
    // hot:true, // 自动刷新
    proxy: {
      '/': {
        target: 'http://11.0.0.150:9060',
        ws: false,
        changeOrigin: true
      }
    }
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: []
    }
  },
  lintOnSave: undefined,
  // babel-loader no-ignore node_modules/*
  transpileDependencies: ['vue-echarts', 'resize-detector']
}
