
const path = require('path')
module.exports = {
  runtimeCompiler: true,
  publicPath: './',
  outputDir: '/demo/dist',
  assetsDir: 'static',
  pages: { // pages里配置的路径和文件名在你的文档目录必须存在，否则启动服务会报错
    index: {// 除了 entry 之外都是可选的
      entry: 'demo/src/main.js',
      template: 'demo/public/index.html',
      filename: 'index.html'
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.join(__dirname, '/demo/src'),
        '@~': path.join(__dirname, '/packages')
      }
    }
  },
  devServer: {
    // // host: 'localhost',
    // host: '0.0.0.0',
    // port: 8000, // 端口号
    // https: false, // https:{type:Boolean}
    // open: true, //配置自动启动浏览器  http://XXX.XXX.X.XX:7071/rest/XXX/
    // hotOnly: true, // 热更新
    // proxy: 'http://localhost:8000'           // 配置跨域处理,只有一个代理
    // 设置代理
    proxy: {
      '/api': {
        target: 'https://lo9.glkyun.cn/ofs', // 域名
        changOrigin: false, // 开启代理：在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
        pathRewrite: {
          '^/api': '' // 需要rewrite重写的,
        }
      }
    }
  }
}
