var express = require('express');
var router = express.Router();
const adminHelpers = require("../helpers/admin-helpers")


// router.get('/dashboard',checkAdminLoggedIn,(req,res)=>{
//   res.render('admin/dashboard');
// })


function checkAdminLoggedIn(req, res, next) {
  if (!req.session.admin) { // If admin is not logged in
    console.log("no admin")
    res.render("admin/admin-login", { admin: true })
  } else {
    res.redirect('/dashboard')
  }
  next(); // Call next function if admin is logged in
}

router.get('/', async (req, res) => {
  if (!req.session.admin) {
    res.render('admin/admin-login', { admin: true })
  } else {
    let jan = await adminHelpers.getOrderMonthJan()
    let feb = await adminHelpers.getOrderMonthFeb()
    let march = await adminHelpers.getOrderMonthMarch()
    let april = await adminHelpers.getOrderMonthApril()
    let may = await adminHelpers.getOrderMonthMay()
    let june = await adminHelpers.getOrderMonthJune()
    let july = await adminHelpers.getOrderMonthJuly()
    let aug = await adminHelpers.getOrderMonthAug()
    let sept = await adminHelpers.getOrderMonthSept()
    let oct = await adminHelpers.getOrderMonthOct()
    let nov = await adminHelpers.getOrderMonthNov()
    let des = await adminHelpers.getOrderMonthDes()
    let totalOrders = await adminHelpers.getTotalOrders()
    let totalAmount = await adminHelpers.getTotalSalesAmount()
    let totalAmountSum ;
    // if(totalAmount){
    //   totalAmountSum = totalAmount[0].total
    // }
    let totalProducts = await adminHelpers.getTotalProductsCount()
    res.render('admin/dashboard', { admin: true ,jan,feb,march,april,may,june,july,aug,sept,oct,nov,des,totalOrders,totalAmountSum ,totalProducts})
  }
  console.log("hai")
})


router.get('/all-products', (req, res) => {
  adminHelpers.getAllProducts().then((products) => {
    res.render('admin/all-products', { admin: true })
  })
})


router.get('/login', (req, res) => {
  res.render("admin/admin-login", { admin: true })
});

router.post('/login', (req, res) => {
  const originalId = 'gagan'
  const originalPassword = '12345'
  console.log(req.body)
  const username = req.body.username
  const password = req.body.password

  if (username === originalId && password === originalPassword) {
    console.log("admin login successfull")
    req.session.admin = true
    res.redirect('/admin')
  } else {
    console.log("login failed")
  }
})



module.exports = router;
