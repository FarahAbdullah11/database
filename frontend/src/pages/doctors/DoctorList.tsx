import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { doctorsAPI } from '../../services/api';
import './DoctorList.css';

interface Doctor {
  DoctorID: number;
  FullName: string;
  Specialty?: string;
  PhoneNumber?: string;
  DepartmentName?: string;
  PatientCount: number;
}

const DoctorList: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await doctorsAPI.getAll();
      if (response.data.success) {
        setDoctors(response.data.data);
      } else {
        setError('Failed to fetch doctors');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error fetching doctors');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="doctor-list">
      <h3 className="mb-4">Doctors</h3>
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Specialty</th>
              <th>Phone</th>
              <th>Department</th>
              <th>Patients</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor) => (
              <tr key={doctor.DoctorID}>
                <td>{doctor.DoctorID}</td>
                <td><strong>{doctor.FullName}</strong></td>
                <td>
                  <span className="badge bg-primary">{doctor.Specialty || 'N/A'}</span>
                </td>
                <td>{doctor.PhoneNumber || 'N/A'}</td>
                <td>{doctor.DepartmentName || 'N/A'}</td>
                <td>
                  <span className="badge bg-info">{doctor.PatientCount || 0} patients</span>
                </td>
                <td>
                  <Link
                    to={`/doctors/${doctor.DoctorID}`}
                    className="btn btn-sm btn-primary"
                  >
                    <i className="bi bi-eye"></i> View
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

export default DoctorList;

