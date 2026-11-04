// Repositório em memória para os metadados dos documentos.
// Nesta fase inicial os metadados são perdidos quando o processo reinicia.

const documents = [];

function save(document) {
  documents.push(document);
  return document;
}

function findAll(owner) {
  if (owner) {
    return documents.filter((document) => document.owner === owner);
  }
  return [...documents];
}

function findById(id) {
  return documents.find((document) => document.id === id) || null;
}

module.exports = { save, findAll, findById };
