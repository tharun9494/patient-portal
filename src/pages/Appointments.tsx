import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, query, where, doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { 
  MapPin, 
  Building2, 
  Stethoscope, 
  UserCheck, 
  Calendar, 
  Clock,
  ChevronRight,
  ChevronLeft,
  Check
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase/config';
import { Hospital, Doctor, TimeSlot } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import { formatPatientId } from '../utils/patientUtils';

interface AppointmentFormData {
  location: string;
  hospitalId: string;
  specialty: string;
  doctorId: string;
  date: string;
  time: string;
  type: 'in-person' | 'online';
}

const Appointments: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [admins, setAdmins] = useState<any[]>([]);
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [doctorTimeSlots, setDoctorTimeSlots] = useState<any[]>([]);
  const [stepError, setStepError] = useState<string>('');
  const [patientData, setPatientData] = useState<any>(null);
  
  const { currentUser } = useAuth();
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<AppointmentFormData>({
    defaultValues: {
      type: 'in-person'
    }
  });
  const navigate = useNavigate();

  const watchedLocation = watch('location');
  const watchedHospitalId = watch('hospitalId');
  const watchedSpecialty = watch('specialty');
  const watchedDoctorId = watch('doctorId');

  const steps = [
    { number: 1, title: 'Location', icon: MapPin },
    { number: 2, title: 'Hospital', icon: Building2 },
    { number: 3, title: 'Specialty', icon: Stethoscope },
    { number: 4, title: 'Doctor', icon: UserCheck },
    { number: 5, title: 'Date & Time', icon: Calendar },
    { number: 6, title: 'Confirm', icon: Check }
  ];

  const specialties = [
    'General Medicine', 'Cardiology', 'Dermatology', 'Dentistry', 'Orthopedics',
    'Gynecology', 'Pediatrics', 'Neurology', 'Psychiatry', 'Ophthalmology'
  ];

  // Fetch locations from admins (unique addresses only)
  const fetchLocations = async () => {
    try {
      const adminsSnapshot = await getDocs(collection(db, 'admins'));
      const addressSet = new Set<string>();
      const adminsList: any[] = [];
      adminsSnapshot.docs.forEach(doc => {
        const adminData = doc.data();
        adminsList.push(adminData);
        if (adminData.address) {
          addressSet.add(adminData.address);
        }
      });
      setLocations(Array.from(addressSet));
      setAdmins(adminsList);
    } catch (error) {
      console.error('Error fetching locations from admins:', error);
      setLocations([]);
      setAdmins([]);
    }
  };

  // Fetch hospitals by address (location)
  const fetchHospitals = async (address: string) => {
    try {
      const q = query(collection(db, 'hospitals'), where('address', '==', address));
      const querySnapshot = await getDocs(q);
      const hospitalList: Hospital[] = [];

      querySnapshot.docs.forEach(doc => {
        hospitalList.push({
          id: doc.id,
          ...doc.data()
        } as Hospital);
      });

      setHospitals(hospitalList);
    } catch (error) {
      console.error('Error fetching hospitals:', error);
      setHospitals([]);
    }
  };

  // Fetch doctors by hospital and specialty
  const fetchDoctors = async (hospitalName: string, specialty: string) => {
    try {
      const q = query(
        collection(db, 'doctors'), 
        where('hospitalName', '==', hospitalName),
        where('specialization', '==', specialty)
      );
      const querySnapshot = await getDocs(q);
      const doctorList: Doctor[] = [];

      querySnapshot.docs.forEach(doc => {
        doctorList.push({
          id: doc.id,
          ...doc.data()
        } as Doctor);
      });

      setDoctors(doctorList);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      // Fallback to mock data if Firestore fails
      const mockDoctors: Doctor[] = [
        {
          id: 'd1',
          name: 'Dr. Sarah Johnson',
          specialty: specialty,
          hospitalId: hospitalName,
          experience: 10,
          qualifications: ['MBBS', 'MD ' + specialty],
          consultationFee: 800,
          availableSlots: [],
          profileImage: '/default-doctor-avatar.png',
          photoURL: '/default-doctor-avatar.png'
        },
        {
          id: 'd2',
          name: 'Dr. Michael Chen',
          specialty: specialty,
          hospitalId: hospitalName,
          experience: 8,
          qualifications: ['MBBS', 'MD ' + specialty],
          consultationFee: 600,
          availableSlots: [],
          profileImage: '/default-doctor-avatar.png',
          photoURL: '/default-doctor-avatar.png'
        }
      ];
      setDoctors(mockDoctors);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  useEffect(() => {
    if (watchedLocation) {
      fetchHospitals(watchedLocation);
    }
  }, [watchedLocation]);

  useEffect(() => {
    if (watchedHospitalId && watchedSpecialty) {
      fetchDoctors(watchedHospitalId, watchedSpecialty);
    }
  }, [watchedHospitalId, watchedSpecialty]);

  useEffect(() => {
    const fetchSpecializations = async () => {
      if (watchedHospitalId) {
        const q = query(collection(db, 'doctors'), where('hospitalName', '==', watchedHospitalId));
        const querySnapshot = await getDocs(q);
        const specSet = new Set<string>();
        querySnapshot.docs.forEach(doc => {
          const docData = doc.data();
          if (docData.specialization) {
            specSet.add(docData.specialization);
          }
        });
        setSpecializations(Array.from(specSet));
      } else {
        setSpecializations([]);
      }
    };
    fetchSpecializations();
  }, [watchedHospitalId]);

  useEffect(() => {
    const fetchDoctors = async () => {
      if (watchedHospitalId && watchedSpecialty) {
        const q = query(
          collection(db, 'doctors'),
          where('hospitalName', '==', watchedHospitalId),
          where('specialization', '==', watchedSpecialty)
        );
        const querySnapshot = await getDocs(q);
        const doctorList: Doctor[] = [];
        querySnapshot.docs.forEach(doc => {
          doctorList.push({ id: doc.id, ...doc.data() } as Doctor);
        });
        setFilteredDoctors(doctorList);
      } else {
        setFilteredDoctors([]);
      }
    };
    fetchDoctors();
  }, [watchedHospitalId, watchedSpecialty]);

  // Filter hospitals by address (not city)
  const filteredHospitals = hospitals.filter(h => h.address === watchedLocation);

  // Generate available time slots
  const generateTimeSlots = () => {
    const slots: TimeSlot[] = [];
    const today = new Date();
    
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const timeSlots = [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
      ];
      
      timeSlots.forEach(time => {
        slots.push({
          date: date.toISOString().split('T')[0],
          time: time,
          available: Math.random() > 0.3 // 70% chance of being available
        });
      });
    }
    
    setAvailableSlots(slots);
  };

  useEffect(() => {
    if (watchedDoctorId) {
      const doctor = doctors.find(d => d.id === watchedDoctorId);
      console.log('Selected doctor:', doctor);
      if (doctor && doctor.timeSlots) {
        setDoctorTimeSlots(doctor.timeSlots);
      } else {
        setDoctorTimeSlots([]);
      }
    } else {
      setDoctorTimeSlots([]);
    }
  }, [watchedDoctorId, doctors]);

  useEffect(() => {
    if (watchedHospitalId) {
      const hospital = hospitals.find(h => h.id === watchedHospitalId);
      setSelectedHospital(hospital || null);
    }
  }, [watchedHospitalId, hospitals]);

  // Fetch patient data for display
  useEffect(() => {
    const fetchPatientData = async () => {
      if (currentUser) {
        try {
          const patientRef = doc(db, 'patients', currentUser.uid);
          const patientSnap = await getDoc(patientRef);
          if (patientSnap.exists()) {
            setPatientData(patientSnap.data());
          }
        } catch (error) {
          console.error('Error fetching patient data:', error);
        }
      }
    };
    fetchPatientData();
  }, [currentUser]);

  // Refresh time slots when consultation type changes
  useEffect(() => {
    if (watchedDoctorId && doctorTimeSlots.length > 0) {
      // Force re-render of time slots when type changes
      const currentSlots = doctorTimeSlots;
      setDoctorTimeSlots([...currentSlots]);
    }
  }, [watch('type')]);

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 6));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const onSubmit = async (data: AppointmentFormData) => {
    console.log('Form data received:', data);
    console.log('Current user:', currentUser);
    console.log('Selected hospital:', selectedHospital);
    console.log('Selected doctor:', selectedDoctor);
    
    if (!currentUser) {
      toast.error('Please log in to book an appointment.');
      return;
    }

    // Validate required fields using form data 
    if (!data.location || !data.hospitalId || !data.specialty || !data.doctorId || !data.date || !data.time) {
      console.log('Missing fields:', {
        location: data.location,
        hospitalId: data.hospitalId,
        specialty: data.specialty,
        doctorId: data.doctorId,
        date: data.date,
        time: data.time
      });
      toast.error('Please complete all steps before booking.');
      return;
    }

    // Require meetingLink for online appointments
    if (data.type === 'online') {
      const selectedSlot = doctorTimeSlots.find(slot => slot.date === data.date && slot.startTime === data.time);
      if (!selectedSlot || !selectedSlot.meetingLink) {
        toast.error('No Google Meet link found for the selected slot. Please contact the hospital or try another slot.');
        return;
      }
    }

    // Get the selected doctor details
    const selectedDoctorObj = doctors.find(d => d.id === data.doctorId);
    if (!selectedDoctorObj) {
      toast.error('Doctor not found. Please try again.');
      return;
    }

    // Validate doctor data
    if (!selectedDoctorObj.name || !selectedDoctorObj.consultationFee) {
      toast.error('Doctor data is incomplete. Please try again.');
      return;
    }

    // Payment step: open Razorpay and only proceed if payment is successful
    try {
      setLoading(true);
      await handleRazorpayPayment(
        selectedDoctorObj.consultationFee,
        patientData.fullName || currentUser.displayName || currentUser.email || 'Unknown',
        patientData.email || currentUser.email || '',
        patientData.phoneNumber || ''
      );
    } catch (paymentError) {
      setLoading(false);
      toast.error('Payment was not completed. Please try again.');
      return;
    }

    setLoading(true);
    try {
      // Fetch patient profile to get the real patient ID
      const patientRef = doc(db, 'patients', currentUser.uid);
      const patientSnap = await getDoc(patientRef);
      
      if (!patientSnap.exists()) {
        toast.error('Patient profile not found. Please complete your profile first.');
        navigate('/dashboard');
        return;
      }

      const patientData = patientSnap.data();
      
      // Check if patient profile is complete
      if (!patientData.isProfileComplete) {
        toast.error('Please complete your profile before booking appointments. Go to your dashboard and update your profile.');
        navigate('/dashboard');
        return;
      }
      
      let realPatientId = patientData.patientId;
      
      if (!realPatientId) {
        console.log('Patient data:', patientData);
        console.log('No patient ID found, attempting to generate one...');
        
        // Try to generate a patient ID if it's missing
        try {
          const { generatePatientId } = await import('../utils/patientUtils');
          const newPatientId = generatePatientId(patientData.fullName || currentUser.email || 'Unknown');
          
          // Update the patient profile with the new patient ID
          await updateDoc(patientRef, {
            patientId: newPatientId,
            updatedAt: new Date()
          });
          
          console.log('Generated new patient ID:', newPatientId);
          
          // Use the newly generated patient ID
          realPatientId = newPatientId;
          
          toast.success(`Patient ID generated: ${formatPatientId(newPatientId)}`);
          
          // Continue with the booking process using the new patient ID
          console.log('Using generated patient ID:', realPatientId);
        } catch (generateError) {
          console.error('Error generating patient ID:', generateError);
          toast.error('Unable to generate patient ID. Please complete your profile first.');
          navigate('/dashboard');
          return;
        }
      }

      console.log('Real patient ID:', realPatientId);

      // Validate that the selected time slot is still available
      const selectedSlot = doctorTimeSlots.find(slot => 
        slot.date === data.date && slot.startTime === data.time
      );
      
      if (!selectedSlot) {
        toast.error('Selected time slot not found. Please choose another slot.');
        return;
      }
      
      const currentBookedPatients = selectedSlot.bookedPatients || 0;
      const maxPatients = selectedSlot.maxPatients || 1;
      
      if (currentBookedPatients >= maxPatients) {
        toast.error('This time slot is no longer available. Please choose another slot.');
        return;
      }

      // Get the selected hospital details
      const selectedAdmin = admins.find(a => a.hospitalName === data.hospitalId);

      // For online appointments, fetch meetingLink from selected slot
      let meetingLink = null;
      if (data.type === 'online') {
        meetingLink = selectedSlot.meetingLink;
      }

      // Create appointment data object with real patient ID
      const appointmentData = {
        patientId: realPatientId, // Use the real patient ID from profile
        patientUid: currentUser.uid, // Also store the Firebase UID for reference
        patientName: patientData.fullName || currentUser.displayName || currentUser.email || 'Unknown',
        patientPhone: patientData.phoneNumber || '',
        patientEmail: patientData.email || currentUser.email || '',
        doctorId: data.doctorId,
        doctorName: selectedDoctorObj.name,
        doctorSpecialty: selectedDoctorObj.specialization || selectedDoctorObj.specialty,
        hospitalId: data.hospitalId,
        hospitalName: selectedAdmin?.hospitalName || data.hospitalId,
        hospitalAddress: data.location,
        date: data.date,
        time: data.time,
        type: data.type || 'in-person',
        status: 'scheduled',
        consultationFee: selectedDoctorObj.consultationFee,
        notes: '',
        meetingLink: data.type === 'online' ? meetingLink : null,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      console.log('Appointment data to be saved:', appointmentData);
      console.log('Current user UID:', currentUser.uid);

      // 1. Add appointment to Firestore
      console.log('Attempting to write to appointments collection...');
      const appointmentRef = await addDoc(collection(db, 'appointments'), appointmentData);
      
      console.log('Appointment created with ID:', appointmentRef.id);

      // 2. Update doctor's timeSlots to mark the slot as booked
      console.log('Attempting to update doctor timeSlots...');
      const doctorRef = doc(db, 'doctors', data.doctorId);
      const doctorSnap = await getDoc(doctorRef);
      
      if (doctorSnap.exists()) {
        const doctorData = doctorSnap.data();
        const updatedTimeSlots = (doctorData.timeSlots || []).map((slot: any) => {
          if (slot.date === data.date && slot.startTime === data.time) {
            const currentBookedPatients = slot.bookedPatients || 0;
            const maxPatients = slot.maxPatients || 1;
            
            // Check if slot is still available
            if (currentBookedPatients >= maxPatients) {
              console.error('Slot is already full');
              throw new Error('This time slot is no longer available');
            }
            
            return { 
              ...slot, 
              bookedPatients: currentBookedPatients + 1,
              appointmentId: appointmentRef.id,
              patientId: realPatientId,
              patientUid: currentUser.uid,
              // Only mark as unavailable if it reaches maxPatients
              isAvailable: (currentBookedPatients + 1) < maxPatients
            };
          }
          return slot;
        });
        
        await updateDoc(doctorRef, { 
          timeSlots: updatedTimeSlots,
          updatedAt: new Date()
        });
      }

      // 3. Add appointment reference to patient's appointments array
      try {
        await updateDoc(patientRef, {
          appointments: arrayUnion(appointmentRef.id),
          updatedAt: new Date()
        });
      } catch (error) {
        console.log('Error updating patient appointments array:', error);
      }

      toast.success(`Appointment booked successfully! Your Patient ID: ${formatPatientId(realPatientId)}`, {
        duration: 6000,
        style: {
          background: '#10B981',
          color: '#fff',
          fontWeight: 'bold',
          padding: '16px',
          borderRadius: '12px',
        },
      });
      
      // Reset form and redirect
      setTimeout(() => {
        setCurrentStep(1);
        setValue('location', '');
        setValue('hospitalId', '');
        setValue('specialty', '');
        setValue('doctorId', '');
        setValue('date', '');
        setValue('time', '');
        setValue('type', 'in-person');
        // Clear time slots to force refresh
        setDoctorTimeSlots([]);
        navigate('/dashboard');
      }, 1500);

    } catch (error: any) {
      console.error('Booking error:', error);
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      
      // More specific error messages based on error type
      if (error.code === 'permission-denied') {
        toast.error('Permission denied. Please check if you are logged in and try again.');
      } else if (error.code === 'unavailable') {
        toast.error('Service temporarily unavailable. Please try again in a moment.');
      } else if (error.code === 'not-found') {
        toast.error('Required data not found. Please refresh and try again.');
      } else {
        toast.error(`Failed to book appointment: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };
  
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">Choose Your Location</h3>
            <div>
              <select
                className="w-full p-3 border-2 rounded-lg focus:outline-none focus:border-primary-500"
                value={watchedLocation || ''}
                onChange={e => {
                  setValue('location', e.target.value);
                  setStepError('');
                }}
              >
                <option value="" disabled>
                  -- Select a location --
                </option>
                {locations.map(address => (
                  <option key={address} value={address}>
                    {address}
                  </option>
                ))}
              </select>
              {stepError && <p className="text-red-500 text-sm mt-2">{stepError}</p>}
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  if (!watchedLocation) {
                    setStepError('Please select a location.');
                  } else {
                    setStepError('');
                    nextStep();
                  }
                }}
                disabled={!watchedLocation}
                className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        );

      case 2:
        // Filter admins by selected address
        const hospitalsForAddress = admins.filter(a => a.address === watchedLocation);

        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">Select Hospital</h3>
            {hospitalsForAddress.length === 0 ? (
              <p className="text-gray-500">No hospitals found in the selected location.</p>
            ) : (
              <div className="space-y-3">
                {hospitalsForAddress.map((admin, idx) => (
                  <button
                    key={admin.hospitalName + idx}
                    type="button"
                    onClick={() => {
                      setValue('hospitalId', admin.hospitalName);
                      setSelectedHospital({ 
                        id: admin.hospitalName, 
                        name: admin.hospitalName, 
                        address: admin.address,
                        city: admin.city || '',
                        pincode: admin.pincode || '',
                        phone: admin.phone || '',
                        specialties: []
                      });
                      setStepError('');
                      nextStep();
                    }}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                      watchedHospitalId === admin.hospitalName
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-300 hover:bg-primary-50'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <Building2 className="h-6 w-6 text-primary-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900">{admin.hospitalName}</h4>
                      </div>
                    </div>
                  </button>
                ))}
                {stepError && <p className="text-red-500 text-sm mt-2">{stepError}</p>}
              </div>
            )}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  if (!watchedHospitalId) {
                    setStepError('Please select a hospital.');
                  } else {
                    setStepError('');
                    nextStep();
                  }
                }}
                disabled={!watchedHospitalId}
                className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">Choose Specialty</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {specializations.map(specialty => (
                <button
                  key={specialty}
                  type="button"
                  onClick={() => {
                    setValue('specialty', specialty);
                    setStepError('');
                    nextStep();
                  }}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    watchedSpecialty === specialty
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-primary-300 hover:bg-primary-50'
                  }`}
                >
                  <span className="text-sm font-medium text-center">{specialty}</span>
                </button>
              ))}
            </div>
            {stepError && <p className="text-red-500 text-sm mt-2">{stepError}</p>}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  if (!watchedSpecialty) {
                    setStepError('Please select a specialty.');
                  } else {
                    setStepError('');
                    nextStep();
                  }
                }}
                disabled={!watchedSpecialty}
                className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">Select Doctor</h3>
            {filteredDoctors.length === 0 ? (
              <p className="text-gray-500">No doctors found for the selected specialty.</p>
            ) : (
              <div className="space-y-3">
                {filteredDoctors.map(doctor => (
                  <button
                    key={doctor.id}
                    type="button"
                    onClick={() => {
                      setValue('doctorId', doctor.id);
                      setSelectedDoctor(doctor);
                      setStepError('');
                      nextStep();
                    }}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                      watchedDoctorId === doctor.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-300 hover:bg-primary-50'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                        {doctor.profileImage || doctor.photoURL ? (
                          <img
                            src={doctor.profileImage || doctor.photoURL}
                            alt={doctor.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <UserCheck className="h-6 w-6 text-primary-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{doctor.name}</h4>
                        <p className="text-sm text-gray-600">{doctor.specialization}</p>
                        <p className="text-sm text-gray-500">{doctor.experience} years experience</p>
                        <p className="text-sm font-medium text-primary-600">₹{doctor.consultationFee}</p>
                      </div>
                    </div>
                  </button>
                ))}
                {stepError && <p className="text-red-500 text-sm mt-2">{stepError}</p>}
              </div>
            )}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  if (!watchedDoctorId) {
                    setStepError('Please select a doctor.');
                  } else {
                    setStepError('');
                    nextStep();
                  }
                }}
                disabled={!watchedDoctorId}
                className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        );

      case 5:
        // Group available slots by date for better formatting
        const slotsByDate: { [date: string]: any[] } = {};
        const selectedType = watch('type') || 'in-person';
        
        doctorTimeSlots.filter(slot => {
          // Show slot as available if:
          // 1. Slot is marked as available AND
          // 2. Number of booked patients is less than maxPatients (or maxPatients is not set) AND
          // 3. Slot type matches the selected consultation type
          const bookedPatients = slot.bookedPatients || 0;
          const maxPatients = slot.maxPatients || 1; // Default to 1 if not set
          const slotType = slot.type || 'in-person'; // Default to in-person if not set
          
          return slot.isAvailable && 
                 bookedPatients < maxPatients && 
                 slotType === selectedType;
        }).forEach(slot => {
          if (!slotsByDate[slot.date]) slotsByDate[slot.date] = [];
          slotsByDate[slot.date].push(slot);
        });
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Select Date & Time</h3>
            
            {/* Consultation Type Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Consultation Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setValue('type', 'in-person');
                    // Clear selected date/time when type changes
                    setValue('date', '');
                    setValue('time', '');
                    setStepError('');
                  }}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    watch('type') === 'in-person'
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-primary-300 hover:bg-primary-50'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Building2 className="h-5 w-5" />
                    <span className="font-medium">In-Person Visit</span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setValue('type', 'online');
                    // Clear selected date/time when type changes
                    setValue('date', '');
                    setValue('time', '');
                    setStepError('');
                  }}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    watch('type') === 'online'
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-primary-300 hover:bg-primary-50'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5" />
                    <span className="font-medium">Online Consultation</span>
                  </div>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Available Slots
                  </label>
                  <div className="text-sm text-gray-500">
                    {selectedType === 'online' ? 'Online Consultation' : 'In-Person Visit'} • 
                    {Object.values(slotsByDate).flat().length} slot{Object.values(slotsByDate).flat().length !== 1 ? 's' : ''} available
                  </div>
                </div>
                <div className="max-h-96 overflow-y-auto space-y-3">
                  {Object.keys(slotsByDate).length === 0 ? (
                    doctorTimeSlots.length === 0 ? (
                      <LoadingSpinner text="Loading available slots..." />
                    ) : (
                      <div className="text-center py-8">
                        <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">
                          No available {selectedType === 'online' ? 'online consultation' : 'in-person'} slots found.
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          Try selecting a different consultation type or check back later.
                        </p>
                      </div>
                    )
                  ) : (
                    Object.entries(slotsByDate).map(([date, slots]) => (
                      <div key={date} className="border rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-3">
                          {new Date(date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {slots.map(slot => {
                            const bookedPatients = slot.bookedPatients || 0;
                            const maxPatients = slot.maxPatients || 1;
                            const availableSpots = maxPatients - bookedPatients;
                            
                            return (
                              <button
                                key={slot.id}
                                type="button"
                                onClick={() => {
                                  setValue('date', slot.date);
                                  setValue('time', slot.startTime);
                                  setStepError('');
                                  nextStep();
                                }}
                                className={`p-2 rounded text-sm font-medium transition-all duration-200 ${
                                  watch('date') === slot.date && watch('time') === slot.startTime
                                    ? 'bg-primary-500 text-white'
                                    : availableSpots === 1
                                    ? 'bg-warning-50 text-warning-700 hover:bg-warning-100 border border-warning-200'
                                    : 'bg-primary-50 text-primary-700 hover:bg-primary-100'
                                }`}
                              >
                                {slot.startTime} - {slot.endTime}
                                <span className="block text-xs text-gray-500">({slot.type})</span>
                                <span className={`block text-xs font-medium ${
                                  availableSpots === 1 ? 'text-warning-600' : 'text-gray-600'
                                }`}>
                                  {availableSpots === 1 ? 'Last spot!' : `${availableSpots} spot${availableSpots !== 1 ? 's' : ''} left`}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))
                  )}
                </div>
                {stepError && <p className="text-red-500 text-sm mt-2">{stepError}</p>}
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  if (!watch('date') || !watch('time')) {
                    setStepError('Please select a date and time slot.');
                  } else {
                    setStepError('');
                    nextStep();
                  }
                }}
                disabled={!watch('date') || !watch('time')}
                className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        );

      case 6:
        // Fetch hospital name from admins
        const selectedAdmin = admins.find(a => a.hospitalName === watchedHospitalId);
        // Fetch doctor details from doctors array
        const selectedDoctorObj = doctors.find(d => d.id === watchedDoctorId);
        
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Confirm Appointment</h3>
            <div className="bg-gradient-to-br from-primary-50 to-secondary-50 p-6 rounded-xl">
              <div className="space-y-4">
                {patientData && patientData.patientId && (
                  <div className="flex items-center justify-between bg-primary-100 p-3 rounded-lg">
                    <span className="text-gray-600 font-medium">Patient ID:</span>
                    <span className="font-bold text-primary-700 text-lg">
                      {formatPatientId(patientData.patientId)}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-medium">{watchedLocation}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Hospital:</span>
                  <span className="font-medium">{selectedAdmin?.hospitalName || watchedHospitalId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Doctor:</span>
                  <span className="font-medium">{selectedDoctorObj?.name || ''}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Specialty:</span>
                  <span className="font-medium">{watchedSpecialty}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">
                    {watch('date') && new Date(watch('date')).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Time:</span>
                  <span className="font-medium">{watch('time')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium capitalize">{watch('type') === 'online' ? 'Online Consultation' : 'In-Person Visit'}</span>
                </div>
                <div className="flex items-center justify-between border-t pt-4">
                  <span className="text-gray-600">Consultation Fee:</span>
                  <span className="font-bold text-lg text-primary-600">
                    ₹{selectedDoctorObj?.consultationFee || ''}
                  </span>
                </div>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50"
            >
              {loading ? <LoadingSpinner size="sm" /> : 'Confirm Booking'}
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  // Create order via backend
  const createOrder = async (amount: number) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/payment/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount })
    });
    return response.json();
  };

  // Verify payment via backend
  const verifyPayment = async (paymentData: any) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/payment/verify-payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentData)
    });
    return response.json();
  };

  // Razorpay payment handler
  const handleRazorpayPayment = async (amount: number, patientName: string, patientEmail: string, patientPhone: string): Promise<any> => {
    // 1. Create order on backend
    const orderData = await createOrder(amount);

    // 2. Load Razorpay SDK if not already loaded
    if (!(window as any).Razorpay) {
      await new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = resolve;
        document.body.appendChild(script);
      });
    }

    // 3. Open Razorpay modal
    return new Promise((resolve, reject) => {
      const options = {
        key: orderData.key_id, // or use your frontend env key
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'HealthPortal',
        description: 'Appointment Booking',
        order_id: orderData.order.id,
        handler: async (response: any) => {
          // 4. Verify payment on backend
          const verifyData = await verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature
          });
          if (verifyData.success) {
            toast.success('Payment successful!');
            resolve(response);
          } else {
            toast.error('Payment verification failed!');
            reject('Payment verification failed');
          }
        },
        prefill: {
          name: patientName,
          email: patientEmail,
          contact: patientPhone,
        },
        theme: {
          color: '#10B981',
        },
        modal: {
          ondismiss: function () {
            reject('Payment cancelled');
          }
        }
      };
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pastel-pink/10 to-pastel-blue/10 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.number
                    ? 'bg-primary-500 border-primary-500 text-white'
                    : 'border-gray-300 text-gray-400'
                }`}>
                  <step.icon className="h-5 w-5" />
                </div>
                <div className="ml-3 hidden md:block">
                  <p className={`text-sm font-medium ${
                    currentStep >= step.number ? 'text-primary-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`hidden md:block w-16 h-1 mx-4 ${
                    currentStep > step.number ? 'bg-primary-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit(onSubmit)}>
            {renderStepContent()}
            
            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center space-x-2 px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Appointments;