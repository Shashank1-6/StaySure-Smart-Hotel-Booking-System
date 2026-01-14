const Booking = require("../models/Booking");
const RoomType = require("../models/RoomType");

const DAY_MS = 1000 * 60 * 60 * 24;
const MIN_BOOKINGS = 20;

async function evaluateHotelConfidence(hotelId) {
  const now = new Date();
  const last30Days = new Date(now.getTime() - 30 * DAY_MS);

  const bookings = await Booking.find({ hotelId });

  const totalBookings = bookings.length;

  if (totalBookings === 0) {
    return {
      confidenceScore: 0,
      riskLabel: "HIGH",
      breakdown: {
        reason: "No booking history"
      }
    };
  }

  const confirmedBookings = bookings.filter(b => b.status === "CONFIRMED");
  const cancelledBookings = bookings.filter(b => b.status === "CANCELLED");
  const completedBookings = bookings.filter(b => b.status === "COMPLETED");

  // ---- Cancellation Rate ----
  const cancellationRate =
    confirmedBookings.length === 0
      ? 0
      : cancelledBookings.length / confirmedBookings.length;

  // ---- Recent Activity ----
  const recentBookings = bookings.filter(
    b => b.createdAt >= last30Days
  );
  const recentActivityRatio = recentBookings.length / totalBookings;

  // ---- Lead Time ----
  const leadTimes = bookings.map(b => {
    return (b.checkInDate - b.createdAt) / DAY_MS;
  });
  const avgLeadTime =
    leadTimes.reduce((a, b) => a + b, 0) / leadTimes.length;

  // ---- Overbooking Detection ----
  const roomTypes = await RoomType.find({ hotelId });
  const totalInventory = roomTypes.reduce(
    (sum, rt) => sum + rt.totalRooms,
    0
  );

  let overbookingCount = 0;

  const bookingMap = {};

  confirmedBookings.forEach(b => {
    const dateKey = b.checkInDate.toISOString().split("T")[0];
    bookingMap[dateKey] = (bookingMap[dateKey] || 0) + 1;
  });

  Object.values(bookingMap).forEach(count => {
    if (count > totalInventory) {
      overbookingCount++;
    }
  });

  const overbookingRate =
    Object.keys(bookingMap).length === 0
      ? 0
      : overbookingCount / Object.keys(bookingMap).length;

  // ---- Scoring ----
  let score = 100;

  // Cancellation penalty (35)
  if (cancellationRate > 0.4) score -= 35;
  else if (cancellationRate > 0.2) score -= 25;
  else if (cancellationRate > 0.1) score -= 15;

  // Overbooking penalty (30)
  if (overbookingRate > 0.2) score -= 30;
  else if (overbookingRate > 0.1) score -= 20;
  else if (overbookingRate > 0) score -= 10;

  // Recent activity (15)
  if (recentActivityRatio < 0.1) score -= 15;
  else if (recentActivityRatio > 0.7) score -= 5;

  // Lead time (10)
  if (avgLeadTime < 2) score -= 10;
  else if (avgLeadTime > 10) score += 5;

  // ---- Volume Dampening ----
  const volumeFactor = Math.min(totalBookings / MIN_BOOKINGS, 1);
  score = Math.round(score * volumeFactor);

  score = Math.max(0, Math.min(score, 100));

  // ---- Risk Label ----
  let riskLabel = "LOW";
  if (score < 50) riskLabel = "HIGH";
  else if (score < 80) riskLabel = "MEDIUM";

  return {
    confidenceScore: score,
    riskLabel,
    breakdown: {
      totalBookings,
      cancellationRate,
      overbookingRate,
      recentActivityRatio,
      avgLeadTime: Number(avgLeadTime.toFixed(2)),
      volumeFactor
    }
  };
}

module.exports = {
  evaluateHotelConfidence
};
