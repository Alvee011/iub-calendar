import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle({ theme, toggleTheme }) {
    const isDark = theme === 'dark';

    return (
        <button
            onClick={toggleTheme}
            className={`relative inline-flex h-8 w-14 px-1 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-iub-blue focus:ring-offset-2 dark:focus:ring-offset-black ${isDark ? 'bg-neutral-800' : 'bg-sky-200'
                }`}
            aria-label="Toggle Dark Mode"
        >
            <span className="sr-only">Toggle Dark Mode</span>
            <motion.div
                layout
                animate={{ x: isDark ? 24 : 0 }}
                transition={{
                    type: 'spring',
                    stiffness: 700,
                    damping: 30
                }}
                className={`flex h-6 w-6 items-center justify-center rounded-full shadow-sm ${isDark ? 'bg-black text-yellow-400' : 'bg-white text-orange-400'
                    }`}
            >
                <motion.div
                    initial={false}
                    animate={{ rotate: isDark ? 180 : 0 }}
                >
                    {isDark ? <Moon size={18} /> : <Sun size={18} />}
                </motion.div>
            </motion.div>
        </button>
    );
}
