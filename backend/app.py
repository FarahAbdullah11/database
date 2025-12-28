from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import math
from datetime import date

app = Flask(__name__)
CORS(app)

# -----------------------------
#  DATABASE CONNECTION
# -----------------------------
def get_db():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="farah1965!",
        database="Hospital"  # <-- FIXED (removed space)
    )

# -----------------------------
#  GET ALL PATIENTS
# -----------------------------
@app.route("/patients", methods=["GET"])
def get_all_patients():
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)

        query = "SELECT * FROM patients ORDER BY patient_id DESC"
        cursor.execute(query)
        patients = cursor.fetchall()

        cursor.close()
        db.close()

        # Transform snake_case to PascalCase for frontend compatibility
        transformed_patients = []
        for patient in patients:
            transformed_patients.append({
                "PatientID": patient.get("patient_id"),
                "FullName": patient.get("full_name"),
                "Gender": patient.get("gender"),
                "Age": patient.get("age"),
                "PhoneNumber": patient.get("phone_number"),
                "Address": patient.get("address"),
                "Diseases": patient.get("diseases"),
                "Latitude": patient.get("latitude"),
                "Longitude": patient.get("longitude")
            })

        return jsonify({"success": True, "data": transformed_patients})

    except Exception as e:
        print("ERROR:", str(e))
        return jsonify({"success": False, "error": "Error fetching patients"}), 500


# -----------------------------
#  GET PATIENT BY ID
# -----------------------------
@app.route("/patients/<int:patient_id>", methods=["GET"])
def get_patient_by_id(patient_id):
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)

        query = "SELECT * FROM patients WHERE patient_id = %s"
        cursor.execute(query, (patient_id,))
        patient = cursor.fetchone()

        cursor.close()
        db.close()

        if not patient:
            return jsonify({"error": "Patient not found"}), 404

        # Transform snake_case to PascalCase for frontend compatibility
        transformed_patient = {
            "PatientID": patient.get("patient_id"),
            "FullName": patient.get("full_name"),
            "Gender": patient.get("gender"),
            "Age": patient.get("age"),
            "PhoneNumber": patient.get("phone_number"),
            "Address": patient.get("address"),
            "Diseases": patient.get("diseases"),
            "Latitude": patient.get("latitude"),
            "Longitude": patient.get("longitude")
        }

        return jsonify({"success": True, "data": transformed_patient})

    except Exception as e:
        print("ERROR:", str(e))
        return jsonify({"error": "Error fetching patient"}), 500


# -----------------------------
#  UPDATE PATIENT
# -----------------------------
@app.route("/patients/<int:patient_id>", methods=["PUT"])
def update_patient(patient_id):
    try:
        data = request.json

        full_name = data.get("FullName") or data.get("full_name")
        gender = data.get("Gender") or data.get("gender")
        age = data.get("Age") or data.get("age")
        phone = data.get("PhoneNumber") or data.get("phone")
        address = data.get("Address") or data.get("address")
        diseases = data.get("Diseases") or data.get("diseases")
        latitude = data.get("Latitude") or data.get("latitude")
        longitude = data.get("Longitude") or data.get("longitude")

        db = get_db()
        cursor = db.cursor()

        # Build update query dynamically based on provided fields
        updates = []
        params = []

        if full_name is not None:
            updates.append("full_name = %s")
            params.append(full_name)
        if gender is not None:
            updates.append("gender = %s")
            params.append(gender)
        if age is not None:
            updates.append("age = %s")
            params.append(age)
        if phone is not None:
            updates.append("phone_number = %s")
            params.append(phone)
        if address is not None:
            updates.append("address = %s")
            params.append(address)
        if diseases is not None:
            updates.append("diseases = %s")
            params.append(diseases)
        if latitude is not None:
            updates.append("latitude = %s")
            params.append(latitude)
        if longitude is not None:
            updates.append("longitude = %s")
            params.append(longitude)

        if not updates:
            cursor.close()
            db.close()
            return jsonify({"success": False, "error": "No fields to update"}), 400

        params.append(patient_id)
        query = f"UPDATE patients SET {', '.join(updates)} WHERE patient_id = %s"

        cursor.execute(query, params)
        db.commit()

        cursor.close()
        db.close()

        return jsonify({
            "success": True,
            "message": "Patient updated successfully"
        })

    except Exception as e:
        print("ERROR:", str(e))
        return jsonify({"success": False, "error": str(e)}), 500


