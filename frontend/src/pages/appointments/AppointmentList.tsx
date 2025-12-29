import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { appointmentsAPI } from '../../services/api';
import './AppointmentList.css';

interface Appointment {
  AppointmentID: number;
  PatientID: number;
  PatientName: string;
  DoctorID: number;
  DoctorName: string;
  DoctorSpecialty?: string;
  HospitalID: number;
  HospitalName: string;
  AppointmentDateTime: string;
  Reason?: string;
  Status: string;
}

const AppointmentList: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await appointmentsAPI.getAll();
      if (response.data.success) {
        setAppointments(response.data.data);
      } else {
        setError('Failed to fetch appointments');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error fetching appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (appointmentId: number) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        const response = await appointmentsAPI.cancel(appointmentId);
        if (response.data.success) {
          setAppointments(appointments.map(app =>
            app.AppointmentID === appointmentId
              ? { ...app, Status: 'Cancelled' }
              : app
          ));
        }
      } catch (err: any) {
        alert('Error cancelling appointment');
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Scheduled':
        return <span className="badge bg-primary">{status}</span>;
      case 'Completed':
        return <span className="badge bg-success">{status}</span>;
      case 'Cancelled':
        return <span className="badge bg-danger">{status}</span>;
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="appointment-list">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Appointments</h3>
        <Link to="/appointments/new" className="btn btn-success">
          <i className="bi bi-plus-circle"></i> New Appointment
        </Link>
      </div>
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Hospital</th>
              <th>Date & Time</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment.AppointmentID}>
                <td>{appointment.AppointmentID}</td>
                <td><strong>{appointment.PatientName}</strong></td>
                <td>
                  {appointment.DoctorName}
                  {appointment.DoctorSpecialty && (
                    <div className="small text-muted">{appointment.DoctorSpecialty}</div>
                  )}
                </td>
                <td>{appointment.HospitalName}</td>
                <td>{new Date(appointment.AppointmentDateTime).toLocaleString()}</td>
                <td>{appointment.Reason || 'N/A'}</td>
                <td>{getStatusBadge(appointment.Status)}</td>
                <td>
                  {appointment.Status === 'Scheduled' && (
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleCancel(appointment.AppointmentID)}
                    >
                      <i className="bi bi-x-circle"></i> Cancel
                    </button>
                  )}
                  {appointment.Status === 'Cancelled' && (
                    <span className="text-muted">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AppointmentList;
