import type { Container } from "tsparticles-engine";

export const particlesConfig = {
  particles: {
    number: {
      value: 30, // Reduced from 80 for better performance
      density: {
        enable: true,
        area: 1000 // Increased area for less particle density
      }
    },
    color: {
      value: "#ffffff"
    },
    shape: {
      type: "circle",
      options: {
        polygon: {
          sides: 5
        }
      }
    },
    opacity: {
      value: { min: 0.1, max: 0.4 }, // Reduced max opacity
      animation: {
        enable: false, // Disabled for performance
        speed: 1,
        sync: false
      }
    },
    size: {
      value: { min: 0.5, max: 2 }, // Reduced size range
      animation: {
        enable: false, // Disabled for performance
        speed: 2,
        sync: false
      }
    },
    links: {
      enable: false, // Disabled - very expensive to render
      distance: 150,
      color: "#ffffff",
      opacity: 0.3,
      width: 1
    },
    move: {
      enable: false, // Disabled for static background as requested
      speed: 0,
      direction: "none",
      random: false,
      straight: false,
      outModes: "out",
      attract: {
        enable: false,
        rotate: {
          x: 600,
          y: 1200
        }
      }
    }
  },
  interactivity: {
    detectsOn: "canvas",
    events: {
      onHover: {
        enable: false, // Disabled hover effects
        mode: "bubble"
      },
      onClick: {
        enable: false, // Disabled click effects
        mode: "push"
      },
      resize: {
        enable: true,
        delay: 0.5
      }
    },
    modes: {
      grab: {
        distance: 400,
        links: {
          opacity: 1
        }
      },
      bubble: {
        distance: 200,
        size: 6,
        duration: 2,
        opacity: 0.8,
        speed: 3
      },
      repulse: {
        distance: 200,
        duration: 0.4
      },
      push: {
        quantity: 4
      },
      remove: {
        quantity: 2
      }
    }
  },
  detectRetina: true,
  background: {
    color: "transparent",
    image: "",
    position: "50% 50%",
    repeat: "no-repeat",
    size: "cover"
  },
  fullScreen: {
    enable: false
  }
};

// Function to update particle colors based on theme and accent color
export const updateParticlesColors = (
  isDarkTheme: boolean,
  accentColor: string,
  container: Container
) => {
  if (!container) return;

  const baseColor = isDarkTheme ? "#ffffff" : "#000000";
  const opacity = isDarkTheme ? 0.5 : 0.3;

  try {
    // Type assertion to access properties safely
    const options = container.options as any;

    if (options.particles) {
      if (options.particles.color) {
        options.particles.color.value = accentColor;
      }

      if (options.particles.links) {
        options.particles.links.color = baseColor;
      }

      if (options.particles.opacity) {
        options.particles.opacity.value = opacity;
      }
    }

    container.refresh();
  } catch (error) {
    console.error('Error updating particle colors:', error);
  }
};

export default particlesConfig;
