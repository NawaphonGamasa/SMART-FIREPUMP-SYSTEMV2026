const FirePumpModel = require('../models/FirePumpModel');

exports.getDashboardData = async (req, res) => {
    try {
        // ดึงสถานะล่าสุดของทุกปั๊ม
        const stations = await FirePumpModel.getLatestAllStations();

        res.json({
            status: 'success',
            data: stations
        });
    } catch (error) {
        console.error("FirePump Controller Error:", error);
        res.status(500).json({ status: 'error', message: 'Database Error' });
    }
};