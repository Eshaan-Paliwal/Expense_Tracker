import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Middleware
app.use('*', cors());
app.use('*', logger(console.log));

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// Health check
app.get('/make-server-26b96665/ping', (c) => c.text('PONG'));

// ============= AUTH ROUTES =============

// Signup
app.post('/make-server-26b96665/auth/signup', async (c) => {
  try {
    const { name, email, password } = await c.req.json();

    // Validate input
    if (!name || !email || !password) {
      return c.json({ message: 'All fields are required', success: false }, 400);
    }

    if (name.length < 3 || name.length > 100) {
      return c.json({ message: 'Name must be between 3 and 100 characters', success: false }, 400);
    }

    if (password.length < 4) {
      return c.json({ message: 'Password must be at least 4 characters', success: false }, 400);
    }

    // Check if user already exists
    const existingUser = await kv.get(`user:${email}`);
    if (existingUser) {
      return c.json({ message: 'User already exists, you can login', success: false }, 409);
    }

    // Create user with Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      email_confirm: true, // Auto-confirm since no email server configured
    });

    if (error) {
      console.log('Signup error:', error);
      return c.json({ message: error.message, success: false }, 500);
    }

    // Store user metadata in KV
    await kv.set(`user:${email}`, {
      id: data.user.id,
      name,
      email,
      createdAt: new Date().toISOString(),
    });

    return c.json({ message: 'Signup successful', success: true }, 201);
  } catch (error) {
    console.log('Signup error:', error);
    return c.json({ message: 'Internal server error', success: false }, 500);
  }
});

// Login
app.post('/make-server-26b96665/auth/login', async (c) => {
  try {
    const { email, password } = await c.req.json();

    if (!email || !password) {
      return c.json({ message: 'Email and password are required', success: false }, 400);
    }

    // Sign in with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log('Login error:', error);
      return c.json({ message: 'Invalid email or password', success: false }, 403);
    }

    // Get user metadata
    const userData = await kv.get(`user:${email}`);

    return c.json({
      message: 'Login successful',
      success: true,
      jwtToken: data.session.access_token,
      email: data.user.email,
      name: userData?.name || 'User',
    }, 200);
  } catch (error) {
    console.log('Login error:', error);
    return c.json({ message: 'Internal server error', success: false }, 500);
  }
});

// ============= EXPENSE ROUTES =============

// Middleware to verify JWT
const ensureAuthenticated = async (c: any, next: any) => {
  try {
    const authHeader = c.req.header('Authorization');
    
    if (!authHeader) {
      return c.json({ message: 'No authorization token provided', success: false }, 403);
    }

    const token = authHeader.replace('Bearer ', '');

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      console.log('Auth verification error:', error);
      return c.json({ message: 'Invalid or expired token', success: false }, 403);
    }

    // Attach user to context
    c.set('user', data.user);
    await next();
  } catch (error) {
    console.log('Auth middleware error:', error);
    return c.json({ message: 'Authentication failed', success: false }, 403);
  }
};

// Get all expenses
app.get('/make-server-26b96665/expenses', ensureAuthenticated, async (c) => {
  try {
    const user = c.get('user');
    const userId = user.id;

    // Get expenses for user
    const expenses = await kv.get(`expenses:${userId}`) || [];

    return c.json({
      message: 'Expenses fetched successfully',
      success: true,
      data: expenses,
    }, 200);
  } catch (error) {
    console.log('Get expenses error:', error);
    return c.json({ message: 'Internal server error', success: false }, 500);
  }
});

// Add expense
app.post('/make-server-26b96665/expenses', ensureAuthenticated, async (c) => {
  try {
    const user = c.get('user');
    const userId = user.id;
    const { text, amount } = await c.req.json();

    if (!text || amount === undefined) {
      return c.json({ message: 'Text and amount are required', success: false }, 400);
    }

    // Get existing expenses
    const expenses = await kv.get(`expenses:${userId}`) || [];

    // Create new expense
    const newExpense = {
      _id: crypto.randomUUID(),
      text,
      amount: Number(amount),
      createdAt: new Date().toISOString(),
    };

    // Add to expenses array
    expenses.push(newExpense);

    // Save to KV store
    await kv.set(`expenses:${userId}`, expenses);

    return c.json({
      message: 'Expense added successfully',
      success: true,
      data: expenses,
    }, 200);
  } catch (error) {
    console.log('Add expense error:', error);
    return c.json({ message: 'Internal server error', success: false }, 500);
  }
});

// Delete expense
app.delete('/make-server-26b96665/expenses/:expenseId', ensureAuthenticated, async (c) => {
  try {
    const user = c.get('user');
    const userId = user.id;
    const expenseId = c.req.param('expenseId');

    // Get existing expenses
    const expenses = await kv.get(`expenses:${userId}`) || [];

    // Filter out the expense to delete
    const updatedExpenses = expenses.filter((exp: any) => exp._id !== expenseId);

    // Save updated expenses
    await kv.set(`expenses:${userId}`, updatedExpenses);

    return c.json({
      message: 'Expense deleted successfully',
      success: true,
      data: updatedExpenses,
    }, 200);
  } catch (error) {
    console.log('Delete expense error:', error);
    return c.json({ message: 'Internal server error', success: false }, 500);
  }
});

Deno.serve(app.fetch);
