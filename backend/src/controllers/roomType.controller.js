const RoomType = require("../models/RoomType");

const addRoomType = async (req, res) => {
  const { hotelId, name, price, totalRooms } = req.body;

  const roomType = await RoomType.create({
    hotelId,
    name,
    price,
    totalRooms
  });

  res.status(201).json(roomType);
};

module.exports = {
  addRoomType
};
