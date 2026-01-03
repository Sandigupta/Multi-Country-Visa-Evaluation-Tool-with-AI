const crypto = require('crypto');
const Partner = require('../models/Partner');
const Submission = require('../models/Submission');

// @desc    Create a new partner
// @route   POST /api/partners
// @access  Public (Admin)
const createPartner = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ message: 'Name is required' });

        // Generate secure random API key
        const apiKey = crypto.randomBytes(24).toString('hex');

        const partner = await Partner.create({ name, apiKey });
        res.status(201).json(partner);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all partners with lead count
// @route   GET /api/partners
// @access  Public (Admin)
const getAllPartners = async (req, res) => {
    try {
        // We want to list partners AND how many leads they brought
        // Simple aggregation
        const partners = await Partner.find().sort({ createdAt: -1 });

        // For each partner, count submissions. 
        // Note: For high scale, use aggregation pipeline or counter cache. For now, Promise.all is fine.
        const partnersWithCounts = await Promise.all(partners.map(async (p) => {
            const count = await Submission.countDocuments({ partnerKey: p.apiKey });
            return {
                ...p.toObject(),
                leadCount: count
            };
        }));

        res.json(partnersWithCounts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get leads for a specific partner (Admin View)
// @route   GET /api/partners/:id/leads
// @access  Public (Admin)
const getPartnerLeadsAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const partner = await Partner.findById(id);

        if (!partner) return res.status(404).json({ message: 'Partner not found' });

        // Filters
        const { country, search } = req.query;
        let query = { partnerKey: partner.apiKey };

        // Strict Country Filter (Dropdown)
        if (country && country !== 'All') {
            query.country = country;
        }

        // Universal Search (Input)
        if (search) {
            const searchRegex = new RegExp(search, 'i');
            query.$or = [
                { name: searchRegex },
                { email: searchRegex },
                { visaType: searchRegex },
                { country: searchRegex }
                // Note: Searching dates or scores via string regex is harder in Mongo 
                // without aggregation. For MVP, text fields are sufficient.
            ];
        }
        const leads = await Submission.find(query)
            .select('-documents -__v')
            .sort({ createdAt: -1 });

        res.json({ partner, leads });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get evaluations for a partner (Partner Portal Access)
// @route   GET /api/partner/evaluations
// @access  Private (Partner Key)
const getPartnerEvaluations = async (req, res) => {
    try {
        const partnerKey = req.partner.apiKey;
        const evaluations = await Submission.find({ partnerKey })
            .select('-documents -__v')
            .sort({ createdAt: -1 });
        res.json(evaluations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createPartner,
    getAllPartners,
    getPartnerLeadsAdmin,
    getPartnerEvaluations
};
