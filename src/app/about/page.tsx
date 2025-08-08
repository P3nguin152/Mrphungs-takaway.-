import Image from 'next/image';
import Link from 'next/link';

export default function About() {
  return (
    <div className="min-h-screen pt-8 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">About Mr. Phung's Takeaway</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Authentic Chinese cuisine Leeds since 1998
          </p>
        </div>
        
        {/* Our Story Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <div className="relative h-96 rounded-lg overflow-hidden shadow-xl">
            <Image
              src="/chinese-6.png"
              alt="Mr. Phung's Takeaway - Authentic Chinese Cuisine"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <p className="text-lg text-gray-600 mb-4">
              Mr. Phung's Takeaway was established in 1998 by Chef Phung, who brought his culinary expertise from China to Leeds, UK. What started as a small family business has grown into one of the most beloved Chinese takeaways in the area.
            </p>
            <p className="text-lg text-gray-600 mb-4">
              Our recipes have been passed down through generations, bringing the authentic flavors of traditional Chinese cuisine to your doorstep. We take pride in using only the freshest ingredients and traditional cooking methods.
            </p>
            <p className="text-lg text-gray-600">
              Over the years, we've built a loyal customer base who appreciate our commitment to quality, flavor, and excellent service.
            </p>
          </div>
        </div>

        
        
        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Experience Our Food?</h2>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/order" className="inline-block border-2 border-red-600 text-red-600 px-6 py-3 rounded-md font-medium hover:bg-red-600 hover:text-white transition duration-300">
              Order Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
