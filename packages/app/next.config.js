/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Matching the commented out StrictMode in original
  transpilePackages: ['@the-discounters/types', '@the-discounters/util'],
  output: 'export', // Static export like Create React App
  distDir: 'build', // Output to 'build' directory like CRA
  images: {
    unoptimized: true, // Required for static export
  },
  // Skip trailing slashes to match CRA behavior
  trailingSlash: false,
  env: {
    NEXT_PUBLIC_FIREBASE_SERVER_URL: process.env.NEXT_PUBLIC_FIREBASE_SERVER_URL,
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
    NEXT_PUBLIC_ENV: process.env.NEXT_PUBLIC_ENV,
    NEXT_PUBLIC_VERSION: process.env.NEXT_PUBLIC_VERSION,
  },
  webpack: (config) => {
    // Allow ReactComponent-style SVG imports (parity with CRA)
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.('.svg')
    );

    if (fileLoaderRule) {
      fileLoaderRule.exclude = /\.svg$/i;
    }

    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            titleProp: true,
            exportType: 'named',
            namedExport: 'ReactComponent',
          },
        },
      ],
    });

    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      canvas: false,
    };

    return config;
  },
};

module.exports = nextConfig;
