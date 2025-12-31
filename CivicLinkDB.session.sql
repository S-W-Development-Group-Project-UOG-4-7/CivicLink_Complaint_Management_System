-- CivicLink Database Schema
-- Complete database structure for the complaint management system

-- Create database
CREATE DATABASE IF NOT EXISTS civiclink;
USE civiclink;

-- Drop existing tables if they exist (for fresh start)
DROP TABLE IF EXISTS complaint_photos;
DROP TABLE IF EXISTS complaints;
DROP TABLE IF EXISTS departments;
DROP TABLE IF EXISTS officers;
DROP TABLE IF EXISTS users;

-- 1. Departments Table
CREATE TABLE departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Users Table (Citizens)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    district VARCHAR(50),
    province VARCHAR(50),
    user_type ENUM('citizen', 'admin', 'officer') DEFAULT 'citizen',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. Officers Table (Department Officers & Verification Officers)
CREATE TABLE officers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    department_id INT,
    officer_type ENUM('department', 'verification') NOT NULL,
    badge_number VARCHAR(50) UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
);

-- 4. Complaints Table
CREATE TABLE complaints (
    id INT AUTO_INCREMENT PRIMARY KEY,
    complaint_id VARCHAR(20) NOT NULL UNIQUE,
    user_id INT NOT NULL,
    department_id INT NOT NULL,
    verification_officer_id INT,
    department_officer_id INT,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    complaint_type VARCHAR(50) NOT NULL,
    status ENUM('New', 'Verified', 'In Progress', 'Resolved', 'Cancelled') DEFAULT 'New',
    priority ENUM('Low', 'Medium', 'High') DEFAULT 'Medium',
    address TEXT NOT NULL,
    district VARCHAR(50) NOT NULL,
    province VARCHAR(50) NOT NULL,
    place VARCHAR(100) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    verification_officer_comment TEXT,
    department_officer_comment TEXT,
    submitted_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estimated_completion DATE,
    resolved_date TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE RESTRICT,
    FOREIGN KEY (verification_officer_id) REFERENCES officers(id) ON DELETE SET NULL,
    FOREIGN KEY (department_officer_id) REFERENCES officers(id) ON DELETE SET NULL
);

-- 5. Complaint Photos Table
CREATE TABLE complaint_photos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    complaint_id INT NOT NULL,
    photo_url VARCHAR(500) NOT NULL,
    photo_description VARCHAR(200),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE CASCADE
);

-- Insert sample departments
INSERT INTO departments (name, description, icon) VALUES
('Road Development', 'Handles road maintenance, construction, and infrastructure projects', '🚧'),
('Water Board', 'Manages water supply, drainage, and sewage systems', '💧'),
('Electricity Board', 'Handles electricity distribution and maintenance', '⚡'),
('Public Transport', 'Manages public transportation services', '🚌'),
('Drainage Board', 'Handles drainage and flood control systems', '🌊'),
('Garbage Management', 'Manages waste collection and disposal', '🗑️'),
('Public Facilities', 'Manages public parks, buildings, and facilities', '🏛️');

-- Insert sample admin user
INSERT INTO users (username, email, password, full_name, user_type) VALUES
('admin', 'admin@civiclink.gov', 'admin123', 'System Administrator', 'admin');

-- Insert sample verification officers
INSERT INTO users (username, email, password, full_name, user_type) VALUES
('verifier1', 'verifier1@civiclink.gov', 'verify123', 'John Smith', 'officer'),
('verifier2', 'verifier2@civiclink.gov', 'verify123', 'Sarah Johnson', 'officer');

INSERT INTO officers (user_id, officer_type, badge_number) VALUES
(2, 'verification', 'VER001'),
(3, 'verification', 'VER002');

-- Insert sample department officers
INSERT INTO users (username, email, password, full_name, user_type) VALUES
('road_officer', 'road@civiclink.gov', 'road123', 'Mike Wilson', 'officer'),
('water_officer', 'water@civiclink.gov', 'water123', 'Lisa Chen', 'officer'),
('electricity_officer', 'electricity@civiclink.gov', 'elec123', 'Tom Davis', 'officer'),
('transport_officer', 'transport@civiclink.gov', 'trans123', 'Amy Kumar', 'officer'),
('drainage_officer', 'drainage@civiclink.gov', 'drain123', 'Robert Lee', 'officer'),
('garbage_officer', 'garbage@civiclink.gov', 'garb123', 'Maria Garcia', 'officer'),
('facilities_officer', 'facilities@civiclink.gov', 'facil123', 'James Brown', 'officer');

INSERT INTO officers (user_id, department_id, officer_type, badge_number) VALUES
(4, 1, 'department', 'RD001'),
(5, 2, 'department', 'WB001'),
(6, 3, 'department', 'EB001'),
(7, 4, 'department', 'PT001'),
(8, 5, 'department', 'DB001'),
(9, 6, 'department', 'GM001'),
(10, 7, 'department', 'PF001');

