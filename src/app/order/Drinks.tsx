import React from 'react';

interface DrinkItem {
  id: number;
  name: string;
  description: string;
  price: number;
  unavailable?: boolean;
}

const drinks: DrinkItem[] = [
  { id: 1, name: 'Coca-Cola Original Taste 1.5L Bottle', description: 'Classic Coca-Cola in a 1.5L bottle', price: 3.00 },
  { id: 2, name: 'Coca-Cola Original Taste 330ml Can', description: 'Classic Coca-Cola in a 330ml can', price: 1.80 },
  { id: 3, name: 'Diet Coke 1.5L Bottle', description: 'Diet Coca-Cola in a 1.5L bottle', price: 3.00 },
  { id: 4, name: 'Diet Coke 330ml Can', description: 'Diet Coca-Cola in a 330ml can', price: 1.80 },
  { id: 5, name: 'Dr Pepper 330ml Can', description: 'Dr Pepper in a 330ml can', price: 1.80 },
  { id: 6, name: '7up 330ml Can', description: '7up lemon-lime soda in a 330ml can', price: 1.80 },
  { id: 7, name: 'Fanta 330ml Can', description: 'Fanta orange soda in a 330ml can', price: 1.80 },
  { id: 8, name: 'Pepsi 330ml Can', description: 'Pepsi cola in a 330ml can', price: 1.80 },
  { id: 9, name: 'Coca-Cola - Small', description: 'Small Coca-Cola', price: 0, unavailable: true },
  { id: 10, name: 'Dandelion and burdock 330ml can', description: 'Dandelion and burdock soda in a 330ml can', price: 0, unavailable: true },
];

interface DrinksProps {
  addToCart: (id: number) => void;
}

const Drinks: React.FC<DrinksProps> = ({ addToCart }) => {
  const availableCount = drinks.filter(drink => !drink.unavailable).length;
  const totalCount = drinks.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Drinks</h2>
        <span className="text-sm text-gray-500">{availableCount} of {totalCount} items available</span>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {drinks.map((drink) => (
          <div key={drink.id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
            <div>
              <h3 className={`text-lg font-bold ${drink.unavailable ? 'text-gray-400' : 'text-gray-900'}`}>
                {drink.name}
                {drink.unavailable && <span className="ml-2 text-sm text-red-500">(Unavailable)</span>}
              </h3>
              <p className={`text-sm ${drink.unavailable ? 'text-gray-400' : 'text-gray-600'}`}>
                {drink.description}
              </p>
              {!drink.unavailable && (
                <p className="text-red-600 font-medium mt-1">£{drink.price.toFixed(2)}</p>
              )}
            </div>
            <button 
              onClick={() => !drink.unavailable && addToCart(drink.id)}
              disabled={drink.unavailable}
              className={`px-4 py-2 rounded font-medium transition duration-300 flex items-center ${
                drink.unavailable 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              {drink.unavailable ? (
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
export default Drinks;

// Export the drinks array
export { drinks };
