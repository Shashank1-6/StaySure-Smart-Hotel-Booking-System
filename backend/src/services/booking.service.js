const Booking = require("../models/Booking");

/**
 * Counts confirmed overlapping bookings for a room type
 */
const countActiveBookings = async (
  roomTypeId,
  checkInDate,
  checkOutDate
) => {
  return Booking.countDocuments({
    roomTypeId,
    status: "CONFIRMED",
    checkInDate: { $lt: checkOutDate },
    checkOutDate: { $gt: checkInDate }
  });
};

module.exports = {
  countActiveBookings
};
