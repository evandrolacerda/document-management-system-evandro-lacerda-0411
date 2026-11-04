// Configuração da aplicação via variáveis de ambiente (12-Factor App).

const path = require('path');

const storageDir =
  process.env.STORAGE_DIR || path.join(__dirname, '..', 'storage');

const maxFileSizeMb = Number(process.env.MAX_FILE_SIZE_MB) || 100;

module.exports = {
  storageDir,
  maxFileSizeBytes: maxFileSizeMb * 1024 * 1024,
};
