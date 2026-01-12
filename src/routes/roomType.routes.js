const express = require("express");
const router = express.Router();

const isAdmin = require("../middleware/admin.middleware");
const { addRoomType } = require("../controllers/roomType.controller");

router.post("/", isAdmin, addRoomType);

module.exports = router;
