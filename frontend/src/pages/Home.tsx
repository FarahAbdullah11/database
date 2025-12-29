import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home: React.FC = () => {
  return (
    <div className="home-page">
      <h2 className="mb-4">Hospital Management System</h2>

      <div className="row home-cards-connected">

        {/* ================= PATIENTS ================= */}
        <div className="col-md-3">
          <div className="card text-white bg-primary">
            <div className="card-body">
              <h5 className="card-title"><i className="bi bi-people"></i> Patients</h5>
              <p className="card-text">Manage patient records and information</p>

              <div className="d-grid gap-2">
                <Link to="/patients/add" className="btn btn-light">Add</Link>
                <Link to="/patients" className="btn btn-light">Update</Link>
              </div>
            </div>
          </div>
        </div>

        {/* ================= DOCTORS ================= */}
        <div className="col-md-3">
          <div className="card text-white bg-secondary">
            <div className="card-body">
              <h5 className="card-title"><i className="bi bi-person-badge"></i> Doctors</h5>
              <p className="card-text">View doctor information and specialties</p>

              <div className="d-grid gap-2">
                <Link to="/doctors" className="btn btn-light">View Doctors</Link>
              </div>
            </div>
          </div>
        </div>

        {/* ================= APPOINTMENTS ================= */}
        <div className="col-md-3">
          <div className="card text-white" style={{ backgroundColor: '#17a2b8' }}>
            <div className="card-body">
              <h5 className="card-title"><i className="bi bi-calendar-check"></i> Appointments</h5>
              <p className="card-text">Schedule and manage appointments</p>

              <div className="d-grid gap-2">
                <Link to="/appointments/new" className="btn btn-light">New</Link>
                <Link to="/appointments" className="btn btn-light">View All</Link>
              </div>
            </div>
          </div>
        </div>

        {/* ================= ADMISSIONS ================= */}
        <div className="col-md-3">
          <div className="card text-white bg-info">
            <div className="card-body">
              <h5 className="card-title"><i className="bi bi-door-open"></i> Admissions</h5>
              <p className="card-text">Manage patient admissions and rooms</p>

              <div className="d-grid gap-2">
                <Link to="/admissions/new" className="btn btn-light">Add</Link>
                <Link to="/admissions" className="btn btn-light">Delete</Link>
              </div>
            </div>
          </div>
        </div>

        {/* ================= BILLING ================= */}
        <div className="col-md-3">
          <div className="card text-white bg-warning">
            <div className="card-body">
              <h5 className="card-title"><i className="bi bi-receipt"></i> Billing</h5>
              <p className="card-text">Manage patient bills and payments</p>

              <div className="d-grid gap-2">
                <Link to="/billing" className="btn btn-light">View Bills</Link>
              </div>
            </div>
          </div>
        </div>

        {/* ================= REPORTS ================= */}
        <div className="col-md-3">
          <div className="card text-white bg-success">
            <div className="card-body">
              <h5 className="card-title"><i className="bi bi-geo-alt"></i> Reports</h5>
              <p className="card-text">Find nearest hospital with available doctors</p>
              <div className="d-grid gap-2">
                <Link to="/reports/nearest-hospital" className="btn btn-light">Generate Report</Link>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Home;
