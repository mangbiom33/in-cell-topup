const axios = require('axios');
const crypto = require('crypto');

const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY;
const MIDTRANS_CLIENT_KEY = process.env.MIDTRANS_CLIENT_KEY;
const MIDTRANS_BASE_URL = process.env.MIDTRANS_BASE_URL;

const client = axios.create({
  baseURL: MIDTRANS_BASE_URL,
  auth: {
    username: MIDTRANS_SERVER_KEY,
    password: ''
  },
  timeout: 10000
});

const paymentService = {
  async createPayment(order_id, gross_amount, customer_details, order_items) {
    try {
      const payload = {
        transaction_details: {
          order_id,
          gross_amount
        },
        customer_details: customer_details || {
          first_name: 'Customer',
          email: 'customer@example.com',
          phone: '08123456789'
        },
        item_details: order_items || [
          {
            id: order_id,
            price: gross_amount,
            quantity: 1,
            name: 'Game Top Up'
          }
        ]
      };

      const response = await client.post('/snap/v1/transactions', payload);
      return {
        status: 'success',
        token: response.data.token,
        redirect_url: response.data.redirect_url,
        order_id
      };
    } catch (error) {
      console.error('Midtrans createPayment error:', error.message);
      throw new Error('Failed to create payment with Midtrans');
    }
  },

  async getPaymentStatus(order_id) {
    try {
      const response = await client.get(`/v2/${order_id}/status`);
      return {
        order_id,
        status: response.data.transaction_status,
        payment_method: response.data.payment_type,
        transaction_id: response.data.transaction_id
      };
    } catch (error) {
      console.error('Midtrans getPaymentStatus error:', error.message);
      throw new Error('Failed to get payment status from Midtrans');
    }
  },

  async handleNotification(notification) {
    try {
      const { order_id, transaction_status, payment_type } = notification;
      
      console.log(`Payment notification received:`, {
        order_id,
        status: transaction_status,
        method: payment_type
      });

      // Update order status based on payment status
      if (transaction_status === 'settlement' || transaction_status === 'capture') {
        // Payment successful - process top up
        console.log(`Order ${order_id} paid successfully`);
        // TODO: Trigger automatic top up via Digiflazz
      } else if (transaction_status === 'pending') {
        console.log(`Order ${order_id} payment pending`);
      } else if (transaction_status === 'deny' || transaction_status === 'cancel' || transaction_status === 'expire') {
        console.log(`Order ${order_id} payment failed: ${transaction_status}`);
      }

      return { status: 'processed' };
    } catch (error) {
      console.error('handleNotification error:', error.message);
      throw new Error('Failed to handle payment notification');
    }
  }
};

module.exports = paymentService;
