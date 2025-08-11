"use client";
import React, { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Drinks, { drinks as drinksItems } from './Drinks';
import Appetizers, { appetizers as appetizersItems } from './appetizers';
import Curries, { curries as curriesItems } from './curry';
import SweetSour, { sweetSour as sweetSourItems } from './sweet&sour';
import saltsauce, { satay as satayItems } from './saltsauce';
import mushroom, { mushrooms as mushroomItems } from './mushroom';
import Chopsuey, { chopsuey as chopsueyItems } from './chopsuey';
import Tomato, { tomato as tomatoItems } from './tomato';
import Pineapple, { pineapple as pineappleItems } from './pineapple';
import Bamboo, { bamboo as bambooItems } from './bamboo';
import BeanSprout, { beanSprout as beanSproutItems } from './beansprout';
import EggFu, { eggFu as eggFuItems } from './eggfu';
import FriedRice, { friedRice as friedRiceItems } from './friedrice';
import Chowmein, { chowmein as chowmeinItems } from './chowmein';
import Canton, { canton as cantonItems } from './canton';
import Duck, { duck as duckItems } from './duck';
import Chefs, { chefsItems as chefsItems } from './chefs';
import England, { englandDishes as englandItems } from './england';
import Kung, { kungDishes as kungItems } from './kung';
import Cashew, { cashew as cashewItems } from './cashew';
import Extra, { extras as extrasItems } from './Extra';
import Set, { setMeals as setItems } from './set';
import { filterAddresses, filterPostcodes } from './addressData';

// Helper function to generate unique IDs
const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

// Define types
interface MenuItem {
  id: number;
  name: string;
  description?: string;  // Made optional to match CantonItem
  price: number;
}

interface MenuCategory {
  id: string;
  name: string;
  items?: MenuItem[];
  component?: React.ComponentType<{ addToCart: (id: number) => void }>;
  description?: string;
  spicy?: boolean;
}

// Menu data structure
const menuCategories: MenuCategory[] = [
  {
    id: 'drinks',
    name: 'Drinks',
    component: Drinks
  },
  {
    id: 'appetizers',
    name: 'Appetizers',
    component: Appetizers
  },
  {
    id: 'curry-dishes',
    name: 'Curry dishes',
    component: Curries
  },
  {
    id: 'sweet&sour-dishes',
    name: 'Sweet & Sour dishes',
    component: SweetSour
  },
  {
    id: 'saltsauce',
    name: 'Satay Sauce dishes',
    component: saltsauce
  },
  {
    id: 'mushroom',
    name: 'Mushroom dishes',
    component: mushroom
  },
  {
    id: 'chopsuey',
    name: 'Chopsuey dishes',
    component: Chopsuey
  },
  {
    id: 'tomato',
    name: 'Tomato dishes',
    component: Tomato
  },
  {
    id: 'pineapple',
    name: 'Pineapple dishes',
    component: Pineapple
  },
  {
    id: 'bamboo',
    name: 'Bamboo & chestnut dishes',
    component: Bamboo
  },
  {
    id: 'beanSprout',
    name: 'Bean Sprout dishes',
    component: BeanSprout
  },   
  {
    id: 'Egg Foo Yung',
    name: 'Egg Foo Yung dishes',
    component: EggFu
  }, 
  {
    id: 'friedrice',
    name: 'Fried Rice dishes',
    component: FriedRice
  }, 
  {
    id: 'chowmein',
    name: 'Chow mein dishes',
    component: Chowmein
  },
  {
    id: 'canton',
    name: 'Cantonese dishes',
    component: Canton
  },
  {
    id: 'duck',
    name: 'Roast Duck dishes',
    component: Duck
  },
  {
    id: 'england',
    name: 'English dishes',
    component: England
  },
  {
    id: 'chefs',
    name: 'Chef dishes',
    component: Chefs
  },
  {
    id: 'kung',
    name: 'Kung Bo dishes',
    component: Kung
  },
  {
    id: 'cashew',
    name: 'Cashew dishes',
    component: Cashew
  },
  {
  id: 'extras',
  name: 'Extra sides',
  component: Extra
},
{
  id: 'set',
  name: 'Set meals',
  component: Set
},

];

// Flatten all menu items into a single array for easy lookup
const allMenuItems = [
  ...(menuCategories.flatMap(category => category.items || []) || []),
  ...(drinksItems || []),
  ...(appetizersItems || []),
  ...(curriesItems || []),
  ...(sweetSourItems || []),
  ...(satayItems || []),
  ...(mushroomItems || [])
];

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  originalId: number;
  description?: string;
};

