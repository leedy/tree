import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env') });

const { MONGO_HOST, MONGO_PORT, MONGO_USERNAME, MONGO_PASSWORD, MONGO_DATABASE } = process.env;

const mongoURI = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DATABASE}`;

async function countUsers() {
  try {
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    const Team = mongoose.model('Team', new mongoose.Schema({}, { strict: false }));

    const teamCount = await Team.countDocuments();
    const teams = await Team.find({}, { players: 1 });
    const totalPlayers = teams.reduce((sum, team) => sum + (team.players?.length || 0), 0);

    console.log(`\nRegistered Teams: ${teamCount}`);
    console.log(`Total Players: ${totalPlayers}`);

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

countUsers();
