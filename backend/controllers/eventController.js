const Event = require("../models/Event");

exports.addEvent = async (req, res) => {
  try {
    const { title, eventDate, eventTime, organizer } = req.body;

    if (!title || !eventDate || !eventTime || !organizer) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newEvent = new Event({
      title,
      eventDate,
      eventTime,
      organizer,
    });

    await newEvent.save();
    res.status(201).json({ message: "Event created successfully", event: newEvent });
  } catch (error) {
    res.status(500).json({ message: "Failed to create event", error: error.message });
  }
};

exports.getUpcomingEvents = async (req, res) => {
  try {
    const today = new Date();
    const upcomingEvents = await Event.find({ eventDate: { $gte: today } })
      .sort({ eventDate: 1 })
      .limit(3);

    res.status(200).json(upcomingEvents);
  } catch (error) {
    console.error("Error fetching upcoming events:", error);
    res.status(500).json({ message: "Failed to fetch upcoming events" });
  }
};
