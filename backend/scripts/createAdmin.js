import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from '../models/Admin.js';
import readline from 'readline';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from backend directory
dotenv.config({ path: join(__dirname, '..', '.env') });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const createAdmin = async () => {
  try {
    // Build MongoDB URI from environment variables
    const mongoURI = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}?authSource=admin`;

    // Check if required variables are loaded
    if (!process.env.MONGO_HOST || !process.env.MONGO_DATABASE) {
      console.error('\n❌ Error: MongoDB configuration not found in .env file');
      console.error('Make sure you have a .env file in the backend directory with MongoDB settings\n');
      process.exit(1);
    }

    // Connect to database
    await mongoose.connect(mongoURI);
    console.log('\n✅ Connected to database');
    console.log(`Database: ${process.env.MONGO_DATABASE}\n`);

    // Get admin details
    console.log('Create Admin Account');
    console.log('===================\n');

    const username = await question('Enter admin username: ');
    const email = await question('Enter admin email: ');
    const password = await question('Enter admin password (min 6 characters): ');

    // Validation
    if (!username || username.length < 3) {
      console.error('\n❌ Username must be at least 3 characters');
      process.exit(1);
    }

    if (!email || !email.match(/^\S+@\S+\.\S+$/)) {
      console.error('\n❌ Invalid email address');
      process.exit(1);
    }

    if (!password || password.length < 6) {
      console.error('\n❌ Password must be at least 6 characters');
      process.exit(1);
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({
      $or: [
        { username: username.toLowerCase() },
        { email: email.toLowerCase() }
      ]
    });

    if (existingAdmin) {
      console.error('\n❌ Admin with this username or email already exists');
      process.exit(1);
    }

    // Create admin
    const admin = await Admin.create({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password
    });

    console.log('\n✅ Admin account created successfully!');
    console.log('\nAdmin Details:');
    console.log('==============');
    console.log(`Username: ${admin.username}`);
    console.log(`Email: ${admin.email}`);
    console.log(`\nYou can now login at: /admin/login\n`);

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error creating admin:', error.message);
    process.exit(1);
  }
};

createAdmin();
