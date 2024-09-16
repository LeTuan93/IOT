const mqtt = require('mqtt');
const connection = require('../config/database'); // Đảm bảo đường dẫn đúng đến module cấu hình cơ sở dữ liệu

const options = {
    host: '192.168.1.211',
    port: 1883,
    username: 'B21DCAT205',
    password: '123'
};

const client = mqtt.connect(options);

// MQTT client connection setup
client.on('connect', () => {
    console.log('Connected to MQTT broker');

    // Subscribe to relevant topics
    const topics = [
        'home/sensors', // Sensor data
        'home/devices/den/status',   // Led status
        'home/devices/quat/status', // Fan status
        'home/devices/dieuhoa/status' // Air Conditioner status
    ];

    topics.forEach(topic => {
        client.subscribe(topic, (err) => {
            if (err) {
                console.error(`Failed to subscribe to ${topic}`, err);
            } else {
                console.log(`Subscribed to ${topic}`);
            }
        });
    });
});

// Function to handle incoming MQTT messages
client.on('message', (topic, message) => {
    try {
        let data;
        if (topic === 'home/sensors') {
            // Try parsing JSON data
            data = JSON.parse(message.toString());
            const now = new Date();

            // Save sensor data to the database
            const query = 'INSERT INTO Devices (temperature, humidity, light, time) VALUES (?, ?, ?, ?)';
            connection.query(query, [data.temperature, data.humidity, data.light, now], (err) => {
                if (err) {
                    console.error('Database insert error:', err);
                } else {
                    console.log('Sensor data inserted into database');
                }
            });
        } else if (topic.startsWith('home/devices/') && topic.endsWith('/status')) {
            // Handle device status messages which may not be JSON
            let status = message.toString();
            let device_id = topic.split('/')[2];

            if (device_id == 'den') {
                device_id = 'Led';
            } else if (device_id == 'quat') {
                device_id = 'Fan';
            }
            else if (device_id == 'dieuhoa') {
                device_id = 'Air Conditioner';
            }
            else  {
                device_id = 'Unknown';
            }
            
            if (status=='ON'){
                status = 'Turned On'
            } else {
                status = 'Turned Off'
            }

            const now = new Date();

            // Save device status to the database
            const query = 'INSERT INTO Actions (device_id, status, time) VALUES (?, ?, ?)';
            connection.query(query, [device_id, status, now], (err) => {
                if (err) {
                    console.error('Database insert error:', err);
                } else {
                    console.log('Device status inserted into database');
                }
            });
        } 
    } catch (error) {
        console.error('Failed to process message:', error);
    }
});
