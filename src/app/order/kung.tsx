import React from 'react';

interface SideOption {
  id: string;
  name: string;
  price: number;
}

interface KungItem {
  id: number;
  name: string;
  description: string;
  price: number;
  unavailable?: boolean;
  spicy?: boolean;
  includes?: string;
}

const kungDishes: KungItem[] = [
  { 
    id: 1, 
    name: 'King Prawn with Cashew Nuts & Kung Bo Sauce', 
    description: 'Succulent king prawns with cashew nuts in our signature Kung Bo sauce', 
    price: 7.70,
    spicy: true,
    includes: 'Including boiled rice OR chips OR fried rice (50p extra)'
  },
  { 
    id: 2, 
    name: 'Fried Beef with Cashew Nuts & Kung Bo Sauce', 
    description: 'Tender beef strips with cashew nuts in our signature Kung Bo sauce', 
    price: 7.70,
    spicy: true,
    includes: 'Including boiled rice OR chips OR fried rice (50p extra)'
  },
  { 
    id: 3, 
    name: 'Fried Chicken with Cashew Nuts & Kung Bo Sauce', 
    description: 'Tender chicken pieces with cashew nuts in our signature Kung Bo sauce', 
    price: 7.50,
    spicy: true,
    includes: 'Including boiled rice OR chips OR fried rice (50p extra)'
  },
  { 
    id: 4, 
    name: 'Fried Pork with Cashew Nuts & Kung Bo Sauce', 
    description: 'Juicy pork strips with cashew nuts in our signature Kung Bo sauce', 
    price: 7.50,
    spicy: true,
    includes: 'Including boiled rice OR chips OR fried rice (50p extra)'
  }
];

interface KungProps {
  addToCart: (id: number, options?: { side?: string; price?: number }) => void;
}

const sideOptions: SideOption[] = [
  { id: 'rice', name: 'Boiled Rice', price: 0 },
  { id: 'chips', name: 'Chips', price: 0 },
  { id: 'fried-rice', name: 'Fried Rice', price: 0.5 },
];

const Kung: React.FC<KungProps> = ({ addToCart }) => {
  const [selectedSides, setSelectedSides] = React.useState<Record<number, string>>({});
  
  const handleSideChange = (itemId: number, sideId: string) => {
    setSelectedSides(prev => ({
      ...prev,
      [itemId]: sideId
    }));
  };
  
  const handleAddToCart = (item: KungItem) => {
    const selectedSide = selectedSides[item.id] || 'rice';
    const sideOption = sideOptions.find(option => option.id === selectedSide);
    const totalPrice = item.price + (sideOption?.price || 0);
    
    addToCart(item.id, {
      side: selectedSide,
      price: totalPrice
    });
  };
  const availableCount = kungDishes.filter(dish => !dish.unavailable).length;
  const totalCount = kungDishes.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Kung Bo Dishes</h2>
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
      <p className="text-sm text-gray-600 mb-4">Including boiled rice OR chips OR fried rice (50p extra)</p>
      <div className="grid grid-cols-1 gap-4">
        {kungDishes.map((dish) => (
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
              {!dish.unavailable && (
                <div className="mt-2 space-y-2">
                  <p className="text-xs font-medium text-gray-700">Choose 1 side (50p extra for Fried Rice):</p>
                  <div className="flex flex-wrap gap-3">
                    {sideOptions.map((option) => (
                      <label key={option.id} className="flex items-center text-sm">
                        <input
                          type="radio"
                          name={`side-${dish.id}`}
                          value={option.id}
                          checked={(selectedSides[dish.id] || 'rice') === option.id}
                          onChange={() => handleSideChange(dish.id, option.id)}
                          className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                        />
                        <span className="ml-2">
                          {option.name} {option.price > 0 ? `(+£${option.price.toFixed(2)})` : ''}
                        </span>
                      </label>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">{dish.includes || 'Including boiled rice OR chips OR fried rice (50p extra)'}</p>
                </div>
              )}
              {!dish.unavailable && (
                <p className="text-red-600 font-medium mt-1">
                  £{dish.price.toFixed(2)}
                  {selectedSides[dish.id] === 'fried-rice' && (
                    <span className="text-gray-500 ml-1">+ £0.50 = £{(dish.price + 0.5).toFixed(2)}</span>
                  )}
                </p>
              )}
            </div>
            <button 
              onClick={() => !dish.unavailable && handleAddToCart(dish)}
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
export default Kung;

// Export the Kung array and dishes
export { Kung, kungDishes };
