/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://s3.tradingview.com https://www.tradingview.com;",
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig