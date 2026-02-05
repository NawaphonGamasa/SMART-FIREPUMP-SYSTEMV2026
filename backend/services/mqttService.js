const mqtt = require('mqtt');
const FirePumpModel = require('../models/FirePumpModel');
const logger = require('../utils/logger');

// เชื่อมต่อ MQTT Broker
const client = mqtt.connect('mqtt://localhost:1883');

const initMqtt = (io) => {
    // 1. เมื่อเชื่อมต่อสำเร็จ
    client.on('connect', () => {
        logger.info('📡 MQTT Broker Connected');

        // Subscribe หัวข้อ Fire Pump (ใช้ + เพื่อดักทุก Station ID)
        client.subscribe('firepump/station/+/status', (err) => {
            if (err) {
                logger.error(`❌ Subscribe Error: ${err.message}`);
            } else {
                logger.info('✅ Subscribed to topic: firepump/station/+/status');
            }
        });
    });

    // 2. เมื่อได้รับข้อความ
    client.on('message', async (topic, message) => {
        // ตรวจสอบ Topic ว่าใช่ของ Fire Pump หรือไม่
        if (topic.startsWith('firepump/station/') && topic.endsWith('/status')) {
            try {
                const msgStr = message.toString();
                const data = JSON.parse(msgStr);

                // A. บันทึกลง Database
                await FirePumpModel.create(data);

                // B. ส่ง Socket ไปหน้าเว็บ (Event ชื่อ 'firepump-update')
                io.emit('firepump-update', data);

                logger.info(`🔥 FirePump [ID:${data.station_id}] Updated: Run=${data.status_run}, Fault=${data.status_fault}`);

            } catch (err) {
                logger.error(`❌ MQTT Message Error: ${err.message} | Payload: ${message.toString()}`);
            }
        }
    });

    // 3. จัดการ Error
    client.on('error', (err) => {
        logger.error(`❌ MQTT Connection Error: ${err.message}`);
    });
};

// ลบฟังก์ชัน sendCommand ออก เพราะ Fire Pump โปรเจคนี้ไม่มีการสั่งงานกลับ

module.exports = { initMqtt };