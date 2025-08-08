import { NextResponse } from 'next/server';

// In-memory storage for development
// This is exported so it can be imported by [id]/route.ts
export const orders: IOrder[] = [];

export interface IOrder {
  _id?: string;
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
  status: 'pending' | 'accepted' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  createdAt?: Date;
  updatedAt?: Date;
}

// POST /api/orders - Create a new order
export async function POST(request: Request) {
  console.log('=== NEW ORDER REQUEST ===');
  
  try {
    // Parse the request body
    let orderData: Omit<IOrder, 'createdAt' | 'updatedAt' | 'status'>;
    
    try {
      orderData = await request.json();
      console.log('Request body parsed successfully');
      console.log('Order data received:', JSON.stringify(orderData, null, 2));
    } catch (parseError) {
      const errorMsg = 'Invalid JSON in request body';
      console.error(errorMsg, parseError);
      return NextResponse.json(
        { error: errorMsg },
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Basic validation
    const missingFields = [];
    if (!orderData.customerName) missingFields.push('customerName');
    if (!orderData.phone) missingFields.push('phone');
    if (!orderData.deliveryAddress) missingFields.push('deliveryAddress');
    if (!orderData.items?.length) missingFields.push('items');
    
    if (missingFields.length > 0) {
      const errorMsg = `Missing required fields: ${missingFields.join(', ')}`;
      console.error('Validation error:', errorMsg);
      return NextResponse.json(
        { 
          error: errorMsg,
          missingFields
        },
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    try {
      // Create the order
      const newOrder: IOrder = {
        ...orderData,
        _id: Math.random().toString(36).substring(2, 9),
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Add to in-memory array
      orders.push(newOrder);
      console.log('New order created successfully:', JSON.stringify(newOrder, null, 2));
      console.log(`Total orders in memory: ${orders.length}`);

      return NextResponse.json(
        { 
          message: 'Order created successfully', 
          orderId: newOrder._id,
          status: newOrder.status 
        },
        { 
          status: 201,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    } catch (createError) {
      console.error('Error creating order:', createError);
      return NextResponse.json(
        { error: 'Failed to process order' },
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

// GET /api/orders - Get all orders (for admin)
export async function GET() {
  try {
    // Sort orders by creation date (newest first)
    const sortedOrders = [...orders].sort((a, b) => 
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
    
    return NextResponse.json(sortedOrders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// This prevents the route from being cached
export const dynamic = 'force-dynamic';
