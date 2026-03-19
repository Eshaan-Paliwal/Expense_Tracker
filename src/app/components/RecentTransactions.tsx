import { ShoppingBag, Coffee, Car, Home, Sparkles, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';

interface Expense {
  _id: string;
  text: string;
  amount: number;
  createdAt: string;
}

interface RecentTransactionsProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
}

export function RecentTransactions({ expenses, onDelete }: RecentTransactionsProps) {
  const getIcon = (amount: number) => {
    if (amount > 0) return Sparkles;
    return ShoppingBag;
  };

  const getColor = (amount: number) => {
    if (amount > 0) return 'from-green-500 to-green-600';
    return 'from-pink-500 to-pink-600';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg shadow-gray-200/50 dark:shadow-gray-900/50"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Recent Transactions</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Your latest activity</p>
        </div>
      </div>
      
      <div className="space-y-3">
        {expenses.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No transactions yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Add your first transaction to get started!</p>
          </div>
        ) : (
          expenses.slice().reverse().map((transaction, index) => {
            const Icon = getIcon(transaction.amount);
            const colorClass = getColor(transaction.amount);
            
            return (
              <motion.div
                key={transaction._id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                whileHover={{ x: 4, transition: { duration: 0.2 } }}
                className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 group"
              >
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClass} flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 dark:text-white truncate">
                    {transaction.text}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(transaction.createdAt)}</p>
                </div>
                
                {/* Amount */}
                <div className="text-right flex items-center gap-3">
                  <div>
                    <p className={`font-bold ${transaction.amount > 0 ? 'text-green-500' : 'text-gray-900 dark:text-white'}`}>
                      {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {transaction.amount > 0 ? 'Income' : 'Expense'}
                    </p>
                  </div>
                  
                  {/* Delete Button */}
                  <button
                    onClick={() => onDelete(transaction._id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </motion.div>
  );
}