const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "https://qzblapi.azurewebsites.net",
      changeOrigin: true,
      pathRewrite: {
        "^/api": "/api",
      },
    })
  );
};
