const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);

// Enable package exports resolution (Metro 0.76+)
// Needed for antd v5+ which uses package.json "exports" field
config.resolver.unstable_enablePackageExports = true;

// Allow importing from these packages (they use exports field)
config.resolver.unstable_conditionNames = ['require', 'import', 'browser'];

// Ensure proper transpilation of antd and rc-* packages
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
};

// Configure babel to handle optional chaining and nullish coalescing
config.transformer.babelTransformerPath = require.resolve('metro-react-native-babel-transformer');

module.exports = config;
