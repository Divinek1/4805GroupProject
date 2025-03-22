// supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://naupogmsshnamwnptpcb.supabase.co'; // Our supabase url.
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdXBvZ21zc2huYW13bnB0cGNiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MjQ4NzU3MSwiZXhwIjoyMDU4MDYzNTcxfQ.PHL7Dxsb1ptO37h4aKGCQvQj1g44g4CXiNRJk4rPUa4'; // Long key (Super secret)

export const supabase = createClient(supabaseUrl, supabaseAnonKey);