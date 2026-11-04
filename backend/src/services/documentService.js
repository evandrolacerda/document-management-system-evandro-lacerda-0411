// Regras de negócio dos documentos: montagem dos metadados e consultas.

const path = require('path');
const documentRepository = require('../repositories/documentRepository');
const { storageDir } = require('../config');

function registerUpload(file, owner) {
  // O nome físico em disco é "<uuid>.<ext>"; o id é o uuid sem a extensão.
  const id = path.parse(file.filename).name;

  const document = {
    id,
    originalName: file.originalname,
    storedName: file.filename,
    mimeType: file.mimetype,
    size: file.size,
    uploadedAt: new Date().toISOString(),
    owner,
  };

  return documentRepository.save(document);
}

function listDocuments(owner) {
  return documentRepository.findAll(owner);
}

function getDocumentFile(id) {
  const document = documentRepository.findById(id);
  if (!document) {
    return null;
  }
  return {
    document,
    filePath: path.join(storageDir, document.storedName),
  };
}

module.exports = { registerUpload, listDocuments, getDocumentFile };
