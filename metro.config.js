const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Force Metro to serve web bundle as ESM to support import.meta
config.transformer = {
  ...config.transformer,
  unstable_allowRequireContext: true,
};

// Ensure babel transforms apply to all files (including node_modules with import.meta)
config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
});

module.exports = withNativeWind(config, { input: './global.css' });
