const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/order'); // Import the Order model
const product = require('../models/product');
const authMiddleware = require('../middleware/auth');
const  orderController = require('../controllers/orders');




router.get('/', authMiddleware,orderController.orders_get_all());
// router.get('/', authMiddleware, (req, res) => {
//     Order.find() // Fetch all orders from the database
//         .select('_id customerName product quantity') // Select specific fields
//         .populate('product', 'name price') // Populate the product field with the product details
//         .exec()
//         .then(docs => {
//             const orderFormat = {
//                 count: docs.length,
//                 orders: docs.map(order => ({
//                     order_Id: order._id, // Rename _id to orderId in the response
//                     customerName: order.customerName,
//                     product_Id: order.product,
//                     quantity: order.quantity,
//                     request: {
//                         type: 'GET',
//                         url: 'http://localhost:3012/orders/' + order._id
//                     }
//                 }))
//             };
//             if (docs.length > 0) {
//                 res.status(200).json(orderFormat);
//             } else {
//                 res.status(404).json({ message: 'Empty Order List' });
//             }
//         })
//         .catch(err => {
//             console.error(err);
//             res.status(500).json({ error: err.message });
//         });
// });



router.post('/', authMiddleware, (req, res) => {
product.findById(req.params.id)
.then(product => {
    // if product is not found
    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }
    //if found create new order
    const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        customerName: req.body.customerName,
        product: req.body.product, // Use product as per the schema
        quantity: req.body.quantity
    });
return order
.save()
})
        .then(result => {
            res.status(201).json({
                message: 'ORDER WAS CREATED',
                createdOrder: {
                    orderId: result._id,
                    customerName: result.customerName,
                    productId: result.product, // Use product instead of productId
                    quantity: result.quantity
                }
            });
        })
        .catch(error => {
            res.status(500).json({
                error: error.message
            });
        });

    // const order = {
    //     orderId: req.body.orderId,
    //     customerName: req.body.customerName,
    //     //productName: req.body.productName,
    //     //quantity: req.body.quantity,
    //     price: req.body.price,
    //     //totalPrice: req.body.totalPrice,
    //     //orderDate: new Date(), // Added date to order object,
    // }

    // res.status(200).json({
    //     message: 'ORDER WAS CREATED: ',
    //     Order: order,
    // });
});
/**
 * Create a new order
 * {
    "customerName": "Prince Edward",
    "product": "677f3b7a628c54fbc731eda9",
    "quantity": "6"
}
 */

router.get('/:orderId', (req, res) => {
    const order_id = req.params.orderId;
    Order.findById(order_id)
    .select('_id customerName product quantity')
    .exec()
    .then(order => {
        if (order) {
            res.status(200).json({
                order : order,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3012/orders/' + order._id
                }
            });
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    })
    .catch(err => { console.log(err);
        res.status(500).json({error: err})
    });
    
});

router.delete('/:orderId', authMiddleware, (req, res , next) => {  
    const orderId = req.params.orderId;
    // Order.delete({_id: orderId});
    // Order.remove({_id: orderId});
    Order.deleteOne({ _id: orderId })
    .exec()
    .then(result => {
        console.log(result);
        res.status(200).json({ 
            message: 'Order deleted',
            request: {
                type: 'GET',
                url: 'http://localhost:3012/orders/',
                body: {
                    customerName: "name",
                    product: "product_Id",
                    quantity: "number",
                }
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            //error: err,
            message: 'Order not found'
        });
    });
    // res.status(200).json({
    //     message: 'ORDER WAS DELETED'+'<br>',
    //     orderId: req.params.orderId, // Corrected case sensitivity
    // });
});

module.exports = router;
