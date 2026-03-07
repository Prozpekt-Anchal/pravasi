const Activity = require('../models/Activity');

async function createActivity(req, res) {
  try {
    const { tripId, day } = req.params;
    const { title, description, time, location, attachments, order } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        error: 'Title is required'
      });
    }

    const activity = await Activity.create({
      trip: tripId,
      day,
      title,
      description,
      time,
      location,
      attachments,
      order,
      createdBy: req.user._id
    });

    return res.status(201).json({
      success: true,
      data: activity
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Unable to create activity'
    });
  }
}

async function getActivitiesByTripAndDay(req, res) {
  try {
    const { tripId, day } = req.params;

    const activities = await Activity.find({ trip: tripId, day }).sort({
      order: 1
    });

    return res.status(200).json({
      success: true,
      data: activities
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Unable to fetch activities'
    });
  }
}

async function getActivityById(req, res) {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({
        success: false,
        error: 'Activity not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: activity
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Unable to fetch activity'
    });
  }
}

async function updateActivity(req, res) {
  try {
    const activity = await Activity.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!activity) {
      return res.status(404).json({
        success: false,
        error: 'Activity not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: activity
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Unable to update activity'
    });
  }
}

async function deleteActivity(req, res) {
  try {
    const activity = await Activity.findByIdAndDelete(req.params.id);

    if (!activity) {
      return res.status(404).json({
        success: false,
        error: 'Activity not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: null
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Unable to delete activity'
    });
  }
}

module.exports = {
  createActivity,
  getActivitiesByTripAndDay,
  getActivityById,
  updateActivity,
  deleteActivity
};

