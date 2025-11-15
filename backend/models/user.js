const mongoose = require('mongoose');
const { create } = require('./resena');

const userSchema = new mongoose.Schema({
    name: {
    type: String,
    required: true,
    trim: true
    },

  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
    },
    email: {
    type: String,
    required: true,
    unique: true,
    },
    password: {
    type: String, 
    required: true,
    },
    createdAt: {
    type: Date,
    default: Date.now
    }
    },
 );
    
module.exports = mongoose.model('User', userSchema);