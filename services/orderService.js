// Simple in-memory storage for demo (use database in production)
const orders = {};
let orderCounter = 1000;

const orderService = {
  async createOrder(user_id, game, nominal, payment_method = 'midtrans') {
    try {
      const order_id = `INV${Date.now()}`;
      const now = new Date();

      const order = {
        order_id,
        user_id,
        game,
        nominal,
        payment_method,
        status: 'pending',
        created_at: now.toISOString(),
        updated_at: now.toISOString()
      };

      orders[order_id] = order;

      console.log(`✅ Order created: ${order_id} for user ${user_id}`);
      return order;
    } catch (error) {
      console.error('createOrder error:', error.message);
      throw new Error('Failed to create order');
    }
  },

  async getOrderStatus(order_id) {
    try {
      const order = orders[order_id];
      
      if (!order) {
        throw new Error(`Order ${order_id} not found`);
      }

      return order;
    } catch (error) {
      console.error('getOrderStatus error:', error.message);
      throw error;
    }
  },

  async getAllOrders() {
    try {
      return Object.values(orders).sort((a, b) => 
        new Date(b.created_at) - new Date(a.created_at)
      );
    } catch (error) {
      console.error('getAllOrders error:', error.message);
      throw new Error('Failed to get orders');
    }
  },

  async updateOrderStatus(order_id, status) {
    try {
      if (!orders[order_id]) {
        throw new Error(`Order ${order_id} not found`);
      }

      orders[order_id].status = status;
      orders[order_id].updated_at = new Date().toISOString();

      console.log(`✅ Order ${order_id} status updated to ${status}`);
      return orders[order_id];
    } catch (error) {
      console.error('updateOrderStatus error:', error.message);
      throw error;
    }
  },

  async cancelOrder(order_id) {
    try {
      if (!orders[order_id]) {
        throw new Error(`Order ${order_id} not found`);
      }

      if (orders[order_id].status === 'completed') {
        throw new Error('Cannot cancel completed order');
      }

      await this.updateOrderStatus(order_id, 'cancelled');
      return { success: true, message: `Order ${order_id} cancelled` };
    } catch (error) {
      console.error('cancelOrder error:', error.message);
      throw error;
    }
  }
};

module.exports = orderService;
