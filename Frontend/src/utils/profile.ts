import { CandidateProfile, RecruiterProfile, User } from '../types';

export const isCandidateProfileComplete = (profile: CandidateProfile | null) => {
  if (!profile) {
    return false;
  }

  return Boolean(
    profile.full_name.trim() &&
      (profile.skills?.trim() ?? '') &&
      (profile.experience?.trim() ?? '') &&
      (profile.education?.trim() ?? '')
  );
};

export const isRecruiterProfileComplete = (profile: RecruiterProfile | null) => {
  if (!profile) {
    return false;
  }

  return Boolean(
    profile.company_name.trim() &&
      profile.location.trim() &&
      profile.company_description.trim()
  );
};

export const isUserProfileComplete = (
  user: User | null,
  candidateProfile: CandidateProfile | null,
  recruiterProfile: RecruiterProfile | null
) => {
  if (!user) {
    return false;
  }

  if (user.role === 'CANDIDATE') {
    return isCandidateProfileComplete(candidateProfile);
  }

  if (user.role === 'RECRUITER') {
    return isRecruiterProfileComplete(recruiterProfile);
  }

  return true;
};

export const getDashboardRoute = (role: User['role']) => {
  if (role === 'CANDIDATE') {
    return '/dashboard/candidate';
  }

  if (role === 'RECRUITER') {
    return '/dashboard/recruiter';
  }

  return '/';
};

export const getDisplayName = (
  user: User | null,
  candidateProfile: CandidateProfile | null,
  recruiterProfile: RecruiterProfile | null
) => {
  if (!user) {
    return '';
  }

  if (user.role === 'CANDIDATE' && candidateProfile?.full_name.trim()) {
    return candidateProfile.full_name.trim();
  }

  if (user.role === 'RECRUITER' && recruiterProfile?.company_name.trim()) {
    return recruiterProfile.company_name.trim();
  }

  return user.email;
};