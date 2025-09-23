// src/app/series/[id]/ReviewsSection.tsx

"use client"; // This directive is ESSENTIAL. It marks this as a Client Component.

import { useState, useEffect, FormEvent } from 'react';

// Define the structure of a review object
interface Review {
  id: number;
  rating: number;
  body: string;
  created_at: string;
}

export default function ReviewsSection({ seriesId }: { seriesId: number }) {
  // React state variables to manage data and UI status
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newRating, setNewRating] = useState(8);
  const [newBody, setNewBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // This function fetches the list of reviews from our API
  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      // ========================================================================
      //  IMPORTANT: Replace this URL with your actual deployed Worker URL
      // ========================================================================
      const apiUrl = `https://manga-api.warpe.workers.dev/api/series/${seriesId}/reviews`;
      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error("Failed to fetch reviews.");
      const data = await res.json();
      setReviews(data);
    } catch (err) {
      setError("Could not load reviews. Please try refreshing the page.");
    } finally {
      setIsLoading(false);
    }
  };

  // This hook calls fetchReviews() once when the component first loads
  useEffect(() => {
    fetchReviews();
  }, [seriesId]);

  // This function handles the form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); // Prevent the browser from reloading the page
    setIsSubmitting(true);
    setError(null);

    try {
      const apiUrl = `https://manga-api.warpe.workers.dev/api/series/${seriesId}/reviews`;
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: Number(newRating), body: newBody }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "An unknown error occurred.");
      }

      // On success, clear the form and reload the reviews list
      setNewBody("");
      setNewRating(8);
      fetchReviews();

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-gray-900">Reviews</h2>
      <form onSubmit={handleSubmit} className="mb-10 p-6 border border-gray-200 rounded-lg bg-gray-50">
        <h3 className="text-xl font-semibold mb-4">Leave a Review</h3>
        <div className="mb-4">
          <label htmlFor="rating" className="block font-medium mb-2 text-gray-700">Rating: <span className="font-bold">{newRating} / 10</span></label>
          <input id="rating" type="range" min="1" max="10" value={newRating} onChange={(e) => setNewRating(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
        </div>
        <div className="mb-4">
          <label htmlFor="body" className="block font-medium mb-2 text-gray-700">Review Text</label>
          <textarea id="body" rows={5} value={newBody} onChange={(e) => setNewBody(e.target.value)} maxLength={7500} placeholder="What did you think of this series?" className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" required />
        </div>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed">
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </button>
      </form>
      <div>
        {isLoading && <p>Loading reviews...</p>}
        {!isLoading && reviews.length === 0 && <p>No reviews yet. Be the first!</p>}
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="p-4 border border-gray-200 rounded-lg">
              <p className="text-xl font-bold text-gray-800">{review.rating} / 10</p>
              <p className="my-2 text-gray-700">{review.body}</p>
              <p className="text-sm text-gray-500">Posted on: {new Date(review.created_at).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}