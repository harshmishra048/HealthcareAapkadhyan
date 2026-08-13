const readBooleanFlag = (value, fallback) => {
  if (value === undefined) return fallback;

  return ["1", "true", "yes", "on"].includes(
    String(value).trim().toLowerCase(),
  );
};

const features = {
  doctors: readBooleanFlag(process.env.FEATURE_DOCTORS, false),
  hospitals: readBooleanFlag(process.env.FEATURE_HOSPITALS, false),
  sos: readBooleanFlag(process.env.FEATURE_SOS, false),
};

const roleFeatureMap = {
  doctor: "doctors",
  hospitalAdmin: "hospitals",
};

const isFeatureEnabled = (feature) => features[feature] !== false;

const isRoleEnabled = (role) => {
  const feature = roleFeatureMap[role];

  return feature ? isFeatureEnabled(feature) : true;
};

module.exports = {
  features,
  isFeatureEnabled,
  isRoleEnabled,
};
