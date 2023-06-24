const mongoose = require('mongoose');


const jobsSchema = new mongoose.Schema({
    company: {
        type: String,
        maxlength: 50,
        required: [true, "Please provide a company name."]
    },
    position: {
        type: String,
        maxlength: 100,
        required: [true, "Please provide a company tittle."]
    },
    status: {
        type: String,
        enum: ['interview', 'diclined', 'pending'],
        default: 'pending',
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide user ID']
    },
},
    { timestamps: true })


module.exports = mongoose.model('Jobs', jobsSchema)    