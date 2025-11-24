import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from '../models/Admin.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from backend directory
dotenv.config({ path: join(__dirname, '..', '.env') });

const listAdmins = async () => {
  try {
    // Build MongoDB URI from environment variables
    const mongoURI = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}?authSource=admin`;

    // Connect to database
    await mongoose.connect(mongoURI);
    console.log('Connected to database\n');

    // Get all admins
    const admins = await Admin.find({}, 'username email createdAt');

    if (admins.length === 0) {
      console.log('No admin accounts found.');
    } else {
      console.log(`Found ${admins.length} admin account(s):\n`);
      admins.forEach((admin, index) => {
        console.log(`${index + 1}. Username: ${admin.username}`);
        console.log(`   Email: ${admin.email}`);
        console.log(`   Created: ${admin.createdAt}`);
        console.log('');
      });
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

listAdmins();
