// server.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const configViewEngine = require('./config/viewEngine');
const webRoutes = require('./routes/web');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const http = require('http'); // Import http module
const socketIo = require('socket.io'); // Import socket.io

const app = express();
const server = http.createServer(app); // Create a server with http
const io = socketIo(server); // Initialize Socket.IO with the server

const port = process.env.PORT || 3000;
const hostname = process.env.HOST_NAME || 'localhost';

// Swagger configuration
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'My API Documentation',
        version: '1.0.0',
        description: 'API documentation for my application',
    },
    servers: [
        {
            url: `http://${hostname}:${port}`, // Change this to match your hostname and port
        },
    ],
};

const swaggerOptions = {
    swaggerDefinition,
    apis: [path.join(__dirname, 'routes', 'swagger.js')], // Sử dụng path để tạo đường dẫn chính xác
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Setup Swagger UI route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Config template engine
configViewEngine(app);

// Declare routes
app.use('/', webRoutes);

// Cấu hình máy chủ để phục vụ tệp tĩnh từ thư mục 'services'
app.use('/services', express.static(path.join(__dirname, 'services')));

// Handle Socket.IO connections
io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle events from the client
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    // You can handle more events here
});

// Start the MQTT client setup
const mqttClient = require('./services/mqttClient')(io); // Pass io to mqttClient

// Start the server
server.listen(port, hostname, () => {
    console.log(`Example app listening at http://${hostname}:${port}`);
});

// Export io for use in other modules
module.exports = { io };
