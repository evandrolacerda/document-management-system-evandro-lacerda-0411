import { useCallback, useEffect, useState } from 'react';
import UploadComponent from './components/UploadComponent.jsx';
import DocumentList from './components/DocumentList.jsx';
import { listDocuments } from './services/documentApi.js';

// Componente raiz: orquestra o upload e a listagem de documentos.
export default function App() {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshDocuments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await listDocuments();
      setDocuments(Array.isArray(data) ? data : data.documents || []);
    } catch (listError) {
      setError(listError.message || 'Falha ao carregar os documentos.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshDocuments();
  }, [refreshDocuments]);

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem' }}>
      <h1>Document Management System</h1>
      <UploadComponent onUploadSuccess={refreshDocuments} />
      <section>
        <h2>Documentos</h2>
        <DocumentList documents={documents} isLoading={isLoading} error={error} />
      </section>
    </main>
  );
}
