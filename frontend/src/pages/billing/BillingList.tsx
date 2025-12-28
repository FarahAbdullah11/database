import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { billingAPI } from '../../services/api';
import './BillingList.css';

interface Bill {
  BillID: number;
  PatientID: number;
  PatientName: string;
  BillDate: string;
  AdmissionDate?: string;
  RoomType?: string;
  Amount: number;
  PaymentStatus: string;
}

const BillingList: React.FC = () => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      setLoading(true);
      const response = await billingAPI.getAll();
      if (response.data.success) {
        setBills(response.data.data);
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

  return (
    <div className="billing-list">
      <h3 className="mb-4">All Bills</h3>
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>Bill ID</th>
              <th>Patient</th>
              <th>Bill Date</th>
              <th>Admission Date</th>
              <th>Room Type</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bills.map((bill) => (
              <tr key={bill.BillID}>
                <td>{bill.BillID}</td>
                <td><strong>{bill.PatientName}</strong></td>
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
                <td>
                  <Link
                    to={`/billing/patient/${bill.PatientID}`}
                    className="btn btn-sm btn-info"
                  >
                    <i className="bi bi-eye"></i>
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

export default BillingList;

