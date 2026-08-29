import React from 'react';
import { motion, MotionValue, useTransform } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useParallax } from '../../hooks/useAnimations';
import MaskedHeading from '../common/MaskedHeading';

interface AnimatedTextProps {
  scrollProgress: MotionValue<number>;
  /**
   * 'film' is the treatment for the scroll-frame backdrop. See the note at the
   * name itself for why it does not reuse the video-filled heading.
   */
  variant?: 'default' | 'film';
}

/*
 * There is deliberately no occlusion mask here.
 *
 * Two attempts were made to cut the name around the figure — a radial ellipse
 * and a vertical band — and both looked like damage rather than depth. The
 * reason is structural: a video frame carries no matte, so any mask is a fixed
 * shape guessing at a moving subject. It can only ever be approximately wrong.
 * Real occlusion needs a per-frame alpha channel, which these plates do not
 * have. The name is shown whole.
 */

/** Brushed-chrome fill. Stands in for the video without competing with it. */
const METAL_FILL =
  'linear-gradient(176deg, #ffffff 0%, #e9f1f5 16%, #94aab5 36%, #ffffff 51%, #d0dce3 66%, #7f949f 86%, #f4f8fa 100%)';

// Helper to darken a hex color
const darkenColor = (hex: string, percent: number): string => {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max((num >> 16) - amt, 0);
  const G = Math.max((num >> 8 & 0x00FF) - amt, 0);
  const B = Math.max((num & 0x0000FF) - amt, 0);
  return `#${(1 << 24 | R << 16 | G << 8 | B).toString(16).slice(1)}`;
};

// Helper to lighten a hex color
const lightenColor = (hex: string, percent: number): string => {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min((num >> 16) + amt, 255);
  const G = Math.min((num >> 8 & 0x00FF) + amt, 255);
  const B = Math.min((num & 0x0000FF) + amt, 255);
  return `#${(1 << 24 | R << 16 | G << 8 | B).toString(16).slice(1)}`;
};

