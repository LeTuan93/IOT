const mqtt = require('mqtt');
const connection = require('../config/database');

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
    client.subscribe('home/sensors', (err) => {
        if (err) {
            console.error('Failed to subscribe to home/sensors topic', err);
        } else {
            console.log('Subscribed to home/sensors topic');
        }
    });
    client.subscribe('home/devices/den/status', (err) => {
        if (err) {
            console.error('Failed to subscribe to home/devices/den/status topic', err);
        } else {
            console.log('Subscribed to home/devices/den/status topic');
        }
    });
    client.subscribe('home/devices/quat/status', (err) => {
        if (err) {
            console.error('Failed to subscribe to home/devices/quat/status topic', err);
        } else {
            console.log('Subscribed to home/devices/quat/status topic');
        }
    });
    client.subscribe('home/devices/dieuhoa/status', (err) => {
        if (err) {
            console.error('Failed to subscribe to home/devices/dieuhoa/status topic', err);
        } else {
            console.log('Subscribed to home/devices/dieuhoa/status topic');
        }
    });
    client.subscribe('home/devices/control', (err) => {
        if (err) {
            console.error('Failed to subscribe to home/devices/control topic', err);
        } else {
            console.log('Subscribed to home/devices/control topic');
        }
    });
});

// Function to handle incoming MQTT messages
client.on('message', (topic, message) => {
    if (topic === 'home/sensors') {
        try {
            // Parse the message as JSON
            const data = JSON.parse(message.toString());

            // Create a date object
            const now = new Date();

            // Save sensor data to the database
            const query = 'INSERT INTO Devices (temperature, humidity, light, time) VALUES (?, ?, ?, ?)';
            connection.query(query, [data.temperature, data.humidity, data.light, now], (err) => {
                if (err) {
                    console.error('Database insert error:', err);
                }
            });
        } catch (error) {
            console.error('Failed to parse Sensor_data message as JSON:', error);
        }
    }

    if (topic === 'home/devices/den/status' || topic === 'home/devices/quat/status' || topic === 'home/devices/dieuhoa/status') {
        try {
            // Parse the message as JSON
            const data = JSON.parse(message.toString());

            // Assuming `data` contains fields like {status: 'ON'}
            const device_id = topic.split('/')[3]; // Extract device ID from the topic
            const query = 'INSERT INTO Actions (device_id, status, time) VALUES (?, ?, ?)';
            connection.query(query, [device_id, data.status, new Date()], (err) => {
                if (err) {
                    console.error('Database insert error:', err);
                }
            });

        } catch (error) {
            console.error('Failed to parse device status message as JSON:', error);
        }
    }

    if (topic === 'home/devices/control') {
        try {
            // Parse the message as JSON
            const data = JSON.parse(message.toString());

            // Assuming `data` contains fields like {device_id: 'Light1', status: 'ON'}
            const query = 'INSERT INTO Actions (device_id, status, time) VALUES (?, ?, ?)';
            connection.query(query, [data.device_id, data.status, new Date()], (err) => {
                if (err) {
                    console.error('Database insert error:', err);
                }
            });

            // Publish a confirmation message
            const confirmationMessage = JSON.stringify({ device_id: data.device_id, status: data.status });
            client.publish('home/devices/control/confirmation', confirmationMessage, (err) => {
                if (err) {
                    console.error('Failed to publish confirmation message:', err);
                } else {
                    console.log(`Confirmation message sent to home/devices/control/confirmation topic: ${confirmationMessage}`);
                }
            });

        } catch (error) {
            console.error('Failed to parse Devices_control message as JSON:', error);
        }
    }
});

// Object to map deviceId to specific topics
const deviceTopics = {
    "Quạt": "home/devices/quat",
    "Điều hòa": "home/devices/dieuhoa",
    "Đèn": "home/devices/den"
};

// Function to send control commands for devices
function controlDevice(deviceId, status) {
    // Determine the topic based on deviceId
    const topic = deviceTopics[deviceId];

    if (!topic) {
        console.error(`Unknown deviceId: ${deviceId}`);
        return;
    }

    const message = JSON.stringify({ device_id: deviceId, status: status });
    client.publish(topic, message, (err) => {
        if (err) {
            console.error(`Failed to publish message to ${topic}:`, err);
        } else {
            console.log(`Message sent to ${topic} topic: ${message}`);
        }
    });
}

// Exporting the client for use in other parts of your application
module.exports = {
    client,
    controlDevice
};
