const connection = require('../config/database');  // Kết nối tới cơ sở dữ liệu

const getAllData = (callback) => {
    const query = 'SELECT * FROM Devices p';
    connection.query(query, (err, results) => {
        if (err) {
            console.error("Database query error: ", err);
            return callback(err, null);
        }
        callback(null, results);
    });
};

const getAllAction = (callback) => {
    const query = 'SELECT * FROM Actions s';
    connection.query(query, (err, results) => {
        if (err) {
            console.error("Database query error: ", err);
            return callback(err, null);
        }
        callback(null, results);
    });
};

// Hàm lưu dữ liệu cảm biến
const insertSensorData = (temperature, humidity, light, time, callback) => {
    const query = 'INSERT INTO Devices (temperature, humidity, light, time) VALUES (?, ?, ?, ?)';
    connection.query(query, [temperature, humidity, light, time], callback);
};

// Hàm lưu trạng thái hành động của thiết bị
const insertActionHistory = (device_id, status, time, callback) => {
    const query = 'INSERT INTO Actions (device_id, status, time) VALUES (?, ?, ?)';
    connection.query(query, [device_id, status, time], callback);
};

// Xuất ra các hàm đã định nghĩa để sử dụng ở nơi khác
module.exports = {
    getAllData,
    getAllAction,
    insertSensorData,
    insertActionHistory
};
