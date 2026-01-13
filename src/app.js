const express = require("express");

const healthRoutes = require("./routes/health.routes");
const hotelRoutes = require("./routes/hotel.routes");
const roomTypeRoutes = require("./routes/roomType.routes");
const searchRoutes = require("./routes/search.routes");
const availabilityRoutes = require("./routes/availability.routes");

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/health", healthRoutes);
app.use("/admin/hotels", hotelRoutes);
app.use("/admin/room-types", roomTypeRoutes);
app.use("/search", searchRoutes);
app.use("/availability", availabilityRoutes);

module.exports = app;
