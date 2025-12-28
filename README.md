# Hospital Management System

A complete Hospital Management System with React + TypeScript frontend and Flask (Python) backend.

## Tech Stack

- **React 18** with TypeScript
- **React Router** for navigation
- **Axios** for API calls
- **Bootstrap 5** for styling
- **Bootstrap Icons** for icons

## Features

- **Patient Management**: Add, view, edit patient records with personal details, diseases, and treatment information
- **Doctor Management**: View doctors, their specializations, and patients they treat
- **Admissions & Rooms**: Manage patient admissions, assign rooms (Standard, Operation, ICU), and track room status
- **Billing System**: Generate bills based on days stayed and treatments
- **Reports**: Find nearest hospital with available doctors based on patient location and required specialization

## Prerequisites

### Frontend
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Backend
- Python 3.8 or higher
- MySQL Server with Hospital database
- pip (Python package manager)

## Installation

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure database connection:**
   
   Edit `backend/.env` file with your MySQL credentials:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=Hospital
   DB_PORT=3306
   ```

4. **Start the backend server:**
   ```bash
   python app.py
   ```
   
   Backend will run on: **http://localhost:5000**

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

   If you encounter peer dependency issues:
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Configure API URL (optional):**
   
   The frontend already has `.env` file configured to connect to `http://localhost:5000/api`
   
   If your backend runs on a different URL, edit `frontend/.env`:
   ```
   REACT_APP_API_URL=http://your-backend-url/api
   ```

4. **Start the frontend:**
   ```bash
   npm start
   ```
   
   Frontend will open at: **http://localhost:3000**

## Running the Complete Application

1. **Terminal 1 - Start Backend:**
   ```bash
   cd backend
   python app.py
   ```

2. **Terminal 2 - Start Frontend:**
   ```bash
   cd frontend
   npm start
   ```

3. **Open browser:**
   Navigate to `http://localhost:3000`

## Building for Production

```bash
cd frontend
npm run build
```

This creates an optimized production build in `frontend/build/`.

## Project Structure

```
DB/
├── backend/
│   ├── app.py          # Flask backend server
│   ├── requirements.txt # Python dependencies
│   ├── .env            # Database configuration
│   └── README.md       # Backend documentation
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/     # React components
    │   ├── pages/          # Page components
    │   │   ├── patients/   # Patient management
    │   │   ├── doctors/    # Doctor management
    │   │   ├── admissions/ # Admissions
    │   │   ├── billing/    # Billing
    │   │   └── reports/    # Reports
    │   ├── services/       # API service layer
    │   ├── App.tsx         # Main app
    │   └── index.tsx       # Entry point
    ├── .env            # Frontend API configuration
    └── package.json    # Frontend dependencies
```

## Database Setup

1. **Create MySQL Database:**
   - Database name: `Hospital`
   - Make sure all your tables are created (patients, doctors, hospitals, rooms, admissions, bills, etc.)

2. **Update Backend Configuration:**
   - Edit `backend/.env` with your MySQL credentials
   - Make sure MySQL server is running

## API Endpoints

The backend provides the following REST API endpoints:

### Patients
- `GET /api/patients` - Get all patients
- `GET /api/patients/:id` - Get patient by ID
- `GET /api/patients/form/doctors` - Get doctors for form
- `POST /api/patients` - Create patient
- `PUT /api/patients/:id` - Update patient

### Doctors
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/:id` - Get doctor by ID

### Admissions
- `GET /api/admissions` - Get all admissions
- `GET /api/admissions/form-data` - Get form data
- `POST /api/admissions` - Create admission
- `POST /api/admissions/:id/discharge` - Discharge patient

### Billing
- `GET /api/billing` - Get all bills
- `GET /api/billing/generate/:patientId` - Generate bill
- `POST /api/billing` - Create bill
- `GET /api/billing/patient/:patientId` - Get patient bills

### Reports
- `GET /api/reports/nearest-hospital/form-data` - Get form data
- `GET /api/reports/nearest-hospital` - Get nearest hospital report

## Development

- Frontend runs on port **3000**
- Make sure your backend API is running and accessible at the configured URL

## License

ISC
