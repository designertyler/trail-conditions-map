import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

console.log('Creating Supabase client...');
console.log('URL length:', supabaseUrl.length);
console.log('Key length:', supabaseKey.length);

if (!supabaseUrl) {
  throw new Error('SUPABASE_URL is required');
}

if (!supabaseKey) {
  throw new Error('SUPABASE_ANON_KEY is required');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
console.log('Supabase client created successfully');
