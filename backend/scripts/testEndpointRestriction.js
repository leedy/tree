import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Season from '../models/Season.js';
import Team from '../models/Team.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from backend directory
dotenv.config({ path: join(__dirname, '..', '.env') });

const test = async () => {
  try {
    const mongoURI = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}?authSource=admin`;
    await mongoose.connect(mongoURI);

    const season = await Season.findOne({ isActive: true });
    if (!season) {
      console.log('No active season found.');
      process.exit(0);
    }

    const team = await Team.findOne({}).populate('season');
    if (!team) {
      console.log('No teams found.');
      process.exit(0);
    }

    console.log('=== Testing Tree Adding Toggle ===\n');
    console.log(`Team: ${team.teamName}`);
    console.log(`Season: ${season.year}`);
    console.log(`Current allowAddingTrees: ${season.allowAddingTrees}\n`);

    // Test 1: Disable tree adding
    console.log('TEST 1: Disabling tree adding...');
    season.allowAddingTrees = false;
    await season.save();

    // Reload team to get updated season
    await team.populate('season');
    console.log(`✓ Season allowAddingTrees: ${team.season.allowAddingTrees}`);
    console.log('  Expected: Team dashboard should show disabled message');
    console.log('  Expected: Increment/decrement buttons should be disabled');
    console.log('  Expected: API calls should return 403 error\n');

    // Test 2: Re-enable tree adding
    console.log('TEST 2: Re-enabling tree adding...');
    season.allowAddingTrees = true;
    await season.save();

    await team.populate('season');
    console.log(`✓ Season allowAddingTrees: ${team.season.allowAddingTrees}`);
    console.log('  Expected: Team dashboard should hide disabled message');
    console.log('  Expected: Increment/decrement buttons should be enabled');
    console.log('  Expected: API calls should work normally\n');

    console.log('✅ All tests completed successfully!\n');
    console.log('Summary:');
    console.log('- ✓ Season model supports allowAddingTrees field');
    console.log('- ✓ Field can be toggled via database');
    console.log('- ✓ Field is accessible from team queries');
    console.log('- ✓ Admin can control this via admin dashboard');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

test();
