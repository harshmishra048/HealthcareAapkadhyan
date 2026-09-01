const mongoose = require("mongoose");

const labTestPackageSchema = new mongoose.Schema(
  {
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

    packageName: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      enum: ["Basic", "Premium", "Routine", "Advanced", "Custom"],
      default: "Routine",
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    testsIncluded: [
      {
        type: String,
        trim: true,
      },
    ],

    price: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    turnaroundTime: {
      type: String,
      default: "24-48 hours",
    },

    sampleType: {
      type: String,
      default: "Blood / Urine / Sample",
    },

    isPopular: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

labTestPackageSchema.index({ labOwner: 1, isActive: 1 });
labTestPackageSchema.index({ labProfile: 1, isActive: 1 });

module.exports = mongoose.model("LabTestPackage", labTestPackageSchema);
