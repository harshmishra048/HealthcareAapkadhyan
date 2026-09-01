const LabProfile = require("../models/LabProfile");
const LabTestPackage = require("../models/LabTestPackage");
const LabAppointment = require("../models/LabAppointment");
const User = require("../models/User");

const getOwnerId = (req) => req.user?._id || req.user?.id;

const buildLocation = (latitude, longitude) => {
  const lat = Number(latitude);
  const lng = Number(longitude);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return {
      latitude: null,
      longitude: null,
      location: {
        type: "Point",
        coordinates: [0, 0],
      },
    };
  }

  return {
    latitude: lat,
    longitude: lng,
    location: {
      type: "Point",
      coordinates: [lng, lat],
    },
  };
};

const checkProfileComplete = (data) =>
  Boolean(
    data.labName &&
    data.phone &&
    data.address &&
    data.city &&
    data.state &&
    data.pincode,
  );

exports.createLabProfile = async (req, res) => {
  try {
    const ownerId = getOwnerId(req);

    if (!ownerId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized. Please login again." });
    }

    const existing = await LabProfile.findOne({ owner: ownerId });
    if (existing) {
      return res
        .status(400)
        .json({ success: false, message: "Lab profile already exists" });
    }

    const {
      labName,
      labType,
      ownerName,
      registrationNumber,
      phone,
      email,
      address,
      city,
      state,
      pincode,
      latitude,
      longitude,
      openingTime,
      closingTime,
      homeSampleCollection,
    } = req.body;

    if (!labName || !phone || !address || !city || !state || !pincode) {
      return res.status(400).json({
        success: false,
        message:
          "Lab name, phone, address, city, state and pincode are required",
      });
    }

    const profileData = {
      owner: ownerId,
      labName: labName.trim(),
      labType: labType || "Diagnostic Lab",
      ownerName: ownerName?.trim() || req.user?.fullName || "",
      registrationNumber: registrationNumber?.trim() || "",
      phone: phone.trim(),
      email: email?.trim()?.toLowerCase() || req.user?.email || "",
      address: address.trim(),
      city: city.trim(),
      state: state.trim(),
      pincode: pincode.trim(),
      ...buildLocation(latitude, longitude),
      openingTime: openingTime || "09:00",
      closingTime: closingTime || "18:00",
      homeSampleCollection:
        homeSampleCollection !== undefined
          ? Boolean(homeSampleCollection)
          : true,
    };

    profileData.isProfileComplete = checkProfileComplete(profileData);

    const labProfile = await LabProfile.create(profileData);

    return res.status(201).json({
      success: true,
      message: "Lab profile created successfully",
      labProfile,
    });
  } catch (error) {
    console.error("Create lab profile error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create lab profile",
    });
  }
};

exports.getMyLabProfile = async (req, res) => {
  try {
    const ownerId = getOwnerId(req);
    const labProfile = await LabProfile.findOne({ owner: ownerId }).populate(
      "owner",
      "fullName email phone role",
    );

    if (!labProfile) {
      return res
        .status(404)
        .json({ success: false, message: "Lab profile not found" });
    }

    return res.status(200).json({ success: true, labProfile });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch lab profile",
    });
  }
};

exports.updateLabProfile = async (req, res) => {
  try {
    const ownerId = getOwnerId(req);
    const labProfile = await LabProfile.findOne({ owner: ownerId });

    if (!labProfile) {
      return res
        .status(404)
        .json({ success: false, message: "Lab profile not found" });
    }

    const fields = [
      "labName",
      "labType",
      "ownerName",
      "registrationNumber",
      "phone",
      "email",
      "address",
      "city",
      "state",
      "pincode",
      "openingTime",
      "closingTime",
      "homeSampleCollection",
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        labProfile[field] =
          field === "homeSampleCollection"
            ? Boolean(req.body[field])
            : req.body[field];
      }
    });

    if (req.body.latitude !== undefined || req.body.longitude !== undefined) {
      const { latitude, longitude } = req.body;
      const loc = buildLocation(latitude, longitude);
      labProfile.latitude = loc.latitude;
      labProfile.longitude = loc.longitude;
      labProfile.location = loc.location;
    }

    labProfile.isProfileComplete = checkProfileComplete(labProfile);
    await labProfile.save();

    return res.status(200).json({
      success: true,
      message: "Lab profile updated successfully",
      labProfile,
    });
  } catch (error) {
    console.error("Update lab profile error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update lab profile",
    });
  }
};

exports.getAllLabProfiles = async (req, res) => {
  try {
    const labs = await LabProfile.find({
      isActive: true,
      isProfileComplete: true,
    }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, labs });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch labs",
    });
  }
};

exports.getSingleLabProfile = async (req, res) => {
  try {
    const lab = await LabProfile.findById(req.params.id);
    if (!lab)
      return res.status(404).json({ success: false, message: "Lab not found" });
    return res.status(200).json({ success: true, lab });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch lab",
    });
  }
};

exports.createLabPackage = async (req, res) => {
  try {
    const ownerId = getOwnerId(req);
    const labProfile = await LabProfile.findOne({ owner: ownerId });

    if (!labProfile) {
      return res
        .status(404)
        .json({ success: false, message: "Create a lab profile first" });
    }

    const {
      packageName,
      category,
      description,
      testsIncluded,
      price,
      turnaroundTime,
      sampleType,
      isPopular,
    } = req.body;

    if (!packageName || !price) {
      return res.status(400).json({
        success: false,
        message: "Package name and price are required",
      });
    }

    const item = await LabTestPackage.create({
      labOwner: ownerId,
      labProfile: labProfile._id,
      packageName: packageName.trim(),
      category: category || "Routine",
      description: description || "",
      testsIncluded: Array.isArray(testsIncluded)
        ? testsIncluded.filter(Boolean).map((test) => String(test).trim())
        : [],
      price: Number(price),
      turnaroundTime: turnaroundTime || "24-48 hours",
      sampleType: sampleType || "Blood / Urine / Sample",
      isPopular: Boolean(isPopular),
    });

    return res.status(201).json({
      success: true,
      message: "Test package created successfully",
      item,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create package",
    });
  }
};

