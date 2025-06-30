import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { 
  Calendar, 
  User, 
  Settings, 
  LogOut, 
  Heart, 
  Clock, 
  Activity,
  Bell,
  TrendingUp,
  Plus,
  FileText,
  Stethoscope,
  Pill,
  BarChart3,
  Shield,
  Download,
  Edit,
  Eye,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Copy
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase/config';
import { Appointment } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser, patientProfile, logout } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, [currentUser]);

  const fetchDashboardData = async () => {
    if (!currentUser) return;

    try {
      // Fetch appointments using patientUid (Firebase UID) instead of patientId
      const q = query(
        collection(db, 'appointments'),
        where('patientUid', '==', currentUser.uid),
        limit(20)
      );

      const querySnapshot = await getDocs(q);
      const appointmentList: Appointment[] = [];

      querySnapshot.docs.forEach(doc => {
        appointmentList.push({
          id: doc.id,
          ...doc.data()
        } as Appointment);
      });

      // Sort appointments by date in JavaScript instead of Firestore
      appointmentList.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateB - dateA; // Sort in descending order (most recent first)
      });

      setAppointments(appointmentList);
      console.log('Fetched appointments:', appointmentList);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Set empty array on error to prevent infinite loading
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const copyPatientId = () => {
    if (patientProfile?.patientId) {
      navigator.clipboard.writeText(patientProfile.patientId);
      toast.success('Patient ID copied to clipboard!');
    }
  };

  const refreshAppointments = () => {
    setLoading(true);
    fetchDashboardData();
    toast.success('Appointments refreshed!');
  };

  const sidebarItems = [
    { id: 'overview', label: 'Dashboard', icon: Activity },
    { id: 'appointments', label: 'My Appointments', icon: Calendar },
    { id: 'health-records', label: 'Health Records', icon: FileText },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const stats = [
    {
      title: 'Total Appointments',
      value: appointments.length,
      icon: Calendar,
      color: 'bg-primary-500',
      bgColor: 'bg-primary-50',
      textColor: 'text-primary-600'
    },
    {
      title: 'Upcoming',
      value: appointments.filter(a => a.status === 'scheduled').length,
      icon: Clock,
      color: 'bg-accent-500',
      bgColor: 'bg-accent-50',
      textColor: 'text-accent-600'
    },
    {
      title: 'Completed',
      value: appointments.filter(a => a.status === 'completed').length,
      icon: CheckCircle2,
      color: 'bg-success-500',
      bgColor: 'bg-success-50',
      textColor: 'text-success-600'
    },
    {
      title: 'Health Score',
      value: '92/100',
      icon: Heart,
      color: 'bg-medical-500',
      bgColor: 'bg-medical-50',
      textColor: 'text-medical-600'
    }
  ];

  const healthRecords = [
    {
      id: 1,
      type: 'Lab Report',
      title: 'Blood Test Results',
      date: '2024-01-15',
      doctor: 'Dr. Sarah Johnson',
      status: 'Normal',
      icon: Activity
    },
    {
      id: 2,
      type: 'Prescription',
      title: 'Medication List',
      date: '2024-01-10',
      doctor: 'Dr. Michael Chen',
      status: 'Active',
      icon: Pill
    },
    {
      id: 3,
      type: 'Imaging',
      title: 'Chest X-Ray',
      date: '2024-01-05',
      doctor: 'Dr. Emily Rodriguez',
      status: 'Normal',
      icon: BarChart3
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  Welcome back, {patientProfile?.fullName?.split(' ')[0] || 'User'}!
                </h2>
                <div className="flex items-center space-x-3 mt-2">
                  <p className="text-gray-600">
                    Patient ID: <span className="font-mono font-semibold text-primary-600">
                      {patientProfile?.patientId || 'Loading...'}
                    </span>
                  </p>
                  {patientProfile?.patientId && patientProfile.patientId !== 'Not assigned' && (
                    <button
                      onClick={copyPatientId}
                      className="text-primary-600 hover:text-primary-700 p-1 rounded-lg hover:bg-primary-50 transition-colors"
                      title="Copy Patient ID"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
              <div className="flex space-x-3">
                <a
                  href="/appointments"
                  className="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-6 py-3 rounded-xl hover:shadow-glow-primary transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
                >
                  <Plus className="h-5 w-5" />
                  <span>Book Appointment</span>
                </a>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className={`${stat.bgColor} p-6 rounded-2xl border border-opacity-20 hover:shadow-medium transition-all duration-300 animate-slide-up`} style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    </div>
                    <div className={`${stat.color} p-3 rounded-xl shadow-soft`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Appointments */}
              <div className="bg-white rounded-2xl shadow-soft p-6 hover:shadow-medium transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                    <Calendar className="h-5 w-5 text-primary-600 mr-2" />
                    Recent Appointments
                  </h3>
                  <button onClick={() => setActiveTab('appointments')} className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                    View All
                  </button>
                </div>
                
                {appointments.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No appointments yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {appointments.slice(0, 3).map(appointment => (
                      <div key={appointment.id} className="flex items-center justify-between p-4 bg-primary-50 rounded-xl hover:bg-primary-100 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className="bg-primary-100 p-2 rounded-lg">
                            <Stethoscope className="h-5 w-5 text-primary-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{appointment.doctorName || 'Dr. Sample Doctor'}</p>
                            <p className="text-sm text-gray-600">{appointment.doctorSpecialty || 'General Medicine'}</p>
                            <p className="text-xs text-gray-500">{appointment.type === 'online' ? 'Online Consultation' : 'In-person Visit'}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">
                            {new Date(appointment.date).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-600">{appointment.time}</p>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                            appointment.status === 'scheduled' 
                              ? 'bg-primary-100 text-primary-800'
                              : appointment.status === 'completed'
                              ? 'bg-success-100 text-success-800'
                              : 'bg-error-100 text-error-800'
                          }`}>
                            {appointment.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Health Summary */}
              <div className="bg-white rounded-2xl shadow-soft p-6 hover:shadow-medium transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                    <Heart className="h-5 w-5 text-medical-600 mr-2" />
                    Health Summary
                  </h3>
                  <button onClick={() => setActiveTab('health-records')} className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                    View Records
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-success-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle2 className="h-5 w-5 text-success-600" />
                      <span className="text-gray-700">Blood Pressure</span>
                    </div>
                    <span className="font-semibold text-success-600">Normal</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-warning-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <AlertCircle className="h-5 w-5 text-warning-600" />
                      <span className="text-gray-700">Cholesterol</span>
                    </div>
                    <span className="font-semibold text-warning-600">Monitor</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-success-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle2 className="h-5 w-5 text-success-600" />
                      <span className="text-gray-700">BMI</span>
                    </div>
                    <span className="font-semibold text-success-600">Healthy</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Health Tips */}
            <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl p-6 border border-primary-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 text-primary-600 mr-2" />
                Personalized Health Tips
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-soft">
                  <h4 className="font-medium text-gray-900 mb-2">💧 Stay Hydrated</h4>
                  <p className="text-sm text-gray-600">Drink at least 8 glasses of water daily for optimal health and energy.</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-soft">
                  <h4 className="font-medium text-gray-900 mb-2">🏃‍♂️ Regular Exercise</h4>
                  <p className="text-sm text-gray-600">Aim for 30 minutes of moderate exercise 5 days a week.</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'appointments':
        return (
          <div className="bg-white rounded-2xl shadow-soft p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <Calendar className="h-6 w-6 text-primary-600 mr-3" />
                My Appointments
              </h2>
              <div className="flex space-x-3">
                <button
                  onClick={refreshAppointments}
                  disabled={loading}
                  className="bg-gray-500 text-white px-4 py-2 rounded-xl hover:bg-gray-600 transition-colors flex items-center space-x-2 disabled:opacity-50"
                >
                  <Activity className="h-4 w-4" />
                  <span>Refresh</span>
                </button>
                <a
                  href="/appointments"
                  className="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-4 py-2 rounded-xl hover:shadow-glow-primary transition-all duration-300 flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Book New</span>
                </a>
              </div>
            </div>
            
            {appointments.length === 0 ? (
              <div className="text-center py-12">
                {loading ? (
                  <div className="flex flex-col items-center">
                    <LoadingSpinner size="lg" />
                    <p className="text-gray-600 mt-4">Loading appointments...</p>
                  </div>
                ) : (
                  <>
                    <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">No appointments scheduled</p>
                    <a
                      href="/appointments"
                      className="bg-primary-500 text-white px-6 py-2 rounded-xl hover:bg-primary-600 transition-colors"
                    >
                      Book Your First Appointment
                    </a>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.map(appointment => (
                  <div key={appointment.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-medium transition-all duration-300">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="bg-primary-100 p-3 rounded-xl">
                          <Stethoscope className="h-6 w-6 text-primary-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <p className="font-semibold text-gray-900 text-lg">{appointment.doctorName || 'Dr. Sample Doctor'}</p>
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                              appointment.status === 'scheduled' 
                                ? 'bg-primary-100 text-primary-800'
                                : appointment.status === 'completed'
                                ? 'bg-success-100 text-success-800'
                                : 'bg-error-100 text-error-800'
                            }`}>
                              {appointment.status}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-gray-600 mb-1">
                                <span className="font-medium">Specialty:</span> {appointment.doctorSpecialty || 'General Medicine'}
                              </p>
                              <p className="text-gray-600 mb-1">
                                <span className="font-medium">Hospital:</span> {appointment.hospitalName || 'City Hospital'}
                              </p>
                              <p className="text-gray-600 mb-1">
                                <span className="font-medium">Address:</span> {appointment.hospitalAddress || 'Hospital Address'}
                              </p>
                              <p className="text-gray-600">
                                <span className="font-medium">Type:</span> {appointment.type === 'online' ? 'Online Consultation' : 'In-person Visit'}
                              </p>
                            </div>
                            
                            <div>
                              <p className="text-gray-600 mb-1">
                                <span className="font-medium">Date:</span> {new Date(appointment.date).toLocaleDateString('en-US', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </p>
                              <p className="text-gray-600 mb-1">
                                <span className="font-medium">Time:</span> {appointment.time}
                              </p>
                              <p className="text-gray-600 mb-1">
                                <span className="font-medium">Consultation Fee:</span> ₹{appointment.consultationFee || 'Not specified'}
                              </p>
                              {appointment.meetingLink && (
                                <p className="text-gray-600">
                                  <span className="font-medium">Meeting Link:</span> 
                                  <a href={appointment.meetingLink} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 ml-1">
                                    Join Meeting
                                  </a>
                                </p>
                              )}
                            </div>
                          </div>
                          
                          {appointment.notes && (
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <p className="text-sm text-gray-700">
                                <span className="font-medium">Notes:</span> {appointment.notes}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col space-y-2">
                        <button className="text-primary-600 hover:text-primary-700 p-2 rounded-lg hover:bg-primary-50 transition-colors" title="View Details">
                          <Eye className="h-4 w-4" />
                        </button>
                        {appointment.status === 'scheduled' && (
                          <button className="text-error-600 hover:text-error-700 p-2 rounded-lg hover:bg-error-50 transition-colors" title="Cancel Appointment">
                            <XCircle className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'health-records':
        return (
          <div className="bg-white rounded-2xl shadow-soft p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <FileText className="h-6 w-6 text-primary-600 mr-3" />
                Health Records
              </h2>
              <button className="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-4 py-2 rounded-xl hover:shadow-glow-primary transition-all duration-300 flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Export All</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-primary-50 p-6 rounded-xl border border-primary-200">
                <div className="flex items-center justify-between mb-4">
                  <Activity className="h-8 w-8 text-primary-600" />
                  <span className="text-sm font-medium text-primary-600">Latest</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Lab Reports</h3>
                <p className="text-gray-600 text-sm">3 recent reports available</p>
              </div>
              
              <div className="bg-accent-50 p-6 rounded-xl border border-accent-200">
                <div className="flex items-center justify-between mb-4">
                  <Pill className="h-8 w-8 text-accent-600" />
                  <span className="text-sm font-medium text-accent-600">Active</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Prescriptions</h3>
                <p className="text-gray-600 text-sm">2 active medications</p>
              </div>
              
              <div className="bg-medical-50 p-6 rounded-xl border border-medical-200">
                <div className="flex items-center justify-between mb-4">
                  <BarChart3 className="h-8 w-8 text-medical-600" />
                  <span className="text-sm font-medium text-medical-600">Recent</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Imaging</h3>
                <p className="text-gray-600 text-sm">1 recent scan</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {healthRecords.map(record => (
                <div key={record.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-medium transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-primary-100 p-3 rounded-xl">
                        <record.icon className="h-6 w-6 text-primary-600" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <p className="font-semibold text-gray-900">{record.title}</p>
                          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                            {record.type}
                          </span>
                        </div>
                        <p className="text-gray-600">Dr. {record.doctor}</p>
                        <p className="text-sm text-gray-500">{new Date(record.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        record.status === 'Normal' || record.status === 'Active'
                          ? 'bg-success-100 text-success-800'
                          : 'bg-warning-100 text-warning-800'
                      }`}>
                        {record.status}
                      </span>
                      <button className="text-primary-600 hover:text-primary-700 p-2 rounded-lg hover:bg-primary-50">
                        <Eye className="h-5 w-5" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-50">
                        <Download className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className="bg-white rounded-2xl shadow-soft p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <User className="h-6 w-6 text-primary-600 mr-3" />
                My Profile
              </h2>
              <a
                href="/complete-profile"
                className="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-4 py-2 rounded-xl hover:shadow-glow-primary transition-all duration-300 flex items-center space-x-2"
              >
                <Edit className="h-4 w-4" />
                <span>Edit Profile</span>
              </a>
            </div>
            
            {patientProfile ? (
              <div className="space-y-8">
                {/* Patient ID Card */}
                <div className="bg-gradient-to-r from-primary-500 to-accent-500 p-6 rounded-2xl text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold mb-2">{patientProfile.fullName}</h3>
                      <div className="flex items-center space-x-3">
                        <p className="text-primary-100">Patient ID: {patientProfile.patientId}</p>
                        {patientProfile.patientId && patientProfile.patientId !== 'Not assigned' && (
                          <button
                            onClick={copyPatientId}
                            className="text-white hover:text-primary-100 p-1 rounded-lg hover:bg-white/20 transition-colors"
                            title="Copy Patient ID"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="bg-white/20 p-3 rounded-xl">
                      <Heart className="h-8 w-8 text-white" />
                    </div>
                  </div>
                </div>

                {/* Profile Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <div className="p-3 bg-gray-50 rounded-lg border">{patientProfile.fullName}</div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <div className="p-3 bg-gray-50 rounded-lg border">{patientProfile.email}</div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <div className="p-3 bg-gray-50 rounded-lg border">{patientProfile.phoneNumber}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                      <div className="p-3 bg-gray-50 rounded-lg border">{patientProfile.age || 'Not provided'} {patientProfile.age ? 'years' : ''}</div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                      <div className="p-3 bg-gray-50 rounded-lg border capitalize">{patientProfile.gender || 'Not provided'}</div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                      <div className="p-3 bg-gray-50 rounded-lg border">{patientProfile.pincode || 'Not provided'}</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <div className="p-3 bg-gray-50 rounded-lg border">{patientProfile.address || 'Not provided'}</div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Medical History</label>
                  <div className="p-3 bg-gray-50 rounded-lg border min-h-[100px]">
                    {patientProfile.medicalHistory || 'No medical history provided'}
                  </div>
                </div>

                {!patientProfile.isProfileComplete && (
                  <div className="bg-warning-50 border border-warning-200 rounded-xl p-4">
                    <div className="flex items-center space-x-3">
                      <AlertCircle className="h-5 w-5 text-warning-600" />
                      <div>
                        <h4 className="font-medium text-warning-900">Complete Your Profile</h4>
                        <p className="text-sm text-warning-700">Please complete your profile to access all features.</p>
                      </div>
                      <a
                        href="/complete-profile"
                        className="bg-warning-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-warning-700 transition-colors"
                      >
                        Complete Now
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">Profile information not available</p>
              </div>
            )}
          </div>
        );

      case 'settings':
        return (
          <div className="bg-white rounded-2xl shadow-soft p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Settings className="h-6 w-6 text-primary-600 mr-3" />
              Settings
            </h2>
            
            <div className="space-y-8">
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Bell className="h-5 w-5 text-primary-600 mr-2" />
                  Notifications
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-medium text-gray-900">Email Notifications</p>
                      <p className="text-sm text-gray-600">Receive appointment reminders via email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-medium text-gray-900">SMS Notifications</p>
                      <p className="text-sm text-gray-600">Receive appointment reminders via SMS</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Shield className="h-5 w-5 text-primary-600 mr-2" />
                  Privacy & Security
                </h3>
                <div className="space-y-3">
                  <button className="w-full text-left p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">Change Password</span>
                      <Edit className="h-4 w-4 text-gray-600" />
                    </div>
                  </button>
                  <button className="w-full text-left p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">Two-Factor Authentication</span>
                      <Settings className="h-4 w-4 text-gray-600" />
                    </div>
                  </button>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Management</h3>
                <div className="space-y-3">
                  <button className="w-full text-left p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">Download My Data</span>
                      <Download className="h-4 w-4 text-gray-600" />
                    </div>
                  </button>
                  <button className="w-full text-left p-4 bg-error-50 text-error-600 rounded-xl hover:bg-error-100 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Delete Account</span>
                      <XCircle className="h-4 w-4" />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pastel-lightBlue to-pastel-skyBlue flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading your dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pastel-lightBlue to-pastel-skyBlue">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-72 min-h-screen bg-white/90 backdrop-blur-sm shadow-large">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-8">
              <div className="bg-gradient-to-r from-primary-500 to-accent-500 p-2.5 rounded-xl shadow-glow-primary">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">HealthPortal</span>
            </div>
            
            <nav className="space-y-2">
              {sidebarItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    activeTab === item.id
                      ? 'bg-primary-100 text-primary-700 shadow-soft border-r-4 border-primary-500'
                      : 'text-gray-600 hover:bg-primary-50 hover:text-primary-600'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
              
              <button
                onClick={logout}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-error-600 hover:bg-error-50 transition-all duration-200 mt-8"
              >
                <LogOut className="h-5 w-5" />
                <span className="font-medium">Sign Out</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;