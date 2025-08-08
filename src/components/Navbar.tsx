"use client";
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md w-full fixed top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-red-600">Mr. Phung's</span>
              <span className="ml-1 text-xl font-medium">Takeaway</span>
            </Link>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-red-600 px-3 py-2 font-medium">
              Home
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-red-600 px-3 py-2 font-medium">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-red-600 px-3 py-2 font-medium">
              Contact
            </Link>
            <Link href="/order" 
              className="bg-red-600 text-white px-6 py-2.5 rounded-lg font-bold text-lg hover:bg-red-700 transform hover:scale-105 transition-all duration-300 shadow-lg">
              🥡 Order Now
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-red-600 hover:bg-gray-100 focus:outline-none"
            >
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
            <Link href="/about" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}>
              About
            </Link>
            <Link href="/contact" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}>
              Contact
            </Link>
            <Link href="/order" 
              className="block px-3 py-2 rounded-lg text-base font-bold bg-red-600 text-white hover:bg-red-700"
              onClick={() => setIsMenuOpen(false)}>
              🥡 Order Now
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
