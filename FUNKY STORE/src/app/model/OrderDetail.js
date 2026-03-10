const{default:mongoose} = require('mongoose');
const Schema = mongoose.Schema;

const OrderDetail = mongoose.Schema({
    order_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    product_detail_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductDetail',
        required: true
    },
    quantity:{
        type: Number,
        default: 1,
        required: true
    },
    total_price:{
        type: Number,
        required: true
    }
}, {
    Timestamp: true
});

module.exports = mongoose.model("OrderDetail", OrderDetail);