-- Insert sample complaints
INSERT INTO complaints (complaint_id, user_id, department_id, title, description, complaint_type, status, priority, address, district, province, place, latitude, longitude, verification_officer_comment, department_officer_comment, estimated_completion) VALUES
('CMP001', 1, 1, 'Large Pothole on Main Street', 'There is a large pothole causing traffic hazards', 'Road Damage', 'Verified', 'High', '123 Main St, Colombo', 'Colombo', 'Western', 'Main Street Junction', 6.9271, 79.8612, 'Large pothole confirmed. Immediate action required due to safety concerns.', 'Repair team dispatched. Expected to complete within 2 days.', DATE_ADD(CURRENT_DATE, INTERVAL 2 DAY)),
('CMP002', 1, 2, 'Water Pipe Burst', 'Water pipe burst causing flooding in the area', 'Water Leak', 'In Progress', 'High', '456 Beach Rd, Galle', 'Galle', 'Southern', 'Beach Road Area', 6.0535, 80.2180, 'Emergency water leak confirmed. Immediate action required to prevent flooding.', 'Repair team on site. Water supply temporarily diverted.', DATE_ADD(CURRENT_DATE, INTERVAL 1 DAY)),
('CMP003', 1, 3, 'Power Outage in Residential Area', 'Complete power outage affecting 50+ houses', 'Power Outage', 'New', 'High', '789 Hill St, Kandy', 'Kandy', 'Central', 'Hillside Colony', 7.2906, 80.6337, NULL, NULL, DATE_ADD(CURRENT_DATE, INTERVAL 3 DAY)),
('CMP004', 1, 4, 'Broken Bus Shelter', 'Bus shelter glass broken, unsafe for passengers', 'Facility Damage', 'Verified', 'Medium', '321 Highway, Anuradhapura', 'Anuradhapura', 'North Central', 'Highway Bus Stop', 8.3114, 80.4037, 'Bus shelter damage confirmed. Safety hazard for passengers.', 'Replacement glass ordered. Will install within 5 days.', DATE_ADD(CURRENT_DATE, INTERVAL 5 DAY)),
('CMP005', 1, 5, 'Drainage Blockage', 'Drain blocked causing water accumulation', 'Drainage Issue', 'New', 'Medium', '654 Park Ave, Jaffna', 'Jaffna', 'Northern', 'Park Avenue', 9.6615, 80.0255, NULL, NULL, DATE_ADD(CURRENT_DATE, INTERVAL 4 DAY)),
('CMP006', 1, 6, 'Garbage Overflow', 'Public garbage bins overflowing', 'Garbage Collection', 'In Progress', 'Medium', '987 Market St, Matara', 'Matara', 'Southern', 'Market Area', 5.9485, 80.5550, 'Garbage overflow confirmed. Health and safety risk identified.', 'Additional collection trucks deployed. Daily collection scheduled.', DATE_ADD(CURRENT_DATE, INTERVAL 2 DAY)),
('CMP007', 1, 7, 'Park Playground Damage', 'Children playground equipment broken', 'Facility Damage', 'Verified', 'Medium', '147 Garden Rd, Nuwara Eliya', 'Nuwara Eliya', 'Central', 'City Park', 6.9700, 80.7778, 'Public facility damage confirmed. Safety hazard for park visitors.', 'Maintenance team scheduled for inspection and repair.', DATE_ADD(CURRENT_DATE, INTERVAL 3 DAY));

-- Create indexes for better performance
CREATE INDEX idx_complaints_status ON complaints(status);
CREATE INDEX idx_complaints_department ON complaints(department_id);
CREATE INDEX idx_complaints_user ON complaints(user_id);
CREATE INDEX idx_complaints_priority ON complaints(priority);
CREATE INDEX idx_officers_department ON officers(department_id);
CREATE INDEX idx_officers_type ON officers(officer_type);

-- Create view for department statistics
CREATE VIEW department_stats AS
SELECT 
    d.name as department_name,
    d.icon,
    COUNT(c.id) as total_complaints,
    SUM(CASE WHEN c.status = 'New' THEN 1 ELSE 0 END) as new_complaints,
    SUM(CASE WHEN c.status = 'In Progress' THEN 1 ELSE 0 END) as in_progress_complaints,
    SUM(CASE WHEN c.status = 'Resolved' THEN 1 ELSE 0 END) as resolved_complaints,
    SUM(CASE WHEN c.priority = 'High' THEN 1 ELSE 0 END) as high_priority_complaints
FROM departments d
LEFT JOIN complaints c ON d.id = c.department_id
GROUP BY d.id, d.name, d.icon;

-- Show the created tables
SHOW TABLES;

-- Sample data verification
SELECT * FROM departments;
SELECT * FROM users WHERE user_type = 'admin';
SELECT * FROM officers;
SELECT * FROM complaints;
SELECT * FROM department_stats; 