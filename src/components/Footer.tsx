import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    services: [
      { name: 'Book Appointment', path: '/appointments' },
      { name: 'Online Consultation', path: '/consultation' },
      { name: 'Find Doctors', path: '/doctors' },
      { name: 'Health Records', path: '/dashboard' },
    ],
    company: [
      { name: 'About Us', path: '/about' },
      { name: 'Contact Us', path: '/contact' },
      { name: 'Pricing', path: '/pricing' },
    ],
    support: [
      { name: 'Help Center', path: '/help' },
      { name: 'FAQs', path: '/faqs' },
      { name: 'Patient Support', path: '/support' },
      { name: 'Emergency Contact', path: '/emergency' },
    ],
    legal: [
      { name: 'Privacy Policy', path: '/privacy' },
      { name: 'Terms & Conditions', path: '/terms' },
      { name: 'Cancellation/Refund Policy', path: '/cancellation-refund' },
    ],
  };

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: 'https://facebook.com' },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com' },
    { name: 'Instagram', icon: Instagram, href: 'https://instagram.com' },
    { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com' },
    { name: 'YouTube', icon: Youtube, href: 'https://youtube.com' },
  ];

  return (
    <footer className="bg-white border-t border-gray-100 shadow-soft">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-3 group mb-6">
              <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-2.5 rounded-xl shadow-soft group-hover:shadow-glow-primary transition-all duration-300">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                HealthPortal
              </span>
            </Link>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              Your trusted partner in healthcare. We provide comprehensive medical services 
              with a focus on patient care and modern technology.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-600 text-sm">
                <Phone className="h-4 w-4 text-primary-500" />
                <span>+91 22 1234 5678</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600 text-sm">
                <Mail className="h-4 w-4 text-primary-500" />
                <span>support@healthportal.com</span>
              </div>
              <div className="flex items-start space-x-3 text-gray-600 text-sm">
                <MapPin className="h-4 w-4 text-primary-500 mt-0.5" />
                <span>123 Medical Center Dr, Healthcare City, HC 12345</span>
              </div>
            </div>
          </div>

          {/* Services Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Our Services</h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-600 hover:text-primary-600 text-sm transition-colors duration-200 hover:translate-x-1 transform inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-600 hover:text-primary-600 text-sm transition-colors duration-200 hover:translate-x-1 transform inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-600 hover:text-primary-600 text-sm transition-colors duration-200 hover:translate-x-1 transform inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-600 hover:text-primary-600 text-sm transition-colors duration-200 hover:translate-x-1 transform inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Media & Newsletter */}
        <div className="mt-12 pt-8 border-t border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Social Media */}
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">Follow us:</span>
              <div className="flex space-x-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl flex items-center justify-center hover:shadow-glow-primary transition-all duration-300 transform hover:scale-110"
                    aria-label={social.name}
                  >
                    <social.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-700">Stay updated:</span>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-2 border border-gray-200 rounded-l-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button className="px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-sm font-medium rounded-r-xl hover:shadow-glow-primary transition-all duration-300 transform hover:scale-105">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-600">
              © {currentYear} HealthPortal. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <Link to="/privacy" className="hover:text-primary-600 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-primary-600 transition-colors">
                Terms & Conditions
              </Link>
              <Link to="/cancellation-refund" className="hover:text-primary-600 transition-colors">
                Cancellation/Refund Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 