const express = require("express");
const router = express.Router();

const { searchHotels } = require("../controllers/search.controller");

router.get("/hotels", searchHotels);

module.exports = router;
