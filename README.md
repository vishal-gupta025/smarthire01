# 🚀 SmartHire - AI Powered Job Portal

<div align="center">

![Django](https://img.shields.io/badge/Django-5.x-092E20?style=for-the-badge&logo=django)
![DRF](https://img.shields.io/badge/DRF-REST-red?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?style=for-the-badge&logo=postgresql)
![Redis](https://img.shields.io/badge/Redis-red?style=for-the-badge&logo=redis)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker)

**An AI-powered recruitment platform that intelligently matches candidates with jobs using Resume Parsing, ATS Scoring, and Semantic Matching.**

</div>

---

# 📖 Overview

SmartHire is a full-stack AI-powered recruitment platform designed to simplify hiring for recruiters and improve job discovery for candidates.

The platform enables recruiters to post jobs, manage applications, and evaluate candidates through AI-powered resume analysis. Candidates can upload resumes, receive ATS scores, and apply to relevant jobs.

The project follows a scalable architecture using Django REST Framework for the backend and React for the frontend.

---

# ✨ Features

## 👨‍💼 Recruiter

- Recruiter Authentication
- Company Profile Management
- Create/Edit/Delete Jobs
- Manage Job Applications
- View Candidate Profiles
- Resume Review
- Candidate Shortlisting

---

## 👨‍🎓 Candidate

- Secure Authentication
- Profile Management
- Resume Upload
- Browse Jobs
- Apply to Jobs
- Track Applications

---

## 🤖 AI Features

- Resume Parsing
- ATS Score Generation
- Resume Skill Extraction
- Candidate-Job Matching
- AI-based Resume Analysis

---

# 🏗️ Project Architecture

```
                React Frontend
                      │
                      ▼
             Django REST API
                      │
     ┌────────────────┼────────────────┐
     ▼                ▼                ▼
 PostgreSQL         Redis          Celery
     │                │
     └──────────Resume Processing──────┘
```

---

# 🛠️ Tech Stack

## Backend

- Python
- Django
- Django REST Framework
- PostgreSQL
- Redis
- Celery
- JWT Authentication
- Docker

---

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios

---

## DevOps

- Docker
- Docker Compose
- Git
- GitHub

---

# 📂 Project Structure

```
SmartHire/
│
├── Backend/
│   ├── apps/
│   ├── config/
│   ├── manage.py
│   ├── requirements.txt
│   └── README.md
│
├── Frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── README.md
│
├── docker-compose-full.yml
├── README.md
└── docs/
```

---

# 🚀 Getting Started

## Clone Repository

```bash
git clone https://github.com/vishal-gupta025/smarthire01.git
cd smarthire01
```

---

# 🐳 Running with Docker

```bash
docker compose -f docker-compose-full.yml up --build
```

Backend

```
http://localhost:8000
```

Frontend

```
http://localhost:5173
```

---

# ⚙️ Backend Setup

```bash
cd Backend
```

Create virtual environment

```bash
python -m venv venv
```

Activate

Windows

```bash
venv\Scripts\activate
```

Linux / Mac

```bash
source venv/bin/activate
```

Install dependencies

```bash
pip install -r requirements.txt
```

Run migrations

```bash
python manage.py migrate
```

Run server

```bash
python manage.py runserver
```

---

# 💻 Frontend Setup

```bash
cd Frontend
npm install
npm run dev
```

---

# 🔐 Environment Variables

Backend

```
Backend/.env
```

Example

```env
SECRET_KEY=

DEBUG=True

DATABASE_URL=

REDIS_URL=

EMAIL_HOST=

EMAIL_PORT=
```

Frontend

```
Frontend/.env
```

Example

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

---

# 📌 API Modules

- Authentication
- Users
- Candidate Profile
- Recruiter Profile
- Jobs
- Applications
- Resume
- Recommendations

---

# 📊 Database

- PostgreSQL
- Django ORM
- JWT Authentication
- Role-Based Access Control

---

# 🔒 Security

- JWT Authentication
- Password Hashing
- Role Based Authorization
- Environment Variables
- Protected API Endpoints

---

# 🧪 Future Improvements

- AI Chat Assistant
- Resume Optimization Suggestions
- Interview Scheduling
- Real-time Chat
- Semantic Search using Vector Database
- LLM-powered Resume Evaluation
- AI Interview Feedback
- Recommendation Engine

---

# 🤝 Contributing

1. Fork Repository

2. Create Branch

```bash
git checkout -b feature/new-feature
```

3. Commit

```bash
git commit -m "Added new feature"
```

4. Push

```bash
git push origin feature/new-feature
```

5. Open Pull Request

---

# 👨‍💻 Author

**Vishal Gupta**

- GitHub: https://github.com/vishal-gupta025

---

# ⭐ Support

If you found this project useful, please consider giving it a ⭐ on GitHub.

It motivates future development.

---

