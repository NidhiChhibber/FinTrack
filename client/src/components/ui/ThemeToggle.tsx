import { useTheme } from '../../context/ThemeContext'
import { motion } from 'framer-motion';
import { MoonIcon, SunIcon } from '@heroicons/react/24/solid';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className={`relative w-14 h-8 rounded-full transition-colors flex items-center px-1 ${
        isDark ? 'bg-gray-700' : 'bg-blue-300'
      }`}
    >
      <motion.div
        className="absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center"
        animate={{ x: isDark ? 24 : 0 }} // <-- THIS moves it
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {isDark ? (
          <MoonIcon className="w-4 h-4 text-blue-300" />
        ) : (
          <SunIcon className="w-4 h-4 text-gray-500" />
        )}
      </motion.div>
    </button>
  );
};

export default ThemeToggle;
