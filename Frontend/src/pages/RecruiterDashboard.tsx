import { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Header, Footer, Button, Loading } from '../components';
import { useAuthStore } from '../store/auth';
import { BriefcaseBusiness, Users, PlusCircle } from 'lucide-react';
import { getDisplayName, isRecruiterProfileComplete } from '../utils/profile';

export const RecruiterDashboard = () => {
  const { user, isAuthenticated, recruiterProfile, profileStatus, loadProfile } = useAuthStore();
  const navigate = useNavigate();
  const displayName = getDisplayName(user, null, recruiterProfile);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'RECRUITER' && profileStatus === 'idle') {
      loadProfile();
    }
  }, [isAuthenticated, loadProfile, profileStatus, user?.role]);

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'RECRUITER') {
    return <Navigate to="/dashboard/candidate" replace />;
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

  if (!isRecruiterProfileComplete(recruiterProfile)) {
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <div className="min-h-screen bg-secondary-50 flex flex-col">
      <Header />
      <main className="flex-1 container-x py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <p className="text-sm font-semibold text-primary-600 uppercase tracking-wide">Recruiter Dashboard</p>
            <h1 className="text-4xl font-bold text-secondary-900 mt-2">Welcome back, {displayName}</h1>
            <p className="text-secondary-600 mt-3">Manage job posts, review applicants, and build your hiring pipeline.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="card p-6">
              <BriefcaseBusiness className="text-primary-600" />
              <h2 className="text-xl font-semibold mt-4 text-secondary-900">Posted Jobs</h2>
              <p className="text-secondary-600 mt-2">Create and manage roles your company is hiring for.</p>
              <Button className="mt-4" onClick={() => navigate('/dashboard/recruiter/jobs')}>Manage Jobs</Button>
            </div>

            <div className="card p-6">
              <Users className="text-primary-600" />
              <h2 className="text-xl font-semibold mt-4 text-secondary-900">Applications</h2>
              <p className="text-secondary-600 mt-2">Review incoming applications and shortlist talent.</p>
              <Button variant="outline" className="mt-4" onClick={() => navigate('/profile')}>View Profile</Button>
            </div>

            <div className="card p-6">
              <PlusCircle className="text-primary-600" />
              <h2 className="text-xl font-semibold mt-4 text-secondary-900">Add Job</h2>
              <p className="text-secondary-600 mt-2">Post a new opening and start receiving applicants.</p>
              <Button variant="secondary" className="mt-4" onClick={() => navigate('/dashboard/recruiter/jobs/new')}>Create Job</Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RecruiterDashboard;
