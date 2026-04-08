const jwt = require('jsonwebtoken')
const User = require('../models/user')

exports.auth=async(req,res,next)=>{
    try {
        const token = req.cookies.token
        if(!token){
            return res.status(401).json({error:"No token,authorization denied"});
        }
        const decode = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
        const user = await User.findById(decode.userId).select('-password');
        
        if (!user) {
            return res.status(401).json({ error: "User no longer exists, authorization denied" });
        }
        
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({error:'Token is not valid'})
        
    }
}