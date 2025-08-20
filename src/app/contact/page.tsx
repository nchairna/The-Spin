'use client';

import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';

export default function ContactUs() {
  const [showTitle, setShowTitle] = useState(false);
  const [showIcons, setShowIcons] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  // Staggered animation for contact section
  useEffect(() => {
    // Title appears first
    setTimeout(() => {
      setShowTitle(true);
    }, 300);

    // Icons appear second
    setTimeout(() => {
      setShowIcons(true);
    }, 600);

    // Form appears last
    setTimeout(() => {
      setShowForm(true);
    }, 900);

    return () => {
      setShowTitle(false);
      setShowIcons(false);
      setShowForm(false);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Email:', email);
    console.log('Message:', message);
    // You can add email sending logic here
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar currentPage="contact" />
             <div className="px-4 py-10 sm:px-6 lg:px-8">
         <div className="max-w-4xl mx-auto min-h-[calc(100vh-200px)] flex items-center">
                       {/* Contact Section */}
            <div className="flex items-start w-full">
              {/* Left side - Title and Icons */}
              <div className="w-2/3 pr-1 justify-center mt-12">
              <h1 className={`text-5xl lg:text-6xl font-eb-garamond text-[#C72B1B] leading-tight mb-1 transition-all duration-700 ease-out ${
                showTitle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}>
                Contact Us
              </h1>
              
              <div className={`flex space-x-4 transition-all duration-700 ease-out ${
                showIcons ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}>
                                                   {/* Instagram Icon */}
                  <a 
                    href="https://www.instagram.com/thespinpodcast" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-8 h-8 flex items-center justify-center hover:scale-110 transition-transform duration-200"
                  >
                    <svg className="w-6 h-6 text-gray-900 hover:text-[#C72B1B]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                  
                  {/* Email Icon */}
                  <a 
                    href="mailto:hello@thespinpodcast.com" 
                    className="w-8 h-8 flex items-center justify-center hover:scale-110 transition-transform duration-200"
                  >
                    <svg className="w-6 h-6 text-gray-900 hover:text-[#C72B1B]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M0 3v18h24v-18h-24zm21.518 2l-9.518 7.713-9.518-7.713h19.036zm-19.518 14v-11.817l10 8.104 10-8.104v11.817h-20z"/>
                    </svg>
                  </a>
              </div>
            </div>
            
                         {/* Right side - Form */}
             <div className="w-full items-center">
              <form onSubmit={handleSubmit} className={`transition-all duration-700 ease-out ${
                showForm ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}>
                <div className="space-y-6">
                  {/* Email Field */}
                  <div>
                                         <label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-2">
                       Email
                     </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C72B1B] focus:border-transparent transition-all duration-200"
                      placeholder="your@email.com"
                    />
                  </div>
                  
                  {/* Message Field */}
                  <div>
                                         <label htmlFor="message" className="block text-lg font-medium text-gray-700 mb-2">
                       Message
                     </label>
                                         <textarea
                       id="message"
                       value={message}
                       onChange={(e) => setMessage(e.target.value)}
                       required
                       rows={4}
                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C72B1B] focus:border-transparent transition-all duration-200 resize-y"
                       placeholder="Tell us what's on your mind..."
                     />
                  </div>
                  
                  {/* Submit Button */}
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-[#C72B1B] hover:bg-[#B02518] text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
                    >
                      Send Message
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
