import { Sparkles, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

const insights = [
  {
    id: 1,
    type: 'warning',
    icon: AlertCircle,
    color: 'from-orange-500 to-red-500',
    title: 'High Food Spending',
    description: 'You spent 20% more on food this month compared to last month.',
  },
  {
    id: 2,
    type: 'success',
    icon: CheckCircle,
    color: 'from-green-500 to-emerald-500',
    title: 'Savings Goal On Track',
    description: "You're on track to save $500 this month. Great job!",
  },
  {
    id: 3,
    type: 'tip',
    icon: TrendingUp,
    color: 'from-purple-500 to-pink-500',
    title: 'Budget Optimization',
    description: 'Consider reducing entertainment expenses by $100 to reach your goal faster.',
  },
];

export function AIInsights() {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.6 }}
      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg shadow-gray-200/50 dark:shadow-gray-900/50"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">AI Insights</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Personalized recommendations</p>
        </div>
      </div>
      
      <div className="space-y-4">
        {insights.map((insight, index) => (
          <motion.div
            key={insight.id}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 + index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="relative group cursor-pointer"
          >
            {/* Glow Effect */}
            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${insight.color} opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-300`} />
            
            {/* Card */}
            <div className="relative flex gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200/50 dark:border-gray-600/50">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${insight.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                <insight.icon className="w-5 h-5 text-white" />
              </div>
              
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                  {insight.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {insight.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
