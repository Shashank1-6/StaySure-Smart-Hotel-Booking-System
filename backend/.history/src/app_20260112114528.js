const express = require("express");

const healthRoutes = require("./routes/health.routes");

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/health", healthRoutes);

module.exports = app;
