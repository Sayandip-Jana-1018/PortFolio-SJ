import { Project, projects } from './projectsData';
import { moreProjects } from './projectsData2';
import { additionalProjects } from './projectsData3';

// Combine all projects into a single array
export const allProjects: Project[] = [
  ...projects,
  ...moreProjects,
  ...additionalProjects
];

// Get all unique categories from projects
export const getCategories = (): string[] => {
  const categories = new Set<string>();
  
  // Always include 'All' as the first category
  categories.add('All');
  
  // Add all unique categories from projects
  allProjects.forEach(project => {
    categories.add(project.category);
  });
  
  return Array.from(categories);
};

// Filter projects by category
export const filterProjectsByCategory = (category: string): Project[] => {
  if (category === 'All') {
    return allProjects;
  }
  
  return allProjects.filter(project => project.category === category);
};

// Get featured project
export const getFeaturedProject = (): Project | undefined => {
  return allProjects.find(project => project.featured === true);
};

export default {
  allProjects,
  getCategories,
  filterProjectsByCategory,
  getFeaturedProject
};
