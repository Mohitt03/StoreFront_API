const Router = require('express')
const router = Router();

const verifyJwt = require("../middlewares/auth.middleware")
const rbacMiddleware = require("../middlewares/rbac.middleware")

const {
    createOrder,
    getOrders,
    getOrderById,
    completeOrder,
} = require('../controllers/orders.controller')

router.use(verifyJwt)

router.route('/orders').post(rbacMiddleware(["CUSTOMER"]), createOrder)
router.route('/orders').get(getOrders)
router.route('/orders/:id').get(getOrderById)
router.route('/products/:id').patch(rbacMiddleware(["SHOPKEEPER"]), completeOrder)

module.exports = router;