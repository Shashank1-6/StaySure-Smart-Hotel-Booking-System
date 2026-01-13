const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const RoomType = require("../models/RoomType");
const { countActiveBookings } = require("../services/booking.service");

const { expireOldBookings } = require("../services/bookingExpiry.service");

const createBooking = async (req, res) => {
    await expireOldBookings();
  const {
    hotelId,
    roomTypeId,
    userId,
    checkInDate,
    checkOutDate
  } = req.body;

  if (
    !hotelId ||
    !roomTypeId ||
    !userId ||
    !checkInDate ||
    !checkOutDate
  ) {
    return res.status(400).json({
      message: "All fields are required"
    });
  }

  const roomType = await RoomType.findById(roomTypeId);

  if (!roomType) {
    return res.status(404).json({
      message: "Room type not found"
    });
  }

  const activeBookings = await countActiveBookings(
    roomTypeId,
    new Date(checkInDate),
    new Date(checkOutDate)
  );

  if (activeBookings >= roomType.totalRooms) {
    return res.status(409).json({
      message: "Room not available for selected dates"
    });
  }

  // ✅ Create booking (inventory is now logically blocked)
  const booking = await Booking.create({
    hotelId: new mongoose.Types.ObjectId(hotelId),
    roomTypeId: new mongoose.Types.ObjectId(roomTypeId),
    userId: new mongoose.Types.ObjectId(userId),
    checkInDate,
    checkOutDate,
    status: "CONFIRMED"
  });

  res.status(201).json(booking);
};



const cancelBooking = async (req, res) => {
  const { bookingId } = req.params;


  const booking = await Booking.findById(bookingId);

  if (!booking) {
    return res.status(404).json({
      message: "Booking not found"
    });
  }

  if (booking.status !== "CONFIRMED") {
    return res.status(400).json({
      message: "Only confirmed bookings can be cancelled"
    });
  }

  booking.status = "CANCELLED";
  await booking.save();

  res.status(200).json({
    message: "Booking cancelled successfully"
  });
};

module.exports = {
  createBooking,cancelBooking
};
