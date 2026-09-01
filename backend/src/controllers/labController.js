const crypto = require("crypto");
const LabProfile = require("../models/LabProfile");
const LabTestPackage = require("../models/LabTestPackage");
const LabAppointment = require("../models/LabAppointment");
const User = require("../models/User");

const getUserId = (req) => req.user?._id || req.user?.id;

const parseBoolean = (value, fallback = false) => {
  if (value === undefined || value === null) return fallback;
  if (typeof value === "boolean") return value;
  return ["true", "1", "yes", "on"].includes(String(value).trim().toLowerCase());
};

const normalizeDate = (value) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value))) return null;
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) ? null : date;
};

const buildLocation = (latitude, longitude) => {
  const lat = Number(latitude);
  const lng = Number(longitude);
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return { latitude: null, longitude: null, location: { type: "Point", coordinates: [0, 0] } };
  }
  return { latitude: lat, longitude: lng, location: { type: "Point", coordinates: [lng, lat] } };
};

const isProfileComplete = (data) => Boolean(
  data.labName && data.phone && data.address && data.city && data.state && data.pincode,
);

const ensureLabOwner = async (req, res) => {
  const ownerId = getUserId(req);
  if (!ownerId || req.user?.role !== "labOwner") {
    res.status(403).json({ success: false, message: "Lab owner access required" });
    return null;
  }
  const owner = await User.findById(ownerId).select("fullName email phone role isApproved isBlocked");
  if (!owner || owner.isBlocked) {
    res.status(403).json({ success: false, message: "Lab owner account is unavailable" });
    return null;
  }
  if (!owner.isApproved) {
    res.status(403).json({ success: false, message: "Lab owner account is waiting for admin approval" });
    return null;
  }
  return owner;
};

const ensurePublicLab = async (labId) => {
  return LabProfile.findOne({
    _id: labId,
    isActive: true,
    isProfileComplete: true,
    isVerifiedByAdmin: true,
  }).populate({ path: "owner", select: "fullName email phone isApproved isBlocked role" });
};

