const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);

// Enable package exports resolution (Metro 0.76+)
// Needed for antd v5+ which uses package.json "exports" field
config.resolver.unstable_enablePackageExports = true;

// Allow importing from these packages (they use exports field)
config.resolver.unstable_conditionNames = ['require', 'import'];

module.exports = config;
