import mongoose from 'mongoose';

const seasonSchema = new mongoose.Schema({
  year: {
    type: Number,
    required: true,
    unique: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: false
  },
  allowAddingTrees: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Method to check if a date is within this season
seasonSchema.methods.isDateInSeason = function(date) {
  return date >= this.startDate && date <= this.endDate;
};

const Season = mongoose.model('Season', seasonSchema);

export default Season;
