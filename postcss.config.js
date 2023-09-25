module.exports = ({ file }) => {
    return {
        plugins: {
            autoprefixer: {},
            "postcss-pxtorem": {
                rootValue({ file }) {
                    return file.indexOf('vant') !== -1 ? 37.5 : 75;
                },
                propList: ["*"],
                selectorBlackList:['.el']
            }
        }
    }
}