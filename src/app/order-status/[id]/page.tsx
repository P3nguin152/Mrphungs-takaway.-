'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  description?: string;
}

interface Order {
  _id: string;
  customerName: string;
  phone: string;
  deliveryAddress: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'accepted' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  deliveryNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export default function OrderStatus() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${id}`);
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.error || 'Order not found');
        }
        const data = await res.json();
        if (isMounted) {
          setOrder(data);
          setError('');
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load order');
          setOrder(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchOrder();
    const interval = setInterval(fetchOrder, 10000);
    
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6 text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Order Status</h2>
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          </div>
          <p className="text-gray-600 mb-4">Your order is being processed...</p>
          <p className="text-sm text-gray-500">Order ID: {id}</p>
          <Link href="/" className="mt-6 inline-block text-blue-600 hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-4">Order Status</h1>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Order ID</p>
              <p>{order._id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="font-medium">{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Delivery Address</p>
              <p>{order.deliveryAddress}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Contact</p>
              <p>{order.customerName} • {order.phone}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Order Items</h2>
          <div className="space-y-4">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between border-b pb-2">
                <div>
                  <p>{item.name} × {item.quantity}</p>
                  {item.description && <p className="text-sm text-gray-500">{item.description}</p>}
                </div>
                <p>£{(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
            <div className="pt-2 border-t font-semibold flex justify-between">
              <span>Total</span>
              <span>£{order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
