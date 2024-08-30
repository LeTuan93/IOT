require('dotenv').config()
const express = require('express')
const path = require('path')
const configViewEngine = require('./config/viewEngine')
const webRoutes = require('./routes/web')
const mqttClient = require('./services/mqttClient')

const app = express()
const port = process.env.PORT || 3000
const hostname = process.env.HOST_NAME

//config template engine
configViewEngine(app);

//khai bao router
app.use('/', webRoutes)


app.listen(port, hostname, () => {
  console.log(`Example app listening at http://localhost:${port}`);

  // Kiểm tra kết nối MQTT
  if (mqttClient.connected) {
      console.log('MQTT client is connected');
  } else {
      console.log('MQTT client is not connected');
  }
});