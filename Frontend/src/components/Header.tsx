import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Settings, Briefcase, LayoutDashboard, ClipboardList } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useAuthStore } from '../store/auth';
import { getDisplayName } from '../utils/profile';

export const Header = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { candidateProfile, recruiterProfile } = useAuthStore();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleProfileClick = () => {
    navigate('/profile');
    setIsDropdownOpen(false);
  };

  const handleDashboardClick = () => {
    if (user?.role === 'CANDIDATE') {
      navigate('/dashboard/candidate');
    } else if (user?.role === 'RECRUITER') {
      navigate('/dashboard/recruiter');
    }
    setIsDropdownOpen(false);
  };

  const isCandidate = user?.role === 'CANDIDATE';
  const isRecruiter = user?.role === 'RECRUITER';
  const displayName = getDisplayName(user, candidateProfile, recruiterProfile);
  const displayInitial = displayName ? displayName.charAt(0).toUpperCase() : '?';

  const loggedInLinks = isCandidate
     ?[
        { label: 'Jobs', to: '/jobs', icon: Briefcase },
      ]
      :
      []
    

  return (
    <header className="bg-white border-b border-secondary-200 sticky top-0 z-40">
      <div className="container-x py-4 flex justify-between items-center gap-4">
        <Link
          to="/"
          className="flex items-center gap-2 font-bold text-2xl text-primary-600 hover:text-primary-700 transition-colors"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center text-white font-bold">
            SH
          </div>
          SmartHire
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {!isAuthenticated ? (
            <>
              
              <Link to="/login" className="btn-secondary">
                Login
              </Link>
              <Link to="/register" className="btn-primary">
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 text-sm text-secondary-600 bg-secondary-50 px-3 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-primary-500"></span>
                {isCandidate ? 'Candidate' : isRecruiter ? 'Recruiter' : 'Admin'}
              </div>

              {loggedInLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link key={link.to} to={link.to} className="text-secondary-700 hover:text-primary-600 transition-colors font-medium flex items-center gap-2">
                    <Icon size={16} />
                    {link.label}
                  </Link>
                );
              })}

              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-10 h-10 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold hover:bg-primary-600 transition-colors"
                >
                  {displayInitial}
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-secondary-200 overflow-hidden">
                    <button
                      onClick={handleDashboardClick}
                      className="w-full px-4 py-2 text-left hover:bg-secondary-100 transition-colors flex items-center gap-2"
                    >
                      <LayoutDashboard size={16} /> Dashboard
                    </button>
                    <button
                      onClick={handleProfileClick}
                      className="w-full px-4 py-2 text-left hover:bg-secondary-100 transition-colors flex items-center gap-2"
                    >
                      <Settings size={16} /> My Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left hover:bg-red-50 transition-colors flex items-center gap-2 text-red-600"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </nav>

        <div className="md:hidden flex items-center gap-3">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-10 h-10 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold hover:bg-primary-600 transition-colors"
              >
                {displayInitial}
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-secondary-200 overflow-hidden">
                  <button
                    onClick={handleDashboardClick}
                    className="w-full px-4 py-2 text-left hover:bg-secondary-100 transition-colors flex items-center gap-2"
                  >
                    <LayoutDashboard size={16} /> Dashboard
                  </button>
                  <button
                    onClick={handleProfileClick}
                    className="w-full px-4 py-2 text-left hover:bg-secondary-100 transition-colors flex items-center gap-2"
                  >
                    <Settings size={16} /> My Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left hover:bg-red-50 transition-colors flex items-center gap-2 text-red-600"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn-secondary">
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