const validateCardDetails = (cardDetails: any) => {
  if (!cardDetails.cardNumber || !cardDetails.expiry || !cardDetails.cvc || !cardDetails.nameOnCard) {
    return 'Please fill in all card details';
  }
  const cardNumber = cardDetails.cardNumber.replace(/\s+/g, '');
  if (cardNumber.length < 13 || cardNumber.length > 19) {
    return 'Please enter a valid card number (13-19 digits)';
  }
  if (!/^\d{2}\/\d{2}$/.test(cardDetails.expiry)) {
    return 'Please enter a valid expiry date (MM/YY)';
  }
  if (cardDetails.cvc.length < 3 || cardDetails.cvc.length > 4) {
    return 'Please enter a valid CVC (3-4 digits)';
  }
  return null;
};

const validateCustomerDetails = (customerDetails: any) => {
  if (!customerDetails.name || !customerDetails.phone || !customerDetails.address || !customerDetails.postcode) {
    return 'Please fill in all required customer details';
  }
  return null;
};

export default function Order() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState('drinks');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiry: '',
    cvc: '',
    nameOnCard: ''
  });
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    phone: '',
    address: '',
    postcode: '',
    deliveryNotes: '',
    selectedAddressId: ''
  });

  const handlePostcodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPostcode = e.target.value;
    setCustomerDetails(prev => ({
      ...prev,
      postcode: selectedPostcode
    }));
  };

  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const addToCart = (itemId: number, options?: { side?: string; price?: number; selectedDishes?: string[] }) => {
    const currentCategory = menuCategories.find(cat => cat.id === activeCategory);
    if (!currentCategory) return;
    
    const uniqueId = `${currentCategory.id}_${itemId}`;
    
    let menuItem: MenuItem | undefined;
    
    switch(currentCategory.id) {
      case 'drinks': menuItem = drinksItems.find(item => item.id === itemId); break;
      case 'appetizers': menuItem = appetizersItems.find(item => item.id === itemId); break;
      case 'curry-dishes': menuItem = curriesItems.find(item => item.id === itemId); break;
      case 'sweet&sour-dishes': menuItem = sweetSourItems.find(item => item.id === itemId); break;
      case 'saltsauce': menuItem = satayItems.find(item => item.id === itemId); break;
      case 'mushroom': menuItem = mushroomItems.find(item => item.id === itemId); break;
      case 'chopsuey': menuItem = chopsueyItems.find(item => item.id === itemId); break;
      case 'tomato': menuItem = tomatoItems.find(item => item.id === itemId); break;
      case 'pineapple': menuItem = pineappleItems.find(item => item.id === itemId); break;
      case 'bamboo': menuItem = bambooItems.find(item => item.id === itemId); break;
      case 'beanSprout': menuItem = beanSproutItems.find(item => item.id === itemId); break;
      case 'Egg Foo Yung': menuItem = eggFuItems.find(item => item.id === itemId); break;
      case 'friedrice': menuItem = friedRiceItems.find(item => item.id === itemId); break;
      case 'chowmein': menuItem = chowmeinItems.find(item => item.id === itemId); break;
      case 'canton': menuItem = cantonItems.find(item => item.id === itemId); break;
      case 'duck': menuItem = duckItems.find(item => item.id === itemId); break;
      case 'england': menuItem = englandItems.find(item => item.id === itemId); break;
      case 'chefs': menuItem = chefsItems.find(item => item.id === itemId); break;
      case 'kung': menuItem = kungItems.find((item: MenuItem) => item.id === itemId); break;
      case 'cashew': menuItem = cashewItems.find(item => item.id === itemId); break;
      case 'extras': menuItem = extrasItems.find(item => item.id === itemId); break;
      case 'set': menuItem = setItems.find(item => item.id === itemId); break;
      default: 
        menuItem = currentCategory.items?.find(item => item.id === itemId);
    }
    
    if (!menuItem) return;
    
    setCart((prevCart: CartItem[]) => {
      const selectedDishesText = options?.selectedDishes?.length 
        ? ` (${options.selectedDishes.length} dishes selected)` 
        : '';
      const itemName = menuItem!.name + selectedDishesText + (options?.side ? ` (${options.side})` : '');
      const itemPrice = options?.price !== undefined ? options.price : menuItem!.price;
      
      const existingItem = prevCart.find(item => 
        item.originalId === itemId && 
        item.name === itemName
      );
      
      if (existingItem) {
        return prevCart.map(item => 
          item.id === existingItem.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        return [...prevCart, { 
          id: generateId(),
          originalId: itemId,
          name: itemName,
          price: itemPrice,
          quantity: 1,
          description: options?.side ? `Side: ${options.side}` : ''
        }];
      }
    });
  };
  
  const removeFromCart = (itemId: string) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === itemId);
      
      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map(item => 
          item.id === itemId 
            ? { ...item, quantity: item.quantity - 1 } 
            : item
        );
      } else {
        return prevCart.filter(item => item.id !== itemId);
      }
    });
  };
  
  const router = useRouter();

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Checkout started');
    
    // Validate customer details
    const error = validateCustomerDetails(customerDetails);
    if (error) {
      console.error('Validation error (customer details):', error);
      setShowError(true);
      setIsSubmitting(false);
      return;
    }
    
    // Skip card validation in development
    if (process.env.NODE_ENV !== 'development') {
      const cardError = validateCardDetails(cardDetails);
      if (cardError) {
        console.error('Validation error (card details):', cardError);
        setIsSubmitting(false);
        return;
      }
    } else {
      console.log('Skipping card validation in development mode');
    }
    
    setIsSubmitting(true);
    console.log('Submitting order...');
    
    try {
      // Prepare order data
      const orderData = {
        customerName: customerDetails.name,
        phone: customerDetails.phone,
        deliveryAddress: `${customerDetails.address}, ${customerDetails.postcode}`,
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          description: item.description
        })),
        total: totalPrice,
        deliveryNotes: customerDetails.deliveryNotes,
        status: 'pending'
      };
      
      console.log('Sending order data:', JSON.stringify(orderData, null, 2));
      
      // Send order to the API
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
          console.error('API error response:', errorData);
        } catch (e) {
          console.error('Failed to parse error response:', e);
          throw new Error(`Server returned ${response.status}: ${response.statusText}`);
        }
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Order created successfully:', result);
      
      // Clear cart and redirect to order status page
      setCart([]);
      router.push(`/order-status/${result.orderId}`);
      
    } catch (error) {
      console.error('Checkout error:', error);
      let errorMessage = 'Failed to place order. Please try again.';
      
      if (error instanceof Error) {
        console.error('Error details:', error.message);
        if (error.message.includes('Failed to fetch')) {
          errorMessage = 'Failed to connect to the server. Please check your internet connection.';
        } else if (error.message.includes('validation failed')) {
          errorMessage = 'Please fill in all required fields correctly.';
        } else if (error.message) {
          errorMessage = error.message;
        }
      }
      
      alert(errorMessage);
      setIsSubmitting(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomerDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle address input change (for manual entry)
  const handleAddressInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setCustomerDetails(prev => ({
      ...prev,
      address: value,
      selectedAddressId: '' // Clear selection when manually typing
    }));
  };

  // Handle postcode input change (for manual entry)
  const handlePostcodeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setCustomerDetails(prev => ({
      ...prev,
      postcode: value
    }));
  };



  return (
    <div className="min-h-screen pt-8 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Place Your Order</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Select your favorite dishes, add them to your cart, and place your order. We will contact you to confirm your order and provide you with a delivery time. You will need to pay on dilivery!
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Menu Section */}
          <div className="lg:col-span-2">
            {/* Category Navigation */}
            <div className="flex overflow-x-auto pb-2 mb-6 gap-2 whitespace-nowrap">
              {menuCategories.map((category) => (
                <button
                  key={category.id}
                  className={`px-4 py-2 rounded-full text-sm md:text-base font-medium transition-colors ${
                    activeCategory === category.id
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.name}
                </button>
              ))}
            </div>
            
            {/* Menu Items */}
            <div className="grid grid-cols-1 gap-4 mb-8">
              {(() => {
                const category = menuCategories.find(cat => cat.id === activeCategory);
                if (!category) return null;
                
                if (category.component) {
                  const CategoryComponent = category.component;
                  return <CategoryComponent key={category.id} addToCart={addToCart} />;
                }
                
                return category.items?.map((item) => (
                  <div key={item.id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600">{item.description}</p>
                      <p className="text-red-600 font-medium mt-1">£{item.price.toFixed(2)}</p>
                    </div>
                    <button 
                      onClick={() => addToCart(item.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded font-medium hover:bg-red-700 transition duration-300 flex items-center"
                    >
                      <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add
                    </button>
                  </div>
                ));
              })()}
            </div>
          </div>
          
          {/* Cart Section */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Order</h2>
              
              {cart.length === 0 ? (
                <p className="text-gray-500 mb-4">Your cart is empty</p>
              ) : (
                <>
                  <div className="mb-4">
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between items-center py-2 border-b">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-600">£{item.price.toFixed(2)} x {item.quantity}</p>
                        </div>
                        <div className="flex items-center">
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-gray-500 hover:text-red-600 p-1"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </button>
                          <span className="mx-2">{item.quantity}</span>
                          <button 
                            onClick={() => addToCart(item.originalId)}
                            className="text-gray-500 hover:text-green-600 p-1"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-t border-b">
                    <p className="font-bold">Total</p>
                    <p className="font-bold">£{totalPrice.toFixed(2)}</p>
                  </div>
                </>
              )}
              
              <button 
                onClick={() => setIsCheckingOut(true)}
                disabled={cart.length === 0}
                className={`w-full mt-4 py-3 rounded-md font-medium text-white transition duration-300 ${
                  cart.length === 0 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
        
        {/* Checkout Fullscreen */}
        {isCheckingOut && (
          <div className="fixed inset-0 z-50 flex flex-col bg-white">
            {/* Header */}
            <div className="sticky top-0 z-50 border-b bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button onClick={() => setIsCheckingOut(false)} aria-label="Back" className="w-10 h-10 rounded-full border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300 inline-flex items-center justify-center">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                  </button>
                  <h2 className="text-base font-semibold">Secure Checkout</h2>
                </div>
                <div className="hidden sm:flex items-center gap-4">
                  <div className="text-gray-900 font-semibold">£{totalPrice.toFixed(2)}</div>
                  <button onClick={handleCheckout} disabled={isSubmitting} className={`px-4 py-2 rounded-md text-white font-medium ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}>{isSubmitting ? 'Processing…' : 'Place Order'}</button>
                </div>
              </div>
            </div>
            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Details */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm ring-1 ring-gray-100 p-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">Delivery details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="name">Full Name *</label>
                      <input id="name" name="name" type="text" placeholder="John Doe" value={customerDetails.name} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="phone">Phone *</label>
                      <input id="phone" name="phone" type="tel" placeholder="07123456789" value={customerDetails.phone} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="postcode">Postcode *</label>
                      <input id="postcode" name="postcode" type="text" placeholder="LS9 0HL" value={customerDetails.postcode} onChange={handlePostcodeInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="address">Delivery Address *</label>
                      <input id="address" name="address" type="text" placeholder="123 Main Street" value={customerDetails.address} onChange={handleAddressInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="deliveryNotes">Delivery Notes (Optional)</label>
                      <textarea id="deliveryNotes" name="deliveryNotes" rows={3} placeholder="Any special instructions for delivery..." value={customerDetails.deliveryNotes} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" />
                    </div>
                  </div>
                </div>
                {/* Summary */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-100 p-6 lg:sticky lg:top-24">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900">Your Order</h3>
                    <div className="space-y-2 max-h-[40vh] overflow-auto pr-1">
                      {cart.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-gray-700">{item.quantity} × {item.name}</span>
                          <span className="font-medium">£{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                      <div className="border-t border-gray-200 my-2"></div>
                      <div className="flex justify-between pt-2 font-semibold text-gray-900">
                        <span>Total</span>
                        <span>£{totalPrice.toFixed(2)}</span>
                      </div>
                      <button onClick={handleCheckout} disabled={isSubmitting} className={`w-full mt-4 py-3 rounded-md text-white font-medium ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}>{isSubmitting ? 'Placing Order…' : 'Place Order'}</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Mobile bottom bar */}
            <div className="sm:hidden sticky bottom-0 w-full border-t bg-white p-3 flex items-center justify-between z-50">
              <div className="font-semibold">£{totalPrice.toFixed(2)}</div>
              <button onClick={handleCheckout} disabled={isSubmitting} className={`px-4 py-2 rounded-md text-white font-medium ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600'}`}>{isSubmitting ? 'Processing…' : 'Place Order'}</button>
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
}
function useCheckout() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initiateCheckout = async (cartItems: CartItem[], customerInfo: {
    name: string;
    phone: string;
    address: string;
    notes?: string;
  }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cartItems,
          customer: customerInfo,
          total: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to process order');
      }

      const data = await response.json();
      return { success: true, orderId: data.orderId };
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      return { success: false, error: err instanceof Error ? err.message : 'An unknown error occurred' };
    } finally {
      setIsLoading(false);
    }
  };

  return { initiateCheckout, isLoading, error };
}

