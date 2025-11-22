import mongoose from 'mongoose';

const updateSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['info', 'warning', 'success', 'announcement'],
    default: 'info'
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  publishDate: {
    type: Date,
    default: Date.now
  },
  expiryDate: {
    type: Date,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
updateSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Method to check if update is currently visible
updateSchema.methods.isVisible = function() {
  const now = new Date();

  if (!this.isActive) return false;
  if (this.publishDate > now) return false;
  if (this.expiryDate && this.expiryDate < now) return false;

  return true;
};

// Static method to get active updates
updateSchema.statics.getActiveUpdates = async function(limit = null) {
  const now = new Date();

  const query = this.find({
    isActive: true,
    publishDate: { $lte: now },
    $or: [
      { expiryDate: null },
      { expiryDate: { $gt: now } }
    ]
  })
  .sort({ isPinned: -1, publishDate: -1 });

  if (limit) {
    return query.limit(limit);
  }

  return query;
};

const Update = mongoose.model('Update', updateSchema);

export default Update;
