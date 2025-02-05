const express = require('express');
const router = express.Router();
const { MongoClient, ServerApiVersion } = require('mongodb');
const mongoose = require('mongoose');
const Product = require('../models/product');
const order = require('../models/order');
const multer = require('multer');
const authMiddleware = require('../middleware/auth');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
})
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};


const upload = multer({
    //dest: 'uploads/'
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 10 // 10MB
    }
});


router.get('/', (req, res) => {
    Product.find()
    .select('category _id  name description price quantity ProductImg')
    .exec()
    .then(docs => {
        if(!order){
            return res.status(404).json({message: 'No product found with this ID'});
        }
        //console.log(docs);
        const format = {
            count : docs.length,
            products : docs.map(doc => {
                return {
                    _id: doc._id,
                    name: doc.name,
                    price: doc.price,
                    description: doc.description,
                    quantity: doc.quantity,
                    ProductImg: doc.ProductImg,
                    category: doc.category,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3012/products/' + doc._id
                    }
                };
                
            })
        }
        if (docs.length >= 0) {
        res.status(200).json(format);
        } else {
        res.status(404).json({message: 'Empty Products List'});
        }
     })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});
//craete a new product
router.post('/', authMiddleware, upload.single('ProductImg'), (req, res, next) => {
    console.log('Request body:', req.body);
    console.log('File:', req.file);

    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded or invalid file type' });
    }

    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        quantity: req.body.quantity,
        category: req.body.category,
        ProductImg: req.file.path
    });

    product.save()
        .then(result => {
            res.status(201).json({
                message: 'Product created successfully',
                newProduct: {
                    _id: result._id,
                    name: result.name,
                    price: result.price,
                    description: result.description,
                    quantity: result.quantity,
                    category: result.category,
                    ProductImg: result.ProductImg,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3012/products/' + result._id
                    }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err.message });
        });


    // res.status(201).json({
    //     message: 'YOU HAVE CREATED PRODUCT IN PRODUCT:',
    //     Product: product,
    // });
});
/**
 * Create a new product
 * {
    "name": "Logo T-shirt ",
    "price": "15.99",
    "description": "this is Printed T-shirt",
    "quantity": "5",
    "category": "Clothing"
}
 */

router.get('/:id', (req, res, next) => {
    const id = req.params.id;
    Product.findById(id)
            .select('category _id  name description price quantity ProductImg')
            .exec()
            .then(doc => {
               
                console.log('From DataBase: ', doc);
                if(doc){
                    res.status(200).json({
                        doc: doc,
                    Image: {
                        type: 'GET',
                        Image_url: 'http://localhost:3012/' + doc.ProductImg
                    }});
                }
                else{
                    res.status(404).json({message: 'No valid data for this ID'});
                } 
             })
            .catch(err => { console.log(err);
                 res.status(500).json({error: err})
             });
    // if (id == 'special') {
    //     res.status(200).json({
    //         message: 'YOU FOUND THE SPECIAL PRODUCT IN GET ',
    //         product_i: req.params.id,
    //     });
    // }
    // else {
    //     res.status(404).json({
    //         message: 'YOUR PRODUCT IS NOT FOUND in GET ',
    //         product_i: req.params.id,
    //     });
    // }
});

//IT IS FOR PATCH REQUEST
router.patch('/:id', (req, res,next) => {
        const id = req.params.id;
        const update_options = {};
        for (const options of req.body) {
            update_options[options.propName] = options.value;
        }
        Product.updateOne({ _id: id }, { $set: update_options }) // Use updateOne/updateMany/UPDATE
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({message: 'UPDATE (PATCH) PRODUCT: ', result});
         })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
         });

        // conection verification
        // res.status(200).json({
        //     message: 'UPDATE PRODUCT IN PATCH '
        // });
});

//IT IS FOR DELETE REQUEST
router.delete('/:id', authMiddleware, (req, res,next) => {
    const id = req.params.id;
    // Product.delete({_id: id})
    Product.deleteOne({ _id: id }) // Use deleteOne instead of delete
    .exec()
    .then(result => {
        console.log(result);
        res.status(200).json({message: 'Deleted Product with ID: ' + id});
     })
     .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
    // res.status(200).json({
    //     message: 'DELETE PRODUCT IN PATCH '
    // });
});

module.exports = router;
