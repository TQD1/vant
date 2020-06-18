const merge = require('webpack-merge')
const path = require('path')
const common = require('./webpack.common')
module.exports = merge(common, {
  entry: {
    index: path.resolve(__dirname, '../packages/index.js')
  },
  output: {
    filename: '[name].js', // 输出多个entry对应的文件
    path: path.resolve(__dirname, '../publish'), // 输出位置
    library: 'locmp',
    libraryTarget: 'umd', // 以umd的方式导出library
    libraryExport: 'default' // 将入口处的默认导出，分配给libraryTarget
  },
  // 将vue设置为外部必须有的依赖，但是不把它打包到项目里面，即让用户自己去安装vue
  externals: ['vue', 'axios', 'element-ui'],

  plugins: [
    // new BundleAnalyzerPlugin() // 启动bundle可视化分析插件
  ],
  mode: 'production'
})
