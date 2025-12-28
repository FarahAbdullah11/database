# Hospital Management System - Frontend

React + TypeScript frontend for Hospital Management System.

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```
   
   If you encounter peer dependency issues:
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Configure API URL (optional):**
   
   Create a `.env` file in the `frontend` directory:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```
   
   Or use the default: `http://localhost:5000/api`

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000`

## Build for Production

```bash
npm run build
```

The optimized build will be in the `build/` directory.

## API Configuration

The frontend expects a REST API. Set the API URL via environment variable:

- **Environment variable:** `REACT_APP_API_URL`
- **Default:** `http://localhost:5000/api`

## Project Structure

```
src/
├── components/     # Reusable components (Navbar)
├── pages/          # Page components
│   ├── patients/   # Patient management
│   ├── doctors/    # Doctor management
│   ├── admissions/ # Admissions
│   ├── billing/    # Billing
│   └── reports/    # Reports
├── services/       # API service layer
├── App.tsx         # Main app
└── index.tsx       # Entry point
```

## Dependencies

- React 18
- TypeScript
- React Router
- Axios
- Bootstrap 5

## License

ISC

