import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Header, Footer, Button, Loading } from '../components';
import { useAuthStore } from '../store/auth';
import { Briefcase, UserCircle2, BadgeCheck, MapPin, GraduationCap, FileText, Upload, Users, ChevronDown, ChevronUp } from 'lucide-react';
import { getDisplayName, isUserProfileComplete } from '../utils/profile';
import apiClient from '../api/client';
import { Job, RecruiterApplication } from '../types';

type RecruiterJobsResponse = Job[];

export const Profile = () => {
  const { user, isAuthenticated, candidateProfile, recruiterProfile, profileStatus, loadProfile } = useAuthStore();
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [recruiterJobs, setRecruiterJobs] = useState<Job[]>([]);
  const [applicationsByJob, setApplicationsByJob] = useState<Record<number, RecruiterApplication[]>>({});
  const [expandedJobs, setExpandedJobs] = useState<Record<number, boolean>>({});
  const [isRecruiterApplicationsLoading, setIsRecruiterApplicationsLoading] = useState(false);
  const displayName = getDisplayName(user, candidateProfile, recruiterProfile);

  useEffect(() => {
    if (isAuthenticated && user && profileStatus === 'idle') {
      loadProfile();
    }
  }, [isAuthenticated, loadProfile, profileStatus, user]);

  useEffect(() => {
    const fetchRecruiterApplications = async () => {
      if (!isAuthenticated || user?.role !== 'RECRUITER' || profileStatus !== 'loaded') {
        return;
      }

      try {
        setIsRecruiterApplicationsLoading(true);
        const jobsResponse = await apiClient.getRecruiterJobs();
        const jobs = (jobsResponse.data || []) as RecruiterJobsResponse;
        setRecruiterJobs(jobs);

        const applicationsResponses = await Promise.all(
          jobs.map(async (job) => {
            try {
              const response = await apiClient.getJobApplications(job.id);
              return [job.id, response.data || []] as const;
            } catch (error) {
              console.error(error);
              return [job.id, []] as const;
            }
          })
        );

        const nextApplicationsByJob = applicationsResponses.reduce<Record<number, RecruiterApplication[]>>((acc, [jobId, applications]) => {
          acc[jobId] = applications;
          return acc;
        }, {});

        setApplicationsByJob(nextApplicationsByJob);
        if (jobs.length > 0) {
          setExpandedJobs({ [jobs[0].id]: true });
        }
      } catch (error) {
        toast.error('Failed to load received applications');
        console.error(error);
      } finally {
        setIsRecruiterApplicationsLoading(false);
      }
    };

    fetchRecruiterApplications();
  }, [isAuthenticated, profileStatus, user?.role]);

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (profileStatus === 'loading' || profileStatus === 'idle') {
    return <Loading message="Loading your profile..." />;
  }

  if (!isUserProfileComplete(user, candidateProfile, recruiterProfile)) {
    return <Navigate to="/onboarding" replace />;
  }

  const roleLabel = user.role === 'CANDIDATE' ? 'Candidate' : user.role === 'RECRUITER' ? 'Recruiter' : 'Admin';
  const candidateSkills = candidateProfile?.skills
    ? candidateProfile.skills.split(',').map((skill) => skill.trim()).filter(Boolean)
    : [];
  const totalRecruiterApplications = Object.values(applicationsByJob).reduce(
    (count, applications) => count + applications.length,
    0
  );

  const handleResumeUpload = async () => {
    if (!resumeFile) {
      toast.error('Choose a resume file first');
      return;
    }

    try {
      setIsUploadingResume(true);
      await apiClient.uploadResume(resumeFile);
      setResumeFile(null);
      await loadProfile();
      toast.success('Resume updated successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update resume');
    } finally {
      setIsUploadingResume(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50 flex flex-col">
      <Header />
      <main className="flex-1 container-x py-12">
        <div className="max-w-4xl mx-auto">
          <div className="card p-8 md:p-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
              <div>
                <p className="text-sm font-semibold text-primary-600 uppercase tracking-wide">My Profile</p>
                <h1 className="text-3xl font-bold text-secondary-900 mt-2">{displayName}</h1>
                <p className="text-secondary-600 mt-2">Manage your SmartHire account and role-based experience.</p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-primary-50 text-primary-700 px-4 py-2 font-semibold w-fit">
                <BadgeCheck size={16} /> {roleLabel}
              </div>
            </div>            

              

            

            <div className="mt-10 border-t border-secondary-200 pt-8">
              <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                  <p className="text-sm font-semibold text-primary-600 uppercase tracking-wide">Onboarding Details</p>
                  <h2 className="text-xl font-bold text-secondary-900 mt-1">Your saved profile information</h2>
                </div>
              </div>

              {user.role === 'CANDIDATE' && candidateProfile ? (
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-2xl border border-secondary-200 bg-white p-5">
                    <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center mb-4">
                      <UserCircle2 size={20} />
                    </div>
                    <p className="text-sm text-secondary-500">Full name</p>
                    <p className="text-lg font-semibold text-secondary-900 mt-1">{candidateProfile.full_name || 'Not provided'}</p>
                  </div>

                  <div className="rounded-2xl border border-secondary-200 bg-white p-5">
                    <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center mb-4">
                      <GraduationCap size={20} />
                    </div>
                    <p className="text-sm text-secondary-500">Education</p>
                    <p className="text-lg font-semibold text-secondary-900 mt-1">{candidateProfile.education || 'Not provided'}</p>
                  </div>

                  <div className="rounded-2xl border border-secondary-200 bg-white p-5">
                    <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center mb-4">
                      <FileText size={20} />
                    </div>
                    <p className="text-sm text-secondary-500">Experience</p>
                    <p className="text-lg font-semibold text-secondary-900 mt-1">{candidateProfile.experience || 'Not provided'}</p>
                  </div>

                  <div className="rounded-2xl border border-secondary-200 bg-white p-5">
                    <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center mb-4">
                      <BadgeCheck size={20} />
                    </div>
                    <p className="text-sm text-secondary-500">Skills</p>
                    {candidateSkills.length > 0 ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {candidateSkills.map((skill) => (
                          <span key={skill} className="px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-sm font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-lg font-semibold text-secondary-900 mt-1">Not provided</p>
                    )}
                  </div>

                  <div className="rounded-2xl border border-secondary-200 bg-white p-5 md:col-span-2">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center mb-4">
                          <Upload size={20} />
                        </div>
                        <p className="text-sm text-secondary-500">Resume</p>
                        {candidateProfile.current_resume_url ? (
                          <a
                            href={candidateProfile.current_resume_url}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-1 inline-flex items-center gap-2 text-lg font-semibold text-primary-600 hover:text-primary-700"
                          >
                            {candidateProfile.current_resume_name || 'View current resume'}
                          </a>
                        ) : (
                          <p className="text-lg font-semibold text-secondary-900 mt-1">No resume uploaded yet</p>
                        )}
                        <p className="mt-2 text-sm text-secondary-500">
                          {candidateProfile.current_resume_status ? `Status: ${candidateProfile.current_resume_status}` : 'Upload a PDF or DOCX to replace your resume.'}
                        </p>
                      </div>

                      <div className="w-full md:max-w-md space-y-3">
                        <input
                          type="file"
                          accept=".pdf,.docx"
                          onChange={(event) => setResumeFile(event.target.files?.[0] ?? null)}
                          className="block w-full text-sm text-secondary-700 file:mr-4 file:rounded-lg file:border-0 file:bg-primary-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary-700 hover:file:bg-primary-100"
                        />
                        <Button
                          type="button"
                          className="w-full md:w-auto"
                          onClick={handleResumeUpload}
                          isLoading={isUploadingResume}
                          disabled={!resumeFile || isUploadingResume}
                        >
                          Update Resume
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : user.role === 'RECRUITER' && recruiterProfile ? (
                <div className="space-y-8">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="rounded-2xl border border-secondary-200 bg-white p-5">
                      <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center mb-4">
                        <Briefcase size={20} />
                      </div>
                      <p className="text-sm text-secondary-500">Company name</p>
                      <p className="text-lg font-semibold text-secondary-900 mt-1">{recruiterProfile.company_name || 'Not provided'}</p>
                    </div>

                    <div className="rounded-2xl border border-secondary-200 bg-white p-5">
                      <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center mb-4">
                        <MapPin size={20} />
                      </div>
                      <p className="text-sm text-secondary-500">Location</p>
                      <p className="text-lg font-semibold text-secondary-900 mt-1">{recruiterProfile.location || 'Not provided'}</p>
                    </div>

                    <div className="rounded-2xl border border-secondary-200 bg-white p-5 md:col-span-2">
                      <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center mb-4">
                        <FileText size={20} />
                      </div>
                      <p className="text-sm text-secondary-500">Company description</p>
                      <p className="text-lg font-semibold text-secondary-900 mt-1 whitespace-pre-line">
                        {recruiterProfile.company_description || 'Not provided'}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-secondary-200 bg-white p-6">
                    <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between mb-6">
                      <div>
                        <p className="text-sm font-semibold text-primary-600 uppercase tracking-wide">Received Applications</p>
                        <h2 className="text-2xl font-bold text-secondary-900 mt-1">Applications on your posted jobs</h2>
                      </div>
                      <div className="inline-flex items-center gap-2 rounded-full bg-secondary-100 px-4 py-2 text-sm font-semibold text-secondary-800">
                        <Users size={16} /> {totalRecruiterApplications} total applications
                      </div>
                    </div>

                    {isRecruiterApplicationsLoading ? (
                      <Loading message="Loading received applications..." />
                    ) : recruiterJobs.length > 0 ? (
                      <div className="space-y-5">
                        {recruiterJobs.map((job) => {
                          const applications = applicationsByJob[job.id] || [];
                          const isExpanded = expandedJobs[job.id] ?? false;

                          return (
                            <section key={job.id} className="rounded-2xl border border-secondary-200 p-5">
                              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                <div>
                                  <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">Posted Job</p>
                                  <h3 className="mt-1 text-xl font-bold text-secondary-900">{job.title}</h3>
                                  <p className="mt-2 max-w-3xl text-secondary-600">{job.job_descriptions}</p>
                                  <div className="mt-4 flex flex-wrap gap-3 text-sm text-secondary-600">
                                    <span className="inline-flex items-center gap-2 rounded-full bg-secondary-100 px-3 py-1.5">
                                      <Users size={14} className="text-primary-500" /> {applications.length} application{applications.length === 1 ? '' : 's'}
                                    </span>
                                  </div>
                                </div>

                                <Button variant="outline" onClick={() => setExpandedJobs((current) => ({ ...current, [job.id]: !current[job.id] }))}>
                                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                  {isExpanded ? 'Hide Applications' : 'View Applications'}
                                </Button>
                              </div>

                              {isExpanded && (
                                <div className="mt-6 border-t border-secondary-200 pt-6">
                                  {applications.length > 0 ? (
                                    <div className="space-y-4">
                                      {applications.map((application) => (
                                        <div key={application.application_id} className="rounded-2xl bg-secondary-50 p-5">
                                          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                            <div className="space-y-3">
                                              <div>
                                                <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">Candidate Application</p>
                                                <h4 className="mt-1 text-xl font-bold text-secondary-900">{application.candidate_name}</h4>
                                                <p className="mt-1 text-sm text-secondary-600">Applied {application.applied_at ? new Date(application.applied_at).toLocaleString() : 'recently'}</p>
                                              </div>

                                              <div className="flex flex-wrap gap-3 text-sm text-secondary-600">
                                                <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5">
                                                  <Users size={14} className="text-primary-500" /> {application.skills || 'Skills not provided'}
                                                </span>
                                                <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5">
                                                  <FileText size={14} className="text-primary-500" /> {application.experience || 'Experience not provided'}
                                                </span>
                                              </div>

                                              <p className="max-w-3xl text-sm text-secondary-600">
                                                <span className="font-semibold text-secondary-800">Education:</span> {application.education || 'Not provided'}
                                              </p>

                                              {application.resume ? (
                                                <a
                                                  href={application.resume}
                                                  target="_blank"
                                                  rel="noreferrer"
                                                  className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700"
                                                >
                                                  View Resume
                                                </a>
                                              ) : null}
                                            </div>
                                          </div>
                                        </div>
                                      ))}
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
                      <div className="rounded-2xl bg-secondary-50 p-8 text-center text-secondary-600">
                        You have not posted any jobs yet, so there are no received applications to show.
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-secondary-300 bg-secondary-50 p-6 text-secondary-600">
                  No onboarding details found yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
