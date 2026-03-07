const Trip = require('../models/Trip');

async function createTrip(req, res) {
  try {
    const { title, destination, startDate, endDate, coverImage, totalBudget } = req.body;

    if (!title || !destination || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        error: 'Title, destination, startDate and endDate are required'
      });
    }

    const ownerId = req.user._id;

    const trip = await Trip.create({
      title,
      destination,
      startDate,
      endDate,
      coverImage,
      owner: ownerId,
      members: [
        {
          user: ownerId,
          role: 'owner'
        }
      ],
      totalBudget
    });

    return res.status(201).json({
      success: true,
      data: trip
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Unable to create trip'
    });
  }
}

async function getTrips(req, res) {
  try {
    const userId = req.user._id;

    const trips = await Trip.find({
      $or: [
        { owner: userId },
        {
          members: {
            $elemMatch: { user: userId }
          }
        }
      ]
    });

    return res.status(200).json({
      success: true,
      data: trips
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Unable to fetch trips'
    });
  }
}

async function getTripById(req, res) {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('members.user', 'name email');

    if (!trip) {
      return res.status(404).json({
        success: false,
        error: 'Trip not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: trip
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Unable to fetch trip'
    });
  }
}

async function updateTrip(req, res) {
  try {
    const trip = await Trip.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        error: 'Trip not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: trip
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Unable to update trip'
    });
  }
}

async function deleteTrip(req, res) {
  try {
    const trip = await Trip.findByIdAndDelete(req.params.id);

    if (!trip) {
      return res.status(404).json({
        success: false,
        error: 'Trip not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: null
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Unable to delete trip'
    });
  }
}

async function inviteMember(req, res) {
  try {
    const { userId, email, role } = req.body;

    if (!role || !['editor', 'viewer'].includes(role)) {
      return res.status(400).json({
        success: false,
        error: 'role (editor or viewer) is required'
      });
    }

    const User = require('../models/User');
    let targetUserId = userId;
    if (email && !targetUserId) {
      const userByEmail = await User.findOne({ email: email.trim().toLowerCase() });
      if (!userByEmail) {
        return res.status(404).json({
          success: false,
          error: 'No user found with this email'
        });
      }
      targetUserId = userByEmail._id;
    }
    if (!targetUserId) {
      return res.status(400).json({
        success: false,
        error: 'email or userId is required'
      });
    }

    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({
        success: false,
        error: 'Trip not found'
      });
    }

    const alreadyMember = trip.members.some(
      (m) => String(m.user) === String(targetUserId)
    );

    if (alreadyMember) {
      return res.status(400).json({
        success: false,
        error: 'User is already a member of this trip'
      });
    }

    trip.members.push({
      user: targetUserId,
      role
    });

    await trip.save();

    return res.status(200).json({
      success: true,
      data: trip
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Unable to invite member'
    });
  }
}

module.exports = {
  createTrip,
  getTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  inviteMember
};

