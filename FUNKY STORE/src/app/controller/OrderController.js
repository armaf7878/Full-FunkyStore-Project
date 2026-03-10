    const Order = require('../model/Order');
    const OrderDetail = require('../model/OrderDetail');
    const ProductDetail = require('../model/ProductDetail');
    const Cart = require('../model/Cart');
    class OrderController{
        
        //[GET] - /api/order/showall
        showall(req, res){
            Order.find()
            .then((orders) => res.json(orders))
            .catch((err) => res.status(500).json({error: err.message}));
        };

        //[POST] - /api/order/create
        async create(req, res){
            const list_product = req.body.products;
            let order_id_create = "";
            const product_detail_list = [];
            let a = 0;
            let total_amount = 0;
            for (let i=0; i<list_product.length; i++){
                console.log(list_product[i][0])
                await ProductDetail.findOne({_id: list_product[i][0]})
                .then((productDetail) => {
                    product_detail_list.push(productDetail);
                    console.log(productDetail);
                    total_amount+=productDetail.price * list_product[i][1];
                })
                .catch((err) => res.status(500).json({error: err.message}));

                if(list_product[i][1] > product_detail_list[i].stock){
                    return  res.status(403).json({error: `Item ${product_detail_list[i]._id} Is Out Of Stock !`});
                    break;
                }
            }

            console.log("Calculated Total Amount Success");

            const order = new Order({
                user_id : req.user.id,
                order_phone: req.body.order_phone,
                order_address : req.body.order_address,
                total_amount : total_amount,
                payment_method : req.body.payment_method,
            })

            await order.save()
            .then((order) =>  {
                order_id_create  = order._id
                console.log("Order ID Created:", order_id_create);
            })
            .catch((err) => res.status(500).json({err: err.message}));

            console.log("Saved Order");

            for (let productDetail of product_detail_list){
                console.log(productDetail);
                const orderDetail =  new OrderDetail({
                    order_id: order_id_create,
                    product_detail_id: productDetail._id,
                    quantity: req.body.products[a][1],
                    total_price: req.body.products[a][1] * productDetail.price
                })
                console.log("Created Order Detail Constant")
                await orderDetail.save()
                .then(() => console.log("Saved Order Detail !"))
                .catch((err) => res.status(500).json({error: err.message})) 
                let qty = req.body.products[a][1]
                await ProductDetail.findOneAndUpdate(
                    {_id: productDetail._id, stock: {$gte: qty}},
                    {$inc: {stock: -qty}}
                )
                .then((productDetail) => {
                    console.log(productDetail.stock);
                    a++;
                })
                .catch((err) => res.status(500).json({error: err.message}));

                await Cart.deleteOne({user_id: req.user.id, product_variable: productDetail})
                .then(() => console.log("Deleted item in cart"))
                .catch((err)=> res.status(500).json({error: err.message}))                
            }
            console.log("Saved Order Detail");


            return res.json({message: `Order ${a} Products Successfully`});
        }
    };

    module.exports = new OrderController();