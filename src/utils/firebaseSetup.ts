import { collection, addDoc, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

// Sample data for hospitals
const sampleHospitals = [
  {
    name: 'Apollo Hospital',
    address: '123 MG Road',
    city: 'Mumbai',
    pincode: '400001',
    phone: '+91 22 1234 5678',
    specialties: ['General Medicine', 'Cardiology', 'Dermatology', 'Orthopedics']
  },
  {
    name: 'Fortis Hospital',
    address: '456 Bandra West',
    city: 'Mumbai',
    pincode: '400050',
    phone: '+91 22 8765 4321',
    specialties: ['Neurology', 'Psychiatry', 'Pediatrics', 'Gynecology']
  },
  {
    name: 'Max Hospital',
    address: '789 Saket',
    city: 'Delhi',
    pincode: '110017',
    phone: '+91 11 2345 6789',
    specialties: ['General Medicine', 'Cardiology', 'Dermatology', 'Dentistry']
  },
  {
    name: 'AIIMS Delhi',
    address: 'Sri Aurobindo Marg',
    city: 'Delhi',
    pincode: '110029',
    phone: '+91 11 2658 8500',
    specialties: ['General Medicine', 'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics']
  },
  {
    name: 'Manipal Hospital',
    address: '98 HAL Airport Road',
    city: 'Bangalore',
    pincode: '560017',
    phone: '+91 80 2502 4444',
    specialties: ['General Medicine', 'Cardiology', 'Dermatology', 'Ophthalmology']
  }
];

// Sample data for doctors
const sampleDoctors = [
  {
    name: 'Dr. Sarah Johnson',
    specialty: 'General Medicine',
    experience: 12,
    qualifications: ['MBBS', 'MD General Medicine'],
    consultationFee: 800,
    availableSlots: []
  },
  {
    name: 'Dr. Michael Chen',
    specialty: 'Cardiology',
    experience: 15,
    qualifications: ['MBBS', 'MD Cardiology', 'DM Cardiology'],
    consultationFee: 1200,
    availableSlots: []
  },
  {
    name: 'Dr. Priya Sharma',
    specialty: 'Dermatology',
    experience: 8,
    qualifications: ['MBBS', 'MD Dermatology'],
    consultationFee: 900,
    availableSlots: []
  },
  {
    name: 'Dr. Rajesh Kumar',
    specialty: 'Orthopedics',
    experience: 18,
    qualifications: ['MBBS', 'MS Orthopedics'],
    consultationFee: 1000,
    availableSlots: []
  },
  {
    name: 'Dr. Anjali Patel',
    specialty: 'Pediatrics',
    experience: 10,
    qualifications: ['MBBS', 'MD Pediatrics'],
    consultationFee: 700,
    availableSlots: []
  }
];

// Function to populate the database with sample data
export const populateDatabase = async () => {
  try {
    console.log('Starting to populate database...');

    // Check if data already exists
    const existingHospitals = await getDocs(collection(db, 'hospitals'));
    if (!existingHospitals.empty) {
      console.log('Database already has data. Skipping population.');
      return { success: true, message: 'Database already has data' };
    }

    // Add hospitals
    const hospitalIds: string[] = [];
    for (const hospital of sampleHospitals) {
      const docRef = await addDoc(collection(db, 'hospitals'), hospital);
      hospitalIds.push(docRef.id);
      console.log(`Added hospital: ${hospital.name}`);
    }

    // Add doctors with hospital assignments
    for (let i = 0; i < sampleDoctors.length; i++) {
      const hospitalId = hospitalIds[i % hospitalIds.length];
      const hospital = sampleHospitals[i % sampleHospitals.length];
      const doctor = { 
        ...sampleDoctors[i], 
        hospitalId: hospitalId,
        city: hospital.city // Add city from hospital
      };
      
      await addDoc(collection(db, 'doctors'), doctor);
      console.log(`Added doctor: ${doctor.name} to hospital ${doctor.hospitalId} in city ${doctor.city}`);
    }

    console.log('Database population completed successfully!');
    return { success: true, message: 'Database populated successfully' };
    
  } catch (error) {
    console.error('Error populating database:', error);
    return { success: false, message: 'Error populating database', error };
  }
};

// Function to check if database has data
export const checkDatabaseData = async () => {
  try {
    const hospitalsSnapshot = await getDocs(collection(db, 'hospitals'));
    const doctorsSnapshot = await getDocs(collection(db, 'doctors'));
    
    return {
      hasHospitals: !hospitalsSnapshot.empty,
      hasDoctors: !doctorsSnapshot.empty,
      hospitalCount: hospitalsSnapshot.size,
      doctorCount: doctorsSnapshot.size
    };
  } catch (error) {
    console.error('Error checking database data:', error);
    return {
      hasHospitals: false,
      hasDoctors: false,
      hospitalCount: 0,
      doctorCount: 0,
      error
    };
  }
};

// Function to clear and repopulate database
export const clearAndPopulateDatabase = async () => {
  try {
    console.log('Starting to clear and repopulate database...');

    // Clear existing data
    const hospitalsSnapshot = await getDocs(collection(db, 'hospitals'));
    const doctorsSnapshot = await getDocs(collection(db, 'doctors'));
    
    // Delete all hospitals
    for (const doc of hospitalsSnapshot.docs) {
      await deleteDoc(doc.ref);
    }
    
    // Delete all doctors
    for (const doc of doctorsSnapshot.docs) {
      await deleteDoc(doc.ref);
    }
    
    console.log('Database cleared successfully');
    
    // Repopulate with new structure
    return await populateDatabase();
    
  } catch (error) {
    console.error('Error clearing and repopulating database:', error);
    return { success: false, message: 'Error clearing and repopulating database', error };
  }
}; 