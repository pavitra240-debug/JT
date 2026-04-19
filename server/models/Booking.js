import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema(
  {
    customer_name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    service_type: { type: String, required: true },
    vehicle_or_package: { type: String },
    pickup_location: { type: String },
    drop_location: { type: String },
    travel_date: { type: String },
    travel_time: { type: String },
    passengers: { type: Number },
    notes: { type: String },
    status: { type: String, default: 'Pending' },
    created_date: { type: String, default: () => new Date().toISOString() },
  },
  { timestamps: true },
);

BookingSchema.index({ createdAt: -1 });

export const Booking = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);

