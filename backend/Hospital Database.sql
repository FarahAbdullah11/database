-- ================================ Create & Use Database ================================
DROP DATABASE IF EXISTS Hospital;
CREATE DATABASE Hospital;
USE Hospital;

-- ================================ 1. Departments ================================ 
CREATE TABLE departments (
    department_id INT PRIMARY KEY,
    department_name VARCHAR(100),
    location VARCHAR(100)
);

-- ================================  2. Patients  ================================ 
CREATE TABLE patients (
    patient_id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100),
    gender VARCHAR(50),
    age INT,
    address VARCHAR(200),
    phone_number VARCHAR(20),
    diseases VARCHAR(50),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8)
);

-- ================================  3. HOSPITAL ================================ 
CREATE TABLE hospitals (
    hospital_id INT PRIMARY KEY AUTO_INCREMENT,  
    hospital_name VARCHAR(100) NOT NULL,
    address VARCHAR(100),
    city VARCHAR(50),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    phone VARCHAR(20)
);

-- ================================  4. DOCTORS ================================ 
CREATE TABLE doctors (
    doctor_id INT PRIMARY KEY,
    full_name VARCHAR(100),
    phone_number VARCHAR(20),
    specialty VARCHAR(100),
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES departments(department_id)
);

-- ================================  5. ROOMS  ================================  
CREATE TABLE rooms (
    room_id INT PRIMARY KEY,
    room_type VARCHAR(50),
    room_status VARCHAR(50),
    hospital_id INT,
    FOREIGN KEY (hospital_id) REFERENCES hospitals(hospital_id)
);

-- ================================ 6. APPOINTMENTS ================================
CREATE TABLE appointments (
    appointment_id INT PRIMARY KEY,
    appointment_datetime DATETIME,
    reason VARCHAR(200),
    appointments_status VARCHAR(50),
    patient_id INT,
    doctor_id INT,
    hospital_id INT,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id),
    FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id),
    FOREIGN KEY (hospital_id) REFERENCES hospitals(hospital_id)    
);

-- ================================ 7. ADMISSIONS ================================
CREATE TABLE admissions (
    admission_id INT PRIMARY KEY,
    admission_date DATE,
    condition_description VARCHAR(100),
    patient_id INT,
    room_id INT,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id),
    FOREIGN KEY (room_id) REFERENCES rooms(room_id)
);

-- ================================ 8. MEDICAL RECORD ================================
CREATE TABLE medical_records (
    record_id INT PRIMARY KEY,
    visit_date DATE,
    diagnosis VARCHAR(50),
    treatment VARCHAR(50),
    notes VARCHAR(50),
    patient_id INT,
    doctor_id INT,
    admission_id INT,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id),
    FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id),
    FOREIGN KEY (admission_id) REFERENCES admissions(admission_id)
);

-- ================================ 9. BILLS ================================ 
CREATE TABLE bills (
    bill_id INT PRIMARY KEY,
    bill_date DATE,
    amount DECIMAL(10,2),
    payment_status VARCHAR(50),
    patient_id INT,
    admission_id INT,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id),
    FOREIGN KEY (admission_id) REFERENCES admissions(admission_id)
);

-- ================================ 10. DOCTOR_PATIENT (M:N) ======================================
CREATE TABLE doctor_patient (
    doctor_id INT,
    patient_id INT,
    PRIMARY KEY (doctor_id, patient_id),
    FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id),
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id)
);
-- ====================================== 11. HOSPITAL_DOCTOR (M:M) ======================================

create table hospital_doctor(
hospital_id int,
doctor_id int, 
Foreign KEY ( hospital_id) references  hospitals(hospital_id),
foreign key (doctor_id) references doctors(doctor_id)
);

-- ================================ 11. ROOM RESERVATION (M:N) ================================
CREATE TABLE room_reservations (
    patient_id INT,
    room_id INT,
    reservation_date DATE,
    PRIMARY KEY (patient_id, room_id),
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id),
    FOREIGN KEY (room_id) REFERENCES rooms(room_id)
);


-- ================================  INSERT PART  ================================ 

