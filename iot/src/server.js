require('dotenv').config()
const express = require('express')
const path = require('path')
const configViewEngine = require('./config/viewEngine')
const webRoutes = require('./routes/web')
const mqttClient = require('./services/mqttClient')
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express()
const port = process.env.PORT || 3000
const hostname = process.env.HOST_NAME || 'localhost'

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

//config template engine
configViewEngine(app);

// Declare routes
app.use('/', webRoutes)

// Cấu hình máy chủ để phục vụ tệp tĩnh từ thư mục 'services'
app.use('/services', express.static(path.join(__dirname, 'services')));

app.listen(port, hostname, () => {
  console.log(`Example app listening at http://${hostname}:${port}`);
});

