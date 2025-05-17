import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { FiMic, FiMicOff } from 'react-icons/fi';

// Import SECTIONS and Gemini API key from VoiceNavigator
const SECTIONS = [
  { id: 'home', name: 'Home' },
  { id: 'about', name: 'About' },
  { id: 'skills', name: 'Skills' },
  { id: 'projects', name: 'Projects' },
  { id: 'education', name: 'Education' },
  { id: 'hackathons', name: 'Hackathons' },
  { id: 'certificates', name: 'Certificates' },
  { id: 'contact', name: 'Contact' }
];

// Gemini API key
const GEMINI_API_KEY = 'AIzaSyCQfaAAO8Tg94plWAytQdyHW0lpoxhFrFo';

// Function to fetch response from Gemini API
const fetchGeminiResponse = async (prompt: string): Promise<string> => {
  console.log('VoiceDebugger: Fetching response from Gemini API for prompt:', prompt);
  try {
    // Mock responses for testing instead of using the actual API
    // This avoids API key issues and rate limiting
    const mockResponses: Record<string, string> = {
      "who is elon musk": "Elon Musk is a technology entrepreneur, investor, and engineer. He is the founder, CEO, and chief engineer/designer of SpaceX, CEO and product architect of Tesla, Inc., founder of The Boring Company, and co-founder of Neuralink and OpenAI.",
      "what is mathematics": "Mathematics is the study of numbers, quantities, shapes, patterns, and logical relationships. It's a fundamental discipline that provides tools for understanding the world, solving problems, and making predictions across various fields including science, engineering, and economics.",
      "tell me about web development": "Web development involves creating websites and web applications. It includes front-end development (what users see and interact with), back-end development (server-side logic and databases), and full-stack development (both). Modern web development uses technologies like HTML, CSS, JavaScript, React, and various frameworks.",
      "what is artificial intelligence": "Artificial Intelligence (AI) is the simulation of human intelligence in machines programmed to think and learn like humans. It encompasses machine learning, natural language processing, computer vision, and more. AI systems can perform tasks that typically require human intelligence, such as visual perception, speech recognition, and decision-making.",
      "what are your features": "As a voice assistant for Sayandip's portfolio, I can help navigate through different sections like Projects, Skills, and Education. I can also answer questions about Sayandip's work, technical skills, and general knowledge topics. Just ask what you'd like to know!"
    };
    
    // Check if we have a mock response for this query or something similar
    const simplifiedPrompt = prompt.toLowerCase().trim();
    let bestMatch = "";
    let highestSimilarity = 0;
    
    // Find the best matching mock response
    for (const key in mockResponses) {
      // Simple similarity check - contains some of the same words
      const words = simplifiedPrompt.split(' ');
      const keyWords = key.split(' ');
      const commonWords = words.filter(word => keyWords.includes(word));
      const similarity = commonWords.length / Math.max(words.length, keyWords.length);
      
      if (similarity > highestSimilarity) {
        highestSimilarity = similarity;
        bestMatch = key;
      }
    }
    
    // If we found a reasonable match, return the mock response
    if (highestSimilarity > 0.3) {
      return mockResponses[bestMatch];
    }
    
    // Default response for unknown queries
    return `Based on your question about "${prompt}", I can tell you that Sayandip Jana is a skilled developer with expertise in web development, AI, and various programming languages. His portfolio showcases projects in these areas. Is there something specific about his work you'd like to know?`;
  } catch (error) {
    console.error('VoiceDebugger: Error with response generation:', error);
    return "I'm sorry, I couldn't process your request right now. Please try again later.";
  }
};

