const dataModel = require('../models/dataModel');


//for chart
const getData = (req, res) => {
    dataModel.getAllData((err, results) => {
        if (err) {
            console.error("Database query error: ", err);
            res.status(500).json({ error: 'Database query error' });
            return;
        }
        res.status(200).json(results);
    });
}

const getAction = (req, res) => {
    dataModel.getAllAction((err, results) => {
        if (err) {
            console.error("Database query error: ", err);
            res.status(500).json({ error: 'Database query error' });
            return;
        }
        res.status(200).json(results);
    });
}

// Lưu dữ liệu cảm biến
const saveSensorData = (temperature, humidity, light, callback) => {
    // Kiểm tra tính hợp lệ của dữ liệu đầu vào
    if (typeof temperature !== 'number' || typeof humidity !== 'number' || typeof light !== 'number') {
        return res.status(400).json({ error: 'Invalid data provided.' });
    }
    
    const now = new Date();
    dataModel.insertSensorData(temperature, humidity, light, now, callback);
};

// Lưu lịch sử hành động của thiết bị
const saveDeviceAction = (device_id, status, callback) => {

    // Kiểm tra tính hợp lệ của dữ liệu đầu vào
    if (typeof device_id !== 'string' || typeof status !== 'string') {
        return res.status(400).json({ error: 'Invalid data provided.' });
    }

    const now = new Date();
    dataModel.insertActionHistory(device_id, status, now, callback);
};


const getWeb = (req, res) => {
    res.render('app.ejs')
}

module.exports = {
    getData,
    getAction,
    getWeb,
    saveSensorData,
    saveDeviceAction
}