INSERT INTO departments VALUES
(1, 'Cardiology', 'Building A'),
(2, 'Neurology', 'Building B'),
(3, 'Orthopedics', 'Building C'),
(4, 'Pediatrics', 'Building D'),
(5, 'Oncology', 'Building E'),
(6, 'Dermatology', 'Building F'),
(7, 'ENT', 'Building G'),
(8, 'Urology', 'Building H'),
(9, 'Ophthalmology', 'Building I'),
(10, 'Emergency', 'Ground Floor');

INSERT INTO patients 
(full_name, gender, age, address, phone_number, diseases, latitude, longitude) VALUES
( 'Ahmed Hassan', 'Male', 30, 'Cairo', '01011111111', 'Diabetes', NULL, NULL),
( 'Sara Ali', 'Female', 25, 'Giza', '01022222222', 'Asthma', NULL, NULL),
( 'Omar Khaled', 'Male', 40, 'Alex', '01033333333', 'Hypertension', NULL, NULL),
( 'Mona Adel', 'Female', 35, 'Cairo', '01044444444', 'Anemia', NULL, NULL),
( 'Youssef Samir', 'Male', 20, 'Tanta', '01055555555', 'Allergy', NULL, NULL),
( 'Heba Mahmoud', 'Female', 28, 'Mansoura', '01066666666', 'Migraine', NULL, NULL),
( 'Mostafa Nabil', 'Male', 50, 'Aswan', '01077777777', 'Heart Disease', NULL, NULL),
( 'Nour Hassan', 'Female', 18, 'Fayoum', '01088888888', 'Flu', NULL, NULL),
( 'Karim Fathy', 'Male', 45, 'Ismailia', '01099999999', 'Back Pain', NULL, NULL),
( 'Laila Sameh', 'Female', 60, 'Cairo', '01100000000', 'Arthritis', NULL, NULL),
( 'Malak Hassan', 'Female', 21, 'Giza', '01024579604', 'Back Pain', NULL, NULL),
( 'Noha Yasser', 'Female', 50, 'Cairo', '0124790562', 'Diabetes', NULL, NULL),
( 'Ali Mahmoud', 'Male', 42, 'Alex', '01012345678', 'Hypertension', NULL, NULL),
( 'Fatma Salah', 'Female', 33, 'Cairo', '01123456789', 'Diabetes', NULL, NULL),
( 'Khaled Osman', 'Male', 27, 'Giza', '01234567890', 'Allergy', NULL, NULL),
( 'Aya Ramadan', 'Female', 19, 'Tanta', '01098765432', 'Flu', NULL, NULL),
( 'Hossam Gamal', 'Male', 55, 'Mansoura', '01187654321', 'Heart Disease', NULL, NULL),
( 'Mariam Tarek', 'Female', 38, 'Cairo', '01276543210', 'Anemia', NULL, NULL),
( 'Ziad Farouk', 'Male', 48, 'Ismailia', '01055667788', 'Back Pain', NULL, NULL),
( 'Salma Hany', 'Female', 29, 'Fayoum', '01166778899', 'Asthma', NULL, NULL);

-- Cairo patients - spread around different districts
UPDATE patients SET latitude = 30.0522, longitude = 31.2451 WHERE patient_id = 1;   -- Ahmed Hassan (Downtown - ~8 km from Nile)
UPDATE patients SET latitude = 30.0444, longitude = 31.2357 WHERE patient_id = 4;   -- Mona Adel (keep close to Nile - ~0 km, intentional)
UPDATE patients SET latitude = 30.0378, longitude = 31.2269 WHERE patient_id = 12;  -- Noha Yasser (Maadi - ~2 km from Nile)
UPDATE patients SET latitude = 30.0602, longitude = 31.3268 WHERE patient_id = 14;  -- Fatma Salah (Nasr City - ~10 km)
UPDATE patients SET latitude = 30.0278, longitude = 31.4622 WHERE patient_id = 18;  -- Mariam Tarek (New Cairo - ~20 km)

-- Giza patients
UPDATE patients SET latitude = 30.0200, longitude = 31.2000 WHERE patient_id = 2;   -- Sara Ali (~3 km from City Hospital)
UPDATE patients SET latitude = 30.0566, longitude = 31.2001 WHERE patient_id = 11;  -- Malak Hassan (Mohandessin - ~5 km)
UPDATE patients SET latitude = 29.9632, longitude = 30.9261 WHERE patient_id = 15;  -- Khaled Osman (6th October - ~15 km from City)

