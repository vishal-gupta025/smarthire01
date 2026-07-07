import { Link } from 'react-router-dom';
import { Briefcase, Users, Zap, BarChart3, TrendingUp, CheckCircle, ArrowRight } from 'lucide-react';
import { Header, Footer, Button } from '../components';

export const Landing = () => {
  return (
    <div className="bg-white">
      <Header />

      {/* Hero Section */}
      <section className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center">
        <div className="container-x py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-in-left">
              <h1 className="text-5xl md:text-6xl font-bold text-secondary-900 mb-6 leading-tight">
                Hire Smarter,<br />
                <span className="text-gradient">Faster, Better</span>
              </h1>
              <p className="text-xl text-secondary-600 mb-8 leading-relaxed">
                SmartHire uses AI-powered resume parsing and intelligent matching to find the perfect candidates for your team.
              </p>
              
              <p className="text-sm text-secondary-600 mt-6">
                Join <span className="font-bold text-primary-600">2,500+</span> companies and <span className="font-bold text-primary-600">50,000+</span> candidates
              </p>
            </div>

            <div className="hidden md:block animate-slide-in-right">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-600 rounded-2xl blur-3xl opacity-20"></div>
                <div className="relative bg-white rounded-2xl p-8 shadow-2xl border border-primary-100">
                  <div className="space-y-4">
                    <div className="h-3 bg-primary-200 rounded-full w-3/4"></div>
                    <div className="h-3 bg-primary-200 rounded-full w-4/5"></div>
                    <div className="h-3 bg-secondary-200 rounded-full w-2/3"></div>
                    <div className="h-3 bg-secondary-200 rounded-full w-3/5"></div>
                  </div>
                  <div className="mt-8 pt-8 border-t border-secondary-200">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-primary-50 p-4 rounded-lg">
                        <p className="text-2xl font-bold text-primary-600">95%</p>
                        <p className="text-xs text-secondary-600">Match Accuracy</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">3x</p>
                        <p className="text-xs text-secondary-600">Faster Hiring</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container-x">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-secondary-900 mb-4">Powerful Features</h2>
            <p className="text-lg text-secondary-600">Everything you need for modern recruiting</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card p-8 hover:shadow-xl transition-all">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-secondary-900 mb-3">{feature.title}</h3>
                <p className="text-secondary-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-secondary-50">
        <div className="container-x">
          <h2 className="text-4xl font-bold text-secondary-900 text-center mb-16">How It Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              {steps.map((step, index) => (
                <div key={index} className="flex gap-6">
                  <div className="w-12 h-12 bg-primary-500 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-lg">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-secondary-900 mb-2">{step.title}</h3>
                    <p className="text-secondary-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="space-y-4">
                <div className="h-64 bg-gradient-to-br from-primary-200 to-primary-100 rounded-lg flex items-center justify-center">
                  <Zap size={64} className="text-primary-600 opacity-20" />
                </div>
                <p className="text-center text-secondary-600 mt-4">
                  AI-Powered Resume Parsing & Matching
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      

      <Footer />
    </div>
  );
};

const features = [
  {
    title: 'AI Resume Parsing',
    description: 'Automatically extract skills, experience, and education from resumes in seconds.',
    icon: <BarChart3 size={24} className="text-primary-600" />,
  },
  {
    title: 'Smart Matching',
    description: 'Get AI-powered candidate recommendations based on job requirements.',
    icon: <TrendingUp size={24} className="text-primary-600" />,
  },
  {
    title: 'Application Tracking',
    description: 'Manage job applications with intuitive workflows and status tracking.',
    icon: <Briefcase size={24} className="text-primary-600" />,
  },
  {
    title: 'Multi-Format Support',
    description: 'Upload resumes in PDF, DOCX, and other common formats.',
    icon: <CheckCircle size={24} className="text-primary-600" />,
  },
  {
    title: 'Team Collaboration',
    description: 'Share job postings and collaborate with your entire team.',
    icon: <Users size={24} className="text-primary-600" />,
  },
  {
    title: 'Real-Time Analytics',
    description: 'Track hiring metrics and get insights to improve your process.',
    icon: <BarChart3 size={24} className="text-primary-600" />,
  },
];

const steps = [
  {
    title: 'For Recruiters',
    description: 'Post jobs, receive applications, and let AI help you find the best candidates.',
  },
  {
    title: 'Upload Resume',
    description: 'Candidates upload their resumes and SmartHire extracts all key information.',
  },
  {
    title: 'Smart Matching',
    description: 'Our AI matches candidates with relevant job openings automatically.',
  },
  {
    title: 'Hire the Best',
    description: 'Review, shortlist, and hire your ideal candidates with confidence.',
  },
];

export default Landing;
