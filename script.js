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
  
  // Limiter à 4 lignes maximum
  const lines = neonTextValue.split('\n').map(line => line.trim()).filter(line => line.length > 0).slice(0, 4);

  if (lines.length === 0) return;

  // Définir les pourcentages pour chaque ligne (22% par ligne pour laisser des marges)
  const lineHeightPercentage = 22; // 22% de la hauteur par ligne (88% total avec 4 lignes)
  const lineHeight = canvasHeight * (lineHeightPercentage / 100); // Hauteur en pixels
  const maxFontSizePercentage = 18; // 18% de la hauteur totale comme taille max
  const maxFontSize = canvasHeight * (maxFontSizePercentage / 100);
  const minFontSizePercentage = 8; // 3% comme taille minimale
  const minFontSize = canvasHeight * (minFontSizePercentage / 100);

  let lineConfigs = lines.map(line => {
    // Calculer la taille de la police en fonction de la longueur du texte
    const textLength = line.length;
    let fontSize = maxFontSize;

    // Réduire la taille proportionnellement à la longueur (20 caractères max)
    if (textLength > 0) {
      fontSize = Math.max(minFontSize, maxFontSize * (20 - textLength) / 20);
    }

    let textWidth;
    let innerIteration = 0;
    const innerIterationLimit = 20;

    // Ajuster la taille pour la largeur du canvas
    do {
      ctx.font = `${fontSize}px ${fontStyle}, Arial`;
      textWidth = ctx.measureText(line).width;
      if (textWidth > columnWidth * 0.5) fontSize -= 5;
      innerIteration++;
    } while (textWidth > columnWidth * 0.5 && fontSize > minFontSize && innerIteration < innerIterationLimit);

    // Limiter à maxFontSize
    fontSize = Math.min(fontSize, maxFontSize);

    return { text: line, fontSize };
  });

  // Calculer la hauteur totale en pourcentage pour centrer
  const totalHeightPercentage = lines.length * lineHeightPercentage; // Pourcentage total occupé
  const totalHeight = canvasHeight * (totalHeightPercentage / 100);
  const startY = (canvasHeight - totalHeight) / 2; // Centrer précisément le bloc de texte

  lineConfigs.forEach((config, index) => {
    const { text, fontSize } = config;
    ctx.font = `${fontSize}px ${fontStyle}, Arial`;
    const centerX = columnWidth * 0.25 + (columnWidth * 0.5) / 2;

    // Position Y en pourcentage, centrée dans chaque section
    const currentY = startY + index * lineHeight + lineHeight / 2; // Centre de chaque section

    ctx.lineWidth = 4;
    ctx.strokeStyle = neonColorValue;
    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = 5;
    ctx.shadowColor = neonColorValue;

    ctx.strokeText(text, centerX, currentY);
    ctx.fillText(text, centerX, currentY);
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