const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
class VerifiedAccount{
    verifyToken = (req, res, next) => {
        console.log("2")
        const token = req.headers.token;
        if(token){
            const accesstoken = token.split(" ")[1];
             jwt.verify(accesstoken, process.env.JWT_ACCESS_KEY, (err, user) => {
                if(err){
                    return res.status(403).json({err: "Token is not valid"});
                }
                req.user = user;
                if(req.user.role == "end_user"){
                    next();
                }
                return;
            })
        }
        else{
            return res.status(401).json({err: "You are not authenticated !"})
        }
    };

    verifyTokenAndAdmin = (req, res, next) =>{
        this.verifyToken(req, res, next);
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