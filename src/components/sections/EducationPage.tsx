import React, { useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import TitleSection from '../about/TitleSection';
import { FiCalendar, FiMapPin, FiAward } from 'react-icons/fi';
import { FaUniversity, FaGraduationCap, FaSchool } from 'react-icons/fa';
import { Canvas } from '@react-three/fiber';
import { PresentationControls, Environment, Float } from '@react-three/drei';
import BackgroundElements from '../about/BackgroundElements';

// 3D Model component for graduation cap
const GraduationCap = () => {
  return (
    <mesh rotation={[0, Math.PI / 4, 0]} scale={1.5}>
      <boxGeometry args={[1, 0.2, 1]} />
      <meshStandardMaterial color="#4b7bff" metalness={0.8} roughness={0.2} />
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.7, 0.7, 0.1, 32]} />
        <meshStandardMaterial color="#4b7bff" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.3, 0]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.8, 0.05, 0.8]} />
        <meshStandardMaterial color="#111" metalness={0.5} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.4, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="gold" metalness={1} roughness={0.1} />
      </mesh>
    </mesh>
  );
};

// 3D Model component for book
const Book = () => {
  return (
    <mesh rotation={[0.2, Math.PI / 6, 0.1]} scale={1.2}>
      {/* Book cover */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.4, 0.1, 2]} />
        <meshStandardMaterial color="#ff5757" metalness={0.3} roughness={0.4} />
      </mesh>
      
      {/* Book pages */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[1.3, 0.2, 1.9]} />
        <meshStandardMaterial color="#f5f5f5" metalness={0.1} roughness={0.5} />
      </mesh>
      
      {/* Book title */}
      <mesh position={[0, 0.06, 1.01]} rotation={[0, 0, 0]}>
        <planeGeometry args={[1, 0.3]} />
        <meshStandardMaterial color="#ff5757" metalness={0.5} roughness={0.2} />
      </mesh>
      
      {/* Book binding */}
      <mesh position={[-0.7, 0.15, 0]}>
        <boxGeometry args={[0.1, 0.3, 2]} />
        <meshStandardMaterial color="#ff5757" metalness={0.3} roughness={0.4} />
      </mesh>
    </mesh>
  );
};

// 3D Model component for certificate
const Certificate = () => {
  return (
    <group rotation={[0.1, Math.PI / 5, 0]} scale={1.3}>
      {/* Certificate paper */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[2, 0.02, 1.5]} />
        <meshStandardMaterial color="#f8f8e8" metalness={0.1} roughness={0.3} />
      </mesh>
      
      {/* Certificate border */}
      <mesh position={[0, 0.02, 0]} rotation={[0, 0, 0]}>
        <ringGeometry args={[0.65, 0.75, 32]} />
        <meshStandardMaterial color="#4CAF50" metalness={0.6} roughness={0.2} />
      </mesh>
      
      {/* Certificate seal */}
      <mesh position={[0.7, 0.04, -0.5]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.05, 32]} />
        <meshStandardMaterial color="gold" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Certificate ribbon */}
      <mesh position={[0.7, 0, -0.6]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.5, 0.02, 0.1]} />
        <meshStandardMaterial color="#4CAF50" metalness={0.3} roughness={0.4} />
      </mesh>
      
      <mesh position={[0.7, 0, -0.6]} rotation={[0, 0, -Math.PI / 4]}>
        <boxGeometry args={[0.5, 0.02, 0.1]} />
        <meshStandardMaterial color="#4CAF50" metalness={0.3} roughness={0.4} />
      </mesh>
    </group>
  );
};

// Education data
const educationData = [
  {
    icon: <FaUniversity size={24} />,
    title: "Bachelor of Technology in Computer Science",
    institution: "XYZ Institute of Technology",
    location: "Kolkata, India",
    period: "2019 - 2023",
    description: "Specialized in Artificial Intelligence and Machine Learning with a focus on computer vision and natural language processing.",
    achievements: [
      "Graduated with First Class Honours",
      "Published research paper on Deep Learning applications",
      "Led the college coding team to national finals"
    ],
    color: "#4b7bff"
  },
  {
    icon: <FaGraduationCap size={24} />,
    title: "Higher Secondary Education",
    institution: "ABC Higher Secondary School",
    location: "Kolkata, India",
    period: "2017 - 2019",
    description: "Completed higher secondary education with a focus on Science, Mathematics, and Computer Science.",
    achievements: [
      "School topper in Computer Science",
      "Won state-level science competition",
      "Developed school management software as final project"
    ],
    color: "#ff5757"
  },
  {
    icon: <FaSchool size={24} />,
    title: "Secondary Education",
    institution: "PQR Secondary School",
    location: "Kolkata, India",
    period: "2015 - 2017",
    description: "Completed secondary education with distinction in Science and Mathematics.",
    achievements: [
      "Ranked in top 5% of state board examinations",
      "Active member of school's science and coding clubs",
      "Received merit scholarship for academic excellence"
    ],
    color: "#4CAF50"
  }
];