const AnimatedText: React.FC<AnimatedTextProps> = ({ scrollProgress, variant = 'default' }) => {
  const isFilm = variant === 'film';
  const { accentColor, theme } = useTheme();
  const nameParallaxRef = useParallax(0.2);
  const titleParallaxRef = useParallax(0.3);

  // Text animation variants
  const nameVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const titleVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.6,
        ease: "easeOut"
      }
    }
  };

  const titleItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  // Calculate opacity based on scroll progress
  const textOpacity = useTransform(scrollProgress, [0, 0.5], [1, 0]);

  // Get text color - Responsive: Black in Light Mode, White in Dark Mode
  const textColor = theme === 'dark' ? '#ffffff' : '#000000';

  // Generate metallic gradient colors based on accent
  const lightAccent = lightenColor(accentColor, 35);
  const darkAccent = darkenColor(accentColor, 35);

  // Beautiful premium text shadow: sharp edge highlight, deep drop shadow, and a wide ambient bloom
  const textShadowPremium = theme === 'dark' ? `
    0 1px 1px rgba(255, 255, 255, 0.3),
    0 2px 2px rgba(255, 255, 255, 0.1),
    0 4px 10px rgba(0, 0, 0, 0.8),
    0 10px 30px ${accentColor}70,
    0 20px 50px ${accentColor}50,
    0 0 100px ${accentColor}40
  ` : `
    0 1px 1px rgba(255, 255, 255, 0.8),
    0 2px 4px rgba(0, 0, 0, 0.1),
    0 8px 20px rgba(0, 0, 0, 0.15),
    0 10px 30px ${accentColor}40,
    0 20px 50px ${accentColor}30,
    0 0 80px ${accentColor}20
  `;

  const titles = ['Developer', 'Designer', 'Innovator'];

  return (
    <motion.div className="relative z-10 mt-[-80px] sm:mt-[-70px] md:mt-[-90px] lg:mt-[-100px]" style={{ opacity: textOpacity }}>
      {/* Name with animated gradient */}
      <motion.div
        ref={nameParallaxRef}
        initial="hidden"
        animate="visible"
        variants={nameVariants}
        className="mb-6 relative"
      >
        {/* Glow orb behind name */}
        <motion.div
          // THIS is the box. It is an inset-0 rectangle filled with an accent
          // radial and blurred — against MoltenMetal's own noise it reads as
          // atmosphere, but over a photographic plate its box edges show as a
          // panel behind the name. Dropped on the film backdrop.
          className={`absolute inset-0 -z-10 blur-[80px] ${isFilm ? 'hidden' : 'opacity-80'}`}
          style={{
            background: `radial-gradient(ellipse at center, ${accentColor}50 0%, transparent 70%)`,
            transform: 'scale(1.5)'
          }}
          animate={{ 
            opacity: [0.5, 0.8, 0.5],
            scale: [1.4, 1.6, 1.4] 
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />

        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-wide relative text-center">
          {/* Decorative elements — dropped on the film backdrop, where anything
              outlined near the name reads as a stray frame around it. */}
          {!isFilm && (
            <>
              <motion.div
                className="absolute -top-8 -left-8 w-16 h-16 opacity-40"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                style={{
                  border: `2px solid ${accentColor}40`,
                  borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%'
                }}
              />
              <motion.div
                className="absolute -top-4 -right-4 w-12 h-12 opacity-40"
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                style={{
                  border: `2px solid ${accentColor}50`,
                  borderRadius: '70% 30% 30% 70% / 70% 70% 30% 30%'
                }}
              />
            </>
          )}

          {/* Main Name with Premium Edge-Lit Bloom Effect */}
          {isFilm ? (
            /*
             * Solid metal type rather than the video-filled heading, for three
             * reasons that only apply once there is film running behind it:
             *
             *  - MaskedHeading fills glyphs by clipping a full-width video layer
             *    with an SVG clipPath. Inside a transformed ancestor that layer's
             *    own rectangle shows through as a faint box around the name.
             *  - A video fill competing with video behind it reads as noise; a
             *    single chrome gradient holds against moving footage.
             *  - Nothing else may clip this element, or the occlusion mask below
             *    cannot apply — two clip sources on one box do not compose.
             *
             * It also drops a permanent rAF loop and a second video decode from
             * a page that is already decoding 200 frames.
             */
            <span
              className="inline-block relative whitespace-nowrap"
              style={{
                // drop-shadow, not text-shadow: the glyphs are transparent and
                // painted by a clipped background, so text-shadow has nothing to
                // cast from and would draw a rectangle instead.
                filter: `drop-shadow(0 6px 18px rgba(0,0,0,.5)) drop-shadow(0 0 40px ${accentColor}4d)`,
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  fontSize: 'clamp(4rem, 13.5vw, 10rem)',
                  fontWeight: 900,
                  letterSpacing: '-0.03em',
                  lineHeight: 1.15,
                  backgroundImage: METAL_FILL,
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                Sayandip Jana
              </span>
            </span>
          ) : (
            <MaskedHeading
              text="Sayandip Jana"
              tag="span"
              mediaType="video"
              src="/media/LiveWallpaper.webm"
              fillScale={1.3}
              parallax={20}
              drift={10}
              reveal="wipe"
              trigger="view"
              weight={900}
              tracking={-0.02}
              lineHeight={1.3} // Prevent clipping
              fontSize="clamp(3.5rem, 12vw, 8.5rem)"
              className="inline-block relative whitespace-nowrap"
              style={{ textShadow: textShadowPremium }}
            />
          )}

          {/* Removed shine sweep overlay based on feedback */}
        </h1>
      </motion.div>

      {/* Animated titles */}
      <motion.div
        ref={titleParallaxRef}
        initial="hidden"
        animate="visible"
        variants={titleVariants}
        className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-5 text-base sm:text-lg md:text-xl relative mb-16 sm:mb-12 md:mb-16"
      >
        {/* Decorative lines */}
        <motion.div
          className="absolute left-1/2 -top-4 w-[1px] h-8 opacity-40"
          style={{ backgroundColor: accentColor, transform: 'translateX(-50%)' }}
          animate={{ height: [8, 16, 8] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute left-1/2 -bottom-4 w-[1px] h-8 opacity-40"
          style={{ backgroundColor: accentColor, transform: 'translateX(-50%)' }}
          animate={{ height: [8, 16, 8] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />

        {titles.map((title, index) => (
          <React.Fragment key={title}>
            <motion.div
              variants={titleItemVariants}
              className="px-4 py-1.5 rounded-full border font-medium"
              style={{
                fontFamily: 'var(--font-body)',
                borderColor: `${accentColor}50`,
                background: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                boxShadow: `0 0 15px ${accentColor}20, inset 0 0 20px ${accentColor}10`,
                color: textColor,
              }}
              whileHover={{
                scale: 1.05,
                boxShadow: `0 0 25px ${accentColor}40, inset 0 0 30px ${accentColor}20`,
                borderColor: accentColor
              }}
            >
              {title}
            </motion.div>

            {index < titles.length - 1 && (
              <motion.span
                variants={titleItemVariants}
                className="flex items-center text-2xl hidden sm:flex md:flex lg:flex"
                style={{ color: accentColor, opacity: 0.6 }}
              >
                •
              </motion.span>
            )}
          </React.Fragment>
        ))}
      </motion.div>

      {/* CSS Keyframes for shimmer animation */}
      <style jsx>{`
        @keyframes shimmer {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default AnimatedText;
