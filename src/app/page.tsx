import Image from "next/image";
import Link from "next/link";
import Hero from "@/components/Hero";
import FeaturedDishes from "@/components/FeaturedDishes";
import Testimonials from "@/components/Testimonials";
import InfoDialog from "@/components/InfoDialog";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />
      
      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Welcome to Mr. Phung's Takeaway</h2>
              <p className="text-lg text-gray-600 mb-4">
                For over 27 years, we've been serving authentic Chinese cuisine in Leeds. Our recipes have been passed down through generations, bringing the true flavors of China to your doorstep.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                We use only the freshest ingredients and traditional cooking methods to ensure every dish is packed with flavor and prepared to perfection.
              </p>


              <Link href="/about" className="inline-block bg-red-600 text-white px-6 py-3 rounded-md font-medium hover:bg-red-700 transition duration-300">
                Learn More About Us
              </Link>
            </div>
            <div className="relative h-96 rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/chinese-5.png"
                alt="Delicious Chinese cuisine from Mr. Phung's Takeaway"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Reviews / Testimonials Section */}
      <Testimonials />

      {/* Call to Action Section */}
      <section className="py-16 bg-red-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Order?</h2>
          <p className="text-xl text-white opacity-90 mb-8 max-w-3xl mx-auto">
            Experience the authentic taste of Chinese cuisine from Mr. Phung's Takeaway today
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/order" className="inline-block bg-white text-red-600 px-8 py-3 rounded-md font-medium text-lg hover:bg-gray-100 transition duration-300">
              Order Now
            </Link>
            <InfoDialog />
          </div>
        </div>
      </section>
    </div>
  );
}