# -----------------------------
#  CREATE PATIENT   (THIS IS WHAT REACT CALLS)
# -----------------------------
@app.route("/patients", methods=["POST"])
def create_patient():
    data = request.json

    full_name = data.get("full_name")
    gender = data.get("gender")
    age = data.get("age")
    phone = data.get("phone")
    address = data.get("address")
    diseases = data.get("diseases")
    latitude = data.get("latitude")
    longitude = data.get("longitude")

    try:
        db = get_db()
        cursor = db.cursor()

        query = """
            INSERT INTO patients 
            (full_name, gender, age, phone_number, address, diseases, latitude, longitude)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """

        cursor.execute(query, (
            full_name, gender, age,
            phone, address, diseases,
            latitude, longitude
        ))
        db.commit()

        new_id = cursor.lastrowid

        cursor.close()
        db.close()

        patient_id = new_id

        return jsonify({
            "success": True,
            "data": {"patientId": new_id}
        })

    except Exception as e:
        print("ERROR:", str(e))
        return jsonify({"success": False, "error": str(e)}), 500


# -----------------------------
#  CALCULATE DISTANCE (Haversine formula)
# -----------------------------
def calculate_distance(lat1, lon1, lat2, lon2):
    """Calculate distance between two coordinates in kilometers"""
    if not all([lat1, lon1, lat2, lon2]):
        return None
    
    # Convert to radians
    lat1_rad = math.radians(float(lat1))
    lon1_rad = math.radians(float(lon1))
    lat2_rad = math.radians(float(lat2))
    lon2_rad = math.radians(float(lon2))
    
    # Haversine formula
    dlat = lat2_rad - lat1_rad
    dlon = lon2_rad - lon1_rad
    a = math.sin(dlat/2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlon/2)**2
    c = 2 * math.asin(math.sqrt(a))
    distance_km = 6371 * c  # Earth radius in km
    
    return round(distance_km, 2)


# -----------------------------
#  GET FORM DATA FOR NEAREST HOSPITAL REPORT
# -----------------------------
@app.route("/reports/nearest-hospital/form-data", methods=["GET"])
def get_nearest_hospital_form_data():
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)
        
        # Get all patients
        query_patients = "SELECT patient_id, full_name, diseases, latitude, longitude FROM patients ORDER BY full_name"
        cursor.execute(query_patients)
        patients = cursor.fetchall()
        
        # Get all distinct doctor specialties
        query_specialties = "SELECT DISTINCT specialty FROM doctors WHERE specialty IS NOT NULL AND specialty != '' ORDER BY specialty"
        cursor.execute(query_specialties)
        specialties = cursor.fetchall()
        
        cursor.close()
        db.close()
        
        # Transform patients
        transformed_patients = []
        for patient in patients:
            transformed_patients.append({
                "PatientID": patient.get("patient_id"),
                "FullName": patient.get("full_name"),
                "Diseases": patient.get("diseases"),
                "Latitude": patient.get("latitude"),
                "Longitude": patient.get("longitude")
            })
        
        # Transform specialties
        transformed_specialties = [spec.get("specialty") for spec in specialties if spec.get("specialty")]
        
        return jsonify({
            "success": True,
            "data": {
                "patients": transformed_patients,
                "specializations": transformed_specialties
            }
        })
        
    except Exception as e:
        print("ERROR:", str(e))
        return jsonify({"success": False, "error": "Error fetching form data"}), 500


# -----------------------------
#  GET NEAREST HOSPITAL REPORT
# -----------------------------
@app.route("/reports/nearest-hospital", methods=["GET"])
def get_nearest_hospital():
    try:
        patient_id = request.args.get("patientId", type=int)
        specialization = request.args.get("specialization", type=str)
        
        if not patient_id:
            return jsonify({"success": False, "error": "Patient ID is required"}), 400
        
        db = get_db()
        cursor = db.cursor(dictionary=True)
        
        # Get patient information
        query_patient = "SELECT * FROM patients WHERE patient_id = %s"
        cursor.execute(query_patient, (patient_id,))
        patient = cursor.fetchone()
        
        if not patient:
            cursor.close()
            db.close()
            return jsonify({"success": False, "error": "Patient not found"}), 404
        
        # Check if patient has location
        if not patient.get("latitude") or not patient.get("longitude"):
            cursor.close()
            db.close()
            return jsonify({
                "success": False,
                "hasLocation": False,
                "error": "Patient location not set"
            }), 400
        
        patient_lat = patient.get("latitude")
        patient_lon = patient.get("longitude")
        
        # Get all hospitals
        query_hospitals = "SELECT * FROM hospitals WHERE latitude IS NOT NULL AND longitude IS NOT NULL"
        cursor.execute(query_hospitals)
        hospitals = cursor.fetchall()
        
        # Calculate distances and get doctors for each hospital
        results = []
        for hospital in hospitals:
            hospital_lat = hospital.get("latitude")
            hospital_lon = hospital.get("longitude")
            
            # Calculate distance
            distance = calculate_distance(patient_lat, patient_lon, hospital_lat, hospital_lon)
            
            if distance is None:
                continue
            
            # Get doctors at this hospital (through appointments)
            # If specialization is provided, filter by it
            if specialization:
                query_doctors = """
                    SELECT DISTINCT d.doctor_id, d.full_name, d.specialty, d.phone_number,
                           dep.department_name
                    FROM doctors d
                    LEFT JOIN departments dep ON d.department_id = dep.department_id
                    INNER JOIN appointments a ON d.doctor_id = a.doctor_id
                    WHERE a.hospital_id = %s AND d.specialty = %s
                """
                cursor.execute(query_doctors, (hospital.get("hospital_id"), specialization))
            else:
                query_doctors = """
                    SELECT DISTINCT d.doctor_id, d.full_name, d.specialty, d.phone_number,
                           dep.department_name
                    FROM doctors d
                    LEFT JOIN departments dep ON d.department_id = dep.department_id
                    INNER JOIN appointments a ON d.doctor_id = a.doctor_id
                    WHERE a.hospital_id = %s
                """
                cursor.execute(query_doctors, (hospital.get("hospital_id"),))
            
            doctors = cursor.fetchall()
            
            # Transform doctors
            transformed_doctors = []
            for doctor in doctors:
                transformed_doctors.append({
                    "DoctorID": doctor.get("doctor_id"),
                    "FullName": doctor.get("full_name"),
                    "Specialty": doctor.get("specialty"),
                    "PhoneNumber": doctor.get("phone_number"),
                    "DepartmentName": doctor.get("department_name")
                })
            
            # Transform hospital
            transformed_hospital = {
                "HospitalID": hospital.get("hospital_id"),
                "Name": hospital.get("hospital_name"),
                "Address": hospital.get("address"),
                "City": hospital.get("city"),
                "PhoneNumber": hospital.get("phone"),
                "distance": distance
            }
            
            results.append({
                "hospital": transformed_hospital,
                "doctors": transformed_doctors
            })
        
        # Sort by distance
        results.sort(key=lambda x: x["hospital"]["distance"])
        
        # Transform patient
        transformed_patient = {
            "PatientID": patient.get("patient_id"),
            "FullName": patient.get("full_name"),
            "Diseases": patient.get("diseases"),
            "Latitude": patient.get("latitude"),
            "Longitude": patient.get("longitude")
        }
        
        cursor.close()
        db.close()
        
        return jsonify({
            "success": True,
            "data": {
                "patient": transformed_patient,
                "results": results
            }
        })
        
    except Exception as e:
        print("ERROR:", str(e))
        return jsonify({"success": False, "error": "Error generating report"}), 500


# -----------------------------
#  BILLING ENDPOINTS
# -----------------------------

# -----------------------------
#  ADMISSIONS ENDPOINTS
# -----------------------------

# GET ALL ADMISSIONS
@app.route("/admissions", methods=["GET"])
def get_all_admissions():
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)

        query = """
            SELECT a.admission_id, a.admission_date, a.condition_description,
                   a.patient_id, a.room_id,
                   p.full_name AS patient_name,
                   r.room_id AS room_number, r.room_type, r.room_status,
                   h.hospital_name
            FROM admissions a
            LEFT JOIN patients p ON a.patient_id = p.patient_id
            LEFT JOIN rooms r ON a.room_id = r.room_id
            LEFT JOIN hospitals h ON r.hospital_id = h.hospital_id
            ORDER BY a.admission_date DESC
        """
        cursor.execute(query)
        admissions = cursor.fetchall()

        cursor.close()
        db.close()

        # Transform to frontend format
        transformed_admissions = []
        for admission in admissions:
            transformed_admissions.append({
                "AdmissionID": admission.get("admission_id"),
                "PatientID": admission.get("patient_id"),
                "PatientName": admission.get("patient_name"),
                "AdmissionDate": admission.get("admission_date").isoformat() if admission.get("admission_date") else None,
                "RoomNumber": str(admission.get("room_number")) if admission.get("room_number") else None,
                "RoomType": admission.get("room_type"),
                "HospitalName": admission.get("hospital_name"),
                "ConditionDescription": admission.get("condition_description"),
                "RoomStatus": admission.get("room_status")
            })

        return jsonify({"success": True, "data": transformed_admissions})

    except Exception as e:
        print("ERROR:", str(e))
        return jsonify({"success": False, "error": "Error fetching admissions"}), 500


