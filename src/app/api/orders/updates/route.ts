import { NextRequest } from 'next/server';
import { connectMongoose } from '@/lib/mongoose';
import { Order } from '@/models/Order';

export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start: async (controller) => {
      const sendLine = (line: string) => controller.enqueue(encoder.encode(line));
      const sendEvent = (data: any) => {
        sendLine(`data: ${JSON.stringify(data)}\n\n`);
      };

      // Initial comment to establish stream and an initial hello event
      sendLine(`: connected\n\n`);
      sendEvent({ info: 'sse_connected' });

      let heartbeat: any;
      const startHeartbeat = () => {
        heartbeat = setInterval(() => {
          // comment line as heartbeat to keep the connection alive
          try { sendLine(`: ping ${Date.now()}\n\n`); } catch {}
        }, 15000);
      };

      try {
        await connectMongoose();
        try {
          // Prefer change streams when available
          const changeStream = Order.watch([], { fullDocument: 'updateLookup' });

          changeStream.on('change', (change) => {
            if (['insert', 'update', 'replace'].includes(change.operationType as any)) {
              const doc: any = change.fullDocument;
              const normalized = doc && doc._id ? { ...doc, _id: String(doc._id) } : doc;
              sendEvent(normalized);
            }
          });

          req.signal.addEventListener('abort', () => {
            try { changeStream.close(); } catch {}
            if (heartbeat) clearInterval(heartbeat);
            try { controller.close(); } catch {}
          });

          startHeartbeat();
        } catch (csErr: any) {
          // Fallback to polling when change streams unsupported (e.g., standalone Mongo)
          if (csErr && (csErr.code === 40573 || csErr.codeName === 'Location40573')) {
            sendEvent({ info: 'changeStreamUnsupported_fallbackToPolling' });

            let isClosed = false;
            let lastCheck = new Date(0);

            const interval = setInterval(async () => {
              if (isClosed) return;
              try {
                const updates = await Order.find({ updatedAt: { $gt: lastCheck } })
                  .sort({ updatedAt: 1 })
                  .limit(20)
                  .lean();
                if (updates.length > 0) {
                  updates.forEach((doc: any) => {
                    const normalized = doc && doc._id ? { ...doc, _id: String(doc._id) } : doc;
                    sendEvent(normalized);
                  });
                  const newest = updates[updates.length - 1];
                  lastCheck = newest?.updatedAt ? new Date(newest.updatedAt) : new Date();
                }
              } catch (pollErr) {
                console.error('Polling error:', pollErr);
              }
            }, 4000);

            req.signal.addEventListener('abort', () => {
              isClosed = true;
              clearInterval(interval);
              if (heartbeat) clearInterval(heartbeat);
              try { controller.close(); } catch {}
            });

            startHeartbeat();
          } else {
            console.error('Change stream error:', csErr);
            sendEvent({ error: 'Real-time updates unavailable' });
            if (heartbeat) clearInterval(heartbeat);
            try { controller.close(); } catch {}
          }
        }
      } catch (err) {
        console.error('Error setting up real-time updates:', err);
        sendEvent({ error: 'Failed to set up real-time updates' });
        if (heartbeat) clearInterval(heartbeat);
        try { controller.close(); } catch {}
      }
    },
    cancel: () => {
      // Reader cancelled by the client
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    },
  });
}

export const dynamic = 'force-dynamic';
