"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow, isValid } from 'date-fns';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  description?: string;
}

interface Order {
  _id: string;
  customerName: string;
  phone: string;
  deliveryAddress: string;
  status: 'pending' | 'accepted' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  total: number;
  items: OrderItem[];
  deliveryNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const router = useRouter();

  // In a real app, use proper authentication
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // This is just for demo purposes - in production, use proper authentication
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD || password === 'admin123') {
      setIsAuthenticated(true);
      localStorage.setItem('isAuthenticated', 'true');
      fetchOrders();
    } else {
      alert('Incorrect password');
    }
  };

  useEffect(() => {
    // Check if already authenticated
    const auth = localStorage.getItem('isAuthenticated');
    if (auth === 'true') {
      setIsAuthenticated(true);
      fetchOrders();
      
      // Set up Server-Sent Events connection
      const eventSource = new EventSource('/api/orders/updates');
      
      eventSource.onmessage = (event) => {
        const updatedOrder = JSON.parse(event.data);
        
        // Update orders list
        setOrders(prevOrders => {
          const orderExists = prevOrders.some(order => order._id === updatedOrder._id);
          
          if (orderExists) {
            // Update existing order
            return prevOrders.map(order => 
              order._id === updatedOrder._id 
                ? { ...order, ...updatedOrder } 
                : order
            );
          } else {
            // Add new order to the beginning of the list
            return [updatedOrder, ...prevOrders];
          }
        });
        
        // Update selected order if it's the one being viewed
        if (selectedOrder?._id === updatedOrder._id) {
          setSelectedOrder(prev => prev ? { ...prev, ...updatedOrder } : null);
        }
      };
      
      eventSource.onerror = (error) => {
        console.error('EventSource failed:', error);
        eventSource.close();
      };
      
      // Clean up the event source when the component unmounts
      return () => {
        eventSource.close();
      };
    }
  }, [selectedOrder?._id]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/orders');
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      alert('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update order');
      }

      // Update local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === orderId 
            ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
            : order
        )
      );

      // Update selected order if it's the one being viewed
      if (selectedOrder?._id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
      }

      return true;
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Failed to update order status');
      return false;
    }
  };

  const getStatusBadge = (status: Order['status']) => {
    const baseClasses = 'px-2 py-1 text-xs font-medium rounded-full';
    
    switch (status) {
      case 'pending': return { class: `${baseClasses} bg-yellow-100 text-yellow-800`, label: 'Pending' };
      case 'accepted': return { class: `${baseClasses} bg-blue-100 text-blue-800`, label: 'Accepted' };
      case 'preparing': return { class: `${baseClasses} bg-indigo-100 text-indigo-800`, label: 'Preparing' };
      case 'ready': return { class: `${baseClasses} bg-green-100 text-green-800`, label: 'Ready' };
      case 'completed': return { class: `${baseClasses} bg-gray-100 text-gray-800`, label: 'Completed' };
      case 'cancelled': return { class: `${baseClasses} bg-red-100 text-red-800`, label: 'Cancelled' };
      default: return { class: `${baseClasses} bg-gray-100 text-gray-800`, label: status };
    }
  };

  const getNextStatus = (currentStatus: Order['status']) => {
    switch (currentStatus) {
      case 'pending': return 'accepted';
      case 'accepted': return 'preparing';
      case 'preparing': return 'ready';
      case 'ready': return 'completed';
      default: return currentStatus;
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    // Cast the string to Order['status'] to ensure type safety
    const status = newStatus as Order['status'];
    const success = await updateOrderStatus(orderId, status);
    if (success && selectedOrder?._id === orderId) {
      setSelectedOrder(prev => prev ? { ...prev, status } : null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
    setPassword('');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Admin Sign In
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Logout
          </button>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
                <p className="mt-4 text-lg font-medium text-gray-900">Loading orders...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Order List */}
                <div className={`${selectedOrder ? 'lg:col-span-1' : 'lg:col-span-3'}`}>
                  <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">Orders</h3>
                    </div>
                    <ul className="divide-y divide-gray-200 max-h-[calc(100vh-200px)] overflow-y-auto">
                      {orders.length === 0 ? (
                        <li className="px-6 py-4 text-center text-gray-500">
                          No orders found
                        </li>
                      ) : (
                        orders.map((order, index) => (
                          <li 
                            key={order._id || `order-${index}`}
                            className={`px-4 py-4 hover:bg-gray-50 cursor-pointer ${selectedOrder?._id === order._id ? 'bg-blue-50' : ''}`}
                            onClick={() => setSelectedOrder(order)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center">
                                  <p className="text-sm font-medium text-gray-900 truncate">
                                    {order.customerName}
                                  </p>
                                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                    {order?._id ? `#${order._id.substring(order._id.length - 6).toUpperCase()}` : '#N/A'}
                                  </span>
                                </div>
                                <div className="mt-1 flex items-center text-sm text-gray-500">
                                  <span className="truncate">{order.deliveryAddress}</span>
                                </div>
                                <div className="mt-1 flex items-center">
                                  <span className={getStatusBadge(order.status).class}>
                                    {getStatusBadge(order.status).label}
                                  </span>
                                  <span className="ml-2 text-sm text-gray-500">
                                    £{order?.total ? order.total.toFixed(2) : '0.00'}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-4 flex-shrink-0">
                                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            </div>
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                </div>
                
                {/* Order Details */}
                {selectedOrder && (
                  <div className="lg:col-span-2">
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                      <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                          Order #{selectedOrder._id ? selectedOrder._id.substring(selectedOrder._id.length - 6).toUpperCase() : 'N/A'}
                        </h3>
                        <span className={getStatusBadge(selectedOrder.status).class}>
                          {getStatusBadge(selectedOrder.status).label}
                        </span>
                      </div>
                      
                      <div className="px-4 py-5 sm:p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-md font-medium text-gray-900 mb-3">Customer Information</h4>
                            <div className="space-y-2">
                              <p><span className="font-medium">Name:</span> {selectedOrder.customerName}</p>
                              <p><span className="font-medium">Phone:</span> {selectedOrder.phone}</p>
                              <p><span className="font-medium">Delivery Address:</span> {selectedOrder.deliveryAddress}</p>
                              {selectedOrder.deliveryNotes && (
                                <p><span className="font-medium">Notes:</span> {selectedOrder.deliveryNotes}</p>
                              )}
                            </div>
                            
                            <div className="mt-6">
                              <h4 className="text-md font-medium text-gray-900 mb-3">Order Information</h4>
                              <div className="space-y-1">
                                <p><span className="font-medium">Order ID:</span> {selectedOrder._id}</p>
                                <p><span className="font-medium">Ordered:</span> {selectedOrder.createdAt ? formatDistanceToNow(new Date(selectedOrder.createdAt), { addSuffix: true }) : 'N/A'}</p>
                                <p><span className="font-medium">Last Updated:</span> {selectedOrder.updatedAt ? formatDistanceToNow(new Date(selectedOrder.updatedAt), { addSuffix: true }) : 'N/A'}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-md font-medium text-gray-900 mb-3">Order Items</h4>
                            <div className="border rounded-md divide-y divide-gray-200">
                              {selectedOrder.items?.length > 0 ? selectedOrder.items.map((item, index) => (
                                <div key={index} className="p-3 flex justify-between">
                                  <div>
                                    <p className="font-medium">{item.name}</p>
                                    {item.description && <p className="text-sm text-gray-500">{item.description}</p>}
                                  </div>
                                  <div className="text-right">
                                    <p>£{item.price.toFixed(2)} × {item.quantity}</p>
                                    <p className="font-medium">£{(item.price * item.quantity).toFixed(2)}</p>
                                  </div>
                                </div>
                              )) : (
                                <div className="p-4 text-center text-gray-500">
                                  No items in this order
                                </div>
                              )}
                              <div className="p-3 bg-gray-50 border-t border-gray-200">
                                <div className="flex justify-between font-medium">
                                  <p>Total</p>
                                  <p>£{selectedOrder.total.toFixed(2)}</p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="mt-6 flex flex-wrap gap-2">
                              {selectedOrder.status !== 'cancelled' && selectedOrder.status !== 'completed' && (
                                <button
                                  onClick={() => updateOrderStatus(selectedOrder._id, 'cancelled')}
                                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                  Cancel Order
                                </button>
                              )}
                              
                              {selectedOrder.status === 'pending' && (
                                <button
                                  onClick={() => updateOrderStatus(selectedOrder._id, 'accepted')}
                                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                >
                                  Accept Order
                                </button>
                              )}
                              
                              {selectedOrder.status !== 'cancelled' && selectedOrder.status !== 'completed' && (
                                <button
                                  onClick={() => updateOrderStatus(selectedOrder._id, getNextStatus(selectedOrder.status) as any)}
                                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                  Mark as {getStatusBadge(getNextStatus(selectedOrder.status) as Order['status']).label}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