// Simple component to debug speech recognition
const VoiceDebugger: React.FC = () => {
  const { accentColor } = useTheme();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  const [response, setResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  
  // Add a log message
  const addLog = (message: string) => {
    console.log('VoiceDebugger:', message);
    setLogs(prev => [message, ...prev].slice(0, 10)); // Keep last 10 logs
  };
  
  // Initialize speech recognition
  useEffect(() => {
    addLog('Component mounted, checking browser support');
    
    // Check browser support
    if (typeof window !== 'undefined') {
      addLog(`SpeechRecognition available: ${!!window.SpeechRecognition}`);
      addLog(`webkitSpeechRecognition available: ${!!window.webkitSpeechRecognition}`);
      
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        try {
          addLog('Creating SpeechRecognition instance');
          recognitionRef.current = new SpeechRecognition();
          addLog('Recognition instance created successfully');
          
          // Configure recognition
          recognitionRef.current.continuous = false;
          recognitionRef.current.interimResults = false;
          recognitionRef.current.lang = 'en-US';
          addLog('Recognition configured');
          
          // Set up event handlers
          recognitionRef.current.onstart = () => {
            addLog('Recognition started');
            setIsListening(true);
            setError('');
          };
          
          recognitionRef.current.onresult = (event: any) => {
            addLog(`Got result event, results length: ${event.results.length}`);
            try {
              const transcript = event.results[0][0].transcript;
              const confidence = event.results[0][0].confidence;
              addLog(`Transcript: "${transcript}" (confidence: ${confidence.toFixed(2)})`);
              setTranscript(transcript);
              
              // Process the command
              handleVoiceCommand(transcript);
            } catch (err) {
              addLog(`Error processing result: ${err}`);
              setError('Error processing speech result');
            }
          };
          
          recognitionRef.current.onend = () => {
            addLog('Recognition ended');
            setIsListening(false);
          };
          
          recognitionRef.current.onerror = (event: any) => {
            addLog(`Recognition error: ${event.error}`);
            setError(`Error: ${event.error}`);
            setIsListening(false);
          };
          
          addLog('All event handlers set up');
        } catch (err) {
          addLog(`Error setting up recognition: ${err}`);
          setError('Failed to set up speech recognition');
        }
      } else {
        addLog('SpeechRecognition not supported in this browser');
        setError('Speech recognition not supported in this browser');
      }
    }
    
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
          addLog('Recognition aborted on unmount');
        } catch (err) {
          addLog(`Error aborting recognition: ${err}`);
        }
      }
    };
  }, []);
  
  // Toggle listening
  const toggleListening = () => {
    if (isListening) {
      addLog('Stopping recognition');
      try {
        recognitionRef.current?.abort();
      } catch (err) {
        addLog(`Error stopping recognition: ${err}`);
      }
    } else {
      addLog('Starting recognition');
      setTranscript('');
      try {
        recognitionRef.current?.start();
      } catch (err) {
        addLog(`Error starting recognition: ${err}`);
        setError(`Failed to start: ${err}`);
      }
    }
  };
  
  // Function to handle voice commands
  const handleVoiceCommand = async (command: string) => {
    addLog(`Processing command: ${command}`);
    setIsProcessing(true);
    
    // Check for navigation commands with multiple patterns
    const navigationPatterns = [
      // Standard navigation commands
      /(?:go to|navigate to|open|show|take me to) (?:the )?(.*?)( page| section)?$/i,
      // Direct section names
      /^(?:open |show |)(home|about|skills|projects|education|hackathons|certificates|contact)$/i,
      // Commands like "I want to see the about section"
      /(?:I want to see|I'd like to see|show me) (?:the )?(.*?)( page| section)?$/i
    ];
    
    // Check each pattern
    let targetSection = '';
    for (const pattern of navigationPatterns) {
      const match = command.match(pattern);
      if (match) {
        addLog(`Navigation pattern matched: ${pattern}`);
        targetSection = match[1].toLowerCase().trim();
        break;
      }
    }
    
    if (targetSection) {
      addLog(`Target section identified: ${targetSection}`);
      // Find matching section
      const section = SECTIONS.find(s => {
        const nameMatch = s.name.toLowerCase() === targetSection;
        const idMatch = s.id.toLowerCase() === targetSection;
        return nameMatch || idMatch;
      });
      
      if (section) {
        addLog(`Section found, navigating to: ${section.id}`);
        
        // Use the hash-based navigation instead of direct element scrolling
        // This works with the navigation system in index.tsx
        window.location.hash = `#${section.id}`;
        setResponse(`Navigating to ${section.name}`);
        addLog(`Set location hash to: #${section.id}`);
      } else {
        addLog(`Section not found for: ${targetSection}`);
        setResponse(`I couldn't find the ${targetSection} section`);
      }
    } else {
      addLog(`Not a navigation command, using mock response system`);
      // Use mock response system instead of Gemini API
      try {
        const aiResponse = await fetchGeminiResponse(command);
        addLog(`Response generated: ${aiResponse.substring(0, 50)}...`);
        setResponse(aiResponse);
      } catch (error) {
        addLog(`Error generating response: ${error}`);
        setResponse("I'm sorry, I couldn't process your request.");
      }
    }
    
    setIsProcessing(false);
  };
  
  return (
    <div className="fixed top-0 left-0 right-0 z-50 p-4 bg-black/80 text-white">
      <h2 className="text-lg font-bold mb-2">Speech Recognition Debugger</h2>
      
      <div className="flex items-center gap-4 mb-4">
        <button
          className="px-4 py-2 rounded-full flex items-center gap-2"
          style={{ 
            backgroundColor: isListening ? '#ff4b4b20' : `${accentColor}20`,
            border: `2px solid ${isListening ? '#ff4b4b' : accentColor}`
          }}
          onClick={toggleListening}
          disabled={isProcessing}
        >
          {isListening ? (
            <>
              <FiMicOff size={20} color="#ff4b4b" />
              <span>Stop Listening</span>
            </>
          ) : (
            <>
              <FiMic size={20} color={accentColor} />
              <span>Start Listening</span>
            </>
          )}
        </button>
        
        <div className="text-sm">
          Status: <span className={isProcessing ? "text-yellow-400" : isListening ? "text-green-400" : "text-gray-400"}>
            {isProcessing ? "Processing..." : isListening ? "Listening..." : "Idle"}
          </span>
        </div>
      </div>
      
      {error && (
        <div className="mb-4 p-2 bg-red-900/50 rounded text-red-200 text-sm">
          {error}
        </div>
      )}
      
      {transcript && (
        <div className="mb-4 p-2 bg-green-900/50 rounded text-green-200">
          <div className="text-xs text-green-400 mb-1">Transcript:</div>
          <div>{transcript}</div>
        </div>
      )}
      
      {response && (
        <div className="mb-4 p-2 bg-blue-900/50 rounded text-blue-200">
          <div className="text-xs text-blue-400 mb-1">Response:</div>
          <div>{response}</div>
        </div>
      )}
      
      <div className="text-xs text-gray-400 mb-1">Debug Logs:</div>
      <div className="bg-gray-900/50 rounded p-2 max-h-40 overflow-y-auto text-xs">
        {logs.map((log, i) => (
          <div key={i} className="mb-1 border-b border-gray-800 pb-1">
            {log}
          </div>
        ))}
      </div>
      
      <button 
        className="mt-4 text-xs text-gray-400 underline"
        onClick={() => setLogs([])}
      >
        Clear Logs
      </button>
    </div>
  );
};

export default VoiceDebugger;
