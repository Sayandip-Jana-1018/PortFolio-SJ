import React, { useRef, useEffect } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import BackgroundElements from '../about/BackgroundElements';
import VirtualCoach from '../contact/VirtualCoach';
import ContactForm from '../contact/ContactForm';
import SocialLinks from '../contact/SocialLinks';
import ContactInfo from '../contact/ContactInfo';
import FloatingParticles from '../contact/FloatingParticles';

interface ContactPageProps {
  sectionRef: React.RefObject<HTMLDivElement>;
}

const ContactPage: React.FC<ContactPageProps> = ({ sectionRef }) => {
  const { theme, accentColor } = useTheme();
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const modelRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  
  // Check if elements are in view
  const titleInView = useInView(titleRef, { once: false, amount: 0.5 });
  const modelInView = useInView(modelRef, { once: false, amount: 0.3 });
  const formInView = useInView(formRef, { once: false, amount: 0.2 });
  const infoInView = useInView(infoRef, { once: false, amount: 0.2 });
  
  // Animation controls
  const titleControls = useAnimation();
  const modelControls = useAnimation();
  const formControls = useAnimation();
  const infoControls = useAnimation();
  
  // 3D model URL
  const modelUrl = '/models/virtual_coach.glb';
  
  // Update animations when elements come into view
  useEffect(() => {
    if (titleInView) titleControls.start('visible');
    else titleControls.start('hidden');
    
    if (modelInView) modelControls.start('visible');
    else modelControls.start('hidden');
    
    if (formInView) formControls.start('visible');
    else formControls.start('hidden');
    
    if (infoInView) infoControls.start('visible');
    else infoControls.start('hidden');
  }, [titleInView, modelInView, formInView, infoInView, titleControls, modelControls, formControls, infoControls]);
  
  // Animation variants
  const fadeInUpVariant = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };
  
  const fadeInLeftVariant = {
    hidden: { opacity: 0, x: -50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };
  
  const fadeInRightVariant = {
    hidden: { opacity: 0, x: 50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  return (
    <div 
      id="contact" 
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center relative section-container py-20 overflow-hidden"
      style={{ 
        background: theme === 'dark' 
          ? `linear-gradient(135deg, #000000, #0a0a18, ${accentColor}40)` 
          : `linear-gradient(135deg, #ffffff, #f0f0f5, ${accentColor}20)`,
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)'
      }}
    >
      {/* Background Elements */}
      <BackgroundElements accentColor={accentColor} theme={theme} />
      <FloatingParticles accentColor={accentColor} theme={theme} count={12} />
      
      {/* Decorative Lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-0 left-0 w-full h-1 opacity-20"
          style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }}
          animate={{
            opacity: [0.1, 0.3, 0.1],
            backgroundPosition: ['0% 0%', '100% 0%', '0% 0%']
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div 
          className="absolute bottom-0 left-0 w-full h-1 opacity-20"
          style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }}
          animate={{
            opacity: [0.1, 0.3, 0.1],
            backgroundPosition: ['100% 0%', '0% 0%', '100% 0%']
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        />
      </div>
      
      {/* Main Content */}
      <div className="w-full max-w-7xl mx-auto px-4 z-20 content-block">
        {/* Title Section */}
        <motion.div
          ref={titleRef}
          animate={titleControls}
          initial="hidden"
          variants={fadeInUpVariant}
          className="mb-10 text-center"
        >
          <motion.h2 
            className="text-4xl md:text-6xl font-bold mb-4 text-center"
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
            className="text-center max-w-2xl mx-auto opacity-80 text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Have a project in mind or want to collaborate? I'd love to hear from you!
          </motion.p>
        </motion.div>
        
        {/* Main Content Grid - Centered Layout */}
        <div className="max-w-5xl mx-auto">
          {/* Main Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Form Section - Now on the left */}
            <motion.div 
              className="order-1"
              ref={formRef}
              animate={formControls}
              initial="hidden"
              variants={fadeInLeftVariant}
            >
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl">
                <ContactForm accentColor={accentColor} theme={theme} />
              </div>
            </motion.div>
            
            {/* 3D Model Section - Now on the right */}
            <motion.div 
              className="flex items-center justify-center order-2"
              ref={modelRef}
              animate={modelControls}
              initial="hidden"
              variants={fadeInRightVariant}
            >
              <div className="relative w-full aspect-square max-w-md bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 shadow-xl mx-auto">
                <VirtualCoach 
                  modelUrl={modelUrl} 
                  className="w-full h-full rounded-2xl overflow-hidden"
                />
                
                {/* Decorative elements around the 3D model */}
                <motion.div 
                  className="absolute -top-5 -left-5 w-12 h-12 rounded-full"
                  style={{ backgroundColor: accentColor, filter: 'blur(25px)', opacity: 0.6 }}
                  animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div 
                  className="absolute -bottom-5 -right-5 w-16 h-16 rounded-full"
                  style={{ backgroundColor: accentColor, filter: 'blur(25px)', opacity: 0.6 }}
                  animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                />
                
                {/* Caption for the 3D model */}
                <motion.div
                  className="absolute bottom-4 left-4 right-4 bg-black/40 backdrop-blur-md p-3 rounded-lg text-center border border-white/10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5, duration: 0.5 }}
                >
                  <p className="text-sm text-white/90">Interactive 3D Virtual Assistant</p>
                </motion.div>
              </div>
            </motion.div>
          </div>  
            
          {/* Additional Contact Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <motion.div
              ref={infoRef}
              animate={infoControls}
              initial="hidden"
              variants={fadeInUpVariant}
              className="h-full"
            >
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl h-full">
                <ContactInfo accentColor={accentColor} theme={theme} />
              </div>
            </motion.div>
            
            <motion.div
              animate={infoControls}
              initial="hidden"
              variants={fadeInUpVariant}
              transition={{ delay: 0.2 }}
              className="h-full"
            >
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl h-full">
                <SocialLinks accentColor={accentColor} theme={theme} />
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Footer */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <p className="text-sm opacity-60">
            © {new Date().getFullYear()} Sayandip Jana. All rights reserved.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactPage;
