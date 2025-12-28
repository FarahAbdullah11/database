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
