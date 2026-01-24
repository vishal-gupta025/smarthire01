# SmartHire

SmartHire is an intelligent recruitment platform that leverages AI to streamline the hiring process. It provides a robust backend API for managing job postings, candidate profiles, and automated resume parsing using LLM technology.

## 🚀 Features

- **User Authentication**: JWT-based authentication with role-based access control (Candidate, Recruiter, Admin)
- **Resume Parsing**: AI-powered resume parsing using OpenAI GPT-4o-mini to extract skills, education, and experience
- **Job Management**: Full CRUD operations for job postings by recruiters
- **Candidate Profiles**: Automated profile population from uploaded resumes
- **Recruiter Profiles**: Company profile management for recruiters
- **File Support**: PDF and DOCX resume upload support

## 🛠️ Tech Stack

- **Framework**: Django 5.2 with Django REST Framework
- **Authentication**: JWT via djangorestframework-simplejwt
- **Database**: SQLite (development) / PostgreSQL (production ready)
- **AI/LLM**: LangChain with OpenAI GPT-4o-mini
- **Task Queue**: Celery with Redis
- **Resume Parsing**: pdfminer.six, python-docx

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

### Prerequisites

- Python 3.10+
- Redis (for Celery)
- OpenAI API key

### Setup

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
   OPENAI_API_KEY=your-openai-api-key
   DEBUG=True
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
| POST | `/api/token/refresh/` | Refresh access token |

### Profiles
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/accounts/candidate/profile/` | Get candidate profile |
| PUT | `/api/accounts/candidate/profile/` | Update candidate profile |
| GET | `/api/accounts/recruiter/profile/` | Get recruiter profile |
| PUT | `/api/accounts/recruiter/profile/` | Update recruiter profile |

### Jobs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/jobs/` | List all jobs (recruiter) |
| POST | `/api/jobs/` | Create a new job |
| GET | `/api/jobs/<id>/` | Get job details |
| PUT | `/api/jobs/<id>/` | Update a job |
| PATCH | `/api/jobs/<id>/` | Partial update a job |
| DELETE | `/api/jobs/<id>/` | Delete a job |

### Resumes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/resumes/upload/` | Upload and parse resume |

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

### Production with Gunicorn

```bash
gunicorn config.wsgi:application --bind 0.0.0.0:8000
```

### Running Celery (for background tasks)

```bash
celery -A config worker --loglevel=info
```

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
