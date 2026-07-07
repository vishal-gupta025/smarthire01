import { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Briefcase, CalendarClock, Building2, ChevronRight, ClipboardList } from 'lucide-react';
import toast from 'react-hot-toast';
import { Footer, Header, Loading, Button } from '../components';
import apiClient from '../api/client';
import { useAuthStore } from '../store/auth';
import { CandidateApplication } from '../types';
import { formatDatetime, getJobTypeLabel, getStatusColor } from '../utils/helpers';

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

export const CandidateApplications = () => {
  const { user, isAuthenticated } = useAuthStore();
  const [applications, setApplications] = useState<CandidateApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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

    if (isAuthenticated && user?.role === 'CANDIDATE') {
      fetchApplications();
    }
  }, [isAuthenticated, user?.role]);

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'CANDIDATE') {
    return <Navigate to="/dashboard/recruiter" replace />;
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
              <h1 className="text-4xl font-bold text-secondary-900 mt-2">My Applications</h1>
              <p className="text-secondary-600 mt-3">Track the jobs you applied to and monitor each application status.</p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full bg-primary-50 text-primary-700 px-4 py-2 font-semibold w-fit">
              <ClipboardList size={16} /> {applications.length} total applications
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
                        <h2 className="text-2xl font-semibold text-secondary-900 mt-1">{application.job_title}</h2>
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
              <h2 className="text-2xl font-bold text-secondary-900 mt-4">No applications yet</h2>
              <p className="text-secondary-600 mt-2 max-w-xl mx-auto">
                Browse open roles and submit your first application to start tracking it here.
              </p>
              <div className="mt-6">
                <Link to="/jobs">
                  <Button>Browse Jobs</Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CandidateApplications;