const mongoose = require("mongoose");

const labAppointmentSchema = new mongoose.Schema(
  {
    appointmentCode: { type: String, unique: true, sparse: true, index: true },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    labOwner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    labProfile: { type: mongoose.Schema.Types.ObjectId, ref: "LabProfile", required: true, index: true },
    package: { type: mongoose.Schema.Types.ObjectId, ref: "LabTestPackage", required: true },
    packageName: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "in_progress", "completed", "cancelled"],
      default: "pending",
      index: true,
    },
    appointmentDate: { type: Date, required: true, index: true },
    preferredTime: { type: String, default: "09:00 AM", trim: true },
    sampleType: { type: String, default: "Home Collection", trim: true },
    notes: { type: String, default: "", trim: true, maxlength: 1000 },
    totalAmount: { type: Number, default: 0, min: 0 },
    paymentStatus: { type: String, enum: ["pending", "paid", "partial", "refunded"], default: "pending" },
    statusHistory: [
      {
        status: { type: String, enum: ["pending", "confirmed", "in_progress", "completed", "cancelled"] },
        changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        changedAt: { type: Date, default: Date.now },
        note: { type: String, default: "" },
      },
    ],
    cancelledBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    cancelReason: { type: String, default: "", maxlength: 500 },
    confirmedAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

labAppointmentSchema.index({ labOwner: 1, status: 1, appointmentDate: 1 });
labAppointmentSchema.index({ patient: 1, isActive: 1, appointmentDate: -1 });
labAppointmentSchema.index({ labProfile: 1, appointmentDate: 1, preferredTime: 1 });

module.exports = mongoose.model("LabAppointment", labAppointmentSchema);
