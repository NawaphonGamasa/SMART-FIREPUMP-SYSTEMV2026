const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    const { username, password } = req.body;
    console.log('------------------------------------------------');
    console.log(`🔍 Login Attempt: Username = "${username}"`);
    console.log(`🔑 Password Input: "${password}"`);

    try {
        const [users] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);

        if (users.length === 0) {
            return res.status(401).json({ status: 'error', message: 'User not found' });
        }
        const user = users[0];
        console.log(`🟢 เจอ User แล้ว (ID: ${user.id})`);
        console.log(`   -> Hash ใน DB: ${user.password.substring(0, 10)}...`); // โชว์แค่ 10 ตัวแรก

        console.log('🟡กำลังตรวจสอบรหัสผ่าน (Bcrypt Comparing)...');
        const isMatch = await bcrypt.compare(password, user.password);
        console.log(`   -> ผลการตรวจสอบ: ${isMatch ? '✅ ตรงกัน' : '❌ ไม่ตรง'}`);

        if (!isMatch) {
            console.log('🔴รหัสผ่านผิด (Password Incorrect)');
            return res.status(401).json({ status: 'error', message: 'Invalid Password' });
        }
        console.log('✅ Password Correct! Generating Token...');

        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            status: 'success',
            message: 'Login successful',
            token,
            username: user.username,
            role: user.role
        });
    } catch (error) {
        console.error('Login Error:', err);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
}