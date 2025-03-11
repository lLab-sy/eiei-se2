import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images:{
    domains:['drive.google.com',"awsbucketeiei.s3.us-east-1.amazonaws.com","ackbucket01.s3.us-east-1.amazonaws.com", "eiei-sprint-se2.s3.us-east-1.amazonaws.com"]
  }
};

export default nextConfig;
