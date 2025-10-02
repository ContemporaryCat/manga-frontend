import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import FontAwesomeLoader from "@/components/FontAwesomeLoader";
import { AuthProvider } from "@/context/AuthContext"; // Import AuthProvider only
import TopBar from "@/components/TopBar"; // Import TopBar from its new location

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
        <link
          rel="preload"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          as="style"
        />
        <noscript>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
        </noscript>
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <TopBar /> {/* Use the imported TopBar */}
          <FontAwesomeLoader />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}