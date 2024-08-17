const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // No need to require the cron job file
    return config;
  },
}

module.exports = nextConfig;
