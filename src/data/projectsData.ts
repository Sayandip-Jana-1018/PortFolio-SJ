// Project data for the portfolio - Sayandip Jana's curated projects
export interface Project {
  title: string;
  description: string;
  image: string;
  technologies: string[];
  github: string;
  live: string;
  category: string;
  codeSnippet: string[];
  codeLanguage: string;
  features: string[];
  screenshots?: string[];
  featured?: boolean;
}

export const projects: Project[] = [
  {
    title: 'AutoForge ML Studio',
    description: 'A no-code/low-code ML platform where nothing runs on your CPU. Upload datasets, train models on Google Vertex AI, and deploy instantly. Features silk-animated hero, live ML terminal simulation, tier-based pricing, cinematic training overlays with 3D morphing spheres, multi-model AI chat (GPT-4, Claude, Gemini), model marketplace, and seamless deployment pipeline.',
    image: '/projects/autoforge.png',
    technologies: ['Next.js 15', 'React 19', 'TypeScript', 'Tailwind', 'Three.js', 'Framer Motion', 'Firebase', 'Vertex AI', 'OpenAI', 'Razorpay'],
    github: 'https://github.com/Sayandip-Jana-1018/AutoML',
    live: 'https://autoforge-ml.vercel.app',
    category: 'AI & Machine Learning',
    codeSnippet: [
      '// AutoForge ML Studio - Training Pipeline',
      'import { VertexAI } from "@google-cloud/vertexai";',
      '',
      'export async function trainModel(config: TrainingConfig) {',
      '  const vertex = new VertexAI({ project: config.projectId });',
      '  ',
      '  // Upload dataset to Cloud Storage',
      '  const datasetUri = await uploadToGCS(config.dataset);',
      '  ',
      '  // Create training job on Vertex AI',
      '  const job = await vertex.createTrainingPipeline({',
      '    displayName: config.modelName,',
      '    trainingTaskDefinition: "tabular-classification",',
      '    inputDataConfig: { datasetId: datasetUri },',
      '    modelToUpload: { displayName: config.modelName }',
      '  });',
      '  ',
      '  // Stream progress via WebSocket',
      '  await streamTrainingProgress(job.id, config.onProgress);',
      '  return job;',
      '}'
    ],
    codeLanguage: 'typescript',
    features: [
      'CSV upload with automatic schema profiling',
      'Training offloaded to Google Vertex AI',
      'Cinematic 3D training overlay with morphing spheres',
      'Multi-model AI Chat (GPT-4, Claude, Gemini)',
      'Model Registry with versioning & lineage',
      'One-click deployment to production endpoints',
      'Model Marketplace with instant testing'
    ],
    screenshots: ['/projects/autoforge.png'],
    featured: true
  }
];

// More projects are in projectsData2.ts
