const User = require('../model/User');
const Product = require('../model/Product');
const ProductDetail = require('../model/ProductDetail');
const Order = require('../model/Order');
const OrderDetail = require('../model/OrderDetail');
const Category = require('../model/Category');
const bcrypt = require('bcryptjs');
const imagekit = require('../../config/imagekit');
class AdminController {
    
    //[GET] - /api/admin/dashboard
    async getDashboard(req, res) {
        try {
            const totalUsers = await User.countDocuments({role: 'end_user'});
            const totalProducts = await Product.countDocuments();
            const totalOrders = await Order.countDocuments();
            const totalCategories = await Category.countDocuments();
            
            // Tính tổng doanh thu
            const orders = await Order.find({payment_status: 'paid'});
            const totalRevenue = orders.reduce((sum, order) => sum + order.total_amount, 0);
            
            // Đơn hàng chờ xử lý
            const pendingOrders = await Order.countDocuments({status: 'pending'});
            
            // Sản phẩm sắp hết hàng (< 10)
            const lowStockProducts = await ProductDetail.countDocuments({stock: {$lt: 10}});
            
            // Doanh thu theo tháng (6 tháng gần nhất)
            const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
            
            const revenueByMonth = await Order.aggregate([
                {
                    $match: {
                        payment_status: 'paid',
                        createdAt: {$gte: sixMonthsAgo}
                    }
                },
                {
                    $group: {
                        _id: {
                            year: {$year: '$createdAt'},
                            month: {$month: '$createdAt'}
                        },
                        revenue: {$sum: '$total_amount'},
                        orderCount: {$sum: 1}
                    }
                },
                {$sort: {'_id.year': 1, '_id.month': 1}}
            ]);
            
            // Top 5 sản phẩm bán chạy
            const topProducts = await OrderDetail.aggregate([
                {
                    $group: {
                        _id: '$product_detail_id',
                        totalSold: {$sum: '$quantity'},
                        totalRevenue: {$sum: '$total_price'}
                    }
                },
                {$sort: {totalSold: -1}},
                {$limit: 5},
                {
                    $lookup: {
                        from: 'productdetails',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'productDetail'
                    }
                },
                {$unwind: '$productDetail'},
                {
                    $lookup: {
                        from: 'products',
                        localField: 'productDetail.productId',
                        foreignField: '_id',
                        as: 'product'
                    }
                },
                {$unwind: '$product'}
            ]);
            
            res.json({
                success: true,
                data: {
                    overview: {
                        totalUsers,
                        totalProducts,
                        totalOrders,
                        totalCategories,
                        totalRevenue,
                        pendingOrders,
                        lowStockProducts
                    },
                    revenueByMonth,
                    topProducts
                }
            });
            
        } catch (err) {
            res.status(500).json({success: false, error: err.message});
        }
    }
    
    
    
    //[GET] - /api/admin/users
    async getAllUsers(req, res) {
        try {
            const {page = 1, limit = 10, role, search} = req.query;
            const query = {};
            
            if (role) query.role = role;
            if (search) {
                query.$or = [
                    {fullname: {$regex: search, $options: 'i'}},
                    {email: {$regex: search, $options: 'i'}},
                    {phone: {$regex: search, $options: 'i'}}
                ];
            }
            
            const users = await User.find(query)
                .select('-password')
                .limit(limit * 1)
                .skip((page - 1) * limit)
                .sort({createdAt: -1});
            
            const count = await User.countDocuments(query);
            
            res.json({
                success: true,
                data: users,
                totalPages: Math.ceil(count / limit),
                currentPage: page,
                totalUsers: count
            });
            
        } catch (err) {
            res.status(500).json({success: false, error: err.message});
        }
    }
    
    //[GET] - /api/admin/users/:id
    async getUserDetail(req, res) {
        try {
            const user = await User.findById(req.params.id).select('-password');
            
            if (!user) {
                return res.status(404).json({success: false, message: 'User not found'});
            }
            
            // Lấy lịch sử đơn hàng của user
            const orders = await Order.find({user_id: req.params.id})
                .sort({createdAt: -1})
                .limit(10);
            
            const totalSpent = orders.reduce((sum, order) => {
                return order.payment_status === 'paid' ? sum + order.total_amount : sum;
            }, 0);
            
            res.json({
                success: true,
                data: {
                    user,
                    orders,
                    totalOrders: orders.length,
                    totalSpent
                }
            });
            
        } catch (err) {
            res.status(500).json({success: false, error: err.message});
        }
    }
    
