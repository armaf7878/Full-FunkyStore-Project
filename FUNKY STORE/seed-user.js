const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB = 'mongodb+srv://Funky_Store:77xTW37n8nYr3dL1@funkystore.yntbuip.mongodb.net/FunkyStore?appName=FunkyStore';

const userSchema = new mongoose.Schema({
    fullname: String,
    email: String,
    password: String,
    phone: String,
    address: String,
    image: String,
    role: String
}, { timestamps: true });

const orderSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    order_phone: String,
    order_address: String,
    total_amount: Number,
    payment_method: String,
    payment_status: { type: String, default: 'waiting_payment' },
    status: { type: String, default: 'pending' }
}, { timestamps: true });

const orderDetailSchema = new mongoose.Schema({
    order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    product_detail_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductDetail' },
    quantity: Number,
    total_price: Number
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
const Order = mongoose.model('Order', orderSchema);
const OrderDetail = mongoose.model('OrderDetail', orderDetailSchema);

async function createTestUserAndOrder() {
    try {
        await mongoose.connect(MONGODB);
        console.log('Connected to MongoDB');

        // Create test user
        const hashedPassword = await bcrypt.hash('123456', 10);
        
        const userData = {
            fullname: 'Test User',
            email: 'user@test.com',
            password: hashedPassword,
            phone: '0987654321',
            address: '123 Test Street, Ho Chi Minh City',
            role: 'user',
            image: 'https://via.placeholder.com/150'
        };

        let user = await User.findOne({ email: userData.email });
        
        if (user) {
            user.fullname = userData.fullname;
            user.password = hashedPassword;
            user.phone = userData.phone;
            user.address = userData.address;
            await user.save();
            console.log('Test user updated!');
        } else {
            user = await User.create(userData);
            console.log('Test user created!');
        }

        console.log('\n=== Test User Account ===');
        console.log('Email: user@test.com');
        console.log('Password: 123456');
        console.log('User ID:', user._id);

        // Create sample order
        const orderData = {
            user_id: user._id,
            order_phone: '0987654321',
            order_address: '123 Test Street, Ho Chi Minh City',
            total_amount: 1500000,
            payment_method: 'COD',
            payment_status: 'waiting_payment',
            status: 'pending'
        };

        let order = await Order.findOne({ 
            user_id: user._id, 
            createdAt: { $gte: new Date(Date.now() - 60000) } 
        });

        if (!order) {
            order = await Order.create(orderData);
            console.log('Sample order created!');
        } else {
            console.log('Order already exists, skipping...');
        }

        console.log('\n=== Sample Order ===');
        console.log('Order ID:', order._id);
        console.log('Total Amount:', order.total_amount);
        console.log('Payment Method:', order.payment_method);
        console.log('Status:', order.status);

        console.log('\n=== Login Credentials ===');
        console.log('Email: user@test.com');
        console.log('Password: 123456');

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('\nDisconnected from MongoDB');
    }
}

createTestUserAndOrder();
