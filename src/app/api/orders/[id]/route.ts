import { NextResponse } from 'next/server';
import { orders, IOrder } from '../route';

// GET /api/orders/[id] - Get a single order by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Ensure params is fully resolved
    const { id } = await Promise.resolve(params);
    console.log(`Fetching order ${id}`);
    
    // Find the order in the in-memory array
    const order = orders.find(o => o._id === id);
    
    if (!order) {
      console.error('Order not found:', params.id);
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }
    
    console.log('Returning order:', order._id);
    return NextResponse.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

// PATCH /api/orders/[id] - Update an order's status
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await request.json();
    
    // Validate status
    const validStatuses = ['pending', 'accepted', 'preparing', 'ready', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status: ${status}` },
        { status: 400 }
      );
    }

    const now = new Date();
    
    // Find the order index
    const orderIndex = orders.findIndex(o => o._id === params.id);
    
    if (orderIndex === -1) {
      // Create a new order if it doesn't exist (for testing)
      const newOrder: IOrder = {
        _id: params.id,
        customerName: 'Test Customer',
        phone: '0000000000',
        deliveryAddress: 'Test Address',
        status: status as any,
        total: 0,
        items: [],
        createdAt: now,
        updatedAt: now
      };
      orders.push(newOrder);
      return NextResponse.json(newOrder);
    }
    
    // Update the order in the in-memory array
    const updatedOrder: IOrder = {
      ...orders[orderIndex],
      status,
      updatedAt: now
    };
    
    orders[orderIndex] = updatedOrder;
    const result = updatedOrder;
    
    console.log('Order updated:', result);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}

// This prevents the route from being cached
export const dynamic = 'force-dynamic';
