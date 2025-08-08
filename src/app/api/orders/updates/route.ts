import { NextRequest, NextResponse } from 'next/server';
import { connectMongoose } from '@/lib/mongoose';
import { Order } from '@/models/Order';

export async function GET(req: NextRequest) {
  // Set headers for Server-Sent Events
  const headers = new Headers({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });

  // Create a TransformStream for the response
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();
  const encoder = new TextEncoder();

  // Function to send data to the client
  const sendEvent = (data: any) => {
    writer.write(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
  };

  // Set up MongoDB change stream
  const setupChangeStream = async () => {
    try {
      await connectMongoose();
      
      // Create a change stream on the orders collection
      const changeStream = Order.watch([], { fullDocument: 'updateLookup' });
      
      changeStream.on('change', (change) => {
        if (change.operationType === 'insert' || change.operationType === 'update' || change.operationType === 'replace') {
          // Normalize _id to string for client-side comparisons
          const doc: any = change.fullDocument;
          const normalized = doc && doc._id ? { ...doc, _id: String(doc._id) } : doc;
          // Send the updated order data to the client
          sendEvent(normalized);
        }
      });

      // Handle connection close
      req.signal.onabort = () => {
        changeStream.close();
        writer.close();
      };
    } catch (error) {
      console.error('Error setting up change stream:', error);
      sendEvent({ error: 'Failed to set up real-time updates' });
    }
  };

  // Start the change stream
  setupChangeStream();

  // Return the response with the stream
  return new NextResponse(stream.readable, { headers });
}

export const dynamic = 'force-dynamic';
