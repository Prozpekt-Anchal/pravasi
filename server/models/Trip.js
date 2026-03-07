const mongoose = require('mongoose');

const { Schema } = mongoose;

const memberSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: ['owner', 'editor', 'viewer'],
      default: 'viewer'
    },
    invitedAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
);

const tripSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    destination: {
      type: String,
      required: true,
      trim: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    coverImage: {
      type: String
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    members: [memberSchema],
    totalBudget: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

tripSchema.index({ owner: 1 });

module.exports = mongoose.model('Trip', tripSchema);

