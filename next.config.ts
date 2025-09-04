import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["testing.indiantadka.eu", 'http://localhost:4000/api/v1','flagcdn.com',"static.takeaway.com",'www.paypalobjects.com',], // Add your image domain here
  },
};

export default nextConfig;
