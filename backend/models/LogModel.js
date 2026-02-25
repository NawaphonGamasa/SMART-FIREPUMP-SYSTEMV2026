const db = require("../config/db");

const LogModel = {
    // ดึงสถานะล่าสุดของปั๊มทุกตัว (Group By เพื่อเอาข้อมูลล่าสุดของแต่ละ Station ID)
    async getLatestAllStations() {
        const sql = `
                SELECT f1.*
                FROM fire_pump_logs f1
                INNER JOIN (
                    SELECT station_id, MAX(id) AS max_id
                    FROM fire_pump_logs
                    GROUP BY station_id
                ) f2 ON f1.station_id = f2.station_id AND f1.id = f2.max_id
                ORDER BY f1.station_id ASC
                `;
        const [rows] = await db.execute(sql);
        return rows;
    },

    // บันทึกข้อมูลลง Database
    async create(data) {
        const sql = `
        INSERT INTO fire_pump_logs (station_id, status_run, status_fault, oil_pressure, timestamp)
        VALUES (?, ?, ?, ?, NOW())
    `;
        const [result] = await db.execute(sql, [
            data.station_id,
            data.status_run,
            data.status_fault,
            data.oil_pressure,
        ]);
        return result.insertId;
    },

    async getByDateRange(startDate, endDate) {
        const sql = `
        SELECT * FROM fire_pump_logs
        WHERE DATE(timestamp) BETWEEN ? AND ?
        ORDER BY timestamp DESC LIMIT 1000`;
        const [rows] = await db.execute(sql, [startDate, endDate]);
        return rows;
    }
};

module.exports = LogModel;