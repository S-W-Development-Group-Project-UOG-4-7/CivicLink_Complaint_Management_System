# CivicLink Backend Setup Instructions

## 🚀 Quick Setup Guide

### 1. Database Setup

First, run the SQL script to create your database and tables:

```bash
# Using MySQL Command Line
mysql -u root -p < CivicLinkDB.session.sql

# Or using MySQL Workbench
# Open the CivicLinkDB.session.sql file and execute it
```

### 2. Python Dependencies

Install required packages:

```bash
cd civic-backend
pip install -r requirements.txt
```

If you don't have requirements.txt, install these packages:

```bash
pip install django djangorestframework mysql-connector-python django-cors-headers
```

### 3. Django Settings

The backend is already configured with:
- Custom User model
- MySQL database connection
- REST Framework
- CORS settings for frontend
- Media file handling

### 4. Database Migrations

Create and apply migrations:

```bash
python manage.py makemigrations
python manage.py migrate
```

### 5. Create Superuser

Create an admin account:

```bash
python manage.py createsuperuser
```

Use:
- Username: `admin`
- Email: `admin@civiclink.gov`
- Password: `admin123`

### 6. Run Development Server

```bash
python manage.py runserver
```

The backend will be available at: `http://localhost:8000`

## 📡 API Endpoints

### Authentication
- `POST /auth/admin/login/` - Admin login
- `POST /auth/officer/login/` - Officer login
- `POST /auth/logout/` - Logout

### Admin Dashboard
- `GET /admin/dashboard/stats/` - Dashboard statistics
- `GET /admin/recent-complaints/` - Recent complaints

### API Endpoints
- `GET /api/users/` - User management (Admin only)
- `POST /api/users/register_officer/` - Register new officer
- `GET /api/departments/` - Department list
- `GET /api/departments/stats/` - Department statistics
- `GET /api/officers/` - Officer management
- `GET /api/complaints/` - Complaint list
- `POST /api/complaints/` - Create complaint
- `POST /api/complaints/{id}/verify/` - Verify complaint
- `POST /api/complaints/{id}/update_status/` - Update status
- `POST /api/complaints/{id}/add_photo/` - Add photo

### Django Admin
- `http://localhost:8000/admin/` - Django admin interface

## 🔐 Test Credentials

### Admin User
- Username: `admin`
- Password: `admin123`

### Verification Officers
- Username: `verifier1`
- Password: `verify123`
- Username: `verifier2`
- Password: `verify123`

### Department Officers
- Road Development: `road_officer` / `road123`
- Water Board: `water_officer` / `water123`
- Electricity: `electricity_officer` / `elec123`
- Transport: `transport_officer` / `trans123`
- Drainage: `drainage_officer` / `drain123`
- Garbage: `garbage_officer` / `garb123`
- Facilities: `facilities_officer` / `facil123`

## 🧪 Testing the API

### Test Admin Login
```bash
curl -X POST http://localhost:8000/auth/admin/login/ \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin&password=admin123"
```

### Test Department List
```bash
curl -X GET http://localhost:8000/api/departments/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🎯 Frontend Integration

Update your frontend API calls to use these endpoints:

```javascript
// Base URL
const API_BASE = 'http://localhost:8000';

// Admin Login
fetch(`${API_BASE}/auth/admin/login/`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: 'username=admin&password=admin123'
});

// Get Complaints
fetch(`${API_BASE}/api/complaints/`, {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

## 📊 Database Schema

The system includes:
- **Users**: Citizens, Admins, Officers
- **Departments**: 7 civic departments
- **Officers**: Verification and Department officers
- **Complaints**: Full complaint lifecycle
- **Photos**: Complaint evidence

## 🚀 Next Steps

1. Test all API endpoints
2. Connect frontend to backend
3. Implement file upload for photos
4. Add email notifications
5. Set up production deployment

## 🛠️ Troubleshooting

### Database Connection Issues
- Ensure MySQL is running
- Check database credentials in settings.py
- Verify database name exists

### CORS Issues
- Frontend must be on `localhost:3000`
- Check CORS_ALLOWED_ORIGINS in settings.py

### Migration Issues
- Delete migration files and try again
- Ensure database tables exist from SQL script
