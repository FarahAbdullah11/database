import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { patientsAPI } from '../../services/api';
import './PatientEdit.css';

const PatientEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    FullName: '',
    Gender: '',
    Age: '',
    Address: '',
    PhoneNumber: '',
    Diseases: '',
    Latitude: '',
    Longitude: '',
  });

  useEffect(() => {
    if (id) {
      fetchPatientData(parseInt(id));
    }
  }, [id]);

  const fetchPatientData = async (patientId: number) => {
    try {
      setLoading(true);
      const patientResponse = await patientsAPI.getById(patientId);

      if (patientResponse.data.success) {
        const patient = patientResponse.data.data;
        
        setFormData({
          FullName: patient.FullName || '',
          Gender: patient.Gender || '',
          Age: patient.Age?.toString() || '',
          Address: patient.Address || '',
          PhoneNumber: patient.PhoneNumber || '',
          Diseases: patient.Diseases || '',
          Latitude: patient.Latitude?.toString() || '',
          Longitude: patient.Longitude?.toString() || '',
        });
      }
    } catch (err: any) {
      alert(err.response?.data?.error || 'Error fetching patient data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    
    setSaving(true);
    try {
      const submitData = {
        ...formData,
        Age: formData.Age ? parseInt(formData.Age) : null,
        Latitude: formData.Latitude ? parseFloat(formData.Latitude) : null,
        Longitude: formData.Longitude ? parseFloat(formData.Longitude) : null,
      };
      const response = await patientsAPI.update(parseInt(id), submitData);
      if (response.data.success) {
        navigate('/patients');
      } else {
        alert('Failed to update patient');
      }
    } catch (err: any) {
      alert(err.response?.data?.error || 'Error updating patient');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="patient-edit">
      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header bg-warning text-dark">
              <h4><i className="bi bi-pencil"></i> Edit Patient</h4>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="FullName"
                      value={formData.FullName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Gender</label>
                    <select
                      className="form-select"
                      name="Gender"
                      value={formData.Gender}
                      onChange={handleChange}
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Age</label>
                    <input
                      type="number"
                      className="form-control"
                      name="Age"
                      value={formData.Age}
                      onChange={handleChange}
                      min="0"
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      className="form-control"
                      name="PhoneNumber"
                      value={formData.PhoneNumber}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Address</label>
                    <input
                      type="text"
                      className="form-control"
                      name="Address"
                      value={formData.Address}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Disease</label>
                  <textarea
                    className="form-control"
                    name="Diseases"
                    rows={2}
                    value={formData.Diseases}
                    onChange={handleChange}
                  />
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      className="form-control"
                      name="Latitude"
                      value={formData.Latitude}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      className="form-control"
                      name="Longitude"
                      value={formData.Longitude}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="d-flex justify-content-between">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate('/patients')}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-warning" disabled={saving}>
                    {saving ? 'Updating...' : 'Update Patient'}
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

export default PatientEdit;

