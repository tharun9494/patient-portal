import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, MessageSquare, Send, CheckCircle } from 'lucide-react';

const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    
    // Reset success message after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone Support',
      details: ['+1 (555) 123-4567', '+1 (555) 987-6543'],
      description: 'Available 24/7 for urgent medical inquiries',
      color: 'from-primary-500 to-secondary-500',
    },
    {
      icon: Mail,
      title: 'Email Support',
      details: ['support@healthportal.com', 'info@healthportal.com'],
      description: 'Get detailed responses within 24 hours',
      color: 'from-accent-500 to-primary-500',
    },
    {
      icon: MapPin,
      title: 'Office Address',
      details: ['123 Medical Center Dr', 'Healthcare City, HC 12345'],
      description: 'Visit us during business hours',
      color: 'from-secondary-500 to-accent-500',
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: ['Mon-Fri: 8:00 AM - 8:00 PM', 'Sat-Sun: 9:00 AM - 6:00 PM'],
      description: 'Emergency support available 24/7',
      color: 'from-success-500 to-primary-500',
    },
  ];

  const departments = [
    { name: 'General Inquiries', email: 'info@healthportal.com' },
    { name: 'Technical Support', email: 'tech@healthportal.com' },
    { name: 'Billing & Payments', email: 'billing@healthportal.com' },
    { name: 'Medical Records', email: 'records@healthportal.com' },
    { name: 'Appointment Booking', email: 'appointments@healthportal.com' },
    { name: 'Emergency Support', email: 'emergency@healthportal.com' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-50 to-secondary-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-4 rounded-2xl shadow-soft">
                <MessageSquare className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Contact <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Us</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We're here to help! Get in touch with us for any questions, support, or feedback. 
              Our team is ready to assist you with your healthcare needs.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Get in Touch</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose the best way to reach us based on your needs. We're committed to providing 
              timely and helpful responses to all inquiries.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <div key={index} className="text-center p-6 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-soft transition-all duration-300">
                <div className="flex justify-center mb-4">
                  <div className={`bg-gradient-to-r ${info.color} p-3 rounded-xl`}>
                    <info.icon className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{info.title}</h3>
                <div className="space-y-1 mb-3">
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-gray-600 text-sm">{detail}</p>
                  ))}
                </div>
                <p className="text-gray-500 text-xs">{info.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Form & Departments */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white p-8 rounded-2xl shadow-soft">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h3>
              
              {isSubmitted && (
                <div className="mb-6 p-4 bg-success-50 border border-success-200 rounded-xl flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-success-600" />
                  <span className="text-success-800">Thank you! Your message has been sent successfully.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="technical">Technical Support</option>
                    <option value="billing">Billing & Payments</option>
                    <option value="appointment">Appointment Booking</option>
                    <option value="medical-records">Medical Records</option>
                    <option value="feedback">Feedback & Suggestions</option>
                    <option value="emergency">Emergency Support</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Please describe your inquiry in detail..."
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-3 px-6 rounded-xl font-medium hover:shadow-glow-primary transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <Send className="h-5 w-5" />
                  <span>Send Message</span>
                </button>
              </form>
            </div>

            {/* Departments */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact by Department</h3>
              <div className="space-y-4">
                {departments.map((dept, index) => (
                  <div key={index} className="bg-white p-6 rounded-xl shadow-soft hover:shadow-medium transition-all duration-300">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{dept.name}</h4>
                    <a
                      href={`mailto:${dept.email}`}
                      className="text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
                    >
                      {dept.email}
                    </a>
                  </div>
                ))}
              </div>
              
              {/* Emergency Notice */}
              <div className="mt-8 bg-error-50 border border-error-200 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-error-800 mb-2">Emergency Support</h4>
                <p className="text-error-700 text-sm mb-3">
                  For medical emergencies, please call 911 or your local emergency services immediately.
                </p>
                <p className="text-error-700 text-sm">
                  Our emergency support line is available 24/7 for urgent healthcare platform issues.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">
              Quick answers to common questions about our services and support.
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                How quickly will I receive a response?
              </h3>
              <p className="text-gray-600">
                We aim to respond to all inquiries within 24 hours. For urgent matters, 
                please use our phone support line which is available 24/7.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Can I schedule an appointment through the contact form?
              </h3>
              <p className="text-gray-600">
                While you can request appointment assistance through the contact form, 
                we recommend using our dedicated appointment booking system for faster service.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                What information should I include in my message?
              </h3>
              <p className="text-gray-600">
                Please include your full name, contact information, and a detailed description 
                of your inquiry or concern to help us provide the best possible assistance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs; 