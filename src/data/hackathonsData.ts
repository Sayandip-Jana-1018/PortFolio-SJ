import { HackathonProject } from "../components/hackathons/HackathonCard";

export const hackathonsData: HackathonProject[] = [
  {
    id: "hack-1",
    name: "Global Health Hackathon",
    position: "1st Place",
    date: "October 2023",
    location: "Virtual",
    team: "Team Hygieia",
    teamSize: 4,
    project: "HygieiaAI - AI-powered health prediction system",
    description: "Developed an AI system that predicts potential health issues based on symptoms and medical history, providing early intervention recommendations. The solution leverages machine learning to analyze patterns in health data and suggest preventive measures.",
    technologies: ["TensorFlow", "Python", "React", "Medical APIs"],
    link: "https://globalhealthhackathon.com",
    image: "/hackathons/hackathon1.jpeg",
    trophy: "gold"
  },
  {
    id: "hack-2",
    name: "Climate Tech Challenge",
    position: "2nd Place",
    date: "July 2023",
    location: "San Francisco, CA",
    team: "EcoInnovators",
    teamSize: 3,
    project: "EcoTrack - Carbon footprint monitoring platform",
    description: "Created a platform that helps users track their carbon footprint and suggests personalized sustainable alternatives to reduce environmental impact. The application includes features for tracking daily activities, transportation choices, and consumption patterns.",
    technologies: ["React Native", "Node.js", "Carbon Footprint API"],
    link: "https://climatetechchallenge.org",
    image: "/hackathons/hackathon2.jpeg",
    trophy: "silver"
  },
  {
    id: "hack-3",
    name: "FinTech Innovation Hackathon",
    position: "Best UI/UX Design",
    date: "March 2023",
    location: "New York, NY",
    team: "FinVision",
    teamSize: 4,
    project: "FinVision - Financial analytics dashboard",
    description: "Designed an intuitive financial analytics dashboard that visualizes spending patterns and provides personalized budget recommendations. The solution includes interactive charts, predictive analytics, and customizable budget categories.",
    technologies: ["Vue.js", "Express", "PostgreSQL", "Plaid API"],
    link: "https://fintechhackathon.com",
    image: "/hackathons/hackathon3.jpeg",
    trophy: "special"
  },
  {
    id: "hack-4",
    name: "Smart Cities Hackathon",
    position: "3rd Place",
    date: "November 2022",
    location: "Chicago, IL",
    team: "Urban Innovators",
    teamSize: 5,
    project: "CityPulse - Urban infrastructure monitoring system",
    description: "Built an IoT-based system for monitoring urban infrastructure, including traffic flow, air quality, and utility usage. The platform provides real-time data visualization and predictive maintenance alerts for city administrators.",
    technologies: ["React", "Firebase", "TensorFlow", "Google Cloud"],
    link: "https://smartcitieshackathon.com",
    image: "/hackathons/hackathon4.jpeg",
    trophy: "bronze"
  },
  {
    id: "hack-5",
    name: "Education Technology Hackathon",
    position: "Most Innovative Solution",
    date: "August 2022",
    location: "Boston, MA",
    team: "LearnLoop",
    teamSize: 3,
    project: "LearnLoop - Adaptive learning platform",
    description: "Developed an adaptive learning platform that personalizes educational content based on student performance and learning style. The system uses AI to identify knowledge gaps and adjust difficulty levels in real-time.",
    technologies: ["React", "Django", "PostgreSQL", "Machine Learning"],
    link: "https://edtechhackathon.com",
    image: "/hackathons/hackathon5.jpeg",
    trophy: "special"
  },
  {
    id: "hack-6",
    name: "Blockchain Innovation Challenge",
    position: "Best Technical Implementation",
    date: "May 2022",
    location: "Austin, TX",
    team: "ChainCoders",
    teamSize: 4,
    project: "SupplyChain - Transparent supply chain tracking",
    description: "Created a blockchain-based solution for transparent supply chain tracking, enabling consumers to verify product origins and manufacturing conditions. The platform includes QR code integration for easy access to product journey information.",
    technologies: ["Ethereum", "Solidity", "React", "Node.js", "IPFS"],
    link: "https://blockchainhackathon.com",
    image: "/hackathons/hackathon2.jpeg",
    trophy: "special"
  }
];

export const hackathonStats = {
  firstPlace: 1,
  secondPlace: 1,
  specialAwards: 3,
  totalHackathons: 6,
  projectsBuilt: 6,
  teamsLed: 4
};
