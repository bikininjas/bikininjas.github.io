#!/bin/bash

# Script pour corriger la syntaxe YAML dans tous les fichiers Markdown
# Remplace les guillemets simples par des guillemets doubles dans le frontmatter YAML

for file in /home/seb/GITRepos/bikininjas.github.io-1/nextjs-blog/posts/*.md; do
  echo "Traitement du fichier: $file"
  
  # Utiliser awk pour remplacer les guillemets simples par des guillemets doubles dans le frontmatter YAML
  # Le frontmatter est délimité par des lignes contenant uniquement "---"
  awk '
  BEGIN { in_frontmatter = 0; }
  /^---$/ { 
    print; 
    if (in_frontmatter == 0) {
      in_frontmatter = 1;
    } else {
      in_frontmatter = 0;
    }
    next;
  }
  in_frontmatter == 1 { 
    # Remplacer les guillemets simples qui entourent des valeurs
    gsub(/: '\''([^'\'']*)'\''/,": \"\\1\"");
    # Remplacer les guillemets simples dans les tableaux
    gsub(/'\''([^'\'']*)'\''/, "\"\\1\"");
  }
  { print; }
  ' "$file" > "$file.tmp" && mv "$file.tmp" "$file"
done

echo "Correction terminée!"
