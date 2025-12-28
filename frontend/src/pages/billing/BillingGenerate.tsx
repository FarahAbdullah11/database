import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { billingAPI } from '../../services/api';
import './BillingGenerate.css';

interface Patient {
  PatientID: number;
  FullName: string;
}

interface Admission {
  AdmissionID: number;
  AdmissionDate: string;
  RoomNumber?: string;
  RoomType?: string;
  HospitalName?: string;
}

const BillingGenerate: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [admission, setAdmission] = useState<Admission | null>(null);
  const [billData, setBillData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState('Pending');

  useEffect(() => {
    if (patientId) {
      fetchBillData(parseInt(patientId));
    }
  }, [patientId]);

  const fetchBillData = async (id: number) => {
    try {
      setLoading(true);
      const response = await billingAPI.generate(id);
      if (response.data.success) {
        const data = response.data.data;
        setPatient(data.patient);
        setAdmission(data.admission);
        setBillData(data);
      } else {
        if (response.data.hasAdmission === false) {
          setError('No active admission found');
        } else {
          setError(response.data.error || 'Failed to generate bill');
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error generating bill');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId || !admission || !billData) return;

    setSaving(true);
    try {
      const response = await billingAPI.create({
        PatientID: parseInt(patientId),
        AdmissionID: admission.AdmissionID,
        Amount: billData.totalAmount,
        PaymentStatus: paymentStatus,
      });
      if (response.data.success) {
        navigate(`/billing/patient/${patientId}`);
      } else {
        alert('Failed to create bill');
      }
    } catch (err: any) {
      alert(err.response?.data?.error || 'Error creating bill');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) {
    return (
      <div className="billing-generate">
        <div className="alert alert-warning">
          <h4><i className="bi bi-exclamation-triangle"></i> No Active Admission</h4>
          <p>
            Patient <strong>{patient?.FullName}</strong> does not have an active admission.
            Please admit the patient first before generating a bill.
          </p>
          <Link
            to={`/admissions/new?patientId=${patientId}`}
            className="btn btn-primary"
          >
            Admit Patient
          </Link>
          <Link
            to={`/patients/${patientId}`}
            className="btn btn-secondary ms-2"
          >
            Back to Patient
          </Link>
        </div>
      </div>
    );
  }
  if (!patient || !admission || !billData) return <div className="error">Data not available</div>;

  return (
    <div className="billing-generate">
      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header bg-success text-white">
              <h4><i className="bi bi-receipt"></i> Bill Generation</h4>
            </div>
            <div className="card-body">
              {billData.existingBill && (
                <div className="alert alert-info">
                  <strong>Note:</strong> A bill already exists for this admission. You can create a new one or update the existing bill.
                </div>
              )}

              <h5>Patient Information</h5>
              <p><strong>Name:</strong> {patient.FullName} (ID: {patient.PatientID})</p>

              <h5 className="mt-4">Admission Details</h5>
              <p><strong>Hospital:</strong> {admission.HospitalName || 'N/A'}</p>
              <p><strong>Room:</strong> {admission.RoomNumber} ({admission.RoomType})</p>
              <p><strong>Admission Date:</strong> {new Date(admission.AdmissionDate).toLocaleDateString()}</p>
              <p><strong>Days Stayed:</strong> {billData.days} days</p>

              <hr />

              <h5>Bill Breakdown</h5>
              <table className="table">
                <tbody>
                  <tr>
                    <td>
                      Room Charges ({billData.days} days × ${billData.dailyRate}/{admission.RoomType})
                    </td>
                    <td className="text-end">
                      <strong>${billData.roomCost.toFixed(2)}</strong>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      Treatment Charges ({billData.treatmentCount} treatments × ${billData.treatmentPrice})
                    </td>
                    <td className="text-end">
                      <strong>${billData.treatmentCost.toFixed(2)}</strong>
                    </td>
                  </tr>
                  <tr className="table-primary">
                    <td><strong>Total Amount</strong></td>
                    <td className="text-end">
                      <strong>${billData.totalAmount.toFixed(2)}</strong>
                    </td>
                  </tr>
                </tbody>
              </table>

              <form onSubmit={handleSubmit} className="mt-4">
                <div className="mb-3">
                  <label className="form-label">Payment Status</label>
                  <select
                    className="form-select"
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                  </select>
                </div>

                <div className="d-flex justify-content-between">
                  <Link
                    to={`/patients/${patientId}`}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </Link>
                  <button type="submit" className="btn btn-success" disabled={saving}>
                    {saving ? 'Generating...' : 'Generate Bill'}
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

export default BillingGenerate;

