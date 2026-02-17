const Router = require('express')
const router = Router();


const {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    updateProductStock } = require('../controllers/products.controller')

const {
    createProductSchema,
    updateProductSchema,
    addStockSchema
} = require('../validations/productvalidation');

const validate = require("../middlewares/validate.middleware")

const verifyJwt = require("../middlewares/auth.middleware")
const rbacMiddleware = require("../middlewares/rbac.middleware");

router.use(verifyJwt, rbacMiddleware(['SHOPKEEPER']))

router.route('/createProduct').post(validate(createProductSchema), createProduct)
router.route('/getAllProducts').get(getAllProducts)
router.route('/getProductById/:id').get(getProductById)
router.route('/products/:id').put(validate(updateProductSchema), updateProduct)
router.route('/products/:id').delete(deleteProduct)
router.route('/stock-update/:id').patch(validate(addStockSchema), updateProductStock)

module.exports = router;