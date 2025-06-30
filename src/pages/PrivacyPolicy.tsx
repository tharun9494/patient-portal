import React from 'react';
import { Shield, Eye, Lock, Users, Calendar, CheckCircle } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  const lastUpdated = 'January 15, 2024';

  const sections = [
    {
      title: 'Information We Collect',
      icon: Eye,
      content: [
        'Personal information (name, email, phone number)',
        'Health information and medical records',
        'Appointment and consultation data',
        'Payment and billing information',
        'Device and usage information',
        'Communication preferences'
      ]
    },
    {
      title: 'How We Use Your Information',
      icon: Users,
      content: [
        'Provide healthcare services and appointments',
        'Manage your health records and medical history',
        'Process payments and billing',
        'Send important health notifications',
        'Improve our services and user experience',
        'Comply with legal and regulatory requirements'
      ]
    },
    {
      title: 'Data Security',
      icon: Lock,
      content: [
        'Encryption of all sensitive data',
        'Secure data transmission protocols',
        'Regular security audits and updates',
        'Access controls and authentication',
        'Backup and disaster recovery procedures',
        'Compliance with HIPAA and other regulations'
      ]
    },
    {
      title: 'Data Retention',
      icon: Calendar,
      content: [
        'Health records retained as required by law',
        'Account data kept while account is active',
        'Payment information stored securely',
        'Communication logs maintained for support',
        'Anonymized data may be retained for analytics',
        'Right to request data deletion'
      ]
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
                <Shield className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Privacy <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Policy</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-4">
              Your privacy and the security of your health information are our top priorities. 
              This policy explains how we collect, use, and protect your data.
            </p>
            <p className="text-sm text-gray-500">
              Last updated: {lastUpdated}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Introduction */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Introduction</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              At HealthPortal, we are committed to protecting your privacy and ensuring the security of your 
              personal and health information. This Privacy Policy explains how we collect, use, and protect your data.
            </p>
            <p className="text-gray-600 leading-relaxed">
              By using our services, you agree to the collection and use of information in accordance with 
              this policy. We are committed to maintaining the trust and confidence of our users and will 
              never sell, rent, or trade your personal information to third parties.
            </p>
          </div>

          {/* Key Sections */}
          <div className="space-y-12">
            {sections.map((section, index) => (
              <div key={index} className="border border-gray-200 rounded-2xl p-8">
                <div className="flex items-center mb-6">
                  <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-3 rounded-xl mr-4">
                    <section.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{section.title}</h3>
                </div>
                <ul className="space-y-3">
                  {section.content.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-success-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Additional Sections */}
          <div className="mt-12 space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Your Rights</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                You have the right to:
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>• Access your personal information</li>
                <li>• Correct inaccurate or incomplete data</li>
                <li>• Request deletion of your data</li>
                <li>• Opt-out of marketing communications</li>
                <li>• File a complaint with regulatory authorities</li>
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-gray-50 rounded-xl p-6">
                <p className="text-gray-600 mb-2">
                  <strong>Email:</strong> privacy@healthportal.com
                </p>
                <p className="text-gray-600 mb-2">
                  <strong>Phone:</strong> +1 (555) 123-4567
                </p>
                <p className="text-gray-600">
                  <strong>Address:</strong> 123 Medical Center Dr, Healthcare City, HC 12345
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Compliance Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Compliance & Certifications</h2>
            <p className="text-lg text-gray-600">
              We maintain the highest standards of data protection and privacy compliance.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-soft text-center">
              <div className="bg-primary-100 p-3 rounded-xl w-fit mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">HIPAA Compliant</h3>
              <p className="text-gray-600 text-sm">
                Full compliance with Health Insurance Portability and Accountability Act
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-soft text-center">
              <div className="bg-success-100 p-3 rounded-xl w-fit mx-auto mb-4">
                <Lock className="h-8 w-8 text-success-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">SOC 2 Certified</h3>
              <p className="text-gray-600 text-sm">
                Service Organization Control 2 Type II certification for security
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-soft text-center">
              <div className="bg-accent-100 p-3 rounded-xl w-fit mx-auto mb-4">
                <Eye className="h-8 w-8 text-accent-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">GDPR Ready</h3>
              <p className="text-gray-600 text-sm">
                General Data Protection Regulation compliance for EU users
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy; 