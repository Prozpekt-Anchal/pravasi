const Trip = require('../models/Trip');

function checkRole(requiredRoles, tripIdParam = 'id') {
  const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];

  return async (req, res, next) => {
    try {
      const tripId = req.params[tripIdParam];

      if (!tripId) {
        return res.status(400).json({
          success: false,
          error: 'Trip id is required'
        });
      }

      const trip = await Trip.findById(tripId);

      if (!trip) {
        return res.status(404).json({
          success: false,
          error: 'Trip not found'
        });
      }

      const userId = req.user && req.user._id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized'
        });
      }

      if (roles.includes('owner') && String(trip.owner) === String(userId)) {
        req.trip = trip;
        return next();
      }

      const member = trip.members.find(
        (m) => String(m.user) === String(userId) && roles.includes(m.role)
      );

      if (!member) {
        return res.status(403).json({
          success: false,
          error: 'Forbidden'
        });
      }

      req.trip = trip;
      return next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Unable to verify role'
      });
    }
  };
}

module.exports = checkRole;

