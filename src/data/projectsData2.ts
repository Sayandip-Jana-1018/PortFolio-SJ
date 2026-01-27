import { Project } from './projectsData';

export const moreProjects: Project[] = [
  {
    title: 'Hygieia Health AI',
    description: 'A comprehensive health management platform leveraging cutting-edge AI. Features multi-agent health system with specialized AI assistants for Ayurvedic medicine, disease recognition, real-time medical document scanner powered by Gemini 2.0 Flash, emergency response with ambulance tracking, disease prediction using XGBoost, smart notifications via Twilio, and seamless Razorpay payments.',
    image: '/projects/hygieia.jpg',
    technologies: ['Next.js 15', 'React 18', 'TypeScript', 'Gemini 2.0', 'XGBoost', 'Mapbox GL', 'Twilio', 'Razorpay', 'Supabase', 'Three.js'],
    github: 'https://github.com/Sayandip-Jana-1018/HygieiaAi',
    live: 'https://hygieia-ai.vercel.app',
    category: 'AI & Healthcare',
    codeSnippet: [
      '# Hygieia - Disease Prediction with XGBoost',
      'import xgboost as xgb',
      'from sklearn.preprocessing import LabelEncoder',
      '',
      'class DiseasePredictionEngine:',
      '    def __init__(self):',
      '        self.model = xgb.XGBClassifier(',
      '            n_estimators=200,',
      '            max_depth=6,',
      '            learning_rate=0.1',
      '        )',
      '',
      '    def predict_from_symptoms(self, symptoms: list) -> dict:',
      '        features = self.encode_symptoms(symptoms)',
      '        probabilities = self.model.predict_proba([features])[0]',
      '        return {',
      '            "predictions": self.get_top_diseases(probabilities),',
      '            "confidence": max(probabilities),',
      '            "recommendations": self.generate_recommendations()',
      '        }'
    ],
    codeLanguage: 'python',
    features: [
      'Multi-Agent Health System (Ayurvedic, Disease, Menstrual)',
      'Real-time Medical Document Scanner with Gemini 2.0',
      'Emergency Ambulance Tracking with Route Optimization',
      'Disease Prediction Engine using XGBoost ML',
      'Smart SMS Notifications via Twilio',
      'Speech-to-Text & Text-to-Speech Accessibility'
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
  }
];

// More projects in projectsData3.ts
