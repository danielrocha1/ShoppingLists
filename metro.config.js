const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);

// Enable package exports resolution
// Needed for antd v5+ which uses package.json "exports" field
config.resolver.unstable_enablePackageExports = true;

module.exports = config;
