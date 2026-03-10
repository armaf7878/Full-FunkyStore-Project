const{default: mongoose} = require('mongoose');
const Schema = mongoose.Schema;

const Cart = new Schema ({
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    product_variable:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProductDetail",
        required: true,
    },
    quantity:{
        type: Number,
        required: true,
        default: 1
    }
}, {
    timestamps: true
})

module.exports = new mongoose.model('Cart', Cart);