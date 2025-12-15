import { NextRequest, NextResponse } from 'next/server';
import { validatePin, createSession, setSessionCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { pin } = await request.json();

    if (!pin || typeof pin !== 'string') {
      return NextResponse.json(
        { error: 'PIN is required' },
        { status: 400 }
      );
    }

    if (!validatePin(pin)) {
      return NextResponse.json(
        { error: 'Invalid PIN' },
        { status: 401 }
      );
    }

    const token = await createSession();
    await setSessionCookie(token);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
