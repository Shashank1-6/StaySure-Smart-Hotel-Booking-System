const Hotel = require("../models/Hotel");

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
  createHotel
};
