// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');
const adminController = require('../controllers/adminController');

router.post('/assign-role', auth, roleAuth(['admin']), adminController.assignRole);
router.get('/users', auth, roleAuth(['admin']), adminController.getAllUsers);
router.delete('/delete-user/:userId', auth, roleAuth(['admin']), adminController.deleteUser);

module.exports = router;
