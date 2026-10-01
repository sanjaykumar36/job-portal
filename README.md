# Job Portal

A full-stack job portal web application built with **React.js, FastAPI, and MySQL**.

The application provides separate workflows for **candidates and recruiters**, including job management, job search, resume upload, applications, and application status management.

## 🚀 Features

### 👤 Candidate

* User registration and login
* JWT-based authentication
* Browse available jobs
* Search jobs by title
* Filter jobs by location
* Filter jobs by salary range
* Upload PDF resume
* Apply for jobs
* Prevent duplicate applications
* View submitted applications
* Track application status
* View candidate profile
* Logout securely

### 👨‍💼 Recruiter

* Recruiter registration and login
* JWT-based authentication
* Post new jobs
* Edit existing jobs
* Delete jobs
* View candidate applications
* View candidate details
* View candidate resumes
* Shortlist candidates
* Select candidates
* Reject candidates
* View application statistics

## 🛠️ Technologies Used

### Frontend

* React.js
* JavaScript
* HTML5
* CSS3
* React Router
* Axios
* Vite

### Backend

* Python
* FastAPI
* SQLAlchemy
* JWT Authentication
* Passlib
* REST APIs

### Database

* MySQL

### Development Tools

* VS Code
* Git
* GitHub
* Postman

## 📁 Project Structure

```text
job-portal/
│
├── Backend/
│   ├── application_crud.py
│   ├── auth.py
│   ├── crud.py
│   ├── database.py
│   ├── job_crud.py
│   ├── main.py
│   ├── models.py
│   ├── requirements.txt
│   └── schemas.py
│
├── Frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

## 🔐 Authentication

The application uses **JWT-based authentication**.

Users are assigned one of two roles:

* Candidate
* Recruiter

Role-based access controls which pages and APIs each user can access.

## 🔄 Application Workflow

### Candidate Flow

```text
Register
   ↓
Login
   ↓
Browse Jobs
   ↓
Search / Filter
   ↓
Upload Resume
   ↓
Apply for Job
   ↓
My Applications
   ↓
Track Application Status
```

### Recruiter Flow

```text
Register
   ↓
Login
   ↓
Recruiter Dashboard
   ↓
Post Job
   ↓
Manage Jobs
   ↓
View Applications
   ↓
View Resumes
   ↓
Shortlist / Select / Reject
```

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/sanjaykumar36/job-portal.git
cd job-portal
```

## 🔹 Backend Setup

Open a terminal:

```bash
cd Backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate the virtual environment on Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Configure your MySQL database connection in the backend configuration.

Start the FastAPI server:

```bash
uvicorn main:app --reload
```

Backend will run at:

```text
http://127.0.0.1:8000
```

FastAPI Swagger documentation:

```text
http://127.0.0.1:8000/docs
```

## 🔹 Frontend Setup

Open another terminal:

```bash
cd Frontend
```

Install dependencies:

```bash
npm install
```

Start the React development server:

```bash
npm run dev
```

Frontend will run at:

```text
http://localhost:5173
```

## 🗄️ Database

The project uses **MySQL** for storing application data.

The database contains information related to:

* Users
* Jobs
* Applications
* Recruiters
* Candidates

## 📄 Resume Upload

Candidates can upload their resume in **PDF format** before applying for jobs.

Recruiters can access uploaded candidate resumes from the application management section.

## 🔎 Job Search & Filtering

Candidates can search and filter available jobs using:

* Job title
* Location
* Salary range

This makes it easier to find relevant job opportunities.

## 📊 Recruiter Dashboard

Recruiters can monitor:

* Total jobs
* Total applications
* Shortlisted candidates
* Selected candidates
* Candidate applications

Recruiters can also manage job postings and update application statuses.

## 🔗 API

The backend provides REST API endpoints for:

* User registration
* Login
* Authentication
* User profiles
* Job CRUD operations
* Job applications
* Resume upload
* Application status management

FastAPI automatically provides interactive API documentation through Swagger UI.

## 🧪 Testing

API endpoints can be tested using:

* FastAPI Swagger UI
* Postman

Swagger:

```text
http://127.0.0.1:8000/docs
```

## 📸 Screenshots

Screenshots of the following pages can be added here:

* Home Page
* Login Page
* Candidate Dashboard
* My Applications
* Recruiter Dashboard
* Job Management
* Candidate Applications

## 🎯 Project Objective

The objective of this project is to develop a practical full-stack recruitment platform demonstrating:

* Frontend development
* Backend API development
* Database integration
* Authentication and authorization
* CRUD operations
* File upload handling
* REST API communication
* Role-based access control

## 👨‍💻 Author

**Sanjay Kumar**

GitHub:
https://github.com/sanjaykumar36

## ⭐ Future Improvements

Possible future enhancements include:

* Email notifications
* Advanced job recommendations
* Pagination
* Cloud resume storage
* Production deployment
* Automated testing

---

⭐ If you find this project useful, consider giving the repository a star.
