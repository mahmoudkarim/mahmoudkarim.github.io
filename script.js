// Charger les polices Google Fonts
const link = document.createElement('link');
link.href = 'https://fonts.googleapis.com/css2?family=Amatic+SC&family=Bangers&family=Barriecito&family=Bungee&family=Bungee+Inline&family=Bungee+Outline&family=Cinzel&family=Dancing+Script&family=Fira+Sans&family=Great+Vibes&family=Indie+Flower&family=Kaushan+Script&family=Lobster+Two&family=Merriweather&family=Orbitron&family=Pacifico&family=Playfair+Display&family=Rock+Salt&family=Sacramento&family=Satisfy&family=Shadows+Into+Light&display=swap';
link.rel = 'stylesheet';
document.head.appendChild(link);

const canvas = document.getElementById('neonCanvas');
const ctx = canvas.getContext('2d');
const fontContent = document.getElementById('fontContent');
const activeFontElement = document.getElementById('activeFont');
const neonText = document.getElementById('neonText');
const neonColor = document.getElementById('neonColor');

// Liste des polices
const fonts = [
  "Pacifico", "Dancing Script", "Lobster", "Kaushan Script", "Sacramento",
  "Rock Salt", "Satisfy", "Indie Flower", "Great Vibes", "Cinzel",
  "Fira Sans", "Bungee", "Amatic SC", "Bangers", "Barriecito",
  "Lobster Two", "Shadows Into Light", "Merriweather", "Playfair Display",
  "Orbitron", "Courier New"
];

// Générer les carrés de police dynamiquement
link.onload = () => {
  fonts.forEach(font => {
    const square = document.createElement('div');
    square.className = 'font-square';
    square.dataset.font = font;
    square.innerHTML = `<span>${font}</span>`;
    square.style.fontFamily = `${font}, Arial`;
    square.onclick = () => selectFont(font);
    fontContent.appendChild(square);
  });
  drawNeonWithDefault();
  updateActiveFont("Pacifico");
};

// Gérer le clic sur le toggle
document.querySelector('.font-toggle').addEventListener('click', () => {
  fontContent.classList.toggle('active');
});

// Ajouter les écouteurs d'événements pour le textarea et le select
document.addEventListener('DOMContentLoaded', () => {
  neonText.addEventListener('input', () => {
    restrictInput(neonText);
    drawNeon();
  });
  neonColor.addEventListener('change', drawNeon);
});

// Fonction pour restreindre à 4 lignes et 20 caractères par ligne
function restrictInput(textarea) {
  const maxLines = 4;
  const maxCharsPerLine = 20;
  let lines = textarea.value.split('\n');

  // Limiter chaque ligne à 20 caractères
  lines = lines.map(line => line.substring(0, maxCharsPerLine));

  // Limiter à 4 lignes maximum
  if (lines.length > maxLines) {
    lines = lines.slice(0, maxLines);
  }

  // Mettre à jour la valeur du textarea
  textarea.value = lines.join('\n');
}

const drawNeonWithDefault = () => drawNeon("");

const drawNeon = (text = null) => {
  const neonTextValue = text !== null ? text : neonText.value;
  const fontStyle = canvas.dataset.font || "Pacifico";
  const neonColorValue = neonColor.value || '#00ffff';

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const columnWidth = canvas.width;
  const canvasHeight = canvas.height;
  const minHeight = canvasHeight * 0.4; // 40% de la hauteur du canvas
  const maxHeight = canvasHeight * 0.8; // 80% de la hauteur du canvas
  
  // Limiter à 4 lignes maximum
  const lines = neonTextValue.split('\n').map(line => line.trim()).filter(line => line.length > 0).slice(0, 4);

  if (lines.length === 0) return;

  let lineConfigs = lines.map(line => {
    let fontSize = 80; // Taille initiale
    let textWidth;
    let innerIteration = 0;
    const innerIterationLimit = 20;

    // Ajuster la taille de la police pour la largeur
    do {
      ctx.font = `${fontSize}px ${fontStyle}, Arial`;
      textWidth = ctx.measureText(line).width;
      if (textWidth > columnWidth * 0.5) fontSize -= 5;
      innerIteration++;
    } while (textWidth > columnWidth * 0.5 && fontSize > 20 && innerIteration < innerIterationLimit);

    return { text: line, fontSize };
  });

  // Calculer la hauteur totale avec un espacement accru (1.5 au lieu de 1.2)
  let totalHeight = lineConfigs.reduce((sum, config) => sum + config.fontSize * 1.5, 0);

  // Ajuster la taille de la police pour respecter minHeight et maxHeight
  if (lineConfigs.length > 0) {
    let iterationCount = 0;
    const iterationLimit = 50;

    while ((totalHeight < minHeight || totalHeight > maxHeight) && lineConfigs[0].fontSize > 10 && iterationCount < iterationLimit) {
      const adjustment = totalHeight > maxHeight ? -5 : 5;

      lineConfigs = lineConfigs.map(config => {
        let fontSize = config.fontSize + adjustment;
        let textWidth;
        let innerIteration = 0;
        const innerIterationLimit = 20;

        do {
          ctx.font = `${fontSize}px ${fontStyle}, Arial`;
          textWidth = ctx.measureText(config.text).width;
          if (textWidth > columnWidth * 0.5) fontSize -= 5;
          innerIteration++;
        } while (textWidth > columnWidth * 0.5 && fontSize > 10 && innerIteration < innerIterationLimit);

        return { text: config.text, fontSize };
      });

      totalHeight = lineConfigs.reduce((sum, config) => sum + config.fontSize * 1.5, 0);
      iterationCount++;
    }

    if (iterationCount >= iterationLimit) {
      console.warn("Ajustement de la taille de police interrompu pour éviter une boucle infinie.");
    }
  }

  // Calculer la position Y initiale pour centrer verticalement
  let currentY = (canvasHeight - totalHeight) / 2 + (lineConfigs[0].fontSize * 0.75); // Ajustement pour la première ligne

  // Dessiner chaque ligne avec un espacement accru
  lineConfigs.forEach(config => {
    const { text, fontSize } = config;
    ctx.font = `${fontSize}px ${fontStyle}, Arial`;
    const centerX = columnWidth * 0.25 + (columnWidth * 0.5) / 2;

    ctx.lineWidth = 4;
    ctx.strokeStyle = neonColorValue;
    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = 5;
    ctx.shadowColor = neonColorValue;

    ctx.strokeText(text, centerX, currentY);
    ctx.fillText(text, centerX, currentY);

    currentY += fontSize * 1.5; // Espacement accru entre les lignes
  });
};

const selectFont = (font) => {
  canvas.dataset.font = font;
  drawNeon();
  updateActiveFont(font);
  fontContent.classList.remove('active');
};

const updateActiveFont = (font) => {
  activeFontElement.textContent = font;
  activeFontElement.style.fontFamily = `${font}, Arial`;
};

// Dessiner au chargement initial
if (!link.onload) {
  drawNeonWithDefault();
  updateActiveFont("Pacifico");
}