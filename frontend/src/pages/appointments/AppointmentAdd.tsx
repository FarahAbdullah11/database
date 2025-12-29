import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { appointmentsAPI } from '../../services/api';
import './AppointmentAdd.css';

interface Patient {
  PatientID: number;
  FullName: string;
}

interface Doctor {
  DoctorID: number;
  FullName: string;
  Specialty: string;
}

interface Hospital {
  HospitalID: number;
  HospitalName: string;
  City: string;
}

const AppointmentAdd: React.FC = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    PatientID: '',
    DoctorID: '',
    HospitalID: '',
    AppointmentDateTime: '',
    Reason: '',
    Status: 'Scheduled'
  });

  useEffect(() => {
    fetchFormData();
  }, []);

  const fetchFormData = async () => {
    try {
      setLoading(true);
      const response = await appointmentsAPI.getFormData();
      if (response.data.success) {
        const data = response.data.data;
        setPatients(data.patients);
        setDoctors(data.doctors);
        setHospitals(data.hospitals);
      } else {
        setError('Failed to load form data');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error loading form data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.PatientID || !formData.DoctorID || !formData.HospitalID || !formData.AppointmentDateTime) {
      alert('Please fill in all required fields');
      return;
    }

    setSaving(true);
    try {
      const response = await appointmentsAPI.create({
        PatientID: parseInt(formData.PatientID),
        DoctorID: parseInt(formData.DoctorID),
        HospitalID: parseInt(formData.HospitalID),
        AppointmentDateTime: formData.AppointmentDateTime,
        Reason: formData.Reason,
        Status: formData.Status
      });

      if (response.data.success) {
        navigate('/appointments');
      } else {
        alert('Failed to create appointment');
      }
    } catch (err: any) {
      alert(err.response?.data?.error || 'Error creating appointment');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="appointment-add">
      <h3 className="mb-4">Schedule New Appointment</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Patient <span className="text-danger">*</span></label>
                <select
                  className="form-select"
                  name="PatientID"
                  value={formData.PatientID}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a patient</option>
                  {patients.map(patient => (
                    <option key={patient.PatientID} value={patient.PatientID}>
                      {patient.FullName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Doctor <span className="text-danger">*</span></label>
                <select
                  className="form-select"
                  name="DoctorID"
                  value={formData.DoctorID}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a doctor</option>
                  {doctors.map(doctor => (
                    <option key={doctor.DoctorID} value={doctor.DoctorID}>
                      {doctor.FullName} - {doctor.Specialty}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Hospital <span className="text-danger">*</span></label>
                <select
                  className="form-select"
                  name="HospitalID"
                  value={formData.HospitalID}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a hospital</option>
                  {hospitals.map(hospital => (
                    <option key={hospital.HospitalID} value={hospital.HospitalID}>
                      {hospital.HospitalName} - {hospital.City}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Date & Time <span className="text-danger">*</span></label>
                <input
                  type="datetime-local"
                  className="form-control"
                  name="AppointmentDateTime"
                  value={formData.AppointmentDateTime}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Reason for Appointment</label>
                <textarea
                  className="form-control"
                  name="Reason"
                  value={formData.Reason}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Enter reason for appointment"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  name="Status"
                  value={formData.Status}
                  onChange={handleChange}
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Creating...' : 'Create Appointment'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/appointments')}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AppointmentAdd;
