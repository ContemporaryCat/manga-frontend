import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import FontAwesomeLoader from "@/components/FontAwesomeLoader"; // MODIFICATION: Import the new component

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "XuWei",
  description: "A Comic and Novel Site",
};

import SessionProvider from "./SessionProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* --- THIS IS THE FIX --- */}
        {/* This part is now static and safe for a Server Component. */}
        {/* It tells the browser to start downloading the CSS early. */}
        <link 
          rel="preload" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" 
          as="style" 
        />
        
        {/* This is a fallback for users with JavaScript disabled. */}
        <noscript>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
        </noscript>
        {/* --------------------- */}
      </head>
      <body className={inter.className}>
        <SessionProvider>
          {/* MODIFICATION: We render the new Client Component here. */}
          {/* It will run in the browser and handle activating the preloaded stylesheet. */}
          <FontAwesomeLoader /> 
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}