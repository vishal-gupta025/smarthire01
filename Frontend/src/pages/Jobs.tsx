import { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { Header, Footer, JobCard, Loading, Button, Input } from '../components';
import apiClient from '../api/client';
import { Job } from '../types';
import { useAuthStore } from '../store/auth';
import toast from 'react-hot-toast';

export const Jobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [jobType, setJobType] = useState('');
  const [location, setLocation] = useState('');

  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    fetchJobs();
    // Re-fetch when auth state or role changes so recruiters see their own jobs after hydrate/login
  }, [isAuthenticated, user?.role]);

  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      // Choose endpoint depending on user role
      let response;
      if (isAuthenticated && user?.role === 'RECRUITER') {
        // Recruiter should see their posted jobs
        response = await apiClient.get('/jobs/');
      } else if (isAuthenticated && user?.role === 'CANDIDATE') {
        // Candidate should see all active jobs
        response = await apiClient.get('/home/');
      } else {
        // Fallback: try public jobs via home (may require auth)
        try {
          response = await apiClient.get('/home/');
        } catch (err) {
          // If unauthenticated, try jobs but it will likely be empty or error
          response = await apiClient.get('/jobs/');
        }
      }

      // DRF ListAPIView may return a paginated response with a `results` array.
      const data = response.data && response.data.results ? response.data.results : response.data;
      setJobs(data);
    } catch (error) {
      toast.error('Failed to load jobs');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = async (jobId: number) => {
    try {
      await apiClient.applyForJob(jobId);
      toast.success('Application submitted successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || error.response?.data?.message || 'Failed to apply for this job');
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.job_descriptions?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = !jobType || job.job_type === jobType;
    const matchesLocation = !location || job.location.toLowerCase().includes(location.toLowerCase());

    return matchesSearch && matchesType && matchesLocation;
  });

  if (isLoading) {
    return (
      <>
        <Header />
        <Loading message="Loading jobs..." />
        <Footer />
      </>
    );
  }

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header />

      {/* Page Header */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 py-12">
        <div className="container-x">
          <h1 className="text-4xl font-bold text-white mb-2">Find Your Dream Job</h1>
          <p className="text-primary-100">Browse all available positions and apply today</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="flex-1 py-12">
        <div className="container-x">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar - Filters */}
            <div className="lg:col-span-1">
              <div className="card p-6 sticky top-24">
                <h3 className="font-bold text-lg text-secondary-900 mb-6">Filters</h3>

                {/* Search */}
                <div className="mb-6">
                  <label className="label-text">Search</label>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Job title, location..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      icon={<Search size={18} />}
                    />
                  </div>
                </div>

                {/* Job Type */}
                <div className="mb-6">
                  <label className="label-text">Job Type</label>
                  <select
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                    className="input-field"
                  >
                    <option value="">All Types</option>
                    <option value="FULL_TIME">Full Time</option>
                    <option value="PART_TIME">Part Time</option>
                    <option value="INTERN">Internship</option>
                  </select>
                </div>

                {/* Location */}
                <div className="mb-6">
                  <label className="label-text">Location</label>
                  <Input
                    type="text"
                    placeholder="City or country"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>

                <Button
                  variant="secondary"
                  onClick={() => {
                    setSearchTerm('');
                    setJobType('');
                    setLocation('');
                  }}
                  className="w-full"
                >
                  <Filter size={16} /> Clear Filters
                </Button>
              </div>
            </div>

            {/* Main Content - Jobs List */}
            <div className="lg:col-span-3">
              {/* Results Count */}
              <div className="mb-6">
                <p className="text-secondary-600">
                  Found <span className="font-bold text-primary-600">{filteredJobs.length}</span> job
                  {filteredJobs.length !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Jobs Grid */}
              {filteredJobs.length > 0 ? (
                <div className="space-y-6">
                  {filteredJobs.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      showApply={isAuthenticated && user?.role === 'CANDIDATE'}
                      onApply={() => handleApply(job.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="card p-12 text-center">
                  <p className="text-secondary-600 mb-4">No jobs found matching your filters</p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm('');
                      setJobType('');
                      setLocation('');
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Jobs;
