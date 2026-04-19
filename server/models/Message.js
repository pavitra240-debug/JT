import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema(
  {
    full_name: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    subject: { type: String },
    message: { type: String, required: true },
    created_date: { type: String, default: () => new Date().toISOString() },
  },
  { timestamps: true },
);

MessageSchema.index({ createdAt: -1 });

export const Message = mongoose.models.Message || mongoose.model('Message', MessageSchema);

