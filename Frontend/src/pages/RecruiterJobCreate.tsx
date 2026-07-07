import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, ArrowRight, Briefcase, Building2, IndianRupee, MapPin, PlusCircle, Users } from 'lucide-react';
import { Header, Footer, Button, Input } from '../components';
import apiClient from '../api/client';
import { useAuthStore } from '../store/auth';
import { JobType, CreateJobRequest } from '../types';

const jobTypeOptions: Array<{ value: JobType; label: string }> = [
  { value: 'FULL_TIME', label: 'Full Time' },
  { value: 'PART_TIME', label: 'Part Time' },
  { value: 'INTERN', label: 'Internship' },
];

export const RecruiterJobCreate = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateJobRequest>({
    title: '',
    job_descriptions: '',
    skills_required: '',
    experience_required: 0,
    location: '',
    job_type: 'FULL_TIME',
    number_of_openings: 1,
    salary_min: 0,
    salary_max: 0,
    job_status: true,
  });

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'RECRUITER') {
    return <Navigate to="/dashboard/candidate" replace />;
  }

  const handleChange = (field: keyof CreateJobRequest, value: string | number | boolean) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      await apiClient.createJob({
        ...formData,
        experience_required: Number(formData.experience_required),
        number_of_openings: Number(formData.number_of_openings),
        salary_min: Number(formData.salary_min),
        salary_max: Number(formData.salary_max),
      });

      toast.success('Job created successfully');
      navigate('/dashboard/recruiter/jobs');
    } catch (error) {
      const apiError = error as { response?: { data?: { detail?: string; error?: string; [key: string]: unknown } } };
      const errorData = apiError.response?.data;
      const message =
        errorData?.detail ||
        errorData?.error ||
        (errorData && typeof errorData === 'object'
          ? Object.entries(errorData)
              .map(([key, value]) => {
                if (Array.isArray(value)) {
                  return `${key}: ${value.join(', ')}`;
                }
                return `${key}: ${String(value)}`;
              })
              .join(' | ')
          : '') ||
        'Failed to create job';

      toast.error(message);
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50 flex flex-col">
      <Header />
      <main className="flex-1 container-x py-12">
        <div className="max-w-4xl mx-auto">
          <button
            type="button"
            onClick={() => navigate('/dashboard/recruiter/jobs')}
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            <ArrowLeft size={16} /> Back to your jobs
          </button>


          <button
            type="button"
            onClick={() => navigate('/dashboard/recruiter')}
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            <ArrowRight size={16} /> Back to your Dashboard
          </button>


          <div className="card p-8">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">Create Job</p>
              <h1 className="mt-2 text-3xl font-bold text-secondary-900">Post a new job opening</h1>
              <p className="mt-3 text-secondary-600">
                Create a job that only you can manage from your recruiter dashboard.
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="label-text">Job Title</label>
                  <Input
                    type="text"
                    placeholder="Senior Frontend Engineer"
                    value={formData.title}
                    onChange={(event) => handleChange('title', event.target.value)}
                    icon={<Briefcase size={18} />}
                    required
                  />
                </div>

                <div>
                  <label className="label-text">Location</label>
                  <Input
                    type="text"
                    placeholder="Remote / New York / London"
                    value={formData.location}
                    onChange={(event) => handleChange('location', event.target.value)}
                    icon={<MapPin size={18} />}
                    required
                  />
                </div>

                <div>
                  <label className="label-text">Job Type</label>
                  <select
                    value={formData.job_type}
                    onChange={(event) => handleChange('job_type', event.target.value as JobType)}
                    className="input-field"
                  >
                    {jobTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label-text">Openings</label>
                  <Input
                    type="number"
                    min={1}
                    value={formData.number_of_openings}
                    onChange={(event) => handleChange('number_of_openings', Number(event.target.value))}
                    icon={<Users size={18} />}
                    required
                  />
                </div>

                <div>
                  <label className="label-text">Minimum Salary</label>
                  <Input
                    type="number"
                    min={0}
                    value={formData.salary_min}
                    onChange={(event) => handleChange('salary_min', Number(event.target.value))}
                    icon={<IndianRupee size={18} />}
                    required
                  />
                </div>

                <div>
                  <label className="label-text">Maximum Salary</label>
                  <Input
                    type="number"
                    min={0}
                    value={formData.salary_max}
                    onChange={(event) => handleChange('salary_max', Number(event.target.value))}
                    icon={<IndianRupee size={18} />}
                    required
                  />
                </div>

                <div>
                  <label className="label-text">Required Experience</label>
                  <Input
                    type="number"
                    min={0}
                    value={formData.experience_required}
                    onChange={(event) => handleChange('experience_required', Number(event.target.value))}
                    icon={<Building2 size={18} />}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="label-text">Job Description</label>
                <textarea
                  value={formData.job_descriptions}
                  onChange={(event) => handleChange('job_descriptions', event.target.value)}
                  className="input-field min-h-[140px]"
                  placeholder="Describe the role, team, and responsibilities"
                  required
                />
              </div>

              <div>
                <label className="label-text">Required Skills</label>
                <textarea
                  value={formData.skills_required}
                  onChange={(event) => handleChange('skills_required', event.target.value)}
                  className="input-field min-h-[120px]"
                  placeholder="React, TypeScript, APIs, testing..."
                  required
                />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Button type="button" variant="outline" onClick={() => navigate('/dashboard/recruiter/jobs')}>
                  Cancel
                </Button>
                <Button type="submit" isLoading={isSubmitting}>
                  <PlusCircle size={16} /> Create Job
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RecruiterJobCreate;