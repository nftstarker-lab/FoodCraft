
import { createClient } from '@supabase/supabase-js';

// Configuração Oficial do Projeto FoodCraft
const SUPABASE_URL = 'https://mniydqqsxwnjkxammsbi.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1uaXlkcXFzeHduamt4YW1tc2JpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4Nzg2MDAsImV4cCI6MjA4MDQ1NDYwMH0.kgDYokBVb2mEm5posnaNq6AeSmnNSMJQVLQDd5dgdUE';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Supabase URL and Key are required.');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);