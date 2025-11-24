import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Season from '../models/Season.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

const updateSeasonTime = async () => {
  try {
    const mongoURI = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}?authSource=admin`;
    await mongoose.connect(mongoURI);
    console.log('Connected to database\n');

    const season = await Season.findOne({ year: 2025 });
    if (!season) {
      console.log('Season 2025 not found');
      process.exit(0);
    }

    console.log('Current season start:', season.startDate);
    console.log('Current season end:', season.endDate);

    // Set start to 8am EST on Black Friday (Nov 25, 2025)
    // EST is UTC-5, so 8am EST = 1pm UTC
    const startDate = new Date('2025-11-25T13:00:00.000Z'); // 8am EST

    // Set end to 11:59pm EST on Christmas Eve (Dec 24, 2025)
    // 11:59pm EST = 4:59am UTC next day
    const endDate = new Date('2025-12-25T04:59:59.999Z'); // 11:59pm EST on Dec 24

    season.startDate = startDate;
    season.endDate = endDate;
    await season.save();

    console.log('\n✓ Updated season times:');
    console.log('  Start: Nov 25, 2025 8:00 AM EST');
    console.log('  End: Dec 24, 2025 11:59 PM EST\n');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

updateSeasonTime();
