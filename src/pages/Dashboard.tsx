import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, limit, doc, updateDoc } from 'firebase/firestore';
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
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection as fsCollection, addDoc, getDocs as fsGetDocs, query as fsQuery, orderBy as fsOrderBy } from 'firebase/firestore';
import { storage } from '../firebase/config';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser, patientProfile, logout, refreshProfile } = useAuth();
  const [editingProfile, setEditingProfile] = useState(false);
  const [editProfileData, setEditProfileData] = useState<any>(null);
  const [savingProfile, setSavingProfile] = useState(false);
  // Health Records Upload State
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadForm, setUploadForm] = useState({
    type: '',
    title: '',
    date: '',
    file: null as File | null
  });
  const [uploadedDocs, setUploadedDocs] = useState<any[]>([]);
  const [fetchingDocs, setFetchingDocs] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(patientProfile?.photoURL || null);
  const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);
  const [profilePhotoUploading, setProfilePhotoUploading] = useState(false);
  const [profilePhotoUploadProgress, setProfilePhotoUploadProgress] = useState(0);

  useEffect(() => {
    fetchDashboardData();
  }, [currentUser]);

  useEffect(() => {
    setProfilePhoto(patientProfile?.photoURL || null);
  }, [patientProfile]);

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

  const handleEditProfile = () => {
    setEditProfileData({ ...patientProfile });
    setEditingProfile(true);
  };

  const handleCancelEdit = () => {
    setEditingProfile(false);
    setEditProfileData(null);
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditProfileData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    if (!currentUser || !editProfileData) return;
    setSavingProfile(true);
    try {
      let photoURL = profilePhoto;
      if (profilePhotoFile) {
        photoURL = await handleProfilePhotoUpload(profilePhotoFile);
      }
      // Check if profile is complete (has all required fields)
      const isComplete = editProfileData.address && 
                        editProfileData.pincode && 
                        editProfileData.gender && 
                        editProfileData.age && 
                        editProfileData.medicalHistory;

      // Update patients collection
      const patientDoc = doc(db, 'patients', currentUser.uid);
      await updateDoc(patientDoc, {
        ...editProfileData,
        photoURL: photoURL || '',
        isProfileComplete: isComplete,
        updatedAt: new Date()
      });

      // Update users collection
      const userDoc = doc(db, 'users', currentUser.uid);
      await updateDoc(userDoc, {
        isProfileComplete: isComplete,
        updatedAt: new Date()
      });

      toast.success(isComplete ? 'Profile completed successfully!' : 'Profile updated successfully!');
      setEditingProfile(false);
      setEditProfileData(null);
      
      // Refresh the profile data
      await refreshProfile();
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  // Fetch uploaded documents for this user
  useEffect(() => {
    if (currentUser) {
      fetchUploadedDocs();
    }
    // eslint-disable-next-line
  }, [currentUser]);

  useEffect(() => {
    if (activeTab === 'health-records' && currentUser) {
      fetchUploadedDocs();
    }
    // eslint-disable-next-line
  }, [activeTab, currentUser]);

  const fetchUploadedDocs = async () => {
    if (!currentUser) return;
    setFetchingDocs(true);
    try {
      const q = fsQuery(
        fsCollection(db, 'patients', currentUser.uid, 'healthRecords'),
        fsOrderBy('date', 'desc')
      );
      const snap = await fsGetDocs(q);
      const docs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUploadedDocs(docs);
    } catch (e) {
      toast.error('Failed to fetch documents');
    } finally {
      setFetchingDocs(false);
    }
  };

  const handleUploadInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as any;
    setUploadForm(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleUploadDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !uploadForm.file || !uploadForm.type || !uploadForm.title || !uploadForm.date) {
      toast.error('Please fill all fields and select a file');
      return;
    }
    setUploading(true);
    setUploadProgress(0);
    try {
      const file = uploadForm.file;
      const ext = file.name.split('.').pop();
      const storagePath = `patients/${currentUser.uid}/healthRecords/${Date.now()}_${uploadForm.type}.${ext}`;
      const fileRef = storageRef(storage, storagePath);
      const uploadTask = uploadBytesResumable(fileRef, file);
      uploadTask.on('state_changed',
        (snapshot) => {
          setUploadProgress(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100));
        },
        (error) => {
          toast.error('Upload failed');
          setUploading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          // Save metadata to Firestore
          await addDoc(fsCollection(db, 'patients', currentUser.uid, 'healthRecords'), {
            type: uploadForm.type,
            title: uploadForm.title,
            date: uploadForm.date,
            fileName: file.name,
            fileUrl: downloadURL,
            uploadedAt: new Date(),
            uploadedBy: patientProfile?.fullName || currentUser.email || 'Unknown'
          });
          toast.success('Document uploaded!');
          setUploadForm({ type: '', title: '', date: '', file: null });
          setUploadProgress(0);
          setUploading(false);
          fetchUploadedDocs();
        }
      );
    } catch (e) {
      toast.error('Upload failed');
      setUploading(false);
    }
  };

  const handleProfilePhotoUpload = async (file: File) => {
    if (!file || !currentUser) return null;
    setProfilePhotoUploading(true);
    setProfilePhotoUploadProgress(0);
    try {
      const ext = file.name.split('.').pop();
      const storagePath = `patients/${currentUser.uid}/profilePhoto.${ext}`;
      const fileRef = storageRef(storage, storagePath);
      const uploadTask = uploadBytesResumable(fileRef, file);
      return new Promise<string>((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            setProfilePhotoUploadProgress(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100));
          },
          (error) => {
            setProfilePhotoUploading(false);
            toast.error('Profile photo upload failed');
            reject(error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            setProfilePhoto(downloadURL);
            setProfilePhotoUploading(false);
            // Update Firestore
            const patientDoc = doc(db, 'patients', currentUser.uid);
            await updateDoc(patientDoc, { photoURL: downloadURL, updatedAt: new Date() });
            await refreshProfile();
            toast.success('Profile photo updated!');
            resolve(downloadURL);
          }
        );
      });
    } catch (e) {
      setProfilePhotoUploading(false);
      toast.error('Profile photo upload failed');
      return null;
    }
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
                
                {/* Profile Completion Status */}
                {patientProfile && (
                  <div className="mt-3">
                    {patientProfile.isProfileComplete ? (
                      <div className="flex items-center space-x-2 text-success-600">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="text-sm font-medium">Profile Complete</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 text-warning-600">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">Profile Incomplete - Please update your profile</span>
                        <button
                          onClick={() => setActiveTab('profile')}
                          className="text-primary-600 hover:text-primary-700 text-sm underline"
                        >
                          Update Now
                        </button>
                      </div>
                    )}
                  </div>
                )}
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
                {/* Show real health records */}
                {fetchingDocs ? (
                  <div className="text-gray-500">Loading health records...</div>
                ) : uploadedDocs.length === 0 ? (
                  <div className="text-gray-500">No health records uploaded yet.</div>
                ) : (
                  <div className="space-y-4">
                    {uploadedDocs.slice(0, 3).map(doc => (
                      <div key={doc.id} className="flex items-center justify-between p-3 bg-primary-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">{doc.title}</div>
                          <div className="text-xs text-gray-600">{doc.type} &middot; {doc.date}</div>
                        </div>
                        <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline text-sm font-medium">View</a>
                      </div>
                    ))}
                  </div>
                )}
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
            {/* Upload Document Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Health Document</h3>
              <form className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end" onSubmit={handleUploadDoc}>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
                  <select
                    name="type"
                    value={uploadForm.type}
                    onChange={handleUploadInputChange}
                    className="p-2 border rounded-lg w-full"
                    required
                  >
                    <option value="">Select</option>
                    <option value="Prescription">Prescription</option>
                    <option value="Lab Report">Lab Report</option>
                    <option value="Imaging">Imaging</option>
                    <option value="Discharge Summary">Discharge Summary</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={uploadForm.title}
                    onChange={handleUploadInputChange}
                    className="p-2 border rounded-lg w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={uploadForm.date}
                    onChange={handleUploadInputChange}
                    className="p-2 border rounded-lg w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">File</label>
                  <input
                    type="file"
                    name="file"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={handleUploadInputChange}
                    className="p-2 border rounded-lg w-full"
                    required
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 disabled:opacity-50 w-full"
                    disabled={uploading}
                  >
                    {uploading ? `Uploading... ${uploadProgress}%` : 'Upload'}
                  </button>
                </div>
              </form>
              {uploading && (
                <div className="mt-2 text-xs text-gray-600">Uploading: {uploadProgress}%</div>
              )}
            </div>
            {/* Uploaded Documents Table */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Uploaded Documents</h3>
              {fetchingDocs ? (
                <div className="text-gray-500">Loading documents...</div>
              ) : uploadedDocs.length === 0 ? (
                <div className="text-gray-500">No documents uploaded yet.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm border rounded-lg">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-2 text-left">Type</th>
                        <th className="p-2 text-left">Title</th>
                        <th className="p-2 text-left">Date</th>
                        <th className="p-2 text-left">Uploaded By</th>
                        <th className="p-2 text-left">File</th>
                      </tr>
                    </thead>
                    <tbody>
                      {uploadedDocs.map(doc => (
                        <tr key={doc.id} className="border-b">
                          <td className="p-2">{doc.type}</td>
                          <td className="p-2">{doc.title}</td>
                          <td className="p-2">{doc.date}</td>
                          <td className="p-2">{doc.uploadedBy}</td>
                          <td className="p-2">
                            <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">View</a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className="bg-white rounded-2xl shadow-soft p-6">
            <div className="flex flex-row items-center mb-8 gap-8">
              {/* Profile Image */}
              {(profilePhoto || patientProfile?.photoURL || patientProfile?.profilePicUrl) ? (
                <img
                  src={profilePhoto || patientProfile?.photoURL || patientProfile?.profilePicUrl}
                  alt="Profile"
                  className="w-36 h-36 rounded-full object-cover border-4 border-primary-500 shadow-xl transition-transform duration-200 hover:scale-105"
                />
              ) : (
                <div className="w-36 h-36 bg-primary-100 rounded-full flex items-center justify-center border-4 border-primary-200 shadow-xl">
                  <svg className="w-16 h-16 text-primary-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
                </div>
              )}
              {/* Action Buttons */}
              <div className="flex flex-col gap-4">
                <input
                  id="profile-photo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) handleProfilePhotoUpload(file);
                  }}
                />
                <button
                  onClick={() => document.getElementById('profile-photo-upload')?.click()}
                  className="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors shadow-md font-semibold flex items-center space-x-2"
                  disabled={profilePhotoUploading}
                >
                  {profilePhotoUploading ? `Uploading... ${profilePhotoUploadProgress}%` : <><Edit className="h-5 w-5" /><span>Update Photo</span></>}
                </button>
                {!editingProfile && (
                  <button
                    onClick={handleEditProfile}
                    className="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-6 py-2 rounded-lg hover:shadow-glow-primary transition-all duration-300 flex items-center space-x-2"
                  >
                    <Edit className="h-5 w-5" />
                    <span>Edit Profile</span>
                  </button>
                )}
              </div>
            </div>
            <div className="space-y-8">
              <div className="bg-gradient-to-r from-primary-500 to-accent-500 p-6 rounded-2xl text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-2">{editingProfile ? (
                      <input
                        type="text"
                        name="fullName"
                        value={editProfileData?.fullName || ''}
                        onChange={handleProfileChange}
                        className="bg-white text-gray-900 rounded-lg px-2 py-1 w-full"
                      />
                    ) : (
                      patientProfile?.fullName || ''
                    )}</h3>
                    <div className="flex items-center space-x-3">
                      <p className="text-primary-100">Patient ID: {patientProfile?.patientId || ''}</p>
                      {patientProfile?.patientId && patientProfile.patientId !== 'Not assigned' && (
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    {editingProfile ? (
                      <input
                        type="text"
                        name="fullName"
                        value={editProfileData?.fullName || ''}
                        onChange={handleProfileChange}
                        className="p-3 bg-gray-50 rounded-lg border w-full"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-lg border">{patientProfile?.fullName || ''}</div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    {editingProfile ? (
                      <input
                        type="email"
                        name="email"
                        value={editProfileData?.email || ''}
                        onChange={handleProfileChange}
                        className="p-3 bg-gray-50 rounded-lg border w-full"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-lg border">{patientProfile?.email || ''}</div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    {editingProfile ? (
                      <input
                        type="text"
                        name="phoneNumber"
                        value={editProfileData?.phoneNumber || ''}
                        onChange={handleProfileChange}
                        className="p-3 bg-gray-50 rounded-lg border w-full"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-lg border">{patientProfile?.phoneNumber || ''}</div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                    {editingProfile ? (
                      <input
                        type="number"
                        name="age"
                        value={editProfileData?.age || ''}
                        onChange={handleProfileChange}
                        className="p-3 bg-gray-50 rounded-lg border w-full"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-lg border">{patientProfile?.age ? `${patientProfile.age} years` : 'Not provided'}</div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                    {editingProfile ? (
                      <input
                        type="text"
                        name="gender"
                        value={editProfileData?.gender || ''}
                        onChange={handleProfileChange}
                        className="p-3 bg-gray-50 rounded-lg border w-full"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-lg border capitalize">{patientProfile?.gender || 'Not provided'}</div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                    {editingProfile ? (
                      <input
                        type="text"
                        name="pincode"
                        value={editProfileData?.pincode || ''}
                        onChange={handleProfileChange}
                        className="p-3 bg-gray-50 rounded-lg border w-full"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-lg border">{patientProfile?.pincode || 'Not provided'}</div>
                    )}
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                {editingProfile ? (
                  <input
                    type="text"
                    name="address"
                    value={editProfileData?.address || ''}
                    onChange={handleProfileChange}
                    className="p-3 bg-gray-50 rounded-lg border w-full"
                  />
                ) : (
                  <div className="p-3 bg-gray-50 rounded-lg border">{patientProfile?.address || 'Not provided'}</div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Medical History</label>
                {editingProfile ? (
                  <textarea
                    name="medicalHistory"
                    value={editProfileData?.medicalHistory || ''}
                    onChange={handleProfileChange}
                    className="p-3 bg-gray-50 rounded-lg border w-full min-h-[100px]"
                  />
                ) : (
                  <div className="p-3 bg-gray-50 rounded-lg border min-h-[100px]">
                    {patientProfile?.medicalHistory || 'No medical history provided'}
                  </div>
                )}
              </div>
              {editingProfile && (
                <div className="flex space-x-4">
                  <button
                    onClick={handleSaveProfile}
                    className="bg-primary-500 text-white px-6 py-2 rounded-xl hover:bg-primary-600 transition-colors disabled:opacity-50"
                    disabled={savingProfile}
                  >
                    {savingProfile ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="bg-gray-200 text-gray-700 px-6 py-2 rounded-xl hover:bg-gray-300 transition-colors"
                    disabled={savingProfile}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
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