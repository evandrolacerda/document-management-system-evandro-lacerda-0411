// Servidor backend do Document Management System.
//
// Camadas (Clean Architecture simples):
//   - routes/       (definição das rotas)
//   - controllers/  (entrada HTTP e validação)
//   - services/     (regras de negócio)
//   - repositories/ (persistência: arquivos locais + metadados em memória)
//
// Restrição do projeto: uploads são gravados no filesystem local da aplicação
// usando multer com diskStorage. Não utilize provedores externos.

const express = require('express');
const multer = require('multer');
const documentRoutes = require('./routes/documentRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Endpoint de verificação de saúde.
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Rotas de documentos: /upload, /documents e /documents/:id/download.
app.use(documentRoutes);

// Tratamento centralizado de erros (limites do sistema).
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
    return res
      .status(413)
      .json({ error: 'Arquivo excede o tamanho máximo permitido.' });
  }
  if (err.code === 'INVALID_FILE_TYPE') {
    return res.status(400).json({ error: err.message });
  }
  console.error(err);
  res.status(500).json({ error: 'Erro interno do servidor.' });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`DMS backend ouvindo na porta ${PORT}`);
  });
}

module.exports = app;
