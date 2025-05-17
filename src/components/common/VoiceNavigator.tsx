import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useParticles } from '../../context/ParticlesContext';
import { FiMic, FiMicOff } from 'react-icons/fi';

// Define SpeechRecognition types
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly length: number;
  readonly isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives?: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: ((event: Event) => void) | null;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

// Initialize sections for navigation
const SECTIONS = [
  { id: 'home', name: 'Home' },
  { id: 'about', name: 'About' },
  { id: 'skills', name: 'Skills' },
  { id: 'projects', name: 'Projects' },
  { id: 'education', name: 'Education' },
  { id: 'hackathons', name: 'Hackathons' },
  { id: 'certificates', name: 'Certificates' },
  { id: 'contact', name: 'Contact' },
];

// Voice state types
type VoiceState = 'idle' | 'listening' | 'processing' | 'speaking';

// Voice navigator props
interface VoiceNavigatorProps {
  onNavigate?: (sectionId: string) => void;
}

const VoiceNavigator: React.FC<VoiceNavigatorProps> = ({ onNavigate }) => {
  const { theme, accentColor, toggleTheme, setAccentColor } = useTheme();
  const { toggleCornerParticles, cornerParticlesEnabled } = useParticles();
  
  // State for UI
  const [active, setActive] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [lastActivityTime, setLastActivityTime] = useState(Date.now());
  const [musicPlaying, setMusicPlaying] = useState(false);
  
  // Refs
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize client-side state
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Initialize audio player
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio('/water.mp3');
      audioRef.current.loop = true;
      audioRef.current.volume = 0.5;
    }
  }, []);

  // Initialize speech recognition and synthesis
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Speech Recognition setup
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true; // Enable continuous recognition
        recognitionRef.current.interimResults = true; // Get interim results for faster feedback
        if ('maxAlternatives' in recognitionRef.current) {
          // TypeScript doesn't know about this property, but it exists in Chrome
          (recognitionRef.current as any).maxAlternatives = 3;
        }
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event) => {
          // Get the most recent result
          const lastResultIndex = event.results.length - 1;
          const result = event.results[lastResultIndex];
          
          // Check if this is a final result
          if (result.isFinal) {
            // Get the transcript with highest confidence
            let bestTranscript = '';
            let bestConfidence = 0;
            
            for (let i = 0; i < result.length; i++) {
              if (result[i].confidence > bestConfidence) {
                bestConfidence = result[i].confidence;
                bestTranscript = result[i].transcript;
              }
            }
            
            // Log all alternatives for debugging
            for (let i = 0; i < result.length; i++) {
              console.log(`Alternative ${i}: "${result[i].transcript}" (confidence: ${result[i].confidence.toFixed(2)})`);
            }
            
            const transcript = bestTranscript.toLowerCase().trim();
            console.log('Final transcript:', transcript, 'with confidence:', bestConfidence.toFixed(2));
            
            // Only process if we have a meaningful transcript
            if (transcript && transcript.length > 1) {
              setTranscript(transcript);
              handleVoiceCommand(transcript);
              setLastActivityTime(Date.now());
            } else {
              console.log('Ignoring empty or too short transcript');
            }
          } else {
            // Show interim results
            const interimTranscript = result[0].transcript;
            console.log('Interim transcript:', interimTranscript);
          }
        };

        recognitionRef.current.onend = () => {
          console.log('Speech recognition ended');
          if (active) {
            setVoiceState('idle');
            // Restart recognition if still active
            try {
              // Add a small delay and check if recognition is not already running
              setTimeout(() => {
                // Check if we're still active before restarting
                if (active && recognitionRef.current) {
                  console.log('Restarting speech recognition');
                  try {
                    recognitionRef.current.start();
                  } catch (error) {
                    if (error.name === 'InvalidStateError') {
                      console.log('Recognition already running, no need to restart');
                    } else {
                      console.error('Error restarting recognition:', error);
                    }
                  }
                }
              }, 300);
            } catch (error) {
              console.error('Error in onend handler:', error);
            }
          }
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setVoiceState('idle');
          
          // Handle specific error types
          if (event.error === 'no-speech') {
            console.log('No speech detected');
            // Don't speak for no-speech errors to avoid annoying the user
          } else if (event.error === 'aborted') {
            console.log('Speech recognition aborted');
          } else if (event.error === 'network') {
            speak("I'm having trouble connecting to the speech recognition service.");
          } else if (event.error === 'not-allowed') {
            speak("I need microphone permission to hear you.");
          } else {
            speak("I couldn't hear you clearly. Please try again.");
          }
          
          // Restart recognition after error if still active
          if (active && event.error !== 'not-allowed') {
            setTimeout(() => {
              try {
                // Check if we're still active and recognition isn't already running
                if (active && recognitionRef.current) {
                  // Try to abort first to ensure clean state
                  try {
                    recognitionRef.current.abort();
                  } catch (abortError) {
                    console.log('Abort not needed before restart');
                  }
                  
                  // Small delay after abort
                  setTimeout(() => {
                    try {
                      recognitionRef.current?.start();
                    } catch (startError) {
                      if (startError.name === 'InvalidStateError') {
                        console.log('Recognition already running, no need to restart');
                      } else {
                        console.error('Error starting recognition after abort:', startError);
                      }
                    }
                  }, 300);
                }
              } catch (error) {
                console.error('Error restarting recognition after error:', error);
              }
            }, 1000);
          }
        };
      }

      // Speech Synthesis setup
      if ('speechSynthesis' in window) {
        synthRef.current = window.speechSynthesis;
      }
    }
    
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (error) {
          console.error('Error stopping recognition on cleanup:', error);
        }
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [active]);

  // Auto-shutdown after inactivity
  useEffect(() => {
    if (!active) return;

    // Set up inactivity timer
    const checkInactivity = () => {
      const now = Date.now();
      const inactiveTime = now - lastActivityTime;

      // Only deactivate if not speaking or processing, and after 10 seconds of inactivity
      if (inactiveTime > 10000 && voiceState !== 'processing' && voiceState !== 'speaking') {
        console.log('Auto-deactivating due to inactivity');
        setActive(false);
        setVoiceState('idle');
        if (recognitionRef.current) {
          try {
            recognitionRef.current.abort();
          } catch (error) {
            console.error('Error stopping recognition on inactivity:', error);
          }
        }
      } else {
        inactivityTimerRef.current = setTimeout(checkInactivity, 1000);
      }
    };

    // Start the inactivity timer
    inactivityTimerRef.current = setTimeout(checkInactivity, 1000);

    return () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, [lastActivityTime, voiceState, active]);

  // Function to handle voice commands
  const handleVoiceCommand = async (command: string) => {
    console.log('Voice Navigator: Processing command:', command);
    setVoiceState('processing');
    setLastActivityTime(Date.now());
    
    // Convert command to lowercase for easier matching
    const lowercaseCommand = command.toLowerCase().trim();

    // Check for theme switching commands
    if (/^(switch|toggle|change|turn on|enable) (to )?(dark|light) (mode|theme)$/i.test(lowercaseCommand) ||
        lowercaseCommand === 'dark mode' || lowercaseCommand === 'light mode') {
      const targetTheme = lowercaseCommand.includes('dark') ? 'dark' : 'light';
      if (targetTheme !== theme) {
        toggleTheme();
        speak(`Switching to ${targetTheme} mode`);
      } else {
        speak(`Already in ${targetTheme} mode`);
      }
      setVoiceState('idle');
      return;
    }
    
    // Check for accent color commands
    const colorMatch = lowercaseCommand.match(/^(change|set|switch) (accent |theme )?(color to |to )?(red|blue|green|yellow|pink|purple|orange)$/i);
    if (colorMatch) {
      const color = colorMatch[4].toLowerCase();
      let hexColor = '';
      
      // Map color names to hex values
      switch (color) {
        case 'red': hexColor = '#FF4136'; break;
        case 'blue': hexColor = '#0074D9'; break;
        case 'green': hexColor = '#2ECC40'; break;
        case 'yellow': hexColor = '#FFDC00'; break;
        case 'pink': hexColor = '#F012BE'; break;
        case 'purple': hexColor = '#B10DC9'; break;
        case 'orange': hexColor = '#FF851B'; break;
        default: hexColor = '#0074D9'; break;
      }
      
      setAccentColor(hexColor);
      speak(`Changed accent color to ${color}`);
      setVoiceState('idle');
      return;
    }
    
    // Check for particle toggle commands
    if (/^(toggle|turn|switch) (on|off) particles$/i.test(lowercaseCommand) ||
        /^(show|hide) particles$/i.test(lowercaseCommand)) {
      const turnOn = lowercaseCommand.includes('on') || lowercaseCommand.includes('show');
      toggleCornerParticles();
      speak(turnOn ? 'Turning on particles' : 'Turning off particles');
      setVoiceState('idle');
      return;
    }
    
    // Check for music control commands
    if (/^(play|start) music$/i.test(lowercaseCommand)) {
      if (audioRef.current) {
        audioRef.current.play();
        setMusicPlaying(true);
        speak('Playing background music');
      }
      setVoiceState('idle');
      return;
    }
    
    if (/^(stop|pause) music$/i.test(lowercaseCommand)) {
      if (audioRef.current) {
        audioRef.current.pause();
        setMusicPlaying(false);
        speak('Stopping background music');
      }
      setVoiceState('idle');
      return;
    }

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
      const match = lowercaseCommand.match(pattern);
      if (match) {
        console.log('Voice Navigator: Navigation pattern matched:', pattern);
        targetSection = match[1].toLowerCase().trim();
        break;
      }
    }
    
    // Special case for "homepage"
    if (targetSection === 'homepage') {
      targetSection = 'home';
    }

    if (targetSection) {
      console.log('Voice Navigator: Target section identified:', targetSection);
      // Find matching section
      const section = SECTIONS.find(s => {
        const nameMatch = s.name.toLowerCase() === targetSection;
        const idMatch = s.id.toLowerCase() === targetSection;
        console.log(`Voice Navigator: Checking section ${s.name}: nameMatch=${nameMatch}, idMatch=${idMatch}`);
        return nameMatch || idMatch;
      });

      if (section) {
        console.log('Voice Navigator: Section found, navigating to:', section.id);
        speak(`Navigating to ${section.name}`);
        
        // Use direct scrolling first, then update the hash
        const element = document.getElementById(section.id);
        if (element) {
          // Force scroll to the element
          element.scrollIntoView({ behavior: 'smooth' });
          console.log('Voice Navigator: Direct scrolling to element:', section.id);
          
          // Update the URL hash after scrolling
          setTimeout(() => {
            window.location.hash = `#${section.id}`;
            
            // Double-check scrolling after hash change
            setTimeout(() => {
              element.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }, 50);
        } else {
          // Fallback to hash-based navigation if element not found
          window.location.hash = `#${section.id}`;
        }

        onNavigate && onNavigate(section.id);
      } else {
        console.log('Voice Navigator: Section not found for:', targetSection);
        speak(`I couldn't find the ${targetSection} section`);
      }
    } else {
      console.log('Voice Navigator: Not a navigation command, using response system');
      // Use mock response system for other questions
      try {
        const aiResponse = await fetchResponse(lowercaseCommand);
        console.log('Voice Navigator: Response generated:', aiResponse.substring(0, 50) + '...');
        speak(aiResponse);
      } catch (error) {
        console.error('Voice Navigator: Error generating response:', error);
        speak("I'm sorry, I couldn't process your request.");
      }
    }
    
    setVoiceState('idle');
  };

  // Function to fetch response (using mock responses instead of API)
  const fetchResponse = async (prompt: string): Promise<string> => {
    console.log('VoiceNavigator: Generating response for prompt:', prompt);
    try {
      // Mock responses for testing instead of using the actual API
      const mockResponses: Record<string, string> = {
        "who is elon musk": "Elon Musk is a technology entrepreneur, investor, and engineer. He is the founder, CEO, and chief engineer/designer of SpaceX, CEO and product architect of Tesla, Inc., founder of The Boring Company, and co-founder of Neuralink and OpenAI.",
        "what is mathematics": "Mathematics is the study of numbers, quantities, shapes, patterns, and logical relationships. It's a fundamental discipline that provides tools for understanding the world, solving problems, and making predictions across various fields including science, engineering, and economics.",
        "tell me about web development": "Web development involves creating websites and web applications. It includes front-end development (what users see and interact with), back-end development (server-side logic and databases), and full-stack development (both). Modern web development uses technologies like HTML, CSS, JavaScript, React, and various frameworks.",
        "what is artificial intelligence": "Artificial Intelligence (AI) is the simulation of human intelligence in machines programmed to think and learn like humans. It encompasses machine learning, natural language processing, computer vision, and more. AI systems can perform tasks that typically require human intelligence, such as visual perception, speech recognition, and decision-making.",
        "what are your features": "As a voice assistant for Sayandip's portfolio, I can help navigate through different sections like Projects, Skills, and Education. I can also answer questions about Sayandip's work, technical skills, and general knowledge topics. I can switch themes, change accent colors, toggle particles, and control background music. Just tell me what you'd like to do!",
        "who is sayandip": "Sayandip Jana is a skilled developer with expertise in web development, AI, and various programming languages. His portfolio showcases his projects, skills, education, and achievements.",
        "who created this website": "This portfolio website was created by Sayandip Jana to showcase his skills, projects, and professional experience. It features modern web technologies and interactive elements.",
        "what can you do": "I can help you navigate through the portfolio by voice commands like 'go to projects' or 'show skills'. I can also answer questions, switch between light and dark mode, change the accent color to options like red, blue, or green, toggle particles on or off, and control background music playback.",
        "help": "Here are some commands you can try: 'Go to projects', 'Show skills', 'Switch to dark mode', 'Change color to blue', 'Toggle particles', 'Play music', 'Stop music', or ask me questions like 'Who is Sayandip?'"
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
      console.error('VoiceNavigator: Error with response generation:', error);
      return "I'm sorry, I couldn't process your request right now. Please try again later.";
    }
  };

  // Function to speak text using text-to-speech
  const speak = (text: string) => {
    if (!('speechSynthesis' in window)) {
      console.error('VoiceNavigator: Text-to-speech not supported');
      return;
    }
    
    // Set voice state to speaking to prevent auto-shutdown
    setVoiceState('speaking');
    setLastActivityTime(Date.now());
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    // When speech ends, reset state
    utterance.onend = () => {
      console.log('VoiceNavigator: Speech ended');
      setVoiceState('idle');
      setLastActivityTime(Date.now());
    };
    
    // Get available voices
    let voices = window.speechSynthesis.getVoices();
    
    // If voices array is empty, wait for the voiceschanged event
    if (voices.length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        voices = window.speechSynthesis.getVoices();
        setVoiceAndSpeak();
      };
    } else {
      setVoiceAndSpeak();
    }
    
    function setVoiceAndSpeak() {
      // Filter for English voices only
      const englishVoices = voices.filter(voice => 
        voice.lang.startsWith('en-')
      );
      
      // Try to find a good English voice in this order of preference
      const preferredVoice = englishVoices.find(voice => 
        voice.name.includes('Google US') || 
        voice.name.includes('English') || 
        voice.name.includes('US Female')
      ) || englishVoices[0] || voices.find(voice => 
        voice.lang.startsWith('en-')
      ) || voices[0]; // Final fallback to any voice
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
        console.log('VoiceNavigator: Using voice:', preferredVoice.name, 'Language:', preferredVoice.lang);
      }
      
      window.speechSynthesis.speak(utterance);
      console.log('VoiceNavigator: Speaking:', text);
    }
  };

  // Toggle active state
  const toggleActive = () => {
    console.log('Voice Navigator: Toggle active state, current state:', active ? 'active' : 'inactive');
    if (active) {
      // Deactivate
      setActive(false);
      setVoiceState('idle');
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort(); // Use abort instead of stop for more reliable shutdown
        } catch (error) {
          console.error('Voice Navigator: Error stopping recognition:', error);
        }
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    } else {
      // Activate
      setActive(true);
      setTranscript('');
      console.log('Voice Navigator: Activating...');
      
      // Log available sections for debugging
      console.log('Voice Navigator: Available sections for navigation:');
      SECTIONS.forEach(section => {
        console.log(`- ${section.name} (id: ${section.id})`);
      });
      
      // Check if browser supports speech recognition
      if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
        console.error('Voice Navigator: Speech recognition not supported in this browser');
        speak("I'm sorry, speech recognition is not supported in your browser.");
        setActive(false);
        return;
      }
      
      // Start recognition with a slight delay to allow UI to update
      if (recognitionRef.current) {
        console.log('Voice Navigator: Recognition reference exists, starting in 100ms');
        setTimeout(() => {
          try {
            console.log('Voice Navigator: Starting speech recognition');
            recognitionRef.current?.start();
            setVoiceState('listening');
            speak("Hi, what would you like to know?");
          } catch (error) {
            console.error('Voice Navigator: Error starting recognition:', error);
            speak("I'm having trouble accessing your microphone.");
            setActive(false);
          }
        }, 100);
      } else {
        console.error('Voice Navigator: Speech recognition not available');
        speak("I'm sorry, speech recognition is not supported in your browser.");
        setActive(false);
      }
    }
  };

  // Render the component
  return (
    <div className="relative">
      <motion.button
        onClick={toggleActive}
        className={`flex items-center justify-center w-12 h-12 rounded-full shadow-lg transition-all duration-300 ${
          active ? 'bg-opacity-90' : 'bg-opacity-70'
        }`}
        style={{
          backgroundColor: active ? 
            voiceState === 'listening' ? '#4CAF50' : 
            voiceState === 'processing' ? '#FFC107' : 
            voiceState === 'speaking' ? '#2196F3' : 
            accentColor : 
            theme === 'dark' ? '#333333' : '#f5f5f5',
          boxShadow: active ? `0 0 15px ${accentColor}40` : 'none'
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {active ? <FiMic size={24} color="white" /> : <FiMicOff size={24} color={theme === 'dark' ? 'white' : 'black'} />}
      </motion.button>
      
      {/* Status subtitle */}
      {active && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 text-xs font-medium px-2 py-1 rounded-md text-white"
          style={{ 
            backgroundColor: accentColor,
            minWidth: '100px',
            textAlign: 'center'
          }}
        >
          {voiceState === 'listening' ? 'Listening...' : 
           voiceState === 'processing' ? 'Processing...' : 
           voiceState === 'speaking' ? 'Speaking...' : 'Ready'}
        </motion.div>
      )}
      
      {/* Response display (only if there's a response) */}
      {active && response && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="absolute top-full left-0 mt-10 p-3 rounded-lg text-sm max-w-xs z-50"
          style={{ 
            backgroundColor: `${accentColor}20`,
            border: `1px solid ${accentColor}40`,
            color: theme === 'dark' ? 'white' : 'black',
            backdropFilter: 'blur(5px)',
            maxHeight: '150px',
            overflowY: 'auto'
          }}
        >
          {response}
        </motion.div>
      )}
    </div>
  );
};

export default VoiceNavigator;
