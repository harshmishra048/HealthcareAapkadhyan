const mongoose = require("mongoose");

const labProfileSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    labName: {
      type: String,
      required: [true, "Lab name is required"],
      trim: true,
      minlength: 2,
      maxlength: 150,
    },
    labType: {
      type: String,
      enum: ["Diagnostic Lab", "Pathology Lab", "Imaging Center", "Wellness Center", "Other"],
      default: "Diagnostic Lab",
    },
    ownerName: { type: String, trim: true, default: "", maxlength: 120 },
    registrationNumber: { type: String, trim: true, default: "", maxlength: 100 },
    phone: { type: String, trim: true, default: "", maxlength: 30 },
    email: { type: String, lowercase: true, trim: true, default: "", maxlength: 160 },
    address: { type: String, trim: true, default: "", maxlength: 300 },
    city: { type: String, trim: true, default: "", maxlength: 100 },
    state: { type: String, trim: true, default: "", maxlength: 100 },
    pincode: { type: String, trim: true, default: "", maxlength: 10 },
    latitude: { type: Number, default: null, min: -90, max: 90 },
    longitude: { type: Number, default: null, min: -180, max: 180 },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0] },
    },
    openingTime: { type: String, default: "09:00" },
    closingTime: { type: String, default: "18:00" },
    homeSampleCollection: { type: Boolean, default: true },
    isProfileComplete: { type: Boolean, default: false, index: true },
    isVerifiedByAdmin: { type: Boolean, default: false, index: true },
    verifiedAt: { type: Date, default: null },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    verificationNote: { type: String, default: "", maxlength: 500 },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

labProfileSchema.index({ location: "2dsphere" });
labProfileSchema.index({ city: 1, labType: 1, isActive: 1, isVerifiedByAdmin: 1 });

module.exports = mongoose.model("LabProfile", labProfileSchema);
