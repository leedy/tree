import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Team from '../models/Team.js';
import Season from '../models/Season.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

const check = async () => {
  try {
    const mongoURI = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}?authSource=admin`;
    await mongoose.connect(mongoURI);

    const team = await Team.findOne({}).populate('season');
    if (!team) {
      console.log('No team found');
      process.exit(0);
    }

    console.log('Team:', team.teamName);
    console.log('Team season field:', team.season);
    console.log('Team seasonId:', team.seasonId);

    if (team.season) {
      console.log('\nSeason details:');
      console.log('  Year:', team.season.year);
      console.log('  Active:', team.season.isActive);
      console.log('  AllowAddingTrees:', team.season.allowAddingTrees);
    } else {
      console.log('\nERROR: Team has no season associated!');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
};

check();
