# SmartHire Frontend - Getting Started Guide

## ✨ What's Included

A beautiful, production-ready React TypeScript frontend for the SmartHire intelligent recruitment platform with:

- ✅ **Modern UI Design** - Clean, responsive design with Tailwind CSS
- ✅ **Type Safety** - Full TypeScript support with strict type checking
- ✅ **Authentication** - Complete JWT-based auth flow
- ✅ **API Integration** - Ready-to-use API client with token refresh
- ✅ **State Management** - Zustand for global state
- ✅ **Form Handling** - React Hook Form with Zod validation
- ✅ **Responsive Design** - Mobile, tablet, and desktop support
- ✅ **Reusable Components** - Button, Input, Loading, JobCard, etc.
- ✅ **Error Handling** - Comprehensive error handling with toast notifications
- ✅ **Routing** - React Router v6 with protected routes
- ✅ **Production Build** - Optimized build with code splitting

## 📁 Project Structure

```
Frontend/
├── src/
│   ├── api/
│   │   └── client.ts                # Axios API client with interceptors
│   ├── components/
│   │   ├── Button.tsx               # Reusable button component
│   │   ├── Input.tsx                # Reusable input field
│   │   ├── Header.tsx               # Navigation header
│   │   ├── Footer.tsx               # Footer component
│   │   ├── JobCard.tsx              # Job listing card
│   │   ├── Loading.tsx              # Loading spinner
│   │   └── index.ts                 # Component exports
│   ├── hooks/
│   │   └── useAuth.ts               # Authentication hook
│   ├── pages/
│   │   ├── Landing.tsx              # Home page with features
│   │   ├── Login.tsx                # Login page
│   │   ├── Register.tsx             # Sign up page
│   │   ├── Jobs.tsx                 # Job listing with filters
│   │   ├── JobDetail.tsx            # Job detail page
│   │   ├── NotFound.tsx             # 404 page
│   │   └── index.ts                 # Page exports
│   ├── store/
│   │   └── auth.ts                  # Zustand auth & UI store
│   ├── types/
│   │   └── index.ts                 # TypeScript interfaces
│   ├── utils/
│   │   └── helpers.ts               # Utility functions
│   ├── App.tsx                      # Main app with routing
│   ├── main.tsx                     # React entry point
│   └── index.css                    # Global styles
├── Dockerfile                       # Docker image
├── vite.config.ts                   # Vite configuration
├── tailwind.config.js               # Tailwind CSS config
├── postcss.config.js                # PostCSS config
├── tsconfig.json                    # TypeScript config
├── .env                             # Environment variables
├── .env.production                  # Production environment
├── .env.example                     # Example environment
├── index.html                       # HTML entry point
├── package.json                     # Dependencies
└── README.md                        # Full documentation
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd Frontend
npm install
```

### 2. Configure Environment

```bash
# Copy environment file
cp .env.example .env

# Update API URL if needed
# VITE_API_BASE_URL=http://localhost:8000/api
```

### 3. Start Development Server

```bash
npm run dev
```

The frontend will be available at **http://localhost:3000**

### 4. Build for Production

```bash
npm run build
npm run preview  # Preview the build
```

## 📖 Pages Overview

### Public Pages
- **`/`** - Landing page with features and CTA
- **`/login`** - User login
- **`/register`** - User registration (Candidate/Recruiter)
- **`/jobs`** - Browse all job listings with filters
- **`/jobs/:id`** - View job details and apply

### Protected Pages (Coming Soon)
- **`/dashboard/candidate`** - Candidate dashboard
- **`/dashboard/recruiter`** - Recruiter dashboard
- **`/profile`** - User profile management

## 🎯 Key Features

### Authentication
- Register as Candidate or Recruiter
- Email and password validation
- JWT token management with automatic refresh
- Secure token storage
- Logout functionality

### Job Browsing
- Search jobs by title and location
- Filter by job type (Full-time, Part-time, Intern, Remote)
- View detailed job information
- Apply for jobs
- Responsive job cards

### API Integration
- Automatic token injection in requests
- Token refresh on 401 errors
- Centralized error handling
- Request/response interceptors
- Type-safe API calls

### Form Handling
- React Hook Form for efficient form management
- Zod for runtime validation
- Real-time error display
- Success/error notifications

### UI/UX
- Tailwind CSS for styling
- Lucide React for icons
- React Hot Toast for notifications
- Smooth animations
- Loading states

## 🔌 API Connection

The frontend connects to the Django backend API. Make sure the backend is running:

```bash
# Backend should be running on http://localhost:8000
cd Backend
python manage.py runserver
```

### Environment Variables

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000/api

