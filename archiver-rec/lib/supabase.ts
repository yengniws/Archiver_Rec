import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yvmocexiqmahpnmfxcfq.supabase.co';

const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2bW9jZXhpcW1haHBubWZ4Y2ZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5NTA3NjcsImV4cCI6MjA4NTUyNjc2N30._FWM357861sh_uM8F0TxnFhCZ3wAfra00Tdqk5hAMcQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
