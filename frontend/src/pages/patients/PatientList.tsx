import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { patientsAPI } from '../../services/api';
import './PatientList.css';

interface Patient {
  PatientID: number;
  FullName: string;
  Gender?: string;
  Age?: number;
  PhoneNumber?: string;
  Diseases?: string;
}

const PatientList: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await patientsAPI.getAll();
      if (response.data.success) {
        setPatients(response.data.data);
      } else {
        setError('Failed to fetch patients');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error fetching patients');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="patient-list">
      <div className="d-flex justify-content-between mb-3">
        <h3>Patients</h3>
        <Link to="/patients/add" className="btn btn-primary">
          <i className="bi bi-plus-circle"></i> Add New Patient
        </Link>
      </div>
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Gender</th>
              <th>Age</th>
              <th>Phone</th>
              <th>Disease</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.PatientID}>
                <td>{patient.PatientID}</td>
                <td><strong>{patient.FullName}</strong></td>
                <td>{patient.Gender || 'N/A'}</td>
                <td>{patient.Age || 'N/A'}</td>
                <td>{patient.PhoneNumber || 'N/A'}</td>
                <td>{patient.Diseases || 'N/A'}</td>
                <td>
                  <Link
                    to={`/patients/${patient.PatientID}/edit`}
                    className="btn btn-sm btn-warning"
                  >
                    <i className="bi bi-pencil"></i> Edit
                  </Link>
                  
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientList;

