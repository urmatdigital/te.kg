/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.telegram.org',
        pathname: '/file/bot**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self' telegram.org *.telegram.org *.supabase.co *.ngrok-free.app",
              "img-src 'self' blob: data: api.telegram.org",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' telegram.org *.telegram.org *.ngrok-free.app",
              "style-src 'self' 'unsafe-inline'",
              "connect-src 'self' *.supabase.co telegram.org *.telegram.org *.ngrok-free.app",
            ].join('; ')
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          }
        ]
      }
    ]
  },
  output: 'standalone',
  poweredByHeader: false
}

module.exports = nextConfig
