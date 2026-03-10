const { populate } = require('dotenv');
const Cart = require('../model/Cart');

class CartController{

    //[GET] - api/cart/showall
    showall(req, res){
        Cart.find({user_id: req.user_id})
        .populate({
                path: 'product_variable',  
                select: 'size color price productId',
                populate:{
                    path: 'productId',
                    select: 'product_Name'
                }
        })
        .then((carts) => res.json({data: carts}))
        .catch((err) => res.status(500).json({error: err.message}));
    };

    //[POST] - api/cart/add-to-cart
    addCart(req,res){
        Cart.findOneAndUpdate(
            { user_id: req.user.id , product_variable: req.body.product_variable },
            { $inc: { quantity: 1 } },
            { upsert: true, new: true }
        )
        .then((cart) => res.json("Added items in carts"))
        .catch((err) => res.status(500).json({err: err.message}))
    };

    //[GET] - api/cart/get_cart
    getCart(req, res){
        Cart.find({user_id: req.user.id})
        .then((carts) => res.json(carts))
        .catch((err) => res.status(500).json({err: err.message}))
    };

    //[DELETE] - api/cart/delete
    delete(req, res){
        Cart.deleteOne({_id: req.body.cart_id})
        .then(() => res.json('Deleted Item In Cart Successfully !'))
        .catch((err) => res.status(500).json({error: err.message}));
    };
    
}

module.exports = new CartController()