# SmartHire 🎯

[![Docker](https://img.shields.io/badge/Docker-Ready-blue?logo=docker)](https://hub.docker.com/r/494825/smarthire-web)
[![Python](https://img.shields.io/badge/Python-3.11-green?logo=python)](https://python.org)
[![Django](https://img.shields.io/badge/Django-5.2-darkgreen?logo=django)](https://djangoproject.com)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

SmartHire is an intelligent recruitment platform that leverages AI to streamline the hiring process. It provides a robust backend API for managing job postings, candidate profiles, and automated resume parsing using LLM technology.

## 🚀 Features

- **🔐 User Authentication**: JWT-based authentication with role-based access control (Candidate, Recruiter, Admin)
- **📄 Resume Parsing**: AI-powered resume parsing using OpenAI GPT-4o-mini to extract skills, education, and experience
- **💼 Job Management**: Full CRUD operations for job postings by recruiters
- **👤 Candidate Profiles**: Automated profile population from uploaded resumes
- **🏢 Recruiter Profiles**: Company profile management for recruiters
- **📁 File Support**: PDF and DOCX resume upload support
- **📧 Email Notifications**: Automated emails for application status updates
- **🐳 Docker Ready**: Fully containerized for easy deployment

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Django 5.2 + Django REST Framework |
| **Authentication** | JWT via djangorestframework-simplejwt |
| **Database** | SQLite (dev) / PostgreSQL 15 (prod) |
| **AI/LLM** | LangChain + OpenAI GPT-4o-mini |
| **Task Queue** | Celery + Redis 7 |
| **Resume Parsing** | pdfplumber, python-docx |
| **Containerization** | Docker + Docker Compose |

## 📁 Project Structure

```
Backend/
├── config/                 # Project configuration
│   ├── settings/
│   │   ├── base.py        # Base settings
│   │   ├── dev.py         # Development settings
│   │   └── prod.py        # Production settings
│   ├── urls.py            # Root URL configuration
│   └── wsgi.py            # WSGI application
├── apps/
│   ├── accounts/          # User authentication & profiles
│   │   ├── models.py      # User, CandidateProfile, RecruiterProfile
│   │   ├── views.py       # Register, Login, Logout, Profile views
│   │   ├── serializers.py # DRF serializers
│   │   └── permissions.py # Custom permissions
│   ├── jobs/              # Job management
│   │   ├── models.py      # Job model
│   │   ├── views.py       # Job CRUD views
│   │   └── serializers.py # Job serializers
│   ├── resumes/           # Resume handling
│   │   ├── models.py      # Resume, ResumeAnalysis models
│   │   ├── views.py       # Resume upload view
│   │   └── services/      # Resume parsing services
│   │       ├── extract_text.py   # PDF/DOCX text extraction
│   │       ├── resume_parser.py  # LLM-based parsing
│   │       └── resume_schema.py  # Structured output schema
│   └── home/              # Home/landing page
├── media/                 # Uploaded files
│   └── resumes/           # Uploaded resumes
├── manage.py
└── requirements.txt
```

## 🔧 Installation

### Option 1: Docker (Recommended) 🐳

```bash
# Clone the repository
git clone https://github.com/vishal-gupta025/smarthire01.git
cd smarthire01/Backend

# Create environment file
cp .env.example .env.docker
# Edit .env.docker with your API keys

# Optional: change the host port for PostgreSQL if 5432 is already in use
# POSTGRES_HOST_PORT=5433

# Start all services
docker-compose up -d

# Run migrations
docker-compose exec web python manage.py migrate

# Create superuser
docker-compose exec web python manage.py createsuperuser
```

**Access the API at:** http://localhost:8000/api/

### Option 2: Local Development

#### Prerequisites

- Python 3.10+
- Redis (for Celery)
- OpenAI API key

#### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SmartHire1/Backend
   ```

2. **Create a virtual environment**
   ```bash
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # Linux/Mac
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**
   
   Create a `.env` file in the Backend directory:
   ```env
   SECRET_KEY=your-django-secret-key
   DEBUG=True
   
   # Database (for production)
   DB_NAME=smarthire
   DB_USER=postgres
   DB_PASSWORD=your-password
   DB_HOST=localhost
   DB_PORT=5432
   
   # API Keys
   OPENAI_API_KEY=your-openai-api-key
   LANGCHAIN_API_KEY=your-langchain-api-key
   
   # Email (optional)
   EMAIL_HOST_USER=your-email@gmail.com
   EMAIL_HOST_PASSWORD=your-app-password
   ```

5. **Run migrations**
   ```bash
   python manage.py migrate
   ```

6. **Create a superuser (optional)**
   ```bash
   python manage.py createsuperuser
   ```

7. **Run the development server**
   ```bash
   python manage.py runserver
   ```

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/accounts/register/` | Register a new user |
| POST | `/api/accounts/login/` | Login and get JWT tokens |
| POST | `/api/accounts/logout/` | Logout and blacklist token |
| POST | `/api/accounts/token/refresh/` | Refresh access token |

### Profiles
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/PUT | `/api/accounts/candidate/profile/` | Get/Update candidate profile |
| GET/PUT | `/api/accounts/recruiter/profile/` | Get/Update recruiter profile |

### Jobs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/jobs/` | List all jobs |
| POST | `/api/jobs/` | Create a new job (Recruiter) |
| GET | `/api/jobs/{id}/` | Get job details |
| PUT/PATCH | `/api/jobs/{id}/` | Update a job (Recruiter) |
| DELETE | `/api/jobs/{id}/` | Delete a job (Recruiter) |
| POST | `/api/jobs/{id}/apply/` | Apply to a job (Candidate) |
| GET | `/api/jobs/{id}/applications/` | View applications (Recruiter) |
| PATCH | `/api/jobs/applications/{id}/status/` | Update application status |

### Resumes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/resumes/upload/` | Upload and parse resume |
| GET | `/api/resumes/` | List uploaded resumes |

### Recommendations
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/recommendations/candidate/` | Get ranked job recommendations for the authenticated candidate |

## 👤 User Roles

- **Candidate**: Can upload resumes, view/edit profile, apply for jobs
- **Recruiter**: Can create/manage job postings, view company profile
- **Admin**: Full system access via Django admin

## 🤖 Resume Parsing

SmartHire uses AI to automatically extract structured information from resumes:

- **Skills**: Technical and soft skills
- **Education**: Degrees, institutions, and date ranges
- **Experience**: Job roles, companies, duration, and responsibilities

The parsed data automatically populates the candidate's profile.

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. Obtain tokens via `/api/accounts/login/`
2. Include the access token in requests:
   ```
   Authorization: Bearer <access_token>
   ```
3. Refresh expired tokens via `/api/token/refresh/`

## 🚀 Deployment

### Docker Deployment (Recommended)

```bash
# Build and start containers
docker-compose up -d --build

# Check status
docker-compose ps

# View logs
docker-compose logs -f web
```

### Docker Hub Images

Pull pre-built images:
```bash
docker pull 494825/smarthire-web:latest
docker pull 494825/smarthire-celery:latest
```

### Production with Gunicorn

```bash
gunicorn config.wsgi:application --bind 0.0.0.0:8000
```

### Running Celery (for background tasks)

```bash
celery -A config worker --loglevel=info
```

## 🏗️ Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │────►│  Django API │────►│ PostgreSQL  │
│  (Browser)  │◄────│  (Port 8000)│◄────│  (Port 5432)│
└─────────────┘     └──────┬──────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐     ┌─────────────┐
                    │    Redis    │────►│   Celery    │
                    │ (Port 6379) │◄────│   Worker    │
                    └─────────────┘     └─────────────┘
```

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Vishal Gupta**
- GitHub: [@vishal-gupta025](https://github.com/vishal-gupta025)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

<p align="center">Made with ❤️</p>
