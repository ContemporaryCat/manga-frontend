"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext'; // Import useAuth from context
import Link from 'next/link';

export default function AuthButtons() {
  const { isAuthenticated, user, logout, isLoadingAuth } = useAuth();

  if (isLoadingAuth) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    return (
      <>
        <span>Welcome, {user?.name}</span>
        <button onClick={logout} className="ml-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">Sign out</button>
      </>
    );
  }
  return (
    <Link href="/login" className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
      Sign In
    </Link>
  );
}