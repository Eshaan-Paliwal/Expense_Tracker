import { Home, TrendingUp, Wallet, PieChart, Settings, Bell } from 'lucide-react';
import { motion } from 'motion/react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'transactions', label: 'Transactions', icon: TrendingUp },
  { id: 'budget', label: 'Budget', icon: Wallet },
  { id: 'analytics', label: 'Analytics', icon: PieChart },
];

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed left-0 top-0 h-screen w-64 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-800/50 flex flex-col z-40 hidden lg:flex"
    >
      {/* Logo */}
      <div className="p-6 border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-gray-900 dark:text-white">FinTrack</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Pro Edition</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <motion.button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50'
              }`}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </motion.button>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 space-y-2 border-t border-gray-200/50 dark:border-gray-800/50">
        <motion.button
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-all duration-200"
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
        >
          <Bell className="w-5 h-5" />
          <span className="font-medium">Notifications</span>
        </motion.button>
        <motion.button
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-all duration-200"
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </motion.button>
      </div>
    </motion.aside>
  );
}
