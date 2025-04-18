const mongoose = require('mongoose');


const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    eventDate: {
      type: Date,
      required: true,
    },
    eventTime: {
      type: String,
      required: true,
    },
    organizer: {
      type: String,
      required: true,
    },
    registrationLink: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);
module.exports = mongoose.model('Event', eventSchema);