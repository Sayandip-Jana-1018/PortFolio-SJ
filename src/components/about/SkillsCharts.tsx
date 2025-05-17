import React from 'react';
import { motion } from 'framer-motion';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { FiPieChart, FiBarChart2 } from 'react-icons/fi';

// Register ChartJS components
ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

interface SkillsChartsProps {
  accentColor: string;
  theme: string;
}

const SkillsCharts: React.FC<SkillsChartsProps> = ({ accentColor, theme }) => {
  // Function to adjust color opacity
  const adjustColorOpacity = (color: string, opacity: number) => {
    if (color.startsWith('#')) {
      // Convert hex to rgba
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    return color;
  };

  // Generate a gradient of colors based on accent color
  const generateColorGradient = (baseColor: string, count: number) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
      const opacity = 0.3 + (i / count) * 0.7; // Vary opacity from 0.3 to 1.0
      colors.push(adjustColorOpacity(baseColor, opacity));
    }
    return colors;
  };

  // Skill categories data for pie chart
  const skillCategories = {
    labels: ['Frontend', 'Backend', 'Mobile', 'DevOps'],
    datasets: [
      {
        data: [40, 30, 15, 15],
        backgroundColor: generateColorGradient(accentColor, 4),
        borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
      },
    ],
  };

  // Skill proficiency data for horizontal bar chart
  const skillProficiency = {
    labels: ['React', 'TypeScript', 'Node.js', 'Python', 'MongoDB', 'AWS'],
    datasets: [
      {
        label: 'Proficiency',
        data: [95, 85, 80, 75, 70, 65],
        backgroundColor: adjustColorOpacity(accentColor, 0.7),
        borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  // Chart options
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
          font: {
            size: 12,
          },
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: theme === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        titleColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)',
        bodyColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
        borderColor: adjustColorOpacity(accentColor, 0.5),
        borderWidth: 1,
      },
    },
  };

  const barOptions = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: theme === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        titleColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)',
        bodyColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
        borderColor: adjustColorOpacity(accentColor, 0.5),
        borderWidth: 1,
        callbacks: {
          label: function(context: any) {
            return `Proficiency: ${context.raw}%`;
          }
        }
      },
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
      {/* Pie Chart */}
      <motion.div 
        className="glassmorphic-card p-6 rounded-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        whileHover={{ 
          y: -5, 
          boxShadow: `0 10px 20px rgba(0, 0, 0, 0.1), 0 0 10px ${accentColor}30` 
        }}
      >
        <h4 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <span style={{ color: accentColor }}><FiPieChart /></span>
          Skill Categories
        </h4>
        <div className="h-[250px] w-full">
          <Pie data={skillCategories} options={pieOptions} />
        </div>
      </motion.div>

      {/* Horizontal Bar Chart */}
      <motion.div 
        className="glassmorphic-card p-6 rounded-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        whileHover={{ 
          y: -5, 
          boxShadow: `0 10px 20px rgba(0, 0, 0, 0.1), 0 0 10px ${accentColor}30` 
        }}
      >
        <h4 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <span style={{ color: accentColor }}><FiBarChart2 /></span>
          Skill Proficiency
        </h4>
        <div className="h-[250px] w-full">
          <Bar data={skillProficiency} options={barOptions} />
        </div>
      </motion.div>
    </div>
  );
};

export default SkillsCharts;
