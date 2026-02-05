const express = require('express');
const router = express.Router();
const firePumpController = require('../controllers/firePumpController');

// GET ข้อมูล Dashboard (สถานะปั๊มทุกตัว)
router.get('/dashboard', firePumpController.getDashboardData);

module.exports = router;