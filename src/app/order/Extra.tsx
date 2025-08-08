import React from 'react';

interface ExtraItem {
  id: number;
  name: string;
  description: string;
  price: number;
  unavailable?: boolean;
  spicy?: boolean;
  includes?: string;
}

const extras: ExtraItem[] = [
  { id: 1, name: 'Vegetable Rolls', description: 'Crispy vegetable spring rolls', price: 3.50 },
  { id: 2, name: 'Chicken, Mushroom & Noodle Soup', description: 'Hearty soup with chicken, mushrooms, and noodles', price: 3.50 },
  { id: 3, name: 'Chicken & Sweetcorn Soup', description: 'Classic Chinese soup with chicken and sweetcorn', price: 3.50 },
  { id: 4, name: 'Crab Meat & Sweetcorn Soup', description: 'Delicate crab meat with sweetcorn in a light broth', price: 3.50 },
  { id: 5, name: 'Hot & Sour Soup', description: 'Spicy and tangy traditional Chinese soup', price: 3.50 },
  { id: 6, name: 'Spring Roll', description: 'Two in a portion', price: 4.00 },
  { id: 7, name: 'Butterfly Prawn Toast', description: 'Crispy prawn toast with a buttery finish', price: 5.50 },
  { id: 8, name: 'Fried Mushroom', description: 'Golden fried mushrooms', price: 3.50 },
  { id: 9, name: 'Fried Bean Sprout', description: 'Stir-fried fresh bean sprouts', price: 3.50 },
  { id: 10, name: 'Fried Water Chestnuts & Bamboo Shoots', description: 'Crunchy water chestnuts with bamboo shoots', price: 3.50 },
  { id: 11, name: 'Fried Pineapple', description: 'Caramelized pineapple pieces', price: 3.50 },
  { id: 12, name: 'Sweet & Sour Sauce', description: 'Tangy and sweet dipping sauce', price: 3.20 },
  { id: 13, name: 'Curry Sauce', description: 'Mild and aromatic curry sauce', price: 2.50 },
  { id: 14, name: 'Gravy', description: 'Rich and savory gravy', price: 2.50 },
  { id: 15, name: 'Fried Soft Noodles', description: 'Stir-fried egg noodles with vegetables', price: 4.00 },
  { id: 16, name: 'Fried Rice', description: 'Classic Chinese fried rice', price: 4.00 },
  { id: 17, name: 'Chips', description: 'Crispy fried potato chips', price: 2.50 },
  { id: 18, name: 'Deep Fried Onion Rings', description: 'Crispy battered onion rings', price: 4.00 },
  { id: 19, name: 'Mixed Vegetables', description: 'Assorted seasonal vegetables', price: 3.50 },
  { id: 20, name: 'Boiled Rice', description: 'Steamed white rice', price: 3.50 },
  { id: 21, name: 'Prawn Crackers', description: 'Light and crispy prawn crackers', price: 3.00 },
  { id: 22, name: 'Prawn Cocktail', description: 'Classic prawn cocktail with salad', price: 4.50 },
  { id: 23, name: 'Fried Cantonese Soft Noodles', description: 'Stir-fried Cantonese style noodles', price: 4.00 },
  { id: 24, name: 'Cantonese O.K. Sauce', description: 'Special Cantonese sauce', price: 3.20 }
];

interface ExtraProps {
  addToCart: (id: number) => void;
}

const Extra: React.FC<ExtraProps> = ({ addToCart }) => {
  const availableCount = extras.filter(item => !item.unavailable).length;
  const totalCount = extras.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Extras</h2>
        <span className="text-sm text-gray-500">{availableCount} items</span>
      </div>
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              <strong>Do you have a food allergy?</strong> If you have a food allergy or intolerance (or someone you're ordering for has), phone the restaurant on 01132483487. Do not order if you cannot get the allergy information you need.
            </p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {extras.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
            <div>
              <h3 className={`text-lg font-bold ${item.unavailable ? 'text-gray-400' : 'text-gray-900'}`}>
                {item.name}
                {item.unavailable && <span className="ml-2 text-sm text-red-500">(Unavailable)</span>}
              </h3>
              <p className={`text-sm ${item.unavailable ? 'text-gray-400' : 'text-gray-600'}`}>
                {item.description}
                {item.spicy && <span className="ml-2 text-red-600">🌶️ Spicy</span>}
              </p>
              {item.includes && (
                <p className="text-xs text-gray-500 mt-1">{item.includes}</p>
              )}
              {!item.unavailable && (
                <p className="text-red-600 font-medium mt-1">£{item.price.toFixed(2)}</p>
              )}
            </div>
            <button 
              onClick={() => !item.unavailable && addToCart(item.id)}
              disabled={item.unavailable}
              className={`px-4 py-2 rounded font-medium transition duration-300 flex items-center ${
                item.unavailable 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              {item.unavailable ? (
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
export default Extra;

// Export the extra array
export { extras };
