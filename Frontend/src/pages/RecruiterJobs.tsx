import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Briefcase,
  Building2,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock3,
  FileText,
  Mail,
  Users,
  XCircle,
} from 'lucide-react';
import { Header, Footer, Button, Loading } from '../components';
import apiClient from '../api/client';
import { useAuthStore } from '../store/auth';
import { Job, RecruiterApplication } from '../types';
import { formatDatetime, getJobTypeLabel, getStatusColor } from '../utils/helpers';

type JobApplicationsMap = Record<number, RecruiterApplication[]>;

const statusLabelMap: Record<RecruiterApplication['status'], string> = {
  applied: 'Applied',
  under_review: 'Under Review',
  interview_scheduled: 'Interview Scheduled',
  offered: 'Accepted',
  rejected: 'Rejected',
};

export const RecruiterJobs = () => {
  const { user, isAuthenticated } = useAuthStore();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applicationsByJob, setApplicationsByJob] = useState<JobApplicationsMap>({});
  const [expandedJobs, setExpandedJobs] = useState<Record<number, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [updatingApplicationId, setUpdatingApplicationId] = useState<number | null>(null);

  useEffect(() => {
    const fetchRecruiterJobs = async () => {
      try {
        setIsLoading(true);
        const jobsResponse = await apiClient.getRecruiterJobs();
        const recruiterJobs = jobsResponse.data || [];
        setJobs(recruiterJobs);

        const applicationsResponses = await Promise.all(
          recruiterJobs.map(async (job: Job) => {
            try {
              const response = await apiClient.getJobApplications(job.id);
              return [job.id, response.data || []] as const;
            } catch (error) {
              console.error(error);
              return [job.id, []] as const;
            }
          })
        );

        const nextApplicationsByJob = applicationsResponses.reduce<JobApplicationsMap>((acc, [jobId, applications]) => {
          acc[jobId] = applications;
          return acc;
        }, {});

        setApplicationsByJob(nextApplicationsByJob);

        if (recruiterJobs.length > 0) {
          setExpandedJobs({ [recruiterJobs[0].id]: true });
        }
      } catch (error) {
        toast.error('Failed to load your jobs');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated && user?.role === 'RECRUITER') {
      fetchRecruiterJobs();
    }
  }, [isAuthenticated, user?.role]);

  const totalApplications = useMemo(
    () => Object.values(applicationsByJob).reduce((count, applications) => count + applications.length, 0),
    [applicationsByJob]
  );

  const toggleJob = (jobId: number) => {
    setExpandedJobs((current) => ({
      ...current,
      [jobId]: !current[jobId],
    }));
  };

  const updateStatus = async (jobId: number, applicationId: number, status: 'offered' | 'rejected') => {
    try {
      setUpdatingApplicationId(applicationId);
      await apiClient.updateApplicationStatus(applicationId, status);

      setApplicationsByJob((current) => ({
        ...current,
        [jobId]: (current[jobId] || []).map((application) =>
          application.application_id === applicationId ? { ...application, status } : application
        ),
      }));

      toast.success(status === 'offered' ? 'Application accepted and email sent' : 'Application rejected and email sent');
    } catch (error) {
      toast.error('Failed to update application status');
      console.error(error);
    } finally {
      setUpdatingApplicationId(null);
    }
  };

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'RECRUITER') {
    return <Navigate to="/dashboard/candidate" replace />;
  }

  if (isLoading) {
    return (
      <>
        <Header />
        <Loading message="Loading your jobs..." />
        <Footer />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50 flex flex-col">
      <Header />
      <main className="flex-1 container-x py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="rounded-3xl bg-gradient-to-r from-primary-600 to-primary-700 p-8 text-white shadow-lg">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary-100">Recruiter Jobs</p>
            <h1 className="text-4xl font-bold mt-2">Your posted jobs and applications</h1>
            <p className="mt-3 max-w-2xl text-primary-100">
              Review only the jobs you created, see how many candidates applied to each one, and update every application
              status from here.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-primary-100">
                  <Briefcase size={18} />
                  <span className="text-sm font-medium">Jobs Created</span>
                </div>
                <p className="mt-2 text-3xl font-bold">{jobs.length}</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-primary-100">
                  <Users size={18} />
                  <span className="text-sm font-medium">Applications Received</span>
                </div>
                <p className="mt-2 text-3xl font-bold">{totalApplications}</p>
              </div>              
            </div>
          </div>

          {jobs.length > 0 ? (
            <div className="space-y-6">
              {jobs.map((job) => {
                const applications = applicationsByJob[job.id] || [];
                const isExpanded = expandedJobs[job.id] ?? false;

                return (
                  <section key={job.id} className="card p-6">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="space-y-4">
                        <div>
                          <div className="flex flex-wrap items-center gap-3">
                            <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">Posted Job</p>
                            
                          </div>
                          <h2 className="mt-2 text-2xl font-bold text-secondary-900">{job.title}</h2>
                          <p className="mt-2 max-w-3xl text-secondary-600">{job.job_descriptions}</p>
                        </div>

                        <div className="flex flex-wrap gap-3 text-sm text-secondary-600">
                          
                          <span className="inline-flex items-center gap-2 rounded-full bg-secondary-100 px-3 py-1.5">
                            <Briefcase size={14} className="text-primary-500" /> {getJobTypeLabel(job.job_type)}
                          </span>
                          <span className="inline-flex items-center gap-2 rounded-full bg-secondary-100 px-3 py-1.5">
                            <Clock3 size={14} className="text-primary-500" /> Posted {formatDatetime(job.posted_at)}
                          </span>
                          <span className="inline-flex items-center gap-2 rounded-full bg-secondary-100 px-3 py-1.5">
                            <FileText size={14} className="text-primary-500" /> Openings: {job.number_of_openings}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-start gap-3 lg:items-end">
                        <div className="rounded-full bg-secondary-100 px-4 py-2 text-sm font-semibold text-secondary-800">
                          {applications.length} application{applications.length === 1 ? '' : 's'} received
                        </div>
                        <Button variant="outline" onClick={() => toggleJob(job.id)}>
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          {isExpanded ? 'Hide Applications' : 'View Applications'}
                        </Button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="mt-6 border-t border-secondary-200 pt-6">
                        {applications.length > 0 ? (
                          <div className="space-y-4">
                            {applications.map((application) => {
                              const isDecisionMade = application.status === 'offered' || application.status === 'rejected';
                              return (
                                <div key={application.application_id} className="rounded-2xl border border-secondary-200 p-5">
                                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                    <div className="space-y-3">
                                      <div>
                                        <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">
                                          Candidate Application
                                        </p>
                                        <h3 className="mt-1 text-xl font-bold text-secondary-900">{application.candidate_name}</h3>
                                        <p className="mt-1 text-sm text-secondary-600">Applied {formatDatetime(application.applied_at)}</p>
                                      </div>

                                      <div className="flex flex-wrap gap-3 text-sm text-secondary-600">
                                        <span className="inline-flex items-center gap-2 rounded-full bg-secondary-100 px-3 py-1.5">
                                          <Users size={14} className="text-primary-500" /> {application.skills || 'Skills not provided'}
                                        </span>
                                        <span className="inline-flex items-center gap-2 rounded-full bg-secondary-100 px-3 py-1.5">
                                          <FileText size={14} className="text-primary-500" /> {application.experience || 'Experience not provided'}
                                        </span>
                                        <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-medium ${getStatusColor(application.status)}`}>
                                          {statusLabelMap[application.status]}
                                        </span>
                                      </div>

                                      <p className="max-w-3xl text-sm text-secondary-600">
                                        <span className="font-semibold text-secondary-800">Education:</span> {application.education || 'Not provided'}
                                      </p>

                                      {application.resume ? (
                                        <Link to={application.resume} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700">
                                          View Resume
                                        </Link>
                                      ) : null}
                                    </div>

                                    <div className="flex flex-col gap-3 lg:min-w-[220px] lg:items-end">
                                      <Button
                                        variant="secondary"
                                        className="w-full lg:w-auto"
                                        onClick={() => updateStatus(job.id, application.application_id, 'offered')}
                                        disabled={updatingApplicationId === application.application_id || isDecisionMade}
                                      >
                                        <CheckCircle2 size={16} /> Accept
                                      </Button>
                                      <Button
                                        variant="danger"
                                        className="w-full lg:w-auto"
                                        onClick={() => updateStatus(job.id, application.application_id, 'rejected')}
                                        disabled={updatingApplicationId === application.application_id || isDecisionMade}
                                      >
                                        <XCircle size={16} /> Reject
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="rounded-2xl bg-secondary-50 p-8 text-center text-secondary-600">
                            No applications have been received for this job yet.
                          </div>
                        )}
                      </div>
                    )}
                  </section>
                );
              })}
            </div>
          ) : (
            <div className="card p-12 text-center">
              <Briefcase className="mx-auto text-primary-500" size={44} />
              <h2 className="mt-4 text-2xl font-bold text-secondary-900">You have not created any jobs yet</h2>
              <p className="mx-auto mt-2 max-w-xl text-secondary-600">
                Once you post jobs, they will appear here with the applications each role receives.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RecruiterJobs;