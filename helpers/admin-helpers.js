const client = require("../config/connection")
const collection = require("../config/collections")
let objectId = require('mongodb').ObjectId


module.exports = {
    addProduct: (data) => {
        return new Promise(async (resolve, reject) => {
            const productData = {
                name: data.name,
                price: data.price,
                oldprice: data.oldprice,
                description: data.description,
                stock: data.stock,

                date: Date.now()
            }

            const Add = await client.db(collection.DATABASE).collection(collection.PRODUCT_COLLECTION).insertOne(productData)
            console.log(Add)
            resolve(Add)
        })
    },

    getAllProducts: () => {
        return new Promise(async (resolve, reject) => {
            const products = await client.db(collection.DATABASE).collection(collection.PRODUCT_COLLECTION).find().toArray()
            resolve(products)
        })
    },

    removeProduct: (productId) => {
        return new Promise(async (resolve, reject) => {
            const remove = await client.db(collection.DATABASE).collection(collection.PRODUCT_COLLECTION).deleteOne({ _id: new objectId(productId) })
            resolve(remove)
        })
    },


    //January
    getOrderMonthJan: () => {
        return new Promise((resolve, reject) => {
            let jan = client.db(collection.DATABASE).collection(collection.ORDER_COLLECTION).find({ month: 0 }).count()
            resolve(jan);
        })
    },
    //February
    getOrderMonthFeb: () => {
        return new Promise((resolve, reject) => {
            let feb = client.db(collection.DATABASE).collection(collection.ORDER_COLLECTION).find({ month: 1 }).count()
            resolve(feb);
        })
    },
    //March
    getOrderMonthMarch: () => {
        return new Promise((resolve, reject) => {
            let march = client.db(collection.DATABASE).collection(collection.ORDER_COLLECTION).find({ month: 2 }).count()
            resolve(march);
        })
    },
    //April
    getOrderMonthApril: () => {
        return new Promise((resolve, reject) => {
            let april = client.db(collection.DATABASE).collection(collection.ORDER_COLLECTION).find({ month: 3 }).count()
            resolve(april);
        })
    },
    //May
    getOrderMonthMay: () => {
        return new Promise((resolve, reject) => {
            let may = client.db(collection.DATABASE).collection(collection.ORDER_COLLECTION).find({ month: 4 }).count()
            resolve(may);
        })
    },
    //June
    getOrderMonthJune: () => {
        return new Promise((resolve, reject) => {
            let june = client.db(collection.DATABASE).collection(collection.ORDER_COLLECTION).find({ month: 5 }).count()
            resolve(june);
        })
    },
    //July
    getOrderMonthJuly: () => {
        return new Promise((resolve, reject) => {
            let july = client.db(collection.DATABASE).collection(collection.ORDER_COLLECTION).find({ month: 6 }).count()
            resolve(july);
        })
    },
    //August
    getOrderMonthAug: () => {
        return new Promise((resolve, reject) => {
            let aug = client.db(collection.DATABASE).collection(collection.ORDER_COLLECTION).find({ month: 7 }).count()
            resolve(aug);
        })
    },
    //September
    getOrderMonthSept: () => {
        return new Promise((resolve, reject) => {
            let sept = client.db(collection.DATABASE).collection(collection.ORDER_COLLECTION).find({ month: 8 }).count()
            resolve(sept);
        })
    },
    //October
    getOrderMonthOct: () => {
        return new Promise((resolve, reject) => {
            let oct = client.db(collection.DATABASE).collection(collection.ORDER_COLLECTION).find({ month: 9 }).count()
            resolve(oct);
        })
    },
    //November
    getOrderMonthNov: () => {
        return new Promise((resolve, reject) => {
            let nov = client.db(collection.DATABASE).collection(collection.ORDER_COLLECTION).find({ month: 10 }).count()
            resolve(nov);
        })
    },
    //Desember
    getOrderMonthDes: () => {
        return new Promise((resolve, reject) => {
            let des = client.db(collection.DATABASE).collection(collection.ORDER_COLLECTION).find({ month: 11 }).count()
            resolve(des);
        })
    },


    getTotalOrders: () => {
        return new Promise((resolve, reject) => {
            let totalOrders = client.db(collection.DATABASE).collection(collection.ORDER_COLLECTION).find().count()
            resolve(totalOrders)
        })
    },

    //Total Sales Amount
    getTotalSalesAmount: () => {
        return new Promise(async (resolve, reject) => {
            let totalAmount = await client.db(collection.DATABASE).collection(collection.ORDER_COLLECTION).aggregate([{
                $group: {
                    _id: null,
                    total: { $sum: { $toDouble: "$totalAmount" } }
                }
            }]).toArray()
            console.log(totalAmount)
            resolve(totalAmount)
        })
    },

    //Total Products
    getTotalProductsCount: () => {
        return new Promise(async(resolve, reject) => {
            let totalProducts = await client.db(collection.DATABASE).collection(collection.PRODUCT_COLLECTION).find().count()
            resolve(totalProducts)
        })
    },

    salesReport:()=>{
        return new Promise(async(resolve,reject)=>{
            let salesReport = await client.db(collection.DATABASE).collection(collection.ORDER_COLLECTION).find().toArray()
            resolve(salesReport)
        })
    }
}