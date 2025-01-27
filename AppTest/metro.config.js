const { getDefaultConfig } = require('metro-config');

module.exports = (async () => {
    const {
        resolver: { sourceExts, assetExts },
    } = await getDefaultConfig(__dirname);

    return {
        transformer: {
            babelTransformerPath: require.resolve('metro-react-native-babel-transformer'),
        },
        resolver: {
            sourceExts: [...sourceExts, 'mjs', 'cjs'],
            assetExts: assetExts.filter((ext) => ext !== 'svg'),
        },
    };
})();