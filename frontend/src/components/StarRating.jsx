import React from 'react';
import { assets } from '../assets/assets'; // Assuming you have star assets here, or I can use unicode/svg

const StarRating = ({ rating }) => {
  // Using simple unicode stars for zero-dependency implementation or simple SVGs if assets not available
  const stars = [];
  
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(
        <span key={i} className="text-orange-500 text-lg">★</span>
      );
    } else {
      stars.push(
        <span key={i} className="text-gray-300 text-lg">★</span>
      );
    }
  }

  return (
    <div className="flex">
      {stars}
    </div>
  );
};

export default StarRating;
