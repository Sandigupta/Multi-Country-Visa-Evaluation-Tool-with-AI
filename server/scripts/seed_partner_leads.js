const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Submission = require('../models/Submission');
const connectDB = require('../config/db');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const TARGET_API_KEY = 'afab1f928a99e76470738bf34d6733f618061820c8031243';

const mockLeads = [
    {
        name: "Hans Muller",
        email: "hans.muller@example.com",
        country: "Germany",
        visaType: "Blue Card",
        partnerKey: TARGET_API_KEY,
        evaluationResult: {
            score: 85,
            overallSummary: "Excellent candidate with strong engineering background.",
            conclusion: "Likely to be approved.",
            criteria: []
        },
        createdAt: new Date() // Today
    },
    {
        name: "Sarah Jenkins",
        email: "sarah.j@example.ca",
        country: "Canada",
        visaType: "Express Entry",
        partnerKey: TARGET_API_KEY,
        evaluationResult: {
            score: 92,
            overallSummary: "Perfect fit for CRS points system.",
            conclusion: "Highly Recommended.",
            criteria: []
        },
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
    },
    {
        name: "Raj Patel",
        email: "raj.patel@tech.in",
        country: "United States",
        visaType: "O-1 Visa",
        partnerKey: TARGET_API_KEY,
        evaluationResult: {
            score: 65,
            overallSummary: "Meets some criteria but lacks awards recognition.",
            conclusion: "Needs improvement.",
            criteria: []
        },
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
    },
    {
        name: "Elena Petrov",
        email: "elena.p@design.ru",
        country: "Germany",
        visaType: "Freelance",
        partnerKey: TARGET_API_KEY,
        evaluationResult: {
            score: 78,
            overallSummary: "Strong portfolio, financial plan needs work.",
            conclusion: "Good potential.",
            criteria: []
        },
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) // 10 days ago
    },
    {
        name: "Liam O'Connor",
        email: "liam.oc@irishtech.ie",
        country: "Australia",
        visaType: "Global Talent",
        partnerKey: TARGET_API_KEY,
        evaluationResult: {
            score: 45,
            overallSummary: "Insufficient salary threshold for this visa class.",
            conclusion: "Not Recommended.",
            criteria: []
        },
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) // 15 days ago
    }
];

const seedData = async () => {
    try {
        await connectDB();
        console.log(`Connected to DB. Seeding ${mockLeads.length} leads for key: ${TARGET_API_KEY.substring(0, 10)}...`);

        await Submission.insertMany(mockLeads);

        console.log('✅ Mock data inserted successfully!');
        process.exit();
    } catch (error) {
        console.error('❌ Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
