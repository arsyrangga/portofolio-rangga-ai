/** @type {import('next').NextConfig} */
const nextConfig = {
  // ...mungkin ada konfigurasi lain di sini
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '**',
      },
      // Anda bisa menambahkan domain lain di sini di masa depan
      // {
      //   protocol: 'https',
      //   hostname: 'cdn.contoh.com',
      // },
    ],
  },
};

module.exports = nextConfig;