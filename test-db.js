const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const envStr = fs.readFileSync('.env.local', 'utf8');
const env = envStr.split('\n').reduce((acc, line) => {
  const [key, ...val] = line.split('=');
  if(key) acc[key.trim()] = val.join('=').trim().replace(/^"|"$/g, '');
  return acc;
}, {});

const anonClient = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
  const { data, error } = await anonClient
    .from("content_entries")
    .select("title, slug, excerpt, body_markdown, published_at, read_time_minutes, views_count, categories(name), profiles:profiles!content_entries_author_id_fkey(full_name), authors(name)")
    .eq("kind", "article")
    .eq("status", "published")
    .eq("slug", "mathrika-kaati-paanakkatte-thiru-mamgalam")
    .is("deleted_at", null)
    .maybeSingle();

  console.log("Error:", error);
  console.log("Data:", data);
}
run();
