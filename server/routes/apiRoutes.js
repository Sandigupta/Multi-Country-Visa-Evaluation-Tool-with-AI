const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const partnerAuth = require('../middleware/authMiddleware');

const { getCountries } = require('../controllers/countryController');
const { getVisas } = require('../controllers/visaController');
const {
    getPartnerEvaluations,
    createPartner,
    getAllPartners,
    getPartnerLeadsAdmin
} = require('../controllers/partnerController');
const { submitEvaluation } = require('../controllers/evaluationController');

// Public Routes
router.get('/countries', getCountries);
router.get('/visas', getVisas);

// Evaluation Route (Multer middleware for file upload)
// Expects 'documents' field in form-data
router.post('/evaluate', upload.array('documents', 5), submitEvaluation);

// Partner Management Routes (Admin)
router.post('/partners', createPartner);
router.get('/partners', getAllPartners);
router.get('/partners/:id/leads', getPartnerLeadsAdmin);

// Partner Portal Routes (API Key Auth)
router.get('/partner/evaluations', partnerAuth, getPartnerEvaluations);

module.exports = router;
