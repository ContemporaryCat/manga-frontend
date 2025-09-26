// src/components/FontAwesomeLoader.tsx

"use client"; // This is CRITICAL. It marks this as a Client Component.

import { useEffect } from 'react';

export default function FontAwesomeLoader() {
  useEffect(() => {
    // This effect runs once in the client's browser after the component mounts.
    // We find the <link> tag we preloaded and switch its 'media' attribute.
    const link = document.querySelector('link[rel="preload"][href*="font-awesome"]');
    if (link) {
      link.setAttribute('media', 'all');
    }
  }, []); // The empty dependency array ensures this runs only once.

  // This component doesn't render anything visible to the user.
  return null;
}