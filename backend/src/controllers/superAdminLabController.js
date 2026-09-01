const LabProfile = require("../models/LabProfile");
const LabTestPackage = require("../models/LabTestPackage");
const LabAppointment = require("../models/LabAppointment");

exports.getLabManagement = async (req, res) => {
  try {
    const { search, city, verification, active } = req.query;
    const query = {};
    if (city) query.city = { $regex: String(city).trim(), $options: "i" };
    if (verification === "verified") query.isVerifiedByAdmin = true;
    if (verification === "pending") query.isVerifiedByAdmin = false;
    if (active === "active") query.isActive = true;
    if (active === "blocked") query.isActive = false;
    if (search?.trim()) {
      const term = String(search).trim();
      query.$or = [
        { labName: { $regex: term, $options: "i" } },
        { city: { $regex: term, $options: "i" } },
        { registrationNumber: { $regex: term, $options: "i" } },
      ];
    }

    const labs = await LabProfile.find(query)
      .populate("owner", "fullName email phone role isApproved isEmailVerified isPhoneVerified isBlocked")
      .sort({ isVerifiedByAdmin: 1, createdAt: -1 });

    const validLabs = labs.filter((lab) => lab.owner?.role === "labOwner");
    const [total, verified, pending, activeLabs, blockedLabs, packages, appointments] = await Promise.all([
      LabProfile.countDocuments(),
      LabProfile.countDocuments({ isVerifiedByAdmin: true, isActive: true }),
      LabProfile.countDocuments({ isVerifiedByAdmin: false }),
      LabProfile.countDocuments({ isActive: true }),
      LabProfile.countDocuments({ isActive: false }),
      LabTestPackage.countDocuments(),
      LabAppointment.countDocuments(),
    ]);

    return res.json({ success: true, labs: validLabs, stats: { total, verified, pending, activeLabs, blockedLabs, packages, appointments } });
  } catch (error) {
    console.error("Super admin lab management error:", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to load lab management" });
  }
};

exports.verifyLab = async (req, res) => {
  try {
    const lab = await LabProfile.findById(req.params.labId);
    if (!lab) return res.status(404).json({ success: false, message: "Lab not found" });
    if (!lab.isProfileComplete) return res.status(400).json({ success: false, message: "Lab profile is incomplete" });

    lab.isVerifiedByAdmin = true;
    lab.isActive = true;
    lab.verifiedAt = new Date();
    lab.verifiedBy = req.user._id;
    lab.verificationNote = req.body.note?.trim() || "Verified by super admin";
    await lab.save();
    return res.json({ success: true, message: "Lab verified successfully", lab });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Failed to verify lab" });
  }
};

exports.unverifyLab = async (req, res) => {
  try {
    const lab = await LabProfile.findById(req.params.labId);
    if (!lab) return res.status(404).json({ success: false, message: "Lab not found" });
    lab.isVerifiedByAdmin = false;
    lab.verifiedAt = null;
    lab.verifiedBy = null;
    lab.verificationNote = req.body.note?.trim() || "Verification removed by super admin";
    await lab.save();
    return res.json({ success: true, message: "Lab verification removed", lab });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Failed to update lab verification" });
  }
};

exports.toggleLabActive = async (req, res) => {
  try {
    const lab = await LabProfile.findById(req.params.labId);
    if (!lab) return res.status(404).json({ success: false, message: "Lab not found" });
    const active = req.body.isActive === undefined ? !lab.isActive : (typeof req.body.isActive === "boolean" ? req.body.isActive : ["true", "1", "yes", "on"].includes(String(req.body.isActive).trim().toLowerCase()));
    lab.isActive = active;
    await lab.save();
    return res.json({ success: true, message: active ? "Lab activated" : "Lab blocked", lab });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Failed to update lab status" });
  }
};

exports.getLabPackagesAdmin = async (req, res) => {
  try {
    const { search, active, labId } = req.query;
    const query = {};
    if (active === "active") query.isActive = true;
    if (active === "inactive") query.isActive = false;
    if (labId) query.labProfile = labId;
    if (search?.trim()) query.packageName = { $regex: String(search).trim(), $options: "i" };

    const packages = await LabTestPackage.find(query)
      .populate("labProfile", "labName city state isVerifiedByAdmin isActive")
      .populate("labOwner", "fullName email phone isApproved isBlocked")
      .sort({ createdAt: -1 });

    return res.json({ success: true, packages });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Failed to load lab packages" });
  }
};

exports.toggleLabPackage = async (req, res) => {
  try {
    const item = await LabTestPackage.findById(req.params.packageId);
    if (!item) return res.status(404).json({ success: false, message: "Package not found" });
    if (req.body.isActive !== undefined) item.isActive = typeof req.body.isActive === "boolean" ? req.body.isActive : ["true", "1", "yes", "on"].includes(String(req.body.isActive).trim().toLowerCase());
    if (req.body.isPopular !== undefined) item.isPopular = typeof req.body.isPopular === "boolean" ? req.body.isPopular : ["true", "1", "yes", "on"].includes(String(req.body.isPopular).trim().toLowerCase());
    await item.save();
    return res.json({ success: true, message: "Package updated", package: item });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Failed to update package" });
  }
};

exports.getLabAppointmentsAdmin = async (req, res) => {
  try {
    const { status, labId, from, to, search } = req.query;
    const query = { isActive: true };
    if (status && status !== "all") query.status = status;
    if (labId) query.labProfile = labId;
    if (from || to) {
      query.appointmentDate = {};
      if (from) query.appointmentDate.$gte = new Date(`${from}T00:00:00.000Z`);
      if (to) { const end = new Date(`${to}T00:00:00.000Z`); end.setUTCDate(end.getUTCDate() + 1); query.appointmentDate.$lt = end; }
    }

    let appointments = await LabAppointment.find(query)
      .populate("labProfile", "labName city state")
      .populate("labOwner", "fullName email phone")
      .populate("patient", "fullName email phone")
      .populate("package", "packageName category price")
      .sort({ appointmentDate: -1, createdAt: -1 });

    if (search?.trim()) {
      const term = String(search).trim().toLowerCase();
      appointments = appointments.filter((a) => [a.appointmentCode, a.packageName, a.patient?.fullName, a.patient?.email, a.labProfile?.labName].some((v) => String(v || "").toLowerCase().includes(term)));
    }
    return res.json({ success: true, appointments });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Failed to load lab appointments" });
  }
};

exports.updateLabAppointmentAdmin = async (req, res) => {
  try {
    const appointment = await LabAppointment.findById(req.params.appointmentId);
    if (!appointment) return res.status(404).json({ success: false, message: "Appointment not found" });
    const { status, paymentStatus, note } = req.body;
    if (status) appointment.status = status;
    if (paymentStatus) appointment.paymentStatus = paymentStatus;
    appointment.statusHistory.push({ status: status || appointment.status, changedBy: req.user._id, note: note?.trim() || "Updated by super admin" });
    if (status === "confirmed") appointment.confirmedAt = new Date();
    if (status === "completed") appointment.completedAt = new Date();
    if (status === "cancelled") { appointment.cancelledBy = req.user._id; appointment.cancelReason = note?.trim() || "Cancelled by super admin"; }
    await appointment.save();
    return res.json({ success: true, message: "Lab appointment updated", appointment });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Failed to update appointment" });
  }
};
