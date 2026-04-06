/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'nscbajhrfgubywwesnto.supabase.co'], 
  },
  // env wala block yahan se hata do, ab ye .env.local se aayega
};

module.exports = nextConfig;