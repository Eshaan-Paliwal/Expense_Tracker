import { Search, Menu } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { motion } from 'motion/react';

interface TopNavProps {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  toggleMobileMenu: () => void;
  userName?: string;
  onLogout?: () => void;
}

export function TopNav({ theme, toggleTheme, toggleMobileMenu, userName = 'User', onLogout }: TopNavProps) {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-30 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50"
    >
      <div className="flex items-center justify-between px-4 lg:px-8 py-4">
        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        </button>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl mx-4 hidden md:block">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-gray-100 dark:bg-gray-800 border border-transparent focus:border-purple-500 focus:bg-white dark:focus:bg-gray-800 transition-all duration-200 outline-none text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          
          {/* User Avatar */}
          <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-700">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{userName}</p>
              <button 
                onClick={onLogout}
                className="text-xs text-purple-600 dark:text-purple-400 hover:underline"
              >
                Logout
              </button>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
              {userName.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}