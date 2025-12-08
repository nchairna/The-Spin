import { NextResponse } from 'next/server';
import { db } from '@/db';
import { carouselSlots } from '@/db/schema';
import type { CarouselSlot, ApiResponse } from '@/types/admin';

// GET: Fetch carousel slots for public consumption (homepage carousel)
// No authentication required
export async function GET(): Promise<NextResponse<ApiResponse<CarouselSlot[]>>> {
  try {
    const slots = await db
      .select()
      .from(carouselSlots)
      .orderBy(carouselSlots.position);

    // Ensure we always return 9 slots (positions 1-9)
    const normalizedSlots: CarouselSlot[] = [];
    for (let i = 1; i <= 9; i++) {
      const existingSlot = slots.find((s) => s.position === i);
      normalizedSlots.push({
        position: i,
        youtubeId: existingSlot?.youtubeId ?? null,
        updatedAt: existingSlot?.updatedAt ?? undefined,
      });
    }

    return NextResponse.json({
      success: true,
      data: normalizedSlots,
    });
  } catch (error) {
    console.error('Error fetching carousel slots:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch carousel slots' },
      { status: 500 }
    );
  }
}
