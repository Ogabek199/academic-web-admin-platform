import { NextResponse } from 'next/server';
import { initAdmin } from '@/lib/auth';

export async function GET() {
  try {
    await initAdmin();
    return NextResponse.json({ success: true, message: 'Admin user initialized' });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Initialization error' },
      { status: 500 }
    );
  }
}

