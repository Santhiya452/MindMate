const express = require('express');
const router = express.Router();
const { sendMessage, getChats, getChat } = require('../controllers/chatControllers');
const { protect } = require('../middlewares/authMiddleware');

router.post('/send', protect, sendMessage);
router.get('/', protect, getChats);
router.get('/:id', protect, getChat);

module.exports = router;