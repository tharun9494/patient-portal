import React from 'react';
import { AlertTriangle, Phone, Shield, Clock, MapPin, Heart, Users, CheckCircle, Truck } from 'lucide-react';

const EmergencyContact: React.FC = () => {
  const emergencyNumbers = [
    {
      title: 'Emergency Services',
      number: '911',
      description: 'For life-threatening emergencies',
      type: 'critical',
      icon: AlertTriangle
    },
    {
      name: 'Emergency Helpline',
      number: '+91 22 1234 5678',
      description: '24/7 emergency medical assistance',
      icon: Phone,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      buttonColor: 'bg-red-600 hover:bg-red-700'
    },
    {
      name: 'Ambulance Service',
      number: '+91 22 108',
      description: 'Emergency ambulance dispatch',
      icon: Truck,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      buttonColor: 'bg-orange-600 hover:bg-orange-700'
    },
    {
      title: 'Poison Control',
      number: '+1 (800) 222-1222',
      description: 'For poisoning emergencies',
      type: 'urgent',
      icon: Shield
    },
    {
      title: 'Mental Health Crisis',
      number: '988',
      description: 'Suicide & crisis lifeline',
      type: 'urgent',
      icon: Heart
    }
  ];

  const emergencyProtocols = [
    {
      title: 'Medical Emergency',
      steps: [
        'Call 911 immediately',
        'Stay calm and assess the situation',
        'Provide clear location and details',
        'Follow dispatcher instructions',
        'Stay with the person until help arrives'
      ],
      icon: AlertTriangle
    },
    {
      title: 'Platform Emergency',
      steps: [
        'Call our emergency support line',
        'Describe the issue clearly',
        'Provide your account information',
        'Follow support team guidance',
        'Document the incident for follow-up'
      ],
      icon: Phone
    },
    {
      title: 'Data Security Emergency',
      steps: [
        'Contact our security team immediately',
        'Do not share sensitive information',
        'Change passwords if compromised',
        'Monitor accounts for suspicious activity',
        'Follow security team recommendations'
      ],
      icon: Shield
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-error-50 to-warning-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-r from-error-500 to-warning-500 p-4 rounded-2xl shadow-soft">
                <AlertTriangle className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Emergency <span className="bg-gradient-to-r from-error-600 to-warning-600 bg-clip-text text-transparent">Contact</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
              For urgent medical situations and critical healthcare platform issues. 
              We're here to help 24/7 when you need us most.
            </p>
            
            {/* Emergency Notice */}
            <div className="bg-white rounded-2xl p-6 max-w-2xl mx-auto shadow-soft">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <AlertTriangle className="h-6 w-6 text-error-600" />
                <span className="text-lg font-semibold text-error-600">Emergency Notice</span>
              </div>
              <p className="text-gray-700">
                For life-threatening medical emergencies, call <strong>911</strong> immediately. 
                Do not use this page for critical medical situations.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Numbers */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Emergency Contact Numbers</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Save these numbers for quick access during emergencies. 
              Our support team is available 24/7 for urgent healthcare needs.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {emergencyNumbers.map((contact, index) => (
              <div key={index} className={`rounded-2xl p-6 text-center transition-all duration-300 ${
                contact.type === 'critical' 
                  ? 'bg-gradient-to-br from-error-50 to-error-100 border-2 border-error-200 shadow-large' 
                  : 'bg-gray-50 hover:bg-white hover:shadow-soft'
              }`}>
                <div className={`p-3 rounded-xl w-fit mx-auto mb-4 ${
                  contact.type === 'critical' ? 'bg-error-100' : 'bg-primary-100'
                }`}>
                  <contact.icon className={`h-8 w-8 ${
                    contact.type === 'critical' ? 'text-error-600' : 'text-primary-600'
                  }`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{contact.title || contact.name}</h3>
                <div className={`text-2xl font-bold mb-2 ${
                  contact.type === 'critical' ? 'text-error-600' : 'text-primary-600'
                }`}>
                  {contact.number}
                </div>
                <p className="text-gray-600 text-sm">{contact.description}</p>
                
                <button className={`mt-4 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  contact.buttonColor
                }`}>
                  Call Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Emergency Protocols */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Emergency Protocols</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Follow these steps during different types of emergencies to ensure 
              you get the help you need quickly and safely.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {emergencyProtocols.map((protocol, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-soft">
                <div className="flex items-center mb-6">
                  <div className="bg-primary-100 p-3 rounded-xl mr-4">
                    <protocol.icon className="h-8 w-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{protocol.title}</h3>
                </div>
                
                <ol className="space-y-3">
                  {protocol.steps.map((step, stepIndex) => (
                    <li key={stepIndex} className="flex items-start space-x-3">
                      <span className="bg-primary-100 text-primary-600 text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                        {stepIndex + 1}
                      </span>
                      <span className="text-gray-600">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Support Information */}
      <div className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">24/7 Support Information</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our emergency support team is available around the clock to assist you 
              with urgent healthcare platform issues and medical guidance.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="flex items-center mb-4">
                <Clock className="h-6 w-6 text-primary-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Availability</h3>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li>• 24 hours a day, 7 days a week</li>
                <li>• No holidays or weekends off</li>
                <li>• Immediate response for emergencies</li>
                <li>• Multilingual support available</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="flex items-center mb-4">
                <Users className="h-6 w-6 text-primary-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Support Team</h3>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li>• Trained healthcare professionals</li>
                <li>• Technical support specialists</li>
                <li>• Emergency response coordinators</li>
                <li>• HIPAA-compliant assistance</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Important Reminders */}
      <div className="py-16 bg-gradient-to-br from-error-50 to-warning-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Important Reminders</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-soft">
              <div className="flex items-center justify-center mb-4">
                <AlertTriangle className="h-8 w-8 text-error-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Medical Emergencies</h3>
              <p className="text-gray-600 text-sm">
                Always call 911 for life-threatening situations. 
                Do not rely on online platforms for critical medical emergencies.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-soft">
              <div className="flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-success-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Stay Prepared</h3>
              <p className="text-gray-600 text-sm">
                Save emergency numbers in your phone and keep this page bookmarked 
                for quick access when needed.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Additional Contact Information</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            For non-emergency support and general inquiries, use these contact methods.
          </p>
          
          <div className="bg-gray-50 rounded-2xl p-8 max-w-2xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Contact Support</h3>
                <p className="text-gray-600 text-sm mb-2">Email: support@healthportal.com</p>
                <p className="text-gray-600 text-sm">Phone: +91 22 9876 5432</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Business Hours</h3>
                <p className="text-gray-600 text-sm mb-2">Mon-Fri: 8:00 AM - 8:00 PM</p>
                <p className="text-gray-600 text-sm">Sat-Sun: 9:00 AM - 6:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyContact; 