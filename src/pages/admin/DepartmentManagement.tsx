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
  Search,
  X,
  Save,
  Camera,
  Upload,
  Globe,
  Shield,
  Bell,
  Calendar,
  FileText,
  Zap,
  Wrench,
  Eye,
  EyeOff
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
    website?: string;
    emergencyPhone?: string;
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
  workingHours: {
    monday: { start: string; end: string; closed: boolean };
    tuesday: { start: string; end: string; closed: boolean };
    wednesday: { start: string; end: string; closed: boolean };
    thursday: { start: string; end: string; closed: boolean };
    friday: { start: string; end: string; closed: boolean };
    saturday: { start: string; end: string; closed: boolean };
    sunday: { start: string; end: string; closed: boolean };
  };
  settings: {
    autoAssignment: boolean;
    emergencyResponse: boolean;
    publicVisible: boolean;
    allowDirectContact: boolean;
    maxComplaintsPerDay: number;
    priorityLevels: string[];
  };
  createdAt: Date;
  logo?: string;
}

interface DepartmentFormData {
  name: string;
  description: string;
  categories: string[];
  contactInfo: {
    email: string;
    phone: string;
    address: string;
    website: string;
    emergencyPhone: string;
  };
  regions: string[];
  status: 'active' | 'inactive';
  workingHours: {
    monday: { start: string; end: string; closed: boolean };
    tuesday: { start: string; end: string; closed: boolean };
    wednesday: { start: string; end: string; closed: boolean };
    thursday: { start: string; end: string; closed: boolean };
    friday: { start: string; end: string; closed: boolean };
    saturday: { start: string; end: string; closed: boolean };
    sunday: { start: string; end: string; closed: boolean };
  };
  settings: {
    autoAssignment: boolean;
    emergencyResponse: boolean;
    publicVisible: boolean;
    allowDirectContact: boolean;
    maxComplaintsPerDay: number;
    priorityLevels: string[];
  };
  logo: string;
}

const DepartmentManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [showAddDepartment, setShowAddDepartment] = useState(false);
  const [showEditDepartment, setShowEditDepartment] = useState<string | null>(null);
  const [showConfigureDepartment, setShowConfigureDepartment] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'contact' | 'schedule' | 'settings'>('basic');

  // Available categories and regions
  const availableCategories = [
    { id: 'water', label: 'Water Services', icon: '💧' },
    { id: 'electricity', label: 'Electricity', icon: '⚡' },
    { id: 'roads', label: 'Roads & Transportation', icon: '🛣️' },
    { id: 'sanitation', label: 'Sanitation', icon: '🗑️' },
    { id: 'street_lights', label: 'Street Lighting', icon: '💡' },
    { id: 'drainage', label: 'Drainage', icon: '🌊' },
    { id: 'public_transport', label: 'Public Transport', icon: '🚌' },
    { id: 'parks', label: 'Parks & Recreation', icon: '🌳' },
    { id: 'housing', label: 'Public Housing', icon: '🏠' },
    { id: 'emergency', label: 'Emergency Services', icon: '🚨' },
    { id: 'environmental', label: 'Environmental', icon: '🌍' },
    { id: 'other', label: 'Other Services', icon: '📋' }
  ];

  const availableRegions = [
    'Downtown District',
    'North District', 
    'South District',
    'East Side',
    'West Side',
    'Central Business District',
    'Residential Area A',
    'Residential Area B',
    'Industrial Zone',
    'Suburban Area',
    'All Districts'
  ];

  const priorityLevels = ['Low', 'Medium', 'High', 'Critical', 'Emergency'];

  // Default form data
  const defaultFormData: DepartmentFormData = {
    name: '',
    description: '',
    categories: [],
    contactInfo: {
      email: '',
      phone: '',
      address: '',
      website: '',
      emergencyPhone: ''
    },
    regions: [],
    status: 'active',
    workingHours: {
      monday: { start: '08:00', end: '17:00', closed: false },
      tuesday: { start: '08:00', end: '17:00', closed: false },
      wednesday: { start: '08:00', end: '17:00', closed: false },
      thursday: { start: '08:00', end: '17:00', closed: false },
      friday: { start: '08:00', end: '17:00', closed: false },
      saturday: { start: '09:00', end: '13:00', closed: false },
      sunday: { start: '09:00', end: '13:00', closed: true }
    },
    settings: {
      autoAssignment: true,
      emergencyResponse: false,
      publicVisible: true,
      allowDirectContact: true,
      maxComplaintsPerDay: 50,
      priorityLevels: ['Low', 'Medium', 'High']
    },
    logo: ''
  };

  const [formData, setFormData] = useState<DepartmentFormData>(defaultFormData);

  // Mock department data
  const departments: Department[] = [
    {
      id: '1',
      name: 'Water Services Department',
      description: 'Manages water supply, quality, and distribution systems across the city',
      categories: ['water', 'drainage'],
      contactInfo: {
        email: 'water@city.gov',
        phone: '+1 (555) 123-4567',
        address: '123 Water St, City Hall',
        website: 'https://water.city.gov',
        emergencyPhone: '+1 (555) 911-WATER'
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
      workingHours: {
        monday: { start: '07:00', end: '16:00', closed: false },
        tuesday: { start: '07:00', end: '16:00', closed: false },
        wednesday: { start: '07:00', end: '16:00', closed: false },
        thursday: { start: '07:00', end: '16:00', closed: false },
        friday: { start: '07:00', end: '16:00', closed: false },
        saturday: { start: '08:00', end: '12:00', closed: false },
        sunday: { start: '08:00', end: '12:00', closed: true }
      },
      settings: {
        autoAssignment: true,
        emergencyResponse: true,
        publicVisible: true,
        allowDirectContact: true,
        maxComplaintsPerDay: 75,
        priorityLevels: ['Low', 'Medium', 'High', 'Critical', 'Emergency']
      },
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
        address: '456 Power Ave, City Hall',
        website: 'https://power.city.gov',
        emergencyPhone: '+1 (555) 911-POWER'
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
      workingHours: {
        monday: { start: '06:00', end: '15:00', closed: false },
        tuesday: { start: '06:00', end: '15:00', closed: false },
        wednesday: { start: '06:00', end: '15:00', closed: false },
        thursday: { start: '06:00', end: '15:00', closed: false },
        friday: { start: '06:00', end: '15:00', closed: false },
        saturday: { start: '08:00', end: '12:00', closed: false },
        sunday: { start: '08:00', end: '12:00', closed: true }
      },
      settings: {
        autoAssignment: true,
        emergencyResponse: true,
        publicVisible: true,
        allowDirectContact: false,
        maxComplaintsPerDay: 60,
        priorityLevels: ['Low', 'Medium', 'High', 'Critical', 'Emergency']
      },
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
        address: '789 Transport Blvd, City Hall',
        website: 'https://transport.city.gov'
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
      workingHours: {
        monday: { start: '06:00', end: '15:00', closed: false },
        tuesday: { start: '06:00', end: '15:00', closed: false },
        wednesday: { start: '06:00', end: '15:00', closed: false },
        thursday: { start: '06:00', end: '15:00', closed: false },
        friday: { start: '06:00', end: '15:00', closed: false },
        saturday: { start: '07:00', end: '11:00', closed: false },
        sunday: { start: '07:00', end: '11:00', closed: true }
      },
      settings: {
        autoAssignment: false,
        emergencyResponse: false,
        publicVisible: true,
        allowDirectContact: true,
        maxComplaintsPerDay: 100,
        priorityLevels: ['Low', 'Medium', 'High', 'Critical']
      },
      createdAt: new Date('2023-01-10')
    }
  ];

  const filteredDepartments = departments.filter(dept => {
    const matchesSearch = dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dept.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || dept.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleFormChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof DepartmentFormData],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleWorkingHoursChange = (day: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [day]: {
          ...prev.workingHours[day as keyof typeof prev.workingHours],
          [field]: value
        }
      }
    }));
  };

  const handleCategoryToggle = (categoryId: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId]
    }));
  };

  const handleRegionToggle = (region: string) => {
    setFormData(prev => ({
      ...prev,
      regions: prev.regions.includes(region)
        ? prev.regions.filter(r => r !== region)
        : [...prev.regions, region]
    }));
  };

  const handlePriorityToggle = (priority: string) => {
    setFormData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        priorityLevels: prev.settings.priorityLevels.includes(priority)
          ? prev.settings.priorityLevels.filter(p => p !== priority)
          : [...prev.settings.priorityLevels, priority]
      }
    }));
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({ ...prev, logo: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Submitting department:', formData);
      
      // Reset form and close modal
      setFormData(defaultFormData);
      setShowAddDepartment(false);
      setShowEditDepartment(null);
      setActiveTab('basic');
      
      alert('Department saved successfully!');
    } catch (error) {
      console.error('Error saving department:', error);
      alert('Failed to save department. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (department: Department) => {
    setFormData({
      name: department.name,
      description: department.description,
      categories: department.categories,
      contactInfo: department.contactInfo,
      regions: department.regions,
      status: department.status,
      workingHours: department.workingHours,
      settings: department.settings,
      logo: department.logo || ''
    });
    setShowEditDepartment(department.id);
    setActiveTab('basic');
  };

  const handleConfigure = (department: Department) => {
    setFormData({
      name: department.name,
      description: department.description,
      categories: department.categories,
      contactInfo: department.contactInfo,
      regions: department.regions,
      status: department.status,
      workingHours: department.workingHours,
      settings: department.settings,
      logo: department.logo || ''
    });
    setShowConfigureDepartment(department.id);
    setActiveTab('settings');
  };

  const handleDepartmentAction = (deptId: string, action: string) => {
    console.log(`Performing ${action} on department ${deptId}`);
    setSelectedDepartment(null);
  };

  const getCategoryIcon = (category: string) => {
    const categoryData = availableCategories.find(c => c.id === category);
    return categoryData?.icon || '📋';
  };

  const totalStats = {
    departments: departments.length,
    active: departments.filter(d => d.status === 'active').length,
    totalStaff: departments.reduce((sum, d) => sum + d.staff.total, 0),
    totalComplaints: departments.reduce((sum, d) => sum + d.performance.totalComplaints, 0),
    avgSatisfaction: departments.reduce((sum, d) => sum + d.performance.satisfactionRate, 0) / departments.length
  };

  const renderFormTabs = () => (
    <div className="border-b border-gray-200 mb-6">
      <nav className="flex space-x-8">
        {[
          { id: 'basic', label: 'Basic Info', icon: Building },
          { id: 'contact', label: 'Contact', icon: Phone },
          { id: 'schedule', label: 'Schedule', icon: Calendar },
          { id: 'settings', label: 'Settings', icon: Settings }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );

  const renderBasicInfoTab = () => (
    <div className="space-y-6">
      {/* Logo Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Department Logo</label>
        <div className="flex items-center space-x-6">
          <div className="flex-shrink-0">
            {formData.logo ? (
              <img
                src={formData.logo}
                alt="Department logo"
                className="w-20 h-20 rounded-lg object-cover ring-4 ring-blue-100"
              />
            ) : (
              <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center ring-4 ring-blue-100">
                <Building className="w-10 h-10 text-gray-500" />
              </div>
            )}
          </div>
          <div>
            <label className="cursor-pointer inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <Camera className="w-4 h-4 mr-2" />
              Upload Logo
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </label>
            <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 2MB</p>
          </div>
        </div>
      </div>

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Department Name *</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => handleFormChange('name', e.target.value)}
            placeholder="Enter department name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            value={formData.status}
            onChange={(e) => handleFormChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
        <textarea
          required
          rows={4}
          value={formData.description}
          onChange={(e) => handleFormChange('description', e.target.value)}
          placeholder="Describe the department's responsibilities and services"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Service Categories */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Service Categories *</label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {availableCategories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => handleCategoryToggle(category.id)}
              className={`p-3 rounded-lg border-2 text-left transition-colors ${
                formData.categories.includes(category.id)
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-xl mb-1">{category.icon}</div>
              <div className="text-sm font-medium">{category.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Service Regions */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Service Regions *</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {availableRegions.map((region) => (
            <label key={region} className="flex items-center">
              <input
                type="checkbox"
                checked={formData.regions.includes(region)}
                onChange={() => handleRegionToggle(region)}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <span className="ml-2 text-sm text-gray-700">{region}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContactTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
          <input
            type="email"
            required
            value={formData.contactInfo.email}
            onChange={(e) => handleFormChange('contactInfo.email', e.target.value)}
            placeholder="department@city.gov"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
          <input
            type="tel"
            required
            value={formData.contactInfo.phone}
            onChange={(e) => handleFormChange('contactInfo.phone', e.target.value)}
            placeholder="+1 (555) 123-4567"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Phone</label>
          <input
            type="tel"
            value={formData.contactInfo.emergencyPhone}
            onChange={(e) => handleFormChange('contactInfo.emergencyPhone', e.target.value)}
            placeholder="+1 (555) 911-DEPT"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
          <input
            type="url"
            value={formData.contactInfo.website}
            onChange={(e) => handleFormChange('contactInfo.website', e.target.value)}
            placeholder="https://department.city.gov"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Physical Address *</label>
        <textarea
          required
          rows={3}
          value={formData.contactInfo.address}
          onChange={(e) => handleFormChange('contactInfo.address', e.target.value)}
          placeholder="123 Main Street, City Hall, State 12345"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  );

  const renderScheduleTab = () => (
    <div className="space-y-6">
      <div>
        <h4 className="text-lg font-medium text-gray-900 mb-4">Working Hours</h4>
        <div className="space-y-4">
          {Object.entries(formData.workingHours).map(([day, hours]) => (
            <div key={day} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
              <div className="w-24">
                <span className="text-sm font-medium text-gray-900 capitalize">{day}</span>
              </div>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={!hours.closed}
                  onChange={(e) => handleWorkingHoursChange(day, 'closed', !e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <span className="ml-2 text-sm text-gray-700">Open</span>
              </label>

              {!hours.closed && (
                <>
                  <div className="flex items-center space-x-2">
                    <label className="text-sm text-gray-600">From:</label>
                    <input
                      type="time"
                      value={hours.start}
                      onChange={(e) => handleWorkingHoursChange(day, 'start', e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <label className="text-sm text-gray-600">To:</label>
                    <input
                      type="time"
                      value={hours.end}
                      onChange={(e) => handleWorkingHoursChange(day, 'end', e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </>
              )}

              {hours.closed && (
                <span className="text-sm text-gray-500 italic">Closed</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSettingsTab = () => (
    <div className="space-y-6">
      {/* General Settings */}
      <div>
        <h4 className="text-lg font-medium text-gray-900 mb-4">General Settings</h4>
        <div className="space-y-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.settings.autoAssignment}
              onChange={(e) => handleFormChange('settings.autoAssignment', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <span className="ml-2 text-sm text-gray-700">Enable automatic complaint assignment</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.settings.emergencyResponse}
              onChange={(e) => handleFormChange('settings.emergencyResponse', e.target.checked)}
              className="rounded border-gray-300 text-red-600 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50"
            />
            <span className="ml-2 text-sm text-gray-700">Emergency response capability</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.settings.publicVisible}
              onChange={(e) => handleFormChange('settings.publicVisible', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <span className="ml-2 text-sm text-gray-700">Visible to public</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.settings.allowDirectContact}
              onChange={(e) => handleFormChange('settings.allowDirectContact', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <span className="ml-2 text-sm text-gray-700">Allow direct citizen contact</span>
          </label>
        </div>
      </div>

      {/* Capacity Settings */}
      <div>
        <h4 className="text-lg font-medium text-gray-900 mb-4">Capacity Settings</h4>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Maximum Complaints Per Day
          </label>
          <input
            type="number"
            min="1"
            max="500"
            value={formData.settings.maxComplaintsPerDay}
            onChange={(e) => handleFormChange('settings.maxComplaintsPerDay', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Maximum number of complaints this department can handle per day
          </p>
        </div>
      </div>

      {/* Priority Levels */}
      <div>
        <h4 className="text-lg font-medium text-gray-900 mb-4">Supported Priority Levels</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {priorityLevels.map((priority) => (
            <label key={priority} className="flex items-center">
              <input
                type="checkbox"
                checked={formData.settings.priorityLevels.includes(priority)}
                onChange={() => handlePriorityToggle(priority)}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <span className="ml-2 text-sm text-gray-700">{priority}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

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
            onClick={() => {
              setFormData(defaultFormData);
              setShowAddDepartment(true);
              setActiveTab('basic');
            }}
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
                  {department.contactInfo.website && (
                    <div className="flex items-center">
                      <Globe className="w-4 h-4 mr-2" />
                      <a href={department.contactInfo.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                        {department.contactInfo.website}
                      </a>
                    </div>
                  )}
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
                    onClick={() => handleEdit(department)}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleConfigure(department)}
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

      {/* Add/Edit Department Modal */}
      {(showAddDepartment || showEditDepartment || showConfigureDepartment) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmit}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {showAddDepartment ? 'Add New Department' : 
                     showEditDepartment ? 'Edit Department' : 'Configure Department'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddDepartment(false);
                      setShowEditDepartment(null);
                      setShowConfigureDepartment(null);
                      setFormData(defaultFormData);
                      setActiveTab('basic');
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {renderFormTabs()}

                <div className="min-h-[400px]">
                  {activeTab === 'basic' && renderBasicInfoTab()}
                  {activeTab === 'contact' && renderContactTab()}
                  {activeTab === 'schedule' && renderScheduleTab()}
                  {activeTab === 'settings' && renderSettingsTab()}
                </div>

                <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddDepartment(false);
                      setShowEditDepartment(null);
                      setShowConfigureDepartment(null);
                      setFormData(defaultFormData);
                      setActiveTab('basic');
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !formData.name || !formData.description || formData.categories.length === 0}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        {showAddDepartment ? 'Create Department' : 'Save Changes'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentManagement;