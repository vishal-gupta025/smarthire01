# SmartHire - Quick Reference Guide

## 🚀 Starting the Application

### Option 1: Development Mode (Recommended for Development)

#### Terminal 1 - Backend
```bash
cd Backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
python manage.py runserver
```
✅ Backend running on `http://localhost:8000`

#### Terminal 2 - Frontend
```bash
cd Frontend
npm run dev
```
✅ Frontend running on `http://localhost:3000`

**You're all set! Open http://localhost:3000 in your browser**

---

### Option 2: Docker Compose (Recommended for Production Testing)

```bash
# From project root (SmartHire1)
docker-compose -f docker-compose-full.yml up
```

This starts:
- Backend API on `http://localhost:8000`
- Frontend on `http://localhost:3000`
- Redis on `localhost:6379`

---

## 📝 Test Accounts

### Create Test Account
1. Go to http://localhost:3000/register
2. Choose role: **Candidate** or **Recruiter**
3. Enter email and password
4. Click "Create Account"
5. Go to http://localhost:3000/login
6. Login with your credentials

### Test as Candidate
- Browse jobs at `/jobs`
- View job details
- Apply for jobs (when feature is ready)

### Test as Recruiter
- Create job postings (when feature is ready)
- View applicants (when feature is ready)
- Manage company profile (when feature is ready)

---

## 🔗 Important URLs

| Name | URL | Purpose |
|------|-----|---------|
| **Frontend** | http://localhost:3000 | React app |
| **Backend API** | http://localhost:8000/api | API endpoints |
| **API Docs** | http://localhost:8000/api/docs | API documentation |
| **Admin Panel** | http://localhost:8000/admin | Django admin |
| **Landing** | http://localhost:3000 | Home page |
| **Login** | http://localhost:3000/login | Sign in |
| **Register** | http://localhost:3000/register | Sign up |
| **Jobs** | http://localhost:3000/jobs | Job listings |

---

## 📦 Key Files & Directories

### Frontend
- `Frontend/.env` - Environment configuration
- `Frontend/src/` - Source code
- `Frontend/src/pages/` - Page components
- `Frontend/src/components/` - Reusable components
- `Frontend/src/api/client.ts` - API integration
- `Frontend/README.md` - Full documentation

### Backend
- `Backend/config/settings/` - Django settings
- `Backend/apps/` - Django apps
- `Backend/API_DOCUMENTATION.md` - API docs
- `Backend/requirements.txt` - Dependencies
- `Backend/.env` - Configuration

---

## 🛠️ Common Commands

### Frontend Commands

```bash
cd Frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Check TypeScript
npm run build  # This includes TypeScript checking
```

### Backend Commands

```bash
cd Backend

# Activate virtual environment
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start development server
python manage.py runserver

# Run tests
python manage.py test
```

---

## 🔐 Authentication Flow

1. **Register**
   ```
   POST /api/accounts/register/
   {
     "email": "user@example.com",
     "password": "secure123",
     "role": "candidate"
   }
   ```

2. **Login**
   ```
   POST /api/accounts/login/
   {
     "email": "user@example.com",
     "password": "secure123"
   }
   Response: { "access": "token...", "refresh": "token..." }
   ```

3. **Use Access Token**
   ```
   Headers: { "Authorization": "Bearer <access_token>" }
   ```

4. **Refresh Token**
   ```
   POST /api/token/refresh/
   { "refresh": "refresh_token..." }
   ```

5. **Logout**
   ```
   POST /api/accounts/logout/
   { "refresh": "refresh_token..." }
   ```

---

## 🐛 Debugging

### Frontend Issues

**Port 3000 in use**:
```bash
# macOS/Linux
lsof -i :3000
kill -9 <PID>

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Module errors**:
```bash
cd Frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**Build errors**:
```bash
npm run build  # See full error output
```

### Backend Issues

