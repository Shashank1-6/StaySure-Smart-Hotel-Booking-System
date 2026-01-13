const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true
    },
    roomTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RoomType",
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    checkInDate: {
      type: Date,
      required: true
    },
    checkOutDate: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ["CONFIRMED", "CANCELLED", "EXPIRED", "COMPLETED"],
      default: "CONFIRMED"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