interface EducationPageProps {
  sectionRef: React.RefObject<HTMLDivElement>;
}

const EducationPage: React.FC<EducationPageProps> = ({ sectionRef }) => {
  const { theme, accentColor } = useTheme();
  const titleRef = useRef<HTMLDivElement>(null);
  const modelRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<HTMLDivElement>(null);
  const certificateRef = useRef<HTMLDivElement>(null);
  const educationRef = useRef<HTMLDivElement>(null);
  // Create individual refs for each education item
  const educationItemRefs = useRef<React.RefObject<HTMLDivElement>[]>(
    Array(educationData.length).fill(0).map(() => React.createRef<HTMLDivElement>())
  );
  
  // Set up InView hooks for scroll animations
  const isTitleInView = useInView(titleRef, { once: false, margin: "-100px 0px -100px 0px" });
  const isModelInView = useInView(modelRef, { once: false, margin: "-100px 0px -100px 0px" });
  const isBookInView = useInView(bookRef, { once: false, margin: "-100px 0px -100px 0px" });
  const isCertificateInView = useInView(certificateRef, { once: false, margin: "-100px 0px -100px 0px" });
  const isEducationInView = useInView(educationRef, { once: false, margin: "-100px 0px -100px 0px" });
  
  // Animation controls
  const modelControls = useAnimation();
  const bookControls = useAnimation();
  const certificateControls = useAnimation();
  const educationControls = useAnimation();
  
  // Trigger animations when elements come into view
  React.useEffect(() => {
    if (isModelInView) modelControls.start('visible');
    if (isBookInView) bookControls.start('visible');
    if (isCertificateInView) certificateControls.start('visible');
    if (isEducationInView) educationControls.start('visible');
  }, [isModelInView, isBookInView, isCertificateInView, isEducationInView, 
      modelControls, bookControls, certificateControls, educationControls]);
  
  return (
    <div 
      ref={sectionRef} 
      className="min-h-screen relative overflow-hidden"
      id="education"
      style={{ 
        background: theme === 'dark' 
          ? `linear-gradient(135deg, #000000, #0a0a18, ${accentColor}40)` 
          : `linear-gradient(135deg, #ffffff, #f0f0f5, ${accentColor}20)`,
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)'
      }}
    >
      <BackgroundElements accentColor={accentColor} theme={theme} />
      
      {/* Main content container */}
      <div className="container mx-auto px-4 py-20 relative z-10">
        {/* Section title */}
        <motion.div 
          ref={titleRef}
          className="mb-16 text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={isTitleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <TitleSection
            accentColor={accentColor}
            theme={theme}
            title="Education Journey"
            subtitlePrefix="My"
            subtitles={["Academic Background", "Learning Path", "Educational Milestones"]}
          />
          <motion.p 
            className="mt-6 text-lg max-w-2xl mx-auto text-center"
            style={{ color: theme === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' }}
            initial={{ opacity: 0 }}
            animate={isTitleInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            My educational journey has equipped me with the knowledge and skills to excel in the tech industry. 
            Here's a look at my academic path and achievements along the way.
          </motion.p>
        </motion.div>

        
        
        {/* 3D Models and Education Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          {/* 3D Models Column */}
          <div className="lg:col-span-1 space-y-6 md:px-4">
            
            {/* Graduation Cap */}
            <motion.div
              ref={modelRef}
              className="h-[300px] md:h-[310px] rounded-2xl overflow-hidden shadow-xl"
              style={{
                background: theme === 'dark' 
                  ? 'rgba(20, 20, 30, 0.3)' 
                  : 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                boxShadow: `0 20px 80px ${accentColor}20`
              }}
              initial="hidden"
              animate={modelControls}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
              }}
              whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
            >
              <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <PresentationControls
                  global
                  speed={1.5}
                  zoom={0.8}
                  rotation={[0, 0, 0]}
                  polar={[-Math.PI / 4, Math.PI / 4]}
                  azimuth={[-Math.PI / 4, Math.PI / 4]}
                >
                  <Float rotationIntensity={0.4}>
                    <GraduationCap />
                  </Float>
                </PresentationControls>
                <Environment preset="city" />
              </Canvas>
              
            </motion.div>
            
            {/* Book */}
            <motion.div
              ref={bookRef}
              className="h-[300px] md:h-[310px] rounded-2xl overflow-hidden shadow-xl"
              style={{
                background: theme === 'dark' 
                  ? 'rgba(20, 20, 30, 0.3)' 
                  : 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                boxShadow: `0 20px 80px ${educationData[1].color}20`
              }}
              initial="hidden"
              animate={bookControls}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
              }}
              whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
            >
              <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <PresentationControls
                  global
                  speed={1.5}
                  zoom={0.8}
                  rotation={[0, 0, 0]}
                  polar={[-Math.PI / 4, Math.PI / 4]}
                  azimuth={[-Math.PI / 4, Math.PI / 4]}
                >
                  <Float rotationIntensity={0.3}>
                    <Book />
                  </Float>
                </PresentationControls>
                <Environment preset="city" />
              </Canvas>
              
            </motion.div>
            
            {/* Certificate */}
            <motion.div
              ref={certificateRef}
              className="h-[260px] md:h-[275px] rounded-2xl overflow-hidden shadow-xl"
              style={{
                background: theme === 'dark' 
                  ? 'rgba(20, 20, 30, 0.3)' 
                  : 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                boxShadow: `0 20px 80px ${educationData[2].color}20`
              }}
              initial="hidden"
              animate={certificateControls}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
              }}
              whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
            >
              <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <PresentationControls
                  global
                  speed={1.5}
                  zoom={0.8}
                  rotation={[0, 0, 0]}
                  polar={[-Math.PI / 4, Math.PI / 4]}
                  azimuth={[-Math.PI / 4, Math.PI / 4]}
                >
                  <Float rotationIntensity={0.3}>
                    <Certificate />
                  </Float>
                </PresentationControls>
                <Environment preset="city" />
              </Canvas>

            </motion.div>
          </div>
          
          {/* Education Cards */}
          <motion.div
            ref={educationRef}
            className="lg:col-span-2 space-y-6 md:px-4"
            initial="hidden"
            animate={educationControls}
            variants={{
              hidden: { opacity: 0 },
              visible: { 
                opacity: 1,
                transition: { staggerChildren: 0.2 }
              }
            }}
          >

            
            {educationData.map((education, index) => (
              <motion.div 
                key={`education-${index}`}
                ref={educationItemRefs.current[index]}
                className="p-6 rounded-xl shadow-xl"
                style={{
                  background: theme === 'dark' 
                    ? 'rgba(30, 30, 50, 0.4)' 
                    : 'rgba(255, 255, 255, 0.4)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                  boxShadow: `0 10px 30px ${education.color}20`
                }}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
                }}
                whileHover={{
                  scale: 1.02,
                  boxShadow: `0 15px 30px ${education.color}30`
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.8, delay: index * 0.1 }
                }}
                viewport={{ once: false, margin: "-100px 0px -100px 0px" }}
                initial={{ opacity: 0, y: 30 }}
              >
                <div className="flex flex-col md:flex-row gap-4 items-center md:items-start text-center md:text-left">
                  {/* Icon */}
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center md:mr-4 mx-auto md:mx-0 flex-shrink-0"
                    style={{ 
                      background: `linear-gradient(135deg, ${education.color}, ${education.color}80)`,
                      boxShadow: `0 5px 15px ${education.color}40`
                    }}
                  >
                    {React.cloneElement(education.icon, { color: 'white' })}
                  </div>
                  
                  <div className="flex-grow">
                    {/* Title and period */}
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2">
                      <h3 
                        className="text-xl font-bold"
                        style={{ color: theme === 'dark' ? 'white' : 'black' }}
                      >
                        {education.title}
                      </h3>
                      <div className="flex items-center text-sm mt-1 md:mt-0 justify-center md:justify-start">
                        <FiCalendar className="mr-1" style={{ color: education.color }} />
                        <span style={{ color: theme === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' }}>
                          {education.period}
                        </span>
                      </div>
                    </div>
                    
                    {/* Institution and location */}
                    <div className="mb-3">
                      <div 
                        className="text-lg font-medium"
                        style={{ color: education.color }}
                      >
                        {education.institution}
                      </div>
                      <div className="flex items-center text-sm justify-center md:justify-start">
                        <FiMapPin className="mr-1" style={{ color: education.color }} />
                        <span style={{ color: theme === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' }}>
                          {education.location}
                        </span>
                      </div>
                    </div>
                    
                    {/* Description */}
                    <p 
                      className="mb-4 text-sm md:text-base"
                      style={{ color: theme === 'dark' ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)' }}
                    >
                      {education.description}
                    </p>
                    
                    {/* Achievements */}
                    <div>
                      <h4 
                        className="text-sm font-semibold mb-2 flex items-center justify-center md:justify-start"
                        style={{ color: theme === 'dark' ? 'white' : 'black' }}
                      >
                        <FiAward className="mr-1" style={{ color: education.color }} /> Key Achievements
                      </h4>
                      <ul className="list-disc list-inside space-y-1 pl-1 text-center md:text-left">
                        {education.achievements.map((achievement, i) => (
                          <motion.li 
                            key={i} 
                            className="text-sm"
                            style={{ color: theme === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' }}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: false }}
                            transition={{ delay: 0.2 + (i * 0.1), duration: 0.4 }}
                          >
                            {achievement}
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default EducationPage;
