import { useRef, useState } from 'react';
import { uploadDocument } from '../services/documentApi.js';

// Formulário de upload de documentos. Notifica o componente pai após o envio
// bem-sucedido através do callback onUploadSuccess.
export default function UploadComponent({ onUploadSuccess }) {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  function handleFileChange(event) {
    setSelectedFile(event.target.files[0] || null);
    setError(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!selectedFile) {
      setError('Selecione um arquivo antes de enviar.');
      return;
    }

    setIsUploading(true);
    setError(null);
    try {
      await uploadDocument(selectedFile);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (uploadError) {
      setError(uploadError.message || 'Falha ao enviar o documento.');
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <section>
      <h2>Enviar documento</h2>
      <form onSubmit={handleSubmit}>
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          disabled={isUploading}
        />
        <button type="submit" disabled={isUploading || !selectedFile}>
          {isUploading ? 'Enviando...' : 'Enviar'}
        </button>
      </form>
      {error && <p role="alert" style={{ color: 'crimson' }}>{error}</p>}
    </section>
  );
}
