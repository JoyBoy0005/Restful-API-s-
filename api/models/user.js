const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/
    },

    password: {
        type: String,
        required: true
    },

    // isActive: {
    //     type: Boolean,
    //     default: true
    // },
    // roles: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Role'
    // }]
})

module.exports = mongoose.model('User', userSchema);