import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images:{
    // domains:['drive.google.com',"awsbucketeiei.s3.us-east-1.amazonaws.com","ackbucket01.s3.us-east-1.amazonaws.com", "eiei-sprint-se2.s3.us-east-1.amazonaws.com", 'eiei-pic.s3.us-east-1.amazonaws.com'],
    remotePatterns: [
      { protocol: 'https', hostname: '**.amazonaws.com', pathname: '/**' },
      { protocol: 'https', hostname: 'drive.google.com', pathname: '/**' },
      { protocol: 'http', hostname: '34.201.133.80', pathname: '/**' },
    ],
    imageSizes: [16, 32, 48, 64, 128, 256, 512],
    deviceSizes: [640, 750, 1080, 1920],
    formats: ['image/webp']
  }
};

export default nextConfig;
