const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

async function connect() {
    try{
        await mongoose.connect(process.env.MONGODB, {serverSelectionTimeoutMS: 2000});
        console.log("Connect To DB Successfully");
    }
    catch(err){
        console.log("Connect To DB Failure", err);
    }
}

module.exports = {connect};


