const path = require('path')

function resolve (dir) {
  return path.join(__dirname, '.', dir)
}
module.exports = {
  productionSourceMap: false,
  lintOnSave: false,
  publicPath: './', // 设置打包文件相对路径
  // 这是前端解决跨域的代码
  devServer: {
    proxy: {
      '/api': {
        target: "https://testshopportal.51autoshop.com/admin", //写上接口基地址
        changeOrigin: true,
        ws: true,
        // secure: false, //如果是http接口，需要配置此参数
        pathRewrite: {
          '^/api': '/api'
        }
      }
    }
  },
  chainWebpack: config => {
    config.module.rules.delete("svg"); //重点:删除默认配置中处理svg,
    config.module
      .rule('svg-sprite-loader')
      .test(/\.svg$/)
      .include
      .add(resolve('src/icons')) //处理svg目录
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
  },
}