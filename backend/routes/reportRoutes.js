const express = require('express');
const { reportContent, getAllReports, deleteReportedItem,approveReportedItem } = require('../controllers/reportController');
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');

const router = express.Router();

router.post('/submit', auth, reportContent);
router.get('/all', auth, roleAuth(['moderator', 'admin']), getAllReports);
router.delete('/delete', auth, roleAuth(['moderator', 'admin']), deleteReportedItem);
router.post('/approve', auth, roleAuth(['moderator', 'admin']), approveReportedItem);


module.exports = router;
