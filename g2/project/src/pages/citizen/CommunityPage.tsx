import React, { useState } from 'react';
import { 
  Users, 
  Star, 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown,
  Filter,
  Search,
  MapPin,
  Calendar,
  Award,
  TrendingUp,
  Eye,
  Plus,
  Camera,
  Send
} from 'lucide-react';
import { useComplaints } from '../../contexts/ComplaintContext';
import { useAuth } from '../../contexts/AuthContext';
import StatusBadge from '../../components/common/StatusBadge';

interface Review {
  id: string;
  complaintId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  content: string;
  photos?: string[];
  helpful: number;
  notHelpful: number;
  createdAt: Date;
  category: string;
  location: string;
  serviceProvider: string;
}

const CommunityPage: React.FC = () => {
  const { complaints } = useComplaints();
  const { user } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'rating' | 'helpful'>('recent');
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<string>('');
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    content: '',
    photos: [] as File[]
  });

  // Generate mock reviews from resolved complaints
  const generateReviews = (): Review[] => {
    const resolvedComplaints = complaints.filter(c => c.status === 'resolved' && c.rating);
    
    const mockReviews: Review[] = [
      {
        id: 'review-1',
        complaintId: 'complaint-1',
        userId: 'user-1',
        userName: 'Sarah Johnson',
        userAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        rating: 5,
        title: 'Excellent Water Service Repair',
        content: 'The water department responded quickly to my complaint about low water pressure. The technician was professional, explained the issue clearly, and fixed it within 2 hours. Very impressed with the service quality!',
        photos: ['https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=400'],
        helpful: 12,
        notHelpful: 1,
        createdAt: new Date('2024-06-10'),
        category: 'Water Services',
        location: 'Downtown District',
        serviceProvider: 'City Water Department'
      },
      {
        id: 'review-2',
        complaintId: 'complaint-2',
        userId: 'user-2',
        userName: 'Michael Chen',
        userAvatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        rating: 4,
        title: 'Road Repair Completed Successfully',
        content: 'The pothole on Main Street was finally fixed after my complaint. It took about a week, but the quality of work is good. The road is smooth now and should last for years. Thank you to the road maintenance team!',
        helpful: 8,
        notHelpful: 0,
        createdAt: new Date('2024-06-08'),
        category: 'Roads & Transportation',
        location: 'Main Street',
        serviceProvider: 'Public Works Department'
      },
      {
        id: 'review-3',
        complaintId: 'complaint-3',
        userId: 'user-3',
        userName: 'Emily Rodriguez',
        userAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        rating: 5,
        title: 'Street Light Fixed Promptly',
        content: 'Reported a broken street light near the school and it was fixed the next day! Great response time and the new LED light is much brighter. Makes the area safer for kids walking to school.',
        photos: ['https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=400'],
        helpful: 15,
        notHelpful: 0,
        createdAt: new Date('2024-06-05'),
        category: 'Street Lighting',
        location: 'School District',
        serviceProvider: 'Electrical Services'
      },
      {
        id: 'review-4',
        complaintId: 'complaint-4',
        userId: 'user-4',
        userName: 'David Kim',
        rating: 3,
        title: 'Sanitation Service - Room for Improvement',
        content: 'The garbage collection issue was resolved, but it took longer than expected. The crew was friendly when they came, but communication could be better. Overall satisfied with the outcome.',
        helpful: 5,
        notHelpful: 2,
        createdAt: new Date('2024-06-03'),
        category: 'Sanitation',
        location: 'Residential Area',
        serviceProvider: 'Waste Management'
      },
      {
        id: 'review-5',
        complaintId: 'complaint-5',
        userId: 'user-5',
        userName: 'Lisa Thompson',
        rating: 5,
        title: 'Outstanding Electrical Service',
        content: 'Power outage was resolved within 4 hours of reporting. The electrical team worked efficiently and kept us updated throughout the process. Excellent emergency response!',
        helpful: 20,
        notHelpful: 1,
        createdAt: new Date('2024-06-01'),
        category: 'Electricity',
        location: 'North District',
        serviceProvider: 'Power Company'
      }
    ];

    return mockReviews;
  };

  const reviews = generateReviews();
  
  // Get user's resolved complaints for review writing
  const userResolvedComplaints = complaints.filter(c => 
    c.submittedBy === user?.id && 
    c.status === 'resolved' && 
    !reviews.some(r => r.complaintId === c.id && r.userId === user?.id)
  );

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || review.category.toLowerCase().includes(categoryFilter.toLowerCase());
    const matchesRating = ratingFilter === 'all' || 
                         (ratingFilter === '5' && review.rating === 5) ||
                         (ratingFilter === '4' && review.rating === 4) ||
                         (ratingFilter === '3' && review.rating <= 3);
    
    return matchesSearch && matchesCategory && matchesRating;
  });

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'helpful':
        return b.helpful - a.helpful;
      case 'recent':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const handleWriteReview = () => {
    if (!selectedComplaint || !newReview.title.trim() || !newReview.content.trim()) {
      return;
    }

    // In a real app, this would submit the review to the backend
    console.log('Submitting review:', {
      complaintId: selectedComplaint,
      ...newReview
    });

    // Reset form
    setNewReview({
      rating: 5,
      title: '',
      content: '',
      photos: []
    });
    setSelectedComplaint('');
    setShowWriteReview(false);
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setNewReview(prev => ({
      ...prev,
      photos: [...prev.photos, ...files].slice(0, 3) // Max 3 photos
    }));
  };

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'sm') => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6'
    };

    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const communityStats = {
    totalReviews: reviews.length,
    averageRating: reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length,
    helpfulReviews: reviews.filter(r => r.helpful > r.notHelpful).length,
    categories: [...new Set(reviews.map(r => r.category))].length
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Community Reviews</h1>
        <p className="text-gray-600 mt-2">Share your experience and help improve public services</p>
      </div>

      {/* Community Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-50 rounded-lg">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Reviews</p>
              <p className="text-2xl font-semibold text-gray-900">{communityStats.totalReviews}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-50 rounded-lg">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Average Rating</p>
              <p className="text-2xl font-semibold text-gray-900">{communityStats.averageRating.toFixed(1)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-50 rounded-lg">
              <ThumbsUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Helpful Reviews</p>
              <p className="text-2xl font-semibold text-gray-900">{communityStats.helpfulReviews}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Service Categories</p>
              <p className="text-2xl font-semibold text-gray-900">{communityStats.categories}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Write Review Button */}
      {userResolvedComplaints.length > 0 && (
        <div className="mb-8">
          <button
            onClick={() => setShowWriteReview(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Write a Review
          </button>
        </div>
      )}

      {/* Write Review Modal */}
      {showWriteReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Write a Review</h3>
              
              <div className="space-y-4">
                {/* Select Complaint */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Resolved Complaint
                  </label>
                  <select
                    value={selectedComplaint}
                    onChange={(e) => setSelectedComplaint(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Choose a complaint to review</option>
                    {userResolvedComplaints.map((complaint) => (
                      <option key={complaint.id} value={complaint.id}>
                        {complaint.title} - {complaint.location.address}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                  </label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            star <= newReview.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Review Title
                  </label>
                  <input
                    type="text"
                    value={newReview.title}
                    onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Summarize your experience"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Review Content
                  </label>
                  <textarea
                    value={newReview.content}
                    onChange={(e) => setNewReview(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Share details about the service quality, response time, and overall experience..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Photo Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Photos (Optional)
                  </label>
                  <div className="flex items-center space-x-2">
                    <label className="cursor-pointer inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                      <Camera className="w-4 h-4 mr-2" />
                      Add Photos
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                    <span className="text-sm text-gray-500">
                      {newReview.photos.length}/3 photos
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowWriteReview(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleWriteReview}
                  disabled={!selectedComplaint || !newReview.title.trim() || !newReview.content.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Post Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="water">Water Services</option>
              <option value="electricity">Electricity</option>
              <option value="roads">Roads & Transportation</option>
              <option value="sanitation">Sanitation</option>
              <option value="street">Street Lighting</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4+ Stars</option>
              <option value="3">3+ Stars</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="recent">Most Recent</option>
              <option value="rating">Highest Rating</option>
              <option value="helpful">Most Helpful</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {sortedReviews.length > 0 ? (
          sortedReviews.map((review) => (
            <div key={review.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {review.userAvatar ? (
                    <img
                      src={review.userAvatar}
                      alt={review.userName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-gray-500" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{review.title}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        {renderStars(review.rating, 'md')}
                        <span className="text-sm text-gray-600">by {review.userName}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {review.location}
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {review.category}
                      </span>
                      <span className="text-gray-500">
                        {review.serviceProvider}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4 leading-relaxed">{review.content}</p>
                  
                  {review.photos && review.photos.length > 0 && (
                    <div className="mb-4">
                      <div className="flex space-x-2">
                        {review.photos.map((photo, index) => (
                          <img
                            key={index}
                            src={photo}
                            alt={`Review photo ${index + 1}`}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-4">
                      <button className="flex items-center space-x-1 text-gray-600 hover:text-green-600 transition-colors">
                        <ThumbsUp className="w-4 h-4" />
                        <span className="text-sm">Helpful ({review.helpful})</span>
                      </button>
                      <button className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors">
                        <ThumbsDown className="w-4 h-4" />
                        <span className="text-sm">Not Helpful ({review.notHelpful})</span>
                      </button>
                    </div>
                    <div className="text-sm text-gray-500">
                      {review.helpful + review.notHelpful} people found this review helpful
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews found</h3>
            <p className="text-gray-500">
              {searchTerm || categoryFilter !== 'all' || ratingFilter !== 'all'
                ? "No reviews match your current filters."
                : "Be the first to share your experience with the community!"
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityPage;