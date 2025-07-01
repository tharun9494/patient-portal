import React, { useEffect, useState } from 'react';
import { Heart, Users, Award, Shield, CheckCircle, Star, Target, Globe, Zap, Clock } from 'lucide-react';
import image1 from '../images/image1.jpg'
import { collection, getCountFromServer, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

const AboutUs: React.FC = () => {
  const [impactCounts, setImpactCounts] = useState({
    patients: 0,
    doctors: 0,
    cities: 0,
  });

  const team = [
    {
      name: 'Ontimitta Tharun',
      role: 'CEO & Founder',
      image: 'https://echai.ventures/system/users/avatars/000/030/916/small/open-uri20240524-1687716-xqaevw?1716552561',
      description: 'Visionary entrepreneur dedicated to revolutionizing healthcare accessibility and technology.',
      specialties: ['Leadership', 'Healthcare Innovation', 'Business Strategy']
    },
    {
      name: 'Kothala Prem Sai',
      role: 'Co-Founder',
      image: 'https://www.forefightera.in/assets/Prem-D5sTfgQ1.png',
      description: 'Co-founder passionate about building scalable solutions and empowering communities.',
      specialties: ['Operations', 'Community Engagement', 'Growth']
    },
    {
      name: 'T. Chaithanya',
      role: 'CTO',
      image: 'https://media.licdn.com/dms/image/v2/D5603AQGOtJv14naTng/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1710660891487?e=1756944000&v=beta&t=JfDkwdV4TSh95xWbWNFasYj1MUgkchMuRkWbP_f1Qm8',
      description: 'Chief Technology Officer focused on secure, robust, and innovative healthcare platforms.',
      specialties: ['Technology', 'Security', 'Platform Development']
    }
  ];

  const stats = [
    { number: '10+', label: 'Happy Patients', icon: Users },
    { number: '4+', label: 'Expert Doctors', icon: Shield },
    { number: '24/7', label: 'Support Available', icon: Clock },
    { number: '99%', label: 'Satisfaction Rate', icon: Award },
  ];

  const values = [
    {
      icon: Heart,
      title: 'Patient-Centered Care',
      description: 'We put our patients first, ensuring every interaction is focused on their health and well-being.',
    },
    {
      icon: Shield,
      title: 'Trust & Security',
      description: 'Your health data is protected with the highest security standards and privacy measures.',
    },
    {
      icon: Target,
      title: 'Innovation',
      description: 'We leverage cutting-edge technology to provide the best healthcare experience possible.',
    },
    {
      icon: Users,
      title: 'Expert Team',
      description: 'Our team of healthcare professionals is dedicated to providing exceptional care.',
    },
  ];

  const achievements = [
    {
      number: impactCounts.patients,
      label: 'Patients Served',
      description: 'Helping hundreds of thousands manage their health',
      icon: Users,
      color: 'text-primary-600'
    },
    {
      number: impactCounts.doctors,
      label: 'Healthcare Providers',
      description: 'Partnered with top medical professionals',
      icon: Heart,
      color: 'text-secondary-600'
    },
    {
      number: impactCounts.cities,
      label: 'Cities Worldwide',
      description: 'Available across major cities globally',
      icon: Globe,
      color: 'text-accent-600'
    },
    {
      number: '99.9%',
      label: 'Platform Uptime',
      description: 'Reliable platform you can count on',
      icon: Zap,
      color: 'text-success-600'
    }
  ];

  const milestones = [
    {
      year: 'March 2025',
      title: 'Company Founded',
      description: 'Started with a vision to revolutionize healthcare accessibility.'
    }
  ];

  useEffect(() => {
    const fetchCounts = async () => {
      // Patients count
      const patientsSnap = await getCountFromServer(collection(db, 'patients'));
      // Doctors count
      const doctorsSnap = await getCountFromServer(collection(db, 'doctors'));
      // Admins: get unique addresses
      const adminsSnap = await getDocs(collection(db, 'admins'));
      const addressSet = new Set();
      adminsSnap.forEach(doc => {
        const data = doc.data();
        if (data.address) addressSet.add(data.address);
      });

      setImpactCounts({
        patients: patientsSnap.data().count,
        doctors: doctorsSnap.data().count,
        cities: addressSet.size,
      });
    };
    fetchCounts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-50 to-secondary-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-4 rounded-2xl shadow-soft">
                <Heart className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">HealthPortal</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We're revolutionizing healthcare by connecting patients with world-class medical professionals 
              through innovative technology and compassionate care.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-3 rounded-xl">
                    <stat.icon className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                To make quality healthcare accessible to everyone by leveraging technology to connect patients 
                with the best medical professionals, ensuring personalized care and improved health outcomes.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                We believe that everyone deserves access to exceptional healthcare, regardless of their location 
                or circumstances. Our platform bridges the gap between patients and healthcare providers.
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Vision</h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                To become the leading digital healthcare platform that transforms how people access and receive 
                medical care, making healthcare more efficient, accessible, and patient-centered.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                We envision a future where quality healthcare is just a click away, where technology enhances 
                the human touch in medicine, and where every patient feels heard, cared for, and empowered.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These principles guide everything we do and shape the way we serve our patients and partners.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center p-6 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-soft transition-all duration-300">
                <div className="flex justify-center mb-4">
                  <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-3 rounded-xl">
                    <value.icon className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="py-16 bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Story</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Founded with a vision to transform healthcare delivery, HealthPortal emerged from the recognition 
              that quality healthcare should be accessible to everyone, everywhere.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-white p-6 rounded-2xl shadow-soft mb-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">2020</h3>
                <p className="text-gray-600">Founded with a mission to democratize healthcare access</p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white p-6 rounded-2xl shadow-soft mb-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">2022</h3>
                <p className="text-gray-600">Expanded to serve 2+ cities with 10+ healthcare providers</p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white p-6 rounded-2xl shadow-soft mb-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">2024</h3>
                <p className="text-gray-600">Leading digital healthcare platform serving 100+ of patients</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Join Us in Transforming Healthcare
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Whether you're a patient seeking care or a healthcare provider looking to expand your reach, 
            we're here to support your journey towards better health.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-8 py-3 rounded-xl font-medium hover:shadow-glow-primary transition-all duration-300 transform hover:scale-105">
              Get Started Today
            </button>
            <button className="border border-primary-500 text-primary-600 px-8 py-3 rounded-xl font-medium hover:bg-primary-50 transition-all duration-300">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;