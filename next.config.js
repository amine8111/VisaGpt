/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  turbopack: {},
  webpack: (config, { isServer, dev }) => {
    if (!isServer && !dev) {
      config.module.rules.push({
        test: /node_modules\/onnxruntime-web\/.*\.mjs$/,
        type: 'asset/resource',
      });
    }
    if (!dev && !isServer) {
      config.optimization = config.optimization || {};
      config.optimization.minimize = false;
    }
    return config;
  },
}

module.exports = nextConfig