const generateAppointmentCode = () => `LAB-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;

const validTransitions = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["in_progress", "cancelled"],
  in_progress: ["completed", "cancelled"],
  completed: [],
  cancelled: [],
};

exports.createLabProfile = async (req, res) => {
  try {
    const owner = await ensureLabOwner(req, res);
    if (!owner) return;

    const existing = await LabProfile.findOne({ owner: owner._id });
    if (existing) return res.status(409).json({ success: false, message: "Lab profile already exists" });

    const {
      labName, labType, ownerName, registrationNumber, phone, email, address,
      city, state, pincode, latitude, longitude, openingTime, closingTime,
      homeSampleCollection,
    } = req.body;

    if (!labName?.trim() || !phone?.trim() || !address?.trim() || !city?.trim() || !state?.trim() || !pincode?.trim()) {
      return res.status(400).json({ success: false, message: "Lab name, phone, address, city, state and pincode are required" });
    }

    const profile = await LabProfile.create({
      owner: owner._id,
      labName: labName.trim(),
      labType: labType || "Diagnostic Lab",
      ownerName: ownerName?.trim() || owner.fullName,
      registrationNumber: registrationNumber?.trim() || "",
      phone: phone.trim(),
      email: email?.trim()?.toLowerCase() || owner.email || "",
      address: address.trim(), city: city.trim(), state: state.trim(), pincode: pincode.trim(),
      ...buildLocation(latitude, longitude),
      openingTime: openingTime || "09:00",
      closingTime: closingTime || "18:00",
      homeSampleCollection: parseBoolean(homeSampleCollection, true),
      isProfileComplete: true,
      isVerifiedByAdmin: false,
      isActive: true,
    });

    return res.status(201).json({ success: true, message: "Lab profile created successfully. It is now awaiting admin verification.", labProfile: profile });
  } catch (error) {
    console.error("Create lab profile error:", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to create lab profile" });
  }
};

exports.getMyLabProfile = async (req, res) => {
  try {
    const owner = await ensureLabOwner(req, res);
    if (!owner) return;
    const labProfile = await LabProfile.findOne({ owner: owner._id }).populate("owner", "fullName email phone role isApproved");
    if (!labProfile) return res.status(404).json({ success: false, message: "Lab profile not found" });
    return res.json({ success: true, labProfile });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Failed to fetch lab profile" });
  }
};

exports.updateLabProfile = async (req, res) => {
  try {
    const owner = await ensureLabOwner(req, res);
    if (!owner) return;
    const labProfile = await LabProfile.findOne({ owner: owner._id });
    if (!labProfile) return res.status(404).json({ success: false, message: "Lab profile not found" });

    const fields = ["labName", "labType", "ownerName", "registrationNumber", "phone", "email", "address", "city", "state", "pincode", "openingTime", "closingTime"];
    for (const field of fields) if (req.body[field] !== undefined) labProfile[field] = String(req.body[field]).trim();
    if (req.body.homeSampleCollection !== undefined) labProfile.homeSampleCollection = parseBoolean(req.body.homeSampleCollection);

    if (req.body.latitude !== undefined || req.body.longitude !== undefined) {
      const loc = buildLocation(req.body.latitude, req.body.longitude);
      labProfile.latitude = loc.latitude;
      labProfile.longitude = loc.longitude;
      labProfile.location = loc.location;
    }

    const wasVerified = labProfile.isVerifiedByAdmin;
    labProfile.isProfileComplete = isProfileComplete(labProfile);
    if (wasVerified) {
      // Any material profile change returns the listing to moderation.
      labProfile.isVerifiedByAdmin = false;
      labProfile.verifiedAt = null;
      labProfile.verifiedBy = null;
      labProfile.verificationNote = "Profile updated; re-verification required.";
    }

    await labProfile.save();
    return res.json({ success: true, message: wasVerified ? "Profile updated and sent for re-verification." : "Lab profile updated successfully", labProfile });
  } catch (error) {
    console.error("Update lab profile error:", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to update lab profile" });
  }
};

exports.getAllLabProfiles = async (req, res) => {
  try {
    const { city, labType, search } = req.query;
    const query = { isActive: true, isProfileComplete: true, isVerifiedByAdmin: true };
    if (city) query.city = { $regex: String(city).trim(), $options: "i" };
    if (labType && labType !== "all") query.labType = labType;
    if (search) query.labName = { $regex: String(search).trim(), $options: "i" };

    const labs = await LabProfile.find(query)
      .populate({ path: "owner", select: "fullName isApproved isBlocked role" })
      .sort({ createdAt: -1 });

    const visibleLabs = labs.filter((lab) => lab.owner?.isApproved && !lab.owner?.isBlocked);
    return res.json({ success: true, count: visibleLabs.length, labs: visibleLabs });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Failed to fetch labs" });
  }
};

exports.getSingleLabProfile = async (req, res) => {
  try {
    const lab = await ensurePublicLab(req.params.id);
    if (!lab || !lab.owner?.isApproved || lab.owner?.isBlocked) return res.status(404).json({ success: false, message: "Lab not found" });
    return res.json({ success: true, lab });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Failed to fetch lab" });
  }
};

exports.getPublicLabPackages = async (req, res) => {
  try {
    const labIds = await LabProfile.find({ isActive: true, isProfileComplete: true, isVerifiedByAdmin: true })
      .populate({ path: "owner", select: "isApproved isBlocked role" })
      .then((labs) => labs.filter((l) => l.owner?.isApproved && !l.owner?.isBlocked).map((l) => l._id));

    const query = { labProfile: { $in: labIds }, isActive: true };
    if (req.query.category && req.query.category !== "all") query.category = req.query.category;
    if (req.query.search) query.packageName = { $regex: String(req.query.search).trim(), $options: "i" };

    const packages = await LabTestPackage.find(query)
      .populate("labProfile", "labName labType city state pincode homeSampleCollection openingTime closingTime")
      .sort({ isPopular: -1, createdAt: -1 });

    return res.json({ success: true, count: packages.length, packages });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Failed to fetch diagnostic packages" });
  }
};

exports.createLabPackage = async (req, res) => {
  try {
    const owner = await ensureLabOwner(req, res);
    if (!owner) return;
    const labProfile = await LabProfile.findOne({ owner: owner._id });
    if (!labProfile) return res.status(404).json({ success: false, message: "Create a lab profile first" });

    const { packageName, category, description, testsIncluded, price, turnaroundTime, sampleType, isPopular } = req.body;
    const numericPrice = Number(price);
    if (!packageName?.trim() || !Number.isFinite(numericPrice) || numericPrice < 0) {
      return res.status(400).json({ success: false, message: "Valid package name and price are required" });
    }

    const item = await LabTestPackage.create({
      labOwner: owner._id,
      labProfile: labProfile._id,
      packageName: packageName.trim(),
      category: category || "Routine",
      description: description?.trim() || "",
      testsIncluded: Array.isArray(testsIncluded) ? testsIncluded.map(String).map((x) => x.trim()).filter(Boolean) : [],
      price: numericPrice,
      turnaroundTime: turnaroundTime?.trim() || "24-48 hours",
      sampleType: sampleType?.trim() || "Blood / Urine / Sample",
      isPopular: parseBoolean(isPopular, false),
      isActive: true,
    });

    return res.status(201).json({ success: true, message: "Test package created successfully", package: item });
  } catch (error) {
    console.error("Create lab package error:", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to create package" });
  }
};

exports.getMyLabPackages = async (req, res) => {
  try {
    const owner = await ensureLabOwner(req, res);
    if (!owner) return;
    const packages = await LabTestPackage.find({ labOwner: owner._id }).sort({ isActive: -1, createdAt: -1 });
    return res.json({ success: true, packages });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Failed to fetch packages" });
  }
};

exports.updateLabPackage = async (req, res) => {
  try {
    const owner = await ensureLabOwner(req, res);
    if (!owner) return;
    const packageItem = await LabTestPackage.findOne({ _id: req.params.id, labOwner: owner._id });
    if (!packageItem) return res.status(404).json({ success: false, message: "Package not found" });

    const allowed = ["packageName", "category", "description", "turnaroundTime", "sampleType"];
    for (const field of allowed) if (req.body[field] !== undefined) packageItem[field] = String(req.body[field]).trim();
    if (req.body.testsIncluded !== undefined) packageItem.testsIncluded = Array.isArray(req.body.testsIncluded) ? req.body.testsIncluded.map(String).map((x) => x.trim()).filter(Boolean) : [];
    if (req.body.price !== undefined) {
      const price = Number(req.body.price);
      if (!Number.isFinite(price) || price < 0) return res.status(400).json({ success: false, message: "Price must be a non-negative number" });
      packageItem.price = price;
    }
    if (req.body.isPopular !== undefined) packageItem.isPopular = parseBoolean(req.body.isPopular);
    if (req.body.isActive !== undefined) packageItem.isActive = parseBoolean(req.body.isActive);

    await packageItem.save();
    return res.json({ success: true, message: "Package updated successfully", package: packageItem });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Failed to update package" });
  }
};

exports.getLabPackagesByProfile = async (req, res) => {
  try {
    const lab = await ensurePublicLab(req.params.labId);
    if (!lab || !lab.owner?.isApproved || lab.owner?.isBlocked) return res.status(404).json({ success: false, message: "Lab not found" });
    const packages = await LabTestPackage.find({ labProfile: lab._id, isActive: true }).sort({ isPopular: -1, createdAt: -1 });
    return res.json({ success: true, packages });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Failed to fetch lab packages" });
  }
};

exports.createLabAppointment = async (req, res) => {
  try {
    const patientId = getUserId(req);
    if (!patientId || req.user?.role !== "patient") return res.status(403).json({ success: false, message: "Patient access required" });

    const { labId, packageId, appointmentDate, preferredTime, sampleType, notes } = req.body;
    if (!labId || !packageId || !appointmentDate) return res.status(400).json({ success: false, message: "Lab, package and appointment date are required" });

    const date = normalizeDate(appointmentDate);
    if (!date || date.getTime() < new Date(new Date().toISOString().slice(0, 10)).getTime()) return res.status(400).json({ success: false, message: "Appointment date must be today or a future date" });

    const labProfile = await ensurePublicLab(labId);
    if (!labProfile || !labProfile.owner?.isApproved || labProfile.owner?.isBlocked) return res.status(404).json({ success: false, message: "Lab is not available for booking" });

    const packageItem = await LabTestPackage.findOne({ _id: packageId, labProfile: labProfile._id, labOwner: labProfile.owner._id, isActive: true });
    if (!packageItem) return res.status(404).json({ success: false, message: "Selected package is not available at this lab" });

    const slot = preferredTime?.trim() || "09:00 AM";
    const existing = await LabAppointment.findOne({ labProfile: labProfile._id, appointmentDate: date, preferredTime: slot, status: { $nin: ["cancelled"] }, isActive: true });
    if (existing) return res.status(409).json({ success: false, message: "That appointment slot is already booked. Please choose another time." });

    const appointment = await LabAppointment.create({
      appointmentCode: generateAppointmentCode(),
      patient: patientId,
      labOwner: labProfile.owner._id,
      labProfile: labProfile._id,
      package: packageItem._id,
      packageName: packageItem.packageName,
      appointmentDate: date,
      preferredTime: slot,
      sampleType: sampleType || "Home Collection",
      notes: notes?.trim() || "",
      totalAmount: Number(packageItem.price || 0),
      statusHistory: [{ status: "pending", changedBy: patientId, note: "Appointment booked" }],
    });

    return res.status(201).json({ success: true, message: "Lab appointment booked successfully", appointment });
  } catch (error) {
    console.error("Create lab appointment error:", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to book appointment" });
  }
};

exports.getMyLabAppointments = async (req, res) => {
  try {
    const userId = getUserId(req);
    const appointments = await LabAppointment.find({ patient: userId, isActive: true })
      .sort({ appointmentDate: -1, createdAt: -1 })
      .populate("labProfile", "labName labType phone address city state pincode openingTime closingTime homeSampleCollection")
      .populate("package", "packageName category price testsIncluded turnaroundTime sampleType");
    return res.json({ success: true, appointments });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Failed to fetch appointments" });
  }
};

exports.cancelMyLabAppointment = async (req, res) => {
  try {
    const patientId = getUserId(req);
    const appointment = await LabAppointment.findOne({ _id: req.params.id, patient: patientId, isActive: true });
    if (!appointment) return res.status(404).json({ success: false, message: "Appointment not found" });
    if (!["pending", "confirmed"].includes(appointment.status)) return res.status(400).json({ success: false, message: "This appointment can no longer be cancelled" });

    appointment.status = "cancelled";
    appointment.cancelledBy = patientId;
    appointment.cancelReason = req.body.reason?.trim() || "Cancelled by patient";
    appointment.statusHistory.push({ status: "cancelled", changedBy: patientId, note: appointment.cancelReason });
    await appointment.save();
    return res.json({ success: true, message: "Appointment cancelled successfully", appointment });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Failed to cancel appointment" });
  }
};

exports.getLabAppointmentsForOwner = async (req, res) => {
  try {
    const owner = await ensureLabOwner(req, res);
    if (!owner) return;
    const { status, date, search } = req.query;
    const query = { labOwner: owner._id, isActive: true };
    if (status && status !== "all") query.status = status;
    if (date) {
      const start = normalizeDate(date);
      if (start) { const end = new Date(start); end.setUTCDate(end.getUTCDate() + 1); query.appointmentDate = { $gte: start, $lt: end }; }
    }

    let appointments = await LabAppointment.find(query)
      .sort({ appointmentDate: 1, preferredTime: 1, createdAt: -1 })
      .populate("patient", "fullName email phone")
      .populate("package", "packageName category price testsIncluded turnaroundTime sampleType");

    if (search?.trim()) {
      const term = search.trim().toLowerCase();
      appointments = appointments.filter((a) => [a.patient?.fullName, a.patient?.email, a.patient?.phone, a.packageName, a.appointmentCode].some((v) => String(v || "").toLowerCase().includes(term)));
    }
    return res.json({ success: true, appointments });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Failed to fetch lab appointments" });
  }
};

exports.updateLabAppointmentStatus = async (req, res) => {
  try {
    const owner = await ensureLabOwner(req, res);
    if (!owner) return;
    const appointment = await LabAppointment.findOne({ _id: req.params.id, labOwner: owner._id, isActive: true });
    if (!appointment) return res.status(404).json({ success: false, message: "Appointment not found" });

    const { status, note } = req.body;
    if (!validTransitions[appointment.status]?.includes(status)) return res.status(400).json({ success: false, message: `Cannot change appointment from ${appointment.status} to ${status}` });

    appointment.status = status;
    appointment.statusHistory.push({ status, changedBy: owner._id, note: note?.trim() || "" });
    if (status === "confirmed") appointment.confirmedAt = new Date();
    if (status === "completed") appointment.completedAt = new Date();
    if (status === "cancelled") { appointment.cancelledBy = owner._id; appointment.cancelReason = note?.trim() || "Cancelled by lab"; }
    await appointment.save();
    return res.json({ success: true, message: "Appointment status updated", appointment });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Failed to update appointment status" });
  }
};

exports.getLabDashboardStats = async (req, res) => {
  try {
    const owner = await ensureLabOwner(req, res);
    if (!owner) return;
    const labProfile = await LabProfile.findOne({ owner: owner._id });
    if (!labProfile) return res.status(404).json({ success: false, message: "Lab profile not found" });

    const now = new Date();
    const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
    const [totalPackages, activePackages, appointments, monthlyAppointments] = await Promise.all([
      LabTestPackage.countDocuments({ labOwner: owner._id }),
      LabTestPackage.countDocuments({ labOwner: owner._id, isActive: true }),
      LabAppointment.find({ labOwner: owner._id, isActive: true }),
      LabAppointment.find({ labOwner: owner._id, isActive: true, appointmentDate: { $gte: monthStart } }),
    ]);

    const count = (status) => appointments.filter((a) => a.status === status).length;
    const monthlyRevenue = monthlyAppointments.filter((a) => ["confirmed", "in_progress", "completed"].includes(a.status)).reduce((sum, a) => sum + Number(a.totalAmount || 0), 0);

    return res.json({
      success: true,
      labProfile,
      stats: {
        totalPackages,
        activePackages,
        totalAppointments: appointments.length,
        pending: count("pending"),
        confirmed: count("confirmed"),
        inProgress: count("in_progress"),
        completed: count("completed"),
        cancelled: count("cancelled"),
        monthlyAppointments: monthlyAppointments.length,
        monthlyRevenue: Number(monthlyRevenue.toFixed(2)),
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Failed to load lab dashboard stats" });
  }
};
