import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

// Import React Icons
import { 
  SiHtml5, SiCss3, SiJavascript, SiTypescript, SiReact, SiRedux,
  SiTailwindcss, SiNextdotjs, SiNodedotjs, SiExpress, SiMongodb,
  SiFirebase, SiPostgresql, SiPython, SiDjango, SiGit,
  SiDocker, SiFigma, SiAmazon, SiThreedotjs, SiVuedotjs,
  SiAngular, SiSvelte, SiGraphql, SiMysql, SiFlutter,
  SiKubernetes, SiJenkins, SiNginx, SiVercel, SiNetlify
} from "react-icons/si";
import { FaCode } from "react-icons/fa";

// Define the technology interface with React icons
interface Technology {
  name: string;
  icon: React.ReactNode;
  color?: string;
}

// Define the category interface
interface SkillCategory {
  title: string;
  technologies: Technology[];
}

const SkillBalls = () => {
  const { theme, accentColor } = useTheme();
  
  // Define all the technology categories and their respective icons with colors
  const skillCategories: SkillCategory[] = [
    {
      title: "Frontend",
      technologies: [
        {
          name: "HTML5",
          icon: <SiHtml5 />,
          color: "#E34F26"
        },
        {
          name: "CSS3",
          icon: <SiCss3 />,
          color: "#1572B6"
        },
        {
          name: "JavaScript",
          icon: <SiJavascript />,
          color: "#F7DF1E"
        },
        {
          name: "TypeScript",
          icon: <SiTypescript />,
          color: "#3178C6"
        },
        {
          name: "React",
          icon: <SiReact />,
          color: "#61DAFB"
        },
        {
          name: "Redux",
          icon: <SiRedux />,
          color: "#764ABC"
        },
        {
          name: "Tailwind CSS",
          icon: <SiTailwindcss />,
          color: "#06B6D4"
        },
        {
          name: "Next.js",
          icon: <SiNextdotjs />,
          color: "#000000"
        },
      ],
    },
    {
      title: "Backend",
      technologies: [
        {
          name: "Node.js",
          icon: <SiNodedotjs />,
          color: "#339933"
        },
        {
          name: "Express.js",
          icon: <SiExpress />,
          color: "#000000"
        },
        {
          name: "MongoDB",
          icon: <SiMongodb />,
          color: "#47A248"
        },
        {
          name: "Firebase",
          icon: <SiFirebase />,
          color: "#FFCA28"
        },
        {
          name: "PostgreSQL",
          icon: <SiPostgresql />,
          color: "#4169E1"
        },
        {
          name: "Python",
          icon: <SiPython />,
          color: "#3776AB"
        },
        {
          name: "Django",
          icon: <SiDjango />,
          color: "#092E20"
        },
        {
          name: "GraphQL",
          icon: <SiGraphql />,
          color: "#E10098"
        },
      ],
    },
    {
      title: "Tools & Others",
      technologies: [
        {
          name: "Git",
          icon: <SiGit />,
          color: "#F05032"
        },
        {
          name: "Docker",
          icon: <SiDocker />,
          color: "#2496ED"
        },
        {
          name: "Figma",
          icon: <SiFigma />,
          color: "#F24E1E"
        },
        {
          name: "AWS",
          icon: <SiAmazon />,
          color: "#FF9900"
        },
        {
          name: "Three.js",
          icon: <SiThreedotjs />,
          color: "#000000"
        },
        {
          name: "Kubernetes",
          icon: <SiKubernetes />,
          color: "#326CE5"
        },
        {
          name: "Vercel",
          icon: <SiVercel />,
          color: "#000000"
        },
        {
          name: "Netlify",
          icon: <SiNetlify />,
          color: "#00C7B7"
        },
      ],
    },
    {
      title: "Frameworks & Libraries",
      technologies: [
        {
          name: "Vue.js",
          icon: <SiVuedotjs />,
          color: "#4FC08D"
        },
        {
          name: "Angular",
          icon: <SiAngular />,
          color: "#DD0031"
        },
        {
          name: "Svelte",
          icon: <SiSvelte />,
          color: "#FF3E00"
        },
        {
          name: "Flutter",
          icon: <SiFlutter />,
          color: "#02569B"
        },
      ],
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto">
      {skillCategories.map((category, categoryIndex) => (
        <motion.div
          key={category.title}
          className="mb-20 text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: categoryIndex * 0.2 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h3 className="text-2xl font-bold mb-10 inline-block px-6 py-2 rounded-full" 
              style={{ 
                backgroundColor: `${accentColor}20`,
                border: `1px solid ${accentColor}40`
              }}>
            {category.title}
          </h3>
          
          <div className="flex flex-wrap justify-center gap-8 mx-auto max-w-5xl">
            {category.technologies.map((technology, techIndex) => (
              <motion.div
                key={technology.name}
                className="flex flex-col items-center mb-6"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  duration: 0.5,
                  delay: techIndex * 0.05 + categoryIndex * 0.1
                }}
                whileHover={{ 
                  scale: 1.15,
                  transition: { duration: 0.3 }
                }}
              >
                <div 
                  className="h-20 w-20 rounded-full flex items-center justify-center"
                  style={{ 
                    background: `radial-gradient(circle at 30% 30%, ${technology.color}, ${technology.color}CC, ${technology.color}99)`,
                    boxShadow: `0 4px 12px rgba(0,0,0,0.3), inset 0 2px 3px rgba(255,255,255,0.3)`
                  }}
                >
                  <div className="text-4xl text-white" style={{ filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.3))' }}>
                    {technology.icon}
                  </div>
                </div>
                <span className="text-xs font-medium mt-3 opacity-80">{technology.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default SkillBalls;
