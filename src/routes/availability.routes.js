const express = require("express");
const router = express.Router();

const {
  getAvailableRoomTypes
} = require("../controllers/availability.controller");

router.get("/rooms", getAvailableRoomTypes);

module.exports = router;
