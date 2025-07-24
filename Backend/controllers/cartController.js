const Cart = require(".././models/Cart")

// Add or update product in cart
exports.addToCart = async (req, resp) => {
    try {
        const { userId, productId, quantity } = req.body

        // check if already in cart
        let cartItem = await Cart.findOne({ userId, productId })

        if (cartItem) {
            cartItem.quantity += quantity
            await cartItem.save()
        } else {
            cartItem = new Cart({ userId, productId, quantity })
            await cartItem.save()
        }
        resp.status(200).json({ success: true, data: cartItem })

    } catch (error) {
        resp.status(500).json({ success: false, message: "server error", error })
    }
}

// Get all cart items for a user
exports.getCartByUser = async (req, resp) => {
    try {
        const  userId  = req.user.id;
        const cartItem = await Cart.find({ userId }).populate('productId')
        console.log(cartItem);

        resp.status(200).json({ success: true, data: cartItem })
    } catch (error) {
        console.log(error);

        resp.status(500).json({ success: false, message: "server error", error })

    }
}

// remove item from cart 
exports.removeFromCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.query;

        await Cart.findOneAndDelete({ userId, productId });

        res.status(200).json({ message: "Item removed from cart" });
    } catch (error) {
        console.log('Error', error);
        res.status(500).json({ message: "server error", error });


    }
}