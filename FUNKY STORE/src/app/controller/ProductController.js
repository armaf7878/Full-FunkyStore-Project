const Product = require('../model/Product');
const Product_Detail = require('../model/ProductDetail');
const imagekit = require('../../config/imagekit');
class ProductController{
    
    //GET - api/product/showall
    showall(req, res){
        Product.find()
        .populate({path: 'categoryId', select: 'Cate_Name'})
        .then((products) => res.json(products))
        .catch((err) => res.status(500).json({error: err.message}))
    };

    //POST - api/product/create
    async create(req, res) {
        try {

            let imageUrl = null;

            // Nếu có file gửi lên
            if (req.file) {
                console.log("2");
                console.log( req.file.originalname);
                const uploadedImage = await imagekit.upload({
                    file: req.file.buffer.toString("base64"),
                    fileName: req.file.originalname
                });
                console.log("3");   
                imageUrl = uploadedImage.url;
                console.log(imageUrl); 
            }

            const product = new Product({
                product_Name: req.body.product_Name,
                description: req.body.description,
                image: imageUrl, // Lưu link ImageKit
                categoryId: req.body.categoryId
            });

            await product.save();

            res.json({
                message: "Created A New Product!",
                data: product
            });

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    //DELETE - api/product/delete
    delete(req, res){
        Product.deleteOne({_id: req.body.product_id})
        .then(() => res.json({message: "Deleted A Product Successfully"}))
        .catch((err) => res.status(500).json({error: err.message}));
    };

    finding(req, res){
        
    };

    //PRODUCT DETAIL API BELOW !!!

    //[GET] - api/product/variable/:id
    get_VariableProduct(req, res){
        Product_Detail.find({_id: req.params.id})
        .populate({path: 'productId'})
        .then((product) => res.json(product))
        .catch((err) => res.status(500).json({error: err.message}))
    }

    //[GET] - api/product/:id
    get_product(req, res){
        Product_Detail.find({productId: req.params.id})
        .populate({path: 'productId'})
        .then((products) => res.json(products))
        .catch((err) => res.status(500).json({error: err.message}))
    }

    //[GET] - api/product/showall_variable
    showall_variable(req, res){
        Product_Detail.find()
        .populate({path: 'productId'})
        .then((products) => res.json(products))
        .catch((err) => res.status(500).json({error: err.message}))
    }

    //POST - api/product/create_variable
    create_variable(req, res){
        const product_Detail = new Product_Detail({
            productId: req.body.productId,
            size: req.body.size,
            color: req.body.color,
            stock: req.body.stock,
            price: req.body.price
        })

        product_Detail.save()
        .then((product_Detail) => res.json({message: "Created A New Product!", data: product_Detail}))
        .catch((err) => res.status(500).json({error: err.message}));
    };

    //DELETE - api/product/delete_variable
    delete_variable(req, res){
        Product_Detail.deleteOne({_id: req.body.product_detail_id})
        .then(() => res.json({message: "Deleted A Product Successfully"}))
        .catch((err) => res.status(500).json({error: err.message}));
    };
};

module.exports = new ProductController();