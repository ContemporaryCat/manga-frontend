import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import FontAwesomeLoader from "@/components/FontAwesomeLoader";
import { AuthProvider, useAuth } from "@/context/AuthContext"; // Import AuthProvider and useAuth
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "XuWei",
  description: "A Comic and Novel Site",
};

// TopBar component to display user info
function TopBar() {
  const { isAuthenticated, user, logout, isLoadingAuth } = useAuth();

  if (isLoadingAuth) {
    return <div className="p-4 bg-gray-800 text-white text-right">Loading...</div>;
  }

  return (
    <div className="p-4 bg-gray-800 text-white flex justify-between items-center">
      <Link href="/" className="text-xl font-bold hover:text-gray-300">
        Manga App
      </Link>
      <div>
        {isAuthenticated ? (
          <>
            <span className="mr-4">Welcome, {user?.name}</span>
            <button onClick={logout} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
              Sign out
            </button>
          </>
        ) : (
          <Link href="/login" className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
}

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
        <AuthProvider> {/* Wrap the entire app with AuthProvider */}
          <TopBar /> {/* Include the TopBar */}
          <FontAwesomeLoader />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}