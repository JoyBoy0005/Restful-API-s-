const mongoose = require('mongoose');
const { MongoClient, ServerApiVersion } = require('mongodb');
const productSchema = mongoose.Schema({
    _id:  mongoose.Schema.Types.ObjectId,
    name:{type:String , required:true} ,
    price: {type:Number, required:true},
    description:{type:String , required:true},
    quantity: {type:Number, required:true},
    category: {type: String, required:true},
    ProductImg: { type: String, required: true }
})

module.exports = mongoose.model('Product', productSchema);