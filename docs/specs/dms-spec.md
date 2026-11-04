# Plano — Especificação do Document Management System (dms-spec.md)

## Problema

O repositório é um seed do DMS (backend Express + frontend React/Vite) e possui
apenas o modelo de especificação em `docs/specs/spec-template.md`. É necessário
gerar a especificação completa do sistema em `docs/specs/dms-spec.md`, seguindo
a estrutura do template, com requisitos funcionais, modelo de dados, contratos
de API e plano de execução em etapas.

**Escopo deste plano:** criar APENAS o documento `docs/specs/dms-spec.md`.
Nenhum arquivo de backend ou frontend será criado ou alterado nesta fase.

## Decisões confirmadas com o usuário

| Decisão | Valor |
| --- | --- |
| Identificação do dono (owner) | Header HTTP `x-user-id`; default `anonymous` se ausente |
| Limite de tamanho de upload | 100 MB (configurável via env `MAX_FILE_SIZE_MB`) |
| Tipos de arquivo | Restritos a uma lista permitida (pdf, png, jpg/jpeg, txt, docx, xlsx, csv, md) |
| Formato de erro | JSON simples: `{ "error": "mensagem" }` |

## Estrutura do documento dms-spec.md

Seguirá as 8 seções do template, preenchidas com conteúdo completo:

1. **Objetivo** — frase única descrevendo o sistema (gestão local de documentos
   com upload, listagem e download por usuário).
2. **Escopo** — dentro: upload, listagem, download, gestão simples por usuário
   (filtro por `owner`); fora: armazenamento externo/nuvem, versionamento,
   autenticação real, banco de dados persistente, edição/remoção de documentos.
3. **Requisitos funcionais** — tabela RF-01..RF-0n, expandindo o template:
   - RF-01 upload de documento (multipart/form-data, campo `file`)
   - RF-02 listagem de documentos com metadados
   - RF-03 download pelo id
   - RF-04 associação do documento ao owner via header `x-user-id`
   - RF-05 validação de tipo de arquivo permitido
   - RF-06 validação de tamanho máximo
   - RF-07 erros em JSON simples com códigos HTTP apropriados
4. **Requisitos não funcionais** — RNF-01..RNF-0n:
   - filesystem local via multer `diskStorage` em `backend/storage`
   - metadados em memória (repositório in-memory)
   - configuração via env (`PORT`, `STORAGE_DIR`, `MAX_FILE_SIZE_MB`) — 12-Factor
   - Clean Architecture simples (routes → controllers → services → repositories)
   - nomes de arquivo em disco únicos/seguros (id + extensão), nunca o nome
     original cru (evitar path traversal e colisão)
   - testes backend com `node:test`
5. **Modelo de dados** — tabela de metadados do documento:
   `id` (string, UUID), `originalName` (string), `storedName` (string, nome
   físico em disco), `mimeType` (string), `size` (number, bytes),
   `uploadedAt` (string ISO 8601), `owner` (string).
6. **Contratos de API** — detalhados com request/response/erros:
   - `POST /upload` — multipart `file`, header `x-user-id` opcional;
     201 + metadados; 400 (sem arquivo/tipo não permitido); 413 (tamanho).
   - `GET /documents` — 200 + array de metadados; filtro opcional
     `?owner=<id>`.
   - `GET /documents/:id/download` — 200 binário com
     `Content-Disposition: attachment`; 404 se id inexistente.
   - `GET /health` — já existente no seed; 200 `{ "status": "ok" }`.
   - Observação: frontend consome via prefixo `/api` (proxy do Vite remove o
     prefixo; o backend expõe as rotas sem `/api`).
   - Exemplos de payloads JSON de sucesso e erro para cada rota.
7. **Decisões arquiteturais** — Clean Architecture simples com fluxo
   routes → controllers → services → repositories; frontend com
   `components/`, `pages/`, `services/` e fetch via `/api`; armazenamento
   estritamente local; sem TypeScript nesta fase; mensagens em português e
   símbolos de código em inglês.
8. **Plano de execução** — etapas ordenadas para implementação futura
   (NÃO executadas agora):
   1. Backend: repositório em memória + configuração do multer/diskStorage
   2. Backend: services com regras de negócio (validações, metadados)
   3. Backend: controllers e routes (`/upload`, `/documents`,
      `/documents/:id/download`)
   4. Backend: testes com `node:test` para as rotas
   5. Frontend: service de API (fetch via `/api`)
   6. Frontend: componentes `UploadComponent`, `DocumentList`, `DownloadButton`
   7. Frontend: página principal integrando os componentes
   8. Integração e validação ponta a ponta (proxy Vite + backend)

## Todos

- [ ] Criar `docs/specs/dms-spec.md` com a especificação completa seguindo a
      estrutura acima

## Notas e considerações

- O template original (`docs/specs/spec-template.md`) permanece intacto como
  referência.
- O documento será escrito em português (mensagens/documentação), com nomes de
  campos e endpoints em inglês, conforme as convenções do repositório.
- Validação: revisão do markdown gerado (sem testes automatizados, pois é
  mudança apenas de documentação).
