const { response } = require('express');
var express = require('express');
const userHelpers = require('../helpers/user-helpers');
const adminHelpers = require('../helpers/admin-helpers')
var router = express.Router();
let cart = [];
/* GET users listing. */
router.get('/', function (req, res) {
  userHelpers.getLimitedProducts().then((products) => {
    res.render('user/index', { products, cart })
  })
});

router.get('/products', (req, res) => {
  userHelpers.getAllProducts().then((products) => {
    res.render('user/all-products', { products })
  })
});

router.get('/product-details', (req, res) => {
  const id = req.query.id
  userHelpers.singleProductDetails(id).then((productDetail) => {
    console.log(productDetail)
    let totalValue = productDetail.price
    res.render('user/single-products', { productDetail, totalValue })
  })
})




router.get('/add-to-cart', (req, res) => {

  const productId = req.query.id;
  userHelpers.addCart(productId).then((product) => {
    cart.push({
      id: productId,
      name: product.name,
      price: product.price,
      quantity: 1,
      description: product.description,
      image: product.image
    })
    res.redirect('/cart');
  })
})


router.get('/cart', (req, res) => {
  const totalValue = cart.reduce((accumulator, currentValue) => accumulator + currentValue.price, 0);
  // let totalValue = 5799
  let cartempty;
  if (cart.length <= 0) {
    cartempty = true
  }
  res.render('user/cart', { cart, cartempty, totalValue })
})

router.get('/remove-product', (req, res) => {
  let productId = req.query.cartId
  let index = cart.findIndex((element) => element.id === productId);
  console.log(index)
  cart.splice(index, 1);
  console.log(productId)
  console.log(cart)
  res.redirect('/cart');
})


router.get('/place-order', (req, res) => {
  console.log("place order get working")
  const totalValue = cart.reduce((accumulator, currentValue) => accumulator + currentValue.price, 0);
  console.log(req.query)

  res.render('user/place-order', { cart, totalValue })
})

router.get('/place-order-single', (req, res) => {
  console.log("place order get working")
  const productId = req.query.id
  const totalValue = req.query.totalValue
  userHelpers.singleProductDetails(productId).then((productDetails) => {
    res.render('user/place-order', { productDetails, totalValue })
  })
})

router.post('/place-order', (req, res) => {
  console.log("place order post working ", req.body)
  let date = new Date()
  const params = new URLSearchParams(req.body.formData);
  const totalAmount = params.get('totalValue')
  const orderId = 123456987
  const productArray = new URLSearchParams(req.body)
  const productIds = productArray.get('productIds')
  const prodArray = [productIds]
  const purchaseAddress = {
    email: params.get('email'),
    firstname: params.get('firstname'),
    lastname: params.get('lastname'),
    address: params.get('address'),
    city: params.get('city'),
    country: params.get('country'),
    region: params.get('region'),
    pincode: params.get('pincode'),
    phonenumber: params.get('phonenumber'),
    totalAmount: totalAmount,
    productsPurchace: prodArray,
    date: new Date(),
    month: date.getMonth()
  }
  console.log(prodArray)
  const saveOrder = userHelpers.placeOrder(purchaseAddress).then((saveStatus) => {
    if (saveStatus.status === 'success') {
      userHelpers.generateRazorpay(orderId, totalAmount).then((response) => {
        res.json({ response, razorSuccess: true })
      })
    }else{
      res.render('user/purchase-failed')
    }
  })
})


router.post('/verify_payment', (req, res) => {
  console.log("verify route working ", req.body)
  userHelpers.verifyPayment(req.body).then((response) => {
    console.log(response)
    if (response.status === 'success') {
      console.log("response success")
      res.json("success");
    }

  })
})


router.get('/order-success', (req, res) => {
  res.render('user/thank-you')
})


router.get('/order-failed', (req, res) => {
  res.render('user/purchase-failed');
})


router.get('/blog', (req, res) => {
  res.render('user/blog')
})


router.get('/all-products', (req, res) => {
  adminHelpers.getAllProducts().then((products) => {
    if (!req.session.admin) {
      res.render('admin/admin-login', { admin: true })
    } else {
      res.render('admin/all-products', { products, admin: true })
    }
  })
})


router.get('/add-product', (req, res) => {
  if (!req.session.admin) {
    res.render('admin/admin-login', { admin: true })
  } else {
    res.render('admin/add-product', { admin: true })
  }
})


router.post('/add-product', (req, res) => {
  let image1 = req.files.image1
  adminHelpers.addProduct(req.body).then((response) => {
    console.log("response is ", response, image1)
    image1.mv('./public/product-images/' + response.insertedId + '.jpg', (err, done) => {
      if (!err) {
        res.redirect('/add-product')
      } else {
        console.log(err)
      }
    })
  })
})

router.get('/delete-product', (req, res) => {
  const productId = req.query.id
  console.log(productId)
  adminHelpers.removeProduct(productId).then((response) => {
    res.redirect('/all-products')
  })
})

router.get('/contact-us',(req,res)=>{
  res.render('user/contact')
})

router.get('/sales-report',async(req,res)=>{
  let salesReport = await adminHelpers.salesReport()
  res.render('admin/sales-report',{admin:true,salesReport})
})

module.exports = router;
