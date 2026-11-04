// Cliente de API do Document Management System.
// Toda a comunicação com o backend passa pelo prefixo /api (proxy do Vite).

const API_PREFIX = '/api';

// Interpreta a resposta HTTP e lança um erro com mensagem amigável em caso de falha.
async function handleResponse(response) {
  if (!response.ok) {
    let message = `Erro na requisição (${response.status})`;
    try {
      const body = await response.json();
      if (body && body.error) {
        message = body.error;
      }
    } catch {
      // Resposta sem corpo JSON: mantém a mensagem padrão.
    }
    throw new Error(message);
  }
  return response;
}

// Envia um documento para o backend via multipart/form-data.
export async function uploadDocument(file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await handleResponse(
    await fetch(`${API_PREFIX}/upload`, {
      method: 'POST',
      body: formData,
    })
  );
  return response.json();
}

// Lista os documentos cadastrados.
export async function listDocuments() {
  const response = await handleResponse(await fetch(`${API_PREFIX}/documents`));
  return response.json();
}

// Baixa um documento e dispara o download no navegador.
export async function downloadDocument(id, fileName) {
  const response = await handleResponse(
    await fetch(`${API_PREFIX}/documents/${id}/download`)
  );
  const blob = await response.blob();

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName || 'documento';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
