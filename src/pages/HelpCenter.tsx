import React, { useState } from 'react';
import { Search, BookOpen, MessageCircle, Phone, Mail, Video, FileText, Settings, User, Shield, Calendar, CreditCard } from 'lucide-react';

const HelpCenter: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Topics', icon: BookOpen, count: 25 },
    { id: 'account', name: 'Account & Profile', icon: User, count: 5 },
    { id: 'appointments', name: 'Appointments', icon: Calendar, count: 8 },
    { id: 'billing', name: 'Billing & Payments', icon: CreditCard, count: 4 },
    { id: 'security', name: 'Security & Privacy', icon: Shield, count: 3 },
    { id: 'technical', name: 'Technical Support', icon: Settings, count: 5 },
  ];

  const helpTopics = [
    {
      id: 'account',
      title: 'How to update my profile information?',
      description: 'Learn how to modify your personal details, contact information, and health preferences.',
      category: 'account',
      views: 1247,
      helpful: 89
    },
    {
      id: 'appointments',
      title: 'How to schedule an appointment?',
      description: 'Step-by-step guide to booking appointments with healthcare providers.',
      category: 'appointments',
      views: 2156,
      helpful: 156
    },
    {
      id: 'appointments',
      title: 'How to cancel or reschedule an appointment?',
      description: 'Instructions for modifying your existing appointments.',
      category: 'appointments',
      views: 1893,
      helpful: 134
    },
    {
      id: 'billing',
      title: 'Understanding your bill and payment options',
      description: 'Detailed explanation of billing structure and available payment methods.',
      category: 'billing',
      views: 987,
      helpful: 67
    },
    {
      id: 'security',
      title: 'How to keep your health information secure',
      description: 'Best practices for maintaining the security of your medical data.',
      category: 'security',
      views: 756,
      helpful: 45
    },
    {
      id: 'technical',
      title: 'Troubleshooting login issues',
      description: 'Common solutions for account access problems.',
      category: 'technical',
      views: 1432,
      helpful: 98
    },
    {
      id: 'appointments',
      title: 'What to expect during a video consultation?',
      description: 'Prepare for your online medical consultation with these helpful tips.',
      category: 'appointments',
      views: 1123,
      helpful: 78
    },
    {
      id: 'account',
      title: 'How to add family members to my account?',
      description: 'Manage multiple family members under one account.',
      category: 'account',
      views: 892,
      helpful: 56
    },
    {
      id: 'billing',
      title: 'Insurance coverage and claims',
      description: 'Information about insurance processing and claim submission.',
      category: 'billing',
      views: 654,
      helpful: 43
    },
    {
      id: 'technical',
      title: 'Mobile app troubleshooting',
      description: 'Resolve common issues with the HealthPortal mobile application.',
      category: 'technical',
      views: 1101,
      helpful: 72
    }
  ];

  const filteredTopics = helpTopics.filter(topic => {
    const matchesSearch = topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         topic.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || topic.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const supportOptions = [
    {
      title: 'Live Chat',
      description: 'Get instant help from our support team',
      icon: MessageCircle,
      color: 'from-primary-500 to-secondary-500',
      action: 'Start Chat'
    },
    {
      title: 'Phone Support',
      description: 'Speak directly with a support representative',
      icon: Phone,
      color: 'from-success-500 to-primary-500',
      action: 'Call Now'
    },
    {
      title: 'Email Support',
      description: 'Send us a detailed message',
      icon: Mail,
      color: 'from-accent-500 to-primary-500',
      action: 'Send Email'
    },
    {
      title: 'Video Call',
      description: 'Get visual assistance with screen sharing',
      icon: Video,
      color: 'from-secondary-500 to-accent-500',
      action: 'Schedule Call'
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
                <BookOpen className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Help <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Center</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
              Find answers to common questions, learn how to use our platform, and get the support you need.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for help articles, guides, and FAQs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-soft"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Browse by Category</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find help articles organized by topic to quickly locate the information you need.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`p-6 rounded-2xl text-left transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-glow-primary'
                    : 'bg-gray-50 hover:bg-white hover:shadow-soft'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${
                    selectedCategory === category.id ? 'bg-white/20' : 'bg-primary-100'
                  }`}>
                    <category.icon className={`h-6 w-6 ${
                      selectedCategory === category.id ? 'text-white' : 'text-primary-600'
                    }`} />
                  </div>
                  <span className={`text-sm font-medium ${
                    selectedCategory === category.id ? 'text-white/80' : 'text-gray-500'
                  }`}>
                    {category.count} articles
                  </span>
                </div>
                <h3 className={`text-lg font-semibold mb-2 ${
                  selectedCategory === category.id ? 'text-white' : 'text-gray-900'
                }`}>
                  {category.name}
                </h3>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Help Topics */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              {selectedCategory === 'all' ? 'All Help Topics' : `${categories.find(c => c.id === selectedCategory)?.name}`}
            </h2>
            <p className="text-gray-600">
              {filteredTopics.length} articles found
            </p>
          </div>
          
          <div className="space-y-6">
            {filteredTopics.map((topic, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-medium transition-all duration-300">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-primary-600 cursor-pointer transition-colors">
                      {topic.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{topic.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{topic.views} views</span>
                      <span>•</span>
                      <span>{topic.helpful} found helpful</span>
                    </div>
                  </div>
                  <button className="ml-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:shadow-glow-primary transition-all duration-300">
                    Read More
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {filteredTopics.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-gray-100 p-8 rounded-2xl max-w-md mx-auto">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-600">
                  Try adjusting your search terms or browse our categories above.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Support Options */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Need More Help?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Can't find what you're looking for? Our support team is here to help you 24/7.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportOptions.map((option, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-6 text-center hover:bg-white hover:shadow-soft transition-all duration-300">
                <div className={`bg-gradient-to-r ${option.color} p-3 rounded-xl w-fit mx-auto mb-4`}>
                  <option.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{option.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{option.description}</p>
                <button className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:shadow-glow-primary transition-all duration-300">
                  {option.action}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="py-16 bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Get instant access to the most common help resources and support options.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-soft">
              <FileText className="h-8 w-8 text-primary-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">User Guide</h3>
              <p className="text-gray-600 text-sm mb-4">
                Complete guide to using all features of HealthPortal
              </p>
              <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                Download PDF →
              </button>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-soft">
              <Video className="h-8 w-8 text-primary-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Video Tutorials</h3>
              <p className="text-gray-600 text-sm mb-4">
                Step-by-step video guides for common tasks
              </p>
              <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                Watch Videos →
              </button>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-soft">
              <MessageCircle className="h-8 w-8 text-primary-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Community Forum</h3>
              <p className="text-gray-600 text-sm mb-4">
                Connect with other users and share experiences
              </p>
              <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                Join Discussion →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter; 