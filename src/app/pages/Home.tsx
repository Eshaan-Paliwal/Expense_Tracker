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
import { supabase } from '../../lib/supabase';

interface Expense {
  id: string;
  text: string;
  amount: number;
  created_at: string;
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
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/login');
        return;
      }
      
      setLoggedInUser(session.user.user_metadata?.name || 'User');
      fetchExpenses();
    };
    
    checkUser();
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
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setExpenses(data || []);
    } catch (error: any) {
      console.error('Fetch expenses error:', error);
      toast.error(`Failed to load expenses: ${error.message || 'Unknown error'}`);
    }
  };

  const addTransaction = async (expenseData: { text: string; amount: number }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('expenses')
        .insert([{ ...expenseData, user_id: user.id }])
        .select();

      if (error) throw error;

      if (data) {
        setExpenses([data[0], ...expenses]);
        toast.success('Transaction added successfully!');
      }
    } catch (error: any) {
      console.error('Add transaction error:', error);
      toast.error(`Failed to add transaction: ${error.message || 'Unknown error'}`);
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setExpenses(expenses.filter(exp => exp.id !== id));
      toast.success('Transaction deleted successfully!');
    } catch (error: any) {
      console.error('Delete transaction error:', error);
      toast.error(`Failed to delete transaction: ${error.message || 'Unknown error'}`);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    toast.success('Logged out successfully');
    navigate('/login');
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ExpenseChart theme={theme} expenses={expenses} />
            <CategoryChart theme={theme} expenses={expenses} />
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
