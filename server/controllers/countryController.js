const Country = require('../models/Country');

// @desc    Get all countries
// @route   GET /api/countries
// @access  Public
const getCountries = async (req, res) => {
    try {
        const countries = await Country.find({}).select('name code');
        res.json(countries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getCountries
};
