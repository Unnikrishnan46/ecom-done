const client = require("../config/connection")
const collection = require("../config/collections")
const { ObjectId } = require("mongodb")
let objectId = require('mongodb').ObjectId
const Razorpay = require('razorpay');
const crypto = require('crypto');

var instance = new Razorpay({
    key_id: 'rzp_test_vOWB4Hpqe9fSat',
    key_secret: 'FzmPqfwFMBihPYceyGhefE3s'
});


module.exports = {
    getAllProducts: () => {
        return new Promise(async (resolve, reject) => {
            const products = await client.db(collection.DATABASE).collection(collection.PRODUCT_COLLECTION).find().toArray()
            resolve(products);
        })
    },

    getLimitedProducts: () => {
        return new Promise(async (resolve, reject) => {
            const limitedProducts = await client.db(collection.DATABASE).collection(collection.PRODUCT_COLLECTION).find().limit(6).toArray()
            resolve(limitedProducts)
        })
    },

    singleProductDetails: (id) => {
        return new Promise(async (resolve, reject) => {
            const singleProductDetail = await client.db(collection.DATABASE).collection(collection.PRODUCT_COLLECTION).findOne({ _id: new objectId(id) })
            resolve(singleProductDetail);
        })
    },

    addCart: (productId) => {
        return new Promise(async (resolve, reject) => {
            const product = await client.db(collection.DATABASE).collection(collection.PRODUCT_COLLECTION).findOne({ _id: new objectId(productId) })
            resolve(product)
        })
    },

    generateRazorpay: (orderId, total) => {
        console.log(orderId, total)
        return new Promise((resolve, reject) => {
            var options = {
                amount: total * 100,
                currency: "INR",
                receipt: "" + orderId
            };
            instance.orders.create(options, function (err, order) {
                if (err) {
                    console.log("error happemed ", err)
                } else {
                    resolve(order)
                }
            })
        })
    },

    verifyPayment: (paymentDetails) => {
        return new Promise((resolve, reject) => {
            const paymentId = paymentDetails.payment_id;
            const orderId = paymentDetails.order_id;
            const signature = paymentDetails.signature;
            const amount = paymentDetails.amount;

            const expectedSignature = crypto.createHmac('sha256', 'FzmPqfwFMBihPYceyGhefE3s')
                .update(`${orderId}|${paymentId}`)
                .digest('hex');

            console.log(expectedSignature, "  ", signature)
            if (expectedSignature === signature) {
                console.log("payment successfull")
                resolve({ status: "success", message: "Payment successfull" })
            } else {
                console.log("payment failed");
                resolve({ status: "fail", message: "Payment failed" })
            }
        })
    },

    placeOrder: (purchaseAddress) => {
        return new Promise(async (resolve, reject) => {
            const saveOrder = await client.db(collection.DATABASE).collection(collection.ORDER_COLLECTION).insertOne(purchaseAddress)
            if(saveOrder){
                resolve({status:"success"})
            }else{
                resolve({status:"fail"})
            }
        })
    }
}