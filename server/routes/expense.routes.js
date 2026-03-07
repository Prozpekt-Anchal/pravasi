const express = require('express');
const {
  createExpense,
  getExpensesByTrip,
  getExpenseById,
  updateExpense,
  deleteExpense
} = require('../controllers/expense.controller');
const verifyToken = require('../middleware/verifyToken');
const checkRole = require('../middleware/checkRole');

const router = express.Router();

router.use(verifyToken);

router.post('/', createExpense);
router.get('/trip/:tripId', checkRole(['owner', 'editor', 'viewer'], 'tripId'), getExpensesByTrip);
router.get('/:id', getExpenseById);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);

module.exports = router;

