const express = require('express');
const router = express.Router();
const controller = require('../controllers/homeControllers');

/**
 * @swagger
 * /api:
 *   post:
 *     summary: Save sensor data
 *     description: Receive and save new sensor data.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               temperature:
 *                 type: number
 *                 description: The temperature in Celsius.
 *                 example: 22.3
 *               humidity:
 *                 type: number
 *                 description: The humidity percentage.
 *                 example: 65.5
 *               light:
 *                 type: number
 *                 description: The light level in lux.
 *                 example: 300
 *     responses:
 *       201:
 *         description: Sensor data saved successfully.
 *       400:
 *         description: Invalid data provided.
 *       500:
 *         description: Database insert error
 *   get:
 *     summary: Retrieve sensor data
 *     description: Get all sensor data from the database.
 *     responses:
 *       200:
 *         description: A list of sensor data.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The unique ID of the data record.
 *                     example: 1
 *                   humidity:
 *                     type: number
 *                     description: The humidity percentage.
 *                     example: 65.5
 *                   temperature:
 *                     type: number
 *                     description: The temperature in Celsius.
 *                     example: 22.3
 *                   light:
 *                     type: number
 *                     description: The light level in lux.
 *                     example: 300
 *                   time:
 *                     type: string
 *                     format: date-time
 *                     description: The timestamp of the data.
 *                     example: "2024-08-28T23:02:24.000Z"
 *       500:
 *         description: Database query error
 */

/**
 * @swagger
 * /api/action-history:
 *   post:
 *     summary: Save action history
 *     description: Receive and save new action history records.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               device_id:
 *                 type: string
 *                 description: The ID of the device.
 *                 example: "QUAT"
 *               status:
 *                 type: string
 *                 description: The status of the device (Turned On or Turned Off).
 *                 example: "Turned On"
 *               time:
 *                 type: string
 *                 format: date-time
 *                 description: The timestamp of the action.
 *                 example: "2024-08-28T23:09:37.000Z"
 *     responses:
 *       201:
 *         description: Action history saved successfully.
 *       400:
 *         description: Invalid data provided.
 *       500:
 *         description: Database insert error
 *   get:
 *     summary: Retrieve action history
 *     description: Get all action history records from the database.
 *     responses:
 *       200:
 *         description: A list of action history records.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The unique ID of the action record.
 *                     example: 1
 *                   device_id:
 *                     type: string
 *                     description: The ID of the device.
 *                     example: "QUAT"
 *                   status:
 *                     type: string
 *                     description: The status of the device (Turned On or Turned Off).
 *                     example: "Turned On"
 *                   time:
 *                     type: string
 *                     format: date-time
 *                     description: The timestamp of the action.
 *                     example: "2024-08-28T23:09:37.000Z"
 *       500:
 *         description: Database query error
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: Render the main application page
 *     description: Display the app.ejs page.
 *     responses:
 *       200:
 *         description: The app page rendered successfully.
 */

router.post('/api', controller.saveData);
router.get('/api', controller.getData);
router.post('/api/action-history', controller.saveAction);
router.get('/api/action-history', controller.getActionHistory);
router.get('/', controller.getWeb);

module.exports = router;
