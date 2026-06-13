import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ytsaenyjfgtmwwlwxrek.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0c2FlbnlqZmd0bXd3bHd4cmVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyNzI2MjAsImV4cCI6MjA5Njg0ODYyMH0.ThIzfp3BIG_3mUjQEH3XRBYLH5VNE-xgerTKcGkHxGA';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testTables() {
  const tables = ['tai_khoan', 'nguoi_dung', 'danh_sach_tai_khoan', 'ds_tai_khoan', 'nhan_vien', 'admin_users', 'app_users', 'users_info', 'user_info'];
  
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*').limit(1);
    if (!error) {
      console.log(`Found table: ${table}`, data);
      return;
    } else {
        console.log(`${table}: ${error.message}`);
    }
  }
}

testTables();
