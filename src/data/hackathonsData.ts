import { HackathonProject } from "../components/hackathons/HackathonCard";

export const hackathonsData: HackathonProject[] = [
  {
    id: "hack-1",
    name: "Web-A-Thon",
    position: "1st Place 🏆",
    date: "2024",
    location: "Lovely Professional University",
    team: "Team AIREV",
    teamSize: 4,
    project: "Hygieia - Revolutionizing Healthcare",
    description: "Built Hygieia, a full-stack web application bringing healthcare to your fingertips. Features AI-driven disease prediction, real-time doctor consultations, secure medical report uploads with AI-based diagnoses, video consultations via NextJS & Stream, and an AI Health Assistant powered by GPT-4-O with Ayurvedic insights, fitness, and women's health modules.",
    technologies: ["ReactJS", "Next.js", "Python", "Streamlit", "GPT-4-O", "Razorpay", "Twilio", "MongoDB Atlas", "Clerk", "DrizzleJS"],
    link: "",
    image: "/hackathons/WebAThon.jpeg",
    trophy: "gold"
  },
  {
    id: "hack-2",
    name: "Hack IoT Hackathon",
    position: "1st Runner-up 🥈",
    date: "2023",
    location: "Lovely Professional University",
    team: "Code Catalysts",
    teamSize: 4,
    project: "Personalized E-Learning Platform",
    description: "Clinched 1st runner-up position! Developed a game-changing personalized e-learning platform with cutting-edge AI integration. Features include our own CPT-4 chatbot for enhanced user interaction, scientific calculator, robust code editor, and smooth intuitive interface. Built in 2 days of relentless hard work with team Code Catalysts.",
    technologies: ["React", "Node.js", "AI/ML", "CPT-4 Chatbot", "Code Editor", "Scientific Calculator"],
    link: "",
    image: "/hackathons/HackIot.jpeg",
    trophy: "silver"
  },
  {
    id: "hack-3",
    name: "Code-A-Haunt",
    position: "3rd Place 🥉",
    date: "2023",
    location: "Lovely Professional University",
    team: "Code Catalysts",
    teamSize: 4,
    project: "Enhanced E-Learning Platform v2",
    description: "Secured 3rd position in a fierce competition with 250+ teams - our second consecutive victory after Hack-IoT! Revamped our platform with cutting-edge features: CPT-4 powered chatbot, sleek code editor, scientific calculator, interactive dashboard, stunning 3D landing page, live video conferencing, and screen-sharing options. Received a 6-month internship offer from CodingBlocks!",
    technologies: ["React", "Node.js", "Three.js", "WebRTC", "CPT-4", "Video Conferencing", "Screen Sharing"],
    link: "",
    image: "/hackathons/CodeAHaunt.jpeg",
    trophy: "bronze"
  },
  {
    id: "hack-4",
    name: "TechForge-25",
    position: "3rd Place 🥉",
    date: "April 2025",
    location: "LPU, Jalandhar, Punjab",
    team: "Bytes & Bonds",
    teamSize: 2,
    project: "National Level Innovation Project",
    description: "Bagged 3rd Position at the National Level Hackathon TechForge-25 hosted by LPU in association with HoverRobotix | MENTORx! 25th-26th April 2025 was a battlefield of code, caffeine, and creativity. Key learnings included quick ideation under pressure, agile collaboration, and targeted problem-solving for real-world applications.",
    technologies: ["Full Stack", "AI/ML", "Real-time Systems", "Cloud Services"],
    link: "",
    image: "/hackathons/TechForge.jpeg",
    trophy: "bronze"
  },
  {
    id: "hack-5",
    name: "Build A Thon",
    position: "Winner 🏆",
    date: "2025",
    location: "Virtual/On-site",
    team: "Team Innovators",
    teamSize: 3,
    project: "AirFly - Smart Aviation Solution",
    description: "Won Build A Thon with our innovative AirFly project! Developed a cutting-edge aviation solution leveraging AI and real-time data processing for enhanced flight management and passenger experience.",
    technologies: ["React", "Python", "AI/ML", "Real-time Processing", "Cloud APIs"],
    link: "",
    image: "/hackathons/BuildAThon.png",
    trophy: "gold"
  }
];

export const hackathonStats = {
  firstPlace: 2,
  secondPlace: 1,
  thirdPlace: 2,
  specialAwards: 1,
  totalHackathons: 5,
  projectsBuilt: 5,
  teamsLed: 3
};
