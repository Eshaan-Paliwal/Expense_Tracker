import { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';

interface KPICardProps {
  title: string;
  amount: number;
  icon: LucideIcon;
  trend: number;
  gradient: string;
  delay?: number;
}

export function KPICard({ title, amount, icon: Icon, trend, gradient, delay = 0 }: KPICardProps) {
  const isPositive = trend > 0;
  
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="relative group"
    >
      {/* Glow Effect */}
      <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300`} />
      
      {/* Card */}
      <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg shadow-gray-200/50 dark:shadow-gray-900/50">
        {/* Icon */}
        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        
        {/* Content */}
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{title}</p>
          <motion.h3
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ delay: delay + 0.1, type: 'spring' }}
            className="text-3xl font-bold text-gray-900 dark:text-white mb-2"
          >
            ${amount.toLocaleString()}
          </motion.h3>
          
          {/* Trend */}
          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {isPositive ? '↑' : '↓'} {Math.abs(trend)}%
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">vs last month</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
