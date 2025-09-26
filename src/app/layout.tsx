import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "XuWei",
  description: "A Comic and Novel Site",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* --- THIS IS THE FIX --- */}
        {/* Preload the stylesheet without blocking rendering */}
        <link rel="preload" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" as="style" />
        
        {/* Apply the stylesheet once it's loaded */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" media="print" onLoad={(e) => (e.currentTarget.media = 'all')} />
        
        {/* Fallback for browsers without JavaScript */}
        <noscript>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
        </noscript>
        {/* --------------------- */}
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
