const express = require("express")
const router = express.Router()
const cartController = require("../../controllers/cartController")
const authenticate = require("../../middleware/authenticate")

router.post('/add', authenticate, cartController.addToCart)
router.get('/addToCart',authenticate,cartController.getCartByUser);
router.delete('/remove',authenticate,cartController.removeFromCart)

module.exports = router;
