const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    visaType: {
        type: String,
        required: true
    },
    context: {
        type: String
    },
    documents: [{
        fileName: String,
        fileType: String,
        fileSize: Number
    }],
    evaluationResult: {
        score: Number,
        overallSummary: String,
        criteria: [{
            id: String,
            title: String,
            status: String,
            score: Number,
            description: String,
            scoreExplanation: String,
            supportingMaterial: [String],
            improvementNeeded: [String],
            recommendations: [String]
        }],
        conclusion: String
    },
    partnerKey: {
        type: String,
        index: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Submission', submissionSchema);
