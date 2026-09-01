const express = require("express");
const {
  createLabProfile,
  getMyLabProfile,
  updateLabProfile,
  getAllLabProfiles,
  getSingleLabProfile,
  createLabPackage,
  getMyLabPackages,
  updateLabPackage,
  getLabPackagesByProfile,
  createLabAppointment,
  getMyLabAppointments,
  getLabAppointmentsForOwner,
  updateLabAppointmentStatus,
  getLabDashboardStats,
} = require("../controllers/labController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/all", getAllLabProfiles);

router.post("/profile", protect, authorizeRoles("labOwner"), createLabProfile);
router.get("/profile/me", protect, authorizeRoles("labOwner"), getMyLabProfile);
router.patch("/profile", protect, authorizeRoles("labOwner"), updateLabProfile);

router.post("/packages", protect, authorizeRoles("labOwner"), createLabPackage);
router.get(
  "/packages/my",
  protect,
  authorizeRoles("labOwner"),
  getMyLabPackages,
);
router.patch(
  "/packages/:id",
  protect,
  authorizeRoles("labOwner"),
  updateLabPackage,
);
router.get("/packages/profile/:labId", getLabPackagesByProfile);

router.post(
  "/appointments",
  protect,
  authorizeRoles("patient"),
  createLabAppointment,
);
router.get(
  "/appointments/my",
  protect,
  authorizeRoles("patient"),
  getMyLabAppointments,
);
router.get(
  "/appointments/my-lab",
  protect,
  authorizeRoles("labOwner"),
  getLabAppointmentsForOwner,
);
router.patch(
  "/appointments/:id/status",
  protect,
  authorizeRoles("labOwner"),
  updateLabAppointmentStatus,
);

router.get(
  "/dashboard/stats",
  protect,
  authorizeRoles("labOwner"),
  getLabDashboardStats,
);

router.get("/:id", getSingleLabProfile);

module.exports = router;
