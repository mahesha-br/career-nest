import React from "react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="w-full h-[82vh] mt-19.5 flex justify-center bg-gray-100">
      <div className="text-center p-6 max-w-md w-full">
        
        <h1 className="text-7xl font-extrabold text-blue-600 mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Page Not Found
        </h2>
        <p className="text-gray-500 mb-4">
          Sorry, the page you are looking for does not exist.
        </p>

        {/* Image */}
        <div className="flex items-center rounded-md w-full h-fit shadow-md shadow-neutral-400 overflow-hidden justify-center mb-8">
          <img
            src="/404.png"
            alt="Page not found"
            className="w-full h-full object-contain"
          />
        </div>

        <Link
          to="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Go Back Home
        </Link>

      </div>
    </div>
  );
}
