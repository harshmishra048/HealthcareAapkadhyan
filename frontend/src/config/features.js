const readBooleanFlag = (key, fallback) => {
  const value = import.meta.env?.[key];

  if (value === undefined) return fallback;

  return ["1", "true", "yes", "on"].includes(
    String(value).trim().toLowerCase(),
  );
};

export const FEATURE_FLAGS = {
  doctors: readBooleanFlag("VITE_FEATURE_DOCTORS", false),
  hospitals: readBooleanFlag("VITE_FEATURE_HOSPITALS", false),
  sos: readBooleanFlag("VITE_FEATURE_SOS", false),
};

const roleFeatureMap = {
  doctor: "doctors",
  hospitalAdmin: "hospitals",
};

export const isFeatureEnabled = (feature) => FEATURE_FLAGS[feature] !== false;

export const isRoleEnabled = (role) => {
  const feature = roleFeatureMap[role];

  return feature ? isFeatureEnabled(feature) : true;
};

export const filterEnabledRoles = (roles) =>
  roles.filter((role) => isRoleEnabled(role));

export const getDashboardPath = (role) => {
  if (!isRoleEnabled(role)) return "/";

  switch (role) {
    case "patient":
      return "/patient-dashboard";
    case "doctor":
      return "/doctor-dashboard";
    case "hospitalAdmin":
      return "/hospital-dashboard";
    case "medicalOwner":
      return "/medical-dashboard";
    case "superAdmin":
      return "/super-admin-dashboard";
    default:
      return "/";
  }
};