-- Alexandria patients
UPDATE patients SET latitude = 31.2150, longitude = 29.9400 WHERE patient_id = 3;   -- Omar Khaled (~3 km from Future Hospital)
UPDATE patients SET latitude = 31.2190, longitude = 29.9422 WHERE patient_id = 13;  -- Ali Mahmoud (Sidi Gaber - ~4 km)

-- Tanta patients
UPDATE patients SET latitude = 30.7900, longitude = 31.0050 WHERE patient_id = 5;   -- Youssef Samir (~2 km from Hope)
UPDATE patients SET latitude = 30.7830, longitude = 30.9950 WHERE patient_id = 16;  -- Aya Ramadan (~3 km)

-- Mansoura patients
UPDATE patients SET latitude = 31.0450, longitude = 31.3850 WHERE patient_id = 6;   -- Heba Mahmoud (~1 km)
UPDATE patients SET latitude = 31.0350, longitude = 31.3750 WHERE patient_id = 17;  -- Hossam Gamal (~2 km)

-- Aswan patient
UPDATE patients SET latitude = 24.0900, longitude = 32.9000 WHERE patient_id = 7;   -- Mostafa Nabil (~0.2 km - very close)

-- Fayoum patients
UPDATE patients SET latitude = 29.3150, longitude = 30.8500 WHERE patient_id = 8;   -- Nour Hassan (~1 km)
UPDATE patients SET latitude = 29.3050, longitude = 30.8400 WHERE patient_id = 20;  -- Salma Hany (~2 km)

-- Ismailia patients
UPDATE patients SET latitude = 30.6000, longitude = 32.2750 WHERE patient_id = 9;   -- Karim Fathy (~1 km)
UPDATE patients SET latitude = 30.5900, longitude = 32.2700 WHERE patient_id = 19;  -- Ziad Farouk (~2 km)

-- Laila Sameh (patient 10) - Cairo, Sheikh Zayed area
UPDATE patients SET latitude = 30.0561, longitude = 31.0232 WHERE patient_id = 10;  -- ~15 km from Nile, close to Central Hospital


INSERT INTO hospitals (hospital_name, address, city, latitude, longitude, phone) VALUES
('Nile Hospital', '123 Corniche El Nil, Maadi', 'Cairo', 30.044400, 31.235700, '0221111111'),
('City Hospital', '45 Pyramid Street, Haram', 'Giza', 30.013100, 31.208900, '0222222222'),
('Future Hospital', 'Smouha Medical District', 'Alexandria', 31.200100, 29.918700, '0333333333'),
('Hope Hospital', 'El Guish Street, Downtown', 'Tanta', 30.786500, 31.000400, '0444444444'),
('Life Care Hospital', 'Gamal Abdel Nasser St.', 'Mansoura', 31.039200, 31.380700, '0555555555'),
('Royal Hospital', 'Corniche El Nil, Luxor Road', 'Aswan', 24.088900, 32.899800, '0666666666'),
('Green Valley Hospital', 'Fayoum City Center', 'Fayoum', 29.309900, 30.844100, '0777777777'),
('Health Plus Hospital', 'Port Tawfik District', 'Suez', 29.966800, 32.549800, '0888888888'),
('Sunrise Hospital', 'El Sheikh Zayed District', 'Ismailia', 30.596500, 32.271500, '0999999999'),
('Central Hospital', '26th of July Corridor, Sheikh Zayed', 'Cairo', 30.056100, 31.023200, '0230000000'),
('Dar Al Shifa Hospital', 'Mohandessin, Gameat Al Dewal St.', 'Giza', 30.056600, 31.200100, '0231111111'),
('Al Salam International Hospital', 'Corniche El Nil, Maadi', 'Cairo', 30.037800, 31.226900, '0223333333'),
('Cleopatra Hospital', 'Heliopolis, Merryland', 'Cairo', 30.112500, 31.342200, '0224444444'),
('Andalusia Hospital', 'Al Hay Al Sabea, Nasr City', 'Cairo', 30.060200, 31.326800, '0225555555'),
('Ganzouri Specialized Hospital', 'New Cairo, Fifth Settlement', 'Cairo', 30.027800, 31.462200, '0226666666'),
('Saudi German Hospital', '6th of October City', 'Giza', 29.963200, 30.926100, '0237777777'),
('El Nozha International Hospital', 'El Nozha, Heliopolis', 'Cairo', 30.103300, 31.337800, '0228888888'),
('Alexandria Medical Center', 'Sidi Gaber', 'Alexandria', 31.219000, 29.942200, '0339999999'),
('Wadi El Nil Hospital', 'Mohandessin', 'Giza', 30.050100, 31.191900, '0234444444'),
('Misr International Hospital', 'Dokki', 'Giza', 30.036200, 31.212400, '0235555555');

