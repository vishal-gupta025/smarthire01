# SmartHire Full Stack Setup Guide

## 📋 Prerequisites

- **Node.js** 16+ and npm/yarn
- **Python** 3.11+
- **PostgreSQL** 15+ (recommended for production) or SQLite for development
- **Redis** 7+ (for Celery task queue)
- **Docker & Docker Compose** (optional, for containerized setup)
- **Git**

## 🚀 Quick Start (Development)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/SmartHire.git
cd SmartHire
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd Backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Run migrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Start backend server
python manage.py runserver
```

Backend will be available at `http://localhost:8000`

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd ../Frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start development server
npm run dev
```

Frontend will be available at `http://localhost:3000`

### 4. Celery Worker (Optional, for async tasks)

```bash
# In a new terminal, from Backend directory
cd Backend
source venv/bin/activate

# Start Celery worker
celery -A config worker -l info
```

## 🐳 Docker Setup (Production-like)

### Using Docker Compose

```bash
# From project root
docker-compose -f docker-compose-full.yml up -d
```

This will start:
- Backend API on `http://localhost:8000`
- Frontend on `http://localhost:3000`
- Redis on `localhost:6379`

### Build Individual Containers

**Backend:**
```bash
cd Backend
docker build -t smarthire-backend .
docker run -p 8000:8000 smarthire-backend
```

**Frontend:**
```bash
cd Frontend
docker build -t smarthire-frontend .
docker run -p 3000:3000 smarthire-frontend
```

## 🔧 Configuration

### Backend Configuration

**Backend/.env:**
```env
DEBUG=True
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=sqlite:///db.sqlite3

# For PostgreSQL:
# DATABASE_URL=postgresql://user:password@localhost:5432/smarthire

# OpenAI API
OPENAI_API_KEY=your-openai-api-key
OPENAI_MODEL=gpt-4o-mini

# Email Configuration
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-email-password

# Redis
REDIS_URL=redis://localhost:6379/0

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8000

# JWT
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=1
```

### Frontend Configuration

**Frontend/.env:**
```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME=SmartHire
VITE_APP_VERSION=1.0.0
```

**Frontend/.env.production:**
```env
VITE_API_BASE_URL=https://api.smarthire.com/api
VITE_APP_NAME=SmartHire
VITE_APP_VERSION=1.0.0
```

## 📚 Project Structure

```
SmartHire/
├── Backend/                    # Django REST API
│   ├── apps/
│   │   ├── accounts/          # User authentication & profiles
│   │   ├── jobs/              # Job management
│   │   ├── resumes/           # Resume parsing
│   │   ├── recommendations/   # AI recommendations
│   │   └── home/              # Home app
│   ├── config/                # Django settings
│   ├── Dockerfile             # Backend Docker image
│   ├── requirements.txt        # Python dependencies
│   ├── manage.py              # Django management
│   ├── README.md              # Backend documentation
│   └── API_DOCUMENTATION.md   # API docs
│
├── Frontend/                   # React TypeScript app
│   ├── src/
│   │   ├── api/               # API client
│   │   ├── components/        # Reusable components
│   │   ├── hooks/             # Custom hooks
│   │   ├── pages/             # Page components
│   │   ├── store/             # Zustand state
│   │   ├── types/             # TypeScript types
│   │   ├── utils/             # Utility functions
│   │   ├── App.tsx            # Main app
│   │   └── index.css          # Global styles
│   ├── Dockerfile             # Frontend Docker image
│   ├── vite.config.ts         # Vite config
│   ├── tailwind.config.js     # Tailwind config
│   ├── README.md              # Frontend docs
│   └── package.json           # Dependencies
│
├── docker-compose-full.yml    # Full stack Docker Compose
└── SETUP.md                   # This file
```

## 🧪 Testing

### Backend Tests

```bash
cd Backend
source venv/bin/activate

# Run all tests
python manage.py test

# Run specific app tests
python manage.py test apps.accounts

# With coverage
pip install coverage
coverage run --source='.' manage.py test
coverage report
```

