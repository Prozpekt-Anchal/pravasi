const mongoose = require('mongoose');

const { Schema } = mongoose;

const checklistItemSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true
    },
    done: {
      type: Boolean,
      default: false
    }
  },
  { _id: true }
);

const checklistSchema = new Schema(
  {
    trip: {
      type: Schema.Types.ObjectId,
      ref: 'Trip',
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    items: [checklistItemSchema]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Checklist', checklistSchema);

