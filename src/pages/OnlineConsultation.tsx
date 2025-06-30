import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Video, Calendar, Clock, User, ExternalLink, Phone } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase/config';
import { Appointment } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';

const OnlineConsultation: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchOnlineAppointments();
  }, [currentUser]);

  const fetchOnlineAppointments = async () => {
    if (!currentUser) return;

    try {
      // Simplified query - fetch all appointments for the user first
      const q = query(
        collection(db, 'appointments'),
        where('patientId', '==', currentUser.uid)
      );

      const querySnapshot = await getDocs(q);
      const appointmentList: Appointment[] = [];

      for (const doc of querySnapshot.docs) {
        const appointmentData = doc.data() as Omit<Appointment, 'id'>;
        
        // Filter for online appointments with scheduled status in JavaScript
        if (appointmentData.type === 'online' && appointmentData.status === 'scheduled') {
          // Get doctor details
          try {
            const doctorQuery = query(
              collection(db, 'doctors'),
              where('id', '==', appointmentData.doctorId)
            );
            const doctorSnapshot = await getDocs(doctorQuery);
            let doctorName = 'Unknown Doctor';
            
            if (!doctorSnapshot.empty) {
              doctorName = doctorSnapshot.docs[0].data().name;
            }

            appointmentList.push({
              id: doc.id,
              ...appointmentData,
              doctorName
            } as Appointment & { doctorName: string });
          } catch (doctorError) {
            console.error('Error fetching doctor details:', doctorError);
            // Add appointment without doctor name if doctor fetch fails
            appointmentList.push({
              id: doc.id,
              ...appointmentData,
              doctorName: 'Unknown Doctor'
            } as Appointment & { doctorName: string });
          }
        }
      }

      // Sort by date in JavaScript
      appointmentList.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      setAppointments(appointmentList);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      // Set empty array on error to prevent infinite loading
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const isAppointmentActive = (date: string, time: string) => {
    const appointmentDateTime = new Date(`${date}T${time}`);
    const now = new Date();
    const timeDiff = appointmentDateTime.getTime() - now.getTime();
    const minutesDiff = timeDiff / (1000 * 60);
    
    // Allow joining 15 minutes before to 60 minutes after
    return minutesDiff >= -60 && minutesDiff <= 15;
  };

  const getAppointmentStatus = (date: string, time: string) => {
    const appointmentDateTime = new Date(`${date}T${time}`);
    const now = new Date();
    const timeDiff = appointmentDateTime.getTime() - now.getTime();
    const minutesDiff = timeDiff / (1000 * 60);

    if (minutesDiff > 15) {
      return { status: 'upcoming', message: 'Upcoming', color: 'text-blue-600 bg-blue-50' };
    } else if (minutesDiff >= -15 && minutesDiff <= 15) {
      return { status: 'active', message: 'Join Now', color: 'text-green-600 bg-green-50' };
    } else if (minutesDiff >= -60 && minutesDiff < -15) {
      return { status: 'in-progress', message: 'In Progress', color: 'text-orange-600 bg-orange-50' };
    } else {
      return { status: 'completed', message: 'Completed', color: 'text-gray-600 bg-gray-50' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pastel-pink/10 to-pastel-blue/10 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading your consultations..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pastel-pink/10 to-pastel-blue/10 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="inline-block bg-gradient-to-r from-primary-400 to-secondary-400 p-3 rounded-2xl mb-4">
            <Video className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Online Consultations</h1>
          <p className="mt-2 text-gray-600">Manage your virtual appointments with healthcare providers</p>
        </div>

        {appointments.length === 0 ? (
          <div className="text-center py-12">
            <Video className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Online Consultations</h3>
            <p className="text-gray-600 mb-6">You don't have any scheduled online consultations.</p>
            <a
              href="/appointments"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
            >
              <Calendar className="h-4 w-4" />
              <span>Book Consultation</span>
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {appointments.map((appointment) => {
              const status = getAppointmentStatus(appointment.date, appointment.time);
              const canJoin = isAppointmentActive(appointment.date, appointment.time);

              return (
                <div key={appointment.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-gradient-to-r from-primary-400 to-secondary-400 p-2 rounded-lg">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {(appointment as any).doctorName}
                        </h3>
                        <p className="text-sm text-gray-600">Online Consultation</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                      {status.message}
                    </span>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center space-x-3 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">
                        {new Date(appointment.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-3 text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">{appointment.time}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {canJoin && appointment.meetingLink ? (
                      <a
                        href={appointment.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
                      >
                        <Video className="h-4 w-4" />
                        <span>Join Video Call</span>
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    ) : (
                      <button
                        disabled
                        className="w-full bg-gray-200 text-gray-500 py-3 px-4 rounded-lg font-semibold cursor-not-allowed flex items-center justify-center space-x-2"
                      >
                        <Video className="h-4 w-4" />
                        <span>
                          {status.status === 'upcoming' 
                            ? 'Meeting Not Yet Available' 
                            : status.status === 'completed'
                            ? 'Meeting Ended'
                            : 'Join Video Call'
                          }
                        </span>
                      </button>
                    )}

                    <button className="w-full border-2 border-primary-200 text-primary-600 py-2 px-4 rounded-lg font-medium hover:bg-primary-50 transition-all duration-300 flex items-center justify-center space-x-2">
                      <Phone className="h-4 w-4" />
                      <span>Contact Support</span>
                    </button>
                  </div>

                  {appointment.notes && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-900 mb-1">Notes:</h4>
                      <p className="text-sm text-gray-600">{appointment.notes}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Instructions Section */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Join Your Consultation</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-primary-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Clock className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Be Ready 5 Minutes Early</h3>
              <p className="text-gray-600 text-sm">Test your camera and microphone before the appointment starts.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-secondary-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Video className="h-8 w-8 text-secondary-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Click Join Video Call</h3>
              <p className="text-gray-600 text-sm">The join button will be available 15 minutes before your appointment.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Phone className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
              <p className="text-gray-600 text-sm">Contact our support team if you experience any technical difficulties.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnlineConsultation;