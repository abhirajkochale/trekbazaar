import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.ts') || file.endsWith('.tsx')) results.push(file);
    }
  });
  return results;
}

const files = walk('src');
files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  let newContent = content.replace(/verification_status/g, 'approval_status');
  newContent = newContent.replace(/===\s*'verified'/g, "=== 'approved'");
  newContent = newContent.replace(/===\s*"verified"/g, '=== "approved"');
  newContent = newContent.replace(/!==\s*'verified'/g, "!== 'approved'");
  newContent = newContent.replace(/!==\s*"verified"/g, '!== "approved"');
  newContent = newContent.replace(/VerificationStatus/g, 'ApprovalStatus');
  
  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log('Updated ' + file);
  }
});
