/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '7h4qznnnsa.ufs.sh',
      },
      {
        protocol: 'https',
        hostname: 'jbajlm82js.ufs.sh',
      },
    ],
  },
};

export default nextConfig;
