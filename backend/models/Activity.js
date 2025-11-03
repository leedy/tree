import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['tree_spotted', 'player_added', 'team_created'],
    required: true
  },
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  teamName: {
    type: String,
    required: true
  },
  playerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: function() {
      return this.type === 'tree_spotted';
    }
  },
  playerName: {
    type: String,
    required: function() {
      return this.type === 'tree_spotted' || this.type === 'player_added';
    }
  },
  count: {
    type: Number,
    default: 1
  },
  newTotal: {
    type: Number
  },
  season: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Season',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// Index for efficient querying of recent activities
activitySchema.index({ createdAt: -1 });
activitySchema.index({ season: 1, createdAt: -1 });

const Activity = mongoose.model('Activity', activitySchema);

export default Activity;