INSERT INTO doctors VALUES
(1, 'Dr. Mohamed Adel', '01010101010', 'Cardiologist', 1),
(2, 'Dr. Salma Youssef', '01020202020', 'Neurologist', 2),
(3, 'Dr. Tarek Nabil', '01030303030', 'Orthopedic', 3),
(4, 'Dr. Reem Hassan', '01040404040', 'Pediatrician', 4),
(5, 'Dr. Hany Fawzy', '01050505050', 'Oncologist', 5),
(6, 'Dr. Dina Samir', '01060606060', 'Dermatologist', 6),
(7, 'Dr. Wael Mostafa', '01070707070', 'ENT Specialist', 7),
(8, 'Dr. Karim Ashraf', '01080808080', 'Urologist', 8),
(9, 'Dr. Lina Nasser', '01090909090', 'Ophthalmologist', 9),
(10, 'Dr. Amr Salah', '01101010101', 'Emergency Physician', 10),
(11, 'Dr. Ahmed Farouk', '01111111111', 'Cardiologist',1),  
(12, 'Dr. Sara Kamal', '01122222222', 'Neurologist', 2),  
(13, 'Dr. Osama Reda', '01133333333', 'Orthopedic', 3),
(14, 'Dr. Mona Lotfy','01144444444', 'Pediatrician', 4), 
(15, 'Dr. Hossam El Din', '01155555555', 'Oncologist', 5),  
(16, 'Dr. Rania Gamal','01166666666', 'Dermatologist', 6), 
(17, 'Dr. Khaled Sobhy','01177777777', 'ENT Specialist',7), 
(18, 'Dr. Yasser Mahmoud','01188888888', 'Cardiologist', 1),  
(19, 'Dr. Nadia Ali', '01199999999', 'Ophthalmologist', 9),  
(20, 'Dr. Tamer Hassan','01200000000', 'Emergency Physician', 10);

INSERT INTO rooms VALUES
(1, 'ICU', 'Occupied', 1),
(2, 'Single', 'Available', 1),
(3, 'Double', 'Available', 2),
(4, 'ICU', 'Occupied', 3),
(5, 'Single', 'Available', 4),
(6, 'Double', 'Occupied', 5),
(7, 'ICU', 'Available', 6),
(8, 'Single', 'Occupied', 7),
(9, 'Double', 'Available', 8),
(10, 'ICU', 'Available', 9),
(11, 'Single','Occupied', 1),
(12, 'Double','Available', 2),
(13, 'ICU','Occupied', 10),
(14, 'Single','Available', 3),
(15, 'VIP','Available',  1),
(16, 'Double','Occupied', 4),
(17, 'ICU','Available', 5),
(18, 'Single','Occupied',6),
(19, 'Double','Available',7),
(20, 'VIP', 'Occupied',8);

