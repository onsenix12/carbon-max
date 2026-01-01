/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Mark server-only packages to prevent bundling issues
  serverComponentsExternalPackages: ['node-telegram-bot-api'],
  
  // Experimental features to fix build issues
  experimental: {
    // Ensure proper client/server boundary handling
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  
  webpack: (config, { isServer }) => {
    // Fix for node-telegram-bot-api and its dependencies
    if (!isServer) {
      // For client-side, ignore server-only modules
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'supports-color': false,
        'node-telegram-bot-api': false,
      };
    }
    
    // Ensure proper module resolution
    config.resolve.extensionAlias = {
      '.js': ['.js', '.ts', '.tsx'],
      '.jsx': ['.jsx', '.tsx'],
    };
    
    return config;
  },
  
  // Ensure proper handling of route groups
  onDemandEntries: {
    // Period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // Number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },
}

module.exports = nextConfig

