import React from 'react';

interface FriedRiceItem {
  id: number;
  name: string;
  description: string;
  price: number;
  priceRange?: string;
  additionalInfo?: string;
  unavailable?: boolean;
}

const friedRice: FriedRiceItem[] = [
  { 
    id: 1, 
    name: 'Special Fried Rice', 
    description: 'No chips included', 
    price: 8.20,
    priceRange: 'from £8.20'
  },
  { 
    id: 2, 
    name: 'Spanish Fried Rice', 
    description: 'No chips included',
    price: 8.20,
    priceRange: 'from £8.20'
  },
  { 
    id: 3, 
    name: 'Shang Hai Special Fried Rice', 
    description: 'No chips included',
    additionalInfo: 'Spicy',
    price: 8.20,
    priceRange: 'from £8.20'
  },
  { 
    id: 4, 
    name: 'King Prawn Fried Rice', 
    description: 'No chips included',
    price: 7.50,
    priceRange: 'from £7.50'
  },
  { 
    id: 5, 
    name: 'Chicken Fried Rice', 
    description: 'No chips included',
    price: 7.30,
    priceRange: 'from £7.30'
  },
  { 
    id: 6, 
    name: 'Mince Beef Fried Rice', 
    description: 'No chips included',
    price: 7.50,
    priceRange: 'from £7.50'
  },
  { 
    id: 7, 
    name: 'Roast Pork Fried Rice', 
    description: 'No chips included',
    price: 7.50,
    priceRange: 'from £7.50'
  }
];

interface FriedRiceProps {
  addToCart: (id: number) => void;
}

const FriedRice: React.FC<FriedRiceProps> = ({ addToCart }) => {
  const availableCount = friedRice.filter(friedRice => !friedRice.unavailable).length;
  const totalCount = friedRice.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Fried Rice Dishes</h2>
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
        {friedRice.map((friedRice) => (
          <div key={friedRice.id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
            <div>
              <h3 className={`text-lg font-bold ${friedRice.unavailable ? 'text-gray-400' : 'text-gray-900'}`}>
                {friedRice.name}
                {friedRice.unavailable && <span className="ml-2 text-sm text-red-500">(Unavailable)</span>}
              </h3>
              <p className={`text-sm ${friedRice.unavailable ? 'text-gray-400' : 'text-gray-600'}`}>
                {friedRice.description}
              </p>
              {friedRice.additionalInfo && (
                <p className={`text-sm ${friedRice.unavailable ? 'text-gray-400' : 'text-gray-600'}`}>
                  {friedRice.additionalInfo}
                </p>
              )}
              <p className={`text-sm font-medium ${friedRice.unavailable ? 'text-gray-400' : 'text-amber-600'}`}>
                {friedRice.priceRange}
              </p>      
              {!friedRice.unavailable && (
                <p className="text-red-600 font-medium mt-1">£{friedRice.price.toFixed(2)}</p>
              )}
            </div>
            <button 
              onClick={() => !friedRice.unavailable && addToCart(friedRice.id)}
              disabled={friedRice.unavailable}
              className={`px-4 py-2 rounded font-medium transition duration-300 flex items-center ${
                friedRice.unavailable 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              {friedRice.unavailable ? (
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
export default FriedRice;

// Export the fried rice items array
export { friedRice };
