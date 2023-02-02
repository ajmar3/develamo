/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      "avatars.githubusercontent.com",
      "placeimg.com"
    ]
  },
  async redirects() {
    return [
      {
        source: '/dash',
        destination: '/dash/find',
        permanent: true
      }
    ];
  }
};

module.exports = nextConfig;
