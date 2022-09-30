/** @type {import('next').NextConfig} */

const withMDX = require("@next/mdx")({
  extension: /\.mdx?$/,
});

const nextConfig = withMDX({
  pageExtensions: ["js", "jsx", "mdx"],
  reactStrictMode: true,
  swcMinify: true,
});

module.exports = nextConfig;
