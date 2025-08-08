import { connectToDatabase } from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    
    if (!db) {
      throw new Error('Database connection not established');
    }
    
    // Test the connection by getting database stats
    const stats = await db.stats();
    
    return NextResponse.json({
      success: true,
      message: 'Successfully connected to MongoDB',
      stats: {
        db: stats.db,
        collections: stats.collections,
        objects: stats.objects,
        dataSize: stats.dataSize,
        storageSize: stats.storageSize,
      },
    });
  } catch (error) {
    console.error('Test route error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to connect to MongoDB';
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}
