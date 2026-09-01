const express = require("express");
const {
  createLabProfile,
  getMyLabProfile,
  updateLabProfile,
  getAllLabProfiles,
  getSingleLabProfile,
  getPublicLabPackages,
  createLabPackage,
  getMyLabPackages,
  updateLabPackage,
  getLabPackagesByProfile,
  createLabAppointment,
  getMyLabAppointments,
  cancelMyLabAppointment,
  getLabAppointmentsForOwner,
  updateLabAppointmentStatus,
  getLabDashboardStats,
} = require("../controllers/labController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/all", getAllLabProfiles);
router.get("/packages/public", getPublicLabPackages);
router.get("/packages/profile/:labId", getLabPackagesByProfile);
router.post("/profile", protect, authorizeRoles("labOwner"), createLabProfile);
router.get("/profile/me", protect, authorizeRoles("labOwner"), getMyLabProfile);
router.patch("/profile", protect, authorizeRoles("labOwner"), updateLabProfile);

router.post("/packages", protect, authorizeRoles("labOwner"), createLabPackage);
router.get("/packages/my", protect, authorizeRoles("labOwner"), getMyLabPackages);
router.patch("/packages/:id", protect, authorizeRoles("labOwner"), updateLabPackage);

router.post("/appointments", protect, authorizeRoles("patient"), createLabAppointment);
router.get("/appointments/my", protect, authorizeRoles("patient"), getMyLabAppointments);
router.patch("/appointments/:id/cancel", protect, authorizeRoles("patient"), cancelMyLabAppointment);
router.get("/appointments/my-lab", protect, authorizeRoles("labOwner"), getLabAppointmentsForOwner);
router.patch("/appointments/:id/status", protect, authorizeRoles("labOwner"), updateLabAppointmentStatus);

router.get("/dashboard/stats", protect, authorizeRoles("labOwner"), getLabDashboardStats);

// Keep the generic ID route last so it never captures /profile, /packages, or /appointments paths.
router.get("/:id", getSingleLabProfile);

module.exports = router;