INSERT INTO appointments VALUES
(1, '2025-01-10 10:00:00', 'Heart Checkup', 'Completed', 1, 1, 1),
(2, '2025-01-11 11:00:00', 'Brain Scan', 'Completed', 2, 2, 2),
(3, '2025-01-12 09:00:00', 'Bone Pain', 'Scheduled', 3, 3, 3),
(4, '2025-01-13 13:00:00', 'Child Fever', 'Cancelled', 4, 4, 4),
(5, '2025-01-14 14:00:00', 'Cancer Follow-up', 'Scheduled', 5, 5, 5),
(6, '2025-01-15 15:00:00', 'Skin Rash', 'Completed', 6, 6, 6),
(7, '2025-01-16 10:30:00', 'Ear Infection', 'Completed', 7, 7, 7),
(8, '2025-01-17 12:00:00', 'Kidney Pain', 'Cancelled', 8, 8, 8),
(9, '2025-01-18 09:30:00', 'Eye Checkup', 'Completed', 9, 9, 9),
(10, '2025-01-19 16:00:00', 'Emergency Case', 'Completed', 10, 10, 10),
(11, '2025-01-20 08:00:00', 'Heart Checkup', 'Cancelled', 11,  1,  1),  
(12, '2025-01-21 14:30:00', 'Cancer Follow-up', 'Scheduled', 12,  5,  5),  
(13, '2025-01-22 11:00:00', 'Skin Rash', 'Completed', 13,  6,  6),  
(14, '2025-01-23 15:30:00', 'Bone Pain', 'Scheduled', 14,  3,  3),  
(15, '2025-01-24 09:00:00', 'Eye Checkup', 'Completed', 15,  9,  9),  
(16, '2025-01-25 12:00:00', 'Heart Checkup', 'Cancelled', 16, 11,  1),  
(17, '2025-01-26 10:00:00', 'Kidney Pain', 'Scheduled', 17,  8,  8),  
(18, '2025-01-27 13:30:00', 'Ear Infection', 'Completed', 18,  7,  7),  
(19, '2025-01-28 16:00:00', 'Emergency Case', 'Cancelled', 19, 10, 10),  
(20, '2025-01-29 11:30:00', 'Brain Scan', 'Completed', 20,  2,  2);

INSERT INTO admissions VALUES
(1, '2025-01-10', 'Heart Surgery', 1, 1),
(2, '2025-01-11', 'Observation', 2, 2),
(3, '2025-01-12', 'Fracture', 3, 3),
(4, '2025-01-13', 'High Fever', 4, 4),
(5, '2025-01-14', 'Chemotherapy', 5, 5),
(6, '2025-01-15', 'Skin Infection', 6, 6),
(7, '2025-01-16', 'ENT Surgery', 7, 7),
(8, '2025-01-17', 'Kidney Stones', 8, 8),
(9, '2025-01-18', 'Eye Surgery', 9, 9),
(10, '2025-01-19', 'Emergency Trauma', 10, 10),
(11, '2025-01-20', 'Heart Surgery', 11, 11),  
(12, '2025-01-21', 'Chemotherapy', 12, 12),  
(13, '2025-01-22', 'Kidney Stones',13, 13),  
(14, '2025-01-23', 'Fracture', 14, 14),  
(15, '2025-01-24', 'Skin Infection', 15, 15),  
(16, '2025-01-25', 'Heart Surgery', 16, 16),  
(17, '2025-01-26', 'Eye Surgery', 17, 17),  
(18, '2025-01-27', 'ENT Surgery', 18, 18),  
(19, '2025-01-28', 'Emergency Trauma', 19, 19),  
(20, '2025-01-29', 'High Fever', 20, 20);

INSERT INTO medical_records VALUES
(1, '2025-01-10', 'Heart Disease', 'Surgery', 'Stable', 1, 1, 1),
(2, '2025-01-11', 'Migraine', 'Medication', 'Improved', 2, 2, 2),
(3, '2025-01-12', 'Broken Leg', 'Casting', 'Good recovery', 3, 3, 3),
(4, '2025-01-13', 'Flu', 'Medication', 'Recovered', 4, 4, 4),
(5, '2025-01-14', 'Cancer', 'Chemotherapy', 'Ongoing', 5, 5, 5),
(6, '2025-01-15', 'Skin Allergy', 'Cream', 'Improving', 6, 6, 6),
(7, '2025-01-16', 'Sinusitis', 'Antibiotics', 'Stable', 7, 7, 7),
(8, '2025-01-17', 'Kidney Stones', 'Surgery', 'Recovered', 8, 8, 8),
(9, '2025-01-18', 'Cataract', 'Surgery', 'Successful', 9, 9, 9),
(10, '2025-01-19', 'Multiple Injuries', 'Emergency Care', 'Critical', 10, 10, 10),
(11, '2025-01-20', 'Heart Disease','Surgery',  'Stable', 11, 11, 11),  
(12, '2025-01-21', 'Cancer', 'Chemotherapy', 'Ongoing', 12,  5, 12),  
(13, '2025-01-22', 'Kidney Stones', 'Surgery', 'Recovered',     13,  8, 13),  
(14, '2025-01-23', 'Broken Leg','Casting', 'Good recovery', 14,  3, 14),  
(15, '2025-01-24', 'Skin Allergy','Cream','Improving', 15,  6, 15),  
(16, '2025-01-25', 'Heart Disease','Surgery', 'Post-op care',  16,  1, 16),  
(17, '2025-01-26', 'Cataract', 'Surgery', 'Successful', 17,  9, 17),  
(18, '2025-01-27', 'Sinusitis', 'Antibiotics', 'Stable', 18,  7, 18),  
(19, '2025-01-28', 'Multiple Injuries', 'Emergency Care', 'Recovering', 19, 10, 19),  
(20, '2025-01-29', 'Flu','Medication', 'Recovered', 20,  4, 20);

INSERT INTO bills VALUES
(1, '2025-01-11', 15000, 'Paid', 1, 1),
(2, '2025-01-12', 3000, 'Paid', 2, 2),
(3, '2025-01-13', 7000, 'Unpaid', 3, 3),
(4, '2025-01-14', 1200, 'Paid', 4, 4),
(5, '2025-01-15', 25000, 'Unpaid', 5, 5),
(6, '2025-01-16', 900, 'Paid', 6, 6),
(7, '2025-01-17', 6000, 'Paid', 7, 7),
(8, '2025-01-18', 11000, 'Unpaid', 8, 8),
(9, '2025-01-19', 8000, 'Paid', 9, 9),
(10, '2025-01-20', 20000, 'Unpaid', 10, 10),
(11, '2025-01-21', 15000.00, 'Paid', 11, 11),  
(12, '2025-01-22', 25000.00, 'Unpaid', 12, 12),  
(13, '2025-01-23',  7000.00, 'Unpaid', 13, 13),  
(14, '2025-01-24',  3000.00, 'Paid', 14, 14),  
(15, '2025-01-25', 11000.00, 'Paid', 15, 15),  
(16, '2025-01-26', 15000.00, 'Unpaid', 16, 16),  
(17, '2025-01-27',  6000.00, 'Paid', 17, 17), 
(18, '2025-01-28', 20000.00, 'Paid', 18, 18),  
(19, '2025-01-29',  8000.00, 'Unpaid', 19, 19),  
(20, '2025-01-30', 12000.00, 'Paid', 20, 20);

-- ================================ 10. DOCTOR_PATIENT (M:N) ======================================
CREATE TABLE doctor_patient (
    doctor_id INT,
    patient_id INT,
    PRIMARY KEY (doctor_id, patient_id),
    FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id),
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id)
);
-- ====================================== 11. HOSPITAL_DOCTOR (M:M) ======================================

create table hospital_doctor(
hospital_id int,
doctor_id int, 
Foreign KEY ( hospital_id) references  hospitals(hospital_id),
foreign key (doctor_id) references doctors(doctor_id)
);

-- ================================ 11. ROOM RESERVATION (M:N) ================================
CREATE TABLE room_reservations (
    patient_id INT,
    room_id INT,
    reservation_date DATE,
    PRIMARY KEY (patient_id, room_id),
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id),
    FOREIGN KEY (room_id) REFERENCES rooms(room_id)
);

-- ================================ SELECT PART WITH PARAMETERS ================================ 

-- 1- BASIS SELECT 
SET @patient_id_param = 1;
SELECT * FROM patients WHERE patient_id = @patient_id_param;

SET @doctor_id_param = 1;
SELECT * FROM doctors WHERE doctor_id = @doctor_id_param;

SET @hospital_id_param = 1;
SELECT * FROM hospitals WHERE hospital_id = @hospital_id_param;

-- 2- WHERE (with parameter)
SET @disease_param = 'Diabetes';
SELECT full_name, diseases
FROM patients
WHERE diseases = @disease_param OR diseases = 'Hypertension';

-- 3- by limit (parameterized)
SET @limit_param = 5;
SELECT appointment_datetime, reason, full_name
FROM appointments a JOIN patients p ON a.patient_id = p.patient_id
ORDER BY appointment_datetime DESC
LIMIT @limit_param;

-- 4- select by distinct (no direct param needed, but can be filtered)
SET @specialty_filter = '%';
SELECT DISTINCT specialty
FROM doctors 
WHERE specialty LIKE @specialty_filter
ORDER BY specialty ASC;

-- 6- AGGREGATE (parameterized max amount)
SET @max_amount = (SELECT MAX(amount) FROM bills);
SELECT p.full_name, b.amount
FROM patients p
JOIN bills b ON p.patient_id = b.patient_id
WHERE b.amount = @max_amount;

-- 7- WITH HAVING (parameterized min count)
SET @min_patient_count = 1;
SELECT d.full_name, d.specialty, COUNT(dp.patient_id) AS patient_count
FROM doctors d
JOIN doctor_patient dp ON d.doctor_id = dp.doctor_id
GROUP BY d.doctor_id, d.full_name, d.specialty
HAVING COUNT(dp.patient_id) > @min_patient_count;

-- ================================  NESTED QUERY WITH PARAMETERS ================================  

-- Patients with Scheduled appointments
SET @status_param = 'Scheduled';
SELECT full_name, phone_number
FROM patients
WHERE patient_id IN (
    SELECT patient_id
    FROM appointments
    WHERE appointments_status = @status_param
);

-- Unpaid bills for recent admissions
SET @payment_status_param = 'Unpaid';
SET @date_threshold = '2025-01-15';
SELECT bill_date, amount, payment_status
FROM bills
WHERE payment_status = @payment_status_param
AND admission_id IN (
    SELECT admission_id
    FROM admissions
    WHERE admission_date > @date_threshold
);

-- Nearest Hospital (per patient, using parameter for one patient)
SET @target_patient_id = 1;
SELECT
    p.patient_id,
    p.full_name,
    h.hospital_name,
    h.city AS hospital_city,
    ROUND(
        6371 * ACOS(
            COS(RADIANS(p.latitude)) * COS(RADIANS(h.latitude)) *
            COS(RADIANS(h.longitude) - RADIANS(p.longitude)) +
            SIN(RADIANS(p.latitude)) * SIN(RADIANS(h.latitude))
        ), 2
    ) AS distance_km
FROM patients p
CROSS JOIN hospitals h
WHERE p.patient_id = @target_patient_id
AND p.latitude IS NOT NULL AND p.longitude IS NOT NULL
ORDER BY distance_km ASC
LIMIT 1;

-- Appointments for specific patient with Cardiologist
SET @specific_patient_id = 1;
SELECT appointment_datetime, reason, appointments_status
FROM appointments
WHERE patient_id = @specific_patient_id
AND doctor_id IN (
    SELECT doctor_id
    FROM doctors
    WHERE specialty LIKE '%Cardiologist%'
);

-- ================================  VIEW ================================ 

CREATE VIEW availableRooms AS
SELECT room_id, room_type
FROM rooms
WHERE room_status = 'Available';
-- To query: SELECT * FROM availableRooms;

CREATE VIEW cardiologists_view AS
SELECT 
    doctor_id,
    full_name,
    phone_number,
    specialty,
    department_id
FROM doctors
WHERE specialty = 'Cardiologist'
WITH CHECK OPTION;
-- To query: SELECT * FROM cardiologists_view;

CREATE VIEW doctors_in_departments AS
SELECT dr.full_name, dep.department_name
FROM doctors dr JOIN departments dep 
ON dr.department_id = dep.department_id;
-- To query: SELECT * FROM doctors_in_departments;

CREATE VIEW patient_treatment_history AS
SELECT p.full_name AS patient, d.full_name AS doctor, mr.diagnosis, mr.treatment, mr.visit_date
FROM medical_records mr
INNER JOIN patients p ON mr.patient_id = p.patient_id
INNER JOIN doctors d ON mr.doctor_id = d.doctor_id;
-- To query: SELECT * FROM patient_treatment_history;

CREATE VIEW appointments_payments AS
SELECT p.full_name AS patient, a.appointment_datetime, b.amount, b.payment_status
FROM appointments a
JOIN patients p ON a.patient_id = p.patient_id
JOIN bills b ON b.patient_id = p.patient_id;
-- To query: SELECT * FROM appointments_payments;

CREATE VIEW cancelled_appointments AS
SELECT * FROM appointments 
WHERE appointments_status = 'Cancelled';
-- To query: SELECT * FROM cancelled_appointments;

