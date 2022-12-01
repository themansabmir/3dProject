const router = require('express').Router()
const productCtrl = require('../controllers/productCtrl')


router.route('/products')
    .get(productCtrl.getProducts)
    .post(productCtrl.createProduct)


router.route('/products/:id')
    .put(productCtrl.updateProduct)
    .delete(productCtrl.deleteProduct)


module.exports = router

 