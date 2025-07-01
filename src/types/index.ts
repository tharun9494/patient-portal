export interface User {
  uid: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  patientId: string;
  isProfileComplete?: boolean;
}

export interface PatientProfile {
  uid: string;
  patientId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  pincode: string;
  gender: string;
  age: number;
  medicalHistory: string;
  isProfileComplete: boolean;
  createdAt: Date;
  updatedAt: Date;
  profilePicUrl?: string;
  photoURL?: string;
}

export interface Hospital {
  id: string;
  name: string;
  address: string;
  city: string;
  pincode: string;
  phone: string;
  specialties: string[];
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  specialization?: string;
  hospitalId: string;
  hospitalName?: string;
  experience: number;
  qualifications: string[];
  availableSlots: TimeSlot[];
  consultationFee: number;
  image?: string;
  timeSlots?: any[];
}

export interface TimeSlot {
  date: string;
  time: string;
  available: boolean;
}

export interface Appointment {
  id: string;
  patientId: string; // Real patient ID (e.g., HPJS123456789)
  patientUid: string; // Firebase UID
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  hospitalId: string;
  hospitalName: string;
  hospitalAddress: string;
  date: string;
  time: string;
  type: 'in-person' | 'online';
  status: 'scheduled' | 'completed' | 'cancelled';
  consultationFee: number;
  notes?: string;
  meetingLink?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BookingStep {
  step: number;
  title: string;
  description: string;
}