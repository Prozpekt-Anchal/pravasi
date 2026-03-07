const Checklist = require('../models/Checklist');

async function createChecklist(req, res) {
  try {
    const { trip, title, items } = req.body;

    if (!trip || !title) {
      return res.status(400).json({
        success: false,
        error: 'trip and title are required'
      });
    }

    const checklist = await Checklist.create({
      trip,
      title,
      items
    });

    return res.status(201).json({
      success: true,
      data: checklist
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Unable to create checklist'
    });
  }
}

async function getChecklistsByTrip(req, res) {
  try {
    const { tripId } = req.params;

    const checklists = await Checklist.find({ trip: tripId });

    return res.status(200).json({
      success: true,
      data: checklists
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Unable to fetch checklists'
    });
  }
}

async function getChecklistById(req, res) {
  try {
    const checklist = await Checklist.findById(req.params.id);

    if (!checklist) {
      return res.status(404).json({
        success: false,
        error: 'Checklist not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: checklist
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Unable to fetch checklist'
    });
  }
}

async function updateChecklist(req, res) {
  try {
    const checklist = await Checklist.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!checklist) {
      return res.status(404).json({
        success: false,
        error: 'Checklist not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: checklist
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Unable to update checklist'
    });
  }
}

async function deleteChecklist(req, res) {
  try {
    const checklist = await Checklist.findByIdAndDelete(req.params.id);

    if (!checklist) {
      return res.status(404).json({
        success: false,
        error: 'Checklist not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: null
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Unable to delete checklist'
    });
  }
}

async function toggleChecklistItem(req, res) {
  try {
    const { id, itemId } = req.params;

    const checklist = await Checklist.findById(id);

    if (!checklist) {
      return res.status(404).json({
        success: false,
        error: 'Checklist not found'
      });
    }

    const item = checklist.items.id(itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Checklist item not found'
      });
    }

    item.done = !item.done;

    await checklist.save();

    return res.status(200).json({
      success: true,
      data: checklist
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Unable to toggle checklist item'
    });
  }
}

module.exports = {
  createChecklist,
  getChecklistsByTrip,
  getChecklistById,
  updateChecklist,
  deleteChecklist,
  toggleChecklistItem
};

