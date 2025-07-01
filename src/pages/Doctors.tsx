import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { User, Star, MapPin, Phone, Mail, Calendar, Clock, Building2, GraduationCap, Award, ArrowLeft, CalendarPlus, X } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { useNavigate } from 'react-router-dom';

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  hospitalName: string;
  experience: number;
  education: string;
  phone: string;
  email: string;
  image?: string;
  rating?: number;
  totalReviews?: number;
  about?: string;
  languages?: string[];
  certifications?: string[];
  consultationFee?: number;
  availableDays?: string[];
  availableHours?: string;
  city: string;
  availableSlots?: string[];
  profileImage?: string;
  photoURL?: string;
}

const Doctors: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedHospital, setSelectedHospital] = useState('all');
  const [selectedExperience, setSelectedExperience] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch hospitals first to get hospital names
      const hospitalsRef = collection(db, 'hospitals');
      const hospitalsSnapshot = await getDocs(hospitalsRef);
      const hospitalsMap = new Map();
      hospitalsSnapshot.forEach((doc) => {
        hospitalsMap.set(doc.id, { id: doc.id, ...doc.data() });
      });
      
      // Fetch doctors
      const doctorsRef = collection(db, 'doctors');
      const q = query(doctorsRef, orderBy('name'));
      const querySnapshot = await getDocs(q);
      
      const doctorsData: Doctor[] = [];
      querySnapshot.forEach((doc) => {
        const doctorData = {
          id: doc.id,
          ...doc.data()
        } as any;
        
        // Get hospital name from hospitalId
        const hospital = hospitalsMap.get(doctorData.hospitalId);
        if (hospital) {
          doctorData.hospitalName = hospital.name;
        }
        
        // Prefer city from doctorData.address.city if available
        if (doctorData.address && doctorData.address.city) {
          doctorData.city = doctorData.address.city;
        } else if (hospital && hospital.city) {
          doctorData.city = hospital.city;
        } else {
          doctorData.city = 'Unknown City';
        }
        
        // Set default values for missing fields
        if (!doctorData.education && doctorData.qualifications) {
          doctorData.education = doctorData.qualifications.join(', ');
        }
        if (!doctorData.phone) {
          doctorData.phone = '+91 98765 43210';
        }
        if (!doctorData.email) {
          doctorData.email = `${doctorData.name.toLowerCase().replace(/\s+/g, '.')}@hospital.com`;
        }
        
        doctorsData.push(doctorData as Doctor);
        console.log('Doctor data:', doctorData); // Debug log
        console.log('Doctor city field:', doctorData.city); // Debug city field specifically
      });
      
      setDoctors(doctorsData);
      console.log('All doctors:', doctorsData); // Debug log
      console.log('Specializations found:', Array.from(new Set(doctorsData.map(d => d.specialization).filter(Boolean)))); // Debug log
      console.log('Cities found:', Array.from(new Set(doctorsData.map(d => d.city).filter(Boolean)))); // Debug log
      console.log('Hospitals found:', Array.from(new Set(doctorsData.map(d => d.hospitalName).filter(Boolean)))); // Debug log
      
      // Debug filter options
      const debugSpecializations = Array.from(new Set(doctorsData.map(d => d.specialization).filter(Boolean)));
      const debugHospitals = Array.from(new Set(doctorsData.map(d => d.hospitalName).filter(Boolean)));
      const debugCities = Array.from(new Set(doctorsData.map(d => d.city).filter(Boolean)));
      
      console.log('Filter options - Specializations:', debugSpecializations);
      console.log('Filter options - Hospitals:', debugHospitals);
      console.log('Filter options - Cities:', debugCities);
    } catch (err) {
      console.error('Error fetching doctors:', err);
      setError('Failed to load doctors. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.hospitalName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSpecialty = selectedSpecialty === 'all' || doctor.specialization === selectedSpecialty;
    const matchesLocation = selectedLocation === 'all' || doctor.city === selectedLocation;
    const matchesHospital = selectedHospital === 'all' || doctor.hospitalName === selectedHospital;
    
    // Experience filter logic
    let matchesExperience = true;
    if (selectedExperience !== 'all') {
      const experience = doctor.experience || 0;
      switch (selectedExperience) {
        case '0-5':
          matchesExperience = experience >= 0 && experience <= 5;
          break;
        case '5-10':
          matchesExperience = experience > 5 && experience <= 10;
          break;
        case '10-15':
          matchesExperience = experience > 10 && experience <= 15;
          break;
        case '15+':
          matchesExperience = experience > 15;
          break;
      }
    }
    
    return matchesSearch && matchesSpecialty && matchesLocation && matchesHospital && matchesExperience;
  });

  const specialties = ['all', ...Array.from(new Set(doctors.map(d => d.specialization).filter(Boolean)))];
  
  // Use city for locations instead of extracting from hospital name
  const locations = ['all', ...Array.from(new Set(doctors.map(d => d.city).filter(Boolean)))];
  
  const hospitals = ['all', ...Array.from(new Set(doctors.map(d => d.hospitalName).filter(Boolean)))];
  const experienceRanges = ['all', '0-5', '5-10', '10-15', '15+'];

  const DoctorCard: React.FC<{ doctor: Doctor }> = ({ doctor }) => (
    <div 
      className="bg-white rounded-2xl shadow-soft border border-gray-100 p-6 hover:shadow-large transition-all duration-300 cursor-pointer transform hover:scale-105"
      onClick={() => setSelectedDoctor(doctor)}
    >
      <div className="flex items-start space-x-4">
        <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center flex-shrink-0">
          {doctor.profileImage || doctor.photoURL ? (
            <img
              src={doctor.profileImage || doctor.photoURL}
              alt={doctor.name}
              className="w-full h-full rounded-xl object-cover"
            />
          ) : (
            <User className="h-8 w-8 text-white" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{doctor.name}</h3>
          <p className="text-primary-600 font-medium mb-2">{doctor.specialization}</p>
          
          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
            <div className="flex items-center space-x-1">
              <Building2 className="h-4 w-4" />
              <span>{doctor.hospitalName}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{doctor.experience} years</span>
            </div>
          </div>
          
          {doctor.rating && (
            <div className="flex items-center space-x-2 mb-3">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4 w-4 ${i < Math.floor(doctor.rating!) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {doctor.rating.toFixed(1)} ({doctor.totalReviews || 0} reviews)
              </span>
            </div>
          )}
          
          {doctor.consultationFee && (
            <div className="text-sm text-gray-600">
              Consultation Fee: <span className="font-semibold text-primary-600">₹{doctor.consultationFee}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const DoctorProfile: React.FC<{ doctor: Doctor }> = ({ doctor }) => (
    <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-8">
      <button
        onClick={() => setSelectedDoctor(null)}
        className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 mb-6 transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back to Doctors</span>
      </button>
      <div className="grid md:grid-cols-3 gap-8">
        {/* Doctor Info */}
        <div className="md:col-span-1">
          <div className="text-center">
            <div className="w-32 h-32 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              {doctor.profileImage || doctor.photoURL ? (
                <img
                  src={doctor.profileImage || doctor.photoURL}
                  alt={doctor.name}
                  className="w-full h-full rounded-2xl object-cover"
                />
              ) : (
                <User className="h-16 w-16 text-white" />
              )}
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{doctor.name}</h2>
            <p className="text-primary-600 font-semibold text-lg mb-4">{doctor.specialization}</p>
            
            {doctor.rating && (
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-5 w-5 ${i < Math.floor(doctor.rating!) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <span className="text-gray-600">
                  {doctor.rating.toFixed(1)} ({doctor.totalReviews || 0} reviews)
                </span>
              </div>
            )}
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-600">
                <Building2 className="h-5 w-5" />
                <span>{doctor.hospitalName}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <Calendar className="h-5 w-5" />
                <span>{doctor.experience} years of experience</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <Phone className="h-5 w-5" />
                <span>{doctor.phone}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <Mail className="h-5 w-5" />
                <span>{doctor.email}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Doctor Details */}
        <div className="md:col-span-2 space-y-6">
          {/* Available Slots at the top */}
          {doctor.availableSlots && doctor.availableSlots.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-primary-700 mb-3">Available Slots</h3>
              <div className="flex flex-wrap gap-2">
                {doctor.availableSlots.map((slot, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleBookAppointment(slot)}
                    className="bg-primary-500 text-white px-4 py-2 rounded-full text-sm hover:bg-primary-600 transition"
                  >
                    {slot}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">Click a slot to book instantly.</p>
            </div>
          )}
          
          {doctor.about && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">About</h3>
              <p className="text-gray-600 leading-relaxed">{doctor.about}</p>
            </div>
          )}
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                <GraduationCap className="h-6 w-6 text-primary-600" />
                <span>Education</span>
              </h3>
              <p className="text-gray-600">{doctor.education}</p>
            </div>
            
            {doctor.languages && doctor.languages.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Languages</h3>
                <div className="flex flex-wrap gap-2">
                  {doctor.languages.map((language, index) => (
                    <span key={index} className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm">
                      {language}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {doctor.certifications && doctor.certifications.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                <Award className="h-6 w-6 text-primary-600" />
                <span>Certifications</span>
              </h3>
              <div className="space-y-2">
                {doctor.certifications.map((cert, index) => (
                  <div key={index} className="flex items-center space-x-2 text-gray-600">
                    <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                    <span>{cert}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {doctor.consultationFee && (
            <div className="bg-gradient-to-r from-primary-50 to-secondary-50 p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Consultation Fee</h3>
              <div className="text-3xl font-bold text-primary-600">₹{doctor.consultationFee}</div>
              <p className="text-gray-600 mt-2">Per consultation</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const handleBookAppointment = async (slot: string) => {
    if (!selectedDoctor) return;
    try {
      await addDoc(collection(db, 'appointments'), {
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        doctorSpecialization: selectedDoctor.specialization,
        hospitalId: selectedDoctor.hospitalName,
        slot,
        createdAt: new Date(),
        status: 'scheduled',
      });
      alert('Appointment booked successfully!');
      setSelectedDoctor(null); // Go back to doctor list
    } catch (error) {
      alert('Failed to book appointment. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LoadingSpinner text="Loading doctors..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Doctors</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={fetchDoctors}
              className="bg-primary-500 text-white px-6 py-3 rounded-xl hover:bg-primary-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (selectedDoctor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <DoctorProfile doctor={selectedDoctor} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Doctors</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Meet our experienced healthcare professionals dedicated to providing you with the best medical care
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-8 mb-8">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Find Your Perfect Doctor</h3>
            <p className="text-gray-600">Search and filter through our network of healthcare professionals</p>
          </div>
          
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search doctors by name, specialty, or hospital..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg placeholder-gray-400"
              />
            </div>
          </div>

          {/* Filter Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Specialty Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 flex items-center space-x-2">
                <GraduationCap className="h-4 w-4 text-primary-600" />
                <span>Specialty</span>
              </label>
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-700"
              >
                {specialties.map((specialty) => (
                  <option key={specialty} value={specialty}>
                    {specialty === 'all' ? 'All Specialties' : specialty}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-primary-600" />
                <span>City</span>
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-700"
              >
                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location === 'all' ? 'All Cities' : location}
                  </option>
                ))}
              </select>
              {/* Debug: Show available cities */}
              <div className="text-xs text-gray-500 mt-1">
                Available cities: {locations.filter(l => l !== 'all').join(', ')}
              </div>
            </div>

            {/* Hospital Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 flex items-center space-x-2">
                <Building2 className="h-4 w-4 text-primary-600" />
                <span>Hospital</span>
              </label>
              <select
                value={selectedHospital}
                onChange={(e) => setSelectedHospital(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-700"
              >
                {hospitals.map((hospital) => (
                  <option key={hospital} value={hospital}>
                    {hospital === 'all' ? 'All Hospitals' : hospital}
                  </option>
                ))}
              </select>
            </div>

            {/* Experience Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-primary-600" />
                <span>Experience</span>
              </label>
              <select
                value={selectedExperience}
                onChange={(e) => setSelectedExperience(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-700"
              >
                {experienceRanges.map((range) => (
                  <option key={range} value={range}>
                    {range === 'all' ? 'All Experience' : `${range} years`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Clear Filters Button */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Active filters:</span>
              <span className="text-sm font-medium text-primary-600">
                {[searchTerm, selectedSpecialty, selectedLocation, selectedHospital, selectedExperience].filter(f => f !== 'all' && f !== '').length}
              </span>
            </div>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedSpecialty('all');
                setSelectedLocation('all');
                setSelectedHospital('all');
                setSelectedExperience('all');
              }}
              className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
            >
              <X className="h-4 w-4" />
              <span>Clear All</span>
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {filteredDoctors.length} Doctor{filteredDoctors.length !== 1 ? 's' : ''} Found
            </h3>
            <div className="text-sm text-gray-500">
              {doctors.length} total doctors in our network
            </div>
          </div>
          
          {/* Active Filters Display */}
          {(searchTerm || selectedSpecialty !== 'all' || selectedLocation !== 'all' || selectedHospital !== 'all' || selectedExperience !== 'all') && (
            <div className="bg-gradient-to-r from-primary-50 to-secondary-50 p-4 rounded-xl border border-primary-100">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                <span className="text-sm font-semibold text-primary-700">Active Filters</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {searchTerm && (
                  <span className="bg-white text-primary-700 px-3 py-1 rounded-full text-sm font-medium border border-primary-200 flex items-center space-x-1">
                    <User className="h-3 w-3" />
                    <span>"{searchTerm}"</span>
                  </span>
                )}
                {selectedSpecialty !== 'all' && (
                  <span className="bg-white text-primary-700 px-3 py-1 rounded-full text-sm font-medium border border-primary-200 flex items-center space-x-1">
                    <GraduationCap className="h-3 w-3" />
                    <span>{selectedSpecialty}</span>
                  </span>
                )}
                {selectedLocation !== 'all' && (
                  <span className="bg-white text-primary-700 px-3 py-1 rounded-full text-sm font-medium border border-primary-200 flex items-center space-x-1">
                    <MapPin className="h-3 w-3" />
                    <span>{selectedLocation}</span>
                  </span>
                )}
                {selectedHospital !== 'all' && (
                  <span className="bg-white text-primary-700 px-3 py-1 rounded-full text-sm font-medium border border-primary-200 flex items-center space-x-1">
                    <Building2 className="h-3 w-3" />
                    <span>{selectedHospital}</span>
                  </span>
                )}
                {selectedExperience !== 'all' && (
                  <span className="bg-white text-primary-700 px-3 py-1 rounded-full text-sm font-medium border border-primary-200 flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>{selectedExperience} years</span>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Doctors Grid */}
        {filteredDoctors.length === 0 ? (
          <div className="text-center py-12">
            <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No doctors found</h3>
            <p className="text-gray-600">
              Try adjusting your search criteria or filters.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Doctors; 