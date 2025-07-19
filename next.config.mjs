/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['localhost'],
    unoptimized: true,
  },
  // 生产环境优化
  compress: true,
  poweredByHeader: false,
  // 解决 framer-motion 兼容性问题
  transpilePackages: ['framer-motion'],
  // 移动到根级别配置
  serverExternalPackages: ['@prisma/client', 'bcryptjs'],
  experimental: {
    // 移除 optimizePackageImports 来避免 export * 问题
    // optimizePackageImports: ['framer-motion'],
  },
  // 添加 webpack 配置来处理 framer-motion
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
}

export default nextConfig
