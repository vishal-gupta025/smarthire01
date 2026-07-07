// User Types
export interface User {
  id: number;
  email: string;
  role: 'CANDIDATE' | 'RECRUITER' | 'ADMIN';
  is_active: boolean;
  date_joined: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  role: 'candidate' | 'recruiter';
}

export interface LoginRequest {
  email: string;
  password: string;
}

// Candidate Profile
export interface CandidateProfile {
  id: number;
  user: User;
  full_name: string;
  skills: string;
  experience: string;
  education: string;
  current_resume_id: number | null;
  current_resume_url: string | null;
  current_resume_name: string | null;
  current_resume_status: string | null;
  current_resume_uploaded_at: string | null;
  uploaded_at: string;
  updated_at: string;
}

export interface CandidateProfileUpdate {
  full_name?: string;
  skills?: string;
  experience?: string;
  education?: string;
}

// Recruiter Profile
export interface RecruiterProfile {
  id: number;
  user: User;
  company_name: string;
  location: string;
  company_description: string;
  uploaded_at: string;
  updated_at: string;
}

export interface RecruiterProfileUpdate {
  company_name?: string;
  location?: string;
  company_description?: string;
}

// Job Types
export type JobType = 'FULL_TIME' | 'PART_TIME' | 'INTERN' | 'REMOTE';

export interface Job {
  id: number;
  recruiter: number;
  title: string;
  job_descriptions: string;
  skills_required: string;
  experience_required: number;
  location: string;
  job_type: JobType;
  number_of_openings: number;
  salary_min: number;
  salary_max: number;
  posted_at: string;
  job_status: boolean;
  updated_at: string;
}

export interface CreateJobRequest {
  title: string;
  job_descriptions?: string;
  skills_required?: string;
  experience_required: number;
  location: string;
  job_type?: JobType;
  number_of_openings?: number;
  salary_min?: number;
  salary_max?: number;
  job_status?: boolean;
}

export interface UpdateJobRequest extends Partial<CreateJobRequest> {}

// Job Application
export interface JobApplication {
  id: number;
  candidate: number;
  job: number;
  status: 'PENDING' | 'REVIEWED' | 'SHORTLISTED' | 'REJECTED' | 'ACCEPTED';
  applied_at: string;
  updated_at: string;
}

export interface CandidateApplication {
  application_id: number;
  job_id: number;
  job_title: string;
  company_name: string;
  job_type: string;
  status: 'applied' | 'under_review' | 'interview_scheduled' | 'offered' | 'rejected';
  applied_at: string;
}

export interface RecruiterApplication {
  application_id: number;
  candidate_name: string;
  skills: string;
  experience: string;
  education: string;
  resume: string | null;
  status: 'applied' | 'under_review' | 'interview_scheduled' | 'offered' | 'rejected';
  applied_at: string;
}

// Resume
export interface Resume {
  id: number;
  candidate: number;
  file: string;
  status: 'PENDING' | 'PROCESSED' | 'FAILED';
  extracted_data?: {
    skills?: string[];
    experience?: string;
    education?: string;
  };
  uploaded_at: string;
  updated_at: string;
}

// API Response
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
