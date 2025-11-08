// Import the express module
const express = require('express');

// Import the body-parser module
const bodyParser = require('body-parser');

// Import the path module
const path = require('path');

const PORT = process.env.PORT || 3000


// In-memory storage for IMU and GPS data
const imuData = []
const gpsData = []

const app = express()
app.use(bodyParser.json()); // Note: Body parser should return JSON data instead of URL encoded data.

// POST /imu - Store IMU data
app.post("/imu", (req, res) => {
  const data = {
    ...req.body,
    timestamp: new Date().toISOString(),
    id: imuData.length + 1,
  }

  imuData.push(data)

  res.status(201).json({
    success: true,
    message: "IMU data stored successfully",
    data,
  })
})

// POST /gps - Store GPS data
app.post("/gps", (req, res) => {
  const data = {
    ...req.body,
    timestamp: new Date().toISOString(),
    id: gpsData.length + 1,
  }

  gpsData.push(data)

  res.status(201).json({
    success: true,
    message: "GPS data stored successfully",
    data,
  })
})

// GET /imu - Retrieve all IMU data
app.get("/imu", (req, res) => {
  res.json({
    success: true,
    count: imuData.length,
    data: imuData,
  })
})

// GET /gps - Retrieve all GPS data
app.get("/gps", (req, res) => {
  res.json({
    success: true,
    count: gpsData.length,
    data: gpsData,
  })
})

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    message: "IMU/GPS Server is running",
    endpoints: {
      "POST /imu": "Store IMU data",
      "POST /gps": "Store GPS data",
      "GET /imu": "Retrieve all IMU data",
      "GET /gps": "Retrieve all GPS data",
    },
  })
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
  console.log(`Visit http://localhost:${PORT} to see available endpoints`)
})
