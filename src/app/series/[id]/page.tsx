// src/app/series/[id]/page.tsx

import ReviewsSection from "./ReviewsSection"; // We will create this component in the next step

// This defines the structure of our series data for TypeScript
interface Series {
  id: number;
  title: string;
  description: string;
}

// This function runs on the server to fetch the static data for the page
async function getSeriesData(id: string): Promise<Series | null> {
  try {
    // ========================================================================
    //  IMPORTANT: Replace the URL below with your actual deployed Worker URL
    //  You got this URL at the end of the backend deployment phase.
    // ========================================================================
    const apiUrl = `https:///manga-api.warpe.workers.dev/api/series/${id}`;

    // This tells Next.js to cache the result for 1 hour (3600 seconds)
    const res = await fetch(apiUrl, { next: { revalidate: 3600 } });

    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Failed to fetch series data:", error);
    return null;
  }
}

// This is the main component for our page
export default async function SeriesPage({ params }: { params: { id: string } }) {
  const series = await getSeriesData(params.id);

  // If the API call fails or the series doesn't exist, show a "not found" message
  if (!series) {
    return <div className="text-center mt-10 text-xl">Series not found.</div>;
  }

  // If the data is found, render the page
  return (
    <main className="max-w-4xl mx-auto p-4 sm:p-8">
      {/* This section is pre-rendered on the server (Static) */}
      <div className="mb-12 border-b border-gray-300 pb-8">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900">{series.title}</h1>
        <p className="text-lg text-gray-700">{series.description}</p>
      </div>

      {/* This section is interactive and will be rendered in the browser (Dynamic) */}
      <ReviewsSection seriesId={series.id} />
    </main>
  );
}