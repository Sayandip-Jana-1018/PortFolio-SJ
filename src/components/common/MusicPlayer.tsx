import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MdMusicNote, MdMusicOff } from 'react-icons/md';
import { useTheme } from '../../context/ThemeContext';

const MusicPlayer: React.FC = () => {
  const { accentColor, theme } = useTheme();
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element
    audioRef.current = new Audio('/water.mp3');
    audioRef.current.loop = true;
    
    // Clean up on component unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      // Play with a promise to handle autoplay restrictions
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Autoplay started successfully
          })
          .catch(error => {
            // Autoplay was prevented
            console.error('Autoplay prevented:', error);
            setIsPlaying(false);
          });
      }
    }
    
    setIsPlaying(!isPlaying);
  };

  return (
    <motion.button
      onClick={togglePlay}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="p-2 rounded-full flex items-center justify-center"
      style={{ backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
      aria-label={isPlaying ? "Pause music" : "Play music"}
      title={isPlaying ? "Pause music" : "Play music"}
    >
      {isPlaying ? (
        <MdMusicNote style={{ color: accentColor }} size={20} />
      ) : (
        <MdMusicOff style={{ color: accentColor }} size={20} />
      )}
    </motion.button>
  );
};

export default MusicPlayer;
