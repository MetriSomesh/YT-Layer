/** @type {import('next').NextConfig} */
const allowedOrigin =
  process.env.ALLOWED_ORIGIN || process.env.NEXT_PUBLIC_APP_URL;

const nextConfig = {
  poweredByHeader: false,
  async headers() {
    // Same-origin requests do not need CORS. Only emit the header when an
    // explicit cross-origin client is configured for this deployment.
    if (!allowedOrigin) {
      return [];
    }

    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: allowedOrigin },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,DELETE,PATCH,POST,PUT,OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.ibb.co", pathname: "**" },
      { protocol: "https", hostname: "lh3.googleusercontent.com", pathname: "**" },
      { protocol: "https", hostname: "yt3.ggpht.com", pathname: "**" },
      { protocol: "https", hostname: "i.ytimg.com", pathname: "**" },
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "**" },
    ],
  },
  // Add this line to transpile the cloudinary-react package
  transpilePackages: ["cloudinary-react"],
};

export default nextConfig;
