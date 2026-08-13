const { isFeatureEnabled } = require("../config/features");

const requireFeature = (feature, label) => (req, res, next) => {
  if (isFeatureEnabled(feature)) {
    return next();
  }

  return res.status(404).json({
    success: false,
    message: `${label} feature is currently unavailable`,
  });
};

module.exports = {
  requireFeature,
};
