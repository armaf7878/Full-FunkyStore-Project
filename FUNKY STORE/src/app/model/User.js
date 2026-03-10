const {default: mongoose} = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
    fullname:{
        type: String,
        required: true
    },
    email:{
        type: String,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    phone:{
        type: String,
        required: true,
        unique: true
    },
    address:{
        type: String,
    },
    image:{
        type: String,
        default: "https://vn.freepik.com/bieu-tuong/boy-avatar_12965382"
    },
    role:{
        type: String,
        enum: ['admin', 'end_user', 'staff'],
        required: true,
        default: 'end_user'
    }
}, {
    timestamps: true
})

module.exports = new mongoose.model('User', User);