# App Configuration
VITE_APP_NAME=SmartHire
VITE_APP_VERSION=1.0.0
```

## 💻 Development

### Run Development Server

```bash
npm run dev
```

This starts Vite dev server with:
- Hot Module Replacement (HMR)
- Fast refresh
- API proxy to backend

### TypeScript Checking

```bash
npm run build  # Runs TypeScript compiler + Vite build
```

## 📦 Building

### Production Build

```bash
npm run build
```

This creates:
- Optimized bundle in `dist/` folder
- Minified CSS and JavaScript
- Asset optimization
- Source maps (optional)

### Build Output

```
dist/
├── index.html
├── assets/
│   ├── index-HASH.js        # Main bundle
│   ├── index-HASH.css       # Compiled Tailwind CSS
│   └── vite-HASH.svg        # Vite logo
└── favicon.svg
```

## 🐳 Docker Deployment

### Build Docker Image

```bash
docker build -t smarthire-frontend .
```

### Run Docker Container

```bash
docker run -p 3000:3000 smarthire-frontend
```

### Docker Compose

```bash
# From project root
docker-compose -f docker-compose-full.yml up
```

## 📚 Component Usage Examples

### Button Component

```typescript
import { Button } from '@/components';

<Button variant="primary" size="lg" isLoading={loading}>
  Click Me
</Button>

<Button variant="outline" onClick={handleClick}>
  Outline Button
</Button>
```

### Input Component

```typescript
import { Input } from '@/components';

<Input
  label="Email"
  type="email"
  placeholder="Enter email"
  error={errors.email?.message}
  {...register('email')}
/>
```

### Using API Client

```typescript
import apiClient from '@/api/client';

// Get jobs
const response = await apiClient.get('/jobs/');
const jobs = response.data;

// Login
const auth = await apiClient.login(email, password);
localStorage.setItem('access_token', auth.data.access);
```

### Using Auth Hook

```typescript
import { useAuth } from '@/hooks/useAuth';

const { user, isAuthenticated, login, logout } = useAuth();

// Login
const handleLogin = async (email, password) => {
  await login(email, password);
  // User is automatically set in store
};
```

### Using Store

```typescript
import { useAuthStore } from '@/store/auth';

const { user, isAuthenticated, setUser } = useAuthStore();

// Manually set user (usually done via login hook)
setUser(userData);
```

## 🎨 Customization

### Colors

Edit `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        50: "#f0f9ff",
        500: "#0ea5e9",
        600: "#0284c7",
        // ...
      },
    },
  },
}
```

### Fonts

Edit `tailwind.config.js`:

```javascript
theme: {
  extend: {
    fontFamily: {
      sans: ['Your Font', 'system-ui', 'sans-serif'],
    },
  },
}
```

### Spacing & Sizing

Use Tailwind's default scale or customize in `tailwind.config.js`.

## 🔐 Security

- **JWT Tokens** - Secure authentication with JWT
- **Token Refresh** - Automatic token refresh on expiry
- **CORS** - Configured on backend
- **Input Validation** - Zod schema validation
- **Environment Variables** - Sensitive data in .env files
- **HTTPS Only** - Use HTTPS in production

## 📝 Environment Variables

### Development (.env)

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME=SmartHire
VITE_APP_VERSION=1.0.0
```

### Production (.env.production)

```env
VITE_API_BASE_URL=https://api.smarthire.com/api
VITE_APP_NAME=SmartHire
VITE_APP_VERSION=1.0.0
```

## 🚀 Deployment

### Vercel

```bash
npm install -g vercel
vercel
```

### Netlify

Connect GitHub repository to Netlify:
- Build command: `npm run build`
- Publish directory: `dist`

### AWS S3 + CloudFront

```bash
npm run build
aws s3 sync dist/ s3://your-bucket/
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
```

## 🧪 Testing (Optional)

To add testing:

```bash
npm install -D vitest @testing-library/react @testing-library/user-event
```

Create `vite.config.ts.test`:

```typescript
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
});
```

## 🐛 Troubleshooting

### Port 3000 Already in Use

```bash
# macOS/Linux
lsof -i :3000
kill -9 <PID>

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Build Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### API Connection Issues

1. Check backend is running on correct port
2. Verify `VITE_API_BASE_URL` in `.env`
3. Check CORS configuration in backend
4. Check browser console for errors

## 📚 Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Router](https://reactrouter.com/)
- [Zustand](https://github.com/pmndrs/zustand)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

MIT License - See LICENSE file

## 👨‍💻 Support

For issues and questions:
- Open an issue on GitHub
- Email: support@smarthire.com
- Check [Full Documentation](./README.md)

---

**Built with ❤️ for SmartHire Recruitment Platform**

Happy coding! 🚀
