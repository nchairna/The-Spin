import { pgTable, integer, varchar, timestamp } from 'drizzle-orm/pg-core';

export const carouselSlots = pgTable('carousel_slots', {
  position: integer('position').primaryKey(), // 1-9
  youtubeId: varchar('youtube_id', { length: 20 }), // NULL = placeholder
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Type exports
export type CarouselSlot = typeof carouselSlots.$inferSelect;
export type NewCarouselSlot = typeof carouselSlots.$inferInsert;