**Port 8000 in use**:
```bash
# macOS/Linux
lsof -i :8000
kill -9 <PID>

# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

**Database errors**:
```bash
python manage.py migrate --fake
python manage.py migrate
```

**Module errors**:
```bash
pip install -r requirements.txt --force-reinstall
```

---

## 📱 Responsive Testing

Test the frontend on different screen sizes:

1. **Desktop**: 1024px+ width
2. **Tablet**: 768px - 1024px
3. **Mobile**: 320px - 768px

Use browser DevTools (F12) to test responsiveness.

---

## 📊 API Testing

### Using cURL

```bash
# Register
curl -X POST http://localhost:8000/api/accounts/register/ \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"secure123","role":"candidate"}'

# Login
curl -X POST http://localhost:8000/api/accounts/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"secure123"}'

# Get Jobs (with token)
curl -X GET http://localhost:8000/api/jobs/ \
  -H "Authorization: Bearer <access_token>"
```

### Using Postman

1. Import API from `Backend/API_DOCUMENTATION.md`
2. Create environment with `BASE_URL` = `http://localhost:8000/api`
3. Set `Authorization` header with token
4. Test endpoints

---

## 🎯 Development Workflow

1. **Start Both Servers** (2 terminals)
   ```bash
   # Terminal 1: Backend
   cd Backend
   python manage.py runserver
   
   # Terminal 2: Frontend
   cd Frontend
   npm run dev
   ```

2. **Make Changes**
   - Frontend changes reload automatically (HMR)
   - Backend changes require restart

3. **Test in Browser**
   - Open http://localhost:3000
   - Test features
   - Check browser console (F12) for errors

4. **Build Before Deployment**
   ```bash
   npm run build  # Frontend
   ```

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `README.md` (root) | Project overview |
| `SETUP.md` | Full stack setup guide |
| `Frontend/README.md` | Frontend documentation |
| `Frontend/GETTING_STARTED.md` | Quick start guide |
| `Backend/README.md` | Backend documentation |
| `Backend/API_DOCUMENTATION.md` | API reference |
| `FRONTEND_SETUP_SUMMARY.md` | Frontend summary |

---

## 🚀 Deployment Checklist

### Before Deployment

- [ ] Update `.env.production` with production URLs
- [ ] Set `DEBUG=False` in backend
- [ ] Change `SECRET_KEY` in backend
- [ ] Configure `ALLOWED_HOSTS` in backend
- [ ] Setup database (PostgreSQL for production)
- [ ] Setup Redis for caching/Celery
- [ ] Configure email service
- [ ] Setup logging and monitoring
- [ ] Run security checks
- [ ] Test with production build

### Deployment Steps

```bash
# Frontend
npm run build
# Deploy dist/ folder to hosting

# Backend
# Deploy to server and run:
python manage.py migrate
python manage.py collectstatic
gunicorn config.wsgi --bind 0.0.0.0:8000
```

---

## 💡 Tips & Tricks

1. **Hot Reload Frontend**: Changes are reflected instantly
2. **Type Safety**: TypeScript catches errors early
3. **Browser DevTools**: Use for debugging frontend
4. **Django Debug Toolbar**: Add to backend for profiling
5. **Git Commits**: Commit frequently with descriptive messages

---

## 🤝 Contributing

1. Create a feature branch
2. Make changes
3. Test thoroughly
4. Commit with clear messages
5. Push and create PR

---

## 📞 Support

- **Frontend Issues**: Check `Frontend/README.md`
- **Backend Issues**: Check `Backend/README.md`
- **API Issues**: Check `Backend/API_DOCUMENTATION.md`
- **Setup Issues**: Check `SETUP.md`

---

## 🎓 Learning Resources

- [React Docs](https://react.dev/)
- [Django Docs](https://docs.djangoproject.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)
- [REST API Best Practices](https://restfulapi.net/)

---

**Ready to start? Run these two commands in separate terminals:**

```bash
# Terminal 1
cd Backend && python manage.py runserver

# Terminal 2
cd Frontend && npm run dev
```

**Then open http://localhost:3000 in your browser!** 🎉
