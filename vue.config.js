module.exports = {
  chainWebpack: config => {
    // GraphQL Loader
    config.module
      .rule('frag')
      .test(/\.frag$/)
      .use('raw-loader')
      .loader('raw-loader')
      .end()
    config.module
      .rule('vert')
      .test(/\.vert$/)
      .use('raw-loader')
      .loader('raw-loader')
      .end()

  }
}
