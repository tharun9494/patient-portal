import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Video, 
  Shield, 
  Clock, 
  Users, 
  Star,
  ArrowRight,
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  Send,
  Heart,
  Activity,
  Stethoscope,
  Award,
  TrendingUp,
  UserCheck,
  Zap,
  Globe
} from 'lucide-react';
import toast from 'react-hot-toast';
import DatabaseSetup from '../components/DatabaseSetup';
import image1 from '../images/image1.jpg'
import image2 from '../images/image2.jpg'
import image3 from '../images/image3.jpg'
import image4 from '../images/image4.jpg'
import logo from '../images/logo.png'
import image6 from '../images/image6.jpg'
import image7 from '../images/image7.jpg'
import { collection, getCountFromServer } from 'firebase/firestore';
import { db } from '../firebase/config';

const Home: React.FC = () => {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [counts, setCounts] = useState({
    patients: 0,
    doctors: 0,
    admins: 0,
  });

  const features = [
    {
      icon: Calendar,
      title: 'Smart Booking',
      description: 'AI-powered appointment scheduling that finds the perfect time slot for you',
      color: 'from-primary-400 to-primary-600',
      bgColor: 'bg-primary-50'
    },
    {
      icon: Video,
      title: 'Telemedicine',
      description: 'High-quality video consultations with certified healthcare professionals',
      color: 'from-accent-400 to-accent-600',
      bgColor: 'bg-accent-50'
    },
    {
      icon: Shield,
      title: 'HIPAA Compliant',
      description: 'Bank-level security ensuring your health data remains private and secure',
      color: 'from-medical-400 to-medical-600',
      bgColor: 'bg-medical-50'
    },
    {
      icon: Activity,
      title: 'Health Analytics',
      description: 'Track your health journey with comprehensive analytics and insights',
      color: 'from-success-400 to-success-600',
      bgColor: 'bg-success-50'
    }
  ];

  const benefits = [
    { icon: Zap, text: 'Instant appointment confirmations' },
    { icon: Globe, text: 'Access from anywhere, anytime' },
    { icon: Heart, text: 'Personalized health recommendations' },
    { icon: UserCheck, text: 'Verified healthcare professionals' },
    { icon: Award, text: 'Insurance claim assistance' },
    { icon: TrendingUp, text: 'Health progress tracking' }
  ];

  const testimonials = [
    {
      name: 'Dr. Sarah Mitchell',
      role: 'Cardiologist',
      content: 'HealthPortal has revolutionized how I connect with my patients. The platform is intuitive and secure.',
      rating: 5,
      image: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=150',
      verified: true
    },
    {
      name: 'Maria Rodriguez',
      role: 'Patient',
      content: 'Booking appointments has never been easier. The online consultations saved me so much time!',
      rating: 5,
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
      verified: true
    },
    {
      name: 'James Wilson',
      role: 'Patient',
      content: 'The health tracking features help me stay on top of my wellness goals. Highly recommended!',
      rating: 5,
      image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150',
      verified: true
    }
  ];

  const stats = [
    { number: counts.patients, label: 'Patients', icon: Users },
    { number: counts.doctors, label: 'Doctors', icon: Stethoscope },
    { number: counts.admins, label: 'Admins', icon: Heart },
    { number: '99.9%', label: 'Uptime', icon: Shield }
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Thank you for your message! We\'ll get back to you soon.');
    setContactForm({ name: '', email: '', message: '' });
  };

  useEffect(() => {
    const fetchCounts = async () => {
      const patientsSnap = await getCountFromServer(collection(db, 'patients'));
      const doctorsSnap = await getCountFromServer(collection(db, 'doctors'));
      const adminsSnap = await getCountFromServer(collection(db, 'admins'));
      setCounts({
        patients: patientsSnap.data().count,
        doctors: doctorsSnap.data().count,
        admins: adminsSnap.data().count,
      });
    };
    fetchCounts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pastel-lightBlue via-white to-pastel-skyBlue">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-pastel-mint to-accent-50 py-20 lg:py-32">
        <div className="absolute inset-0 bg-medical-pattern opacity-30"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-left animate-slide-right">
              <div className="inline-flex items-center bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-soft mb-6">
                <Heart className="h-5 w-5 text-primary-500 mr-2" />
                
                <span className="text-sm font-medium text-gray-700">Trusted by 10+ patients</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                Smart Healthcare.
                <span className="block bg-gradient-to-r from-primary-600 via-accent-600 to-medical-600 bg-clip-text text-transparent">
                  Anywhere, Anytime.
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
                Experience the future of healthcare with our AI-powered platform. 
                Book appointments, connect with doctors, and manage your health journey seamlessly.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link
                  to="/register"
                  className="group bg-gradient-to-r from-primary-500 to-accent-500 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:shadow-glow-primary transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                >
                  <span>Start Your Journey</span>
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/appointments"
                  className="border-2 border-primary-300 text-primary-700 px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-primary-50 transition-all duration-300 flex items-center justify-center"
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  Book Appointment
                </Link>
              </div>
              
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-success-500 mr-2" />
                  <span>No waiting rooms</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-success-500 mr-2" />
                  <span>Instant confirmations</span>
                </div>
              </div>
            </div>
            
            <div className="relative animate-slide-left">
              <div className="relative">
                <img
                  src={image1}
                  alt="Healthcare professionals"
                  className="w-full h-[600px] object-cover rounded-3xl shadow-large"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/20 to-transparent rounded-3xl"></div>
                
                {/* Floating cards */}
                <div className="absolute -top-6 -left-6 bg-white p-4 rounded-2xl shadow-medium animate-float">
                  <div className="flex items-center space-x-3">
                    <div className="bg-success-100 p-2 rounded-lg">
                      <Heart className="h-6 w-6 text-success-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Health Score</p>
                      <p className="text-success-600 font-bold">98/100</p>
                    </div>
                  </div>
                </div>
                
                <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-2xl shadow-medium animate-float" style={{ animationDelay: '1s' }}>
                  <div className="flex items-center space-x-3">
                    <div className="bg-accent-100 p-2 rounded-lg">
                      <Video className="h-6 w-6 text-accent-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Next Consultation</p>
                      <p className="text-accent-600 font-bold">Today 3:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="bg-gradient-to-br from-primary-50 to-accent-50 p-6 rounded-2xl mb-4 group-hover:shadow-medium transition-all duration-300">
                  <stat.icon className="h-8 w-8 text-primary-600 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.number}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-pastel-mint to-pastel-skyBlue">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose HealthPortal?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience healthcare reimagined with cutting-edge technology and compassionate care
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-soft hover:shadow-large transition-all duration-500 transform group-hover:scale-105 h-full">
                  <div className={`bg-gradient-to-r ${feature.color} p-4 rounded-2xl mb-6 w-fit group-hover:animate-pulse-gentle`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="animate-slide-right">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
                Everything You Need for
                <span className="block bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                  Better Health
                </span>
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Our comprehensive platform brings together the best of modern healthcare technology 
                to provide you with an unparalleled medical experience.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3 group">
                    <div className="bg-primary-100 p-2 rounded-lg group-hover:bg-primary-200 transition-colors">
                      <benefit.icon className="h-5 w-5 text-primary-600" />
                    </div>
                    <span className="text-gray-700 font-medium">{benefit.text}</span>
                  </div>
                ))}
              </div>
              
              <Link
                to="/register"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-glow-primary transition-all duration-300 transform hover:scale-105"
              >
                <span>Get Started Today</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
            
            <div className="relative animate-slide-left">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-6">
                  <img
                    src="https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=400"
                    alt="Doctor consultation"
                    className="w-full h-48 object-cover rounded-2xl shadow-medium hover:shadow-large transition-shadow duration-300"
                  />
                  <img
                    src={image2}
                    alt="Medical technology"
                    className="w-full h-64 object-cover rounded-2xl shadow-medium hover:shadow-large transition-shadow duration-300"
                  />
                </div>
                <div className="space-y-6 mt-12">
                  <img
                    src={image3}
                    alt="Healthcare team"
                    className="w-full h-64 object-cover rounded-2xl shadow-medium hover:shadow-large transition-shadow duration-300"
                  />
                  <img
                    src={image4}
                    alt="Patient care"
                    className="w-full h-48 object-cover rounded-2xl shadow-medium hover:shadow-large transition-shadow duration-300"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-pastel-lavender to-pastel-powder">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Trusted by Thousands
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See what our patients and healthcare partners say about their experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="animate-slide-up" style={{ animationDelay: `${index * 0.2}s` }}>
                <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-soft hover:shadow-large transition-all duration-500 transform hover:scale-105 h-full">
                  <div className="flex items-center mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 italic leading-relaxed">"{testimonial.content}"</p>
                  <div className="flex items-center space-x-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <div className="font-semibold text-gray-900">{testimonial.name}</div>
                        {testimonial.verified && (
                          <CheckCircle className="h-4 w-4 text-primary-500" />
                        )}
                      </div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="animate-slide-right">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
                Ready to Transform Your
                <span className="block bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                  Healthcare Experience?
                </span>
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Join thousands of patients who have already discovered a better way to manage their health. 
                Our team is here to support you every step of the way.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-primary-100 p-3 rounded-2xl">
                    <Phone className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">24/7 Support</div>
                    <div className="text-gray-600">+91 89194 03905</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="bg-accent-100 p-3 rounded-2xl">
                    <Mail className="h-6 w-6 text-accent-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Email Support</div>
                    <div className="text-gray-600">forefightera@gmail.com</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="bg-medical-100 p-3 rounded-2xl">
                    <MapPin className="h-6 w-6 text-medical-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Visit Us</div>
                    <div className="text-gray-600">Madnapalle</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="animate-slide-left">
              <div className="bg-gradient-to-br from-primary-50 to-accent-50 p-8 rounded-3xl shadow-large">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h3>
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your email address"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                      placeholder="Tell us how we can help you..."
                      required
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary-500 to-accent-500 text-white px-6 py-4 rounded-xl font-semibold hover:shadow-glow-primary transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                  >
                    <Send className="h-5 w-5" />
                    <span>Send Message</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 via-accent-600 to-medical-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-fade-in">
            Your Health Journey Starts Here
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto animate-slide-up">
            Join the healthcare revolution and experience personalized, accessible, and secure medical care.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <Link
              to="/register"
              className="bg-white text-primary-600 px-8 py-4 rounded-2xl text-lg font-semibold hover:shadow-large transition-all duration-300 transform hover:scale-105"
            >
              Start Free Today
            </Link>
            <Link
              to="/appointments"
              className="border-2 border-white text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-white hover:text-primary-600 transition-all duration-300"
            >
              Book Consultation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;