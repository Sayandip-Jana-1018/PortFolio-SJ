/** @type {import('next').NextConfig} */
const nextConfig = {

  typescript: {
    // Disable TypeScript type checking during builds
    ignoreBuildErrors: true,
  },
  images: {
    qualities: [25, 50, 75, 90, 100],
  },
}

module.exports = nextConfig
