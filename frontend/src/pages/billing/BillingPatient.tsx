import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { billingAPI } from '../../services/api';
import './BillingPatient.css';

interface Patient {
  PatientID: number;
  FullName: string;
}

interface Bill {
  BillID: number;
  BillDate: string;
  AdmissionDate?: string;
  RoomType?: string;
  Amount: number;
  PaymentStatus: string;
}

const BillingPatient: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (patientId) {
      fetchBills(parseInt(patientId));
    }
  }, [patientId]);

  const fetchBills = async (id: number) => {
    try {
      setLoading(true);
      const response = await billingAPI.getByPatient(id);
      if (response.data.success) {
        setPatient(response.data.data.patient);
        setBills(response.data.data.bills);
      } else {
        setError('Failed to fetch bills');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error fetching bills');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!patient) return <div className="error">Patient not found</div>;

  return (
    <div className="billing-patient">
      <div className="row">
        <div className="col-md-10">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h4><i className="bi bi-receipt"></i> Bills for {patient.FullName}</h4>
            </div>
            <div className="card-body">
              {bills.length > 0 ? (
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Bill ID</th>
                        <th>Date</th>
                        <th>Admission Date</th>
                        <th>Room Type</th>
                        <th>Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bills.map((bill) => (
                        <tr key={bill.BillID}>
                          <td>{bill.BillID}</td>
                          <td>{new Date(bill.BillDate).toLocaleDateString()}</td>
                          <td>
                            {bill.AdmissionDate
                              ? new Date(bill.AdmissionDate).toLocaleDateString()
                              : 'N/A'}
                          </td>
                          <td>
                            <span className="badge bg-secondary">{bill.RoomType || 'N/A'}</span>
                          </td>
                          <td><strong>${parseFloat(bill.Amount.toString()).toFixed(2)}</strong></td>
                          <td>
                            {bill.PaymentStatus === 'Paid' ? (
                              <span className="badge bg-success">Paid</span>
                            ) : (
                              <span className="badge bg-warning">Pending</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted">No bills found for this patient.</p>
              )}

              <div className="mt-3">
                <Link
                  to={`/billing/generate/${patientId}`}
                  className="btn btn-success"
                >
                  Generate New Bill
                </Link>
                <Link
                  to={`/patients/${patientId}`}
                  className="btn btn-secondary ms-2"
                >
                  Back to Patient
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingPatient;

