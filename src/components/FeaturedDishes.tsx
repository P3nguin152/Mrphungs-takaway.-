import Image from 'next/image';
import Link from 'next/link';

export default function FeaturedDishes() {
  const dishes = [
    {
      id: 1,
      name: "Special Fried Rice",
      description: "Our signature fried rice with vegetables, egg, and your choice of protein",
      price: "£8.95",
      imagePath: "/images/dish1.jpg"
    },
    {
      id: 2,
      name: "Steamed Dumplings",
      description: "Traditional Chinese dumplings served with dipping sauce",
      price: "£6.50",
      imagePath: "/images/dish2.jpg"
    },
    {
      id: 3,
      name: "Spring Rolls",
      description: "Crispy spring rolls filled with vegetables and served with sweet chili sauce",
      price: "£5.95",
      imagePath: "/images/dish3.jpg"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Most Popular Dishes</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Enjoy our chef's selection of authentic Chinese cuisine, prepared with the finest ingredients
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dishes.map((dish) => (
            <div key={dish.id} className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:-translate-y-2">
              <div className="relative h-64 w-full">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-orange-500 animate-pulse">
                  {/* Placeholder for images */}
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{dish.name}</h3>
                  <span className="text-lg font-semibold text-red-600">{dish.price}</span>
                </div>
                <p className="text-gray-600 mb-4">{dish.description}</p>
                <Link href="/order" className="inline-block bg-red-600 text-white px-4 py-2 rounded font-medium hover:bg-red-700 transition duration-300">
                  Add to Order
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link href="/menu" className="inline-block border-2 border-red-600 text-red-600 px-6 py-3 rounded-md font-medium hover:bg-red-600 hover:text-white transition duration-300">
            View Full Menu
          </Link>
        </div>
      </div>
    </section>
  );
}
