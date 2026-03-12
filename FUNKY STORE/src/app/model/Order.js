const{default:mongoose} = require('mongoose');
const Schema = mongoose.Schema;

const Order = new Schema({
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true
    },
    order_address:{
        type: String,
        required: true
    },
    order_phone:{
        type: String,
        required: true
    },
    total_amount:{
        type: Number,
        required: true
    },
    status:{
        type: String,
        enum: ['pending', 'confirmed', 'delivering', 'done', 'refund'],
        required: true,
        default: "pending"
    },
    payment_status:{
        type: String,
        enum: ['waiting_payment', 'paid', 'canceled'],
        default: 'waiting_payment',
        required: true
    },
    payment_method:{
        type: String,
        enum: ['COD', 'VNPay'],
        default: 'COD',
        required: true
    }
},
{
    timestamps: true
})

module.exports = new mongoose.model("Order", Order);