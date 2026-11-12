# Publicação do InfoTag na Vercel

A interface React e a API Flask são publicadas juntas. As chamadas a `/api`
usam o mesmo endereço HTTPS do site; as rotas React também funcionam ao recarregar.

## Configuração do projeto existente

1. Em **Settings → Git**, selecione a branch `web` como branch de produção.
2. Em **Settings → Build and Deployment**, use a raiz do repositório (`.`) como
   **Root Directory**. Remova overrides de framework, instalação, build e saída
   para que a Vercel utilize o `vercel.json` da raiz.
3. Em **Settings → Environment Variables**, crie `FIREBASE_SERVICE_ACCOUNT_JSON`
   no ambiente **Production** com o conteúdo JSON da conta de serviço do projeto
   Firebase `info-tag-fcc7a`. Obtenha o arquivo em **Firebase Console → Configurações do
   projeto → Contas de serviço**. Insira o conteúdo somente no campo protegido da
   Vercel; não publique o arquivo no Git nem envie a chave por chat.
4. Em **Deployments**, faça um novo deploy do commit com esta configuração.
5. No Firebase Authentication, adicione `info-tag-psi.vercel.app` aos domínios
   autorizados em **Settings → Authorized domains**, se ainda não estiver lá.

Não configure `VITE_API_URL` quando a API estiver no mesmo projeto. Se já existir
uma variável apontando para outro servidor, remova-a e faça novo deploy.

## Verificação

- `/login`: deve carregar o formulário InfoTag.
- `/api/health`: deve retornar `200` e
  `{"status":"ok","projectId":"info-tag-fcc7a"}` após inicializar o cliente
  Firebase. O projeto deve coincidir com o da configuração pública da interface.
  Sem credencial válida, retorna `503`, sem expor a chave.
- `/admin/dashboard`: sem login deve redirecionar para `/login`.
- Com uma conta de teste existente, verifique login e acesso a um paciente de
  teste. A saúde da API verifica inicialização; a leitura confirma permissões do
  Firestore e conectividade.

## Desenvolvimento local

Instale `backend/requirements.txt` em um ambiente virtual e execute
`python backend/app.py`. Configure `GOOGLE_APPLICATION_CREDENTIALS` com o caminho
do arquivo local, ou mantenha `backend/serviceAccountKey.json` (ignorado pelo Git).
Na pasta `frontend`, execute `npm ci` e `npm run dev`. O Vite encaminha `/api`
para o Flask local na porta 5000.

A hospedagem não cria contas nem altera dados existentes no Firebase.
