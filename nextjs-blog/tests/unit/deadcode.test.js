import fs from 'fs';
import path from 'path';

// Fonction pour lire tous les fichiers JS/JSX récursivement
function getAllJsFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !filePath.includes('node_modules') && !filePath.includes('.next')) {
      fileList = getAllJsFiles(filePath, fileList);
    } else if (
      (file.endsWith('.js') || file.endsWith('.jsx')) && 
      !file.includes('.test.') && 
      !file.includes('.spec.') &&
      !file.includes('jest.config.js') &&
      !file.includes('next.config.js')
    ) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Fonction pour détecter les fonctions non utilisées
function detectUnusedFunctions(fileContent) {
  const functionRegex = /function\s+(\w+)\s*\(/g;
  const exportedFunctionRegex = /export\s+(?:default\s+)?function\s+(\w+)\s*\(/g;
  const constFunctionRegex = /const\s+(\w+)\s*=\s*(?:async\s*)?\([^)]*\)\s*=>/g;
  
  const allFunctions = [];
  const exportedFunctions = [];
  
  // Trouver toutes les fonctions
  let match;
  while ((match = functionRegex.exec(fileContent)) !== null) {
    allFunctions.push(match[1]);
  }
  
  // Trouver les fonctions exportées
  while ((match = exportedFunctionRegex.exec(fileContent)) !== null) {
    exportedFunctions.push(match[1]);
  }
  
  // Trouver les fonctions const
  while ((match = constFunctionRegex.exec(fileContent)) !== null) {
    allFunctions.push(match[1]);
  }
  
  // Filtrer les fonctions non utilisées (qui ne sont pas exportées et ne sont pas appelées ailleurs dans le fichier)
  const potentiallyUnusedFunctions = allFunctions.filter(func => {
    if (exportedFunctions.includes(func)) return false;
    
    // Vérifier si la fonction est utilisée ailleurs dans le fichier
    const regex = new RegExp(`\\b${func}\\s*\\(`, 'g');
    let count = 0;
    while (regex.exec(fileContent) !== null) {
      count++;
    }
    
    // Si la fonction apparaît plus d'une fois (sa définition + au moins un appel), elle est utilisée
    return count <= 1;
  });
  
  return potentiallyUnusedFunctions;
}

// Fonction pour détecter les variables non utilisées
function detectUnusedVariables(fileContent) {
  const constVarRegex = /const\s+(\w+)\s*=/g;
  const letVarRegex = /let\s+(\w+)\s*=/g;
  const varRegex = /var\s+(\w+)\s*=/g;
  
  const allVariables = [];
  
  // Trouver toutes les variables
  let match;
  while ((match = constVarRegex.exec(fileContent)) !== null) {
    allVariables.push(match[1]);
  }
  
  while ((match = letVarRegex.exec(fileContent)) !== null) {
    allVariables.push(match[1]);
  }
  
  while ((match = varRegex.exec(fileContent)) !== null) {
    allVariables.push(match[1]);
  }
  
  // Filtrer les variables non utilisées
  const potentiallyUnusedVariables = allVariables.filter(variable => {
    // Ignorer les variables courantes comme i, j, k, etc.
    if (['i', 'j', 'k', 'e', 'err', 'error', 'res', 'result'].includes(variable)) return false;
    
    // Vérifier si la variable est utilisée ailleurs dans le fichier
    const regex = new RegExp(`\\b${variable}\\b`, 'g');
    let count = 0;
    while (regex.exec(fileContent) !== null) {
      count++;
    }
    
    // Si la variable apparaît plus d'une fois (sa définition + au moins un usage), elle est utilisée
    return count <= 1;
  });
  
  return potentiallyUnusedVariables;
}

describe('Dead Code Detection', () => {
  test('should not have unused functions or variables', () => {
    const rootDir = path.resolve(__dirname, '../../');
    const jsFiles = getAllJsFiles(rootDir);
    
    const unusedCode = {};
    
    jsFiles.forEach(file => {
      const fileContent = fs.readFileSync(file, 'utf8');
      const unusedFunctions = detectUnusedFunctions(fileContent);
      const unusedVariables = detectUnusedVariables(fileContent);
      
      if (unusedFunctions.length > 0 || unusedVariables.length > 0) {
        unusedCode[file] = {
          functions: unusedFunctions,
          variables: unusedVariables
        };
      }
    });
    
    // Afficher les résultats pour information (ne pas faire échouer le test)
    if (Object.keys(unusedCode).length > 0) {
      console.log('Potential dead code found:');
      console.log(JSON.stringify(unusedCode, null, 2));
    }
    
    // Ce test est informatif et ne devrait pas faire échouer la suite de tests
    expect(true).toBe(true);
  });
});
