const mqtt = require('mqtt');
const { saveSensorData, saveDeviceAction } = require('../controllers/homeControllers'); // Import controller

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
            data = JSON.parse(message.toString());
            saveSensorData(data.temperature, data.humidity, data.light, (err) => {
                if (err) {
                    console.error('Failed to save sensor data:', err);
                } else {
                    console.log('Sensor data saved');
                }
            });
        } else if (topic.startsWith('home/devices/') && topic.endsWith('/status')) {
            let status = message.toString();
            let device_id = topic.split('/')[2];

            // Convert device_id and status to user-friendly formats
            device_id = convertDeviceID(device_id);
            status = status === 'ON' ? 'Turned On' : 'Turned Off';

            saveDeviceAction(device_id, status, (err) => {
                if (err) {
                    console.error('Failed to save device action:', err);
                } else {
                    console.log('Device action saved');
                }
            });
        }
    } catch (error) {
        console.error('Failed to process message:', error);
    }
});

// Hàm chuyển đổi device_id
const convertDeviceID = (device_id) => {
    switch (device_id) {
        case 'den':
            return 'Led';
        case 'quat':
            return 'Fan';
        case 'dieuhoa':
            return 'Air Conditioner';
        default:
            return 'Unknown';
    }
};
