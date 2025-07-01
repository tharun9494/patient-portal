import React, { useState } from 'react';
import { Check, Star, Heart, Shield, Users, Zap, Crown } from 'lucide-react';

const Pricing: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      name: 'Basic',
      icon: Heart,
      price: { monthly: 0, yearly: 0 },
      description: 'Perfect for individuals getting started',
      features: [
        'Basic health profile',
        'Appointment booking (limited)',
        'Health records access',
        'Email support',
        'Basic health tips',
      ],
      popular: false,
    },
    {
      name: 'Premium',
      icon: Shield,
      price: { monthly: 999, yearly: 9999 },
      description: 'Enhanced features for comprehensive care',
      features: [
        'Everything in Basic',
        'Unlimited appointments',
        'Priority booking',
        'Video consultations',
        'Advanced health analytics',
        '24/7 phone support',
        'Prescription management',
        'Health reminders',
      ],
      popular: true,
    },
    {
      name: 'Family',
      icon: Users,
      price: { monthly: 1999, yearly: 19999 },
      description: 'Complete solution for the entire family',
      features: [
        'Everything in Premium',
        'Up to 6 family members',
        'Family health dashboard',
        'Shared appointment calendar',
        'Family health reports',
        'Pediatric consultations',
        'Elder care support',
        'Family wellness plans',
      ],
      popular: false,
    },
    {
      name: 'Enterprise',
      icon: Crown,
      price: { monthly: 4999, yearly: 49999 },
      description: 'Advanced solutions for organizations',
      features: [
        'Everything in Family',
        'Unlimited family members',
        'Custom integrations',
        'Dedicated account manager',
        'Advanced analytics & reporting',
        'API access',
        'White-label options',
        'Priority feature requests',
      ],
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-50 to-secondary-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-4 rounded-2xl shadow-soft">
                <Star className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Simple, Transparent <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Pricing</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
              Choose the perfect plan for your healthcare needs. All plans include our core features 
              with additional benefits as you upgrade.
            </p>
            
            {/* Billing Toggle */}
            <div className="flex items-center justify-center space-x-4">
              <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
                Monthly
              </span>
              <button
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                  billingCycle === 'yearly' ? 'bg-primary-500' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-gray-900' : 'text-gray-500'}`}>
                Yearly
              </span>
              {billingCycle === 'yearly' && (
                <span className="bg-success-100 text-success-800 text-xs font-medium px-2 py-1 rounded-full">
                  Save 17%
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative rounded-2xl p-8 ${
                  plan.popular
                    ? 'bg-gradient-to-br from-accent-50 to-primary-50 border-2 border-accent-200 shadow-large'
                    : 'bg-white border border-gray-200 shadow-soft'
                } hover:shadow-large transition-all duration-300 transform hover:scale-105`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-accent-500 to-primary-500 text-white text-sm font-medium px-4 py-2 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <div className="flex justify-center mb-4">
                    <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-3 rounded-xl">
                      <plan.icon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 text-sm mb-6">{plan.description}</p>
                  
                  <div className="mb-6">
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold text-gray-900">
                        ₹{plan.price[billingCycle]}
                      </span>
                      {plan.price[billingCycle] > 0 && (
                        <span className="text-gray-500 ml-1">
                          /{billingCycle === 'monthly' ? 'mo' : 'year'}
                        </span>
                      )}
                    </div>
                    {plan.price[billingCycle] === 0 && (
                      <span className="text-gray-500 text-sm">Free forever</span>
                    )}
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-3">
                      <Check className="h-5 w-5 text-success-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-3 px-6 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-accent-500 to-primary-500 text-white hover:shadow-glow-primary'
                      : plan.price[billingCycle] === 0
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:shadow-glow-primary'
                  }`}
                >
                  {plan.price[billingCycle] === 0 ? 'Get Started Free' : 'Choose Plan'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Comparison */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Compare Features</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See how our different plans stack up against each other to find the perfect fit for your needs.
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Features</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Basic</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Premium</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Family</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Enterprise</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">Appointments</td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-gray-500">5/month</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Check className="h-5 w-5 text-success-500 mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Check className="h-5 w-5 text-success-500 mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Check className="h-5 w-5 text-success-500 mx-auto" />
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">Video Consultations</td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-gray-400">—</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Check className="h-5 w-5 text-success-500 mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Check className="h-5 w-5 text-success-500 mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Check className="h-5 w-5 text-success-500 mx-auto" />
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">Family Members</td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-gray-500">1</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-gray-500">1</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-gray-500">Up to 6</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-gray-500">Unlimited</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">Priority Support</td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-gray-400">—</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Check className="h-5 w-5 text-success-500 mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Check className="h-5 w-5 text-success-500 mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Check className="h-5 w-5 text-success-500 mx-auto" />
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">Advanced Analytics</td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-gray-400">—</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Check className="h-5 w-5 text-success-500 mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Check className="h-5 w-5 text-success-500 mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Check className="h-5 w-5 text-success-500 mx-auto" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">
              Common questions about our pricing and plans.
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-soft">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Can I change my plan at any time?
              </h3>
              <p className="text-gray-600">
                Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected 
                in your next billing cycle.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-soft">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Is there a free trial available?
              </h3>
              <p className="text-gray-600">
                Yes, all paid plans come with a 14-day free trial. You can cancel anytime during 
                the trial period without being charged.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-soft">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600">
                We accept all major credit cards, PayPal, and bank transfers for annual plans. 
                All payments are processed securely.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of patients who trust HealthPortal for their healthcare needs. 
            Start your journey to better health today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-8 py-3 rounded-xl font-medium hover:shadow-glow-primary transition-all duration-300 transform hover:scale-105">
              Start Free Trial
            </button>
            <button className="border border-primary-500 text-primary-600 px-8 py-3 rounded-xl font-medium hover:bg-primary-50 transition-all duration-300">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing; 