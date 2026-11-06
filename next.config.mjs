import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "firebase/app": path.resolve(__dirname, "node_modules/@firebase/app/dist/esm/index.esm.js"),
      "firebase/auth": path.resolve(__dirname, "node_modules/@firebase/auth/dist/esm/index.js"),
      "firebase/firestore": path.resolve(__dirname, "node_modules/@firebase/firestore/dist/index.esm.js"),
      "@firebase/app": path.resolve(__dirname, "node_modules/@firebase/app/dist/esm/index.esm.js"),
      "@firebase/auth": path.resolve(__dirname, "node_modules/@firebase/auth/dist/esm/index.js"),
      "@firebase/firestore": path.resolve(__dirname, "node_modules/@firebase/firestore/dist/index.esm.js"),
    };
    return config;
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
