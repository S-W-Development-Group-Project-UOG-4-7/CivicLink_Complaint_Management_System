# CivicLink Backend API

Django REST API for CivicLink Complaint Management System with MySQL database.

## Features

- Admin authentication and session management
- Department management
- Officer registration and assignment
- Complaint management with status tracking
- File attachments support
- Comments and internal notes
- Dashboard statistics
- Role-based access control

## Setup Instructions

### Prerequisites

- Python 3.8+
- MySQL Server
- MySQL Workbench (for database management)

### Installation

1. **Create Virtual Environment**
   ```bash
   python -m venv venv
   venv\Scripts\activate  # On Windows
   ```

2. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Database Setup**
   
   Open MySQL Workbench and create the database:
   ```sql
   CREATE DATABASE civiclink_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

4. **Configure Database Settings**
   
   Update `civiclink/settings.py` with your MySQL credentials:
   ```python
   DATABASES = {
       'default': {
           'ENGINE': 'django.db.backends.mysql',
           'NAME': 'civiclink_db',
           'USER': 'your_mysql_username',
           'PASSWORD': 'your_mysql_password',
           'HOST': 'localhost',
           'PORT': '3306',
       }
   }
   ```

5. **Run Migrations**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. **Create Superuser**
   ```bash
   python manage.py createsuperuser
   ```

7. **Run Development Server**
   ```bash
   python manage.py runserver
   ```

## API Endpoints

### Authentication
- `POST /api/accounts/login/` - Admin login
- `POST /api/accounts/logout/` - Admin logout
- `GET /api/accounts/profile/` - Get admin profile

### Admin Dashboard
- `GET /api/accounts/dashboard/` - Dashboard statistics

### Departments
- `GET /api/departments/` - List departments
- `POST /api/departments/` - Create department
- `GET /api/departments/{id}/` - Get department details
- `PUT /api/departments/{id}/` - Update department
- `DELETE /api/departments/{id}/` - Delete department
- `GET /api/departments/statistics/` - Department statistics

### Officers
- `GET /api/accounts/officers/` - List officers
- `POST /api/accounts/officers/register/` - Register officer
- `GET /api/accounts/officers/{id}/` - Get officer details
- `PUT /api/accounts/officers/{id}/` - Update officer
- `DELETE /api/accounts/officers/{id}/` - Delete officer

### Complaints
- `GET /api/complaints/` - List complaints
- `POST /api/complaints/` - Create complaint
- `GET /api/complaints/{id}/` - Get complaint details
- `PUT /api/complaints/{id}/` - Update complaint
- `DELETE /api/complaints/{id}/` - Delete complaint
- `POST /api/complaints/{id}/assign-officer/` - Assign officer
- `POST /api/complaints/{id}/update-status/` - Update status
- `GET /api/complaints/statistics/` - Complaint statistics

### Comments & Attachments
- `GET /api/complaints/{id}/comments/` - List comments
- `POST /api/complaints/{id}/comments/` - Add comment
- `GET /api/complaints/{id}/attachments/` - List attachments
- `POST /api/complaints/{id}/attachments/` - Upload attachment

## Database Models

### AdminUser
- Extends Django's AbstractUser
- Fields: username, email, first_name, last_name, role, is_active
- Roles: admin, officer

### Officer
- Links to AdminUser
- Fields: department, employee_id, phone_number, address, is_active

### Department
- Fields: name, code, description, icon, is_active
- Related: services, officers, complaints

### Complaint
- Fields: title, description, citizen info, department, assigned_officer, status, priority, location, admin_notes
- Status: pending, in_progress, resolved, rejected, closed
- Priority: low, medium, high, urgent

## Admin Panel

Access Django admin panel at: `http://localhost:8000/admin/`

Use your superuser credentials to log in and manage all data.

## Testing

Run tests with:
```bash
python manage.py test
```

## Security Notes

- Change SECRET_KEY in production
- Set DEBUG=False in production
- Configure proper CORS origins
- Use environment variables for sensitive data
- Implement rate limiting for API endpoints
