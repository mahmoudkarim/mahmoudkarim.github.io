// Charger les polices Google Fonts
const link = document.createElement('link');
link.href = 'https://fonts.googleapis.com/css2?family=Amatic+SC&family=Bangers&family=Barriecito&family=Bungee&family=Bungee+Inline&family=Bungee+Outline&family=Cinzel&family=Dancing+Script&family=Fira+Sans&family=Great+Vibes&family=Indie+Flower&family=Kaushan+Script&family=Lobster+Two&family=Merriweather&family=Orbitron&family=Pacifico&family=Playfair+Display&family=Rock+Salt&family=Sacramento&family=Satisfy&family=Shadows+Into+Light&display=swap';
link.rel = 'stylesheet';
document.head.appendChild(link);

const canvas = document.getElementById('neonCanvas');
const ctx = canvas.getContext('2d');
const fontContent = document.getElementById('fontContent');
const activeFontElement = document.getElementById('activeFont');

// Liste des polices (sans Arial)
const fonts = [
  "Pacifico", "Dancing Script", "Lobster", "Kaushan Script", "Sacramento",
  "Rock Salt", "Satisfy", "Indie Flower", "Great Vibes", "Cinzel",
  "Fira Sans", "Bungee", "Amatic SC", "Bangers", "Barriecito",
  "Lobster Two", "Shadows Into Light", "Merriweather", "Playfair Display",
  "Orbitron", "Courier New"
];

// Générer les carrés de police dynamiquement une fois les polices chargées
link.onload = function() {
  fonts.forEach(font => {
    const square = document.createElement('div');
    square.className = 'font-square';
    square.dataset.font = font;
    square.innerHTML = `<span>${font}</span>`;
    square.style.fontFamily = font + ', Arial';
    square.onclick = () => selectFont(font);
    fontContent.appendChild(square);
  });
  drawNeonWithDefault();
  updateActiveFont("Pacifico");
};

// Gérer le clic sur le toggle
document.querySelector('.font-toggle').addEventListener('click', function() {
  fontContent.classList.toggle('active');
});

function drawNeonWithDefault() {
  const text = "";
  const fontStyle = "Pacifico";
  const neonColor = document.getElementById('neonColor').value || '#00ffff';

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const columnWidth = canvas.width;
  const canvasHeight = canvas.height;
  const minHeight = canvasHeight * 0.4; // 40% de la hauteur
  const maxHeight = canvasHeight * 0.8; // 80% de la hauteur
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);

  // Calculer la taille de la police pour chaque ligne
  let lineConfigs = lines.map(line => {
    let fontSize = 80;
    let textWidth;
    do {
      ctx.font = `${fontSize}px ${fontStyle}, Arial`;
      textWidth = ctx.measureText(line).width;
      const maxWidth = columnWidth * 0.5;
      if (textWidth > maxWidth) {
        fontSize -= 5;
      }
    } while (textWidth > columnWidth * 0.5 && fontSize > 20);
    return { text: line, fontSize };
  });

  // Ajuster la taille de la police pour respecter la hauteur totale (40% à 80%)
  let totalHeight = lineConfigs.reduce((sum, config) => sum + config.fontSize * 1.2, 0);
  if (lines.length > 0) {
    while ((totalHeight < minHeight || totalHeight > maxHeight) && lineConfigs[0].fontSize > 20) {
      const adjustment = totalHeight > maxHeight ? -5 : 5; // Réduire si trop grand, augmenter si trop petit
      lineConfigs = lineConfigs.map(config => {
        let fontSize = config.fontSize + adjustment;
        let textWidth;
        do {
          ctx.font = `${fontSize}px ${fontStyle}, Arial`;
          textWidth = ctx.measureText(config.text).width;
          const maxWidth = columnWidth * 0.5;
          if (textWidth > maxWidth) {
            fontSize -= 5;
          }
        } while (textWidth > columnWidth * 0.5 && fontSize > 20);
        return { text: config.text, fontSize };
      });
      totalHeight = lineConfigs.reduce((sum, config) => sum + config.fontSize * 1.2, 0);
    }
  }

  // Calculer la position verticale pour centrer le texte
  let currentY = (canvasHeight - totalHeight) / 2 + (lineConfigs.length > 0 ? lineConfigs[0].fontSize : 0);

  lineConfigs.forEach(config => {
    const { text, fontSize } = config;
    ctx.font = `${fontSize}px ${fontStyle}, Arial`;
    const startX = columnWidth * 0.25;
    const centerX = startX + (columnWidth * 0.5) / 2;

    ctx.lineWidth = 4;
    ctx.strokeStyle = neonColor;
    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = 5;
    ctx.shadowColor = neonColor;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    ctx.beginPath();
    ctx.strokeText(text, centerX, currentY);
    ctx.fillText(text, centerX, currentY);

    currentY += fontSize * 1.2;
  });
}

