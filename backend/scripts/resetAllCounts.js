import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Team from '../models/Team.js';
import Activity from '../models/Activity.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

const resetCounts = async () => {
  try {
    const mongoURI = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}?authSource=admin`;
    await mongoose.connect(mongoURI);
    console.log('Connected to database\n');

    // Get all teams
    const teams = await Team.find({});
    console.log(`Found ${teams.length} team(s)\n`);

    let totalPlayersReset = 0;
    let totalTreesCleared = 0;

    // Reset all player counts to 0
    for (const team of teams) {
      const treesInTeam = team.getTotalCount();
      totalTreesCleared += treesInTeam;

      team.players.forEach(player => {
        if (player.count > 0) {
          totalPlayersReset++;
        }
        player.count = 0;
      });

      await team.save();
      console.log(`✓ Reset ${team.teamName} (${team.players.length} players, ${treesInTeam} trees cleared)`);
    }

    // Delete all activities
    const activitiesDeleted = await Activity.deleteMany({});
    console.log(`\n✓ Deleted ${activitiesDeleted.deletedCount} activity records\n`);

    console.log('=== Summary ===');
    console.log(`Teams processed: ${teams.length}`);
    console.log(`Players reset: ${totalPlayersReset}`);
    console.log(`Total trees cleared: ${totalTreesCleared}`);
    console.log(`Activities deleted: ${activitiesDeleted.deletedCount}`);
    console.log('\n✅ All counts have been reset to zero!\n');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

resetCounts();
