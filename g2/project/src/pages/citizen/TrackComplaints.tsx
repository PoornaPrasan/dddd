import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  MapPin, 
  Calendar, 
  Star,
  AlertTriangle,
  Search,
  Filter,
  Eye
} from 'lucide-react';
import { useComplaints } from '../../contexts/ComplaintContext';
import { useAuth } from '../../contexts/AuthContext';
import StatusBadge from '../../components/common/StatusBadge';
import { ComplaintStatus, ComplaintCategory } from '../../types';

const TrackComplaints: React.FC = () => {
  const { complaints } = useComplaints();
  const { user } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ComplaintStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<ComplaintCategory | 'all'>('all');
  
  const userComplaints = complaints.filter(c => c.submittedBy === user?.id);
  
  const filteredComplaints = userComplaints.filter(complaint => {
    const matchesSearch = complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || complaint.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusProgress = (status: ComplaintStatus) => {
    const steps = ['submitted', 'under_review', 'in_progress', 'resolved'];
    const currentIndex = steps.indexOf(status);
    return ((currentIndex + 1) / steps.length) * 100;
  };

  const renderRating = (rating?: number) => {
    if (!rating) return null;
    
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">({rating}/5)</span>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Track Your Complaints</h1>
        <p className="text-gray-600 mt-2">Monitor the progress of your submitted issues</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-50 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-semibold text-gray-900">{userComplaints.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-50 rounded-lg">
              <Calendar className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-semibold text-gray-900">
                {userComplaints.filter(c => ['submitted', 'under_review', 'in_progress'].includes(c.status)).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-50 rounded-lg">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Resolved</p>
              <p className="text-2xl font-semibold text-gray-900">
                {userComplaints.filter(c => c.status === 'resolved').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Star className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Avg Rating</p>
              <p className="text-2xl font-semibold text-gray-900">
                {userComplaints.filter(c => c.rating).length > 0 
                  ? (userComplaints.reduce((sum, c) => sum + (c.rating || 0), 0) / userComplaints.filter(c => c.rating).length).toFixed(1)
                  : 'N/A'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search complaints..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ComplaintStatus | 'all')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="submitted">Submitted</option>
              <option value="under_review">Under Review</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as ComplaintCategory | 'all')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="electricity">Electricity</option>
              <option value="water">Water</option>
              <option value="roads">Roads</option>
              <option value="sanitation">Sanitation</option>
              <option value="street_lights">Street Lights</option>
              <option value="drainage">Drainage</option>
              <option value="public_transport">Public Transport</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Complaints List */}
      <div className="space-y-6">
        {filteredComplaints.length > 0 ? (
          filteredComplaints.map((complaint) => (
            <div key={complaint.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{complaint.title}</h3>
                      {complaint.isEmergency && (
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                    <p className="text-gray-600 mb-3">{complaint.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {complaint.location.address}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(complaint.createdAt).toLocaleDateString()}
                      </span>
                      <span className="capitalize">{complaint.category.replace('_', ' ')}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <StatusBadge status={complaint.status} />
                    <StatusBadge priority={complaint.priority} />
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>{Math.round(getStatusProgress(complaint.status))}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getStatusProgress(complaint.status)}%` }}
                    />
                  </div>
                </div>

                {/* Updates */}
                {complaint.updates.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Latest Update</h4>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-700">{complaint.updates[complaint.updates.length - 1].message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(complaint.updates[complaint.updates.length - 1].createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}

                {/* Rating */}
                {complaint.status === 'resolved' && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Your Rating</h4>
                    {renderRating(complaint.rating)}
                    {complaint.feedback && (
                      <p className="text-sm text-gray-600 mt-1">{complaint.feedback}</p>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <span className="text-sm text-gray-500">
                    ID: {complaint.id}
                  </span>
                  <div className="flex space-x-2">
                    <Link
                      to={`/citizen/complaint/${complaint.id}`}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Link>
                    {complaint.status === 'resolved' && !complaint.rating && (
                      <Link
                        to={`/citizen/complaint/${complaint.id}/rate`}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                      >
                        <Star className="w-4 h-4 mr-1" />
                        Rate Service
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No complaints found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all'
                ? "No complaints match your current filters."
                : "You haven't submitted any complaints yet."
              }
            </p>
            {!searchTerm && statusFilter === 'all' && categoryFilter === 'all' && (
              <Link
                to="/citizen/submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                Submit Your First Complaint
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackComplaints;