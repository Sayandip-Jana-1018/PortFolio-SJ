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
        className="flex flex-col md:flex-row items-center glassmorphic-card rounded-xl overflow-hidden w-full gap-8 md:gap-12"
        whileHover={{ boxShadow: `0 10px 30px rgba(0, 0, 0, 0.15), 0 0 15px ${accentColor}40` }}
        transition={{ duration: 0.3 }}
      >
        {/* Photo on left - Spacious padding */}
        <div className="w-full md:w-2/5 p-8 flex justify-center items-center">
          <motion.div
            className="relative w-64 h-64 md:w-72 md:h-72 rounded-full overflow-hidden border-4"
            style={{ borderColor: accentColor }}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Image
              src="/second.jpeg"
              alt="Sayandip Jana"
              fill
              sizes="(max-width: 768px) 100vw, 288px"
              className="object-cover"
              style={{ objectPosition: 'center 25%' }} // Moved down slightly to better frame the head
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

        {/* Content on right - Spacious layout */}
        <div className="w-full md:w-3/5 p-8 text-center md:text-left">
          <motion.h3
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: accentColor }}
          >
            Sayandip Jana
          </motion.h3>

          <div className="mb-6">
            <div className="text-xl md:text-2xl font-medium mb-4">
              Data Science Enthusiast | ML Developer
            </div>

            <p className="opacity-80 mb-6 text-base md:text-lg max-w-2xl leading-relaxed">
              I'm a 4th-year B.Tech Computer Science student at LPU with a CGPA of 9.27, passionate about Machine Learning, AI, and building intelligent applications. With strong foundations in data science and full-stack development, I love creating AI-powered solutions that solve real-world problems.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 max-w-xl">
            {[
              { label: 'Machine Learning', value: 'Advanced' },
              { label: 'Data Science', value: 'Enthusiast' },
              { label: 'Full Stack Dev', value: 'Proficient' },
              { label: 'Problem Solving', value: '250+ LeetCode' }
            ].map((item, index) => (
              <div key={item.label} className="flex flex-col">
                <span className="text-sm opacity-70 mb-1">{item.label}</span>
                <span className="font-medium text-lg" style={{ color: accentColor }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfileCard;
