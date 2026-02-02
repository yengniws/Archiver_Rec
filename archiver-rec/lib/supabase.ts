import { createClient } from '@supabase/supabase-js';

// 따옴표 안에 아까 본 Project URL을 넣으세요.
const supabaseUrl = 'https://yvmocexiqmahpnmfxcfq.supabase.co';

// 따옴표 안에 anon public key를 넣으세요. (service_role 키는 절대 넣지 마세요!)
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2bW9jZXhpcW1haHBubWZ4Y2ZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5NTA3NjcsImV4cCI6MjA4NTUyNjc2N30._FWM357861sh_uM8F0TxnFhCZ3wAfra00Tdqk5hAMcQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
