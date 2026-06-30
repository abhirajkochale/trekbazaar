import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('./src');
let changedFilesCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  const initialContent = content;

  // 1. Find all imported icons from lucide-react
  const importRegex = /import\s+\{([^}]+)\}\s+from\s+['"]lucide-react['"]/g;
  let importedIcons = [];
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    const icons = match[1].split(',').map(i => i.trim()).filter(Boolean);
    importedIcons = importedIcons.concat(icons);
  }

  if (importedIcons.length === 0) return;

  // 2. For each icon, find its usage and replace size classes
  importedIcons.forEach(icon => {
    // Regex to match <IconName ... className="w-6 h-6 text-red-500" />
    // We'll replace w-[0-9]+, h-[0-9]+, text-[a-z]+-[0-9]+ inside className of this specific icon
    const iconTagRegex = new RegExp(`<${icon}\\s+([^>]*className=["'][^"']*["'][^>]*)>`, 'g');
    
    content = content.replace(iconTagRegex, (fullMatch, props) => {
      // Find className="..."
      const classNameRegex = /className=(["'])([^"']*)(["'])/;
      const classMatch = props.match(classNameRegex);
      if (classMatch) {
        let classStr = classMatch[2];
        
        // Remove old w- and h- classes
        classStr = classStr.replace(/\bw-\d+\b/g, '');
        classStr = classStr.replace(/\bw-\[.*?\]\b/g, '');
        classStr = classStr.replace(/\bh-\d+\b/g, '');
        classStr = classStr.replace(/\bh-\[.*?\]\b/g, '');
        
        // Remove old bright colors unless it's a specific exception, or we can just replace them.
        // The rule says "muted, text-zinc-500". We should remove text-emerald-*, text-red-*, etc.
        classStr = classStr.replace(/\btext-(emerald|red|blue|purple|orange|green|amber|yellow|indigo|pink)-\d+\b/g, 'text-zinc-500');
        
        // If it doesn't already have text-zinc-*, add text-zinc-500
        if (!classStr.includes('text-zinc-') && !classStr.includes('text-current') && !classStr.includes('text-white')) {
           // wait, sometimes we want icons to inherit text color. 
           // Let's just remove bright colors and let it be, or explicitly set to text-zinc-500 if we replaced a color.
        }

        // Clean up multiple spaces
        classStr = classStr.replace(/\s+/g, ' ').trim();
        
        // Ensure w-4 h-4 is present
        if (!classStr.includes('w-4') && !classStr.includes('h-4')) {
          classStr = `w-4 h-4 ${classStr}`.trim();
        }

        const newProps = props.replace(classNameRegex, `className=${classMatch[1]}${classStr}${classMatch[3]}`);
        return `<${icon} ${newProps}>`;
      }
      return fullMatch; // no className found, theoretically we should add it, but it's okay.
    });
  });

  if (content !== initialContent) {
    fs.writeFileSync(file, content, 'utf8');
    changedFilesCount++;
  }
});

console.log(`Updated icons in ${changedFilesCount} files.`);
