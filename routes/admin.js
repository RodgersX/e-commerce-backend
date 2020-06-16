const express = require('express')
// validator package
const { body } = require('express-validator/check')

const adminController = require('../controllers/admin')
const isAuth = require('../middleware/is-auth')

const router = express.Router()

// /admin/add-product => GET
router.get('/add-product', isAuth, adminController.getAddProduct)

// admin/products => GET
router.get('/products', isAuth, adminController.getProducts)

// /admin/add-product => POST
router.post(
    '/add-product', 
    [
        body('title', 'The title must be more than 3 characters!').isString().isLength({ min: 3 }).trim(),
        body('imageUrl', 'Invlaid image URL').isURL(),
        body('price', 'The price should be in 0.00 format').isFloat(),
        body('description', 'Should be more than 5 characters').isLength({ min: 5, max: 400 }).trim()
    ], 
    isAuth, 
    adminController.postAddProduct)

router.get(
    '/edit-product/:productId', isAuth, adminController.getEditProduct)

router.post(
    '/edit-product', 
    [
        body('title', 'The title must be more than 3 characters!').isString().isLength({ min: 3 }).trim(),
        body('imageUrl', 'Invlaid image URL').isURL(),
        body('price', 'The price should be in 0.00 format').isFloat(),
        body('description', 'Should be more than 5 characters').isLength({ min: 5, max: 400 }).trim()
    ],
    isAuth, 
    adminController.postEditProduct)

router.post('/delete-product', isAuth, adminController.postDeleteProduct)

module.exports = router
