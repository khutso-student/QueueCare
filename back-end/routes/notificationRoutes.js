const express = require('express');
const router = express.Router();
const { getNotifications, deleteNotification, clearNotifications, markAsRead } = require('../controllers/notificationController');
const { protect } = require('../middleware/auth'); // Your auth middleware to get req.user

router.use(protect);

router.get('/', getNotifications);
router.delete('/:id', deleteNotification);
router.delete('/', clearNotifications);
router.patch('/:id/read', markAsRead);

module.exports = router;
