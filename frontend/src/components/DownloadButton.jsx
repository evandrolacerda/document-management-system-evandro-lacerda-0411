import { useState } from 'react';
import { downloadDocument } from '../services/documentApi.js';

// Botão que baixa um documento específico pelo id.
export default function DownloadButton({ documentId, fileName }) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState(null);

  async function handleDownload() {
    setIsDownloading(true);
    setError(null);
    try {
      await downloadDocument(documentId, fileName);
    } catch (downloadError) {
      setError(downloadError.message || 'Falha ao baixar o documento.');
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <>
      <button type="button" onClick={handleDownload} disabled={isDownloading}>
        {isDownloading ? 'Baixando...' : 'Baixar'}
      </button>
      {error && <span role="alert" style={{ color: 'crimson', marginLeft: '0.5rem' }}>{error}</span>}
    </>
  );
}
