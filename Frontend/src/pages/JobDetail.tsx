import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Briefcase, DollarSign, Clock, Share2, Bookmark, ChevronLeft } from 'lucide-react';
import { Header, Footer, Button, Loading } from '../components';
import apiClient from '../api/client';
import { Job } from '../types';
import { formatCurrency, getJobTypeLabel, formatDate } from '../utils/helpers';
import { useAuthStore } from '../store/auth';
import toast from 'react-hot-toast';

export const JobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchJobDetail();
    }
  }, [id]);

  const fetchJobDetail = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get(`/jobs/${id}/`);
      setJob(response.data);
    } catch (error) {
      toast.error('Failed to load job details');
      navigate('/jobs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to apply');
      navigate('/login');
      return;
    }

    try {
      await apiClient.post(`/jobs/${id}/apply/`);
      toast.success('Application submitted successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to apply for this job');
    }
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <Loading message="Loading job details..." />
        <Footer />
      </>
    );
  }

  if (!job) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-secondary-600 mb-4">Job not found</p>
            <Button onClick={() => navigate('/jobs')}>Back to Jobs</Button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header />

      {/* Breadcrumb */}
      <div className="border-b border-secondary-200">
        <div className="container-x py-4">
          <button onClick={() => navigate('/jobs')} className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium">
            <ChevronLeft size={18} /> Back to Jobs
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 py-12">
        <div className="container-x">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="card p-8">
                {/* Header */}
                <div className="mb-8">
                  <h1 className="text-4xl font-bold text-secondary-900 mb-3">{job.title}</h1>
                  <p className="text-secondary-600">Posted on {formatDate(job.posted_at)}</p>
                </div>

                {/* Key Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 pb-8 border-b border-secondary-200">
                  <div>
                    <p className="text-xs font-semibold text-secondary-500 uppercase mb-1">Location</p>
                    <p className="flex items-center gap-2 text-secondary-900 font-medium">
                      <MapPin size={16} className="text-primary-500" /> {job.location}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-secondary-500 uppercase mb-1">Job Type</p>
                    <p className="flex items-center gap-2 text-secondary-900 font-medium">
                      <Briefcase size={16} className="text-primary-500" /> {getJobTypeLabel(job.job_type)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-secondary-500 uppercase mb-1">Experience</p>
                    <p className="flex items-center gap-2 text-secondary-900 font-medium">
                      <Clock size={16} className="text-primary-500" /> {job.experience_required}+ years
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-secondary-500 uppercase mb-1">Salary</p>
                    <p className="flex items-center gap-2 text-secondary-900 font-medium text-primary-600">
                      <DollarSign size={16} /> {formatCurrency(job.salary_min)} - {formatCurrency(job.salary_max)}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-secondary-900 mb-4">About This Role</h2>
                  <p className="text-secondary-700 leading-relaxed whitespace-pre-wrap">
                    {job.job_descriptions || 'No description provided'}
                  </p>
                </div>

                {/* Required Skills */}
                {job.skills_required && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-secondary-900 mb-4">Required Skills</h2>
                    <div className="flex flex-wrap gap-2">
                      {job.skills_required.split(',').map((skill, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-primary-100 text-primary-700 rounded-full font-medium"
                        >
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Openings */}
                <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                  <p className="text-sm text-primary-700">
                    <span className="font-bold">{job.number_of_openings}</span> position{job.number_of_openings !== 1 ? 's' : ''} available
                  </p>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Apply Card */}
              <div className="card p-6 mb-6 sticky top-24">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleApply}
                  className="w-full mb-3"
                  disabled={!isAuthenticated || user?.role === 'RECRUITER'}
                >
                  Apply Now
                </Button>

                <div className="flex gap-3">
                  <button className="flex-1 btn-secondary text-sm flex items-center justify-center gap-2">
                    <Bookmark size={18} /> Save
                  </button>
                  <button className="flex-1 btn-secondary text-sm flex items-center justify-center gap-2">
                    <Share2 size={18} /> Share
                  </button>
                </div>

                {!isAuthenticated && (
                  <p className="text-xs text-secondary-600 text-center mt-4">
                    <a href="/login" className="text-primary-600 font-semibold hover:underline">
                      Login
                    </a>{' '}
                    to apply for this job
                  </p>
                )}

                {user?.role === 'RECRUITER' && (
                  <p className="text-xs text-secondary-600 text-center mt-4">
                    Recruiters cannot apply for jobs
                  </p>
                )}
              </div>

              {/* About Company */}
              <div className="card p-6">
                <h3 className="font-bold text-secondary-900 mb-4">About the Company</h3>
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <Briefcase className="text-primary-600" />
                </div>
                <p className="text-sm text-secondary-600 leading-relaxed">
                  Learn more about this company and view all their job postings.
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

export default JobDetail;
