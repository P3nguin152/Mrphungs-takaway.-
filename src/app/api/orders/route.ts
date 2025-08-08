import { NextResponse } from 'next/server';
import { connectMongoose } from '@/lib/mongoose';
import { Order } from '@/models/Order';

// POST /api/orders - Create a new order
export async function POST(request: Request) {
  console.log('=== NEW ORDER REQUEST ===');
  try {
    await connectMongoose();

    // Parse the request body
    const body = await request.json();

    // Basic validation
    const missingFields: string[] = [];
    if (!body?.customerName) missingFields.push('customerName');
    if (!body?.phone) missingFields.push('phone');
    if (!body?.deliveryAddress) missingFields.push('deliveryAddress');
    if (!Array.isArray(body?.items) || body.items.length === 0) missingFields.push('items');
    if (typeof body?.total !== 'number') missingFields.push('total');

    if (missingFields.length > 0) {
      const errorMsg = `Missing required fields: ${missingFields.join(', ')}`;
      console.error('Validation error:', errorMsg);
      return NextResponse.json(
        { error: errorMsg, missingFields },
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create order in MongoDB (timestamps handled by schema)
    const created = await Order.create({
      customerName: body.customerName,
      phone: body.phone,
      deliveryAddress: body.deliveryAddress,
      items: body.items,
      total: body.total,
      deliveryNotes: body.deliveryNotes,
      // status defaults to 'pending'
    });

    return NextResponse.json(
      { message: 'Order created successfully', orderId: String(created._id), status: created.status },
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error creating order:', error);
    const msg = error instanceof Error ? error.message : 'Failed to create order';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// GET /api/orders - Get all orders (for admin)
export async function GET() {
  try {
    await connectMongoose();
    const docs = await Order.find().sort({ createdAt: -1 }).lean();
    const normalized = docs.map((o: any) => ({ ...o, _id: String(o._id) }));
    return NextResponse.json(normalized);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

// This prevents the route from being cached
export const dynamic = 'force-dynamic';
