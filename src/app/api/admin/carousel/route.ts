import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { carouselSlots } from '@/db/schema';
import { eq } from 'drizzle-orm';
import type { CarouselSlot, CarouselUpdateRequest, ApiResponse } from '@/types/admin';

// GET: Fetch all 9 carousel slots
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

// PUT: Update carousel slots
export async function PUT(
  request: NextRequest
): Promise<NextResponse<ApiResponse<CarouselSlot[]>>> {
  try {
    const body: CarouselUpdateRequest = await request.json();
    const { slots } = body;

    // Validate input
    if (!slots || !Array.isArray(slots) || slots.length !== 9) {
      return NextResponse.json(
        { success: false, error: 'Invalid request: must provide exactly 9 slots' },
        { status: 400 }
      );
    }

    // Validate each slot
    for (const slot of slots) {
      if (typeof slot.position !== 'number' || slot.position < 1 || slot.position > 9) {
        return NextResponse.json(
          { success: false, error: `Invalid position: ${slot.position}` },
          { status: 400 }
        );
      }
      if (slot.youtubeId !== null && typeof slot.youtubeId !== 'string') {
        return NextResponse.json(
          { success: false, error: `Invalid youtubeId for position ${slot.position}` },
          { status: 400 }
        );
      }
    }

    // Update each slot using upsert pattern
    const updatedSlots: CarouselSlot[] = [];
    const now = new Date();

    for (const slot of slots) {
      // Check if slot exists
      const existing = await db
        .select()
        .from(carouselSlots)
        .where(eq(carouselSlots.position, slot.position))
        .limit(1);

      if (existing.length > 0) {
        // Update existing slot
        await db
          .update(carouselSlots)
          .set({
            youtubeId: slot.youtubeId,
            updatedAt: now,
          })
          .where(eq(carouselSlots.position, slot.position));
      } else {
        // Insert new slot
        await db.insert(carouselSlots).values({
          position: slot.position,
          youtubeId: slot.youtubeId,
          updatedAt: now,
        });
      }

      updatedSlots.push({
        position: slot.position,
        youtubeId: slot.youtubeId,
        updatedAt: now,
      });
    }

    return NextResponse.json({
      success: true,
      data: updatedSlots,
    });
  } catch (error) {
    console.error('Error updating carousel slots:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update carousel slots' },
      { status: 500 }
    );
  }
}
