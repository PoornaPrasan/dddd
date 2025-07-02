import React, { useState } from 'react';
import { 
  Building, 
  Users, 
  MapPin, 
  Phone,
  Mail,
  Plus,
  Edit,
  Trash2,
  Settings,
  BarChart3,
  CheckCircle,
  Clock,
  AlertTriangle,
  Search
} from 'lucide-react';

interface Department {
  id: string;
  name: string;
  description: string;
  categories: string[];
  contactInfo: {
    email: string;
    phone: string;
    address: string;
  };
  staff: {
    total: number;
    active: number;
  };
  performance: {
    totalComplaints: number;
    resolved: number;
    pending: number;
    averageResolutionTime: number;
    satisfactionRate: number;
  };
  regions: string[];
  status: 'active' | 'inactive';
  createdAt: Date;
}

const DepartmentManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [showAddDepartment, setShowAddDepartment] = useState(false);

  // Mock department data
  const departments: Department[] = [
    {
      id: '1',
      name: 'Water Services Department',
      description: 'Manages water supply, quality, and distribution systems',
      categories: ['water', 'drainage'],
      contactInfo: {
        email: 'water@city.gov',
        phone: '+1 (555) 123-4567',
        address: '123 Water St, City Hall'
      },
      staff: { total: 25, active: 23 },
      performance: {
        totalComplaints: 145,
        resolved: 138,
        pending: 7,
        averageResolutionTime: 2.3,
        satisfactionRate: 94.2
      },
      regions: ['Downtown', 'North District', 'East Side'],
      status: 'active',
      createdAt: new Date('2023-01-15')
    },
    {
      id: '2',
      name: 'Electricity Department',
      description: 'Handles electrical infrastructure and power distribution',
      categories: ['electricity', 'street_lights'],
      contactInfo: {
        email: 'power@city.gov',
        phone: '+1 (555) 234-5678',
        address: '456 Power Ave, City Hall'
      },
      staff: { total: 18, active: 17 },
      performance: {
        totalComplaints: 89,
        resolved: 82,
        pending: 7,
        averageResolutionTime: 1.8,
        satisfactionRate: 96.1
      },
      regions: ['Downtown', 'South District', 'West Side'],
      status: 'active',
      createdAt: new Date('2023-02-20')
    },
    {
      id: '3',
      name: 'Roads & Transportation',
      description: 'Maintains roads, bridges, and public transportation systems',
      categories: ['roads', 'public_transport'],
      contactInfo: {
        email: 'roads@city.gov',
        phone: '+1 (555) 345-6789',
        address: '789 Transport Blvd, City Hall'
      },
      staff: { total: 35, active: 32 },
      performance: {
        totalComplaints: 203,
        resolved: 185,
        pending: 18,
        averageResolutionTime: 4.2,
        satisfactionRate: 88.7
      },
      regions: ['All Districts'],
      status: 'active',
      createdAt: new Date('2023-01-10')
    },
    {
      id: '4',
      name: 'Sanitation Services',
      description: 'Waste management and environmental cleanliness',
      categories: ['sanitation'],
      contactInfo: {
        email: 'sanitation@city.gov',
        phone: '+1 (555) 456-7890',
        address: '321 Clean St, City Hall'
      },
      staff: { total: 42, active: 40 },
      performance: {
        totalComplaints: 167,
        resolved: 162,
        pending: 5,
        averageResolutionTime: 1.5,
        satisfactionRate: 97.3
      },
      regions: ['All Districts'],
      status: 'active',
      createdAt: new Date('2023-03-05')
    },
    {
      id: '5',
      name: 'Environmental Services',
      description: 'Environmental protection and sustainability initiatives',
      categories: ['other'],
      contactInfo: {
        email: 'environment@city.gov',
        phone: '+1 (555) 567-8901',
        address: '654 Green Way, City Hall'
      },
      staff: { total: 12, active: 10 },
      performance: {
        totalComplaints: 34,
        resolved: 30,
        pending: 4,
        averageResolutionTime: 3.1,
        satisfactionRate: 91.8
      },
      regions: ['All Districts'],
      status: 'inactive',
      createdAt: new Date('2023-11-15')
    }
  ];

  const filteredDepartments = departments.filter(dept => {
    const matchesSearch = dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dept.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || dept.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      water: '💧',
      electricity: '⚡',
      roads: '🛣️',
      sanitation: '🗑️',
      street_lights: '💡',
      drainage: '🌊',
      public_transport: '🚌',
      other: '📋'
    };
    return icons[category] || '📋';
  };

  const handleDepartmentAction = (deptId: string, action: string) => {
    console.log(`Performing ${action} on department ${deptId}`);
    setSelectedDepartment(null);
  };

  const totalStats = {
    departments: departments.length,
    active: departments.filter(d => d.status === 'active').length,
    totalStaff: departments.reduce((sum, d) => sum + d.staff.total, 0),
    totalComplaints: departments.reduce((sum, d) => sum + d.performance.totalComplaints, 0),
    avgSatisfaction: departments.reduce((sum, d) => sum + d.performance.satisfactionRate, 0) / departments.length
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Department Management</h1>
            <p className="text-gray-600 mt-2">Manage service departments and their configurations</p>
          </div>
          <button
            onClick={() => setShowAddDepartment(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Department
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Building className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Departments</p>
              <p className="text-2xl font-semibold text-gray-900">{totalStats.departments}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-50 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-semibold text-gray-900">{totalStats.active}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Staff</p>
              <p className="text-2xl font-semibold text-gray-900">{totalStats.totalStaff}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-50 rounded-lg">
              <BarChart3 className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Complaints</p>
              <p className="text-2xl font-semibold text-gray-900">{totalStats.totalComplaints}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-50 rounded-lg">
              <CheckCircle className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Avg Satisfaction</p>
              <p className="text-2xl font-semibold text-gray-900">{totalStats.avgSatisfaction.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Departments</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name or description..."
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
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filteredDepartments.map((department) => (
          <div key={department.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{department.name}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      department.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {department.status}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{department.description}</p>
                  
                  {/* Categories */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Service Categories</h4>
                    <div className="flex flex-wrap gap-2">
                      {department.categories.map((category) => (
                        <span key={category} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <span className="mr-1">{getCategoryIcon(category)}</span>
                          {category.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Contact Information</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    {department.contactInfo.email}
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    {department.contactInfo.phone}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    {department.contactInfo.address}
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Performance Overview</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-lg font-semibold text-blue-600">{department.performance.totalComplaints}</div>
                    <div className="text-xs text-blue-700">Total Complaints</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-lg font-semibold text-green-600">{department.performance.resolved}</div>
                    <div className="text-xs text-green-700">Resolved</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-lg font-semibold text-orange-600">{department.performance.averageResolutionTime}d</div>
                    <div className="text-xs text-orange-700">Avg Resolution</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-lg font-semibold text-purple-600">{department.performance.satisfactionRate}%</div>
                    <div className="text-xs text-purple-700">Satisfaction</div>
                  </div>
                </div>
              </div>

              {/* Staff Information */}
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">Staff</span>
                  <span className="text-sm text-gray-600">{department.staff.active}/{department.staff.total} active</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(department.staff.active / department.staff.total) * 100}%` }}
                  />
                </div>
              </div>

              {/* Service Regions */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Service Regions</h4>
                <div className="flex flex-wrap gap-1">
                  {department.regions.map((region) => (
                    <span key={region} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                      {region}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-500">
                  Created: {department.createdAt.toLocaleDateString()}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleDepartmentAction(department.id, 'edit')}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDepartmentAction(department.id, 'settings')}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                  >
                    <Settings className="w-4 h-4 mr-1" />
                    Configure
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDepartments.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No departments found</h3>
          <p className="text-gray-500">
            {searchTerm || statusFilter !== 'all'
              ? "No departments match your current filters."
              : "No departments have been created yet."
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default DepartmentManagement;