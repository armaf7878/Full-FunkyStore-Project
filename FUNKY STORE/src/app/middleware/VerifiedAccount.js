const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
class VerifiedAccount{
    verifyToken = (req, res, next, admin) => {
        console.log("2")
        const token = req.headers.token;
        if(token){
            const accesstoken = token.split(" ")[1];
             jwt.verify(accesstoken, process.env.JWT_ACCESS_KEY, (err, user) => {
                if(err){
                    return res.status(403).json({err: "Token is not valid"});
                }
                req.user = user;
                if(admin){
                    return;
                }
                next();
            })
        }
        else{
            return res.status(401).json({err: "You are not authenticated !"})
        }
    };

    verifyTokenAndAdmin = (req, res, next) =>{
        const admin = true;
        this.verifyToken(req, res, next, admin);
        if(req.user.role == 'admin'){
            console.log("1")
            next();
        }
        else(
            res.status(403).json({err:"You are not admin !"})
        )
    }
}

module.exports = new VerifiedAccount();