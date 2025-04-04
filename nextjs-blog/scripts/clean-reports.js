/**
 * Script pour nettoyer les rapports de test et ne conserver que les plus récents
 */
import fs from 'fs';
import path from 'path';

// Debug logging
console.log(`Current working directory: ${process.cwd()}`);

// Chemins des répertoires de rapports (relative to nextjs-blog directory)
const MOCHAWESOME_DIR = path.join(process.cwd(), 'nextjs-blog', 'cypress', 'reports', 'mochawesome');
const JUNIT_DIR = path.join(process.cwd(), 'nextjs-blog', 'cypress', 'reports', 'junit');

console.log(`\nMochawesome directory: ${MOCHAWESOME_DIR}`);
console.log(`Junit directory: ${JUNIT_DIR}`);

/**
 * Nettoie un répertoire en ne gardant que les fichiers les plus récents par type
 * @param {string} dir - Chemin du répertoire à nettoyer
 * @param {Object} options - Options de nettoyage
 * @param {number} options.keepLatest - Nombre de fichiers récents à conserver par type
 * @param {Array<string>} options.extensions - Extensions de fichiers à prendre en compte
 * @param {boolean} options.preserveMain - Si true, préserve les fichiers principaux (mochawesome.html/json)
 */
function cleanDirectory(dir, { keepLatest = 1, extensions = [], preserveMain = false } = {}) {
  if (!fs.existsSync(dir)) return;

  // Get all files in the directory
  const allFiles = fs.readdirSync(dir)
    .filter(file => {
      // Skip directories
      const fullPath = path.join(dir, file);
      return !fs.statSync(fullPath).isDirectory();
    })
    .map(file => ({
      file,
      mtime: fs.statSync(path.join(dir, file)).mtime
    }))
    .sort((a, b) => b.mtime - a.mtime);

  console.log(`\nFound ${allFiles.length} files in ${dir}:`);
  allFiles.forEach(({ file, mtime }) => {
    console.log(`  ${file} (${mtime})`);
  });

  // Filter by extension
  const files = allFiles.filter(({ file }) => {
    if (extensions.length > 0 && !extensions.includes(path.extname(file))) {
      return false;
    }
    // Preserve main files if requested
    if (preserveMain && (file === 'mochawesome.html' || file === 'mochawesome.json')) {
      return false;
    }
    return true;
  });

  // Group files by base name (without extension and numbered suffix)
  const groupedFiles = files.reduce((acc, { file, mtime }) => {
    // Extract base name without numbered suffix (e.g., 'mochawesome_001' -> 'mochawesome')
    const baseName = file.match(/^([\w-]+)_?\d*/)[1];
    console.log(`Processing file: ${file} -> Base name: ${baseName}`);
    if (!acc[baseName]) acc[baseName] = [];
    acc[baseName].push({ file, mtime });
    return acc;
  }, {});

  // Keep only the latest files for each base name
  let filesDeleted = 0;
  console.log('\nGrouped files:');
  Object.entries(groupedFiles).forEach(([baseName, fileGroup]) => {
    console.log(`\nGroup: ${baseName}`);
    fileGroup.forEach(({ file, mtime }) => {
      console.log(`  ${file} (${mtime})`);
    });
    
    const filesToDelete = fileGroup.slice(keepLatest);
    if (filesToDelete.length > 0) {
      console.log(`\n  Will delete ${filesToDelete.length} older files:`);
      filesToDelete.forEach(({ file }) => {
        console.log(`  - ${file}`);
        fs.unlinkSync(path.join(dir, file));
        filesDeleted++;
      });
    }
  });

  if (filesDeleted > 0) {
    console.log(`\nSupprimé ${filesDeleted} fichiers obsolètes de ${dir}`);
  } else {
    console.log(`\nAucun fichier obsolète trouvé dans ${dir}`);
  }
}

function cleanReports() {
  // Clean mochawesome directory, preserving main files and keeping only the latest numbered files
  cleanDirectory(MOCHAWESOME_DIR, { 
    keepLatest: 1, 
    extensions: ['.html', '.json'],
    preserveMain: true 
  });
  
  // Clean junit directory
  cleanDirectory(JUNIT_DIR, { 
    keepLatest: 1, 
    extensions: ['.xml'] 
  });
}

// Nettoyer les rapports
cleanReports();

console.log('Nettoyage des rapports terminé !');

export { cleanReports, cleanDirectory };
