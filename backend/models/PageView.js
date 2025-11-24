import mongoose from 'mongoose';

const pageViewSchema = new mongoose.Schema({
  path: {
    type: String,
    required: true,
    index: true
  },
  // Store IP hash for privacy (not the actual IP)
  visitorId: {
    type: String,
    required: true,
    index: true
  },
  userAgent: String,
  referrer: String,
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// Index for efficient querying
pageViewSchema.index({ timestamp: -1 });
pageViewSchema.index({ path: 1, timestamp: -1 });

const PageView = mongoose.model('PageView', pageViewSchema);

export default PageView;
