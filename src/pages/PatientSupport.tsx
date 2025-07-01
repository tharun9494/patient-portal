import React, { useState } from 'react';
import { Users, MessageCircle, Phone, Mail, Video, FileText, Clock, Shield, Heart, CheckCircle } from 'lucide-react';

const PatientSupport: React.FC = () => {
  const [selectedSupportType, setSelectedSupportType] = useState('general');

  const supportChannels = [
    {
      title: '24/7 Live Chat',
      description: 'Get instant help from our support team',
      icon: MessageCircle,
      availability: 'Available 24/7',
      responseTime: 'Instant',
      color: 'from-primary-500 to-secondary-500',
      action: 'Start Chat',
      popular: true
    },
    {
      title: 'Phone Support',
      description: 'Speak directly with a support representative',
      icon: Phone,
      availability: 'Mon-Fri: 8AM-8PM, Sat-Sun: 9AM-6PM',
      responseTime: 'Immediate',
      color: 'from-success-500 to-primary-500',
      action: 'Call Now',
      popular: false
    },
    {
      title: 'Email Support',
      description: 'Send us a detailed message for complex issues',
      icon: Mail,
      availability: '24/7',
      responseTime: 'Within 24 hours',
      color: 'from-accent-500 to-primary-500',
      action: 'Send Email',
      popular: false
    },
    {
      title: 'Video Call Support',
      description: 'Get visual assistance with screen sharing',
      icon: Video,
      availability: 'Mon-Fri: 9AM-6PM',
      responseTime: 'Scheduled',
      color: 'from-secondary-500 to-accent-500',
      action: 'Schedule Call',
      popular: false
    }
  ];

  const supportCategories = [
    {
      id: 'general',
      name: 'General Support',
      description: 'Account issues, general questions, and platform guidance'
    },
    {
      id: 'technical',
      name: 'Technical Issues',
      description: 'Login problems, app issues, and technical difficulties'
    },
    {
      id: 'medical',
      name: 'Medical Support',
      description: 'Health-related questions and medical record assistance'
    },
    {
      id: 'billing',
      name: 'Billing & Payments',
      description: 'Payment issues, insurance questions, and billing disputes'
    },
    {
      id: 'emergency',
      name: 'Emergency Support',
      description: 'Urgent medical situations and critical issues'
    }
  ];

  const resources = [
    {
      title: 'Patient Guide',
      description: 'Complete guide to using HealthPortal features',
      icon: FileText,
      type: 'PDF Download',
      size: '2.3 MB'
    },
    {
      title: 'Video Tutorials',
      description: 'Step-by-step video guides for common tasks',
      icon: Video,
      type: 'Video Series',
      size: '15 videos'
    },
    {
      title: 'Health Tips',
      description: 'Weekly health tips and wellness advice',
      icon: Heart,
      type: 'Newsletter',
      size: 'Weekly'
    },
    {
      title: 'Security Guide',
      description: 'How to keep your health information secure',
      icon: Shield,
      type: 'Guide',
      size: '1.1 MB'
    }
  ];

  const commonIssues = [
    {
      issue: 'I can\'t log into my account',
      solution: 'Try resetting your password or contact support for account recovery',
      category: 'technical'
    },
    {
      issue: 'My appointment was cancelled',
      solution: 'Check your email for cancellation details or contact us to reschedule',
      category: 'general'
    },
    {
      issue: 'I can\'t access my medical records',
      solution: 'Ensure you\'re logged in and check your permissions in account settings',
      category: 'medical'
    },
    {
      issue: 'Payment didn\'t go through',
      solution: 'Verify your payment method and try again, or contact billing support',
      category: 'billing'
    },
    {
      issue: 'Video call isn\'t working',
      solution: 'Check your internet connection and browser settings, or switch to phone consultation',
      category: 'technical'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-50 to-secondary-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-4 rounded-2xl shadow-soft">
                <Users className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Patient <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Support</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
              We're here to help you every step of the way. Get the support you need, 
              when you need it, through multiple convenient channels.
            </p>
          </div>
        </div>
      </div>

      {/* Support Channels */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How Can We Help You?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose the support channel that works best for you. We're available 24/7 
              to ensure you always have access to the help you need.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportChannels.map((channel, index) => (
              <div key={index} className={`relative rounded-2xl p-6 ${
                channel.popular 
                  ? 'bg-gradient-to-br from-accent-50 to-primary-50 border-2 border-accent-200 shadow-large' 
                  : 'bg-gray-50 hover:bg-white hover:shadow-soft'
              } transition-all duration-300`}>
                {channel.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-accent-500 to-primary-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center">
                  <div className={`bg-gradient-to-r ${channel.color} p-3 rounded-xl w-fit mx-auto mb-4`}>
                    <channel.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{channel.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{channel.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>{channel.availability}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Response: {channel.responseTime}
                    </div>
                  </div>
                  
                  <button className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:shadow-glow-primary transition-all duration-300">
                    {channel.action}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Support Categories */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Support Categories</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find the right type of support for your specific needs and get connected 
              with the appropriate team member.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {supportCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedSupportType(category.id)}
                className={`p-6 rounded-2xl text-left transition-all duration-300 ${
                  selectedSupportType === category.id
                    ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-glow-primary'
                    : 'bg-white hover:shadow-soft'
                }`}
              >
                <h3 className={`text-lg font-semibold mb-2 ${
                  selectedSupportType === category.id ? 'text-white' : 'text-gray-900'
                }`}>
                  {category.name}
                </h3>
                <p className={`text-sm ${
                  selectedSupportType === category.id ? 'text-white/80' : 'text-gray-600'
                }`}>
                  {category.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Common Issues */}
      <div className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Common Issues & Solutions</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Quick solutions to the most frequently encountered problems.
            </p>
          </div>
          
          <div className="space-y-4">
            {commonIssues.map((item, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-6 hover:bg-white hover:shadow-soft transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary-100 p-2 rounded-lg flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.issue}</h3>
                    <p className="text-gray-600">{item.solution}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Resources */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Helpful Resources</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Access guides, tutorials, and resources to help you make the most of HealthPortal.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {resources.map((resource, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-medium transition-all duration-300">
                <div className="text-center">
                  <div className="bg-primary-100 p-3 rounded-xl w-fit mx-auto mb-4">
                    <resource.icon className="h-8 w-8 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{resource.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{resource.description}</p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span>{resource.type}</span>
                    <span>{resource.size}</span>
                  </div>
                  
                  <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                    Access Resource →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Get in Touch</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Need immediate assistance? Here's how to reach our support team.
          </p>
          
          <div className="bg-gray-50 rounded-2xl p-8 max-w-2xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Emergency Support</h3>
                <p className="text-gray-600 text-sm mb-2">For urgent medical issues</p>
                <p className="text-gray-600 text-sm font-medium">+91 22 1234 5678</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">General Support</h3>
                <p className="text-gray-600 text-sm mb-2">For platform and account issues</p>
                <p className="text-gray-600 text-sm font-medium">support@healthportal.com</p>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                <strong>Note:</strong> For medical emergencies, please call 911 or your local emergency services immediately.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientSupport; 