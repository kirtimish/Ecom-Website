const jwt = require('jsonwebtoken');
const Razorpay = require('razorpay');
const User = require('../models/user');
const Order = require('../models/order');
function generateAccessToken(id,name,ispremiumuser){
    return jwt.sign({userId:id,name:name,ispremiumuser:ispremiumuser},'secforauthtousfoexap')

}

const purchasepremium =async (req, res) => {
    try{
        
        var rzp = new Razorpay({
            key_id:process.env.RAZORPAY_KEY_ID,
            key_secret:process.env.RAZORPAY_KEY_SECRET
        })
        const amount=2500;
        const response = await rzp.orders.create({amount,currency:"INR"})
        const order=new Order({orderid:response.id,status:'PENDING',userId:req.user})
        await order.save();
        res.json({order,key_id:rzp.key_id})
    
    }catch(err){
        console.log(err)
        res.status(500).json({message:'something went wrong',error:err})
    }
}

 const updateTransactionStatus = async(req, res ) => {
    try {

    const userId=req.user.id;
    const{payment_id,order_id}=req.body;
    const order= await Order.findOne({where:{orderid:order_id}})
        order.update({paymentid:payment_id,status:'SUCCESSFULL'}).then(()=>{
            req.user.update({ispremiumuser:true}).then(()=>{
              
                return res.status(202).json({success:true,message:"Transaction Successful",token:generateAccessToken(userId,undefined,true)})
            }).catch((err)=>{
                throw new Error(err);
            })
        }).catch((err)=>{
            throw new Error(err)
        })

    } catch (error) {
        console.log(err);
        res.status(403).json({ errpr: err, message: 'Sometghing went wrong' })
    }
    // try {
    //     const { payment_id, order_id} = req.body;
    //     Order.findOne({where : {orderid : order_id}}).then(order => {
    //         order.update({ paymentid: payment_id, status: 'SUCCESSFUL'}).then(() => {
    //             req.user.update({ispremiumuser: true})
    //             return res.status(202).json({sucess: true, message: "Transaction Successful"});
    //         }).catch((err)=> {
    //             throw new Error(err);
    //         })
    //     }).catch(err => {
    //         throw new Error(err);
    //     })
    // } catch (err) {
    //     console.log(err);
    //     res.status(403).json({ errpr: err, message: 'Something went wrong' })

    // }
}

module.exports = {
    purchasepremium,
    updateTransactionStatus
}