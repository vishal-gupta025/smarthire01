import { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  BadgeCheck,
  Building2,
  Check,
  FileText,
  GraduationCap,
  MapPin,
  Sparkles,
  UserRound,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Header, Footer, Button, Input, Loading } from '../components';
import apiClient from '../api/client';
import { useAuthStore } from '../store/auth';
import { getDashboardRoute, getDisplayName, isUserProfileComplete } from '../utils/profile';

const candidateSchema = z.object({
  full_name: z.string().min(2, 'Full name is required'),
  skills: z.string().min(2, 'Add at least one skill'),
  experience: z.string().min(2, 'Experience is required'),
  education: z.string().min(2, 'Education is required'),
});

const recruiterSchema = z.object({
  company_name: z.string().min(2, 'Company name is required'),
  location: z.string().min(2, 'Location is required'),
  company_description: z.string().min(10, 'Company description is required'),
});

type CandidateFormValues = z.infer<typeof candidateSchema>;
type RecruiterFormValues = z.infer<typeof recruiterSchema>;

const candidateSuggestions = ['React', 'TypeScript', 'Node.js', 'Django', 'SQL', 'UI Design'];
const recruiterHighlights = ['Remote friendly', 'Fast hiring', 'Growth team', 'Startup'];

export const Onboarding = () => {
  const navigate = useNavigate();
  const {
    user,
    isAuthenticated,
    candidateProfile,
    recruiterProfile,
    profileStatus,
    loadProfile,
    setCandidateProfile,
    setRecruiterProfile,
  } = useAuthStore();

  const candidateForm = useForm<CandidateFormValues>({
    resolver: zodResolver(candidateSchema),
    defaultValues: {
      full_name: candidateProfile?.full_name ?? '',
      skills: candidateProfile?.skills ?? '',
      experience: candidateProfile?.experience ?? '',
      education: candidateProfile?.education ?? '',
    },
  });

  const recruiterForm = useForm<RecruiterFormValues>({
    resolver: zodResolver(recruiterSchema),
    defaultValues: {
      company_name: recruiterProfile?.company_name ?? '',
      location: recruiterProfile?.location ?? '',
      company_description: recruiterProfile?.company_description ?? '',
    },
  });
  const displayName = getDisplayName(user, candidateProfile, recruiterProfile);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      return;
    }

    if (profileStatus === 'idle') {
      loadProfile();
    }
  }, [isAuthenticated, loadProfile, profileStatus, user]);

  useEffect(() => {
    if (user?.role === 'CANDIDATE') {
      candidateForm.reset({
        full_name: candidateProfile?.full_name ?? '',
        skills: candidateProfile?.skills ?? '',
        experience: candidateProfile?.experience ?? '',
        education: candidateProfile?.education ?? '',
      });
    }
  }, [candidateForm, candidateProfile, user?.role]);

  useEffect(() => {
    if (user?.role === 'RECRUITER') {
      recruiterForm.reset({
        company_name: recruiterProfile?.company_name ?? '',
        location: recruiterProfile?.location ?? '',
        company_description: recruiterProfile?.company_description ?? '',
      });
    }
  }, [recruiterForm, recruiterProfile, user?.role]);

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (profileStatus === 'loading') {
    return <Loading message="Checking your profile..." />;
  }

  if (isUserProfileComplete(user, candidateProfile, recruiterProfile)) {
    return <Navigate to={getDashboardRoute(user.role)} replace />;
  }

  const onCandidateSubmit = async (data: CandidateFormValues) => {
    try {
      const response = await apiClient.updateCandidateProfile(data);
      setCandidateProfile(response.data);
      toast.success('Candidate profile saved successfully');
      navigate('/dashboard/candidate', { replace: true });
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to save candidate profile');
    }
  };

  const onRecruiterSubmit = async (data: RecruiterFormValues) => {
    try {
      const response = await apiClient.updateRecruiterProfile(data);
      setRecruiterProfile(response.data);
      toast.success('Recruiter profile saved successfully');
      navigate('/dashboard/recruiter', { replace: true });
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to save recruiter profile');
    }
  };

  const roleLabel = user.role === 'CANDIDATE' ? 'Candidate' : 'Recruiter';
  const candidateSkillPreview = candidateForm
    .watch('skills')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
  const progressValue = user.role === 'CANDIDATE' ? 38 : 48;

  const addSuggestedSkill = (skill: string) => {
    const currentSkills = candidateForm.getValues('skills');
    const parsedSkills = currentSkills
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean);

    if (!parsedSkills.includes(skill)) {
      const nextSkills = [...parsedSkills, skill].join(', ');
      candidateForm.setValue('skills', nextSkills, { shouldValidate: true });
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fbff_0%,#f7f8fc_55%,#ffffff_100%)] flex flex-col">
      <Header />
      <main className="flex-1 container-x py-10 md:py-14">
        <div className="max-w-3xl mx-auto">
          <div className="mb-5 flex items-center justify-between gap-4 text-xs md:text-sm text-secondary-500">
            <span>Step 1 of 1</span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 shadow-sm border border-secondary-100 text-secondary-700">
              <Sparkles size={14} className="text-primary-500" />
              Profile setup
            </span>
          </div>

          <div className="h-1.5 w-full rounded-full bg-secondary-200 overflow-hidden mb-8">
            <div className="h-full rounded-full bg-primary-500" style={{ width: `${progressValue}%` }} />
          </div>

          <div className="card p-6 md:p-10 shadow-[0_18px_45px_rgba(15,23,42,0.08)] border-secondary-100">
            <div className="text-center mb-8">
              <p className="text-secondary-500 font-medium">Hi there! 👋</p>
              <h1 className="text-3xl md:text-4xl font-bold text-secondary-900 mt-2">Let's get started</h1>
              <p className="text-secondary-600 mt-3 max-w-2xl mx-auto">
                Fill in the details below so SmartHire can shape the right experience for your role.
              </p>
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary-50 text-primary-700 px-4 py-2 font-semibold w-fit">
                <BadgeCheck size={16} /> {roleLabel}
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-secondary-200 bg-secondary-50 px-4 py-2 text-sm text-secondary-700">
                <Check size={16} className="text-primary-500" />
                Signed in as {displayName}
              </div>
            </div>

            {user.role === 'CANDIDATE' ? (
              <form onSubmit={candidateForm.handleSubmit(onCandidateSubmit)} className="space-y-6">
                <div className="grid gap-5 md:grid-cols-2">
                  <Input
                    label="Full Name"
                    placeholder="Enter your full name"
                    icon={<UserRound size={18} />}
                    {...candidateForm.register('full_name')}
                    error={candidateForm.formState.errors.full_name?.message}
                  />
                  <div>
                    <label className="label-text">Email</label>
                    <input
                      value={user.email}
                      readOnly
                      className="w-full px-4 py-3 border border-secondary-200 rounded-lg bg-secondary-100 text-secondary-600"
                    />
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <Input
                    label="Skills"
                    placeholder="React, Node.js, SQL"
                    icon={<BadgeCheck size={18} />}
                    {...candidateForm.register('skills')}
                    error={candidateForm.formState.errors.skills?.message}
                  />
                  <Input
                    label="Experience"
                    placeholder="3 years in frontend development"
                    icon={<FileText size={18} />}
                    {...candidateForm.register('experience')}
                    error={candidateForm.formState.errors.experience?.message}
                  />
                </div>

                <Input
                  label="Education"
                  placeholder="BSc in Computer Science"
                  icon={<GraduationCap size={18} />}
                  {...candidateForm.register('education')}
                  error={candidateForm.formState.errors.education?.message}
                />

                <div className="rounded-2xl border border-secondary-200 bg-secondary-50/80 p-5">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div>
                      <p className="text-sm font-semibold text-secondary-900">Suggested skills</p>
                      <p className="text-xs text-secondary-500">Tap a chip to add it to your profile</p>
                    </div>
                    <span className="text-xs text-secondary-500">{candidateSkillPreview.length} selected</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {candidateSuggestions.map((skill) => {
                      const active = candidateSkillPreview.includes(skill);

                      return (
                        <button
                          type="button"
                          key={skill}
                          onClick={() => addSuggestedSkill(skill)}
                          className={
                            active
                              ? 'px-4 py-2 rounded-full text-sm font-medium border border-primary-500 bg-primary-50 text-primary-700'
                              : 'px-4 py-2 rounded-full text-sm font-medium border border-secondary-200 bg-white text-secondary-700 hover:border-primary-300 hover:text-primary-600'
                          }
                        >
                          {skill} {active ? '✓' : '+'}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button type="submit" className="min-w-40 px-8">
                    Next
                  </Button>
                </div>
              </form>
            ) : (
              <form onSubmit={recruiterForm.handleSubmit(onRecruiterSubmit)} className="space-y-6">
                <div className="grid gap-5 md:grid-cols-2">
                  <Input
                    label="Company Name"
                    placeholder="Your company name"
                    icon={<Building2 size={18} />}
                    {...recruiterForm.register('company_name')}
                    error={recruiterForm.formState.errors.company_name?.message}
                  />
                  <Input
                    label="Location"
                    placeholder="City, Country"
                    icon={<MapPin size={18} />}
                    {...recruiterForm.register('location')}
                    error={recruiterForm.formState.errors.location?.message}
                  />
                </div>

                <div>
                  <label className="label-text">Company Description</label>
                  <textarea
                    rows={5}
                    className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Tell candidates what your company does and what you're hiring for"
                    {...recruiterForm.register('company_description')}
                  />
                  {recruiterForm.formState.errors.company_description?.message && (
                    <p className="text-red-500 text-sm mt-1">{recruiterForm.formState.errors.company_description.message}</p>
                  )}
                </div>

                <div className="rounded-2xl border border-secondary-200 bg-secondary-50/80 p-5">
                  <p className="text-sm font-semibold text-secondary-900 mb-3">Suggested company traits</p>
                  <div className="flex flex-wrap gap-2">
                    {recruiterHighlights.map((highlight) => (
                      <span
                        key={highlight}
                        className="px-4 py-2 rounded-full text-sm font-medium border border-secondary-200 bg-white text-secondary-700"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button type="submit" className="min-w-40 px-8">
                    Next
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Onboarding;