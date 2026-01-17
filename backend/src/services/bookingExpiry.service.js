const Booking = require("../models/Booking");

const EXPIRY_TIME_IN_MINUTES = 15;

const expireOldBookings = async () => {
  const expiryTime = new Date(
    Date.now() - EXPIRY_TIME_IN_MINUTES * 60 * 1000
  );

  await Booking.updateMany(
    {
      status: "CONFIRMED",
      createdAt: { $lt: expiryTime }
    },
    {
      $set: { status: "EXPIRED" }
    }
  );
};

module.exports = {
  expireOldBookings
};
