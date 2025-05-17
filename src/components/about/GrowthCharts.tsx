import React from 'react';
import { motion } from 'framer-motion';
import { 
  Chart as ChartJS, 
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { FiTrendingUp, FiActivity } from 'react-icons/fi';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

interface GrowthChartsProps {
  accentColor: string;
  theme: string;
}

const GrowthCharts: React.FC<GrowthChartsProps> = ({ accentColor, theme }) => {
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

  // Years of experience
  const years = ['2019', '2020', '2021', '2022', '2023', '2024'];
  
  // Area chart data - Projects completed over time
  const projectsData = {
    labels: years,
    datasets: [
      {
        fill: true,
        label: 'Projects Completed',
        data: [3, 7, 12, 18, 25, 30],
        borderColor: accentColor,
        backgroundColor: adjustColorOpacity(accentColor, 0.2),
        tension: 0.4,
        pointBackgroundColor: accentColor,
        pointBorderColor: theme === 'dark' ? '#111' : '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  // Line chart data - Skill growth over time
  const skillGrowthData = {
    labels: years,
    datasets: [
      {
        label: 'Frontend',
        data: [60, 65, 75, 80, 90, 95],
        borderColor: adjustColorOpacity(accentColor, 0.9),
        backgroundColor: adjustColorOpacity(accentColor, 0.9),
        tension: 0.3,
        pointBackgroundColor: adjustColorOpacity(accentColor, 0.9),
        pointBorderColor: theme === 'dark' ? '#111' : '#fff',
        pointBorderWidth: 2,
      },
      {
        label: 'Backend',
        data: [50, 60, 70, 75, 80, 85],
        borderColor: adjustColorOpacity(accentColor, 0.6),
        backgroundColor: adjustColorOpacity(accentColor, 0.6),
        tension: 0.3,
        pointBackgroundColor: adjustColorOpacity(accentColor, 0.6),
        pointBorderColor: theme === 'dark' ? '#111' : '#fff',
        pointBorderWidth: 2,
      },
      {
        label: 'DevOps',
        data: [30, 40, 50, 60, 65, 70],
        borderColor: adjustColorOpacity(accentColor, 0.3),
        backgroundColor: adjustColorOpacity(accentColor, 0.3),
        tension: 0.3,
        pointBackgroundColor: adjustColorOpacity(accentColor, 0.3),
        pointBorderColor: theme === 'dark' ? '#111' : '#fff',
        pointBorderWidth: 2,
      },
    ],
  };

  // Chart options
  const areaChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
        },
      },
      x: {
        grid: {
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
        },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
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

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
          callback: function(value: any) {
            return value + '%';
          }
        },
      },
      x: {
        grid: {
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
        },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
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
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ${context.raw}%`;
          }
        }
      },
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
      {/* Area Chart - Projects Growth */}
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
          <span style={{ color: accentColor }}><FiTrendingUp /></span>
          Projects Growth
        </h4>
        <div className="h-[250px] w-full">
          <Line data={projectsData} options={areaChartOptions} />
        </div>
      </motion.div>

      {/* Line Chart - Skills Growth */}
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
          <span style={{ color: accentColor }}><FiActivity /></span>
          Skills Growth
        </h4>
        <div className="h-[250px] w-full">
          <Line data={skillGrowthData} options={lineChartOptions} />
        </div>
      </motion.div>
    </div>
  );
};

export default GrowthCharts;
