const express = require("express");
const router = express.Router();

const isAdmin = require("../middleware/admin.middleware");
const { createHotel } = require("../controllers/hotel.controller");

router.post("/", isAdmin, createHotel);

module.exports = router;
