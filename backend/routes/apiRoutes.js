const express = require('express');
const router = express.Router();
const dataController = require('../controllers/dataController');

// GET ข้อมูล Dashboard (สถานะปั๊มทุกตัว)
router.get('/dashboard', dataController.getDashboardData);
router.get('/report', dataController.getDailyReport);

module.exports = router;