import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-blue-600">FlyVoyages</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link to="/" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-blue-500">
                Home
              </Link>
              <Link to="/destinations" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-blue-500">
                Destinations
              </Link>
              <Link to="/contact" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-blue-500">
                Contact
              </Link>
            </div>
          </div>

          {/* Numéro de téléphone */}
          <div className="hidden sm:flex items-center">
            <a
              href="tel:+213123456789"
              className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors duration-300"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <span className="font-medium">Contactez-nous</span>
              <span className="ml-2 font-semibold">+213 123 456 789</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 