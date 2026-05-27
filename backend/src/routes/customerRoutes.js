const express = require('express');
const router = express.Router();
const {
  getCustomers,
  getCustomer,
  addCustomer,
  editCustomer,
} = require('../controllers/customerController');
const { protect } = require('../middleware/auth');
const { isAgent } = require('../middleware/roles');

// All customer routes require login
router.use(protect);

// @route   GET /api/customers
// @access  Agent and above
router.get('/', isAgent, getCustomers);

// @route   GET /api/customers/:id
// @access  Agent and above
router.get('/:id', isAgent, getCustomer);

// @route   POST /api/customers
// @access  Agent and above
router.post('/', isAgent, addCustomer);

// @route   PATCH /api/customers/:id
// @access  Agent and above
router.patch('/:id', isAgent, editCustomer);

module.exports = router;