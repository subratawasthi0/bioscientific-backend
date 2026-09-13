const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    location: { type: String, required: true },
    eventDate: { type: Date, required: true },
    endDate: { type: Date },
    imageUrl: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

// Helper to index 'eventDate' for faster filtering
EventSchema.index({ eventDate: -1 });

module.exports = mongoose.model("Event", EventSchema);
