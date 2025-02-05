const express = require('express');
const app = express();
//import mongoose = require('mongoose');
const mongoose = require('mongoose');
const { MongoClient, ServerApiVersion } = require('mongodb');
// Connect to MongoDB

//To fix the DepricationWanring problem
// mongoose.Promise = global.Promise;

require('dotenv').config(); // Load environment variables
const username = process.env.MONGO_USERNAME;
const password = encodeURIComponent(process.env.MONGO_PASSWORD);
const cluster = process.env.MONGO_CLUSTER;
const database = process.env.MONGO_DATABASE;
const uri = `mongodb+srv://${username}:${password}@${cluster}/${database}?retryWrites=true&w=majority`;


mongoose.connect(uri)
    .then(() => console.log('Connected to MongoDB successfully'))
    .catch(err => console.error('MongoDB connection error:', err.message));

// Import morgan for logging HTTP requests and responses
const morgan = require('morgan');
const bodyParse = require('body-parser');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/users');

// Middleware (e.g., body parser, etc...)

// Morgan middleware to log HTTP requests and responses. 'dev' option logs in a format similar to Apache combined log file.
app.use(morgan('dev'));
app.use(express.json());
// Bodyparser middleware to parse JSON and URL-encoded request bodies.
app.use(bodyParse.urlencoded({ extended: true }));
app.use(bodyParse.json());

//to make folder static or public use

app.use('/uploads',express.static('uploads'));
///uploads -> ignore upload string in image path
// Access middleware
app.use((req, res, next) => {
    res.header('Content-Control-Allow-Origin', '*');
    //res.header('Content-Type-Allow-Origin', 'specific http url');
    res.header('Access-Control-Allow-Headers', 
                        'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if(res.method === 'OPTIONS') {
    res.header('Content-Type-Allow-Methods',
                     'GET, POST, PUT, DELETE, OPTIONS');
    return res.status(200).json({});
    }
    next();
    });

// Routes
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);


app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error,req, res, next) => {
    res.status(error.status || 500);
    res.json({ Error:{
        message: error.message
    }
});
});
// Example route
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Welcome to the server PORT: 3012 !' });
});

// Export the app
module.exports = app;
