const express = require('express');
const { addEvent,getUpcomingEvents } = require('../controllers/eventController');
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');

const router = express.Router();

// Only admin and moderator can add events
router.post("/add", auth, roleAuth(['admin', 'moderator']), addEvent);
router.get('/upcoming', getUpcomingEvents);

module.exports = router;