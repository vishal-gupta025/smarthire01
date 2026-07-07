# SmartHire Frontend

A beautiful and engaging React TypeScript frontend for the SmartHire intelligent recruitment platform, powered by AI-driven candidate matching and resume parsing.

## 🎨 Features

- **Modern UI Design** - Beautiful, responsive design with Tailwind CSS
- **Type-Safe Development** - Full TypeScript support for maximum reliability
- **Intelligent Routing** - React Router v6 for seamless navigation
- **State Management** - Zustand for simple and efficient global state
- **Form Validation** - React Hook Form with Zod schema validation
- **API Integration** - Axios with automatic token refresh and interceptors
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Beautiful Components** - Pre-built, reusable UI components
- **Toast Notifications** - React Hot Toast for user feedback
- **Icons** - Lucide React icons throughout the app

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **React 18** | UI library |
| **TypeScript** | Type safety |
| **Vite** | Build tool & dev server |
| **React Router v6** | Client-side routing |
| **Tailwind CSS** | Styling |
| **Axios** | HTTP client |
| **Zustand** | State management |
| **React Hook Form** | Form handling |
| **Zod** | Schema validation |
| **React Hot Toast** | Notifications |
| **Lucide React** | Icons |

## 📁 Project Structure

```
Frontend/
├── src/
│   ├── api/
│   │   └── client.ts           # Axios API client with interceptors
│   ├── components/
│   │   ├── Button.tsx          # Reusable button component
│   │   ├── Input.tsx           # Reusable input component
│   │   ├── Header.tsx          # Navigation header
│   │   ├── Footer.tsx          # Footer component
│   │   ├── JobCard.tsx         # Job listing card
│   │   ├── Loading.tsx         # Loading spinner
│   │   └── index.ts            # Component exports
│   ├── hooks/
│   │   └── useAuth.ts          # Authentication hook
│   ├── pages/
│   │   ├── Landing.tsx         # Home page
│   │   ├── Login.tsx           # Login page
│   │   ├── Register.tsx        # Registration page
│   │   ├── Jobs.tsx            # Job listing page
│   │   ├── JobDetail.tsx       # Job detail page
│   │   └── index.ts            # Page exports
│   ├── store/
│   │   └── auth.ts             # Zustand auth store
│   ├── types/
│   │   └── index.ts            # TypeScript types
│   ├── utils/
│   │   └── helpers.ts          # Utility functions
│   ├── App.tsx                 # Main app component
│   ├── main.tsx                # Entry point
│   └── index.css               # Global styles
├── .env                        # Environment variables
├── .env.production             # Production environment
├── .env.example                # Example environment
├── vite.config.ts              # Vite configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies
```

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn
- Backend API running on `http://localhost:8000`

### Installation

1. **Navigate to frontend directory:**
   ```bash
   cd Frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file** (or copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

4. **Update API URL** in `.env` if needed:
   ```
   VITE_API_BASE_URL=http://localhost:8000/api
   ```

### Development

Start the development server:

```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

### Build

Create a production build:

```bash
npm run build
```

### Preview

Preview the production build locally:

```bash
npm run preview
```

### Linting (Optional)

If you want to add ESLint:

```bash
npm install -D eslint eslint-plugin-react eslint-plugin-react-hooks @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

## 📚 Usage

### Authentication Flow

1. **Register** - Create a new account as Candidate or Recruiter
2. **Login** - Sign in with email and password
3. **Tokens** - Access and refresh tokens are stored in localStorage
4. **Token Refresh** - Automatic token refresh via interceptor

### API Client

Use the pre-configured API client:

```typescript
import apiClient from '@/api/client';

// Make requests
const response = await apiClient.get('/endpoint');
const response = await apiClient.post('/endpoint', data);
```

Tokens are automatically included in all requests!

### State Management

Access auth state with Zustand:

```typescript
import { useAuthStore } from '@/store/auth';

const { user, isAuthenticated, setUser, logout } = useAuthStore();
```

### Form Handling

Use React Hook Form with validation:

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schema),
});
```

### Components

Use pre-built components:

```typescript
import { Button, Input, JobCard, Loading } from '@/components';

<Button variant="primary" size="lg" isLoading={loading}>
  Click me
</Button>

<Input 
  label="Email" 
  type="email"
  error={errors.email?.message}
  {...register('email')}
/>
```

## 🎯 Pages

- **/** - Landing page with features and CTA
- **/login** - Login page
- **/register** - Registration page
- **/jobs** - Job listings with filters
- **/jobs/:id** - Job detail page
- **/dashboard/candidate** - Candidate dashboard (coming soon)
- **/dashboard/recruiter** - Recruiter dashboard (coming soon)

## 🔌 API Integration

The frontend is fully integrated with the SmartHire backend API:

- **Authentication** - Register, login, logout, token refresh
- **Candidate Profiles** - Get and update candidate information
- **Recruiter Profiles** - Get and update company information
- **Jobs** - Create, read, update, delete job postings
- **Applications** - Apply for jobs, track applications
- **Resumes** - Upload and parse resumes

See [Backend API Documentation](../Backend/API_DOCUMENTATION.md) for full details.

## 🎨 Customization

### Colors

Modify colors in `tailwind.config.js`:

```js
colors: {
  primary: { /* ... */ },
  secondary: { /* ... */ },
  accent: { /* ... */ },
}
```

### Fonts

Update font family in `tailwind.config.js`:

```js
fontFamily: {
  sans: ['Your Font', 'system-ui', 'sans-serif'],
}
```

### Breakpoints

Tailwind CSS responsive breakpoints are used throughout:
- `sm` - 640px
- `md` - 768px
- `lg` - 1024px
- `xl` - 1280px

## 📱 Responsive Design

The application is fully responsive:
- Mobile: 320px+
- Tablet: 768px+
- Desktop: 1024px+

## 🔐 Security

- **JWT Authentication** - Secure token-based auth
- **Token Storage** - Tokens in localStorage (consider switching to httpOnly cookies in production)
- **CORS** - Backend handles CORS configuration
- **Input Validation** - Zod schema validation on client
- **Error Handling** - Centralized error handling with user feedback

## 🚀 Deployment

### Vercel

```bash
npm install -g vercel
vercel
```

### Netlify

Connect your GitHub repository to Netlify for automatic deployments.

### Docker

Build a Docker image:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

Build and run:
```bash
docker build -t smarthire-frontend .
docker run -p 3000:3000 smarthire-frontend
```

## 📝 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | `http://localhost:8000/api` | Backend API URL |
| `VITE_APP_NAME` | `SmartHire` | Application name |
| `VITE_APP_VERSION` | `1.0.0` | Application version |

## 🤝 Contributing

1. Create a new branch for your feature
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 👨‍💻 Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Made with ❤️ for SmartHire**