CREATE VIEW appointment_report AS
SELECT d.full_name AS doctor,
COUNT(*) AS total_appointments
FROM appointments a JOIN doctors d 
ON a.doctor_id = d.doctor_id
GROUP BY doctor;
-- To query: SELECT * FROM appointment_report;

-- ================================  GROUP BY WITH PARAMETERS ================================ 

-- Number of patients per city (filter by city if needed)
SET @city_filter = '%';
SELECT 
    address AS city,
    COUNT(patient_id) AS total_patients
FROM patients
WHERE address LIKE @city_filter
GROUP BY address;

-- Average patient age per gender (filter by gender if needed)
SET @gender_filter = '%';
SELECT 
    gender,
    AVG(age) AS average_age
FROM patients
WHERE gender LIKE @gender_filter
GROUP BY gender;

-- Minimum and maximum bill per hospital (filter by hospital name if needed)
SET @hospital_name_filter = '%';
SELECT 
    h.hospital_name,
    MIN(b.amount) AS min_bill,
    MAX(b.amount) AS max_bill
FROM hospitals h
JOIN rooms r ON h.hospital_id = r.hospital_id
JOIN admissions a ON r.room_id = a.room_id
JOIN bills b ON a.admission_id = b.admission_id
WHERE h.hospital_name LIKE @hospital_name_filter
GROUP BY h.hospital_name;

-- ================================  JOIN WITH PARAMETERS ================================ 

-- All hospitals with their rooms (even hospitals with no rooms) - filter by hospital name
SET @hospital_name_param = '%';
SELECT 
    h.hospital_name,
    r.room_id,
    r.room_type,
    r.room_status
FROM hospitals h
LEFT JOIN rooms r ON h.hospital_id = r.hospital_id
WHERE h.hospital_name LIKE @hospital_name_param;

-- All doctors and their departments (even if a department has no doctor) - filter by department name
SET @department_name_param = '%';
SELECT 
    d.full_name AS doctor_name,
    dep.department_name
FROM doctors d
RIGHT JOIN departments dep ON d.department_id = dep.department_id
WHERE dep.department_name LIKE @department_name_param;

-- All patients and all admissions (matched or not) - filter by patient name
SET @patient_name_param = '%';
SELECT 
    p.full_name AS patient_name,
    a.admission_date,
    a.condition_description
FROM patients p
LEFT JOIN admissions a ON p.patient_id = a.patient_id
WHERE p.full_name LIKE @patient_name_param

UNION

SELECT 
    p.full_name AS patient_name,
    a.admission_date,
    a.condition_description
FROM patients p
RIGHT JOIN admissions a ON p.patient_id = a.patient_id
WHERE p.full_name LIKE @patient_name_param;

-- Number of doctors in each department (filter by department name)
SET @dept_name_filter = '%';
SELECT 
    d.department_id,
    dep.department_name,
    COUNT(d.doctor_id) AS total_doctors
FROM departments dep
LEFT JOIN doctors d ON dep.department_id = d.department_id
WHERE dep.department_name LIKE @dept_name_filter
GROUP BY dep.department_id, dep.department_name;

-- Doctors who work at specific hospital (parameterized hospital_id)
SET @target_hospital_id = 1;
SELECT DISTINCT d.full_name, d.specialty
FROM doctors d
JOIN appointments a ON d.doctor_id = a.doctor_id
WHERE a.hospital_id = @target_hospital_id;

-- ================================  DSL ================================ 
CREATE USER IF NOT EXISTS 'farida'@'%' IDENTIFIED BY 'farida123!';
CREATE USER IF NOT EXISTS 'Habiba'@'%' IDENTIFIED BY 'habiba123!';
CREATE USER IF NOT EXISTS 'rawan'@'%' IDENTIFIED BY 'rawan123!';

GRANT ALL ON TABLE rooms TO 'Habiba'@'%';
GRANT ALL ON TABLE admissions TO 'Habiba'@'%';
GRANT SELECT ON TABLE appointments TO 'rawan'@'%';
GRANT ALL ON TABLE doctors TO 'farida'@'%' WITH GRANT OPTION;

REVOKE UPDATE ON TABLE admissions FROM 'Habiba'@'%';

-- =============================INDEXING=================================
CREATE INDEX idx_bills_patient ON bills(patient_id);
CREATE INDEX idx_bills_status ON bills(payment_status);
SHOW INDEX FROM bills;