    //[PUT] - /api/admin/users/:id
    async updateUser(req, res) {
        try {
            const {fullname, email, phone, address, role} = req.body;
            const updateData = {};
            
            if (fullname) updateData.fullname = fullname;
            if (email) updateData.email = email;
            if (phone) updateData.phone = phone;
            if (address) updateData.address = address;
            if (role) updateData.role = role;
            
            const user = await User.findByIdAndUpdate(
                req.params.id,
                updateData,
                {new: true, runValidators: true}
            ).select('-password');
            
            if (!user) {
                return res.status(404).json({success: false, message: 'User not found'});
            }
            
            res.json({success: true, message: 'User updated successfully', data: user});
            
        } catch (err) {
            res.status(500).json({success: false, error: err.message});
        }
    }
    
    //[DELETE] - /api/admin/users/:id
    async deleteUser(req, res) {
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            
            if (!user) {
                return res.status(404).json({success: false, message: 'User not found'});
            }
            
            res.json({success: true, message: 'User deleted successfully'});
            
        } catch (err) {
            res.status(500).json({success: false, error: err.message});
        }
    }
    
    //[POST] - /api/admin/users/create-staff
    async createStaff(req, res) {
        try {
            const {fullname, email, password, phone, address} = req.body;
            
            const existingUser = await User.findOne({$or: [{email}, {phone}]});
            if (existingUser) {
                return res.status(400).json({
                    success: false, 
                    message: 'Email or phone already exists'
                });
            }
            
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(password, salt);
            
            const staff = new User({
                fullname,
                email,
                password: hashed,
                phone,
                address,
                role: 'staff'
            });
            
            await staff.save();
            
            res.json({
                success: true, 
                message: 'Staff account created successfully',
                data: {
                    id: staff._id,
                    fullname: staff.fullname,
                    email: staff.email,
                    role: staff.role
                }
            });
            
        } catch (err) {
            res.status(500).json({success: false, error: err.message});
        }
    }
    
    
    
    //[GET] - /api/admin/orders
    async getAllOrders(req, res) {
        try {
            const {page = 1, limit = 10, status, payment_status, payment_method, from_date, to_date} = req.query;
            const query = {};
            
            if (status) query.status = status;
            if (payment_status) query.payment_status = payment_status;
            if (payment_method) query.payment_method = payment_method;
            
            if (from_date || to_date) {
                query.createdAt = {};
                if (from_date) query.createdAt.$gte = new Date(from_date);
                if (to_date) query.createdAt.$lte = new Date(to_date);
            }
            
            const orders = await Order.find(query)
                .populate('user_id', 'fullname email phone')
                .limit(limit * 1)
                .skip((page - 1) * limit)
                .sort({createdAt: -1});
            
            const count = await Order.countDocuments(query);
            
            res.json({
                success: true,
                data: orders,
                totalPages: Math.ceil(count / limit),
                currentPage: page,
                totalOrders: count
            });
            
        } catch (err) {
            res.status(500).json({success: false, error: err.message});
        }
    }
    
    //[GET] - /api/admin/orders/:id
    async getOrderDetail(req, res) {
        try {
            const order = await Order.findById(req.params.id)
                .populate('user_id', 'fullname email phone address');
            
            if (!order) {
                return res.status(404).json({success: false, message: 'Order not found'});
            }
            
            const orderDetails = await OrderDetail.find({order_id: req.params.id})
                .populate({
                    path: 'product_detail_id',
                    populate: {
                        path: 'productId',
                        select: 'product_Name image'
                    }
                });
            
            res.json({
                success: true,
                data: {
                    order,
                    items: orderDetails
                }
            });
            
        } catch (err) {
            res.status(500).json({success: false, error: err.message});
        }
    }
    
    //[PUT] - /api/admin/orders/:id/status
    async updateOrderStatus(req, res) {
        try {
            const {status} = req.body;
            
            const validStatuses = ['pending', 'confirmed', 'delivering', 'done', 'refund'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({
                    success: false, 
                    message: 'Invalid status'
                });
            }
            
            const order = await Order.findByIdAndUpdate(
                req.params.id,
                {status},
                {new: true}
            );
            
            if (!order) {
                return res.status(404).json({success: false, message: 'Order not found'});
            }
            
            res.json({
                success: true, 
                message: 'Order status updated successfully',
                data: order
            });
            
        } catch (err) {
            res.status(500).json({success: false, error: err.message});
        }
    }
    
    //[PUT] - /api/admin/orders/:id/payment-status
    async updatePaymentStatus(req, res) {
        try {
            const {payment_status} = req.body;
            
            const validStatuses = ['waiting_payment', 'paid', 'canceled'];
            if (!validStatuses.includes(payment_status)) {
                return res.status(400).json({
                    success: false, 
                    message: 'Invalid payment status'
                });
            }
            
            const order = await Order.findByIdAndUpdate(
                req.params.id,
                {payment_status},
                {new: true}
            );
            
            if (!order) {
                return res.status(404).json({success: false, message: 'Order not found'});
            }
            
            res.json({
                success: true, 
                message: 'Payment status updated successfully',
                data: order
            });
            
        } catch (err) {
            res.status(500).json({success: false, error: err.message});
        }
    }
    
    //[DELETE] - /api/admin/orders/:id
    async deleteOrder(req, res) {
        try {
            const order = await Order.findById(req.params.id);
            
            if (!order) {
                return res.status(404).json({success: false, message: 'Order not found'});
            }
            
            // Xóa order details trước
            await OrderDetail.deleteMany({order_id: req.params.id});
            
            // Xóa order
            await Order.findByIdAndDelete(req.params.id);
            
            res.json({success: true, message: 'Order deleted successfully'});
            
        } catch (err) {
            res.status(500).json({success: false, error: err.message});
        }
    }
    
   
    
    //[GET] - /api/admin/products
    async getAllProducts(req, res) {
        try {
            const {page = 1, limit = 10, category, search, sort} = req.query;
            const query = {};
            
            if (category) query.categoryId = category;
            if (search) {
                query.product_Name = {$regex: search, $options: 'i'};
            }
            
            let sortOption = {createdAt: -1};
            if (sort === 'name_asc') sortOption = {product_Name: 1};
            if (sort === 'name_desc') sortOption = {product_Name: -1};
            
            const products = await Product.find(query)
                .populate('categoryId', 'Cate_Name')
                .limit(limit * 1)
                .skip((page - 1) * limit)
                .sort(sortOption);
            
            // Lấy thông tin variants cho mỗi product
            const productsWithDetails = await Promise.all(
                products.map(async (product) => {
                    const variants = await ProductDetail.find({productId: product._id});
                    const totalStock = variants.reduce((sum, v) => sum + v.stock, 0);
                    const minPrice = variants.length > 0 ? Math.min(...variants.map(v => v.price)) : 0;
                    const maxPrice = variants.length > 0 ? Math.max(...variants.map(v => v.price)) : 0;
                    
                    return {
                        ...product.toObject(),
                        variantCount: variants.length,
                        totalStock,
                        priceRange: minPrice === maxPrice ? `${minPrice}` : `${minPrice} - ${maxPrice}`
                    };
                })
            );
            
            const count = await Product.countDocuments(query);
            
            res.json({
                success: true,
                data: productsWithDetails,
                totalPages: Math.ceil(count / limit),
                currentPage: page,
                totalProducts: count
            });
            
        } catch (err) {
            res.status(500).json({success: false, error: err.message});
        }
    }
    
    //[GET] - /api/admin/products/:id
    async getProductDetail(req, res) {
        try {
            const product = await Product.findById(req.params.id)
                .populate('categoryId', 'Cate_Name');
            
            if (!product) {
                return res.status(404).json({success: false, message: 'Product not found'});
            }
            
            const variants = await ProductDetail.find({productId: req.params.id});
            
            res.json({
                success: true,
                data: {
                    product,
                    variants
                }
            });
            
        } catch (err) {
            res.status(500).json({success: false, error: err.message});
        }
    }
    
    // [PUT] /api/admin/products/:id
    async updateProduct(req, res) {

        try {

            const {product_Name, description, categoryId} = req.body;

            const updateData = {};

            if(product_Name) updateData.product_Name = product_Name;
            if(description) updateData.description = description;
            if(categoryId) updateData.categoryId = categoryId;

            let imageUrl = null;

            // upload image
            if(req.file){

                const uploadedImage = await imagekit.upload({

                    file: req.file.buffer.toString("base64"),
                    fileName: req.file.originalname

                });

                imageUrl = uploadedImage.url;

                updateData.image = [imageUrl];
            }

            const product = await Product.findByIdAndUpdate(
                req.params.id,
                updateData,
                {new:true, runValidators:true}
            ).populate('categoryId','Cate_Name');

            if(!product){
                return res.status(404).json({
                    success:false,
                    message:"Product not found"
                });
            }

            res.json({
                success:true,
                message:"Product updated successfully",
                data:product
            });

        } catch(err){

            res.status(500).json({
                success:false,
                error:err.message
            });

        }

    }
    
    //[GET] - /api/admin/products/low-stock
    async getLowStockProducts(req, res) {
        try {
            const {threshold = 10} = req.query;
            
            const lowStockVariants = await ProductDetail.find({
                stock: {$lt: threshold}
            }).populate({
                path: 'productId',
                populate: {path: 'categoryId', select: 'Cate_Name'}
            });
            
            res.json({
                success: true,
                data: lowStockVariants,
                count: lowStockVariants.length
            });
            
        } catch (err) {
            res.status(500).json({success: false, error: err.message});
        }
    }
    
    //[PUT] - /api/admin/product-variants/:id
    async updateProductVariant(req, res) {
        try {
            const {size, color, stock, price} = req.body;
            const updateData = {};
            
            if (size) updateData.size = size;
            if (color) updateData.color = color;
            if (stock !== undefined) updateData.stock = stock;
            if (price !== undefined) updateData.price = price;
            
            const variant = await ProductDetail.findByIdAndUpdate(
                req.params.id,
                updateData,
                {new: true, runValidators: true}
            ).populate('productId', 'product_Name');
            
            if (!variant) {
                return res.status(404).json({success: false, message: 'Product variant not found'});
            }
            
            res.json({
                success: true, 
                message: 'Product variant updated successfully',
                data: variant
            });
            
        } catch (err) {
            res.status(500).json({success: false, error: err.message});
        }
    }
    
    
    
    //[PUT] - /api/admin/categories/:id
    async updateCategory(req, res) {
        try {
            const {Cate_Name} = req.body;
            
            if (!Cate_Name) {
                return res.status(400).json({
                    success: false, 
                    message: 'Category name is required'
                });
            }
            
            const category = await Category.findByIdAndUpdate(
                req.params.id,
                {Cate_Name},
                {new: true, runValidators: true}
            );
            
            if (!category) {
                return res.status(404).json({success: false, message: 'Category not found'});
            }
            
            res.json({
                success: true, 
                message: 'Category updated successfully',
                data: category
            });
            
        } catch (err) {
            res.status(500).json({success: false, error: err.message});
        }
    }
    
    //[GET] - /api/admin/categories/:id/products
    async getCategoryProducts(req, res) {
        try {
            const category = await Category.findById(req.params.id);
            
            if (!category) {
                return res.status(404).json({success: false, message: 'Category not found'});
            }
            
            const products = await Product.find({categoryId: req.params.id});
            const productCount = products.length;
            
            res.json({
                success: true,
                data: {
                    category,
                    products,
                    productCount
                }
            });
            
        } catch (err) {
            res.status(500).json({success: false, error: err.message});
        }
    }
    
    
    //[GET] - /api/admin/reports/revenue
    async getRevenueReport(req, res) {
        try {
            const {from_date, to_date, group_by = 'day'} = req.query;
            
            const matchStage = {payment_status: 'paid'};
            
            if (from_date || to_date) {
                matchStage.createdAt = {};
                if (from_date) matchStage.createdAt.$gte = new Date(from_date);
                if (to_date) matchStage.createdAt.$lte = new Date(to_date);
            }
            
            let groupId;
            if (group_by === 'month') {
                groupId = {
                    year: {$year: '$createdAt'},
                    month: {$month: '$createdAt'}
                };
            } else if (group_by === 'year') {
                groupId = {year: {$year: '$createdAt'}};
            } else {
                groupId = {
                    year: {$year: '$createdAt'},
                    month: {$month: '$createdAt'},
                    day: {$dayOfMonth: '$createdAt'}
                };
            }
            
            const report = await Order.aggregate([
                {$match: matchStage},
                {
                    $group: {
                        _id: groupId,
                        totalRevenue: {$sum: '$total_amount'},
                        orderCount: {$sum: 1},
                        avgOrderValue: {$avg: '$total_amount'}
                    }
                },
                {$sort: {'_id.year': 1, '_id.month': 1, '_id.day': 1}}
            ]);
            
            const totalRevenue = report.reduce((sum, item) => sum + item.totalRevenue, 0);
            const totalOrders = report.reduce((sum, item) => sum + item.orderCount, 0);
            
            res.json({
                success: true,
                data: {
                    report,
                    summary: {
                        totalRevenue,
                        totalOrders,
                        avgOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0
                    }
                }
            });
            
        } catch (err) {
            res.status(500).json({success: false, error: err.message});
        }
    }
    
    //[GET] - /api/admin/reports/best-sellers
    async getBestSellers(req, res) {
        try {
            const {limit = 10, from_date, to_date} = req.query;
            
            const matchStage = {};
            if (from_date || to_date) {
                matchStage.createdAt = {};
                if (from_date) matchStage.createdAt.$gte = new Date(from_date);
                if (to_date) matchStage.createdAt.$lte = new Date(to_date);
            }
            
            const pipeline = [];
            
            if (Object.keys(matchStage).length > 0) {
                pipeline.push({$match: matchStage});
            }
            
            pipeline.push(
                {
                    $group: {
                        _id: '$product_detail_id',
                        totalSold: {$sum: '$quantity'},
                        totalRevenue: {$sum: '$total_price'}
                    }
                },
                {$sort: {totalSold: -1}},
                {$limit: parseInt(limit)},
                {
                    $lookup: {
                        from: 'productdetails',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'productDetail'
                    }
                },
                {$unwind: '$productDetail'},
                {
                    $lookup: {
                        from: 'products',
                        localField: 'productDetail.productId',
                        foreignField: '_id',
                        as: 'product'
                    }
                },
                {$unwind: '$product'},
                {
                    $lookup: {
                        from: 'categories',
                        localField: 'product.categoryId',
                        foreignField: '_id',
                        as: 'category'
                    }
                },
                {$unwind: '$category'}
            );
            
            const bestSellers = await OrderDetail.aggregate(pipeline);
            
            res.json({
                success: true,
                data: bestSellers
            });
            
        } catch (err) {
            res.status(500).json({success: false, error: err.message});
        }
    }
    
    //[GET] - /api/admin/reports/customers
    async getCustomerReport(req, res) {
        try {
            const {limit = 10, sort_by = 'total_spent'} = req.query;
            
            const customers = await Order.aggregate([
                {$match: {payment_status: 'paid'}},
                {
                    $group: {
                        _id: '$user_id',
                        totalOrders: {$sum: 1},
                        totalSpent: {$sum: '$total_amount'},
                        avgOrderValue: {$avg: '$total_amount'},
                        lastOrderDate: {$max: '$createdAt'}
                    }
                },
                {$sort: sort_by === 'total_orders' ? {totalOrders: -1} : {totalSpent: -1}},
                {$limit: parseInt(limit)},
                {
                    $lookup: {
                        from: 'users',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                {$unwind: '$user'},
                {
                    $project: {
                        'user.password': 0
                    }
                }
            ]);
            
            res.json({
                success: true,
                data: customers
            });
            
        } catch (err) {
            res.status(500).json({success: false, error: err.message});
        }
    }
}

module.exports = new AdminController();