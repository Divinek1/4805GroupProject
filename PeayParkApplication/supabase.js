// supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://naupogmsshnamwnptpcb.supabase.co'; // Our supabase url.
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdXBvZ21zc2huYW13bnB0cGNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0ODc1NzEsImV4cCI6MjA1ODA2MzU3MX0.VNqSA1Zejfeoao-SvHpIg3bKRNiMFiZKhQx4vK6C6pI'; // Long key (Super secret)

export const supabase = createClient(supabaseUrl, supabaseAnonKey);