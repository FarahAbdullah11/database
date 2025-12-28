import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { admissionsAPI } from '../../services/api';
import './AdmissionList.css';

interface Admission {
  AdmissionID: number;
  PatientID: number;
  PatientName: string;
  AdmissionDate: string;
  RoomNumber?: string;
  RoomType?: string;
  HospitalName?: string;
  ConditionDescription?: string;
  RoomStatus?: string;
}

const AdmissionList: React.FC = () => {
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAdmissions();
  }, []);

  const fetchAdmissions = async () => {
    try {
      setLoading(true);
      const response = await admissionsAPI.getAll();
      if (response.data.success) {
        setAdmissions(response.data.data);
      } else {
        setError('Failed to fetch admissions');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error fetching admissions');
    } finally {
      setLoading(false);
    }
  };

  const handleDischarge = async (admissionId: number) => {
    if (!window.confirm('Discharge this patient?')) return;

    try {
      const response = await admissionsAPI.discharge(admissionId);
      if (response.data.success) {
        fetchAdmissions();
      } else {
        alert('Failed to discharge patient');
      }
    } catch (err: any) {
      alert(err.response?.data?.error || 'Error discharging patient');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admission-list">
      <div className="d-flex justify-content-between mb-3">
        <h3>Admissions</h3>
        <Link to="/admissions/new" className="btn btn-primary">
          <i className="bi bi-plus-circle"></i> New Admission
        </Link>
      </div>
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>Admission ID</th>
              <th>Patient</th>
              <th>Admission Date</th>
              <th>Room</th>
              <th>Room Type</th>
              <th>Hospital</th>
              <th>Condition</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {admissions.map((admission) => (
              <tr key={admission.AdmissionID}>
                <td>{admission.AdmissionID}</td>
                <td><strong>{admission.PatientName}</strong></td>
                <td>{new Date(admission.AdmissionDate).toLocaleDateString()}</td>
                <td>{admission.RoomNumber || 'N/A'}</td>
                <td>
                  <span className="badge bg-secondary">{admission.RoomType || 'N/A'}</span>
                </td>
                <td>{admission.HospitalName || 'N/A'}</td>
                <td>{admission.ConditionDescription || 'N/A'}</td>
                <td>
                  {admission.RoomStatus === 'Occupied' ? (
                    <span className="badge bg-danger">Occupied</span>
                  ) : (
                    <span className="badge bg-success">Available</span>
                  )}
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-warning"
                    onClick={() => handleDischarge(admission.AdmissionID)}
                  >
                    <i className="bi bi-door-closed"></i> Discharge
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdmissionList;

