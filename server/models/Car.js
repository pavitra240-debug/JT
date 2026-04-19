import mongoose from 'mongoose';

const CarSchema = new mongoose.Schema(
  {
    vehicle_name: { type: String, required: true },
    category: { type: String, required: true },
    rating: { type: Number },
    local_drop_price: { type: Number },
    local_8h_nonac: { type: Number },
    local_8h_ac: { type: Number },
    outstation_nonac_per_km: { type: Number },
    outstation_ac_per_km: { type: Number },
    image_url: { type: String },
    display_order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

CarSchema.index({ display_order: 1, createdAt: -1 });

export const Car = mongoose.models.Car || mongoose.model('Car', CarSchema);

