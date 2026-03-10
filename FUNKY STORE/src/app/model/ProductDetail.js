const {default: mongoose, mongo} = require('mongoose');
const Schema = mongoose.Schema;

const ProductDetail = new Schema({
    productId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    size:{
        type: String,
        required: true
    },
    color:{
        type: String,
        required: true
    },
    stock:{
        type: Number,
        required: true
    },
    price:{
        type: Number,
        required: true
    },

}, {
    timestamps: true
})

module.exports = new mongoose.model("ProductDetail", ProductDetail);