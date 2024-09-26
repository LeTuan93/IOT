const express = require('express');
const router = express.Router();
const controller = require('../controllers/homeControllers');

/**
 * @swagger
 * /api:
 *   get:
 *     summary: Retrieve sensor data with multiple filters
 *     description: Fetch sensor data from the database based on optional filters such as id, temperature, humidity, light, and time. The time should be provided in the format HH:mm:ss - DD/MM/YYYY, which will be converted to an ISO 8601 format for comparison.
 *     parameters:
 *       - in: query
 *         name: id
 *         required: false
 *         schema:
 *           type: integer
 *         description: The unique identifier for the sensor data.
 *       - in: query
 *         name: temperature
 *         required: false
 *         schema:
 *           type: number
 *         description: The temperature in Celsius.
 *       - in: query
 *         name: humidity
 *         required: false
 *         schema:
 *           type: number
 *         description: The humidity percentage (0-100).
 *       - in: query
 *         name: light
 *         required: false
 *         schema:
 *           type: number
 *         description: The light level in lux.
 *       - in: query
 *         name: time
 *         required: false
 *         schema:
 *           type: string
 *         description: The timestamp of the sensor reading, must be in the format HH:mm:ss - DD/MM/YYYY. This format will be converted to ISO 8601 for database queries.
 *     responses:
 *       200:
 *         description: A list of sensor data matching the filters.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The unique identifier for the sensor data.
 *                     example: 1
 *                   temperature:
 *                     type: number
 *                     description: The temperature in Celsius.
 *                     example: 22.3
 *                   humidity:
 *                     type: number
 *                     description: The humidity percentage (0-100).
 *                     example: 65.5
 *                   light:
 *                     type: number
 *                     description: The light level in lux.
 *                     example: 300
 *                   time:
 *                     type: string
 *                     format: date-time
 *                     description: The timestamp of the sensor reading in ISO 8601 format.
 *                     example: "2024-09-03T22:48:15.000Z"
 *       400:
 *         description: Invalid query parameters, ensure all filters are valid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid query parameters."
 *       404:
 *         description: No data found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No data found."
 *       500:
 *         description: Database query error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Database query error."
 */
/**
/**
 * @swagger
 * /api/action-history:
 *   get:
 *     summary: Retrieve action history
 *     description: Fetches action history based on optional filters.
 *     parameters:
 *       - name: id
 *         in: query
 *         description: The unique identifier of the action.
 *         required: false
 *         type: integer
 *         example: 1
 *       - name: device_id
 *         in: query
 *         description: The ID of the device associated with the action.
 *         required: false
 *         type: string
 *         example: "device123"
 *       - name: status
 *         in: query
 *         description: The status of the action (e.g., 'Turned On', 'Turned Off').
 *         required: false
 *         type: string
 *         example: "Turned On"
 *       - name: time
 *         in: query
 *         description: The time of the action in the format 'HH:mm:ss - DD/MM/YYYY'.
 *         required: false
 *         type: string
 *         example: "14:30:00 - 25/09/2024"
 *     responses:
 *       200:
 *         description: A list of action history items.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   device_id:
 *                     type: string
 *                     example: "device123"
 *                   status:
 *                     type: string
 *                     example: "Turned On"
 *                   time:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-09-25T14:30:00.000Z"
 *       400:
 *         description: Invalid query parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid query parameters."
 *       404:
 *         description: No data found matching the filters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No data found."
 *       500:
 *         description: Database query error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Database query error."
 */


module.exports = router;