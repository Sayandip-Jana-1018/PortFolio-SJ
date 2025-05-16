import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// SectionTitle component removed as it's no longer used

// Import the actual ThemeContext instead of creating a placeholder
import { useTheme as useActualTheme } from '../../context/ThemeContext';

// Use the actual theme context
const useTheme = useActualTheme;

import ProjectCard from '../projects/ProjectCard';
import FeaturedProject from '../projects/FeaturedProject';
import ProjectFilter from '../projects/ProjectFilter';
// BackgroundElements import removed as it's not used
import TitleSection from '../about/TitleSection';
import { allProjects, getCategories, filterProjectsByCategory } from '@/data/allProjectsData';

interface ProjectsPageProps {
  // sectionRef removed as it's not used
}

const ProjectsPage: React.FC<ProjectsPageProps> = () => {
  const { theme, accentColor } = useTheme();
  const [activeCategory, setActiveCategory] = useState('All');
  const [filteredProjects, setFilteredProjects] = useState(allProjects);
  const [categories, setCategories] = useState<string[]>([]);

  // Initialize categories and filtered projects
  useEffect(() => {
    setCategories(getCategories());
    setFilteredProjects(filterProjectsByCategory(activeCategory));
  }, [activeCategory]);

  // Update filtered projects when category changes
  useEffect(() => {
    setFilteredProjects(filterProjectsByCategory(activeCategory));
  }, [activeCategory]);

  // Get the featured project
  const featuredProject = allProjects.find(project => project.featured === true);
  
  // Determine if the featured project should be shown based on the active category
  const shouldShowFeaturedProject = featuredProject && 
    (activeCategory === 'All' || featuredProject.category === activeCategory);

  // Animation variants for container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Animation variants for items
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <section 
      className="relative min-h-screen w-full overflow-hidden py-20 px-4 md:px-8"
      style={{ 
        background: theme === 'dark' 
          ? `linear-gradient(135deg, #000000, #0a0a18, ${accentColor}40)` 
          : `linear-gradient(135deg, #ffffff, #f0f0f5, ${accentColor}20)`,
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        color: theme === 'dark' ? '#ffffff' : '#000000'
      }}
    >

      <div className="container mx-auto relative z-10">
        {/* Section Title with Typing Effect */}
        <div className="mb-12">
          <TitleSection 
            accentColor={accentColor} 
            theme={theme} 
            title="Projects"
            subtitlePrefix="I build"
            subtitles={[
              'Web Applications',
              'Mobile Solutions',
              'Interactive Experiences',
              'Creative Interfaces'
            ]}
          />
        </div>

        {/* Project Filters */}
        <div className="my-8">
          <ProjectFilter 
            categories={categories.filter(cat => cat !== 'All')}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            accentColor={accentColor}
            theme={theme}
          />
        </div>

        {/* Featured Project */}
        {shouldShowFeaturedProject && featuredProject && (
          <motion.div 
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <FeaturedProject project={featuredProject} accentColor={accentColor} theme={theme} />
          </motion.div>
        )}

        {/* Project Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredProjects
            .filter(project => !project.featured || activeCategory !== 'All')
            .map((project, index) => (
              <motion.div key={project.title} variants={itemVariants}>
                <ProjectCard 
                  project={project} 
                  accentColor={accentColor} 
                  theme={theme} 
                  index={index} 
                />
              </motion.div>
            ))}
        </motion.div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <motion.div 
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-xl font-medium mb-2" style={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}>No projects found</h3>
            <p style={{ color: theme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)' }}>
              There are no projects in this category yet. Please check back later or select another category.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default ProjectsPage;