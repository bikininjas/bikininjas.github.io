/**
 * Script pour nettoyer les rapports de test et ne conserver que les plus récents
 */
const fs = require('fs');
const path = require('path');

// Chemins des répertoires de rapports
const MOCHAWESOME_DIR = path.join(process.cwd(), 'cypress', 'reports', 'mochawesome');
const JUNIT_DIR = path.join(process.cwd(), 'cypress', 'reports', 'junit');

/**
 * Nettoie un répertoire en ne gardant que les fichiers les plus récents par type
 * @param {string} dir - Chemin du répertoire à nettoyer
 * @param {Object} options - Options de nettoyage
 * @param {number} options.keepLatest - Nombre de fichiers récents à conserver par type
 * @param {Array<string>} options.excludeDirs - Répertoires à exclure du nettoyage
 */
function cleanDirectory(dir, options = { keepLatest: 1, excludeDirs: [] }) {
  if (!fs.existsSync(dir)) {
    console.log(`Le répertoire ${dir} n'existe pas.`);
    return;
  }

  console.log(`Nettoyage du répertoire: ${dir}`);
  
  // Lire tous les fichiers du répertoire
  const files = fs.readdirSync(dir);
  
  // Regrouper les fichiers par type (basé sur l'extension ou le préfixe)
  const fileGroups = {};
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    
    // Si c'est un répertoire et qu'il n'est pas dans la liste d'exclusion
    if (stats.isDirectory()) {
      if (!options.excludeDirs.includes(file)) {
        // Nettoyer récursivement les sous-répertoires
        cleanDirectory(filePath, options);
      }
      return;
    }
    
    // Déterminer le type de fichier (extension ou préfixe)
    let fileType;
    
    if (file.startsWith('mochawesome_')) {
      // Pour les fichiers mochawesome_XXX.html et mochawesome_XXX.json
      fileType = 'mochawesome_' + path.extname(file);
    } else if (file.startsWith('results-')) {
      // Pour les fichiers results-XXXX.xml
      fileType = 'results';
    } else {
      // Pour les autres fichiers, utiliser l'extension
      fileType = path.extname(file);
    }
    
    if (!fileGroups[fileType]) {
      fileGroups[fileType] = [];
    }
    
    fileGroups[fileType].push({
      name: file,
      path: filePath,
      mtime: stats.mtime.getTime()
    });
  });
  
  // Pour chaque groupe, trier par date de modification et supprimer les plus anciens
  Object.keys(fileGroups).forEach(type => {
    const group = fileGroups[type];
    
    // Trier par date de modification (du plus récent au plus ancien)
    group.sort((a, b) => b.mtime - a.mtime);
    
    // Garder uniquement les N plus récents
    const toDelete = group.slice(options.keepLatest);
    
    // Supprimer les fichiers plus anciens
    toDelete.forEach(file => {
      fs.unlinkSync(file.path);
      console.log(`Supprimé: ${file.path}`);
    });
    
    console.log(`Conservé ${options.keepLatest} fichier(s) de type ${type}`);
  });
}

// Nettoyer les répertoires de rapports
cleanDirectory(MOCHAWESOME_DIR, { keepLatest: 1, excludeDirs: ['assets'] });
cleanDirectory(JUNIT_DIR, { keepLatest: 1 });

console.log('Nettoyage des rapports terminé !');
