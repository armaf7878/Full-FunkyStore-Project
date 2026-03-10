const{default: mongoose} = require('mongoose');
const Schema = mongoose.Schema;

const Category = new Schema({
    Cate_Name:{
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = new mongoose.model("Category", Category);
