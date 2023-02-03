const webpack = require("webpack");

const { parsed: myEnv } = require("dotenv").config({
  path: "../.env",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack(config) {
    config.plugins.push(new webpack.EnvironmentPlugin(myEnv));
    return config;
  },
};

module.exports = nextConfig;
