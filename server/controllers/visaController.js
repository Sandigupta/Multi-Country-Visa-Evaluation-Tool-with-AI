const Visa = require('../models/Visa');
const Country = require('../models/Country');

// @desc    Get visas by country
// @route   GET /api/visas
// @access  Public
const getVisas = async (req, res) => {
    try {
        const { country } = req.query;

        if (!country) {
            return res.status(400).json({ message: 'Country query parameter is required' });
        }

        // Find country first to get ID
        // We assume the query param is the country name (e.g. "Germany") or code
        let countryDoc = await Country.findOne({
            $or: [
                { name: { $regex: new RegExp(`^${country}$`, 'i') } },
                { code: { $regex: new RegExp(`^${country}$`, 'i') } }
            ]
        });

        if (!countryDoc) {
            return res.status(404).json({ message: 'Country not found' });
        }

        const visas = await Visa.find({ country: countryDoc._id });
        res.json(visas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getVisas
};
