const API_BASE_URL = '/api';

export interface OrderData {
  customerName: string;
  phone: string;
  deliveryAddress: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    description?: string;
  }>;
  total: number;
  deliveryNotes?: string;
}

export interface Order extends OrderData {
  _id: string;
  status: 'pending' | 'accepted' | 'ready' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export const orderService = {
  // Create a new order
  async createOrder(orderData: OrderData): Promise<{ orderId: string; status: string }> {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create order');
    }

    return response.json();
  },

  // Get order by ID
  async getOrder(orderId: string): Promise<Order> {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch order');
    }

    return response.json();
  },

  // Update order status
  async updateOrderStatus(orderId: string, status: string): Promise<Order> {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update order');
    }

    return response.json();
  },

  // Get all orders (for admin)
  async getAllOrders(): Promise<Order[]> {
    const response = await fetch(`${API_BASE_URL}/orders`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch orders');
    }

    return response.json();
  },
};
