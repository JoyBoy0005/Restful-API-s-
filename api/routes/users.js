const express = require('express');
const router = express.Router();
const { MongoClient, ServerApiVersion } = require('mongodb');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

/**
 * To hash passwords based on email use node.bcrypt.js
 * to install package run this in terminal:
 * npm install bcrypt
 */
const bcrypt = require('bcrypt');

router.post('/signup', (req, res, next) => {
    User.findOne({
        email: req.body.email
    })
    .exec()
    .then(user => {
        if (user) {
            return res.status(409||422).json({ message: 'This Email already exists' });
        }else{
            bcrypt.hash(req.body.password, 12, (err, hash) => {
                if (err) {
                    res.status(500).json({error: err}); // Use next() for error handling
                }
                
                const user = new User({
                    _id: new mongoose.Types.ObjectId(),
                    email: req.body.email,
                    password: hash // Assign hashed password here
                });
        
                user
                .save()
                .then(result => {
                     console.log(result);
                     res.status(201).json({message: 'User created successfully'});
                 })
                 .catch(err => {
                     console.log(err);
                     res.status(500).json({error: err}); // Use next() for error handling
                 });
            });
        }

    });
});

router.delete('/:userId', (req, res) => {
    User.findByIdAndDelete(req.params.userId)
    .exec()
    .then(result => {
        if (result) {
            res.status(200).json({message: 'User deleted successfully'});
        } else {
            res.status(404).json({message: 'User not found'});
        }
     })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err}); // Use next() for error handling
     });
});
 

router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(401).json({ message: 'User doesn\'t exist' });
        }
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Authentication failed' });
        }
        /**
         * Token generated from JWT package
         * run this in Terminal
         * npm install jsonwebtoken --save
         */
        const token = jwt.sign(
            {
                email: user.email,
                userId: user._id
            },
            process.env.JWT_KEY,
            { expiresIn: '1h' }
        );
        return res.status(200).json({
            message: 'Auth successful',
            token: token
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});



module.exports = router;