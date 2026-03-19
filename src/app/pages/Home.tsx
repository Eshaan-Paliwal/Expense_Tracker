import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Wallet, TrendingUp, TrendingDown, Plus, LogOut } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { AnimatePresence } from 'motion/react';
import { Sidebar } from '../components/Sidebar';
import { MobileSidebar } from '../components/MobileSidebar';
import { TopNav } from '../components/TopNav';
import { KPICard } from '../components/KPICard';
import { ExpenseChart } from '../components/ExpenseChart';
import { CategoryChart } from '../components/CategoryChart';
import { RecentTransactions } from '../components/RecentTransactions';
import { AIInsights } from '../components/AIInsights';
import { AddExpenseForm } from '../components/AddExpenseForm';
import { motion } from 'motion/react';
import { projectId, publicAnonKey } from '/utils/supabase/info';

interface Expense {
  _id: string;
  text: string;
  amount: number;
  createdAt: string;
}

export function Home() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState('');
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [incomeAmt, setIncomeAmt] = useState(0);
  const [expenseAmt, setExpenseAmt] = useState(0);

  // Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userName = localStorage.getItem('loggedInUser');
    
    if (!token) {
      navigate('/login');
      return;
    }
    
    setLoggedInUser(userName || 'User');
    fetchExpenses();
  }, [navigate]);

  // Calculate income and expenses
  useEffect(() => {
    const income = expenses
      .filter(item => item.amount > 0)
      .reduce((acc, item) => acc + item.amount, 0);
    
    const expense = expenses
      .filter(item => item.amount < 0)
      .reduce((acc, item) => acc + Math.abs(item.amount), 0);
    
    setIncomeAmt(income);
    setExpenseAmt(expense);
  }, [expenses]);

  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-26b96665/expenses`,
        {
          method: 'GET',
          headers: {
            'Authorization': token || '',
          },
        }
      );

      const data = await response.json();

      if (response.status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');
        navigate('/login');
        return;
      }

      if (data.success) {
        setExpenses(data.data);
      }
    } catch (error) {
      console.error('Fetch expenses error:', error);
      toast.error('Failed to load expenses');
    }
  };

  const addTransaction = async (expenseData: { text: string; amount: number }) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-26b96665/expenses`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token || '',
          },
          body: JSON.stringify(expenseData),
        }
      );

      const data = await response.json();

      if (response.status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');
        navigate('/login');
        return;
      }

      if (data.success) {
        setExpenses(data.data);
        toast.success('Transaction added successfully!');
      } else {
        toast.error(data.message || 'Failed to add transaction');
      }
    } catch (error) {
      console.error('Add transaction error:', error);
      toast.error('Failed to add transaction');
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-26b96665/expenses/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': token || '',
          },
        }
      );

      const data = await response.json();

      if (response.status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');
        navigate('/login');
        return;
      }

      if (data.success) {
        setExpenses(data.data);
        toast.success('Transaction deleted successfully!');
      } else {
        toast.error(data.message || 'Failed to delete transaction');
      }
    } catch (error) {
      console.error('Delete transaction error:', error);
      toast.error('Failed to delete transaction');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    toast.success('Logged out successfully');
    setTimeout(() => {
      navigate('/login');
    }, 500);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-pink-50/30 dark:from-gray-950 dark:via-purple-950/20 dark:to-pink-950/20 transition-colors duration-500">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={showMobileMenu}
        onClose={() => setShowMobileMenu(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Navigation */}
        <TopNav
          theme={theme}
          toggleTheme={toggleTheme}
          toggleMobileMenu={() => setShowMobileMenu(true)}
          userName={loggedInUser}
          onLogout={handleLogout}
        />

        {/* Page Content */}
        <main className="p-4 lg:p-8 space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome back, {loggedInUser}! 👋
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Here's your financial overview for March 2026
              </p>
            </div>
            
            <motion.button
              onClick={() => setShowAddExpense(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/60 transition-all"
            >
              <Plus className="w-5 h-5" />
              Add Transaction
            </motion.button>
          </motion.div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <KPICard
              title="Total Balance"
              amount={incomeAmt - expenseAmt}
              icon={Wallet}
              trend={12.5}
              gradient="from-purple-500 to-purple-600"
              delay={0}
            />
            <KPICard
              title="Total Income"
              amount={incomeAmt}
              icon={TrendingUp}
              trend={8.2}
              gradient="from-green-500 to-emerald-600"
              delay={0.1}
            />
            <KPICard
              title="Total Expenses"
              amount={expenseAmt}
              icon={TrendingDown}
              trend={-3.4}
              gradient="from-pink-500 to-red-600"
              delay={0.2}
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ExpenseChart theme={theme} />
            <CategoryChart theme={theme} />
          </div>

          {/* Recent Transactions and AI Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <RecentTransactions expenses={expenses} onDelete={deleteExpense} />
            </div>
            <div>
              <AIInsights />
            </div>
          </div>
        </main>
      </div>

      {/* Add Expense Modal */}
      <AnimatePresence>
        {showAddExpense && (
          <AddExpenseForm 
            onClose={() => setShowAddExpense(false)}
            onAdd={addTransaction}
          />
        )}
      </AnimatePresence>

      {/* Toast Notifications */}
      <Toaster
        theme={theme}
        position="top-right"
        richColors
        closeButton
      />
    </div>
  );
}
