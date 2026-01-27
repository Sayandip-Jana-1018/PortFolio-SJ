import { Project } from './projectsData';

export const additionalProjects: Project[] = [
  {
    title: 'PowerBI Medical Dashboard',
    description: 'A live, interactive medical dashboard that actually sees you. Features embedded webcam feed inside Power BI, real-time face detection using computer vision, live metrics like blink rate and fatigue score, dark glassy cinematic UI with theme switching, and organ-based navigation. Transforms Power BI from static reporting to real-time ML-powered monitoring.',
    image: '/projects/powerbi.png',
    technologies: ['Power BI', 'Python', 'MediaPipe', 'OpenCV', 'Flask', 'Computer Vision', 'Real-time Streaming'],
    github: '',
    live: '',
    category: 'Data Analytics',
    codeSnippet: [
      '# PowerBI Medical Dashboard - Face Detection',
      'import cv2',
      'import mediapipe as mp',
      'from flask import Flask, Response',
      '',
      'mp_face = mp.solutions.face_mesh',
      '',
      'def generate_frames():',
      '    cap = cv2.VideoCapture(0)',
      '    with mp_face.FaceMesh() as face_mesh:',
      '        while True:',
      '            ret, frame = cap.read()',
      '            results = face_mesh.process(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))',
      '            ',
      '            if results.multi_face_landmarks:',
      '                metrics = calculate_fatigue_score(results)',
      '                update_powerbi_metrics(metrics)',
      '            ',
      '            yield frame'
    ],
    codeLanguage: 'python',
    features: [
      'Live webcam feed embedded in Power BI',
      'Real-time face detection with MediaPipe',
      'Fatigue score & blink rate metrics',
      'Dark glassy cinematic UI',
      'Theme switching & organ navigation',
      'Flask streaming backend'
    ]
  },
  {
    title: 'ConfiOrato AI',
    description: 'A next-gen AI-powered public speaking coach that leverages computer vision and speech recognition for real-time feedback. Features MediaPipe Holistic for body, hand, and facial tracking, TensorFlow.js with WebGL acceleration, custom skeletal visualization with Three.js, speech analysis with filler word detection, and personalized coaching via GPT-4, Gemini, and Claude.',
    image: '/projects/confiorato.png',
    technologies: ['Next.js 15', 'React 19', 'TypeScript', 'MediaPipe', 'TensorFlow.js', 'Three.js', 'WebRTC', 'OpenAI', 'Supabase'],
    github: 'https://github.com/Sayandip-Jana-1018/ConfiOrato-Ai',
    live: '',
    category: 'AI & Communication',
    codeSnippet: [
      '// ConfiOrato - Real-time Body Language Analysis',
      'import * as holistic from "@mediapipe/holistic";',
      '',
      'class BodyLanguageAnalyzer {',
      '  private holistic: holistic.Holistic;',
      '',
      '  async analyze(frame: HTMLVideoElement) {',
      '    const results = await this.holistic.send({ image: frame });',
      '    ',
      '    return {',
      '      posture: this.analyzePosture(results.poseLandmarks),',
      '      gestures: this.analyzeGestures(results.leftHandLandmarks, results.rightHandLandmarks),',
      '      facialExpression: this.analyzeFace(results.faceLandmarks),',
      '      confidenceScore: this.calculateOverallScore()',
      '    };',
      '  }',
      '}'
    ],
    codeLanguage: 'typescript',
    features: [
      'Real-time body language analysis with MediaPipe',
      'TensorFlow.js with WebGL acceleration',
      '3D skeletal visualization with Three.js',
      'Speech analysis & filler word detection',
      'Multi-model AI coaching (GPT, Claude, Gemini)',
      'Personalized improvement plans'
    ]
  },
  {
    title: 'Healthify',
    description: 'A comprehensive health and fitness tracking application that monitors wellness journey with personalized insights. Features BMI calculation, workout tracking with calorie estimation, nutrition logging, and progress visualization with interactive charts.',
    image: '/projects/healthify.png',
    technologies: ['React', 'Node.js', 'MongoDB', 'Express', 'Chart.js', 'TailwindCSS'],
    github: 'https://github.com/Sayandip-Jana-1018/Healthify',
    live: '',
    category: 'Health & Fitness',
    codeSnippet: [
      '// Healthify - Fitness Metrics Calculator',
      'export const calculateBMI = (weight: number, height: number) => {',
      '  const bmi = weight / (height * height);',
      '  return {',
      '    value: bmi.toFixed(1),',
      '    category: getBMICategory(bmi),',
      '    recommendation: getHealthRecommendation(bmi)',
      '  };',
      '};',
      '',
      'export const trackWorkout = async (workout: Workout) => {',
      '  const caloriesBurned = calculateCalories(workout);',
      '  await saveToDatabase({ ...workout, caloriesBurned });',
      '  return updateProgressChart(caloriesBurned);',
      '};'
    ],
    codeLanguage: 'typescript',
    features: [
      'BMI & body metrics tracking',
      'Personalized workout plans',
      'Calorie & nutrition counter',
      'Progress visualization with Chart.js',
      'Health recommendations'
    ]
  }
];
