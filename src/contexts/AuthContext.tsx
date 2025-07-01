import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { PatientProfile } from '../types';

interface AuthContextType {
  currentUser: User | null;
  patientProfile: PatientProfile | null;
  loading: boolean;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [patientProfile, setPatientProfile] = useState<PatientProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {
    if (currentUser) {
      try {
        const profileDoc = await getDoc(doc(db, 'patients', currentUser.uid));
        if (profileDoc.exists()) {
          const profileData = profileDoc.data() as PatientProfile;
          setPatientProfile(profileData);
        } else {
          // If no patient profile exists, check users collection for basic info
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            // Create a basic profile from user data
            setPatientProfile({
              uid: currentUser.uid,
              patientId: userData.patientId || 'Not assigned',
              fullName: userData.fullName || 'Unknown',
              email: userData.email || currentUser.email || '',
              phoneNumber: userData.phoneNumber || '',
              address: '',
              pincode: '',
              gender: '',
              age: 0,
              medicalHistory: '',
              isProfileComplete: userData.isProfileComplete || false,
              createdAt: userData.createdAt || new Date(),
              updatedAt: userData.updatedAt || new Date()
            });
          } else {
            // If neither exists, create a basic profile
            setPatientProfile({
              uid: currentUser.uid,
              patientId: 'Not assigned',
              fullName: currentUser.displayName || 'Unknown',
              email: currentUser.email || '',
              phoneNumber: '',
              address: '',
              pincode: '',
              gender: '',
              age: 0,
              medicalHistory: '',
              isProfileComplete: false,
              createdAt: new Date(),
              updatedAt: new Date()
            });
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setPatientProfile(null);
      }
    }
  };

  const logout = async () => {
    await signOut(auth);
    setPatientProfile(null);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await refreshProfile();
      } else {
        setPatientProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [currentUser?.uid]); // Add dependency to re-run when user changes

  const value = {
    currentUser,
    patientProfile,
    loading,
    logout,
    refreshProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};