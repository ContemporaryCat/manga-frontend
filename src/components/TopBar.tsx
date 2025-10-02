"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function TopBar() {
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