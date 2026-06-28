import fs from 'fs';
import path from 'path';

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walk(dirPath, callback);
    } else if (dirPath.endsWith('.ts') || dirPath.endsWith('.tsx')) {
      callback(dirPath);
    }
  });
}

const replacements = [
  { from: /"\/company\/(login|dashboard|treks|departures|bookings|profile|settings)/g, to: '"/partner/$1' },
  { from: /'\/company\/(login|dashboard|treks|departures|bookings|profile|settings)/g, to: "'/partner/$1" },
  { from: /`\/company\/(login|dashboard|treks|departures|bookings|profile|settings)/g, to: "`/partner/$1" },
  
  // Also replace '/company' if it's EXACTLY that (redirects to /partner)
  { from: /"\/company"/g, to: '"/partner"' },
  { from: /'\/company'/g, to: "'/partner'" },

  // Component imports
  { from: /@\/components\/company\//g, to: '@/components/partner/' },

  // Terminology
  { from: /Company Login/g, to: 'Partner Login' },
  { from: /Company Dashboard/g, to: 'Partner Dashboard' },
  { from: /Company Portal/g, to: 'Partner Portal' },
  { from: /Manage Company/g, to: 'Manage Partner Account' }
];

let filesModified = 0;

walk('./src', (filePath) => {
  // Do not touch the public company profile folder to avoid breaking dynamic routes (though it only contains page.tsx which is safe, better be careful)
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  replacements.forEach(r => {
    content = content.replace(r.from, r.to);
  });

  // Special case: middleware.ts needs to protect /partner instead of /company
  if (filePath.endsWith('middleware.ts')) {
    content = content.replace(/startsWith\("\/company"\)/g, 'startsWith("/partner")');
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    filesModified++;
    console.log(`Modified: ${filePath}`);
  }
});

console.log(`Total files modified: ${filesModified}`);