# GET FORM DATA FOR ADMISSIONS
@app.route("/admissions/form-data", methods=["GET"])
def get_admissions_form_data():
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)

        # Get all patients
        query_patients = "SELECT patient_id, full_name FROM patients ORDER BY full_name"
        cursor.execute(query_patients)
        patients = cursor.fetchall()

        # Get available rooms
        query_rooms = """
            SELECT r.room_id, r.room_type, r.room_status, h.hospital_name
            FROM rooms r
            LEFT JOIN hospitals h ON r.hospital_id = h.hospital_id
            WHERE r.room_status = 'Available'
            ORDER BY r.room_id
        """
        cursor.execute(query_rooms)
        rooms = cursor.fetchall()

        cursor.close()
        db.close()

        # Transform patients
        transformed_patients = []
        for patient in patients:
            transformed_patients.append({
                "PatientID": patient.get("patient_id"),
                "FullName": patient.get("full_name")
            })

        # Transform rooms
        transformed_rooms = []
        for room in rooms:
            transformed_rooms.append({
                "RoomID": room.get("room_id"),
                "RoomNumber": str(room.get("room_id")),
                "RoomType": room.get("room_type"),
                "HospitalName": room.get("hospital_name"),
                "Status": room.get("room_status")
            })

        return jsonify({
            "success": True,
            "data": {
                "patients": transformed_patients,
                "rooms": transformed_rooms
            }
        })

    except Exception as e:
        print("ERROR:", str(e))
        return jsonify({"success": False, "error": "Error fetching form data"}), 500


# CREATE ADMISSION
@app.route("/admissions", methods=["POST"])
def create_admission():
    try:
        data = request.json

        patient_id = data.get("PatientID")
        room_id = data.get("RoomID")
        condition_description = data.get("ConditionDescription", "")

        if not patient_id or not room_id:
            return jsonify({"success": False, "error": "Patient ID and Room ID are required"}), 400

        db = get_db()
        cursor = db.cursor()

        # Check if room is available
        cursor.execute("SELECT room_status FROM rooms WHERE room_id = %s", (room_id,))
        room = cursor.fetchone()
        if not room:
            cursor.close()
            db.close()
            return jsonify({"success": False, "error": "Room not found"}), 404

        if room[0] != "Available":
            cursor.close()
            db.close()
            return jsonify({"success": False, "error": "Room is not available"}), 400

        # Get next admission_id
        cursor.execute("SELECT MAX(admission_id) as max_id FROM admissions")
        result = cursor.fetchone()
        next_id = (result[0] or 0) + 1

        query = """
            INSERT INTO admissions (admission_id, admission_date, condition_description, patient_id, room_id)
            VALUES (%s, %s, %s, %s, %s)
        """
        cursor.execute(query, (next_id, date.today(), condition_description, patient_id, room_id))

        # Update room status to Occupied
        cursor.execute("UPDATE rooms SET room_status = 'Occupied' WHERE room_id = %s", (room_id,))

        db.commit()

        new_id = cursor.lastrowid or next_id

        cursor.close()
        db.close()

        return jsonify({
            "success": True,
            "data": {"admissionId": new_id}
        })

    except Exception as e:
        print("ERROR:", str(e))
        return jsonify({"success": False, "error": str(e)}), 500


# DISCHARGE PATIENT
@app.route("/admissions/<int:admission_id>/discharge", methods=["POST"])
def discharge_patient(admission_id):
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)

        # Get admission with room info
        query = """
            SELECT a.room_id, r.room_status
            FROM admissions a
            LEFT JOIN rooms r ON a.room_id = r.room_id
            WHERE a.admission_id = %s
        """
        cursor.execute(query, (admission_id,))
        admission = cursor.fetchone()

        if not admission:
            cursor.close()
            db.close()
            return jsonify({"success": False, "error": "Admission not found"}), 404

        room_id = admission.get("room_id")

        # Update room status back to Available
        if room_id:
            cursor.execute("UPDATE rooms SET room_status = 'Available' WHERE room_id = %s", (room_id,))

        # Note: In a real system, you might want to mark the admission as discharged
        # instead of deleting it. For now, we'll just free up the room.
        # You could add a discharge_date column or status column to track this.

        db.commit()

        cursor.close()
        db.close()

        return jsonify({
            "success": True,
            "message": "Patient discharged successfully"
        })

    except Exception as e:
        print("ERROR:", str(e))
        return jsonify({"success": False, "error": str(e)}), 500


if __name__ == "__main__":
    app.run(port=5000, debug=True)
