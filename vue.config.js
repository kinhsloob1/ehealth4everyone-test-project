module.exports = {
  publicPath: process.env.BASE_URL,
  devServer: {
    proxy: process.env.BASE_URL
  }
};
