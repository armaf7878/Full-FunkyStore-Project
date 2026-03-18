const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
class UserController{
    //[GET] - /api/user/showall
    showall(req, res){
        User.find({})
        .then((users) => res.json({data: users}))
        .catch((err) => res.status(500).json({error: err.message}))
    }

    //[POST] - api/user/create
    async create(req, res){
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(req.body.password, salt);
        const user = await new User({
            fullname: req.body.fullname,
            password: hashed,
            phone: req.body.phone,
            email: req.body.email
        })

        user.save()
        .then(() => res.json('Account Created'))
        .catch((err) => res.status(500).json({error: err.message}));
    }

    //[POST] - api/user/login
    login(req, res){
        console.log("=== LOGIN REQUEST ===");
        console.log("Email:", req.body.email);
        console.log("Password:", req.body.password);
        
        if(!req.body.password){
            res.status(400).json("Missing Password !");
        }
        User.findOne({email: req.body.email})
        .then(async(user) => {
            console.log("User found:", user ? user.email : "NOT FOUND");
            if(!user){
                res.status(404).json("User Invalid !");
            }
            else{
                const validPassword = await bcrypt.compare(req.body.password, user.password)
                console.log("Password valid:", validPassword);
                if(validPassword){
                    const accessToken = jwt.sign({
                        id: user._id,
                        role: user.role
                    },
                        process.env.JWT_ACCESS_KEY,
                        {expiresIn: "2h"}
                    );

                    console.log("Token generated:", accessToken.substring(0, 30) + "...");
                    res.status(200).json({data: accessToken});
                }else{
                    res.status(400).json("Wrong Email Or Password");
                }
            }
        })
        .catch((err) => res.status(500).json({error: err.message}));
    }
}
module.exports = new UserController();