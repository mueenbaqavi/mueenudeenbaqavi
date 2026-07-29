const fs = require('fs');
const path = require('path');

function removeGenerateStaticParams(filePath) {
  const fullPath = path.resolve(__dirname, '..', filePath);
  if (!fs.existsSync(fullPath)) return;
  let content = fs.readFileSync(fullPath, 'utf8');
  
  // Regex to match the entire generateStaticParams block
  const regex = /export async function generateStaticParams\(\) \{[\s\S]*?\n\}/g;
  content = content.replace(regex, '');
  
  fs.writeFileSync(fullPath, content);
  console.log(`Updated ${filePath}`);
}

removeGenerateStaticParams('src/app/(public)/articles/[slug]/page.tsx');
removeGenerateStaticParams('src/app/(public)/ahlu-sunnah/[slug]/page.tsx');
removeGenerateStaticParams('src/app/(public)/fatwas/[slug]/page.tsx');
removeGenerateStaticParams('src/app/(public)/books/[slug]/page.tsx');
removeGenerateStaticParams('src/app/(public)/courses/[slug]/page.tsx');

console.log("Removed static params.");
