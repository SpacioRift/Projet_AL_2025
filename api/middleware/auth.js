const jwt = require('jsonwebtoken');
require('dotenv').config();

const auth = (role) => {
    return (req,res,next) => {
        if(!req.headers?.authorization){
            throw new Error('token missing');
        }
        const token = req.headers.authorization.split(" ")[1];
        let result = jwt.verify(token,'RVNHSS0zQUwtTk9ERUpT');
        if(!result){
            throw new Error('token invalid');
        }
        if(!result.role.some(r => r.code === role)){
            throw new Error('forbiden');
        }
        next();
    }
}

module.exports = auth;