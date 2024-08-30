const mqtt = require('mqtt');
const connection = require('../config/database');

const options = {
    host: 'localhost',
    port: 1883,
    username: 'Tuan',
    password: 'Latuan9303.'
};

const client = mqtt.connect(options);

client.on('connect', () => {
    console.log('Connected to MQTT broker');
    client.subscribe('Sensor_data', (err) => {
        if (err) {
            console.error('Failed to subscribe to topic', err);
        }
    });
});

client.on('message', (topic, message) => {
    if (topic === 'Sensor_data') {
        try {
            // Parse the message as JSON
            const data = JSON.parse(message.toString());

            // Save data to the database
            const query = 'INSERT INTO Devices (device_id, temperature, humidity, light) VALUES (?, ?, ?, ?)';
            connection.query(query, [data.device_id, data.temperature, data.humidity, data.light, new Date()], (err) => {
                if (err) {
                    console.error('Database insert error:', err);
                }
            });
        } catch (error) {
            console.error('Failed to parse message as JSON:', error);
        }
    }
});

module.exports = client;
