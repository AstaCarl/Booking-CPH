//Dette er en typeannotation, der fortæller TypeScript (eller andre statisk typed sprog) 
//om typen af objektet, der oprettes. 
//I dette tilfælde angiver det, at nextConfig skal være af typen import('next').NextConfig, 
//hvilket refererer til typen af konfigurationsobjektet, der accepteres af Next.js.
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig
