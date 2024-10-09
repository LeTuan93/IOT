const dataModel = require('../models/dataModel');
const axios = require('axios'); // Giả định rằng bạn đã cài đặt axios

// for chart
const getData = (req, res) => {
    // Lấy các tham số từ query
    const { id, temperature, humidity, light, time } = req.query; 
    console.log('Query parameters:', req.query);

    // Tạo một đối tượng chứa các tham số đã lọc
    const queryFilters = {};
    if (id) queryFilters.id = id;
    if (temperature) queryFilters.temperature = temperature;
    if (humidity) queryFilters.humidity = humidity;
    if (light) queryFilters.light = light;
    
    // Kiểm tra các tham số đầu vào
    if (id && isNaN(id)) {
        return res.status(400).json({ error: 'Invalid query parameters. id must be a number.' });
    }
    if (temperature && isNaN(temperature)) {
        return res.status(400).json({ error: 'Invalid query parameters. temperature must be a number.' });
    }
    if (humidity && isNaN(humidity)) {
        return res.status(400).json({ error: 'Invalid query parameters. humidity must be a number.' });
    }
    if (light && isNaN(light)) {
        return res.status(400).json({ error: 'Invalid query parameters. light must be a number.' });
    }

    // Kiểm tra định dạng thời gian và chuyển đổi
    let parsedTime;
    if (time) {
        const timeRegex = /^(\d{2}:\d{2}:\d{2}) - (\d{2})\/(\d{2})\/(\d{4})$/;
        // ví dụ thời gian: 12:34:56 - 12/12/2021
        const match = time.match(timeRegex);
        if (!match) {
            return res.status(400).json({ error: 'Invalid query parameters. time must be in the format HH:mm:ss - DD/MM/YYYY.' });
        }
        const [, h, d, m, y] = match;

        // Điều chỉnh cho múi giờ UTC+7
        const utcOffset = 7; // Múi giờ UTC+7
        const date = new Date(Date.UTC(y, m - 1, d, h.split(':')[0], h.split(':')[1], h.split(':')[2])); // Tạo đối tượng Date với UTC
        date.setHours(date.getHours() - utcOffset); // Điều chỉnh về giờ UTC
        parsedTime = date.toISOString(); // Convert to ISO string
        queryFilters.time = parsedTime; // Set the parsed time to the filters
    }

    // console.log('Query filters:', queryFilters);

    dataModel.getAllData((err, results) => {
        if (err) {
            console.error("Database query error: ", err);
            return res.status(500).json({ error: 'Database query error' });
        }

        // Nếu không có bộ lọc, trả về tất cả dữ liệu
        if (Object.keys(queryFilters).length === 0) {
            return res.status(200).json(results);
        }

        // Lọc kết quả dựa trên các tham số
        const filteredResults = results.filter(item => {
            let isValid = true;
            if (id && item.id !== parseInt(id)) isValid = false;
            if (temperature && item.temperature !== parseFloat(temperature)) isValid = false;
            if (humidity && item.humidity !== parseFloat(humidity)) isValid = false;
            if (light && item.light !== parseFloat(light)) isValid = false;
            if (time && new Date(item.time).toISOString() !== parsedTime) isValid = false; // So sánh với thời gian đã chuyển đổi
            return isValid;
        });

        // Nếu length filter == 0 thì trả về 404
        if (filteredResults.length === 0) {
            return res.status(404).json({ error: 'No data found.' });
        }

        // Sắp xếp kết quả theo time
        filteredResults.sort((a, b) => new Date(a.time) - new Date(b.time));

        console.log('Filtered results:', filteredResults);
        res.status(200).json(filteredResults);
    });
};

const getAction = (req, res) => {
    // Lấy các tham số từ query
    const { id, device_id, status, time } = req.query; 
    // console.log('Query parameters:', req.query);

    // Tạo một đối tượng chứa các tham số đã lọc
    const queryFilters = {};
    if (id) queryFilters.id = id;
    if (device_id) queryFilters.device_id = device_id;
    if (status) queryFilters.status = status;
    
    // Kiểm tra các tham số đầu vào
    if (id && isNaN(id)) {
        return res.status(400).json({ error: 'Invalid query parameters. id must be a number.' });
    }

    // Kiểm tra định dạng thời gian và chuyển đổi
    let parsedTime;
    if (time) {
        const timeRegex = /^(\d{2}:\d{2}:\d{2}) - (\d{2})\/(\d{2})\/(\d{4})$/;
        // ví dụ thời gian: 12:34:56 - 12/12/2021
        const match = time.match(timeRegex);
        if (!match) {
            return res.status(400).json({ error: 'Invalid query parameters. time must be in the format HH:mm:ss - DD/MM/YYYY.' });
        }
        const [, h, d, m, y] = match;

        // Điều chỉnh cho múi giờ UTC+7
        const utcOffset = 7; // Múi giờ UTC+7
        const date = new Date(Date.UTC(y, m - 1, d, h.split(':')[0], h.split(':')[1], h.split(':')[2])); // Tạo đối tượng Date với UTC
        date.setHours(date.getHours() - utcOffset); // Điều chỉnh về giờ UTC
        parsedTime = date.toISOString(); // Chuyển đổi sang ISO string
        queryFilters.time = parsedTime; // Set the parsed time to the filters
    }

    // console.log('Query filters:', queryFilters);

    dataModel.getAllAction((err, results) => {
        if (err) {
            console.error("Database query error: ", err);
            res.status(500).json({ error: 'Database query error' });
            return;
        }

        // Nếu không có bộ lọc, trả về tất cả dữ liệu
        if (Object.keys(queryFilters).length === 0) {
            return res.status(200).json(results);
        }

        // Lọc kết quả dựa trên các tham số
        const filteredResults = results.filter(item => {
            let isValid = true;
            if (id && item.id !== parseInt(id)) isValid = false;
            if (device_id && item.device_id !== device_id) isValid = false;
            if (status && item.status !== status) isValid = false;
            if (time && new Date(item.time).toISOString() !== parsedTime) isValid = false; // So sánh với thời gian đã chuyển đổi
            return isValid;
        });

        // Nếu length filter == 0 thì trả về 404
        if (filteredResults.length === 0) {
            return res.status(404).json({ error: 'No data found.' });
        }

        // Sắp xếp kết quả theo time
        filteredResults.sort((a, b) => new Date(a.time) - new Date(b.time));

        console.log('Filtered results:', filteredResults);
        res.status(200).json(filteredResults);
    });
};


// Lưu dữ liệu cảm biến
const saveSensorData = (temperature, humidity, light, Dash, callback) => {
    const now = new Date();
    dataModel.insertSensorData(temperature, humidity, light, now,Dash, callback);
};

// const saveSensorData = (temperature, humidity, light, callback) => {
//     const now = new Date();
//     dataModel.insertSensorData(temperature, humidity, light, now, callback);
// };

// Lưu lịch sử hành động của thiết bị
const saveDeviceAction = (device_id, status, callback) => {
    const now = new Date();
    dataModel.insertActionHistory(device_id, status, now, callback);
};



const getWeb = (req, res) => {
    res.render('app.ejs');
};

module.exports = {
    getData,
    getAction,
    getWeb,
    saveSensorData,
    saveDeviceAction
};
