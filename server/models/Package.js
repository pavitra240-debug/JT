import mongoose from 'mongoose';

const PricingRowSchema = new mongoose.Schema(
  {
    vehicle_type: { type: String },
    price_range: { type: String },
  },
  { _id: false },
);

const PackageSchema = new mongoose.Schema(
  {
    package_name: { type: String, required: true },
    tour_type: { type: String },
    route: { type: String },
    duration: { type: String },
    image_url: { type: String },
    rating: { type: Number },
    display_order: { type: Number, default: 0 },
    pricing_rows: { type: [PricingRowSchema], default: [] },
  },
  { timestamps: true },
);

PackageSchema.index({ display_order: 1, createdAt: -1 });

export const Package = mongoose.models.Package || mongoose.model('Package', PackageSchema);

