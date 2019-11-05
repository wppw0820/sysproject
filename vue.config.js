// 导入路径和webpack
const path = require('path')
const webpack = require('webpack')
// 路径处理函数
function resolve(dir) {
  return path.join(__dirname, dir)
}
// vue 配置
module.exports = {
  // webpack会在开发阶段提供一个根目录下的静态服务器,默认编译的bundle.js在根目录 (内存中,看不到)
  // 完成开发环境和生产环境的 服务地址配置, 在开发阶段项目运行起来时的静态服务器在根目录，通过webpack-dev-server实时编译的bundle.js是在根目录，此时index.html
  // 引入的编译bundle.js只能通过绝对路径'/'访问，而在生产环境时,通过手动npm run build打包之后的 index.html和bundle.js在同一个dist文件中 此时应该用相对路径'./'
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
    port: 8000,
    host: 'localhost',
    // open:true, //自动打开浏览器
    // hot:true, // 自动刷新
    // disableHostCheck:true,
    proxy: {
      '/': {
        target: 'http://11.0.0.150:9060',
        // bypass: function(req, res, proxyOptions) {  // 跳过浏览器请求代理 （在history模式下，前后端分离项目 前台临时配置，避免请求404）
        //   if (req.headers.accept.indexOf("html") !== -1) {
        //     console.log("Skipping proxy for browser request.")
        //     return "/index.html";
        //   }
        // },
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
