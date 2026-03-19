import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { motion } from 'motion/react';

const data = [
  { name: 'Food', value: 1200, color: '#a855f7' },
  { name: 'Transport', value: 800, color: '#ec4899' },
  { name: 'Shopping', value: 950, color: '#f59e0b' },
  { name: 'Bills', value: 600, color: '#3b82f6' },
  { name: 'Entertainment', value: 450, color: '#10b981' },
];

interface CategoryChartProps {
  theme: 'dark' | 'light';
}

export function CategoryChart({ theme }: CategoryChartProps) {
  const isDark = theme === 'dark';
  
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg shadow-gray-200/50 dark:shadow-gray-900/50"
    >
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Spending by Category</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">This month's breakdown</p>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{
              backgroundColor: isDark ? '#1f2937' : '#ffffff',
              border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
              borderRadius: '12px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      
      {/* Category List */}
      <div className="mt-4 space-y-2">
        {data.map((category) => (
          <div key={category.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: category.color }}
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">{category.name}</span>
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              ${category.value}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
