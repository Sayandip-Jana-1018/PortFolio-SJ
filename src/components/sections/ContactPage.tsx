import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { FiMail, FiGithub, FiLinkedin, FiTwitter, FiSend, FiUser, FiMessageSquare } from 'react-icons/fi';
import BackgroundElements from '../about/BackgroundElements';

interface ContactPageProps {
  sectionRef: React.RefObject<HTMLDivElement>;
}

const ContactPage: React.FC<ContactPageProps> = ({ sectionRef }) => {
  const { theme, accentColor } = useTheme();
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormState({ name: '', email: '', message: '' });
      
      // Reset submission status after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    }, 1500);
  };
  
  const socialLinks = [
    { name: 'Email', icon: <FiMail size={20} />, url: 'mailto:contact@example.com' },
    { name: 'GitHub', icon: <FiGithub size={20} />, url: 'https://github.com/yourusername' },
    { name: 'LinkedIn', icon: <FiLinkedin size={20} />, url: 'https://linkedin.com/in/yourusername' },
    { name: 'Twitter', icon: <FiTwitter size={20} />, url: 'https://twitter.com/yourusername' }
  ];

  return (
    <div 
      id="contact" 
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center relative section-container py-20"
      style={{ 
        background: theme === 'dark' 
          ? `linear-gradient(135deg, #000000, #0a0a18, ${accentColor}40)` 
          : `linear-gradient(135deg, #ffffff, #f0f0f5, ${accentColor}20)`,
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)'
      }}
    >
      <BackgroundElements accentColor={accentColor} theme={theme} />
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute top-0 left-0 w-full h-1 opacity-20"
          style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }}
        />
        <motion.div 
          className="absolute bottom-0 left-0 w-full h-1 opacity-20"
          style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }}
        />
      </div>
      
      {/* Content */}
      <motion.div 
        className="w-full max-w-6xl mx-auto px-4 z-20 content-block"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.h2 
          className="text-4xl md:text-5xl font-bold mb-4 text-center"
          style={{ 
            backgroundImage: `linear-gradient(135deg, #fff 0%, ${accentColor} 50%, #fff 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: `0 0 5px rgba(255, 255, 255, 0.1), 0 0 10px ${accentColor}40`
          }}
        >
          Get In Touch
        </motion.h2>
        
        <motion.p 
          className="text-center max-w-2xl mx-auto mb-16 opacity-80"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Have a project in mind or want to collaborate? I'd love to hear from you!
        </motion.p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="glassmorphic-card rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-6">Send a Message</h3>
              
              {isSubmitted ? (
                <motion.div 
                  className="text-center py-8"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <div 
                    className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${accentColor}20` }}
                  >
                    <FiSend size={24} style={{ color: accentColor }} />
                  </div>
                  <h4 className="text-xl font-semibold mb-2">Message Sent!</h4>
                  <p className="opacity-70">Thank you for reaching out. I'll get back to you soon.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2 opacity-80">Your Name</label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 opacity-50">
                        <FiUser />
                      </div>
                      <input 
                        type="text" 
                        name="name"
                        value={formState.name}
                        onChange={handleChange}
                        required
                        className="w-full px-10 py-3 rounded-lg focus:outline-none"
                        style={{ 
                          backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                          border: `1px solid ${accentColor}30`
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2 opacity-80">Your Email</label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 opacity-50">
                        <FiMail />
                      </div>
                      <input 
                        type="email" 
                        name="email"
                        value={formState.email}
                        onChange={handleChange}
                        required
                        className="w-full px-10 py-3 rounded-lg focus:outline-none"
                        style={{ 
                          backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                          border: `1px solid ${accentColor}30`
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2 opacity-80">Your Message</label>
                    <div className="relative">
                      <div className="absolute left-3 top-4 opacity-50">
                        <FiMessageSquare />
                      </div>
                      <textarea 
                        name="message"
                        value={formState.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full px-10 py-3 rounded-lg focus:outline-none"
                        style={{ 
                          backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                          border: `1px solid ${accentColor}30`
                        }}
                      />
                    </div>
                  </div>
                  
                  <motion.button
                    type="submit"
                    className="w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2"
                    style={{ 
                      backgroundColor: accentColor,
                      color: 'white',
                      boxShadow: `0 5px 15px rgba(0, 0, 0, 0.1), 0 0 10px ${accentColor}40`
                    }}
                    whileHover={{ 
                      scale: 1.02,
                      boxShadow: `0 8px 20px rgba(0, 0, 0, 0.15), 0 0 15px ${accentColor}60`
                    }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <FiSend />
                        <span>Send Message</span>
                      </>
                    )}
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>
          
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="glassmorphic-card rounded-xl p-8 h-full flex flex-col">
              <h3 className="text-2xl font-bold mb-6">Connect With Me</h3>
              
              <p className="opacity-80 mb-8">
                Feel free to reach out for collaborations, job opportunities, or just to say hello! I'm always open to discussing new projects and ideas.
              </p>
              
              <div className="space-y-6 mb-8">
                <div>
                  <h4 className="text-lg font-semibold mb-2">Location</h4>
                  <p className="opacity-70">San Francisco, California</p>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold mb-2">Email</h4>
                  <a 
                    href="mailto:contact@example.com" 
                    className="opacity-70 hover:opacity-100 transition-opacity"
                    style={{ color: accentColor }}
                  >
                    contact@example.com
                  </a>
                </div>
              </div>
              
              <h4 className="text-lg font-semibold mb-4">Social Profiles</h4>
              
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((link, index) => (
                  <motion.a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full"
                    style={{ 
                      backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                      border: `1px solid ${accentColor}30`
                    }}
                    whileHover={{ 
                      scale: 1.1, 
                      backgroundColor: accentColor,
                      color: 'white',
                      border: `1px solid ${accentColor}`
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.4, 
                      delay: 0.5 + (index * 0.1),
                      hover: { duration: 0.2 }
                    }}
                    viewport={{ once: true }}
                    aria-label={link.name}
                    title={link.name}
                  >
                    {link.icon}
                  </motion.a>
                ))}
              </div>
              
              <div className="mt-auto pt-8">
                <div 
                  className="w-full h-1 mb-4 rounded-full"
                  style={{ backgroundColor: `${accentColor}20` }}
                />
                <p className="text-sm opacity-60 text-center">
                  © {new Date().getFullYear()} Sayandip Jana. All rights reserved.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ContactPage;
