import React from 'react';

interface AppetizerItem {
  id: number;
  name: string;
  description: string;
  price: number;
  unavailable?: boolean;
}

const appetizers: AppetizerItem[] = [
  { id: 1, name: 'Quarter Duck with Pancake', description: 'Succulent quarter duck served with pancakes', price: 11.00 },
  { id: 2, name: 'Half Duck with Pancake', description: 'Half duck served with pancakes', price: 17.50 },
  { id: 3, name: 'Mixed Starter', description: 'Spring roll (2), prawn toast (2), spare ribs (2), chicken wings (4) & crispy won tons (4)', price: 9.80 },
  { id: 4, name: 'Barbecued Pork Ribs', description: 'Tender pork ribs glazed in barbecue sauce', price: 7.50 },
  { id: 5, name: 'Baked Pork Ribs with Chilli & Salt', description: 'Oven-baked pork ribs with spicy chilli and salt seasoning', price: 7.50 },
  { id: 6, name: 'Fried Pork Ribs with O.K. Sauce', description: 'Crispy fried pork ribs in our special O.K. sauce', price: 7.50 },
  { id: 7, name: 'Fried Chicken Wings with Chilli & Salt', description: 'Crispy fried chicken wings with chilli and salt', price: 6.50 },
  { id: 8, name: 'Fried Chicken Wings with O.K. Sauce', description: 'Crispy fried chicken wings in our special O.K. sauce', price: 6.50 },
  { id: 9, name: 'Crispy Won Ton with Sweet & Sour Sauce (8)', description: '8 pieces of crispy won tons served with sweet and sour sauce', price: 5.00 },
  { id: 10, name: 'Chicken Bites with Chilli & Salt', description: 'Tender chicken bites with chilli and salt seasoning', price: 7.20 },
  { id: 11, name: 'Chips with Chilli & Salt', description: 'Crispy chips seasoned with chilli and salt', price: 4.00 },
];

interface AppetizersProps {
  addToCart: (id: number) => void;
}

const Appetizers: React.FC<AppetizersProps> = ({ addToCart }) => {
  const availableCount = appetizers.filter(appetizer => !appetizer.unavailable).length;
  const totalCount = appetizers.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Appetizers</h2>
        <span className="text-sm text-gray-500">{availableCount} of {totalCount} items available</span>
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
        {appetizers.map((appetizer) => (
          <div key={appetizer.id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
            <div>
              <h3 className={`text-lg font-bold ${appetizer.unavailable ? 'text-gray-400' : 'text-gray-900'}`}>
                {appetizer.name}
                {appetizer.unavailable && <span className="ml-2 text-sm text-red-500">(Unavailable)</span>}
              </h3>
              <p className={`text-sm ${appetizer.unavailable ? 'text-gray-400' : 'text-gray-600'}`}>
                {appetizer.description}
              </p>      
              {!appetizer.unavailable && (
                <p className="text-red-600 font-medium mt-1">£{appetizer.price.toFixed(2)}</p>
              )}
            </div>
            <button 
              onClick={() => !appetizer.unavailable && addToCart(appetizer.id)}
              disabled={appetizer.unavailable}
              className={`px-4 py-2 rounded font-medium transition duration-300 flex items-center ${
                appetizer.unavailable 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              {appetizer.unavailable ? (
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
export default Appetizers;

// Export the appetizers items array
export { appetizers };
