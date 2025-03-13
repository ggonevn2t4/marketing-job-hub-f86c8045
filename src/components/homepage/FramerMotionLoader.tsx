
import { useEffect } from 'react';

const FramerMotionLoader = () => {
  useEffect(() => {
    const loadFramerMotion = async () => {
      try {
        await import('framer-motion');
      } catch (err) {
        console.error('Failed to load framer-motion:', err);
      }
    };
    
    loadFramerMotion();
  }, []);

  return null;
};

export default FramerMotionLoader;
