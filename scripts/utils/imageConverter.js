const fs = require('fs');
const path = require('path');
const mime = require('mime-types');

/**
 * Convierte una imagen a base64
 * @param {string} imagePath - Ruta de la imagen
 * @returns {Object|null} - { imageBase64, imageMime } o null si no existe
 */
function convertImageToBase64(imagePath) {
  try {
    // Construir la ruta completa desde la carpeta public (un nivel arriba de scripts)
    const fullPath = path.join(process.cwd(), '..', 'public', imagePath.replace(/^\//, ''));

    // Verificar si el archivo existe
    if (!fs.existsSync(fullPath)) {
      console.warn(`⚠️  Imagen no encontrada: ${fullPath}`);
      return null;
    }

    // Leer el archivo
    const imageBuffer = fs.readFileSync(fullPath);

    // Obtener el tipo MIME
    const imageMime = mime.lookup(fullPath) || 'image/jpeg';

    // Convertir a base64
    const imageBase64 = imageBuffer.toString('base64');

    console.log(`✅ Imagen convertida: ${imagePath} (${imageMime})`);

    return {
      imageBase64,
      imageMime
    };
  } catch (error) {
    console.error(`❌ Error convirtiendo imagen ${imagePath}:`, error.message);
    return null;
  }
}

/**
 * Convierte múltiples imágenes a base64
 * @param {string[]} imagePaths - Array de rutas de imágenes
 * @returns {Array} - Array de objetos { imageBase64, imageMime }
 */
function convertMultipleImages(imagePaths) {
  return imagePaths
    .map(convertImageToBase64)
    .filter(Boolean); // Filtrar nulls
}

/**
 * Procesa una imagen con datos por defecto si no existe
 * @param {string} imagePath - Ruta de la imagen
 * @param {string} defaultMime - MIME type por defecto
 * @returns {Object} - { imageBase64, imageMime }
 */
function processImageWithFallback(imagePath, defaultMime = 'image/jpeg') {
  const result = convertImageToBase64(imagePath);

  if (result) {
    return result;
  }

  // Imagen por defecto (1x1 pixel transparente PNG)
  const defaultBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

  return {
    imageBase64: defaultBase64,
    imageMime: 'image/png'
  };
}

module.exports = {
  convertImageToBase64,
  convertMultipleImages,
  processImageWithFallback
};