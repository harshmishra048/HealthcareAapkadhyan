const mongoose = require("mongoose");

const labAppointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    labOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    labProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LabProfile",
      required: true,
    },

    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LabTestPackage",
      required: true,
    },

    packageName: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "in_progress", "completed", "cancelled"],
      default: "pending",
    },

    appointmentDate: {
      type: Date,
      required: true,
    },

    preferredTime: {
      type: String,
      default: "09:00 AM",
    },

    sampleType: {
      type: String,
      default: "Home Collection",
    },

    notes: {
      type: String,
      default: "",
      trim: true,
    },

    totalAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "partial"],
      default: "pending",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

labAppointmentSchema.index({ labOwner: 1, status: 1 });
labAppointmentSchema.index({ patient: 1, isActive: 1 });
labAppointmentSchema.index({ appointmentDate: 1 });

module.exports = mongoose.model("LabAppointment", labAppointmentSchema);
