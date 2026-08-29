import { Project } from './projectsData';

export const moreProjects: Project[] = [
  {
    title: 'HygieiaAI — AI Healthcare Platform',
    description: 'Developed a scalable health platform utilizing LangGraph to coordinate specialized AI agents for Ayurvedic medicine, disease recognition, and menstrual health analysis. Engineered a medical document scanner with <2s processing time using FastAPI and Gemini 2.0 Flash, achieving >94% accuracy. Integrated Mapbox route optimization, Twilio SMS alerts, and interactive 3D health visualizations (Three.js), enabling a highly responsive patient routing system.',
    image: '/projects/hygieia.jpg',
    technologies: ['Next.js 15', 'React 19', 'TypeScript', 'FastAPI', 'Python', 'Scikit-learn', 'TensorFlow', 'Supabase', 'Gemini AI', 'Plotly.js', 'Three.js', 'Mapbox GL', 'Razorpay', 'Twilio', 'Shadcn UI', 'Docker'],
    github: 'https://github.com/Sayandip-Jana-1018/HygieiaAi',
    live: 'https://hygieia-ai.vercel.app',
    category: 'AI & Healthcare',
    codeSnippet: [
      '# Hygieia - Real-Time Processing Pipeline',
      'import fastapi',
      'from gemini import GeminiFlash2_0',
      '',
      'class MedicalScanner:',
      '    def __init__(self):',
      '        self.model = GeminiFlash2_0()',
      '',
      '    async def process_document(self, doc_image) -> dict:',
      '        analysis = await self.model.analyze(doc_image)',
      '        predictions = await self.run_prediction_pipeline(analysis)',
      '        return {',
      '            "accuracy": ">94%",',
      '            "processing_time": "<2s",',
      '            "results": predictions',
      '        }'
    ],
    codeLanguage: 'python',
    features: [
      'Multi-Agent Ecosystem (LangGraph)',
      'Real-Time Medical Document Scanner (Gemini 2.0 Flash)',
      'Emergency Response Engine with Mapbox',
      'Interactive 3D Health Visualizations',
      'Twilio SMS Alerts',
      'Dockerized Architecture'
    ]
  },
  {
    title: 'SplitX — Smart Expense Splitting',
    description: 'Engineered a dual-algorithm debt settlement engine (Greedy Netting + Exact-Match Pruning) applying System Design principles to minimize transaction volumes by auto-selecting optimal settlement paths. Built a conversational spending assistant using CrewAI / LangGraph, backed by a Vector Database, alongside GPT-4o-mini Vision for <2s receipt parsing. Deployed an end-to-end GitOps pipeline (Docker, Kubernetes, Jenkins, Terraform) with Prometheus metrics.',
    image: '/projects/splitx.png',
    technologies: ['Next.js 16', 'React 19', 'TypeScript', 'Prisma', 'PostgreSQL (Neon)', 'NextAuth v5', 'OpenAI GPT-4o Vision', 'Framer Motion', 'Docker', 'Kubernetes', 'Jenkins', 'Terraform', 'SonarQube', 'Prometheus', 'Grafana', 'GitHub Actions'],
    github: 'https://github.com/Sayandip-Jana-1018/SplitX',
    live: '',
    category: 'Fintech & DevOps',
    codeSnippet: [
      '// SplitX - Algorithmic Debt Settlement',
      'export class SettlementEngine {',
      '  optimizeTransactions(balances: Map<string, number>): Transaction[] {',
      '    // Exact-Match Pruning',
      '    this.matchExactOpposites(balances);',
      '    ',
      '    // Greedy Netting Algorithm',
      '    const debtors = this.getSortedDebtors(balances);',
      '    const creditors = this.getSortedCreditors(balances);',
      '    ',
      '    return this.calculateOptimalPaths(debtors, creditors);',
      '  }',
      '}'
    ],
    codeLanguage: 'typescript',
    features: [
      'Dual-Algorithm Debt Settlement Engine',
      'Conversational Spending Assistant (CrewAI)',
      'GPT-4o-mini Vision Receipt Parsing (<2s)',
      'End-to-End GitOps Pipeline',
      'Kubernetes & Terraform Infrastructure',
      'Prometheus & Grafana Observability'
    ]
  },
  {
    title: 'Research AI Summarizer',
    description: 'A cutting-edge web application that transforms how researchers interact with printed materials. Point your camera at any document and get instant AI-powered summaries. Real-time camera analysis across devices, integration with multiple AI powerhouses (Gemini, GPT, Claude, Mistral), beautiful glassmorphic UI, and lightning-fast OCR processing.',
    image: '/projects/resarchsum.png',
    technologies: ['Next.js 15', 'React 19', 'TypeScript', 'FastAPI', 'Gemini', 'OpenAI', 'Claude', 'Tesseract.js', 'Three.js', 'Supabase'],
    github: 'https://github.com/Sayandip-Jana-1018/ResarchAiSummarizer',
    live: '',
    category: 'AI & Research',
    codeSnippet: [
      '// Research AI Summarizer - Document Pipeline',
      'import Tesseract from "tesseract.js";',
      'import { GoogleGenerativeAI } from "@google/generative-ai";',
      '',
      'async function processDocument(imageData: string) {',
      '  // OCR Text Extraction',
      '  const { data: { text } } = await Tesseract.recognize(',
      '    imageData,',
      '    "eng",',
      '    { logger: m => console.log(m) }',
      '  );',
      '  ',
      '  // AI-Powered Summarization',
      '  const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);',
      '  const model = genAI.getGenerativeModel({ model: "gemini-pro" });',
      '  const result = await model.generateContent(',
      '    `Summarize this research: ${text}`',
      '  );',
      '  return result.response.text();',
      '}'
    ],
    codeLanguage: 'typescript',
    features: [
      'Real-time camera document analysis',
      'Multi-AI integration (Gemini, GPT, Claude, Mistral)',
      'OCR via Tesseract.js',
      'Glassmorphic responsive UI',
      'Performance metrics dashboard',
      '3D elements with Three.js'
    ]
  },
  {
    title: 'AirFly Dashboard',
    description: 'A dynamic Excel-based Airline Dashboard showcasing advanced data visualization. Features customer satisfaction gauges with 100%+ satisfaction score, sales transaction network diagrams ($38.55M volume), financial insights with working capital tracking, and geographical U.S. map visualization with city-wise sales rankings and dynamic route connections.',
    image: '/projects/airfly.png',
    technologies: ['Microsoft Excel', 'Power Query', 'Data Visualization', 'Advanced Charts', 'Gauge Charts', 'Network Diagrams', 'Map Visualization'],
    github: '',
    live: '',
    category: 'Data Analytics',
    codeSnippet: [
      '// AirFly Dashboard - Key Metrics',
      'const dashboardMetrics = {',
      '  totalSalesVolume: "$38.55M",',
      '  topCities: [',
      '    { city: "Denver", sales: "$10.76M", share: "28%" },',
      '    { city: "San Francisco", sales: "$7.73M", share: "20%" },',
      '    { city: "New York", sales: "$6.12M", share: "16%" }',
      '  ],',
      '  customerSatisfaction: "100%+",',
      '  targetIncome: "110%+",',
      '  workingCapital: "$38.55M",',
      '  yearRange: "2021-2025"',
      '};'
    ],
    codeLanguage: 'javascript',
    features: [
      'Customer Satisfaction Gauges & Radial Charts',
      'Sales Transaction Network Diagrams',
      'Financial Performance Tracking (2021-2025)',
      'U.S. Map with City Sales Rankings',
      'Dark-themed UI with Purple/Blue/Pink Accents',
      'Interactive Route Visualization'
    ]
  },
  {
    title: "Sayandip's DSA Cockpit",
    description: 'A premium, highly interactive Data Structures and Algorithms (DSA) learning and tracking platform built to help developers master coding interviews with an elegant, responsive UI. Features intelligent progress tracking, local storage persistence, review later bookmarks, personal notes, community leaderboard, global chat, and a community questions hub.',
    image: '/projects/dsa.png',
    technologies: ['React 18', 'Vite', 'Supabase', 'PostgreSQL', 'Vanilla CSS', 'Framer Motion', 'Lucide React'],
    github: 'https://github.com/Sayandip-Jana-1018/Faang',
    live: 'https://sj-dsa.vercel.app',
    category: 'EdTech & Community',
    codeSnippet: [
      '// DSA Cockpit - Progress Tracker Hook',
      'import { useState, useEffect } from "react";',
      '',
      'export function useProgress() {',
      '  const [progress, setProgress] = useState({});',
      '',
      '  useEffect(() => {',
      '    const saved = localStorage.getItem("dsa-progress");',
      '    if (saved) setProgress(JSON.parse(saved));',
      '  }, []);',
      '',
      '  const markSolved = (problemId: string, difficulty: string) => {',
      '    setProgress(prev => {',
      '      const updated = { ...prev, [problemId]: { status: "solved", difficulty } };',
      '      localStorage.setItem("dsa-progress", JSON.stringify(updated));',
      '      return updated;',
      '    });',
      '  };',
      '',
      '  return { progress, markSolved };',
      '}'
    ],
    codeLanguage: 'typescript',
    features: [
      'Comprehensive Curriculum (437 problems)',
      'Intelligent Progress Tracking (Local Storage)',
      'Review Later & Personal Notes',
      'Community Leaderboard & Profile Sharing',
      'Community Questions Hub (Supabase Edge Functions)',
      'Real-time Global Chat'
    ]
  }
];

// More projects in projectsData3.ts
