import React, { useState } from 'react';

interface DishOption {
  id: string;
  name: string;
  price: number;
}

interface SetItem {
  id: number;
  name: string;
  description: string;
  price: number;
  priceRange?: string;
  unavailable?: boolean;
  maxDishes: number;
}

const setMeals: SetItem[] = [
  { 
    id: 1, 
    name: 'Set Meal for 2 Persons', 
    description: 'Chicken & sweetcorn soup (2), spring rolls (2), prawn crackers. Choice of any two main dishes plus special fried rice', 
    price: 24.90,
    priceRange: '£24.90',
    maxDishes: 2
  },
  { 
    id: 2, 
    name: 'Set Meal for 3 Persons', 
    description: 'Chicken & sweetcorn soup (3), barbecued spare ribs, prawn crackers, spring rolls (3). Choice of any three main dishes plus special fried rice', 
    price: 35.90,
    priceRange: '£35.90',
    maxDishes: 3
  },
  { 
    id: 3, 
    name: 'Set Meal for 4 Persons', 
    description: 'Chicken & sweetcorn soup (4), spare ribs with chilli & salt, spring rolls (4), prawn crackers. Choice of any four main dishes plus special fried rice', 
    price: 44.90,
    priceRange: '£44.90',
    maxDishes: 4
  }
];

interface SetProps {
  addToCart: (id: number, options?: { selectedDishes?: string[] }) => void;
}

const dishOptions: DishOption[] = [
  { id: 'beef-chow-mein', name: 'Beef Chow Mein', price: 0 },
  { id: 'beef-chow-mein-veg', name: 'Beef Chow Mein with Mixed Vegetables & Gravy', price: 0 },
  { id: 'beef-satay', name: 'Beef Satay', price: 0 },
  { id: 'beef-cashew', name: 'Beef with Cashew Nuts', price: 0 },
  { id: 'pork-cantonese', name: 'Cantonese Roast Lean Pork with Soy Sauce', price: 0 },
  { id: 'chicken-chow-mein', name: 'Chicken Chow Mein', price: 0 },
  { id: 'chicken-chow-mein-veg', name: 'Chicken Chow Mein with Mixed Vegetables & Gravy', price: 0 },
  { id: 'chicken-egg-foo-yung', name: 'Chicken Egg Foo Yung', price: 0 },
  { id: 'chicken-omelette', name: 'Chicken Omelette', price: 0 },
  { id: 'chicken-satay', name: 'Chicken Satay', price: 0 },
  { id: 'chicken-cashew', name: 'Chicken with Cashew Nuts', price: 0 },
  { id: 'crispy-chicken-orange', name: 'Crispy Chicken in Orange Sauce', price: 0 },
  { id: 'crispy-beef-chilli', name: 'Crispy Shredded Beef with Chilli & Honey Sauce', price: 0 },
  { id: 'crispy-chicken-chilli', name: 'Crispy Shredded Chicken with Chilli', price: 0 },
  { id: 'curry-beef', name: 'Curry Beef', price: 0 },
  { id: 'curry-chicken', name: 'Curry Chicken', price: 0 },
  { id: 'curry-king-prawn', name: 'Curry King Prawn', price: 0 },
  { id: 'curry-veg', name: 'Curry Mixed Vegetables', price: 0 },
  { id: 'curry-pork', name: 'Curry Pork', price: 0 },
  { id: 'curry-duck', name: 'Curry Roast Duck', price: 0 },
  { id: 'curry-shrimp', name: 'Curry Shrimp', price: 0 },
  { id: 'king-prawn-balls', name: 'Deep Fried King Prawn Balls', price: 0 },
  { id: 'fish-chips', name: 'Fish & Chips', price: 0 },
  { id: 'beef-chop-suey', name: 'Fried Beef Chop Suey', price: 0 },
  { id: 'beef-ok-sauce', name: 'Fried Beef in O.K. Sauce', price: 0 },
  { id: 'beef-bamboo', name: 'Fried Beef with Bamboo Shoots', price: 0 },
  { id: 'beef-beansprout', name: 'Fried Beef with Bean Sprouts', price: 0 },
  { id: 'beef-kungbo', name: 'Fried Beef with Cashew Nuts & Kung Bo Sauce', price: 0 },
  { id: 'beef-blackbean', name: 'Fried Beef with Green Pepper & Black Bean Sauce', price: 0 },
  { id: 'beef-mushroom', name: 'Fried Beef with Mushroom', price: 0 },
  { id: 'beef-onion', name: 'Fried Beef with Onion in Gravy Sauce', price: 0 },
  { id: 'beef-pineapple', name: 'Fried Beef with Pineapple', price: 0 },
  { id: 'beef-ginger', name: 'Fried Beef with Spring Onion & Ginger', price: 0 },
  { id: 'beef-tomato', name: 'Fried Beef with Tomato', price: 0 }
  // Add more dishes as needed
];

