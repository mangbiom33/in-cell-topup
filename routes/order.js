const express = require('express');
const router = express.Router();
const orderService = require('../services/orderService');

// Create order
router.post('/create', async (req, res) => {
  try {
    const { user_id, game, nominal, payment_method } = req.body;
    
    if (!user_id || !game || !nominal) {
      return res.status(400).json({ 
        error: 'Missing required fields: user_id, game, nominal' 
      });
    }

    const order = await orderService.createOrder(
      user_id,
      game,
      nominal,
      payment_method
    );
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get order status
router.get('/status/:order_id', async (req, res) => {
  try {
    const order = await orderService.getOrderStatus(req.params.order_id);
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all orders
router.get('/list', async (req, res) => {
  try {
    const orders = await orderService.getAllOrders();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cancel order
router.post('/cancel/:order_id', async (req, res) => {
  try {
    const result = await orderService.cancelOrder(req.params.order_id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
