import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { reportsAPI } from '../../services/api';
import './ReportNearestHospital.css';

interface Patient {
  PatientID: number;
  FullName: string;
  Diseases?: string;
  Latitude?: number;
  Longitude?: number;
}

interface Hospital {
  HospitalID: number;
  Name: string;
  Address?: string;
  City?: string;
  PhoneNumber?: string;
  distance?: number;
}

interface Doctor {
  DoctorID: number;
  FullName: string;
  Specialty?: string;
  DepartmentName?: string;
  PhoneNumber?: string;
}

interface Result {
  hospital: Hospital;
  doctors: Doctor[];
}

const ReportNearestHospital: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState(searchParams.get('patientId') || '');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [results, setResults] = useState<Result[]>([]);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasLocation, setHasLocation] = useState(true);

  useEffect(() => {
    fetchFormData();
    const patientId = searchParams.get('patientId');
    if (patientId) {
      setSelectedPatientId(patientId);
      handleGenerateReport(patientId);
    }
  }, []);

  const fetchFormData = async () => {
    try {
      const response = await reportsAPI.getNearestHospitalFormData();
      if (response.data.success) {
        setPatients(response.data.data.patients);
        setSpecializations(response.data.data.specializations);
      }
    } catch (err) {
      console.error('Error fetching form data:', err);
    }
  };

  const handleGenerateReport = async (patientId?: string) => {
    const id = patientId || selectedPatientId;
    if (!id) {
      setError('Please select a patient');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await reportsAPI.getNearestHospital(
        parseInt(id),
        selectedSpecialization || undefined
      );
      if (response.data.success) {
        setPatient(response.data.data.patient);
        setResults(response.data.data.results);
        setHasLocation(true);
      } else {
        if (response.data.hasLocation === false) {
          setHasLocation(false);
          setError('Patient location not set');
        } else {
          setError(response.data.error || 'Failed to generate report');
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error generating report');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleGenerateReport();
  };

  return (
    <div className="report-nearest-hospital">
      <div className="row">
        <div className="col-md-12">
          <h3 className="mb-4">Find Nearest Hospital Report</h3>

          {!patient && (
            <div className="card mb-4">
              <div className="card-header bg-info text-white">
                <h4><i className="bi bi-geo-alt"></i> Find Nearest Hospital Report</h4>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Select Patient *</label>
                    <select
                      className="form-select"
                      value={selectedPatientId}
                      onChange={(e) => setSelectedPatientId(e.target.value)}
                      required
                    >
                      <option value="">Choose a patient...</option>
                      {patients.map((p) => (
                        <option key={p.PatientID} value={p.PatientID}>
                          {p.FullName} (ID: {p.PatientID}) - {p.Diseases || 'No disease listed'}
                        </option>
                      ))}
                    </select>
                    <small className="form-text text-muted">
                      Patient must have location coordinates (Latitude/Longitude) set
                    </small>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Required Specialization (Optional)</label>
                    <select
                      className="form-select"
                      value={selectedSpecialization}
                      onChange={(e) => setSelectedSpecialization(e.target.value)}
                    >
                      <option value="">Any specialization</option>
                      {specializations.map((spec) => (
                        <option key={spec} value={spec}>
                          {spec}
                        </option>
                      ))}
                    </select>
                    <small className="form-text text-muted">
                      Filter hospitals by doctor specialization
                    </small>
                  </div>
                  <div className="d-flex justify-content-between">
                    <Link to="/" className="btn btn-secondary">
                      Cancel
                    </Link>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? 'Generating...' : 'Generate Report'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {error && hasLocation === false && patient && (
            <div className="alert alert-danger">
              <h4><i className="bi bi-exclamation-triangle"></i> Location Not Available</h4>
              <p>
                Patient <strong>{patient.FullName}</strong> does not have location coordinates
                (Latitude/Longitude) set. Please update the patient's location information to use
                this feature.
              </p>
              <Link
                to={`/patients/${patient.PatientID}/edit`}
                className="btn btn-warning"
              >
                Update Patient Location
              </Link>
              <Link
                to="/patients"
                className="btn btn-secondary ms-2"
              >
                Back to Patients
              </Link>
            </div>
          )}

          {patient && results.length > 0 && (
            <>
              <div className="card mb-3">
                <div className="card-header bg-primary text-white">
                  <h4><i className="bi bi-geo-alt"></i> Nearest Hospital Report</h4>
                </div>
                <div className="card-body">
                  <h5>Patient Information</h5>
                  <p><strong>Name:</strong> {patient.FullName} (ID: {patient.PatientID})</p>
                  {patient.Latitude && patient.Longitude && (
                    <p>
                      <strong>Location:</strong> {patient.Latitude}, {patient.Longitude}
                    </p>
                  )}
                  {selectedSpecialization && (
                    <p>
                      <strong>Required Specialization:</strong>{' '}
                      <span className="badge bg-info">{selectedSpecialization}</span>
                    </p>
                  )}
                </div>
              </div>

              {results.map((result, index) => (
                <div key={result.hospital.HospitalID} className="card mb-3">
                  <div className={`card-header ${index === 0 ? 'bg-success' : 'bg-secondary'} text-white`}>
                    <h5>
                      {index === 0 ? (
                        <>
                          <i className="bi bi-star-fill"></i> Nearest Hospital
                        </>
                      ) : (
                        <>Hospital #{index + 1}</>
                      )}{' '}
                      - {result.hospital.Name}
                      <span className="badge bg-light text-dark ms-2">
                        {result.hospital.distance?.toFixed(2)} km away
                      </span>
                    </h5>
                  </div>
                  <div className="card-body">
                    <p><strong>Address:</strong> {result.hospital.Address || 'N/A'}</p>
                    <p><strong>City:</strong> {result.hospital.City || 'N/A'}</p>
                    <p><strong>Phone:</strong> {result.hospital.PhoneNumber || 'N/A'}</p>

                    {result.doctors.length > 0 ? (
                      <>
                        <h6 className="mt-3">
                          Available Doctors{selectedSpecialization && ` (${selectedSpecialization})`}
                        </h6>
                        <div className="table-responsive">
                          <table className="table table-sm">
                            <thead>
                              <tr>
                                <th>Doctor ID</th>
                                <th>Name</th>
                                <th>Specialty</th>
                                <th>Department</th>
                                <th>Phone</th>
                              </tr>
                            </thead>
                            <tbody>
                              {result.doctors.map((doctor) => (
                                <tr key={doctor.DoctorID}>
                                  <td>{doctor.DoctorID}</td>
                                  <td>{doctor.FullName}</td>
                                  <td>
                                    <span className="badge bg-primary">
                                      {doctor.Specialty || 'N/A'}
                                    </span>
                                  </td>
                                  <td>{doctor.DepartmentName || 'N/A'}</td>
                                  <td>{doctor.PhoneNumber || 'N/A'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </>
                    ) : (
                      <div className="alert alert-warning">
                        {selectedSpecialization ? (
                          <>No doctors with specialization "{selectedSpecialization}" found at this hospital.</>
                        ) : (
                          <>No doctors found at this hospital.</>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              <div className="mt-3">
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setPatient(null);
                    setResults([]);
                    setSelectedPatientId('');
                    setSelectedSpecialization('');
                  }}
                >
                  New Search
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportNearestHospital;

