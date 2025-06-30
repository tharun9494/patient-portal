// Utility functions for patient ID generation and validation

/**
 * Generates a unique patient ID based on the patient's name
 * Format: HP + Initials + Timestamp + Random Number
 * Example: HPJS123456789 (HP + John Smith + timestamp + random)
 */
export const generatePatientId = (fullName: string): string => {
  const nameParts = fullName.trim().split(' ').filter(part => part.length > 0);
  const initials = nameParts.map(part => part.charAt(0).toUpperCase()).join('');
  const timestamp = Date.now().toString().slice(-6);
  const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `HP${initials}${timestamp}${randomNum}`;
};

/**
 * Validates if a patient ID follows the correct format
 */
export const validatePatientId = (patientId: string): boolean => {
  const pattern = /^HP[A-Z]{1,4}\d{9}$/;
  return pattern.test(patientId);
};

/**
 * Extracts initials from a patient ID
 */
export const getInitialsFromPatientId = (patientId: string): string => {
  if (!validatePatientId(patientId)) return '';
  return patientId.substring(2, patientId.length - 9);
};

/**
 * Formats a patient ID for display (adds spaces for readability)
 */
export const formatPatientId = (patientId: string): string => {
  if (!validatePatientId(patientId)) return patientId;
  const prefix = patientId.substring(0, 2); // HP
  const initials = patientId.substring(2, patientId.length - 9);
  const numbers = patientId.substring(patientId.length - 9);
  return `${prefix} ${initials} ${numbers.substring(0, 3)} ${numbers.substring(3, 6)} ${numbers.substring(6)}`;
};

/**
 * Creates a patient profile object with all required fields
 */
export const createPatientProfile = (userData: {
  uid: string;
  fullName: string;
  email: string;
  phoneNumber: string;
}) => {
  const patientId = generatePatientId(userData.fullName);
  
  return {
    uid: userData.uid,
    patientId: patientId,
    fullName: userData.fullName,
    email: userData.email,
    phoneNumber: userData.phoneNumber,
    isProfileComplete: false,
    appointments: [],
    createdAt: new Date(),
    updatedAt: new Date()
  };
}; 