const{default: mongoose} = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;
const Product = new Schema({
    product_Name:{
        type: String,
        required: true
    },
    description: {
        type: String
    },
    image: {
        type: [String],
        required: true,
        default: ["https://cdn3di.conscout.com/3d/premium/thumb/product-3d-icon-png-download-9049202.png"]
    },
    categoryId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    }
}, {
    timestamps: true
});

module.exports = new mongoose.model("Product", Product);