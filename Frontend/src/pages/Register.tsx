import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, Briefcase, User } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Header, Footer, Button, Input } from '../components';
import { useAuth } from '../hooks/useAuth';

const registerSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [role, setRole] = useState<'candidate' | 'recruiter'>(
    (searchParams.get('role') as 'candidate' | 'recruiter') || 'candidate'
  );
  const { register: registerUser, isLoading } = useAuth();
  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      // Log payload for debugging
      console.log('Register payload:', { email: data.email, password: data.password, role });
      await registerUser(data.email, data.password, role);
      navigate('/login');
    } catch (error: unknown) {
      // Log error details for debugging in the browser console
      const authError = error as { response?: { data?: unknown } };
      console.error('Registration failed (UI):', authError?.response?.data || error);
    }
  };

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 flex items-center py-12">
        <div className="container-x w-full">
          <div className="max-w-md mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-secondary-900 mb-2">Create Account</h1>
              <p className="text-secondary-600">Join SmartHire and start your journey</p>
            </div>

            {/* Role Selection */}
            <div className="space-y-4 mb-8">
              <p className="text-sm font-semibold text-secondary-700">I am a</p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setRole('candidate')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    role === 'candidate'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-secondary-200 hover:border-secondary-300'
                  }`}
                >
                  <User size={24} className={role === 'candidate' ? 'text-primary-600' : 'text-secondary-400'} />
                  <p className={`text-sm font-medium mt-2 ${role === 'candidate' ? 'text-primary-600' : 'text-secondary-700'}`}>
                    Candidate
                  </p>
                </button>

                <button
                  onClick={() => setRole('recruiter')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    role === 'recruiter'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-secondary-200 hover:border-secondary-300'
                  }`}
                >
                  <Briefcase size={24} className={role === 'recruiter' ? 'text-primary-600' : 'text-secondary-400'} />
                  <p className={`text-sm font-medium mt-2 ${role === 'recruiter' ? 'text-primary-600' : 'text-secondary-700'}`}>
                    Recruiter
                  </p>
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input
                label="Email"
                type="email"
                placeholder="your@email.com"
                icon={<Mail size={18} />}
                {...registerField('email')}
                error={errors.email?.message}
              />

              <Input
                label="Password"
                type="password"
                placeholder="Create a strong password"
                icon={<Lock size={18} />}
                {...registerField('password')}
                error={errors.password?.message}
              />

              <Input
                label="Confirm Password"
                type="password"
                placeholder="Confirm your password"
                icon={<Lock size={18} />}
                {...registerField('confirmPassword')}
                error={errors.confirmPassword?.message}
              />

              <Button isLoading={isLoading} type="submit" className="w-full">
                Create Account
              </Button>
            </form>

            {/* Terms */}
            <p className="text-xs text-secondary-600 text-center mt-6">
              By signing up, you agree to our{' '}
              <a href="#" className="text-primary-600 hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-primary-600 hover:underline">
                Privacy Policy
              </a>
            </p>

            {/* Login Link */}
            <p className="text-center text-secondary-600 mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 font-semibold hover:underline">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Register;
