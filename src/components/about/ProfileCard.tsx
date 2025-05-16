import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface ProfileCardProps {
  accentColor: string;
  theme: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ accentColor, theme }) => {
  return (
    <div className="w-full">
      <motion.div 
        className="flex flex-col md:flex-row items-center glassmorphic-card rounded-xl overflow-hidden w-full"
        whileHover={{ boxShadow: `0 10px 30px rgba(0, 0, 0, 0.15), 0 0 15px ${accentColor}40` }}
        transition={{ duration: 0.3 }}
      >
        <div className="w-full md:w-1/3 p-6 flex justify-center">
          <motion.div 
            className="relative w-64 h-64 rounded-full overflow-hidden border-4"
            style={{ borderColor: accentColor }}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Image 
              src="/MyPhoto1.jpeg" 
              alt="Sayandip Jana" 
              fill
              sizes="(max-width: 768px) 100vw, 256px"
              className="object-cover"
              priority
            />
            
            {/* Glow effect */}
            <motion.div 
              className="absolute inset-0"
              style={{ 
                boxShadow: `inset 0 0 20px ${accentColor}80`,
                background: `radial-gradient(circle at center, transparent 60%, ${accentColor}40 100%)`
              }}
            />
          </motion.div>
        </div>
        
        <div className="w-full md:w-2/3 p-6">
          <motion.h3 
            className="text-3xl font-bold mb-3"
            style={{ color: accentColor }}
          >
            Sayandip Jana
          </motion.h3>
          
          <div className="mb-4">
            <div className="text-xl font-medium mb-4">
              Full Stack Developer
            </div>
            
            <p className="opacity-80 mb-4">
              I'm a passionate developer and designer with a focus on creating beautiful, functional, and user-friendly applications. With expertise in both frontend and backend technologies, I strive to build seamless digital experiences.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Web Development', value: '5+ years' },
              { label: 'UI/UX Design', value: '4+ years' },
              { label: 'Problem Solving', value: 'Advanced' },
              { label: 'Collaboration', value: 'Team Player' }
            ].map((item, index) => (
              <div key={item.label} className="flex flex-col">
                <span className="text-sm opacity-70">{item.label}</span>
                <span className="font-medium" style={{ color: accentColor }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfileCard;
