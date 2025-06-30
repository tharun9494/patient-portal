import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { User, MapPin, Hash, Calendar, FileText, Heart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase/config';
import LoadingSpinner from '../components/LoadingSpinner';

interface ProfileFormData {
  address: string;
  pincode: string;
  gender: string;
  age: number;
  medicalHistory: string;
}

const CompleteProfile: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { currentUser, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ProfileFormData>();

  const onSubmit = async (data: ProfileFormData) => {
    if (!currentUser) return;

    setLoading(true);
    try {
      // Get user's basic info from users collection first
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));

      let userBasicInfo = {};
      if (userDoc.exists()) {
        userBasicInfo = userDoc.data();
      }

      // Create complete patient profile with patient ID
      await setDoc(doc(db, 'patients', currentUser.uid), {
        uid: currentUser.uid,
        ...userBasicInfo, // This includes the patientId
        address: data.address,
        pincode: data.pincode,
        gender: data.gender,
        age: data.age,
        medicalHistory: data.medicalHistory,
        isProfileComplete: true,
        createdAt: userBasicInfo.createdAt || new Date(),
        updatedAt: new Date()
      });

      // Update user's profile completion status
      await setDoc(doc(db, 'users', currentUser.uid), {
        ...userBasicInfo,
        isProfileComplete: true,
        updatedAt: new Date()
      }, { merge: true });

      await refreshProfile();
      toast.success('Profile completed successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Profile completion error:', error);
      toast.error(error.message || 'Failed to complete profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pastel-lightBlue via-white to-pastel-skyBlue py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-block bg-gradient-to-r from-primary-500 to-accent-500 p-3 rounded-2xl mb-4 shadow-glow-primary">
            <User className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Complete Your Profile</h2>
          <p className="mt-2 text-gray-600">Help us provide you with personalized healthcare</p>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-large p-8 animate-slide-up">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <textarea
                    {...register('address', { required: 'Address is required' })}
                    id="address"
                    rows={3}
                    className="pl-10 w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your complete address"
                  />
                </div>
                {errors.address && (
                  <p className="mt-1 text-sm text-error-600">{errors.address.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-2">
                  Pincode
                </label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    {...register('pincode', { 
                      required: 'Pincode is required',
                      pattern: {
                        value: /^[0-9]{6}$/,
                        message: 'Please enter a valid 6-digit pincode'
                      }
                    })}
                    type="text"
                    id="pincode"
                    className="pl-10 w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter pincode"
                    maxLength={6}
                  />
                </div>
                {errors.pincode && (
                  <p className="mt-1 text-sm text-error-600">{errors.pincode.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  {...register('gender', { required: 'Please select your gender' })}
                  id="gender"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
                {errors.gender && (
                  <p className="mt-1 text-sm text-error-600">{errors.gender.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                  Age
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    {...register('age', { 
                      required: 'Age is required',
                      min: { value: 1, message: 'Age must be greater than 0' },
                      max: { value: 120, message: 'Age must be less than 120' }
                    })}
                    type="number"
                    id="age"
                    className="pl-10 w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your age"
                    min="1"
                    max="120"
                  />
                </div>
                {errors.age && (
                  <p className="mt-1 text-sm text-error-600">{errors.age.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="medicalHistory" className="block text-sm font-medium text-gray-700 mb-2">
                Medical History
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <textarea
                  {...register('medicalHistory')}
                  id="medicalHistory"
                  rows={4}
                  className="pl-10 w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  placeholder="Please describe any relevant medical history, allergies, current medications, or health conditions..."
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">This information helps doctors provide better care</p>
            </div>

            <div className="bg-primary-50 p-6 rounded-xl border border-primary-200">
              <div className="flex items-center space-x-3 mb-3">
                <Heart className="h-6 w-6 text-primary-600" />
                <h4 className="font-semibold text-primary-900">Privacy & Security</h4>
              </div>
              <p className="text-sm text-primary-700 leading-relaxed">
                Your medical information is encrypted and securely stored. We follow strict HIPAA guidelines 
                to protect your health data and will only share it with healthcare providers involved in your care.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary-500 to-accent-500 text-white py-4 px-6 rounded-xl font-semibold hover:shadow-glow-primary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
            >
              {loading ? <LoadingSpinner size="sm" /> : 'Complete Profile & Continue'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfile;