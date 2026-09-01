const mongoose = require("mongoose");

const labTestPackageSchema = new mongoose.Schema(
  {
    labOwner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    labProfile: { type: mongoose.Schema.Types.ObjectId, ref: "LabProfile", required: true, index: true },
    packageName: { type: String, required: true, trim: true, minlength: 2, maxlength: 150 },
    category: {
      type: String,
      enum: ["Basic", "Premium", "Routine", "Advanced", "Custom"],
      default: "Routine",
    },
    description: { type: String, default: "", trim: true, maxlength: 1000 },
    testsIncluded: [{ type: String, trim: true, maxlength: 120 }],
    price: { type: Number, required: true, min: 0 },
    turnaroundTime: { type: String, default: "24-48 hours", trim: true, maxlength: 80 },
    sampleType: { type: String, default: "Blood / Urine / Sample", trim: true, maxlength: 120 },
    isPopular: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

labTestPackageSchema.index({ labOwner: 1, isActive: 1, createdAt: -1 });
labTestPackageSchema.index({ labProfile: 1, isActive: 1, isPopular: -1 });

module.exports = mongoose.model("LabTestPackage", labTestPackageSchema);
