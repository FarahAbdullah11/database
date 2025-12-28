import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { patientsAPI } from '../../services/api';
import './PatientAdd.css';

const PatientAdd: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const submitData = {
        full_name: formData.FullName,
        gender: formData.Gender,
        age: formData.Age ? parseInt(formData.Age) : null,
        phone: formData.PhoneNumber,
        address: formData.Address,
        diseases: formData.Diseases,
        latitude: formData.Latitude ? parseFloat(formData.Latitude) : null,
        longitude: formData.Longitude ? parseFloat(formData.Longitude) : null,
      };
      
      const response = await patientsAPI.create(submitData);
      if (response.data.success) {
        navigate('/patients');
      } else {
        alert('Failed to create patient');
      }
    } catch (err: any) {
      alert(err.response?.data?.error || 'Error creating patient');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="patient-add">
      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h4><i className="bi bi-person-plus"></i> Add New Patient</h4>
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
                    <label className="form-label">Latitude (for location services)</label>
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
                    <label className="form-label">Longitude (for location services)</label>
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
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Adding...' : 'Add Patient'}
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

export default PatientAdd;

