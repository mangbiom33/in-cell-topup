const axios = require('axios');
const crypto = require('crypto');

const DIGIFLAZZ_USERNAME = process.env.DIGIFLAZZ_USERNAME;
const DIGIFLAZZ_API_KEY = process.env.DIGIFLAZZ_API_KEY;
const DIGIFLAZZ_BASE_URL = process.env.DIGIFLAZZ_BASE_URL;

const client = axios.create({
  baseURL: DIGIFLAZZ_BASE_URL,
  timeout: 10000
});

function generateSignature(data) {
  const signText = DIGIFLAZZ_USERNAME + DIGIFLAZZ_API_KEY + JSON.stringify(data);
  return crypto.createHash('md5').update(signText).digest('hex');
}

const digiflazzService = {
  async getProducts() {
    try {
      const data = {
        cmd: 'list-product',
        username: DIGIFLAZZ_USERNAME,
        sign: generateSignature({ cmd: 'list-product' })
      };
      
      const response = await client.post('/transaction', data);
      return response.data;
    } catch (error) {
      console.error('Digiflazz getProducts error:', error.message);
      throw new Error('Failed to get products from Digiflazz');
    }
  },

  async getPricelist() {
    try {
      const data = {
        cmd: 'price-list',
        username: DIGIFLAZZ_USERNAME,
        sign: generateSignature({ cmd: 'price-list' })
      };
      
      const response = await client.post('/transaction', data);
      return response.data;
    } catch (error) {
      console.error('Digiflazz getPricelist error:', error.message);
      throw new Error('Failed to get price list from Digiflazz');
    }
  },

  async createTransaction(buyer_sku_code, customer_no, ref_id) {
    try {
      const data = {
        cmd: 'topup',
        username: DIGIFLAZZ_USERNAME,
        buyer_sku_code,
        customer_no,
        ref_id
      };
      
      data.sign = generateSignature(data);
      
      const response = await client.post('/transaction', data);
      return response.data;
    } catch (error) {
      console.error('Digiflazz createTransaction error:', error.message);
      throw new Error('Failed to create transaction with Digiflazz');
    }
  },

  async getBalance() {
    try {
      const data = {
        cmd: 'balance',
        username: DIGIFLAZZ_USERNAME,
        sign: generateSignature({ cmd: 'balance' })
      };
      
      const response = await client.post('/transaction', data);
      return response.data;
    } catch (error) {
      console.error('Digiflazz getBalance error:', error.message);
      throw new Error('Failed to get balance from Digiflazz');
    }
  }
};

module.exports = digiflazzService;
