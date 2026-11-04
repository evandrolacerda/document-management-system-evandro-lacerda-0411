// Controllers: tratam entrada/saída HTTP e validação básica.

const documentService = require('../services/documentService');

function upload(req, res) {
  if (!req.file) {
    return res
      .status(400)
      .json({ error: 'Nenhum arquivo enviado. Use o campo "file".' });
  }

  const owner = req.get('x-user-id') || 'anonymous';
  const document = documentService.registerUpload(req.file, owner);
  res.status(201).json(document);
}

function list(req, res) {
  const documents = documentService.listDocuments(req.query.owner);
  res.json(documents);
}

function download(req, res, next) {
  const result = documentService.getDocumentFile(req.params.id);
  if (!result) {
    return res.status(404).json({ error: 'Documento não encontrado.' });
  }

  // res.download envia o arquivo com Content-Disposition: attachment.
  res.download(result.filePath, result.document.originalName, (err) => {
    if (err && !res.headersSent) {
      next(err);
    }
  });
}

module.exports = { upload, list, download };