### Frontend Tests

```bash
cd Frontend

# Using Vitest (optional - not configured yet)
npm install -D vitest @testing-library/react
npm run test

# OR using Jest (if configured)
npm test
```

## 📦 Deployment

### Backend Deployment

#### On Heroku:

```bash
cd Backend

# Create Procfile
echo "web: gunicorn config.wsgi" > Procfile

# Create runtime.txt
echo "python-3.11.9" > runtime.txt

# Create app
heroku create smarthire-api

# Set environment variables
heroku config:set DEBUG=False
heroku config:set SECRET_KEY=your-secret-key
heroku config:set ALLOWED_HOSTS=smarthire-api.herokuapp.com

# Deploy
git push heroku main
```

#### On AWS EC2:

```bash
# SSH into instance
ssh -i your-key.pem ec2-user@your-instance-ip

# Install dependencies
sudo yum update -y
sudo yum install python3 python3-pip postgresql -y

# Clone repo and setup
git clone your-repo-url
cd SmartHire/Backend
pip install -r requirements.txt

# Run with Gunicorn
gunicorn --bind 0.0.0.0:8000 config.wsgi

# Setup Nginx as reverse proxy
# Setup systemd service
```

### Frontend Deployment

#### On Vercel:

```bash
cd Frontend

# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

#### On Netlify:

1. Connect GitHub repository
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Set environment variables in Site settings

#### On AWS S3 + CloudFront:

```bash
cd Frontend

# Build
npm run build

# Upload to S3
aws s3 sync dist/ s3://your-bucket-name/

# Invalidate CloudFront
aws cloudfront create-invalidation --distribution-id your-id --paths "/*"
```

## 🔐 Security Checklist

- [ ] Change `SECRET_KEY` in backend
- [ ] Set `DEBUG=False` in production
- [ ] Configure `ALLOWED_HOSTS` properly
- [ ] Use environment variables for sensitive data
- [ ] Enable HTTPS/SSL certificates
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Enable CSRF protection
- [ ] Use secure session cookies
- [ ] Implement proper authentication
- [ ] Add input validation and sanitization
- [ ] Setup logging and monitoring
- [ ] Regular security audits
- [ ] Keep dependencies updated

## 📊 Monitoring & Logging

### Backend Logging

```python
# In settings/prod.py
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'ERROR',
            'class': 'logging.FileHandler',
            'filename': '/var/log/django/error.log',
        },
    },
    'root': {
        'handlers': ['file'],
        'level': 'ERROR',
    },
}
```

### Frontend Error Tracking

```typescript
// Add Sentry or similar
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
});
```

## 🐛 Troubleshooting

### Backend Issues

**Port 8000 already in use:**
```bash
# macOS/Linux
lsof -i :8000
kill -9 <PID>

# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

**Database migration errors:**
```bash
python manage.py makemigrations
python manage.py migrate --fake
```

**Module not found:**
```bash
pip install -r requirements.txt
pip install --upgrade pip
```

### Frontend Issues

**Port 3000 already in use:**
```bash
# macOS/Linux
lsof -i :3000
kill -9 <PID>

# Windows (PowerShell)
netstat -ano | Select-String :3000
```

**Module not found:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Build errors:**
```bash
npm run build -- --debug
```

## 📚 Documentation

- [Backend API Documentation](../Backend/API_DOCUMENTATION.md)
- [Backend README](../Backend/README.md)
- [Frontend README](./README.md)
- [Django Documentation](https://docs.djangoproject.com/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 👨‍💻 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Email: support@smarthire.com
- Discord: [Join our community](https://discord.gg/smarthire)

## 🎉 Acknowledgments

- Django REST Framework for excellent API framework
- React for amazing UI library
- Tailwind CSS for beautiful styling
- OpenAI for LLM integration
- All contributors and supporters

---

**Happy coding! 🚀**
