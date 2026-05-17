# IN CELL - Top Up Game Service

Website top up game dengan sistem order otomatis 24 jam, integrasi Digiflazz dan payment gateway.

## Fitur Utama

✅ **Order Otomatis** - Pemesanan top up game otomatis via API  
✅ **Multi-Payment Gateway** - Support Midtrans (QRIS, DANA, Bank Transfer)  
✅ **Digiflazz Integration** - Otomatis forward order ke supplier  
✅ **Real-time Status** - Update status order real-time  
✅ **Admin Dashboard** - Monitor semua transaksi  
✅ **Webhook Support** - Handle payment notifications  

## Teknologi

- **Backend**: Node.js + Express
- **Payment Gateway**: Midtrans
- **Game Supplier**: Digiflazz
- **Frontend**: HTML + CSS + JavaScript

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

Copy `.env.example` ke `.env` dan isi konfigurasi:

```bash
cp .env.example .env
```

Edit `.env` dengan data akun kamu:

```env
# Digiflazz Configuration
DIGIFLAZZ_USERNAME=your_username
DIGIFLAZZ_API_KEY=your_api_key

# Midtrans Configuration
MIDTRANS_SERVER_KEY=your_server_key
MIDTRANS_CLIENT_KEY=your_client_key
```

### 3. Daftar & Setup Account

#### Digiflazz
1. Daftar di https://digiflazz.com
2. Go to Settings → API → Ambil Username & API Key
3. Deposit saldo ke akun

#### Midtrans
1. Daftar di https://midtrans.com
2. Go to Settings → Access Keys → Ambil Server & Client Key
3. Untuk test gunakan Sandbox mode

### 4. Run Server

**Development Mode:**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

Server akan berjalan di `http://localhost:3000`

## API Endpoints

### Digiflazz Routes

- `GET /api/digiflazz/products` - List produk game
- `GET /api/digiflazz/pricelist` - Daftar harga
- `POST /api/digiflazz/transaction` - Create transaction
- `GET /api/digiflazz/balance` - Check saldo

### Payment Routes

- `POST /api/payment/create` - Create payment token
- `GET /api/payment/status/:order_id` - Get payment status
- `POST /api/payment/webhook` - Handle payment webhook

### Order Routes

- `POST /api/order/create` - Create order
- `GET /api/order/status/:order_id` - Get order status
- `GET /api/order/list` - List all orders
- `POST /api/order/cancel/:order_id` - Cancel order

## Contoh Implementasi

### 1. Create Order

```bash
curl -X POST http://localhost:3000/api/order/create \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "123456",
    "game": "Mobile Legends",
    "nominal": "10000",
    "payment_method": "midtrans"
  }'
```

### 2. Create Payment

```bash
curl -X POST http://localhost:3000/api/payment/create \
  -H "Content-Type: application/json" \
  -d '{
    "order_id": "INV1234567890",
    "gross_amount": 10000,
    "customer_details": {
      "first_name": "John",
      "email": "john@example.com",
      "phone": "08123456789"
    }
  }'
```

### 3. Create Digiflazz Transaction (Otomatis setelah pembayaran sukses)

```bash
curl -X POST http://localhost:3000/api/digiflazz/transaction \
  -H "Content-Type: application/json" \
  -d '{
    "buyer_sku_code": "ML100",
    "customer_no": "123456",
    "ref_id": "INV1234567890"
  }'
```

## Workflow Otomatis

```
1. User membuat order via website
   ↓
2. System create payment token Midtrans
   ↓
3. User bayar via QRIS/DANA/Bank
   ↓
4. Midtrans webhook notifikasi pembayaran sukses
   ↓
5. System auto forward order ke Digiflazz
   ↓
6. Diamond/Gem langsung masuk ke akun user
   ↓
7. Order status = completed
```

## Security Best Practices

⚠️ **IMPORTANT:**
- Jangan expose API key di frontend
- Selalu gunakan HTTPS di production
- Validate semua input dari user
- Rate limit untuk prevent abuse
- Log semua transaksi untuk audit

## Troubleshooting

### Digiflazz Connection Error
- Check internet connection
- Verify username & API key
- Ensure saldo cukup

### Midtrans Payment Error
- Verify Server Key & Client Key
- Check if sandbox/production mode sesuai
- Verify webhook URL di Midtrans dashboard

### Order Stuck di Pending
- Check payment status di Midtrans
- Verify webhook notifikasi terima
- Check Digiflazz transaction log

## Support

📞 WhatsApp: 0877-5861-4675  
📧 Email: support@incell.local

## License

MIT
