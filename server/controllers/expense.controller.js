const Expense = require('../models/Expense');

async function createExpense(req, res) {
  try {
    const { trip, title, amount, category, paidBy, date } = req.body;

    if (!trip || !title || amount == null || !category || !paidBy || !date) {
      return res.status(400).json({
        success: false,
        error: 'trip, title, amount, category, paidBy and date are required'
      });
    }

    const expense = await Expense.create({
      trip,
      title,
      amount,
      category,
      paidBy,
      date
    });

    return res.status(201).json({
      success: true,
      data: expense
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Unable to create expense'
    });
  }
}

async function getExpensesByTrip(req, res) {
  try {
    const { tripId } = req.params;

    const expenses = await Expense.find({ trip: tripId });

    return res.status(200).json({
      success: true,
      data: expenses
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Unable to fetch expenses'
    });
  }
}

async function getExpenseById(req, res) {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        error: 'Expense not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: expense
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Unable to fetch expense'
    });
  }
}

async function updateExpense(req, res) {
  try {
    const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        error: 'Expense not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: expense
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Unable to update expense'
    });
  }
}

async function deleteExpense(req, res) {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        error: 'Expense not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: null
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Unable to delete expense'
    });
  }
}

module.exports = {
  createExpense,
  getExpensesByTrip,
  getExpenseById,
  updateExpense,
  deleteExpense
};

