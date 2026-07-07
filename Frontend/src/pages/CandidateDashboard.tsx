import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Briefcase, CalendarClock, Building2, ChevronRight, ClipboardList, BookOpen, FileText, UserRound } from 'lucide-react';
import { Header, Footer, Button, Loading } from '../components';
import apiClient from '../api/client';
import { useAuthStore } from '../store/auth';
import { CandidateApplication } from '../types';
import { formatDatetime, getJobTypeLabel, getStatusColor } from '../utils/helpers';
import { getDisplayName, isCandidateProfileComplete } from '../utils/profile';

type CandidateApplicationsResponse = {
  total_applications: number;
  applications: CandidateApplication[];
};

const statusLabelMap: Record<CandidateApplication['status'], string> = {
  applied: 'Applied',
  under_review: 'Under Review',
  interview_scheduled: 'Interview Scheduled',
  offered: 'Offered',
  rejected: 'Rejected',
};

export const CandidateDashboard = () => {
  const { user, isAuthenticated, candidateProfile, profileStatus, loadProfile } = useAuthStore();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<CandidateApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const displayName = getDisplayName(user, candidateProfile, null);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'CANDIDATE' && profileStatus === 'idle') {
      loadProfile();
    }

    if (!isAuthenticated || user?.role !== 'CANDIDATE' || profileStatus !== 'loaded' || !isCandidateProfileComplete(candidateProfile)) {
      return;
    }

    const fetchApplications = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get<CandidateApplicationsResponse>('/jobs/candidate/applications/');
        setApplications(response.data.applications || []);
      } catch (error) {
        toast.error('Failed to load applications');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, [candidateProfile, isAuthenticated, loadProfile, profileStatus, user?.role]);

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'CANDIDATE') {
    return <Navigate to="/dashboard/recruiter" replace />;
  }

  if (profileStatus === 'loading' || profileStatus === 'idle') {
    return (
      <>
        <Header />
        <Loading message="Loading your profile..." />
        <Footer />
      </>
    );
  }

  if (!isCandidateProfileComplete(candidateProfile)) {
    return <Navigate to="/onboarding" replace />;
  }

  if (isLoading) {
    return (
      <>
        <Header />
        <Loading message="Loading your applications..." />
        <Footer />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50 flex flex-col">
      <Header />
      <main className="flex-1 container-x py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <div>
              <p className="text-sm font-semibold text-primary-600 uppercase tracking-wide">Candidate Dashboard</p>
              <h1 className="text-4xl font-bold text-secondary-900 mt-2">Welcome back, {displayName}</h1>
              <p className="text-secondary-600 mt-3">Track applications, manage your resume, and browse matching opportunities.</p>
            </div>

            
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="card p-6">
              <BookOpen className="text-primary-600" />
              <h2 className="text-xl font-semibold mt-4 text-secondary-900">Browse Jobs</h2>
              <p className="text-secondary-600 mt-2">Search openings and filter by location, role, and job type.</p>
              <Button className="mt-4" onClick={() => navigate('/jobs')}>Explore Jobs</Button>
            </div>

            <div className="card p-6">
              <FileText className="text-primary-600" />
              <h2 className="text-xl font-semibold mt-4 text-secondary-900">Applications</h2>
              <p className="text-secondary-600 mt-2">Review every job you have applied to in one place.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => document.getElementById('applications-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              >
                View Applications
              </Button>
            </div>

            <div className="card p-6">
              <UserRound className="text-primary-600" />
              <h2 className="text-xl font-semibold mt-4 text-secondary-900">Resume & Profile</h2>
              <p className="text-secondary-600 mt-2">Keep your profile updated for better matches.</p>
              <Button variant="secondary" className="mt-4" onClick={() => navigate('/profile')}>Open Profile</Button>
            </div>
          </div>

          <section id="applications-section" className="mt-12">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
              <div>
                <p className="text-sm font-semibold text-primary-600 uppercase tracking-wide">Applications</p>
                <h2 className="text-3xl font-bold text-secondary-900 mt-2">My Applications</h2>
                <p className="text-secondary-600 mt-3">All of the jobs you have applied to, with the latest status for each one.</p>
              </div>
            </div>

            {applications.length > 0 ? (
              <div className="space-y-4">
                {applications.map((application) => (
                  <div key={application.application_id} className="card p-6 hover:shadow-lg transition-shadow">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium text-primary-600">{application.company_name}</p>
                          <h3 className="text-2xl font-semibold text-secondary-900 mt-1">{application.job_title}</h3>
                        </div>

                        <div className="flex flex-wrap gap-3 text-sm text-secondary-600">
                          <span className="inline-flex items-center gap-2 rounded-full bg-secondary-100 px-3 py-1.5">
                            <Briefcase size={14} className="text-primary-500" /> {getJobTypeLabel(application.job_type)}
                          </span>
                          <span className="inline-flex items-center gap-2 rounded-full bg-secondary-100 px-3 py-1.5">
                            <Building2 size={14} className="text-primary-500" /> {application.company_name}
                          </span>
                          <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-medium ${getStatusColor(application.status)}`}>
                            {statusLabelMap[application.status]}
                          </span>
                          <span className="inline-flex items-center gap-2 rounded-full bg-secondary-100 px-3 py-1.5">
                            <CalendarClock size={14} className="text-primary-500" /> Applied {formatDatetime(application.applied_at)}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Link to={`/jobs/${application.job_id}`}>
                          <Button variant="outline" className="flex items-center gap-2">
                            View Job <ChevronRight size={16} />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card p-12 text-center">
                <ClipboardList className="mx-auto text-primary-500" size={40} />
                <h2 className="text-2xl font-bold text-secondary-900 mt-4">You have not applied for any jobs yet</h2>
                <p className="text-secondary-600 mt-2 max-w-xl mx-auto">
                  Browse open roles and submit your first application to see it listed here.
                </p>
                
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CandidateDashboard;
