const express = require("express");
const {
  getLabManagement,
  verifyLab,
  unverifyLab,
  toggleLabActive,
  getLabPackagesAdmin,
  toggleLabPackage,
  getLabAppointmentsAdmin,
  updateLabAppointmentAdmin,
} = require("../controllers/superAdminLabController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();
const adminOnly = [protect, authorizeRoles("superAdmin")];

router.get("/labs", ...adminOnly, getLabManagement);
router.patch("/labs/:labId/verify", ...adminOnly, verifyLab);
router.patch("/labs/:labId/unverify", ...adminOnly, unverifyLab);
router.patch("/labs/:labId/active", ...adminOnly, toggleLabActive);
router.get("/packages", ...adminOnly, getLabPackagesAdmin);
router.patch("/packages/:packageId", ...adminOnly, toggleLabPackage);
router.get("/appointments", ...adminOnly, getLabAppointmentsAdmin);
router.patch("/appointments/:appointmentId", ...adminOnly, updateLabAppointmentAdmin);

module.exports = router;
