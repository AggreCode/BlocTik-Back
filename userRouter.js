const express = require('express')
const web3 = require('web3')
const userRouter = express.Router()
const bodyParser=require('body-parser');

const User = require('./models/userModel')
const cors = require('./cors');
const ethUtil= require('ethereumjs-util') ;
const sigUtil = require('eth-sig-util')
userRouter.use(bodyParser.json());
userRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors,(req,res)=>{
    User.find({})
    .then((user)=>{res.send(user)})
    .catch((err)=> console.log(err))
})

.post(cors.cors,(req,res,next)=>{
    User.findOne({publicAddress:req.body.publicAddress})
    .then((user)=>{
      
        res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(user);
      
    },err=> next(err))
    .catch((err)=> next(err));
})
userRouter.route('/signup')
.post(cors.cors,(req,res)=>{
    User.create({
        publicAddress: req.body.publicAddress,
        nonce: Math.floor(Math.random() * 1000000)
    })
    .then((user)=>{
       user.save()
       
    })
    .then((user)=> res.send(user))
    .catch((err)=> console.log(err))

})
userRouter.route('/auth')
.post(cors.cors,(req,res,next)=>{
    User.findOne({publicAddress:req.body.publicAddress})
    .then((user)=>{
        const msg = `I am signing my one-time nonce: ${user.nonce}`;
        const msgBufferHex = ethUtil.bufferToHex(Buffer.from(msg, 'utf8'));
        const address = sigUtil.recoverPersonalSignature({
          data: msgBufferHex,
          sig: req.body.signature
        });


    //     const msgBuffer = ethUtil.toBuffer(msg);
    //     const msgHash = ethUtil.hashPersonalMessage(msgBuffer);
    //     const signatureBuffer = ethUtil.toBuffer(signature);
    //     const signatureParams = ethUtil.fromRpcSig(signatureBuffer);
    //     const publicKey = ethUtil.ecrecover(
    //       msgHash,
    //       signatureParams.v,
    //       signatureParams.r,
    //       signatureParams.s
    //     );
    //     const addressBuffer = ethUtil.publicToAddress(publicKey);
    // const address = ethUtil.bufferToHex(addressBuffer);

        // The signature verification is successful if the address found with
        // sigUtil.recoverPersonalSignature matches the initial publicAddress
      
        if (address.toLowerCase() === req.body.publicAddress.toLowerCase()) {
            user.nonce =Math.floor(Math.random() * 1000000);
            user.save()
            .then((user)=>
            {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(user);
            },err => next(err))
        }
       else{
        err = new Error('You are not authorized to edit this comment');
        err.status = 403;
        return next(err);
       }
        // res.send(user)
    } ,(err=> next(err))
    )
    

    .catch(err=> next(err));
 

})
module.exports= userRouter;