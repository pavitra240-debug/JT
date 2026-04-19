import mongoose from 'mongoose';

const BusSchema = new mongoose.Schema(
  {
    vehicle_name: { type: String, required: true },
    category: { type: String, required: true },
    seating_capacity: { type: String },
    rating: { type: Number },
    local_price: { type: Number },
    local_ac_price: { type: Number },
    outstation_nonac_per_km: { type: Number },
    outstation_ac_per_km: { type: Number },
    image_url: { type: String },
    display_order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

BusSchema.index({ display_order: 1, createdAt: -1 });

export const Bus = mongoose.models.Bus || mongoose.model('Bus', BusSchema);

