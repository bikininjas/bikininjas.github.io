/**
 * Script pour nettoyer les rapports de test et ne conserver que les plus récents
 */
import fs from 'fs';
import path from 'path';

// Chemins des répertoires de rapports
const MOCHAWESOME_DIR = path.join(process.cwd(), 'cypress', 'reports', 'mochawesome');
const JUNIT_DIR = path.join(process.cwd(), 'cypress', 'reports', 'junit');

/**
 * Nettoie un répertoire en ne gardant que les fichiers les plus récents par type
 * @param {string} dir - Chemin du répertoire à nettoyer
 * @param {Object} options - Options de nettoyage
 * @param {number} options.keepLatest - Nombre de fichiers récents à conserver par type
 * @param {Array<string>} options.extensions - Extensions de fichiers à prendre en compte
 */
function cleanDirectory(dir, { keepLatest = 1, extensions = [] } = {}) {
  if (!fs.existsSync(dir)) return;

  const files = fs.readdirSync(dir)
    .filter(file => extensions.length === 0 || extensions.includes(path.extname(file)))
    .map(file => ({ file, mtime: fs.statSync(path.join(dir, file)).mtime }))
    .sort((a, b) => b.mtime - a.mtime);

  // Group files by base name (without extension)
  const groupedFiles = files.reduce((acc, { file, mtime }) => {
    const baseName = path.basename(file, path.extname(file));
    if (!acc[baseName]) acc[baseName] = [];
    acc[baseName].push({ file, mtime });
    return acc;
  }, {});
  // Keep only the latest files for each base name
  Object.values(groupedFiles).forEach(fileGroup => {
    fileGroup.slice(keepLatest).forEach(({ file }) => {
      fs.unlinkSync(path.join(dir, file));
    });
  });
}

function cleanReports(reportsDir) {
  const mochawesomeDir = path.join(reportsDir, 'mochawesome');
  const junitDir = path.join(reportsDir, 'junit');
  cleanDirectory(mochawesomeDir, { keepLatest: 1, extensions: ['.json'] });
  cleanDirectory(junitDir, { keepLatest: 1, extensions: ['.xml'] });
}

// Nettoyer les répertoires de rapports
cleanReports(path.join(process.cwd(), 'cypress', 'reports'));

console.log('Nettoyage des rapports terminé !');

export { cleanReports, cleanDirectory };
