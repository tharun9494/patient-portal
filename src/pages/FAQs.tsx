import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Search, MessageCircle, Phone, Mail } from 'lucide-react';

const FAQs: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const categories = [
    { id: 'all', name: 'All Questions', count: 25 },
    { id: 'account', name: 'Account & Profile', count: 6 },
    { id: 'appointments', name: 'Appointments', count: 8 },
    { id: 'billing', name: 'Billing & Payments', count: 5 },
    { id: 'technical', name: 'Technical Issues', count: 6 },
  ];

  const faqs = [
    {
      id: 'account-1',
      category: 'account',
      question: 'How do I create an account?',
      answer: 'Creating an account is simple! Click the "Sign Up" button on our homepage, fill in your personal information, verify your email address, and you\'ll be ready to start using HealthPortal.'
    },
    {
      id: 'appointments-1',
      category: 'appointments',
      question: 'How do I schedule an appointment?',
      answer: 'To schedule an appointment, navigate to the "Appointments" section, click "Book New Appointment," select your preferred doctor or specialty, choose an available time slot, and confirm your booking.'
    },
    {
      id: 'billing-1',
      category: 'billing',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express), debit cards, PayPal, and bank transfers for annual plans. All payments are processed securely.'
    },
    {
      id: 'technical-1',
      category: 'technical',
      question: 'I can\'t log into my account. What should I do?',
      answer: 'If you\'re having trouble logging in, try resetting your password using the "Forgot Password" link. If the issue persists, contact our support team for assistance.'
    }
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-50 to-secondary-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-4 rounded-2xl shadow-soft">
                <HelpCircle className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Frequently Asked <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Questions</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
              Find quick answers to the most common questions about our healthcare platform and services.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for answers..."
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
              Find answers organized by topic to quickly locate the information you need.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-glow-primary'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* FAQs */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              {selectedCategory === 'all' ? 'All Questions' : `${categories.find(c => c.id === selectedCategory)?.name}`}
            </h2>
            <p className="text-gray-600">
              {filteredFAQs.length} questions found
            </p>
          </div>
          
          <div className="space-y-4">
            {filteredFAQs.map((faq) => (
              <div key={faq.id} className="bg-white rounded-2xl shadow-soft overflow-hidden">
                <button
                  onClick={() => toggleExpanded(faq.id)}
                  className="w-full p-6 text-left hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 pr-4">
                      {faq.question}
                    </h3>
                    {expandedItems.has(faq.id) ? (
                      <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                    )}
                  </div>
                </button>
                
                {expandedItems.has(faq.id) && (
                  <div className="px-6 pb-6">
                    <div className="border-t border-gray-100 pt-4">
                      <p className="text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {filteredFAQs.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-gray-100 p-8 rounded-2xl max-w-md mx-auto">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No questions found</h3>
                <p className="text-gray-600">
                  Try adjusting your search terms or browse our categories above.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Contact Support */}
      <div className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Still Need Help?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Can't find the answer you're looking for? Our support team is here to help you 24/7.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-6 rounded-2xl">
              <MessageCircle className="h-8 w-8 text-primary-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Chat</h3>
              <p className="text-gray-600 text-sm mb-4">
                Get instant help from our support team
              </p>
              <button className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:shadow-glow-primary transition-all duration-300">
                Start Chat
              </button>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-2xl">
              <Phone className="h-8 w-8 text-primary-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Phone Support</h3>
              <p className="text-gray-600 text-sm mb-4">
                Speak directly with a representative
              </p>
              <button className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:shadow-glow-primary transition-all duration-300">
                Call Now
              </button>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-2xl">
              <Mail className="h-8 w-8 text-primary-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Support</h3>
              <p className="text-gray-600 text-sm mb-4">
                Send us a detailed message
              </p>
              <button className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:shadow-glow-primary transition-all duration-300">
                Send Email
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQs; 