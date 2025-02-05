import { testGroqConnection } from '@/utils/test-groq';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const success = await testGroqConnection();
    return NextResponse.json({ 
      success, 
      message: success ? 'Groq API connection successful' : 'Groq API connection failed' 
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Test failed: ' + (error as Error).message 
    }, { status: 500 });
  }
} 