const Partner = require('../models/Partner');

const partnerAuth = async (req, res, next) => {
    const apiKey = req.header('x-api-key');

    if (!apiKey) {
        return res.status(401).json({ message: 'No API key, authorization denied' });
    }

    try {
        const partner = await Partner.findOne({ apiKey, active: true });

        if (!partner) {
            return res.status(401).json({ message: 'Invalid or inactive API key' });
        }

        req.partner = partner;
        next();
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = partnerAuth;
