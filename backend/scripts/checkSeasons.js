import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Season from '../models/Season.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from backend directory
dotenv.config({ path: join(__dirname, '..', '.env') });

const checkSeasons = async () => {
  try {
    // Build MongoDB URI from environment variables
    const mongoURI = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}?authSource=admin`;

    // Connect to database
    await mongoose.connect(mongoURI);
    console.log('Connected to database\n');

    // Get all seasons
    const seasons = await Season.find({});

    if (seasons.length === 0) {
      console.log('No seasons found.');
    } else {
      console.log(`Found ${seasons.length} season(s):\n`);
      seasons.forEach((season, index) => {
        console.log(`${index + 1}. Year: ${season.year}`);
        console.log(`   Active: ${season.isActive}`);
        console.log(`   Allow Adding Trees: ${season.allowAddingTrees !== undefined ? season.allowAddingTrees : 'NOT SET (will default to true)'}`);
        console.log(`   Start: ${season.startDate.toLocaleDateString()}`);
        console.log(`   End: ${season.endDate.toLocaleDateString()}`);
        console.log('');
      });
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

checkSeasons();
