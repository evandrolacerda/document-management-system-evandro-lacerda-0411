import DownloadButton from './DownloadButton.jsx';

// Formata o tamanho do arquivo em unidades legíveis.
function formatFileSize(bytes) {
  if (typeof bytes !== 'number' || Number.isNaN(bytes)) {
    return '-';
  }
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Formata a data de envio no padrão local do navegador.
function formatDate(value) {
  if (!value) {
    return '-';
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '-' : date.toLocaleString();
}

// Lista de documentos com ação de download. Componente de apresentação:
// recebe os dados e estados de carregamento/erro do componente pai.
export default function DocumentList({ documents, isLoading, error }) {
  if (isLoading) {
    return <p>Carregando documentos...</p>;
  }

  if (error) {
    return <p role="alert" style={{ color: 'crimson' }}>{error}</p>;
  }

  if (!documents || documents.length === 0) {
    return <p>Nenhum documento enviado ainda.</p>;
  }

  return (
    <table style={{ borderCollapse: 'collapse', width: '100%' }}>
      <thead>
        <tr>
          <th style={{ textAlign: 'left', padding: '0.5rem' }}>Nome</th>
          <th style={{ textAlign: 'left', padding: '0.5rem' }}>Tamanho</th>
          <th style={{ textAlign: 'left', padding: '0.5rem' }}>Enviado em</th>
          <th style={{ textAlign: 'left', padding: '0.5rem' }}>Ações</th>
        </tr>
      </thead>
      <tbody>
        {documents.map((doc) => (
          <tr key={doc.id}>
            <td style={{ padding: '0.5rem' }}>{doc.originalName || doc.name}</td>
            <td style={{ padding: '0.5rem' }}>{formatFileSize(doc.size)}</td>
            <td style={{ padding: '0.5rem' }}>{formatDate(doc.uploadedAt || doc.createdAt)}</td>
            <td style={{ padding: '0.5rem' }}>
              <DownloadButton
                documentId={doc.id}
                fileName={doc.originalName || doc.name}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
