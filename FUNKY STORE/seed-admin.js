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

const User = mongoose.model('User', userSchema);

async function createAdmin() {
    try {
        await mongoose.connect(MONGODB);
        console.log('Connected to MongoDB');

        const hashedPassword = await bcrypt.hash('123', 10);

        const adminData = {
            fullname: 'Admin',
            email: 'admin@funky.com',
            password: hashedPassword,
            phone: '0123456789',
            address: 'Funky Store HQ',
            role: 'admin',
            image: 'https://vn.freepik.com/bieu-tuong/boy-avatar_12965382'
        };

        const existingAdmin = await User.findOne({ email: adminData.email });

        if (existingAdmin) {
            existingAdmin.fullname = adminData.fullname;
            existingAdmin.password = hashedPassword;
            existingAdmin.phone = adminData.phone;
            existingAdmin.address = adminData.address;
            existingAdmin.role = adminData.role;
            existingAdmin.image = adminData.image;
            await existingAdmin.save();
            console.log('Admin account updated!');
        } else {
            await User.create(adminData);
            console.log('Admin account created!');
        }

        const admin = await User.findOne({ email: 'admin@funky.com' });
        console.log('\n=== Admin Account ===');
        console.log('Email: admin@funky.com');
        console.log('Password: 123');
        console.log('Role:', admin.role);
        console.log('ID:', admin._id);

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('\nDisconnected from MongoDB');
    }
}

createAdmin();
