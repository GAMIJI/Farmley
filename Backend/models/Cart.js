const mongoose  = require("mongoose")

const cartSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"user",
        require:true
    },
    productId:{
        type: mongoose.Schema.Types.ObjectId,
        ref :"Product",
        require: true
    },
    quantity : {
        type : Number,
        require: true,
        default : 1,
        min : 1
    }
},{timestamps:true})

module.exports = mongoose.model("Cart",cartSchema)
