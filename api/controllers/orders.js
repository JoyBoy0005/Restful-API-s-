
const Order = require('../models/order'); // Import the Order model
const authMiddleware = require('../middleware/auth');

exports.orders_get_all = (req, res, next) => {
    Order.find() // Fetch all orders from the database
        .select('_id customerName product quantity') // Select specific fields
        .populate('product', 'name price') // Populate the product field with the product details
        .exec()
        .then(docs => {
            const orderFormat = {
                count: docs.length,
                orders: docs.map(order => ({
                    order_Id: order._id, // Rename _id to orderId in the response
                    customerName: order.customerName,
                    product_Id: order.product,
                    quantity: order.quantity,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3012/orders/' + order._id
                    }
                }))
            };
            if (docs.length > 0) {
                res.status(200).json(orderFormat);
            } else {
                res.status(404).json({ message: 'Empty Order List' });
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: err.message });
        });
    }