const Booking = require("../models/Booking");


const getBookedRoomCount = async (
  roomTypeId,
  checkInDate,
  checkOutDate
) => {
  const bookings = await Booking.countDocuments({
    roomTypeId,
    status: "CONFIRMED",
    $or: [
      {
        checkInDate: { $lt: checkOutDate },
        checkOutDate: { $gt: checkInDate }
      }
    ]
  });

  return bookings;
};

module.exports = {
  getBookedRoomCount
};
