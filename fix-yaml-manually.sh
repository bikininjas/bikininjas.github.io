#!/bin/bash

# Script pour corriger manuellement chaque fichier Markdown

# Fonction pour corriger un fichier
fix_file() {
  local file=$1
  local title=$2
  local date=$3
  local excerpt=$4
  local categories=$5
  
  # Créer un fichier temporaire avec le frontmatter corrigé
  cat > "${file}.tmp" << EOF
---
title: "${title}"
date: "${date}"
excerpt: "${excerpt}"
categories: ${categories}
---
EOF
  
  # Ajouter le reste du contenu (tout après la deuxième ligne "---")
  sed -n '/^---$/,/^---$/!p;//{/^---$/p;}' "$file" | sed '1,2d' >> "${file}.tmp"
  
  # Remplacer le fichier original
  mv "${file}.tmp" "$file"
  echo "Fichier corrigé: $file"
}

# Corriger chaque fichier
cd /home/seb/GITRepos/bikininjas.github.io-1/nextjs-blog/posts/

# ai-ethics-gaming.md
fix_file "ai-ethics-gaming.md" \
  "Éthique de l'IA dans les jeux vidéo : Équilibrer innovation et responsabilité" \
  "2025-03-24" \
  "Exploration des considérations éthiques entourant l'utilisation de l'IA dans les jeux vidéo, des PNJ intelligents à la collecte de données et au-delà." \
  "[\"IA\", \"Jeux Vidéo\", \"Éthique\"]"

# ai-assisted-game-design.md
fix_file "ai-assisted-game-design.md" \
  "Conception de Jeux Assistée par IA : Outils et Techniques pour les Développeurs Modernes" \
  "2025-03-25" \
  "Découvrez comment les outils d'IA permettent aux concepteurs de jeux de créer des mondes plus immersifs, des systèmes complexes et des expériences de jeu captivantes." \
  "[\"IA\", \"Développement de Jeux\", \"Technologie\"]"

# ai-in-game-development.md
fix_file "ai-in-game-development.md" \
  "L'IA dans le Développement de Jeux : Révolutionner l'Industrie" \
  "2025-03-28" \
  "Découvrez comment l'intelligence artificielle transforme le développement de jeux, de la génération procédurale de contenu aux comportements avancés des PNJ." \
  "[\"IA\", \"Développement de Jeux\", \"Technologie\"]"

# digital-wellbeing-gaming.md
fix_file "digital-wellbeing-gaming.md" \
  "Bien-être Numérique : Trouver l'Équilibre dans un Mode de Vie de Gamer" \
  "2025-03-28" \
  "Découvrez des stratégies pratiques pour maintenir une bonne santé mentale tout en profitant des jeux vidéo, et apprenez à créer des habitudes de jeu saines." \
  "[\"Santé Mentale\", \"Jeux Vidéo\"]"

# exemple-integration-youtube.md
fix_file "exemple-integration-youtube.md" \
  "Exemple d'intégration YouTube avec options avancées" \
  "2025-03-30" \
  "Découvrez comment intégrer des vidéos YouTube dans vos articles avec des options avancées comme le démarrage à un moment précis, la lecture automatique et plus encore." \
  "[\"Tutoriel\", \"Intégration\", \"YouTube\"]"

# gaming-communities-impact.md
fix_file "gaming-communities-impact.md" \
  "L'Impact des Communautés de Jeux sur le Développement Personnel et Social" \
  "2025-03-29" \
  "Une exploration de la façon dont les communautés de jeux en ligne façonnent notre développement personnel, nos compétences sociales et notre sentiment d'appartenance." \
  "[\"Communauté\", \"Jeux Vidéo\", \"Développement Personnel\"]"

# harcelement-en-ligne.md
fix_file "harcelement-en-ligne.md" \
  "Harcèlement en ligne dans les jeux : Comprendre et combattre la toxicité" \
  "2025-03-31" \
  "Une analyse approfondie du harcèlement dans les communautés de jeux en ligne, ses effets sur les joueurs et les stratégies pour créer des espaces plus sûrs et plus inclusifs." \
  "[\"Communauté\", \"Jeux Vidéo\", \"Sécurité En Ligne\"]"

# modding-skyrim-guide.md
fix_file "modding-skyrim-guide.md" \
  "Guide Complet de Modding pour Skyrim en 2025" \
  "2025-03-27" \
  "Un guide étape par étape pour transformer votre expérience Skyrim avec les meilleurs mods de 2025, des améliorations graphiques aux nouvelles quêtes et mécaniques de jeu." \
  "[\"Modding\", \"Skyrim\", \"Tutoriel\"]"

# star-citizen-4-1-update.md
fix_file "star-citizen-4-1-update.md" \
  "Star Citizen 4.1 : Tout ce que vous devez savoir sur la dernière mise à jour" \
  "2025-03-29" \
  "Une analyse détaillée de la mise à jour 4.1 de Star Citizen, couvrant les nouvelles fonctionnalités, les améliorations de performance et les changements de gameplay." \
  "[\"Star Citizen\", \"Mises à Jour\", \"Analyse\"]"

# unity-vs-unreal.md
fix_file "unity-vs-unreal.md" \
  "Unity vs Unreal Engine : Choisir le bon moteur pour votre projet de jeu en 2025" \
  "2025-03-26" \
  "Une comparaison approfondie des deux moteurs de jeu les plus populaires, examinant leurs forces, faiblesses et cas d'utilisation optimaux pour différents types de projets." \
  "[\"Développement de Jeux\", \"Unity\", \"Unreal Engine\"]"

# unreal-engine-beginners-guide.md
fix_file "unreal-engine-beginners-guide.md" \
  "Guide du débutant pour Unreal Engine 5.4" \
  "2025-03-25" \
  "Un guide complet pour les débutants qui souhaitent apprendre Unreal Engine 5.4, couvrant l'interface, les bases du Blueprint et les fondamentaux de la création de jeux." \
  "[\"Développement de Jeux\", \"Unreal Engine\", \"Tutoriel\"]"

echo "Tous les fichiers ont été corrigés!"
