// src/app/series/[id]/ReviewsSection.tsx

"use client";

// Import useCallback along with the other hooks
import { useState, useEffect, FormEvent, useCallback } from 'react';
import { useAuth } from '@/components/AuthButtons'; // Import the useAuth hook

// Define the structure of a review object
interface Review {
  id: number;
  rating: number;
  body: string;
  created_at: string;
  user: {
    name: string;
    image: string;
  };
}

export default function ReviewsSection({ seriesId }: { seriesId: number }) {
  const { isAuthenticated, user, token } = useAuth(); // Use custom auth hook

  // State variables to manage data and UI status
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newRating, setNewRating] = useState(8);
  const [newBody, setNewBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Define fetchReviews outside of useEffect, wrapped in useCallback.
  // This makes it a stable function that can be used as a dependency and called from anywhere.
  const fetchReviews = useCallback(async () => {
    setIsLoading(true);
    try {
      const apiUrl = `https://manga-api.warpe.workers.dev/api/series/${seriesId}/reviews`;
      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error("Failed to fetch reviews.");
      const data = await res.json();
      setReviews(data);
    } catch (err) {
      if (err instanceof Error) {
        setError("Could not load reviews. Please try refreshing the page.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [seriesId]); // It only re-creates this function if seriesId changes.

  // This hook now calls the stable fetchReviews function once on load.
  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]); // The dependency is now the stable function itself.

  // This function handles the form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!isAuthenticated || !token) { // Check isAuthenticated and token
      setError("You must be signed in to leave a review.");
      setIsSubmitting(false);
      return;
    }

    try {
      const apiUrl = `https://manga-api.warpe.workers.dev/api/series/${seriesId}/reviews`;
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Use actual token from useAuth
        },
        body: JSON.stringify({
          rating: Number(newRating),
          body: newBody,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "An unknown error occurred.");
      }

      // On success, clear the form AND reload the reviews list.
      setNewBody("");
      setNewRating(8);
      fetchReviews();

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // The JSX is unchanged
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-4xl font-extrabold mb-8 text-gray-900">Customer Reviews</h2>

      {/* Review Submission Form */}
      {isAuthenticated ? ( // Use isAuthenticated
        <form onSubmit={handleSubmit} className="mb-12 p-8 bg-white rounded-2xl shadow-lg transition-shadow duration-300 hover:shadow-xl">
          <h3 className="text-2xl font-bold mb-6 text-gray-800">Leave a Review</h3>

          {/* Rating Slider */}
          <div className="mb-6">
            <label htmlFor="rating" className="block font-semibold mb-3 text-gray-700 text-lg">
              Rating: <span className="font-black text-indigo-600">{newRating} / 10</span>
            </label>
            <input
              id="rating"
              type="range"
              min="1"
              max="10"
              value={newRating}
              onChange={(e) => setNewRating(Number(e.target.value))}
              className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-300"
              style={{
                background: `linear-gradient(to right, #4f46e5 ${newRating * 10}%, #e5e7eb ${newRating * 10}%)`
              }}
            />
          </div>

          {/* Review Text Area */}
          <div className="mb-6">
            <label htmlFor="body" className="block font-semibold mb-3 text-gray-700 text-lg">Your Review</label>
            <textarea
              id="body"
              rows={6}
              value={newBody}
              onChange={(e) => setNewBody(e.target.value)}
              maxLength={7500}
              placeholder="Share your thoughts on the series. What did you like or dislike?"
              className="w-full p-4 border border-gray-300 rounded-xl transition-all duration-300 focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 shadow-sm"
              required
            />
          </div>

          {/* Error Message */}
          {error && <p className="text-red-600 mb-6 bg-red-100 p-3 rounded-lg">{error}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg rounded-xl shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed disabled:scale-100"
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      ) : (
        <div className="text-center py-10 bg-gray-50 rounded-xl">
          <p className="text-xl font-semibold text-gray-700">Want to leave a review?</p>
          <p className="text-gray-500">Sign in to share your thoughts with the community.</p>
        </div>
      )}

      {/* Display Reviews Section */}
      <div>
        {isLoading && (
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-600">Loading reviews...</p>
            {/* You can add a spinner here */}
          </div>
        )}

        {!isLoading && reviews.length === 0 && (
          <div className="text-center py-10 bg-gray-50 rounded-xl">
            <p className="text-xl font-semibold text-gray-700">No reviews yet.</p>
            <p className="text-gray-500">Be the first one to share your thoughts!</p>
          </div>
        )}

        <div className="space-y-8">
          {reviews.map((review) => (
            <div key={review.id} className="p-6 bg-white border-l-4 border-indigo-500 rounded-r-xl shadow-md transition-transform duration-300 hover:scale-102">
              <div className="flex items-center mb-4">
                <img src={review.user.image} alt={review.user.name} className="w-12 h-12 rounded-full mr-4" />
                <div>
                  <p className="font-bold text-gray-800">{review.user.name}</p>
                  <p className="text-sm text-gray-500">{new Date(review.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-baseline justify-between mb-3">
                <p className="text-2xl font-bold text-indigo-600">{review.rating} / 10</p>
              </div>
              <p className="text-gray-800 leading-relaxed">{review.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
