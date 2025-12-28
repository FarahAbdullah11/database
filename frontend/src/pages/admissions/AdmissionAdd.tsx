import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { admissionsAPI } from '../../services/api';
import './AdmissionAdd.css';

interface Patient {
  PatientID: number;
  FullName: string;
}

interface Room {
  RoomID: number;
  RoomNumber: string;
  RoomType: string;
  HospitalName?: string;
  Status: string;
}

const AdmissionAdd: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    PatientID: searchParams.get('patientId') || '',
    RoomID: '',
    ConditionDescription: '',
  });

  useEffect(() => {
    fetchFormData();
  }, []);

  const fetchFormData = async () => {
    try {
      const response = await admissionsAPI.getFormData();
      if (response.data.success) {
        setPatients(response.data.data.patients);
        setRooms(response.data.data.rooms);
        if (searchParams.get('patientId')) {
          setFormData((prev) => ({
            ...prev,
            PatientID: searchParams.get('patientId') || '',
          }));
        }
      }
    } catch (err) {
      console.error('Error fetching form data:', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const submitData = {
        ...formData,
        PatientID: parseInt(formData.PatientID),
        RoomID: parseInt(formData.RoomID),
      };
      const response = await admissionsAPI.create(submitData);
      if (response.data.success) {
        navigate('/admissions');
      } else {
        alert('Failed to create admission');
      }
    } catch (err: any) {
      alert(err.response?.data?.error || 'Error creating admission');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admission-add">
      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header bg-info text-white">
              <h4><i className="bi bi-door-open"></i> New Admission</h4>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Select Patient *</label>
                  <select
                    className="form-select"
                    name="PatientID"
                    value={formData.PatientID}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Choose a patient...</option>
                    {patients.map((patient) => (
                      <option key={patient.PatientID} value={patient.PatientID}>
                        {patient.FullName} (ID: {patient.PatientID})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Select Room *</label>
                  <select
                    className="form-select"
                    name="RoomID"
                    value={formData.RoomID}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Choose a room...</option>
                    {rooms.map((room) => (
                      <option key={room.RoomID} value={room.RoomID}>
                        {room.RoomNumber} - {room.RoomType} ({room.HospitalName}) - {room.Status}
                      </option>
                    ))}
                  </select>
                  <small className="form-text text-muted">Only available rooms are shown</small>
                </div>
                <div className="mb-3">
                  <label className="form-label">Condition Description</label>
                  <textarea
                    className="form-control"
                    name="ConditionDescription"
                    rows={3}
                    placeholder="Describe the patient's condition..."
                    value={formData.ConditionDescription}
                    onChange={handleChange}
                  />
                </div>
                <div className="d-flex justify-content-between">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate('/admissions')}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Admitting...' : 'Admit Patient'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdmissionAdd;

