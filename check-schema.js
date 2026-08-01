const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  console.log("Checking fatwas table columns:");
  const { data: fatwas, error: fError } = await supabase.from('fatwas').select('*').limit(1);
  if (fError) {
    console.error("Fatwas error:", fError.message);
  } else if (fatwas && fatwas.length > 0) {
    console.log(Object.keys(fatwas[0]));
  } else {
    console.log("Fatwas table is empty, trying to insert a dummy to get schema or querying raw...");
  }
  
  console.log("\nChecking content_entries table columns:");
  const { data: content, error: cError } = await supabase.from('content_entries').select('*').limit(1);
  if (cError) {
    console.error("Content error:", cError.message);
  } else if (content && content.length > 0) {
    console.log(Object.keys(content[0]));
  } else {
    console.log("Content table is empty.");
  }
}

checkSchema();
