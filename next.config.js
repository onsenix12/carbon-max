/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Mark server-only packages to prevent bundling issues
  serverComponentsExternalPackages: ['node-telegram-bot-api'],
  webpack: (config, { isServer }) => {
    // Fix for node-telegram-bot-api and its dependencies
    if (isServer) {
      // Mark server-only modules as external
      config.externals = config.externals || [];
      if (Array.isArray(config.externals)) {
        config.externals.push('supports-color');
      } else {
        config.externals = [config.externals, 'supports-color'];
      }
    } else {
      // For client-side, ignore server-only modules
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'supports-color': false,
        'node-telegram-bot-api': false,
      };
    }
    return config;
  },
}

module.exports = nextConfig

