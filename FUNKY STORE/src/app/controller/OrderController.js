const Order = require('../model/Order');
const OrderDetail = require('../model/OrderDetail');
const ProductDetail = require('../model/ProductDetail');
const Cart = require('../model/Cart');

const crypto = require('crypto');
const moment = require('moment');
const qs = require('qs');

class OrderController {

    //[GET] - /api/order/showall
    showall(req, res){
        Order.find()
        .then((orders) => res.json(orders))
        .catch((err) => res.status(500).json({error: err.message}));
    }

    //[POST] - /api/order/create
    async create(req, res){
        try {

            const list_product = req.body.products;

            if (!list_product || !Array.isArray(list_product) || list_product.length === 0) {
                return res.status(400).json({error: 'Products list is required'});
            }

            let product_detail_list = [];
            let total_amount = 0;

            for (let i = 0; i < list_product.length; i++) {

                const productDetail = await ProductDetail.findById(list_product[i][0]);

                if (!productDetail) {
                    return res.status(404).json({error: `Product not found`});
                }

                const quantity = list_product[i][1];

                if (quantity > productDetail.stock) {
                    return res.status(403).json({error: `Item ${productDetail._id} out of stock`});
                }

                product_detail_list.push(productDetail);
                total_amount += productDetail.price * quantity;

            }

            const order = new Order({
                user_id : req.user.id,
                order_phone: req.body.order_phone,
                order_address : req.body.order_address,
                total_amount : total_amount,
                payment_method : req.body.payment_method
            })

            const savedOrder = await order.save();
            const order_id_create = savedOrder._id;

            for (let i = 0; i < product_detail_list.length; i++) {

                const productDetail = product_detail_list[i];
                const quantity = list_product[i][1];

                const orderDetail = new OrderDetail({
                    order_id: order_id_create,
                    product_detail_id: productDetail._id,
                    quantity: quantity,
                    total_price: quantity * productDetail.price
                })

                await orderDetail.save();

                await ProductDetail.findOneAndUpdate(
                    {_id: productDetail._id, stock: {$gte: quantity}},
                    {$inc: {stock: -quantity}}
                );

                await Cart.deleteOne({
                    user_id: req.user.id,
                    product_variable: productDetail._id
                });

            }

            return res.json({
                message: `Order created successfully`,
                orderId: order_id_create,
                total_amount: total_amount
            });

        } catch (err) {
            console.error(err);
            res.status(500).json({error: err.message});
        }
    }

    //[GET] - /api/order/user/orders
    async getUserOrders(req, res) {

        try {

            const orders = await Order.find({user_id: req.user.id})
                .sort({createdAt: -1});

            res.json({
                success: true,
                data: orders
            });

        } catch (err) {

            res.status(500).json({
                success:false,
                error: err.message
            });

        }

    }

    //[GET] - /api/order/user/:id
    async getUserOrderById(req, res) {

        try {

            const order = await Order.findOne({
                _id: req.params.id,
                user_id: req.user.id
            });

            if (!order) {
                return res.status(404).json({message:"Order not found"});
            }

            const orderDetails = await OrderDetail.find({
                order_id: req.params.id
            }).populate({
                path: 'product_detail_id',
                populate: {
                    path: 'productId',
                    select: 'product_Name image'
                }
            });

            res.json({
                order,
                items: orderDetails
            });

        } catch (err) {

            res.status(500).json({
                error: err.message
            });

        }

    }

    //[POST] - /api/order/vnpay/create
    async createVNPayPayment(req, res){

        try{

            const {orderId, amount} = req.body;
            console.log("=== VNPAY CREATE DEBUG ===");
            console.log("OrderId:", orderId);
            console.log("Amount (USD):", amount);

            const order = await Order.findOne({
                _id: orderId,
                user_id: req.user.id
            });

            if(!order){
                return res.status(404).json({
                    success:false,
                    message:"Order not found"
                });
            }

            const vnp_TmnCode = process.env.VNP_TMN_CODE;
            const vnp_HashSecret = process.env.VNP_HASH_SECRET;
            const vnp_Url = process.env.VNP_URL;
            const vnp_ReturnUrl = process.env.VNP_RETURN_URL;

            if (!vnp_TmnCode || !vnp_HashSecret) {
                console.error("VNPAY Error: VNP_TMN_CODE or VNP_HASH_SECRET is missing in .env");
                return res.status(500).json({
                    success: false,
                    message: "VNPay configuration is missing"
                });
            }

            const orderDetails = await OrderDetail.find({ order_id: orderId });
            if (!orderDetails || orderDetails.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "Order details not found"
                });
            }

