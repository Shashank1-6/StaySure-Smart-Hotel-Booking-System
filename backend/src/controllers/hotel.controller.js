const Hotel = require("../models/Hotel");

const getAllHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find({}).lean();
    res.json(hotels);
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to fetch hotels" });
  }
};

const createHotel = async (req, res) => {
  const { name, location, description } = req.body;

  const hotel = await Hotel.create({
    name,
    location,
    description
  });

  res.status(201).json(hotel);
};

module.exports = {
  getAllHotels,
  createHotel
};
