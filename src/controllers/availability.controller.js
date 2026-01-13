const mongoose = require("mongoose");
const Hotel = require("../models/Hotel");
const RoomType = require("../models/RoomType");
const { getBookedRoomCount } = require("../services/availability.service");

const getAvailableRoomTypes = async (req, res) => {
  const { hotelId, checkInDate, checkOutDate } = req.query;

  if (!hotelId || !checkInDate || !checkOutDate) {
    return res.status(400).json({
      message: "hotelId, checkInDate and checkOutDate are required"
    });
  }
  const roomTypes = await RoomType.find({
  hotelId:new mongoose.Types.ObjectId(hotelId)
});

  const availableRoomTypes = [];

  for (const room of roomTypes) {
    const bookedCount = await getBookedRoomCount(
      room._id,
      new Date(checkInDate),
      new Date(checkOutDate)
    );

    if (bookedCount < room.totalRooms) {
      availableRoomTypes.push({
        ...room.toObject(),
        availableRooms: room.totalRooms - bookedCount
      });
    }
  }

  res.status(200).json(availableRoomTypes);
};

module.exports = {
  getAvailableRoomTypes
};