            const totalAmountVnd = orderDetails.reduce((sum, item) => {
                return sum + Number(item.total_price || 0);
            }, 0);

            const date = new Date();
            const createDate = moment(date).format('YYYYMMDDHHmmss');
            const expireDate = moment(date).add(15, 'minutes').format('YYYYMMDDHHmmss');

            const VND_RATE = 25000;
            const amountVnd = totalAmountVnd * VND_RATE;

            let vnp_Params = {
                "vnp_Version": "2.1.0",
                "vnp_Command": "pay",
                "vnp_TmnCode": vnp_TmnCode,
                "vnp_Locale": "vn",
                "vnp_CurrCode": "VND",
                "vnp_TxnRef": orderId,
                "vnp_OrderInfo": "Thanh_toan_don_hang_" + orderId,
                "vnp_OrderType": "other",
                "vnp_Amount": Math.round(amountVnd) * 100,
                "vnp_ReturnUrl": vnp_ReturnUrl,
                "vnp_IpAddr": "127.0.0.1",
                "vnp_CreateDate": createDate,
                "vnp_ExpireDate": expireDate
            };

            // 1. Sắp xếp tham số alphabetically (A-Z)
            function sortObject(obj) {
                let sorted = {};
                let str = [];
                let key = Object.keys(obj).sort();
                for (let i = 0; i < key.length; i++) {
                    sorted[key[i]] = obj[key[i]];
                }
                return sorted;
            }

            const sortedParams = sortObject(vnp_Params);

            // 2. Tạo chuỗi ký (SignData) từ giá trị ENCODED
            const signData = Object.keys(sortedParams)
                .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(sortedParams[key]).replace(/%20/g, "+")}`)
                .join('&');

            // 3. Tạo SecureHash (HMAC-SHA512)
            const hmac = crypto.createHmac("sha512", vnp_HashSecret);
            const secureHash = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
            
            console.log("=== VNPAY CREATE DEBUG ===");
            console.log("SignData (RAW):", signData);
            console.log("SecureHash:", secureHash);

            // 4. Tạo URL với giá trị đã mã hóa
            const queryParams = qs.stringify(sortedParams, { encode: true });
            const paymentUrl = vnp_Url + "?" + queryParams + "&vnp_SecureHash=" + secureHash;

            res.json({
                success: true,
                paymentUrl
            });

        }
        catch(err){

            console.error(err);

            res.status(500).json({
                success:false,
                error:err.message
            });

        }

    }

    //[GET] - /api/order/vnpay/callback
    async vnpayCallback(req,res){

        try{

            let vnp_Params = req.query;

            const secureHash = vnp_Params['vnp_SecureHash'];

            delete vnp_Params['vnp_SecureHash'];
            delete vnp_Params['vnp_SecureHashType'];

            function sortObject(obj) {
                let sorted = {};
                let str = [];
                let key = Object.keys(obj).sort();
                for (let i = 0; i < key.length; i++) {
                    sorted[key[i]] = obj[key[i]];
                }
                return sorted;
            }

            const sortedParams = sortObject(vnp_Params);
            const signData = Object.keys(sortedParams)
                .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(sortedParams[key]).replace(/%20/g, "+")}`)
                .join('&');

            const hmac = crypto.createHmac("sha512", process.env.VNP_HASH_SECRET);
            const checkHash = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

            const orderId = vnp_Params['vnp_TxnRef'];
            const responseCode = vnp_Params['vnp_ResponseCode'];

            console.log("=== VNPAY CALLBACK DEBUG ===");
            console.log("CalculatedHash:", checkHash);
            console.log("ExpectedHash:", secureHash);

            if (secureHash.toLowerCase() === checkHash.toLowerCase() && responseCode === "00") {

                await Order.findByIdAndUpdate(
                    orderId,
                    {payment_status:"paid"}
                );

                return res.redirect(
                    `${process.env.FRONTEND_URL}/order/history?success=true&orderId=${orderId}`
                );
            }

            return res.redirect(
                `${process.env.FRONTEND_URL}/order/history?success=false&orderId=${orderId}`
            );

        }
        catch(err){

            console.error(err);

            res.redirect(
                `${process.env.FRONTEND_URL}/order/history?success=false`
            );

        }

    }

}

module.exports = new OrderController();
