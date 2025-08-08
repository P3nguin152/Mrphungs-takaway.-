import React from 'react';

interface EnglandItem {
  id: number;
  name: string;
  description: string;
  price: number;
  unavailable?: boolean;
  spicy?: boolean;
  includes?: string;
}

const englandDishes: EnglandItem[] = [
  
  { id: 6, name: 'Sirloin Steak with Mushroom & Onion', description: 'Juicy sirloin steak with sautéed mushrooms and onions', price: 9.00 },
  { id: 7, name: 'Mixed Grill with Mushroom & Onion', description: 'A hearty mixed grill platter with mushrooms and onions', price: 9.80 },
  { id: 8, name: 'Roast Chicken', description: 'Tender roast chicken, quarter portion', price: 7.30 },
  { id: 9, name: 'King Prawn Omelette', description: 'Fluffy omelette filled with succulent king prawns', price: 7.50 },
  { id: 10, name: 'Chicken Omelette', description: 'Fluffy omelette with tender chicken pieces', price: 7.30 },
  { id: 11, name: 'Roast Pork Omelette', description: 'Fluffy omelette with savory roast pork', price: 7.50 },
  { id: 12, name: 'Mushroom Omelette', description: 'Fluffy omelette with sautéed mushrooms', price: 7.00 }
];

interface EnglandProps {
  addToCart: (id: number) => void;
}

const England: React.FC<EnglandProps> = ({ addToCart }) => {
  const availableCount = englandDishes.filter(dish => !dish.unavailable).length;
  const totalCount = englandDishes.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">English Dishes</h2>
        <span className="text-sm text-gray-500">{availableCount} items</span>
      </div>
      <p className="text-sm text-gray-600 mb-4">Including chips & peas otherwise stated</p>
      <div className="grid grid-cols-1 gap-4">
        {englandDishes.map((dish) => (
          <div key={dish.id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
            <div>
              <h3 className={`text-lg font-bold ${dish.unavailable ? 'text-gray-400' : 'text-gray-900'}`}>
                {dish.name}
                {dish.unavailable && <span className="ml-2 text-sm text-red-500">(Unavailable)</span>}
              </h3>
              <p className={`text-sm ${dish.unavailable ? 'text-gray-400' : 'text-gray-600'}`}>
                {dish.description}
                {dish.spicy && <span className="ml-2 text-red-600">🌶️ Spicy</span>}
              </p>
              {dish.includes && (
                <p className="text-xs text-gray-500 mt-1">{dish.includes}</p>
              )}
              {!dish.unavailable && (
                <p className="text-red-600 font-medium mt-1">£{dish.price.toFixed(2)}</p>
              )}
            </div>
            <button 
              onClick={() => !dish.unavailable && addToCart(dish.id)}
              disabled={dish.unavailable}
              className={`px-4 py-2 rounded font-medium transition duration-300 flex items-center ${
                dish.unavailable 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              {dish.unavailable ? (
                'Unavailable'
              ) : (
                <>
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Export the component as default
export default England;

// Export the englandDishes array
export { englandDishes };
