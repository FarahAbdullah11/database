import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import PatientList from './pages/patients/PatientList';
import PatientAdd from './pages/patients/PatientAdd';
import PatientEdit from './pages/patients/PatientEdit';
import DoctorList from './pages/doctors/DoctorList';
import AdmissionList from './pages/admissions/AdmissionList';
import AdmissionAdd from './pages/admissions/AdmissionAdd';
import BillingList from './pages/billing/BillingList';
import BillingGenerate from './pages/billing/BillingGenerate';
import BillingPatient from './pages/billing/BillingPatient';
import ReportNearestHospital from './pages/reports/ReportNearestHospital';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="container-fluid mt-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/patients" element={<PatientList />} />
            <Route path="/patients/add" element={<PatientAdd />} />
            <Route path="/patients/:id/edit" element={<PatientEdit />} />
            <Route path="/doctors" element={<DoctorList />} />
            <Route path="/admissions" element={<AdmissionList />} />
            <Route path="/admissions/new" element={<AdmissionAdd />} />
            <Route path="/billing" element={<BillingList />} />
            <Route path="/billing/generate/:patientId" element={<BillingGenerate />} />
            <Route path="/billing/patient/:patientId" element={<BillingPatient />} />
            <Route path="/reports/nearest-hospital" element={<ReportNearestHospital />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;

