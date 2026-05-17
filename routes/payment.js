const express = require('express');
const router = express.Router();
const paymentService = require('../services/paymentService');

// Create payment
router.post('/create', async (req, res) => {
  try {
    const { order_id, gross_amount, customer_details, order_items } = req.body;
    
    if (!order_id || !gross_amount) {
      return res.status(400).json({ 
        error: 'Missing required fields: order_id, gross_amount' 
      });
    }

    const payment = await paymentService.createPayment(
      order_id,
      gross_amount,
      customer_details,
      order_items
    );
    
    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get payment status
router.get('/status/:order_id', async (req, res) => {
  try {
    const status = await paymentService.getPaymentStatus(req.params.order_id);
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Webhook for payment notification
router.post('/webhook', async (req, res) => {
  try {
    const notification = req.body;
    await paymentService.handleNotification(notification);
    res.json({ status: 'received' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
