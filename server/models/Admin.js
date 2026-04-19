import mongoose from 'mongoose';

const AdminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    sessionActive: { type: Boolean, default: false },
    sessionJti: { type: String, default: null },
  },
  { timestamps: true },
);

export const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

