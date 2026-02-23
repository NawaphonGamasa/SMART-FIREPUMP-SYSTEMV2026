const LogModel = require('../models/LogModel');

exports.getDashboardData = async (req, res) => {
    try {
        // ดึงสถานะล่าสุดของทุกปั๊ม
        const stations = await LogModel.getLatestAllStations();

        res.json({
            status: 'success',
            data: stations
        });
    } catch (error) {
        console.error("FirePump Controller Error:", error);
        res.status(500).json({ status: 'error', message: 'Database Error' });
    }
};

exports.getDailyReport = async (req, res) => {
    try {
        const { start, end } = req.query;

        if (!start || !end) {
            return res.status(400).json({ status: 'error', message: 'กรุณาระบุวันเริ่มต้นและสิ้นสุด' });
        }

        const logs = await LogModel.getByDateRange(start, end);

        let totalPressure = 0;
        let totalRunCount = 0;
        let totalFaultCount = 0;
        let pressureRecordCount = 0;

        logs.forEach(item => {
            if (item.oil_pressure !== undefined && item.oil_pressure !== null) {
                totalPressure += parseFloat(item.oil_pressure);
                pressureRecordCount++;
            }

            if (item.status_run === 1) {
                totalRunCount++;
            }

            if (item.status_fault === 0) {
                totalFaultCount++;
            }
        });

        const count = logs.length;

        // หาค่าเฉลี่ยแรงดันน้ำมัน
        const avgPressure = pressureRecordCount > 0 ? (totalPressure / pressureRecordCount).toFixed(2) : 0;

        res.json({
            status: 'success',
            data: logs,
            summary: {
                avg_pressure: parseFloat(avgPressure), // ค่าเฉลี่ยแรงดัน
                total_runs: totalRunCount,             // จำนวนครั้งที่ปั๊มรัน
                total_faults: totalFaultCount,         // จำนวนครั้งที่เกิด Fault
                total_records: count,                  // จำนวนข้อมูลทั้งหมด
                period: { start: start, end: end }
            }
        });
    } catch (error) {
        console.error("Report Error:", error);
        res.status(500).json({ status: 'error', message: 'Database Error' });
    }
}