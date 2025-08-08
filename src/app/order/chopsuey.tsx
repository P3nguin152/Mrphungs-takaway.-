import React from 'react';

interface SideOption {
  id: string;
  name: string;
  price: number;
}

interface ChopsueyItem {
  id: number;
  name: string;
  description: string;
  price: number;
  unavailable?: boolean;
  includes?: string;
}

const chopsuey: ChopsueyItem[] = [
  { id: 1, name: 'Fried King Prawn Chop Suey', description: 'Including boiled rice OR chips OR fried rice (50p extra)', price: 7.50 },
  { id: 2, name: 'Fried Chicken Chop Suey', description: 'Including boiled rice OR chips OR fried rice (50p extra)', price: 7.30 },
  { id: 3, name: 'Fried Beef Chop Suey', description: 'Including boiled rice OR chips OR fried rice (50p extra)', price: 7.50 },
  { id: 4, name: 'Fried Pork Chop Suey', description: 'Including boiled rice OR chips OR fried rice (50p extra)', price: 7.30 },
  { id: 5, name: 'Special Chop Suey', description: 'Including boiled rice OR chips OR fried rice (50p extra)', price: 8.20 },
  { id: 6, name: 'Roast Pork Chop Suey', description: 'Including boiled rice OR chips OR fried rice (50p extra)', price: 7.50 },
];

interface ChopsueyProps {
  addToCart: (id: number, options?: { side?: string; price?: number }) => void;
}

const sideOptions: SideOption[] = [
  { id: 'rice', name: 'Boiled Rice', price: 0 },
  { id: 'chips', name: 'Chips', price: 0 },
  { id: 'fried-rice', name: 'Fried Rice', price: 0.5 },
];

const Chopsuey: React.FC<ChopsueyProps> = ({ addToCart }) => {
  const [selectedSides, setSelectedSides] = React.useState<Record<number, string>>({});
  
  const handleSideChange = (itemId: number, sideId: string) => {
    setSelectedSides(prev => ({
      ...prev,
      [itemId]: sideId
    }));
  };
  
  const handleAddToCart = (item: ChopsueyItem) => {
    const selectedSide = selectedSides[item.id] || 'rice';
    const sideOption = sideOptions.find(option => option.id === selectedSide);
    const totalPrice = item.price + (sideOption?.price || 0);
    
    addToCart(item.id, {
      side: selectedSide,
      price: totalPrice
    });
  };
  const availableCount = chopsuey.filter(chopsuey => !chopsuey.unavailable).length;
  const totalCount = chopsuey.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Chop Suey Dishes</h2>
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
        {chopsuey.map((chopsuey) => (
          <div key={chopsuey.id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
            <div>
              <h3 className={`text-lg font-bold ${chopsuey.unavailable ? 'text-gray-400' : 'text-gray-900'}`}>
                {chopsuey.name}
                {chopsuey.unavailable && <span className="ml-2 text-sm text-red-500">(Unavailable)</span>}
              </h3>
              <p className={`text-sm ${chopsuey.unavailable ? 'text-gray-400' : 'text-gray-600'}`}>
                {chopsuey.description}
              </p>
              {!chopsuey.unavailable && (
                <div className="mt-2 space-y-2">
                  <p className="text-xs font-medium text-gray-700">Choose 1 side (50p extra for Fried Rice):</p>
                  <div className="flex flex-wrap gap-3">
                    {sideOptions.map((option) => (
                      <label key={option.id} className="flex items-center text-sm">
                        <input
                          type="radio"
                          name={`side-${chopsuey.id}`}
                          value={option.id}
                          checked={(selectedSides[chopsuey.id] || 'rice') === option.id}
                          onChange={() => handleSideChange(chopsuey.id, option.id)}
                          className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                        />
                        <span className="ml-2">
                          {option.name} {option.price > 0 ? `(+£${option.price.toFixed(2)})` : ''}
                        </span>
                      </label>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">{chopsuey.includes}</p>
                </div>
              )}
              {!chopsuey.unavailable && (
                <p className="text-red-600 font-medium mt-1">
                  £{chopsuey.price.toFixed(2)}
                  {selectedSides[chopsuey.id] === 'fried-rice' && (
                    <span className="text-gray-500 ml-1">+ £0.50 = £{(chopsuey.price + 0.5).toFixed(2)}</span>
                  )}
                </p>
              )}
            </div>
            <button 
              onClick={() => !chopsuey.unavailable && handleAddToCart(chopsuey)}
              disabled={chopsuey.unavailable}
              className={`px-4 py-2 rounded font-medium transition duration-300 flex items-center ${
                chopsuey.unavailable 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              {chopsuey.unavailable ? (
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
export default Chopsuey;

// Export the chopsuey items array
export { chopsuey };
