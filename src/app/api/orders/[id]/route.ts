import { NextResponse } from 'next/server';
import { connectMongoose } from '@/lib/mongoose';
import { Order } from '@/models/Order';

// GET /api/orders/[id] - Get a single order by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectMongoose();
    const { id } = await Promise.resolve(params);
    console.log(`Fetching order ${id}`);

    const order = await Order.findById(id).lean();
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}

// PATCH /api/orders/[id] - Update an order's status
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectMongoose();
    const { status } = await request.json();
    const { id } = await Promise.resolve(params);

    const validStatuses = ['pending', 'accepted', 'ready', 'completed', 'cancelled'] as const;
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: `Invalid status: ${status}` }, { status: 400 });
    }

    const updated = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).lean();

    if (!updated) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}

// This prevents the route from being cached
export const dynamic = 'force-dynamic';
