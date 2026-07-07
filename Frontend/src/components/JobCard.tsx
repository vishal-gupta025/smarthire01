import { MapPin, Briefcase, IndianRupee, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Job } from '../types';
import { formatCurrency, getJobTypeLabel, formatDate } from '../utils/helpers';
import Button from './Button';

interface JobCardProps {
  job: Job;
  showApply?: boolean;
  onApply?: () => void;
}

export const JobCard = ({ job, showApply = false, onApply }: JobCardProps) => {
  return (
    <div className="card p-6 hover:shadow-xl transition-all duration-200">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-secondary-900 mb-1 line-clamp-2">
          {job.title}
        </h3>
        <p className="text-secondary-600 text-sm">Posted {formatDate(job.posted_at)}</p>
      </div>

      <div className="space-y-3 mb-4">
        {/* Location */}
        <div className="flex items-center gap-2 text-secondary-700">
          <MapPin size={16} className="text-primary-500 flex-shrink-0" />
          <span className="text-sm">{job.location}</span>
        </div>

        {/* Job Type */}
        <div className="flex items-center gap-2 text-secondary-700">
          <Briefcase size={16} className="text-primary-500 flex-shrink-0" />
          <span className="text-sm">{getJobTypeLabel(job.job_type)}</span>
        </div>

        {/* Experience */}
        <div className="flex items-center gap-2 text-secondary-700">
          <Clock size={16} className="text-primary-500 flex-shrink-0" />
          <span className="text-sm">{job.experience_required}+ years experience</span>
        </div>

        {/* Salary */}
        {job.salary_min && job.salary_max && (
          <div className="flex items-center gap-2 text-secondary-700">
            <IndianRupee size={16} className="text-primary-500 flex-shrink-0" />
            <span className="text-sm font-semibold text-primary-600">
              {formatCurrency(job.salary_min)} - {formatCurrency(job.salary_max)}
            </span>
          </div>
        )}
      </div>

      {/* Description Preview */}
      <p className="text-secondary-600 text-sm mb-4 line-clamp-2">
        {job.job_descriptions || 'No description provided'}
      </p>

      {/* Skills */}
      {job.skills_required && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-secondary-700 mb-2">Required Skills</p>
          <div className="flex flex-wrap gap-2">
            {job.skills_required.split(',').slice(0, 3).map((skill, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium"
              >
                {skill.trim()}
              </span>
            ))}
            {job.skills_required.split(',').length > 3 && (
              <span className="px-2 py-1 bg-secondary-100 text-secondary-700 rounded-full text-xs font-medium">
                +{job.skills_required.split(',').length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-4 border-t border-secondary-200">
        <Link to={`/jobs/${job.id}`} className="flex-1">
          <Button variant="outline" className="w-full">
            View Details
          </Button>
        </Link>
        {showApply && onApply && (
          <Button variant="primary" onClick={onApply}>
            Apply Now
          </Button>
        )}
      </div>
    </div>
  );
};

export default JobCard;
