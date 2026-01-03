const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Partner = require('../models/Partner');
const connectDB = require('../config/db');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const TARGET_API_KEY = 'afab1f928a99e76470738bf34d6733f618061820c8031243';

const ensurePartner = async () => {
    try {
        await connectDB();

        let partner = await Partner.findOne({ apiKey: TARGET_API_KEY });
        if (partner) {
            console.log(`✅ Partner already exists: "${partner.name}"`);
        } else {
            console.log(`⚠️ Partner missing for key. Creating "Demo Partner"...`);
            partner = await Partner.create({
                name: "Demo Partner (Mock Data)",
                apiKey: TARGET_API_KEY,
                active: true
            });
            console.log(`✅ Created Partner: "${partner.name}"`);
        }

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

ensurePartner();
