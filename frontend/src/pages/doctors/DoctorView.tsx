import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doctorsAPI } from '../../services/api';
import './DoctorView.css';

interface Doctor {
  DoctorID: number;
  FullName: string;
  Specialty?: string;
  PhoneNumber?: string;
  DepartmentName?: string;
}

interface Patient {
  PatientID: number;
  FullName: string;
  Age?: number;
  Diseases?: string;
  PhoneNumber?: string;
}

interface Hospital {
  HospitalID: number;
  Name: string;
  City?: string;
  Address?: string;
}

const DoctorView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchDoctor(parseInt(id));
    }
  }, [id]);

  const fetchDoctor = async (doctorId: number) => {
    try {
      setLoading(true);
      const response = await doctorsAPI.getById(doctorId);
      if (response.data.success) {
        const data = response.data.data;
        setDoctor(data.doctor);
        setPatients(data.patients || []);
        setHospitals(data.hospitals || []);
      } else {
        setError('Failed to fetch doctor');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error fetching doctor');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!doctor) return <div className="error">Doctor not found</div>;

  return (
    <div className="doctor-view">
      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header bg-success text-white">
              <h4><i className="bi bi-person-badge"></i> Doctor Information</h4>
            </div>
            <div className="card-body">
              <div className="row mb-3">
                <div className="col-md-6"><strong>Doctor ID:</strong> {doctor.DoctorID}</div>
                <div className="col-md-6"><strong>Full Name:</strong> {doctor.FullName}</div>
              </div>
              <div className="row mb-3">
                <div className="col-md-6">
                  <strong>Specialty:</strong>{' '}
                  <span className="badge bg-primary">{doctor.Specialty || 'N/A'}</span>
                </div>
                <div className="col-md-6"><strong>Department:</strong> {doctor.DepartmentName || 'N/A'}</div>
              </div>
              <div className="row mb-3">
                <div className="col-md-6"><strong>Phone:</strong> {doctor.PhoneNumber || 'N/A'}</div>
              </div>
            </div>
          </div>

          {hospitals.length > 0 && (
            <div className="card mt-3">
              <div className="card-header bg-info text-white">
                <h5><i className="bi bi-hospital"></i> Hospitals</h5>
              </div>
              <div className="card-body">
                <ul className="list-group">
                  {hospitals.map((hospital) => (
                    <li key={hospital.HospitalID} className="list-group-item">
                      <strong>{hospital.Name}</strong> - {hospital.City || hospital.Address || 'N/A'}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {patients.length > 0 ? (
            <div className="card mt-3">
              <div className="card-header bg-primary text-white">
                <h5><i className="bi bi-people"></i> Patients Treated ({patients.length})</h5>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Patient ID</th>
                        <th>Name</th>
                        <th>Age</th>
                        <th>Disease</th>
                        <th>Phone</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {patients.map((patient) => (
                        <tr key={patient.PatientID}>
                          <td>{patient.PatientID}</td>
                          <td>{patient.FullName}</td>
                          <td>{patient.Age || 'N/A'}</td>
                          <td>{patient.Diseases || 'N/A'}</td>
                          <td>{patient.PhoneNumber || 'N/A'}</td>
                          <td>
                            <Link
                              to={`/patients/${patient.PatientID}`}
                              className="btn btn-sm btn-info"
                            >
                              View
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="card mt-3">
              <div className="card-body">
                <p className="text-muted">No patients assigned to this doctor.</p>
              </div>
            </div>
          )}
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-header bg-warning">
              <h5>Quick Actions</h5>
            </div>
            <div className="card-body">
              <Link to="/doctors" className="btn btn-secondary w-100">
                Back to Doctors
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorView;

