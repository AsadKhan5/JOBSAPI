const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a Valid name'],
        maxlength: 20,
        minlength: 3,
    },
    email: {
        type: String,
        required: [true, 'Please provide Email'],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email',
        ],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide a Valid Password'],
        minlength: 6,
    },
})

UserSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next();
})
// creating JWT 
UserSchema.methods.createJWT = function () {
    return jwt.sign({ userId: this._id, name: this.name }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFE})
}
// compare Password 
UserSchema.methods.comparePassword = async function (typedPassword) {
    const isMatch =  bcrypt.compare(typedPassword, this.password)
    return isMatch
}

module.exports = mongoose.model('User', UserSchema);