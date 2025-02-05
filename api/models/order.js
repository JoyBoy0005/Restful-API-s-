const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true, // Fixed spelling of 'required'
    },
    customerName: { type: String, required: true }, // Add customerName to the schema
    quantity: { type: Number, default: 1, required: true } // Fixed spelling of 'required'
});

module.exports = mongoose.model('Order', orderSchema);
