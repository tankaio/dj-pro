const path = require("path")
const webpack = require('webpack')
const resolve = v => path.resolve(__dirname, v)

module.exports = {
    productionSourceMap: false,
    publicPath: '/',
    devServer: {
        // index: '',
        // proxy: {
        //     '/init': {
        //         target: process.env.VUE_APP_PROXY_URL,
        //         ws: true,
        //         changeOrigin: true
        //     },
        // }
        // proxy: 'http://dtapi-aj.xy50test.com'
        // proxy: "http://127.0.0.1:3456"
        // disableHostCheck: true,
        // public: 'prox.com'
    },
    configureWebpack: {
        devtool: 'source-map',
        plugins: [
            new webpack.ProvidePlugin({
                jQuery: 'jquery',
                $: 'jquery'
            })
        ],
        // optimization: {
        //     splitChunks: {
        //         cacheGroups: {
        //             vendors: false,
        //             vueBase: {
        //                 name: 'vueBase-vendors',
        //                 test: /[\\/]node_modules[\\/](vue|vue-router|vuex)[\\/]/,
        //                 chunks: 'all',
        //                 priority: 2,
        //                 enforce: true
        //             },
        //             mobileHorizontal: {
        //                 name: 'vant-vendors',
        //                 test: /[\\/]node_modules[\\/]vant[\\/]/,
        //                 chunks: 'all',
        //                 priority: 1,
        //                 enforce: true
        //             },
        //             common: {
        //                 name: 'chunk-common',
        //                 minChunks: 2,
        //                 priority: -20,
        //                 chunks: 'initial',
        //                 reuseExistingChunk: true
        //             }
        //         }
        //     }
        // }
    },
    chainWebpack: config => {
        config.resolve.alias
            .set("@", resolve("src"))
            .set("img", resolve("src/assets/img"))
            .set("cpt", resolve("src/components"))
        // 针对移动端去除预加载
        // config.plugins.delete('prefetch')

    },
    css: {
        loaderOptions: {
            scss: {
                prependData: `@import "~@/assets/css/variables.scss";@import "~@/assets/css/mixin.scss";`
            },
            postcss: {
                plugins: [require("postcss-plugin-px2rem")({
                    // rootValue:200,
                    //propWhiteList: [],  //默认值是一个空数组，这意味着禁用白名单并启用所有属性。
                    // propBlackList: [], //黑名单
                    // exclude: /(node_module)/, //默认false，可以（reg）利用正则表达式排除某些文件夹的方法，例如/(node_module)\/如果想把前端UI框架内的px也转换成rem，请把此属性设为默认值
                    // selectorBlackList: [], //要忽略并保留为px的选择器
                    // ignoreIdentifier: false,  //（boolean/string）忽略单个属性的方法，启用ignoreidentifier后，replace将自动设置为true。
                    // replace: true, // （布尔值）替换包含REM的规则，而不是添加回退。
                    mediaQuery: false, //（布尔值）允许在媒体查询中转换px。
                    minPixelValue: 3 //设置要替换的最小像素值(3px会被转rem)。 默认 0
                })]
            }
        }
    }
}