function drawNeon() {
  const text = document.getElementById('neonText').value;
  const fontStyle = canvas.dataset.font || "Pacifico";
  const neonColor = document.getElementById('neonColor').value || '#00ffff';

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const columnWidth = canvas.width;
  const canvasHeight = canvas.height;
  const minHeight = canvasHeight * 0.4; // 40% de la hauteur
  const maxHeight = canvasHeight * 0.8; // 80% de la hauteur
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);

  // Calculer la taille de la police pour chaque ligne
  let lineConfigs = lines.map(line => {
    let fontSize = 80;
    let textWidth;
    do {
      ctx.font = `${fontSize}px ${fontStyle}, Arial`;
      textWidth = ctx.measureText(line).width;
      const maxWidth = columnWidth * 0.5;
      if (textWidth > maxWidth) {
        fontSize -= 5;
      }
    } while (textWidth > columnWidth * 0.5 && fontSize > 20);
    return { text: line, fontSize };
  });

  // Ajuster la taille de la police pour respecter la hauteur totale (40% à 80%)
  let totalHeight = lineConfigs.reduce((sum, config) => sum + config.fontSize * 1.2, 0);
  if (lines.length > 0) {
    while ((totalHeight < minHeight || totalHeight > maxHeight) && lineConfigs[0].fontSize > 20) {
      const adjustment = totalHeight > maxHeight ? -5 : 5; // Réduire si trop grand, augmenter si trop petit
      lineConfigs = lineConfigs.map(config => {
        let fontSize = config.fontSize + adjustment;
        let textWidth;
        do {
          ctx.font = `${fontSize}px ${fontStyle}, Arial`;
          textWidth = ctx.measureText(config.text).width;
          const maxWidth = columnWidth * 0.5;
          if (textWidth > maxWidth) {
            fontSize -= 5;
          }
        } while (textWidth > columnWidth * 0.5 && fontSize > 20);
        return { text: config.text, fontSize };
      });
      totalHeight = lineConfigs.reduce((sum, config) => sum + config.fontSize * 1.2, 0);
    }
  }

  // Calculer la position verticale pour centrer le texte
  let currentY = (canvasHeight - totalHeight) / 2 + (lineConfigs.length > 0 ? lineConfigs[0].fontSize : 0);

  lineConfigs.forEach(config => {
    const { text, fontSize } = config;
    ctx.font = `${fontSize}px ${fontStyle}, Arial`;
    const startX = columnWidth * 0.25;
    const centerX = startX + (columnWidth * 0.5) / 2;

    ctx.lineWidth = 4;
    ctx.strokeStyle = neonColor;
    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = 5;
    ctx.shadowColor = neonColor;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    ctx.beginPath();
    ctx.strokeText(text, centerX, currentY);
    ctx.fillText(text, centerX, currentY);

    currentY += fontSize * 1.2;
  });
}

function selectFont(font) {
  canvas.dataset.font = font;
  drawNeon();
  updateActiveFont(font);
  fontContent.classList.remove('active');
}

function updateActiveFont(font) {
  activeFontElement.textContent = font;
  activeFontElement.style.fontFamily = font + ', Arial';
}

// Dessiner au chargement initial avec Pacifico une fois les polices chargées
if (link.onload) {
  // La fonction drawNeonWithDefault() sera appelée automatiquement après le chargement des polices
} else {
  drawNeonWithDefault();
  updateActiveFont("Pacifico");
}