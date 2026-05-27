const {
  getAllCustomers,
  getCustomerById,
  getCustomerByEmail,
  createCustomer,
  updateCustomer,
} = require('../models/customerModel');
const { getCustomerTickets } = require('../models/ticketModel');

// ─── Get All Customers ───────────────────────────────────────────
const getCustomers = async (req, res) => {
  try {
    const customers = await getAllCustomers();
    res.status(200).json({ customers });
  } catch (error) {
    console.error('Get customers error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── Get Single Customer ─────────────────────────────────────────
const getCustomer = async (req, res) => {
  try {
    const customer = await getCustomerById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Get their ticket history
    const tickets = await getCustomerTickets(req.params.id);

    res.status(200).json({ customer, tickets });
  } catch (error) {
    console.error('Get customer error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── Create Customer ─────────────────────────────────────────────
const addCustomer = async (req, res) => {
  try {
    const { full_name, email, phone, company } = req.body;

    if (!full_name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    // Check if customer already exists
    const existing = await getCustomerByEmail(email);
    if (existing) {
      return res.status(409).json({ message: 'Customer with this email already exists' });
    }

    const customer = await createCustomer({ full_name, email, phone, company });
    res.status(201).json({ message: 'Customer created', customer });
  } catch (error) {
    console.error('Create customer error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── Update Customer ─────────────────────────────────────────────
const editCustomer = async (req, res) => {
  try {
    const customer = await getCustomerById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const updated = await updateCustomer(req.params.id, req.body);
    res.status(200).json({ message: 'Customer updated', customer: updated });
  } catch (error) {
    console.error('Update customer error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getCustomers, getCustomer, addCustomer, editCustomer };