exports.getMyLabPackages = async (req, res) => {
  try {
    const ownerId = getOwnerId(req);
    const packages = await LabTestPackage.find({
      labOwner: ownerId,
      isActive: true,
    }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, packages });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch packages",
    });
  }
};

exports.updateLabPackage = async (req, res) => {
  try {
    const ownerId = getOwnerId(req);
    const packageItem = await LabTestPackage.findOne({
      _id: req.params.id,
      labOwner: ownerId,
    });

    if (!packageItem) {
      return res
        .status(404)
        .json({ success: false, message: "Package not found" });
    }

    const fields = [
      "packageName",
      "category",
      "description",
      "testsIncluded",
      "price",
      "turnaroundTime",
      "sampleType",
      "isPopular",
      "isActive",
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        packageItem[field] =
          field === "testsIncluded"
            ? Array.isArray(req.body[field])
              ? req.body[field].filter(Boolean)
              : []
            : req.body[field];
      }
    });

    await packageItem.save();
    return res.status(200).json({
      success: true,
      message: "Package updated successfully",
      packageItem,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update package",
    });
  }
};

exports.getLabPackagesByProfile = async (req, res) => {
  try {
    const packages = await LabTestPackage.find({
      labProfile: req.params.labId,
      isActive: true,
    }).sort({ isPopular: -1, createdAt: -1 });
    return res.status(200).json({ success: true, packages });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch lab packages",
    });
  }
};

exports.createLabAppointment = async (req, res) => {
  try {
    const patientId = getOwnerId(req);
    const {
      labId,
      packageId,
      appointmentDate,
      preferredTime,
      sampleType,
      notes,
    } = req.body;

    if (!labId || !packageId || !appointmentDate) {
      return res.status(400).json({
        success: false,
        message: "Lab, package and appointment date are required",
      });
    }

    const labProfile = await LabProfile.findById(labId);
    if (!labProfile)
      return res.status(404).json({ success: false, message: "Lab not found" });

    const packageItem = await LabTestPackage.findById(packageId);
    if (!packageItem || !packageItem.isActive)
      return res
        .status(404)
        .json({ success: false, message: "Package not found" });

    const appointment = await LabAppointment.create({
      patient: patientId,
      labOwner: labProfile.owner,
      labProfile: labProfile._id,
      package: packageItem._id,
      packageName: packageItem.packageName,
      appointmentDate: new Date(appointmentDate),
      preferredTime: preferredTime || "09:00 AM",
      sampleType: sampleType || "Home Collection",
      notes: notes || "",
      totalAmount: Number(packageItem.price || 0),
    });

    return res.status(201).json({
      success: true,
      message: "Lab appointment booked successfully",
      appointment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to book appointment",
    });
  }
};

exports.getMyLabAppointments = async (req, res) => {
  try {
    const userId = getOwnerId(req);
    const appointments = await LabAppointment.find({
      patient: userId,
      isActive: true,
    })
      .sort({ createdAt: -1 })
      .populate("labProfile", "labName city state phone");
    return res.status(200).json({ success: true, appointments });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch appointments",
    });
  }
};

exports.getLabAppointmentsForOwner = async (req, res) => {
  try {
    const ownerId = getOwnerId(req);
    const appointments = await LabAppointment.find({
      labOwner: ownerId,
      isActive: true,
    })
      .sort({ createdAt: -1 })
      .populate("patient", "fullName email phone")
      .populate("package");
    return res.status(200).json({ success: true, appointments });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch lab appointments",
    });
  }
};

exports.updateLabAppointmentStatus = async (req, res) => {
  try {
    const ownerId = getOwnerId(req);
    const appointment = await LabAppointment.findOne({
      _id: req.params.id,
      labOwner: ownerId,
    });

    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    }

    const { status } = req.body;
    if (!status) {
      return res
        .status(400)
        .json({ success: false, message: "Status is required" });
    }

    appointment.status = status;
    await appointment.save();

    return res.status(200).json({
      success: true,
      message: "Appointment status updated",
      appointment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update appointment status",
    });
  }
};

exports.getLabDashboardStats = async (req, res) => {
  try {
    const ownerId = getOwnerId(req);
    const labProfile = await LabProfile.findOne({ owner: ownerId });

    if (!labProfile) {
      return res
        .status(404)
        .json({ success: false, message: "Lab profile not found" });
    }

    const packages = await LabTestPackage.countDocuments({
      labOwner: ownerId,
      isActive: true,
    });
    const appointments = await LabAppointment.find({
      labOwner: ownerId,
      isActive: true,
    });

    const pending = appointments.filter(
      (item) => item.status === "pending",
    ).length;
    const confirmed = appointments.filter(
      (item) => item.status === "confirmed",
    ).length;
    const completed = appointments.filter(
      (item) => item.status === "completed",
    ).length;
    const revenue = appointments.reduce(
      (sum, item) => sum + Number(item.totalAmount || 0),
      0,
    );

    return res.status(200).json({
      success: true,
      labProfile,
      stats: {
        totalPackages: packages,
        totalAppointments: appointments.length,
        pending,
        confirmed,
        completed,
        monthlyRevenue: Number(revenue.toFixed(2)),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to load lab dashboard stats",
    });
  }
};
