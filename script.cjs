const fs = require('fs');
const path = require('path');

const walkSync = function(dir, filelist) {
  let files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      filelist = walkSync(path.join(dir, file), filelist);
    }
    else {
      if (file.endsWith('.jsx')) filelist.push(path.join(dir, file));
    }
  });
  return filelist;
};

const files = walkSync('src/views').concat(walkSync('src/components'));

const colorMap = {
  'bg-[#18181b]': 'bg-slate-50 dark:bg-[#18181b]',
  'bg-[#242424]': 'bg-white dark:bg-[#242424]',
  'bg-[#1e1e1e]': 'bg-slate-50 dark:bg-[#1e1e1e]',
  'bg-zinc-900': 'bg-slate-100 dark:bg-zinc-900',
  'bg-zinc-800': 'bg-slate-100 dark:bg-zinc-800',
  'bg-zinc-800/50': 'bg-slate-50 dark:bg-zinc-800/50',
  'text-zinc-100': 'text-slate-800 dark:text-zinc-100',
  'text-zinc-300': 'text-slate-700 dark:text-zinc-300',
  'text-zinc-400': 'text-slate-500 dark:text-zinc-400',
  'text-zinc-500': 'text-slate-400 dark:text-zinc-500',
  'border-zinc-800': 'border-slate-200 dark:border-zinc-800',
  'border-zinc-800/50': 'border-slate-100 dark:border-zinc-800/50',
  'border-zinc-700': 'border-slate-200 dark:border-zinc-700',
  'border-zinc-600': 'border-slate-300 dark:border-zinc-600',
  'hover:bg-zinc-800/50': 'hover:bg-slate-50 dark:hover:bg-zinc-800/50',
  'hover:bg-zinc-800': 'hover:bg-slate-100 dark:hover:bg-zinc-800',
  'hover:text-zinc-100': 'hover:text-slate-900 dark:hover:text-zinc-100',
  'hover:text-zinc-300': 'hover:text-slate-700 dark:hover:text-zinc-300',
  'bg-indigo-600': 'bg-blue-600 dark:bg-indigo-600',
  'bg-indigo-500': 'bg-blue-500 dark:bg-indigo-500',
  'bg-indigo-500/20': 'bg-blue-100 dark:bg-indigo-500/20',
  'text-indigo-600': 'text-blue-600 dark:text-indigo-600',
  'text-indigo-400': 'text-blue-600 dark:text-indigo-400',
  'text-indigo-300': 'text-blue-700 dark:text-indigo-300',
  'border-indigo-500': 'border-blue-600 dark:border-indigo-500',
  'hover:bg-indigo-700': 'hover:bg-blue-700 dark:hover:bg-indigo-700',
  'focus:ring-indigo-500': 'focus:ring-blue-500 dark:focus:ring-indigo-500',
  'focus:border-indigo-500': 'focus:border-blue-500 dark:focus:border-indigo-500',
  'shadow-indigo-500/30': 'shadow-blue-500/30 dark:shadow-indigo-500/30'
};

const keys = Object.keys(colorMap).sort((a, b) => b.length - a.length);

files.forEach(f => {
  const p = path.join(process.cwd(), f);
  if (fs.existsSync(p)) {
    let content = fs.readFileSync(p, 'utf8');
    let hasChanges = false;
    for (const key of keys) {
      const value = colorMap[key];
      const regex = new RegExp('(?<!dark:)' + key.replace(/[\[\]\/]/g, '\\$&') + '(?![a-zA-Z0-9_-])', 'g');
      const original = content;
      content = content.replace(regex, value);
      if (original !== content) hasChanges = true;
    }
    if (hasChanges) {
      fs.writeFileSync(p, content);
      console.log('Updated ' + f);
    }
  }
});
