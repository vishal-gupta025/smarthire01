import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Header, Footer, Button, Input } from '../components';
import { useAuth } from '../hooks/useAuth';
import { useAuthStore } from '../store/auth';
import { useEffect } from 'react';
import { getDashboardRoute, isUserProfileComplete } from '../utils/profile';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const { isAuthenticated, user, candidateProfile, recruiterProfile, profileStatus, loadProfile } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (!isAuthenticated || !user) {
      return;
    }

    const redirect = async () => {
      if (profileStatus === 'idle') {
        await loadProfile();
      }

      const complete = isUserProfileComplete(user, candidateProfile, recruiterProfile);
      navigate(complete ? getDashboardRoute(user.role) : '/onboarding', { replace: true });
    };

    redirect();
  }, [candidateProfile, isAuthenticated, loadProfile, navigate, profileStatus, recruiterProfile, user]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await login(data.email, data.password);
      navigate(result.nextRoute, { replace: true });
    } catch (error) {
      // Error is already handled in the hook
    }
  };

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 flex items-center py-12">
        <div className="container-x w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Side - Info */}
            <div className="hidden md:block">
              <h2 className="text-4xl font-bold text-secondary-900 mb-6 leading-tight">
                Welcome Back to <span className="text-primary-600">SmartHire</span>
              </h2>
              <p className="text-lg text-secondary-600 mb-8">
                Log in to access your dashboard, manage applications, and take advantage of our AI-powered recruiting tools.
              </p>

              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                    </div>
                    <div>
                      <p className="font-medium text-secondary-900">{benefit.title}</p>
                      <p className="text-sm text-secondary-600">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side - Form */}
            <div>
              <div className="card p-8">
                <h1 className="text-2xl font-bold text-secondary-900 mb-2">Login</h1>
                <p className="text-secondary-600 mb-8">Sign in to your account</p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="your@email.com"
                    icon={<Mail size={18} />}
                    {...register('email')}
                    error={errors.email?.message}
                  />

                  <Input
                    label="Password"
                    type="password"
                    placeholder="Enter your password"
                    icon={<Lock size={18} />}
                    {...register('password')}
                    error={errors.password?.message}
                  />

                  {/* <div className="flex items-center justify-between">
                    <a href="#" className="text-sm text-primary-600 hover:underline font-medium">
                      Forgot password?
                    </a>
                  </div> */}

                  <Button isLoading={isLoading} type="submit" className="w-full">
                    Login <ArrowRight size={18} />
                  </Button>
                </form>

                
                {/* Sign Up Link */}
                <p className="text-center text-secondary-600">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-primary-600 font-semibold hover:underline">
                    Sign up here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

const benefits = [
  {
    title: 'For Candidates',
    description: 'Find your dream job and track your applications',
  },
  {
    title: 'For Recruiters',
    description: 'Manage job postings and discover top candidates',
  },
  {
    title: 'AI Powered',
    description: 'Intelligent matching powered by advanced AI',
  },
];

export default Login;
