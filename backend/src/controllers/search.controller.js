const Hotel = require("../models/Hotel");
const RoomType = require("../models/RoomType");
const { evaluateHotelConfidence } = require("../services/confidenceEngine.service");

const searchHotels = async (req, res) => {
  const { location } = req.query;

  if (!location) {
    return res.status(400).json({
      message: "Location query parameter is required"
    });
  }

  // Find hotels by location (case-insensitive)
  const hotels = await Hotel.find({
    location: { $regex: location, $options: "i" }
  });

  // Attach room types to each hotel
  const result = [];

  for (const hotel of hotels) {
    const roomTypes = await RoomType.find({
      hotelId: hotel._id
    });
    const confidence = await evaluateHotelConfidence(hotel._id);

    result.push({
      ...hotel.toObject(),
      roomTypes,
      confidence
    });
  }

  res.status(200).json(result);
};

module.exports = {
  searchHotels
};
