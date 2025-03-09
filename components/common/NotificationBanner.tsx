import React from 'react';
import Link from 'next/link';

const NotificationBanner = () => {
  return (
    <div className="w-full bg-red-600 text-white py-2 text-center z-[101]">
      <div className="container mx-auto px-4">
        <p className="text-sm md:text-base font-medium">
          DotNames Quests are live! Earn NAMES points for exciting rewards{' '}
          <Link 
            href="#"
            className="underline hover:text-gray-200 transition-colors font-semibold"
          >
            here
          </Link>{' '}
          <span role="img" aria-label="reward">💰</span>
        </p>
      </div>
    </div>
  );
};

export default NotificationBanner;