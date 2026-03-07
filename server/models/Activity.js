const mongoose = require('mongoose');

const { Schema } = mongoose;

const activitySchema = new Schema(
  {
    trip: {
      type: Schema.Types.ObjectId,
      ref: 'Trip',
      required: true
    },
    day: {
      type: Number,
      required: true,
      min: 1
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String
    },
    time: {
      type: String
    },
    location: {
      type: String
    },
    attachments: [
      {
        type: String
      }
    ],
    order: {
      type: Number,
      default: 0
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

activitySchema.index({ trip: 1, day: 1, order: 1 });

module.exports = mongoose.model('Activity', activitySchema);

