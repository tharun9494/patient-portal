import React from 'react';
import { RotateCcw, Clock, AlertTriangle, CheckCircle, XCircle, Calendar, CreditCard } from 'lucide-react';

const CancellationRefund: React.FC = () => {
  const lastUpdated = 'January 15, 2024';

  const cancellationPolicies = [
    {
      timeFrame: '24+ hours before',
      policy: 'Full refund or reschedule',
      icon: CheckCircle,
      color: 'text-success-600',
      bgColor: 'bg-success-100'
    },
    {
      timeFrame: '2-24 hours before',
      policy: '50% refund or reschedule',
      icon: Clock,
      color: 'text-warning-600',
      bgColor: 'bg-warning-100'
    },
    {
      timeFrame: 'Less than 2 hours',
      policy: 'No refund, reschedule only',
      icon: XCircle,
      color: 'text-error-600',
      bgColor: 'bg-error-100'
    },
    {
      timeFrame: 'No-show',
      policy: 'No refund, full charge',
      icon: XCircle,
      color: 'text-error-600',
      bgColor: 'bg-error-100'
    }
  ];

  const refundProcess = [
    {
      step: '1',
      title: 'Submit Request',
      description: 'Contact our support team or use the cancellation form in your account',
      icon: Calendar
    },
    {
      step: '2',
      title: 'Review Period',
      description: 'We review your request within 24-48 hours during business days',
      icon: Clock
    },
    {
      step: '3',
      title: 'Processing',
      description: 'If approved, refund is processed within 5-10 business days',
      icon: RotateCcw
    },
    {
      step: '4',
      title: 'Confirmation',
      description: 'You receive email confirmation when refund is completed',
      icon: CheckCircle
    }
  ];

  const exceptions = [
    'Medical emergencies requiring immediate attention',
    'Natural disasters or severe weather conditions',
    'Technical issues preventing access to our platform',
    'Healthcare provider cancellations',
    'System maintenance or outages'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-50 to-secondary-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-4 rounded-2xl shadow-soft">
                <RotateCcw className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Cancellation & <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Refund Policy</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-4">
              We understand that sometimes you need to cancel or reschedule appointments. 
              Here's everything you need to know about our cancellation and refund policies.
            </p>
            <p className="text-sm text-gray-500">
              Last updated: {lastUpdated}
            </p>
          </div>
        </div>
      </div>

      {/* Cancellation Policies */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Cancellation Policies</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our cancellation policies are designed to be fair to both patients and healthcare providers. 
              The refund amount depends on how far in advance you cancel your appointment.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cancellationPolicies.map((policy, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-6 text-center hover:shadow-soft transition-all duration-300">
                <div className={`${policy.bgColor} p-3 rounded-xl w-fit mx-auto mb-4`}>
                  <policy.icon className={`h-8 w-8 ${policy.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{policy.timeFrame}</h3>
                <p className="text-gray-600 text-sm">{policy.policy}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Refund Process */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Refund Process</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We strive to process refunds quickly and efficiently. Here's what happens when you request a refund.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {refundProcess.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-2xl p-6 shadow-soft text-center">
                  <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-3 rounded-xl w-fit mx-auto mb-4">
                    <step.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="bg-primary-100 text-primary-600 text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-4">
                    {step.step}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
                {index < refundProcess.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <div className="w-8 h-0.5 bg-gray-300"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Important Information */}
      <div className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {/* How to Cancel */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">How to Cancel</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-primary-100 p-2 rounded-lg">
                    <Calendar className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Online Cancellation</h4>
                    <p className="text-gray-600 text-sm">Log into your account and cancel through the appointments section</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-primary-100 p-2 rounded-lg">
                    <Clock className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Phone Cancellation</h4>
                    <p className="text-gray-600 text-sm">Call our support line at +91 8919403905</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-primary-100 p-2 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Emergency Cancellations</h4>
                    <p className="text-gray-600 text-sm">For medical emergencies, contact us immediately</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Exceptions */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Exceptions</h3>
              <p className="text-gray-600 mb-4">
                We understand that certain circumstances may require special consideration. 
                The following situations may qualify for exceptions to our standard policy:
              </p>
              <ul className="space-y-2">
                {exceptions.map((exception, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-success-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600 text-sm">{exception}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Refund Methods */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Refund Methods</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Refunds are processed using the same payment method used for the original transaction.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-soft text-center">
              <div className="bg-success-100 p-3 rounded-xl w-fit mx-auto mb-4">
                <CreditCard className="h-8 w-8 text-success-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Credit/Debit Cards</h3>
              <p className="text-gray-600 text-sm">
                Refunds appear on your statement within 5-10 business days
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-soft text-center">
              <div className="bg-primary-100 p-3 rounded-xl w-fit mx-auto mb-4">
                <RotateCcw className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Account Credit</h3>
              <p className="text-gray-600 text-sm">
                Applied to your HealthPortal account for future appointments
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-soft text-center">
              <div className="bg-accent-100 p-3 rounded-xl w-fit mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-accent-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Insurance Claims</h3>
              <p className="text-gray-600 text-sm">
                Processed through your insurance provider according to their policies
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Need Help?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            If you have questions about our cancellation or refund policies, 
            our support team is here to help.
          </p>
          
          <div className="bg-gray-50 rounded-2xl p-8 max-w-2xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Contact Support</h3>
                <p className="text-gray-600 text-sm mb-2">Email: forefightera@gmail.com</p>
                <p className="text-gray-600 text-sm">Phone: +91 89194 03905</p>
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

export default CancellationRefund; 