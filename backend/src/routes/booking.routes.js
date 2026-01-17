const express = require("express");
const router = express.Router();
const { createBooking, cancelBooking } = require("../controllers/booking.controller");

router.post("/", createBooking);
router.patch("/:bookingId/cancel", cancelBooking);
module.exports = router;