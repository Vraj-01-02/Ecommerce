import React, { useState, useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import StarRating from "./StarRating";
import { assets } from "../assets/assets";

const ReviewSection = ({ product, fetchProductData }) => {
  const { backendUrl, token } = useContext(ShopContext);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Calculate Breakdown
  const totalReviews = product.numReviews || 0;
  const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

  if (product.reviews) {
    product.reviews.forEach((r) => {
      ratingCounts[r.rating] = (ratingCounts[r.rating] || 0) + 1;
    });
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error("Please login to write a review");
      return;
    }

    try {
      setSubmitting(true);
      const response = await axios.post(
        backendUrl + "/api/product/reviews",
        { rating, comment, productId: product._id },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Review Added");
        setComment("");
        setRating(5);
        setShowForm(false);
        await fetchProductData();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-20 border-t pt-10 px-4 sm:px-0">
      <h3 className="text-2xl font-bold mb-8">Customer Reviews</h3>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* LEFT COLUMN: STATS & BREAKDOWN */}
        <div className="w-full lg:w-1/3 space-y-6">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <span className="text-5xl font-bold text-gray-900">
                {product.averageRating?.toFixed(1) || "0.0"}
              </span>
              <div className="mt-2 scale-110 origin-left">
                <StarRating rating={Math.round(product.averageRating || 0)} />
              </div>
              <span className="text-gray-500 mt-2">
                Based on {totalReviews} reviews
              </span>
            </div>
          </div>

          {/* Progress Bars */}
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = ratingCounts[star];
              const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-3 text-sm">
                  <span className="w-8 text-right font-medium text-indigo-600">
                    {star} ★
                  </span>
                  <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="w-10 text-right text-gray-500">
                    {Math.round(percentage)}%
                  </span>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="w-full mt-6 bg-transparent border-2 border-indigo-600 text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
          >
            {showForm ? "Cancel Review" : "Write a Review"}
          </button>
        </div>

        {/* RIGHT COLUMN: REVIEWS LIST & FORM */}
        <div className="w-full lg:w-2/3">
          {/* REVIEW FORM (Toggleable) */}
          {showForm && (
            <form
              onSubmit={handleSubmitReview}
              className="mb-10 bg-gray-50 p-6 rounded-xl border border-gray-200 animate-fade-in"
            >
              <h4 className="text-lg font-bold mb-4">Share you experience</h4>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`text-2xl transition-transform hover:scale-110 ${
                        star <= rating ? "text-yellow-400" : "text-gray-300"
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Review</label>
                <textarea
                  className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                  rows="4"
                  placeholder="What did you like or dislike?"
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium shadow-md hover:bg-indigo-700 disabled:bg-gray-400 transition-all"
              >
                {submitting ? "Posting..." : "Submit Review"}
              </button>
            </form>
          )}

          {/* REVIEWS LIST */}
          <div className="space-y-6">
            {product.reviews && product.reviews.length > 0 ? (
              product.reviews.map((review, index) => (
                <div key={index} className="border-b last:border-0 pb-6 last:pb-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow-sm">
                      {review.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900">{review.name}</p>
                        <div className="flex items-center gap-2">
                            <div className="flex text-xs text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                    <span key={i} className={i < review.rating ? "text-yellow-400" : "text-gray-200"}>★</span>
                                ))}
                            </div>
                            {/* VERIFIED BADGE */}
                            {review.isVerifiedPurchase && (
                                <span className="text-xs text-green-600 font-medium flex items-center gap-0.5">
                                    <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Verified Purchase
                                </span>
                            )}
                        </div>
                    </div>
                    <span className="ml-auto text-xs text-gray-400">
                        {new Date(review.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <p className="text-gray-500">No reviews yet. Be the first to share your thoughts!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewSection;
