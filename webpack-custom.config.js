const webpack = require("webpack");
const webpackConfig = require("./webpack.config");

module.exports = (env) => {
    const config = webpackConfig(env);
    config.plugins.push(new webpack.DefinePlugin({
        "TNS_MODE": JSON.stringify(env.prod ? "production" : "development")
    }));

    return config;
}
