const express = require('express')
const router = express.Router();
const UserController = require('../controller/user');
const Authentication = require('../authentication/auth')

router.get('/status', (req, res) => {
    const mongoose = require('mongoose');
    return res.status(200).json({
        mongoUriDefined: !!process.env.MONGO_URI,
        mongoUriLength: process.env.MONGO_URI ? process.env.MONGO_URI.length : 0,
        jwtPrivateKeyDefined: !!process.env.JWT_PRIVATE_KEY,
        dbState: mongoose.connection.readyState, // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
        dbHost: mongoose.connection.host,
        dbError: global.dbError,
    });
});

router.post('/register',UserController.register)
router.post('/login',UserController.login)
router.post('/google',UserController.loginThroughGmail)


router.put('/update',Authentication.auth,UserController.updateUser)
router.get('/user/:id',UserController.getProfileById)
router.post('/logout',Authentication.auth,UserController.logout)



router.get('/self',Authentication.auth,(req,res)=>{
    return res.status(200).json({
        user:req.user
    })
})

router.get('/findUser',Authentication.auth, UserController.findUser)
router.post('/sendFriendReq',Authentication.auth, UserController.sendFriendRequest)
router.post('/acceptFriendRequest',Authentication.auth, UserController.acceptFriendRequest)
router.delete('/removeFromFriendList/:friendId', Authentication.auth, UserController.removeFromFriend);




router.get('/friendsList',Authentication.auth, UserController.getFriendsList)
router.get('/pendingFriendsList',Authentication.auth, UserController.getPendingFriendsList)


module.exports=router;