const Set: React.FC<SetProps> = ({ addToCart }) => {
  const [selectedDishes, setSelectedDishes] = useState<{[key: number]: string[]}>({});
  const availableCount = setMeals.filter(meal => !meal.unavailable).length;
  const totalCount = setMeals.length;

  const handleDishToggle = (setId: number, dishId: string) => {
    setSelectedDishes(prev => {
      const currentSelection = prev[setId] || [];
      const meal = setMeals.find(meal => meal.id === setId);
      const maxDishes = meal?.maxDishes || 0;
      
      if (currentSelection.includes(dishId)) {
        return {
          ...prev,
          [setId]: currentSelection.filter(id => id !== dishId)
        };
      } else if (currentSelection.length < maxDishes) {
        return {
          ...prev,
          [setId]: [...currentSelection, dishId]
        };
      }
      return prev;
    });
  };

  const handleAddToCartWithDishes = (setItem: SetItem) => {
    const dishes = selectedDishes[setItem.id] || [];
    addToCart(setItem.id, { selectedDishes: dishes });
  };

  return (
    
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Set Meals</h2>
        <span className="text-sm text-gray-500">{availableCount} items</span>
      </div>
      <div className="grid grid-cols-1 gap-6">
        {setMeals.map((setItem) => (
          <div key={setItem.id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="mb-4">
              <h3 className="font-medium text-xl">{setItem.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{setItem.description}</p>
              <p className="text-red-600 font-medium mt-2">{setItem.priceRange}</p>
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

            {!setItem.unavailable && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">
                    Choose {setItem.maxDishes} main dish{setItem.maxDishes > 1 ? 'es' : ''}:
                    <span className="ml-2 text-sm font-normal text-gray-500">
                      ({selectedDishes[setItem.id]?.length || 0} of {setItem.maxDishes} selected)
                    </span>
                  </h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto p-3 border rounded bg-gray-50">
                  {dishOptions.map((dish) => (
                    <label 
                      key={dish.id}
                      className={`flex items-center p-2 rounded transition-colors ${
                        (selectedDishes[setItem.id] || []).includes(dish.id)
                          ? 'bg-red-50 border border-red-200'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={(selectedDishes[setItem.id] || []).includes(dish.id)}
                        onChange={() => handleDishToggle(setItem.id, dish.id)}
                        disabled={
                          !(selectedDishes[setItem.id] || []).includes(dish.id) &&
                          (selectedDishes[setItem.id]?.length || 0) >= setItem.maxDishes
                        }
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm">
                        {dish.name}
                        {dish.price > 0 && (
                          <span className="text-green-600 ml-1">+£{dish.price.toFixed(2)}</span>
                        )}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => handleAddToCartWithDishes(setItem)}
                disabled={
                  setItem.unavailable ||
                  (selectedDishes[setItem.id]?.length || 0) < setItem.maxDishes
                }
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  setItem.unavailable || (selectedDishes[setItem.id]?.length || 0) < setItem.maxDishes
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                {setItem.unavailable 
                  ? 'Unavailable' 
                  : (selectedDishes[setItem.id]?.length || 0) < setItem.maxDishes
                    ? `Select ${setItem.maxDishes - (selectedDishes[setItem.id]?.length || 0)} more`
                    : 'Add to Cart'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Export the component as default
export default Set;

// Export the set items array
export { setMeals };
