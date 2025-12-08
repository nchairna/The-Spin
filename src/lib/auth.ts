import { SignJWT, jwtVerify, JWTPayload } from 'jose';
import { cookies } from 'next/headers';

const SECRET = new TextEncoder().encode(process.env.AUTH_SECRET);
const COOKIE_NAME = 'admin_session';
const EXPIRATION = '24h';

export interface SessionPayload extends JWTPayload {
  isAdmin: boolean;
}

// Create session token
export async function createSession(): Promise<string> {
  const token = await new SignJWT({ isAdmin: true })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(EXPIRATION)
    .sign(SECRET);

  return token;
}

// Verify session token
export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    if (typeof payload.isAdmin === 'boolean') {
      return payload as SessionPayload;
    }
    return null;
  } catch {
    return null;
  }
}

// Set session cookie
export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  });
}

// Get session from cookie
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) return null;
  return verifySession(token);
}

// Clear session cookie
export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

// Validate PIN
export function validatePin(pin: string): boolean {
  return pin === process.env.ADMIN_PIN;
}
