export interface Certificate {
  id: number;
  title: string;
  issuer: string;
  date: string;
  image: string;
  category: string;
  description: string;
  credentialUrl?: string;
}

export const certificates: Certificate[] = [
  // Merit Certificates (Display First)
  {
    id: 1,
    title: 'Build A Thon',
    issuer: 'LPU',
    date: '2025',
    image: '/certificates/BuildAThon_merit.jpeg',
    category: 'Merit',
    description: 'Merit certificate for outstanding performance in Build A Thon hackathon.'
  },
  {
    id: 2,
    title: 'CSE PathShala',
    issuer: 'LPU',
    date: '2024',
    image: '/certificates/CSEPathSala_merit.jpeg',
    category: 'Merit',
    description: 'Merit certificate for CSE PathShala program excellence.'
  },
  {
    id: 3,
    title: 'Hack IoT',
    issuer: 'LPU',
    date: '2024',
    image: '/certificates/HackIOT_merit.jpeg',
    category: 'Merit',
    description: 'Merit certificate for 1st Runner-up at Hack IoT hackathon.'
  },
  {
    id: 4,
    title: 'MERN Stack',
    issuer: 'LPU',
    date: '2024',
    image: '/certificates/MERN_merit.jpeg',
    category: 'Merit',
    description: 'Merit certificate for MERN stack development excellence.'
  },
  {
    id: 5,
    title: 'Machine Learning Made Easy',
    issuer: 'LPU',
    date: 'July 2025',
    image: '/certificates/ML_merit.jpeg',
    category: 'Merit',
    description: 'Applied feature engineering, model evaluation, and supervised-learning techniques.'
  },
  {
    id: 6,
    title: 'Machine Learning and Deep Learning',
    issuer: 'NPTEL IIT Guwahati',
    date: 'Sep 2025',
    image: '/certificates/NPTEL_merit.jpeg',
    category: 'Merit',
    description: 'NPTEL course on Machine Learning and Deep Learning.'
  },
  {
    id: 7,
    title: 'Summer Training',
    issuer: 'LPU',
    date: '2024',
    image: '/certificates/SummerTraining_merit.jpeg',
    category: 'Merit',
    description: 'Merit certificate for Summer Training program.'
  },
  {
    id: 8,
    title: 'TechForge',
    issuer: 'LPU',
    date: '2025',
    image: '/certificates/TechForge.jpeg',
    category: 'Merit',
    description: 'Merit certificate for TechForge-25 National Level Hackathon.'
  },
  // Technical Certifications
  {
    id: 9,
    title: 'Career Essentials in Software Development',
    issuer: 'Microsoft',
    date: '2024',
    image: '/certificates/Career Essentials.jpeg',
    category: 'Software Development',
    description: 'Comprehensive software development fundamentals and career essentials.'
  },
  {
    id: 10,
    title: 'Data Structures & Algorithms (Java)',
    issuer: 'Apna College',
    date: 'Jun 2024',
    image: '/certificates/DSA (Java).jpeg',
    category: 'Programming',
    description: 'Advanced DSA concepts with Java implementation.'
  },
  {
    id: 11,
    title: 'Coding Blocks Training',
    issuer: 'Coding Blocks',
    date: '2024',
    image: '/certificates/Coding Blocks.jpeg',
    category: 'Programming',
    description: 'Intensive coding training program with 6-month internship offer.'
  },
  {
    id: 12,
    title: 'Computational Theory',
    issuer: 'Coursera',
    date: '2024',
    image: '/certificates/Computational Theory.jpeg',
    category: 'Computer Science',
    description: 'Foundational computational theory and automata.'
  },
  {
    id: 13,
    title: 'Computer Communications',
    issuer: 'Coursera',
    date: '2024',
    image: '/certificates/Computer Communications.jpeg',
    category: 'Networking',
    description: 'Computer communications and network protocols.'
  },
  {
    id: 14,
    title: 'Computer Networking',
    issuer: 'Cisco',
    date: '2024',
    image: '/certificates/Computer Networking.jpeg',
    category: 'Networking',
    description: 'Computer networking fundamentals and protocols.'
  },
  {
    id: 15,
    title: 'Data Analysis',
    issuer: 'Google',
    date: '2024',
    image: '/certificates/Data Analysis.jpeg',
    category: 'Data Science',
    description: 'Data analysis techniques and visualization.'
  },
  {
    id: 16,
    title: 'Data Science',
    issuer: 'IBM',
    date: '2024',
    image: '/certificates/Data Science.jpeg',
    category: 'Data Science',
    description: 'Comprehensive data science methodology and tools.'
  },
  {
    id: 17,
    title: 'Digital Systems',
    issuer: 'Coursera',
    date: '2024',
    image: '/certificates/Digital Systems.jpeg',
    category: 'Computer Science',
    description: 'Digital systems and logic design fundamentals.'
  },
  {
    id: 18,
    title: 'Docker & Kubernetes',
    issuer: 'Docker',
    date: '2024',
    image: '/certificates/Docker K8.jpeg',
    category: 'DevOps',
    description: 'Container orchestration with Docker and Kubernetes.'
  },
  {
    id: 19,
    title: 'Emotional Intelligence',
    issuer: 'LinkedIn Learning',
    date: '2024',
    image: '/certificates/Emotional Intelligence.jpeg',
    category: 'Soft Skills',
    description: 'Developing emotional intelligence for professional growth.'
  },
  {
    id: 20,
    title: 'Mobile App Development',
    issuer: 'Meta',
    date: '2024',
    image: '/certificates/Mobile App.jpeg',
    category: 'Mobile Development',
    description: 'Cross-platform mobile application development.'
  },
  {
    id: 21,
    title: 'Python Programming',
    issuer: 'Coursera',
    date: '2024',
    image: '/certificates/Python.jpeg',
    category: 'Programming',
    description: 'Python programming fundamentals and applications.'
  },
  {
    id: 22,
    title: 'TCS iON Career Edge',
    issuer: 'TCS',
    date: '2024',
    image: '/certificates/TCS Ion.jpeg',
    category: 'Professional',
    description: 'TCS iON Career Edge - Young Professional certification.'
  },
  {
    id: 23,
    title: 'Web Development',
    issuer: 'freeCodeCamp',
    date: '2024',
    image: '/certificates/Web Development.jpeg',
    category: 'Web Development',
    description: 'Full-stack web development certification.'
  },
  // Hackathon Certificates
  {
    id: 24,
    title: 'Hack Adhyay',
    issuer: 'LPU',
    date: '2024',
    image: '/certificates/Hack Adhyay.jpeg',
    category: 'Hackathon',
    description: 'Hack Adhyay hackathon participation.'
  },
  {
    id: 25,
    title: 'Build A Thon',
    issuer: 'Build A Thon',
    date: '2025',
    image: '/certificates/HackMania.jpeg',
    category: 'Hackathon',
    description: 'Build A Thon hackathon winner.'
  },
  {
    id: 26,
    title: 'NeoColab',
    issuer: 'NeoColab',
    date: '2024',
    image: '/certificates/NeoColab.jpeg',
    category: 'Hackathon',
    description: 'NeoColab collaborative hackathon.'
  },
  {
    id: 27,
    title: 'Web-A-Thon',
    issuer: 'AIREV',
    date: '2024',
    image: '/certificates/Web-A-Thon.jpeg',
    category: 'Hackathon',
    description: 'Web-A-Thon 1st Place Winner - Hygieia Project.'
  },
  {
    id: 28,
    title: 'Special Achievement 2024',
    issuer: 'LPU',
    date: '2024',
    image: '/certificates/cer24.jpeg',
    category: 'Achievement',
    description: 'Special achievement certificate 2024.'
  }
];
