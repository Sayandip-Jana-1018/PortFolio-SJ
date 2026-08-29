import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

// Import React Icons
import { 
  SiJavascript, SiPandas, SiNumpy,
  SiOpenai, SiFastapi, SiPrisma, SiSupabase, SiApachehadoop, 
  SiApachespark, SiMysql, SiKubernetes, SiJenkins, SiGithubactions, 
  SiPrometheus, SiGrafana
} from "react-icons/si";
import { FaChartLine, FaSitemap, FaProjectDiagram, FaTree, FaBrain, FaChartBar, FaTable } from "react-icons/fa";

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
  
  // Custom image component with a smart drop-shadow that works on any background
  const TechImg = ({ src, alt }: { src: string, alt: string }) => (
    <img 
      src={src} 
      alt={alt} 
      className="w-11 h-11 object-contain"
      style={{ filter: theme === 'dark' ? 'drop-shadow(0 2px 4px rgba(255,255,255,0.15)) drop-shadow(0 4px 8px rgba(0,0,0,0.5))' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
    />
  );
  
  // Define all the technology categories and their respective icons with colors
  const skillCategories: SkillCategory[] = [
    {
      title: "Languages",
      technologies: [
        { name: "Java", icon: <TechImg src="/skills/java.png" alt="Java" />, color: "#E34F26" },
        { name: "Python", icon: <TechImg src="/skills/python.webp" alt="Python" />, color: "#3776AB" },
        { name: "TypeScript", icon: <TechImg src="/skills/typescript.webp" alt="TypeScript" />, color: "#3178C6" },
        { name: "JavaScript", icon: <SiJavascript />, color: "#F7DF1E" },
        { name: "SQL", icon: <TechImg src="/skills/sql.png" alt="SQL" />, color: "#4479A1" },
      ],
    },
    {
      title: "Data Science & ML",
      technologies: [
        { name: "Pandas", icon: <SiPandas />, color: "#150458" },
        { name: "NumPy", icon: <SiNumpy />, color: "#013243" },
        { name: "Regression", icon: <FaChartLine />, color: "#4CAF50" },
        { name: "Classification", icon: <FaSitemap />, color: "#2196F3" },
        { name: "Clustering", icon: <FaProjectDiagram />, color: "#9C27B0" },
        { name: "Decision Trees", icon: <FaTree />, color: "#009688" },
        { name: "Random Forest", icon: <FaTree />, color: "#388E3C" },
        { name: "PowerBI", icon: <FaChartBar />, color: "#F2C811" },
        { name: "MS Excel", icon: <FaTable />, color: "#217346" },
      ],
    },
    {
      title: "Generative AI",
      technologies: [
        { name: "LangChain", icon: <TechImg src="/skills/langchain.webp" alt="LangChain" />, color: "#1C3C3C" },
        { name: "LangGraph", icon: <TechImg src="/skills/langgraph.png" alt="LangGraph" />, color: "#1C3C3C" },
        { name: "CrewAI", icon: <TechImg src="/skills/creq.png" alt="CrewAI" />, color: "#FF4B4B" },
        { name: "RAG", icon: <FaBrain />, color: "#E91E63" },
        { name: "Vector DBs", icon: <TechImg src="/skills/chroma.png" alt="Chroma" />, color: "#F97316" },
        { name: "OpenAI", icon: <SiOpenai />, color: "#412991" },
        { name: "Gemini", icon: <TechImg src="/skills/gemini.webp" alt="Gemini" />, color: "#1A73E8" },
        { name: "Claude", icon: <TechImg src="/skills/claude.webp" alt="Claude" />, color: "#D97757" },
      ],
    },
    {
      title: "Frameworks",
      technologies: [
        { name: "Next.js", icon: <TechImg src="/skills/nextjs.png" alt="Next.js" />, color: "#000000" },
        { name: "React.js", icon: <TechImg src="/skills/reactjs.webp" alt="React" />, color: "#61DAFB" },
        { name: "Node.js", icon: <TechImg src="/skills/nodejs.webp" alt="Node.js" />, color: "#339933" },
        { name: "FastAPI", icon: <SiFastapi />, color: "#009688" },
        { name: "Prisma", icon: <SiPrisma />, color: "#2D3748" },
        { name: "Tailwind CSS", icon: <TechImg src="/skills/tailwind.webp" alt="Tailwind" />, color: "#06B6D4" },
      ],
    },
    {
      title: "Databases",
      technologies: [
        { name: "PostgreSQL", icon: <TechImg src="/skills/postgre.png" alt="PostgreSQL" />, color: "#336791" },
        { name: "MongoDB", icon: <TechImg src="/skills/mongodb.webp" alt="MongoDB" />, color: "#47A248" },
        { name: "Firebase", icon: <TechImg src="/skills/firebase.png" alt="Firebase" />, color: "#FFCA28" },
        { name: "Supabase", icon: <SiSupabase />, color: "#3ECF8E" },
        { name: "Apache Hadoop", icon: <SiApachehadoop />, color: "#FF6600" },
        { name: "Apache Spark", icon: <SiApachespark />, color: "#E25A1C" },
        { name: "MySQL", icon: <SiMysql />, color: "#4479A1" },
      ],
    },
    {
      title: "DevOps & Cloud",
      technologies: [
        { name: "Git", icon: <TechImg src="/skills/git.webp" alt="Git" />, color: "#F05032" },
        { name: "Docker", icon: <TechImg src="/skills/docker.webp" alt="Docker" />, color: "#2496ED" },
        { name: "Kubernetes", icon: <SiKubernetes />, color: "#326CE5" },
        { name: "Jenkins", icon: <SiJenkins />, color: "#D24939" },
        { name: "GitHub Actions", icon: <SiGithubactions />, color: "#2088FF" },
        { name: "AWS", icon: <TechImg src="/skills/aws.webp" alt="AWS" />, color: "#FF9900" },
        { name: "Prometheus", icon: <SiPrometheus />, color: "#E6522C" },
        { name: "Grafana", icon: <SiGrafana />, color: "#F46800" },
        { name: "Husky", icon: <TechImg src="/skills/husky.png" alt="Husky" />, color: "#000000" },
      ],
    }
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
                  className="h-20 w-20 rounded-full flex items-center justify-center overflow-hidden relative backdrop-blur-md transition-all duration-300"
                  style={{ 
                    // Beautiful tinted glass orb effect
                    background: theme === 'dark' 
                      ? `radial-gradient(circle at 30% 30%, ${technology.color}30, rgba(20,20,30,0.7) 70%)`
                      : `radial-gradient(circle at 30% 30%, ${technology.color}20, rgba(255,255,255,0.8) 70%)`,
                    boxShadow: theme === 'dark'
                      ? `0 8px 20px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.1), 0 0 12px ${technology.color}30`
                      : `0 8px 20px rgba(0,0,0,0.1), inset 0 2px 4px rgba(255,255,255,0.6), 0 0 12px ${technology.color}30`,
                    border: `1px solid ${theme === 'dark' ? `${technology.color}40` : `${technology.color}50`}`
                  }}
                >
                  <div 
                    className="text-4xl flex items-center justify-center w-full h-full" 
                    style={{ 
                      color: technology.color || accentColor,
                      filter: theme === 'dark' ? `drop-shadow(0 2px 4px rgba(0,0,0,0.6))` : `drop-shadow(0 2px 4px rgba(0,0,0,0.2))` 
                    }}
                  >
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
