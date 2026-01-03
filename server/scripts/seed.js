const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Country = require('../models/Country');
const Visa = require('../models/Visa');
const Partner = require('../models/Partner');
const connectDB = require('../config/db');

dotenv.config();
connectDB();

const importData = async () => {
    try {
        await Country.deleteMany();
        await Visa.deleteMany();
        await Partner.deleteMany();

        // 1. Create Countries
        const countryData = [
            { name: 'Germany', code: 'DE' },
            { name: 'Canada', code: 'CA' }, // Maintained existing
            { name: 'United Kingdom', code: 'UK' }, // Maintained existing
            { name: 'United States', code: 'US' },
            { name: 'Ireland', code: 'IE' },
            { name: 'France', code: 'FR' },
            { name: 'Netherlands', code: 'NL' },
            { name: 'Poland', code: 'PL' },
            { name: 'Australia', code: 'AU' }
        ];
        const countries = await Country.insertMany(countryData);

        // Helper to find ID
        const getId = (name) => countries.find(c => c.name === name)._id;

        // 2. Create Visas (Mapping Frontend VISA_OPTIONS)
        const visas = [
            // United States
            ...["H-1B", "O-1A", "O-1B", "L-1A", "L-1B", "EB-1A", "EB-2 NIW"].map(v => ({
                country: getId('United States'), visaType: v,
                requiredDocuments: ['Passport', 'Resume'], mandatoryChecks: ['Eligibility'], scoringFactors: ['Profile'], maxScoreCap: 100
            })),
            // Germany (Expanded)
            { country: getId('Germany'), visaType: 'EU Blue Card', requiredDocuments: ['Degree', 'Offer'], mandatoryChecks: ['Salary'], scoringFactors: ['Education'], maxScoreCap: 100 },
            { country: getId('Germany'), visaType: 'ICT Permit', requiredDocuments: ['Transfer Letter'], mandatoryChecks: ['Tenure'], scoringFactors: ['Experience'], maxScoreCap: 100 },
            { country: getId('Germany'), visaType: 'Freelance Visa', requiredDocuments: ['Portfolio'], mandatoryChecks: ['Economic Interest'], scoringFactors: ['Business Plan'], maxScoreCap: 100 },
            // Ireland
            { country: getId('Ireland'), visaType: 'Critical Skills Employment Permit', requiredDocuments: ['Offer Letter'], mandatoryChecks: ['Salary'], scoringFactors: ['Skill Shortage'], maxScoreCap: 100 },
            { country: getId('Ireland'), visaType: 'General Employment Permit', requiredDocuments: ['Offer Letter'], mandatoryChecks: ['Labor Market Test'], scoringFactors: ['General'], maxScoreCap: 100 },
            // France
            { country: getId('France'), visaType: 'Talent Passport', requiredDocuments: ['Master Degree'], mandatoryChecks: ['Investment/Innovation'], scoringFactors: ['Prestige'], maxScoreCap: 100 },
            { country: getId('France'), visaType: 'Salarie en Mission', requiredDocuments: ['Assignment Letter'], mandatoryChecks: ['Salary'], scoringFactors: ['Experience'], maxScoreCap: 100 },
            // Netherlands
            { country: getId('Netherlands'), visaType: 'Knowledge Migrant Permit (HSM)', requiredDocuments: ['Sponsorship'], mandatoryChecks: ['Salary Threshold'], scoringFactors: ['Age', 'Salary'], maxScoreCap: 100 },
            // Poland
            { country: getId('Poland'), visaType: 'Work Permit Type C', requiredDocuments: ['Assignment Letter'], mandatoryChecks: ['Posting'], scoringFactors: ['Duration'], maxScoreCap: 100 },
            { country: getId('Poland'), visaType: 'EU Blue Card', requiredDocuments: ['Degree', 'Contract'], mandatoryChecks: ['Salary'], scoringFactors: ['Qualification'], maxScoreCap: 100 },
            // Australia
            { country: getId('Australia'), visaType: 'Global Talent Visa (858)', requiredDocuments: ['Nomination'], mandatoryChecks: ['Achievement'], scoringFactors: ['Prominence'], maxScoreCap: 100 },
            { country: getId('Australia'), visaType: 'TSS (482)', requiredDocuments: ['Sponsorship'], mandatoryChecks: ['Occupation List'], scoringFactors: ['Experience'], maxScoreCap: 100 },
        ];

        await Visa.insertMany(visas);

        await Partner.create({
            name: 'Visa Agency A',
            apiKey: 'partner123'
        });

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();
