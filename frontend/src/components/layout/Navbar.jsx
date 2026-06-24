import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import Button from '../ui/Button';

export const Navbar = () => {
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Dashboard';
      case '/upload':
        return 'Upload Resumes';
      case '/candidates':
        return 'Candidates';
      case '/job-match':
        return 'Job Matching Intelligence';
      case '/analytics':
        return 'Talent Analytics';
      default:
        if (location.pathname.startsWith('/candidates/')) {
          return 'Candidate Profile Details';
        }
        return 'ResumeIntel';
    }
  };

  return (
    <header className="h-16 bg-[#080C10] border-b border-[#253746] flex items-center justify-between px-8 sticky top-0 z-20">
      <h2 className="text-lg font-bold tracking-tight text-white">{getPageTitle()}</h2>
      
      <div className="flex items-center gap-4">
        {location.pathname !== '/upload' && (
          <Link to="/upload">
            <Button variant="primary" className="flex items-center gap-2 !py-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Quick Upload
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
};
export default Navbar;
