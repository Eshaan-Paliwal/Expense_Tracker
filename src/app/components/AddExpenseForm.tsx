import { useState } from 'react';
import { Plus, X, DollarSign, Tag, Calendar, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

interface AddExpenseFormProps {
  onClose: () => void;
  onAdd: (data: { text: string; amount: number }) => void;
}

const categories = [
  { id: 'food', label: 'Food', icon: '🍔' },
  { id: 'transport', label: 'Transport', icon: '🚗' },
  { id: 'shopping', label: 'Shopping', icon: '🛍️' },
  { id: 'bills', label: 'Bills', icon: '📄' },
  { id: 'entertainment', label: 'Entertainment', icon: '🎬' },
  { id: 'income', label: 'Income', icon: '💰' },
];

export function AddExpenseForm({ onClose, onAdd }: AddExpenseFormProps) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!amount || parseFloat(amount) === 0) {
      newErrors.amount = 'Please enter a valid amount';
    }
    
    if (!category) {
      newErrors.category = 'Please select a category';
    }
    
    if (!description.trim()) {
      newErrors.description = 'Please enter a description';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      const numAmount = parseFloat(amount);
      // Make income positive and expenses negative
      const finalAmount = category === 'income' ? Math.abs(numAmount) : -Math.abs(numAmount);
      
      await onAdd({
        text: description,
        amount: finalAmount,
      });
      
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Transaction</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center"
          >
            <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Amount
            </label>
            <div className="relative">
              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={`w-full pl-12 pr-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-700 border ${
                  errors.amount ? 'border-red-500' : 'border-transparent'
                } focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all outline-none text-gray-900 dark:text-white`}
                placeholder="0.00"
              />
            </div>
            {errors.amount && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-500 mt-1"
              >
                {errors.amount}
              </motion.p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <div className="grid grid-cols-3 gap-3">
              {categories.map((cat) => (
                <motion.button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-3 rounded-2xl border-2 transition-all ${
                    category === cat.id
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700'
                  }`}
                >
                  <div className="text-2xl mb-1">{cat.icon}</div>
                  <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    {cat.label}
                  </div>
                </motion.button>
              ))}
            </div>
            {errors.category && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-500 mt-1"
              >
                {errors.category}
              </motion.p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <div className="relative">
              <FileText className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`w-full pl-12 pr-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-700 border ${
                  errors.description ? 'border-red-500' : 'border-transparent'
                } focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all outline-none text-gray-900 dark:text-white`}
                placeholder="What did you spend on?"
              />
            </div>
            {errors.description && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-500 mt-1"
              >
                {errors.description}
              </motion.p>
            )}
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/60 transition-all"
          >
            Add Transaction
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
}