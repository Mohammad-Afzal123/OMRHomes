import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Compare from './pages/Compare';
import NotFound from './pages/NotFound';
import NeighborhoodAnalysis from './pages/NeighborhoodAnalysis';
import AIInsights from './pages/AIInsights';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import RentalAgreement from './pages/RentalAgreement';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/ai-insights" element={<AIInsights />} />
        <Route path="/neighborhoods" element={<NeighborhoodAnalysis />} />
        <Route path="/rental-agreement" element={<RentalAgreement />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
