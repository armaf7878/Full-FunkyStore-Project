const Category = require('../model/Category');

class CategoryController{

    //[GET] - api/category/showall
    showall(req, res){
        Category.find()
        .then((cates) => res.json({data: cates}))
        .catch((err) => res.status(500).json({Error: err.message}))
    }

    //[POST] - api/category/create
    create(req, res){
        const cate = new Category({
            Cate_Name: req.body.Cate_Name
        })

        cate.save()
        .then(() => res.json("Create A New Cate Successfully"))
        .catch((err) => res.status(500).json({Error: err.message}));
    }

    delete(req, res){

        Category.deleteOne({Cate_Name: req.body.Cate_Name})
        .then(() => res.json("Deleted Successfully"))
        .catch((err) => res.status(500).json({Error: err.message}))
    }
}

module.exports = new CategoryController();