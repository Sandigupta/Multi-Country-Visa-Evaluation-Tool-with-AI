const mongoose = require('mongoose');

const visaSchema = new mongoose.Schema({
    country: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country',
        required: true
    },
    visaType: {
        type: String,
        required: true
    },
    requiredDocuments: [{
        type: String
    }],
    mandatoryChecks: [{
        type: String
    }],
    scoringFactors: [{
        type: String
    }],
    maxScoreCap: {
        type: Number,
        default: 100
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Visa', visaSchema);
