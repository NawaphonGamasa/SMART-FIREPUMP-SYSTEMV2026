const express = require('express');
const router = express.Router();
const dataController = require('../controllers/dataController');
const authController = require('../controllers/authController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.post('/login', authController.login);

// GET ข้อมูลทั้งหมด
router.get('/dashboard', verifyToken, dataController.getDashboardData);
router.get('/report', verifyToken, dataController.getDailyReport);

module.exports = router;