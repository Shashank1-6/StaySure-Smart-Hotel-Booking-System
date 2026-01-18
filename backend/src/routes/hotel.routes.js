const express = require("express");
const router = express.Router();

const isAdmin = require("../middleware/admin.middleware");
const { getAllHotels, createHotel } = require("../controllers/hotel.controller");

router.get("/", isAdmin, getAllHotels);
router.post("/", isAdmin, createHotel);

module.exports = router;
