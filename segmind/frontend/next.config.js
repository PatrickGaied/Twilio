/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    // Use backend service name in Docker, localhost for local development
    const backendUrl = process.env.NODE_ENV === 'production' || process.env.DOCKER_ENV
      ? 'http://backend:8000'
      : 'http://localhost:8000';

    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ]
  },
}

module.exports = nextConfig