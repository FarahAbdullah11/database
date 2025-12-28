import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { patientsAPI } from '../../services/api';
import './PatientView.css';

interface Patient {
  PatientID: number;
  FullName: string;
  Gender?: string;
  Age?: number;
  PhoneNumber?: string;
  Address?: string;
  Diseases?: string;
  Latitude?: number;
  Longitude?: number;
}

interface Admission {
  AdmissionID: number;
  AdmissionDate: string;
  RoomNumber?: string;
  RoomType?: string;
  HospitalName?: string;
  ConditionDescription?: string;
}

interface MedicalRecord {
  RecordID: number;
  VisitDate: string;
  Diagnosis?: string;
  Treatment?: string;
  DoctorName?: string;
}

const PatientView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [admission, setAdmission] = useState<Admission | null>(null);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchPatient(parseInt(id));
    }
  }, [id]);

  const fetchPatient = async (patientId: number) => {
    try {
      setLoading(true);
      const response = await patientsAPI.getById(patientId);
      if (response.data.success) {
        const data = response.data.data;
        setPatient(data.patient);
        setAdmission(data.admission);
        setRecords(data.records || []);
      } else {
        setError('Failed to fetch patient');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error fetching patient');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!patient) return <div className="error">Patient not found</div>;

  return (
    <div className="patient-view">
      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h4><i className="bi bi-person"></i> Patient Information</h4>
            </div>
            <div className="card-body">
              <div className="row mb-3">
                <div className="col-md-6"><strong>Patient ID:</strong> {patient.PatientID}</div>
                <div className="col-md-6"><strong>Full Name:</strong> {patient.FullName}</div>
              </div>
              <div className="row mb-3">
                <div className="col-md-6"><strong>Gender:</strong> {patient.Gender || 'N/A'}</div>
                <div className="col-md-6"><strong>Age:</strong> {patient.Age || 'N/A'}</div>
              </div>
              <div className="row mb-3">
                <div className="col-md-6"><strong>Phone:</strong> {patient.PhoneNumber || 'N/A'}</div>
                <div className="col-md-6"><strong>Address:</strong> {patient.Address || 'N/A'}</div>
              </div>
              <div className="row mb-3">
                <div className="col-md-12"><strong>Disease:</strong> {patient.Diseases || 'N/A'}</div>
              </div>
              {patient.Latitude && patient.Longitude && (
                <div className="row mb-3">
                  <div className="col-md-6">
                    <strong>Location:</strong> {patient.Latitude}, {patient.Longitude}
                  </div>
                </div>
              )}
              <div className="mt-3">
                <Link
                  to={`/patients/${patient.PatientID}/edit`}
                  className="btn btn-warning"
                >
                  <i className="bi bi-pencil"></i> Edit
                </Link>
                <Link
                  to={`/billing/generate/${patient.PatientID}`}
                  className="btn btn-success"
                >
                  <i className="bi bi-receipt"></i> Generate Bill
                </Link>
                <Link
                  to={`/reports/nearest-hospital?patientId=${patient.PatientID}`}
                  className="btn btn-info"
                >
                  <i className="bi bi-geo-alt"></i> Find Nearest Hospital
                </Link>
              </div>
            </div>
          </div>

          {admission && (
            <div className="card mt-3">
              <div className="card-header bg-success text-white">
                <h5><i className="bi bi-door-open"></i> Current Admission</h5>
              </div>
              <div className="card-body">
                <p><strong>Admission Date:</strong> {new Date(admission.AdmissionDate).toLocaleDateString()}</p>
                <p><strong>Room Number:</strong> {admission.RoomNumber || 'N/A'}</p>
                <p><strong>Room Type:</strong> <span className="badge bg-secondary">{admission.RoomType || 'N/A'}</span></p>
                <p><strong>Hospital:</strong> {admission.HospitalName || 'N/A'}</p>
                <p><strong>Condition:</strong> {admission.ConditionDescription || 'N/A'}</p>
              </div>
            </div>
          )}

          {records.length > 0 && (
            <div className="card mt-3">
              <div className="card-header bg-secondary text-white">
                <h5><i className="bi bi-file-medical"></i> Medical Records</h5>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Diagnosis</th>
                        <th>Treatment</th>
                        <th>Doctor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {records.map((record) => (
                        <tr key={record.RecordID}>
                          <td>{new Date(record.VisitDate).toLocaleDateString()}</td>
                          <td>{record.Diagnosis || 'N/A'}</td>
                          <td>{record.Treatment || 'N/A'}</td>
                          <td>{record.DoctorName || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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
              <Link
                to={`/admissions/new?patientId=${patient.PatientID}`}
                className="btn btn-primary w-100 mb-2"
              >
                Admit Patient
              </Link>
              <Link
                to={`/billing/patient/${patient.PatientID}`}
                className="btn btn-success w-100 mb-2"
              >
                View Bills
              </Link>
              <Link to="/patients" className="btn btn-secondary w-100">
                Back to Patients
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientView;

