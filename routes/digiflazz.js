const express = require('express');
const router = express.Router();
const digiflazzService = require('../services/digiflazzService');

// Get available products
router.get('/products', async (req, res) => {
  try {
    const products = await digiflazzService.getProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get price list
router.get('/pricelist', async (req, res) => {
  try {
    const pricelist = await digiflazzService.getPricelist();
    res.json(pricelist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create transaction
router.post('/transaction', async (req, res) => {
  try {
    const { buyer_sku_code, customer_no, ref_id } = req.body;
    
    if (!buyer_sku_code || !customer_no || !ref_id) {
      return res.status(400).json({ 
        error: 'Missing required fields: buyer_sku_code, customer_no, ref_id' 
      });
    }

    const result = await digiflazzService.createTransaction(
      buyer_sku_code,
      customer_no,
      ref_id
    );
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Check balance
router.get('/balance', async (req, res) => {
  try {
    const balance = await digiflazzService.getBalance();
    res.json(balance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
