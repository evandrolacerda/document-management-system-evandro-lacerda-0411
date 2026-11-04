// Rotas de documentos: configuram o multer (diskStorage local) e delegam
// o tratamento das requisições aos controllers.

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const express = require('express');
const multer = require('multer');
const documentController = require('../controllers/documentController');
const { storageDir, maxFileSizeBytes } = require('../config');

// Extensões permitidas conforme a especificação (docs/specs/dms-spec.md).
const ALLOWED_EXTENSIONS = new Set([
  '.pdf',
  '.png',
  '.jpg',
  '.jpeg',
  '.txt',
  '.docx',
  '.xlsx',
  '.csv',
  '.md',
]);

// Garante que a pasta de armazenamento local exista.
fs.mkdirSync(storageDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, storageDir),
  filename: (req, file, cb) => {
    // Nome único e seguro em disco: uuid + extensão (evita path traversal
    // e colisões; nunca usa o nome original cru).
    const extension = path.extname(file.originalname).toLowerCase();
    cb(null, `${crypto.randomUUID()}${extension}`);
  },
});

function fileFilter(req, file, cb) {
  const extension = path.extname(file.originalname).toLowerCase();
  if (!ALLOWED_EXTENSIONS.has(extension)) {
    const error = new Error('Tipo de arquivo não permitido.');
    error.code = 'INVALID_FILE_TYPE';
    return cb(error);
  }
  cb(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: maxFileSizeBytes },
});

const router = express.Router();

router.post('/upload', upload.single('file'), documentController.upload);
router.get('/documents', documentController.list);
router.get('/documents/:id/download', documentController.download);

module.exports = router;
