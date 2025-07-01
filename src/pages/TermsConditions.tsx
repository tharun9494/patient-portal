import React from 'react';
import { FileText, AlertTriangle, CheckCircle, Users, Shield, Calendar } from 'lucide-react';

const TermsConditions: React.FC = () => {
  const lastUpdated = 'January 15, 2024';

  const sections = [
    {
      title: 'Acceptance of Terms',
      icon: CheckCircle,
      content: `By accessing and using HealthPortal, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.`
    },
    {
      title: 'Use License',
      icon: FileText,
      content: `Permission is granted to temporarily download one copy of the materials (information or software) on HealthPortal's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.`
    },
    {
      title: 'User Responsibilities',
      icon: Users,
      content: `Users are responsible for providing accurate information, maintaining the confidentiality of their account credentials, and using the platform in accordance with applicable laws and regulations.`
    },
    {
      title: 'Medical Disclaimer',
      icon: AlertTriangle,
      content: `HealthPortal is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.`
    },
    {
      title: 'Privacy and Security',
      icon: Shield,
      content: `We are committed to protecting your privacy and maintaining the security of your health information. Please review our Privacy Policy for details on how we collect, use, and protect your data.`
    },
    {
      title: 'Service Availability',
      icon: Calendar,
      content: `While we strive to maintain high availability, we do not guarantee uninterrupted access to our services. We may need to perform maintenance or updates that could temporarily affect service availability.`
    }
  ];

  const prohibitedActivities = [
    'Attempting to gain unauthorized access to our systems',
    'Using the platform for illegal or unauthorized purposes',
    'Sharing account credentials with others',
    'Attempting to reverse engineer or hack our systems',
    'Posting false or misleading information',
    'Violating any applicable laws or regulations'
  ];

  const userRights = [
    'Access to your personal health information',
    'Ability to schedule and manage appointments',
    'Secure communication with healthcare providers',
    'Access to your medical records',
    'Ability to update your personal information',
    'Right to request data deletion'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-50 to-secondary-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-4 rounded-2xl shadow-soft">
                <FileText className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Terms & <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Conditions</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-4">
              Please read these terms and conditions carefully before using our healthcare platform. 
              By using our services, you agree to these terms.
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
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Agreement to Terms</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              These Terms and Conditions ("Terms") govern your use of the HealthPortal website and services 
              operated by HealthPortal ("we," "us," or "our"). By accessing or using our services, you agree 
              to be bound by these Terms.
            </p>
            <p className="text-gray-600 leading-relaxed">
              If you disagree with any part of these terms, then you may not access our services. These Terms 
              apply to all visitors, users, and others who access or use our services.
            </p>
          </div>

          {/* Key Sections */}
          <div className="space-y-8">
            {sections.map((section, index) => (
              <div key={index} className="border border-gray-200 rounded-2xl p-8">
                <div className="flex items-center mb-6">
                  <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-3 rounded-xl mr-4">
                    <section.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{section.title}</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">{section.content}</p>
              </div>
            ))}
          </div>

          {/* User Rights */}
          <div className="mt-12 border border-gray-200 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Your Rights</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">What You Can Do</h4>
                <ul className="space-y-3">
                  {userRights.map((right, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-success-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600 text-sm">{right}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Prohibited Activities</h4>
                <ul className="space-y-3">
                  {prohibitedActivities.map((activity, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 text-error-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600 text-sm">{activity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Additional Terms */}
          <div className="mt-12 space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Limitation of Liability</h3>
              <p className="text-gray-600 leading-relaxed">
                In no event shall HealthPortal, nor its directors, employees, partners, agents, suppliers, 
                or affiliates, be liable for any indirect, incidental, special, consequential, or punitive 
                damages, including without limitation, loss of profits, data, use, goodwill, or other 
                intangible losses, resulting from your use of our services.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Intellectual Property</h3>
              <p className="text-gray-600 leading-relaxed">
                The Service and its original content, features, and functionality are and will remain the 
                exclusive property of HealthPortal and its licensors. The Service is protected by copyright, 
                trademark, and other laws.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Termination</h3>
              <p className="text-gray-600 leading-relaxed">
                We may terminate or suspend your account and bar access to the Service immediately, without 
                prior notice or liability, under our sole discretion, for any reason whatsoever and without 
                limitation, including but not limited to a breach of the Terms.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Changes to Terms</h3>
              <p className="text-gray-600 leading-relaxed">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
                If a revision is material, we will try to provide at least 30 days notice prior to any new 
                terms taking effect.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                If you have any questions about these Terms and Conditions, please contact us:
              </p>
              <div className="bg-gray-50 rounded-xl p-6">
                <p className="text-gray-600 mb-2">
                  <strong>Email:</strong> legal@healthportal.com
                </p>
                <p className="text-gray-600 mb-2">
                  <strong>Phone:</strong> +91 22 1234 5678
                </p>
                <p className="text-gray-600">
                  <strong>Address:</strong> 123 Medical Center Dr, Healthcare City, HC 12345
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Important Notice */}
      <div className="py-16 bg-gradient-to-br from-warning-50 to-error-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-soft">
            <div className="flex justify-center mb-6">
              <div className="bg-warning-100 p-4 rounded-xl">
                <AlertTriangle className="h-12 w-12 text-warning-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Important Notice</h3>
            <p className="text-gray-600 leading-relaxed">
              These terms and conditions are legally binding. By using our services, you acknowledge that 
              you have read, understood, and agree to be bound by these terms. If you do not agree with 
              any part of these terms, please do not use our services.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions; 