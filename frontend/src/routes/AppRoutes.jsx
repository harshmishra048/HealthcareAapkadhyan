import { Routes, Route } from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";
import DashboardLayout from "../layouts/DashboardLayout";

import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Register from "../pages/Register";
import About from "../pages/About";
import Services from "../pages/Services";
// import Contact from "../pages/Contact";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import VerifyEmail from "../pages/VerifyEmail";

import PatientDashboard from "../pages/PatientDashboard";
import MedicalDashboard from "../pages/MedicalDashboard";
import SuperAdminDashboard from "../pages/SuperAdminDashboard";

import NotFound from "../pages/NotFound";
import RoleBasedRoute from "./RoleBasedRoute";

import ApprovedUsers from "../pages/ApprovedUsers";

import PatientProfile from "../pages/patient/PatientProfile";
import PatientReports from "../pages/patient/PatientReports";

import SuperAdminReports from "../pages/superAdmin/SuperAdminReports";
import SuperAdminUsers from "../pages/superAdmin/SuperAdminUsers";

import EmergencyProfile from "../pages/EmergencyProfile";
import PatientQrProfile from "../pages/PatientQrProfile";

import MedicalProfile from "../pages/MedicalProfile";
import MedicalInventory from "../pages/medical/MedicalInventory";
import MedicineSearch from "../pages/medicines/MedicineSearch";
import ScanDiscount from "../pages/medical/ScanDiscount";
import ScanHistory from "../pages/medical/ScanHistory";
import MedicalStoreAnalytics from "../pages/superAdmin/MedicalStoreAnalytics";
import MedicineRequests from "../pages/medical/MedicineRequests";
import StorePreview from "../pages/medical/StorePreview";
import PatientMedicineRequests from "../pages/patient/PatientMedicineRequests";

import { filterEnabledRoles } from "../config/features";

/**
 * Redirects the user from a Medample route
 * to an external website.
 */

const AppRoutes = () => {
  return (
    <Routes>
      {/* =====================================================
          PUBLIC ROUTES
      ====================================================== */}
      <Route element={<PublicLayout />}>
        {/* Home */}
        <Route path="/" element={<Landing />} />

        {/* Static Pages */}
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        {/* <Route path="/contact" element={<Contact />} /> */}


        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />

        {/* Public Patient Pages */}
        <Route path="/emergency/:patientId" element={<EmergencyProfile />} />

        <Route path="/patient-card/:patientId" element={<PatientQrProfile />} />

        {/* Public Medicine Search */}
        <Route path="/medicines" element={<MedicineSearch />} />
      </Route>

      {/* =====================================================
          PROTECTED DASHBOARD LAYOUT
      ====================================================== */}
      <Route
        element={
          <RoleBasedRoute
            allowedRoles={filterEnabledRoles([
              "patient",
              "doctor",
              "hospitalAdmin",
              "medicalOwner",
              "superAdmin",
            ])}
          >
            <DashboardLayout />
          </RoleBasedRoute>
        }
      >
        {/* ===================================================
            MAIN DASHBOARDS
        ==================================================== */}

        {/* Patient Dashboard */}
        <Route
          path="/patient-dashboard"
          element={
            <RoleBasedRoute allowedRoles={["patient"]}>
              <PatientDashboard />
            </RoleBasedRoute>
          }
        />

        {/* Medical Owner Dashboard */}
        <Route
          path="/medical-dashboard"
          element={
            <RoleBasedRoute allowedRoles={["medicalOwner"]}>
              <MedicalDashboard />
            </RoleBasedRoute>
          }
        />

        {/* Super Admin Dashboard */}
        <Route
          path="/super-admin-dashboard"
          element={
            <RoleBasedRoute allowedRoles={["superAdmin"]}>
              <SuperAdminDashboard />
            </RoleBasedRoute>
          }
        />

        {/* ===================================================
            SUPER ADMIN PAGES
        ==================================================== */}

        {/* Approved Users */}
        <Route
          path="/super-admin-dashboard/approved-users"
          element={
            <RoleBasedRoute allowedRoles={["superAdmin"]}>
              <ApprovedUsers />
            </RoleBasedRoute>
          }
        />

        {/* All Users */}
        <Route
          path="/super-admin-dashboard/users"
          element={
            <RoleBasedRoute allowedRoles={["superAdmin"]}>
              <SuperAdminUsers />
            </RoleBasedRoute>
          }
        />

        {/* Medical Stores Analytics */}
        <Route
          path="/super-admin-dashboard/medical-stores"
          element={
            <RoleBasedRoute allowedRoles={["superAdmin"]}>
              <MedicalStoreAnalytics />
            </RoleBasedRoute>
          }
        />

        {/* Super Admin Reports */}
        <Route
          path="/super-admin-dashboard/reports"
          element={
            <RoleBasedRoute allowedRoles={["superAdmin"]}>
              <SuperAdminReports />
            </RoleBasedRoute>
          }
        />

        {/* ===================================================
            PATIENT PAGES
        ==================================================== */}

        {/* Patient Reports */}
        <Route
          path="/patient-dashboard/reports"
          element={
            <RoleBasedRoute allowedRoles={["patient"]}>
              <PatientReports />
            </RoleBasedRoute>
          }
        />

        {/* Patient Medicine Requests */}
        <Route
          path="/patient-dashboard/medicine-requests"
          element={
            <RoleBasedRoute allowedRoles={["patient"]}>
              <PatientMedicineRequests />
            </RoleBasedRoute>
          }
        />

        {/* Patient Profile */}
        <Route
          path="/patient-dashboard/profile"
          element={
            <RoleBasedRoute allowedRoles={["patient"]}>
              <PatientProfile />
            </RoleBasedRoute>
          }
        />

        {/* ===================================================
            DOCTOR PAGES
        ==================================================== */}

        {/* Doctor features currently disabled */}

        {/* ===================================================
            MEDICAL OWNER PAGES
        ==================================================== */}

        {/* Medical Profile */}
        <Route
          path="/medical-dashboard/profile"
          element={
            <RoleBasedRoute allowedRoles={["medicalOwner"]}>
              <MedicalProfile />
            </RoleBasedRoute>
          }
        />

        {/* Medical Inventory */}
        <Route
          path="/medical-dashboard/inventory"
          element={
            <RoleBasedRoute allowedRoles={["medicalOwner"]}>
              <MedicalInventory />
            </RoleBasedRoute>
          }
        />

        {/* Medicine Requests */}
        <Route
          path="/medical-dashboard/medicine-requests"
          element={
            <RoleBasedRoute allowedRoles={["medicalOwner"]}>
              <MedicineRequests />
            </RoleBasedRoute>
          }
        />

        {/* Scan Discount */}
        <Route
          path="/medical-dashboard/scan-discount"
          element={
            <RoleBasedRoute allowedRoles={["medicalOwner"]}>
              <ScanDiscount />
            </RoleBasedRoute>
          }
        />

        {/* Scan History */}
        <Route
          path="/medical-dashboard/scan-history"
          element={
            <RoleBasedRoute allowedRoles={["medicalOwner"]}>
              <ScanHistory />
            </RoleBasedRoute>
          }
        />

        {/* Store Preview */}
        <Route
          path="/medical-dashboard/store-preview"
          element={
            <RoleBasedRoute allowedRoles={["medicalOwner"]}>
              <StorePreview />
            </RoleBasedRoute>
          }
        />
      </Route>

      {/* =====================================================
          404 - NOT FOUND
      ====================================================== */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
