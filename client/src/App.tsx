import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import VisaEvaluationForm from './components/visa-form/VisaEvaluationForm';
import PartnerListPage from './components/partners/PartnerListPage';
import PartnerDetailsPage from './components/partners/PartnerDetailsPage';
import EvaluationResultPage from './components/results/EvaluationResultPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><VisaEvaluationForm /></Layout>} />
        <Route path="/result" element={<Layout><EvaluationResultPage /></Layout>} />

        {/* Partner Dashboard Routes */}
        <Route path="/partners" element={<Layout><PartnerListPage /></Layout>} />
        <Route path="/partners/:id" element={<Layout><PartnerDetailsPage /></Layout>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
