import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
  return (
    <div className="relative bg-gray-900 overflow-hidden">
      {/* Dark overlay for better text visibility */}
      <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
      
      {/* Background image - we'll use a placeholder until we have the actual images */}
      <div className="absolute inset-0">
        <div className="w-full h-full bg-cover bg-center">
          {/* This will be replaced with your actual image */}
          <div className="w-full h-full bg-gradient-to-r from-red-800 to-orange-700"></div>
        </div>
      </div>
      
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="text-center md:text-left md:max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Authentic Chinese Cuisine
          </h1>
          <p className="text-xl md:text-2xl text-white opacity-90 mb-8">
            Experience the finest flavors of traditional Chinese dishes, freshly prepared and delivered to your door.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/order" className="inline-flex items-center justify-center bg-red-600 text-white px-10 py-4 rounded-lg font-bold text-xl hover:bg-red-700 transform hover:scale-105 transition-all duration-300 shadow-lg">
              🥡 Order Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
