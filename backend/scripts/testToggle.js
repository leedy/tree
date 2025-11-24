import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Season from '../models/Season.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from backend directory
dotenv.config({ path: join(__dirname, '..', '.env') });

const testToggle = async () => {
  try {
    // Build MongoDB URI from environment variables
    const mongoURI = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}?authSource=admin`;

    // Connect to database
    await mongoose.connect(mongoURI);
    console.log('Connected to database\n');

    // Get active season
    const season = await Season.findOne({ isActive: true });

    if (!season) {
      console.log('No active season found.');
      process.exit(0);
    }

    console.log(`Active Season: ${season.year}`);
    console.log(`Current allowAddingTrees: ${season.allowAddingTrees}\n`);

    // Toggle to false
    console.log('Toggling allowAddingTrees to FALSE...');
    season.allowAddingTrees = false;
    await season.save();
    console.log(`✓ Updated to: ${season.allowAddingTrees}\n`);

    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Toggle back to true
    console.log('Toggling allowAddingTrees back to TRUE...');
    season.allowAddingTrees = true;
    await season.save();
    console.log(`✓ Updated to: ${season.allowAddingTrees}\n`);

    console.log('Test completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

testToggle();
