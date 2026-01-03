const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true
    },
    visas: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Visa'
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Country', countrySchema);
