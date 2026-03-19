import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('Testing connection to:', supabaseUrl);
console.log('Testing key prefix:', supabaseAnonKey.substring(0, 15));

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test_login() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'test@example.com',
    password: 'password123',
  });

  if (error) {
    console.log('Login Error Body:', JSON.stringify(error, null, 2));
  } else {
    console.log('Login Success (Wait, it worked?):', data);
  }
}

test_login();
