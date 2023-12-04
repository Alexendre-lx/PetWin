// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['storage.googleapis.com', 'firebasestorage.googleapis.com'],
  },

};

module.exports = nextConfig;
