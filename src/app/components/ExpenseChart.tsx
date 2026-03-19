import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'motion/react';
import { useMemo } from 'react';

const data = [
  { month: 'Jan', income: 4200, expenses: 2800 },
  { month: 'Feb', income: 4500, expenses: 3200 },
  { month: 'Mar', income: 4800, expenses: 3500 },
  { month: 'Apr', income: 4600, expenses: 3100 },
  { month: 'May', income: 5200, expenses: 3800 },
  { month: 'Jun', income: 5500, expenses: 4200 },
];

interface Expense {
  id: string;
  text: string;
  amount: number;
  created_at: string;
}

interface ExpenseChartProps {
  theme: 'dark' | 'light';
  expenses: Expense[];
}

export function ExpenseChart({ theme, expenses }: ExpenseChartProps) {
  const isDark = theme === 'dark';
  const chartId = useMemo(() => Math.random().toString(36).substr(2, 9), []);
  
  // Process real data for the chart
  const chartData = useMemo(() => {
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - (5 - i));
      return {
        month: d.toLocaleString('default', { month: 'short' }),
        fullMonth: d.getMonth(),
        year: d.getFullYear(),
        income: 0,
        expenses: 0
      };
    });

    expenses.forEach(exp => {
      const date = new Date(exp.created_at);
      const m = date.getMonth();
      const y = date.getFullYear();
      
      const monthData = last6Months.find(d => d.fullMonth === m && d.year === y);
      if (monthData) {
        if (exp.amount > 0) {
          monthData.income += exp.amount;
        } else {
          monthData.expenses += Math.abs(exp.amount);
        }
      }
    });

    return last6Months;
  }, [expenses]);
  
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg shadow-gray-200/50 dark:shadow-gray-900/50"
    >
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Financial Overview</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">Monthly income vs expenses</p>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id={`colorIncome-${chartId}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id={`colorExpenses-${chartId}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
          <XAxis 
            dataKey="month" 
            stroke={isDark ? '#9ca3af' : '#6b7280'}
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke={isDark ? '#9ca3af' : '#6b7280'}
            style={{ fontSize: '12px' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: isDark ? '#1f2937' : '#ffffff',
              border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
              borderRadius: '12px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
            labelStyle={{ color: isDark ? '#f3f4f6' : '#111827' }}
          />
          <Area 
            type="monotone" 
            dataKey="income" 
            stroke="#a855f7" 
            strokeWidth={3}
            fill={`url(#colorIncome-${chartId})`}
          />
          <Area 
            type="monotone" 
            dataKey="expenses" 
            stroke="#ec4899" 
            strokeWidth={3}
            fill={`url(#colorExpenses-${chartId})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}