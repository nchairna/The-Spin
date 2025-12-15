import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { carouselSlots } from '../src/db/schema';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function seed() {
  console.log('Seeding carousel slots...');

  // Initialize 9 empty carousel slots
  for (let i = 1; i <= 9; i++) {
    await db.insert(carouselSlots)
      .values({ position: i, youtubeId: null })
      .onConflictDoNothing();
  }

  console.log('Seeded 9 carousel slots successfully!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
