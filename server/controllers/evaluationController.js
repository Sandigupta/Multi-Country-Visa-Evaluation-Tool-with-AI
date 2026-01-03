const Submission = require('../models/Submission');
const Visa = require('../models/Visa');
const Country = require('../models/Country');
const ruleService = require('../services/ruleService');
const geminiService = require('../services/geminiService');

// @desc    Submit evaluation
// @route   POST /api/evaluate
// @access  Public
const submitEvaluation = async (req, res) => {
    try {
        let { name, email, country, visaType, context, partnerKey } = req.body;
        const documents = req.files || []; // Handle optional files

        // Check header for partner key if not in body (Support Lead Gen via API)
        if (!partnerKey && req.headers['x-api-key']) {
            partnerKey = req.headers['x-api-key'];
        }

        // 1. Validate Inputs (Basic)
        // Name is optional in the new UI flow, default it if missing
        const candidateName = name || (email ? email.split('@')[0] : 'Candidate');

        if (!email || !country || !visaType) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Fetch Visa config
        // Logic to find Visa ID from country/type names (simplified for now)
        // In a real app, frontend might send IDs. Here we look up by name.
        const countryDoc = await Country.findOne({ name: { $regex: new RegExp(`^${country}$`, 'i') } });
        if (!countryDoc) {
            return res.status(400).json({ message: 'Invalid Country' });
        }
        const visaDoc = await Visa.findOne({ country: countryDoc._id, visaType: { $regex: new RegExp(`^${visaType}$`, 'i') } });

        // If visa not found, use default/dummy config to proceed (or fail)
        const activeVisa = visaDoc || {
            visaType,
            mandatoryChecks: ['General Eligibility'],
            scoringFactors: ['Profile Completeness'],
            maxScoreCap: 100
        };


        // 2. Process Files (Extract metadata)
        const docMetadata = documents.map(doc => ({
            fileName: doc.originalname,
            fileType: doc.mimetype,
            fileSize: doc.size,
            path: doc.path
        }));

        const submissionData = {
            name: candidateName, email, country, visaType, context, documents: docMetadata
        };

        // 3. Run Evaluation Logic
        // A. Rule Engine
        const ruleScore = ruleService.calculateScore(submissionData, activeVisa);

        // B. AI Engine
        const aiResult = await geminiService.generateEvaluation(submissionData, activeVisa);

        // Merge/finalize result
        // We prefer AI score if available, otherwise fallback to Rule score
        const finalScore = aiResult.score || ruleScore;

        const evaluationResult = {
            score: finalScore,
            overallSummary: aiResult.overallSummary || "Evaluation complete.",
            criteria: aiResult.criteria || [], // This will be the dynamic list
            conclusion: aiResult.conclusion || ""
        };

        // 4. Save Submission
        const submission = await Submission.create({
            name: candidateName,
            email,
            country,
            visaType,
            context,
            documents: docMetadata,
            evaluationResult,
            partnerKey
        });

        res.status(201).json(evaluationResult);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    submitEvaluation
};

