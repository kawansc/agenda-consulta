# Healthup · Agenda de consultas

App de agendamento de consultas feito com **React + Vite**. Os dados (contas e consultas) ficam salvos em um
**banco de dados local no próprio navegador**, então não precisa de servidor, internet nem instalar banco.

O layout é **responsivo**: no celular usa menu inferior e tela cheia; no tablet centraliza o conteúdo; no computador
(a partir de 960 px) mostra menu lateral, cartões em grade e o calendário ao lado dos horários.

Funciona assim: login/cadastro, busca de médicos, calendário que usa a data do seu computador (não deixa marcar dias
que já passaram), revisão, pagamento **simulado** (Pix ou cartão) e "Minhas consultas" com reagendar e cancelar.

**Conta de teste:** `mariana@healthup.com` · senha `123456` (ou crie a sua em "Criar conta").

---

## 3 jeitos de usar (do mais fácil ao mais completo)

### 1) Sem instalar nada: abrir `Healthup.html`
Dê duplo clique no arquivo **`Healthup.html`** (fica na raiz). Ele já contém o React e o app inteiro dentro de um
único arquivo e abre em qualquer computador com navegador (Chrome, Edge, Firefox, Safari).

### 2) Online pelo GitHub Pages (link para mandar para qualquer pessoa)
1. No repositório: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. Faça um push (ou vá em **Actions → Publicar no GitHub Pages → Run workflow**).
3. Em 1 ou 2 minutos o site fica em `https://SEU-USUARIO.github.io/NOME-DO-REPO/`.

### 3) Para programar (React + Vite)
Precisa do [Node.js](https://nodejs.org) 18 ou mais novo (versão LTS).
```bash
npm install
npm run dev
```
Abra o endereço mostrado no terminal (normalmente http://localhost:5173).
Atalho: dê duplo clique em `iniciar.bat` (Windows) ou `iniciar.command` (Mac), ou rode `sh iniciar.sh` (Linux).

Outros comandos:
- `npm run build` gera a pasta `dist/` (site pronto para hospedar)
- `npm run build:single` gera `standalone/index.html` (arquivo único; copie para `Healthup.html` para atualizar a raiz)

> O `node_modules` não vai junto no projeto de propósito: ele tem arquivos específicos de cada sistema
> (Windows/Mac/Linux) e não funcionaria em outro computador. O `npm install` recria a pasta em segundos.

---

## Como subir para o GitHub (para o código aparecer)
O GitHub **não abre arquivos .zip**: se você enviar o zip, ele aparece como um único arquivo. Primeiro **extraia** o zip.

**Pelo terminal (recomendado)**, dentro da pasta extraída (a que tem o `package.json`):
```bash
git init
git add .
git commit -m "Healthup"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/NOME-DO-REPO.git
git push -u origin main
```

**Pelo site** (Add file → Upload files): arraste o **conteúdo** da pasta (todas as pastas e arquivos, incluindo a pasta
oculta `.github`), não o zip. Os arquivos precisam ficar na raiz do repositório, ao lado do `README.md`.

---

## Onde ficam os dados
No navegador, em Local Storage (F12 → Application → Local Storage → `healthup_db_v1`). Cada navegador tem o seu banco.
Para zerar tudo: limpe os dados do site ou apague essa chave.

Tabelas: `users` (senha com hash PBKDF2 + salt), `sessions`, `appointments` (médico, data, hora, tipo, status, pagamento).
Médicos ficam em `src/data/doctors.js`.

## Regras aplicadas
- Não aceita data anterior a hoje nem horário que já passou (relógio do computador).
- Um horário de um médico só pode ser reservado uma vez.
- Pagamento simulado: Pix sempre aprova; cartão valida número, validade, CVV e nome; final `0000` é recusado.
  O número do cartão não é gravado, só os 4 últimos dígitos.
- Reagendar não cobra de novo. Cancelar libera o horário.

## Estrutura
```
index.html, vite.config.js, package.json
Healthup.html           versão pronta (abre com duplo clique)
.github/workflows/      publicação automática no GitHub Pages
src/
  main.jsx, App.jsx, api.js
  db/                   banco local: database.js (tabelas e operações), rules.js (regras), password.js (hash)
  context/AppContext.jsx   estado global
  screens/              Login, Home, Search, Schedule, Review, Payment, Appts, Profile
  components/           Icon, Back, Nav, Modal
  data/, utils/
```
