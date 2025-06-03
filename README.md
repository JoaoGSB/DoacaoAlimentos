# DoaFácil – Plataforma de Doação de Alimentos

## Descrição do Projeto

O **DoaFácil** é uma plataforma web desenvolvida para conectar doadores de alimentos a ONGs e instituições beneficentes de maneira simples, rápida e transparente. O sistema visa facilitar o cadastro de doadores, ONGs e doações, promovendo a solidariedade e auxiliando no combate à fome.

---

## O que já foi feito

### Frontend

- **Estrutura das Páginas:** Implementação das páginas principais, como Página Inicial (`index.html`), Cadastro, Login, Doação, Contato e Conta.
- **Layout Responsivo:** Uso do Bootstrap 5 para garantir uma boa experiência tanto no desktop quanto em dispositivos móveis.
- **Design e Usabilidade:** Criação de menus, sidebar expansível, navegação intuitiva e formulários com validação básica em JavaScript.
- **Formulários:** Formulários para cadastro de doadores, ONGs, login, contato e realização de doações.
- **Scripts:** Scripts JavaScript para validação de campos, feedback ao usuário e manipulação dinâmica das páginas.
- **Estilização:** CSS próprio e Bootstrap para personalização visual.
- **Informações institucionais:** Página de contato com mapa e informações institucionais.

### Backend

- **Servidor Node.js/Express:** Implementação do backend com Express.js rodando na porta 3000.
- **API RESTful:** Criação de rotas para:
  - Cadastro e listagem de doadores (`/api/doadores`)
  - Cadastro e listagem de ONGs (`/api/ongs`)
  - Registro e listagem de doações (`/api/doacoes`)
- **Controllers e Models:** Separação da lógica de negócio em controllers e models, seguindo boas práticas.
- **Banco de Dados MySQL:** Integração com banco de dados MySQL para persistência de dados (doadores, ONGs, doações, contas).
- **Middleware:** Utilização de `cors` e `express.json()` para segurança e tratamento de requisições.
- **Tratamento de erros:** Retorno de mensagens adequadas e códigos HTTP corretos em casos de falha.

---

## O que estamos fazendo/agora (em desenvolvimento)

- **Autenticação de Usuários:** Implementação de autenticação e gestão de sessões para maior segurança.
- **Aprimoramento da Validação:** Validações mais robustas nos formulários e nas rotas da API.
- **Dashboard para ONGs e Doadores:** Telas exclusivas para cada tipo de usuário visualizar e gerenciar suas informações e doações.
- **Melhoria da Experiência do Usuário:** Feedback visual aprimorado, mensagens de sucesso/erro e navegação ainda mais fluida.
- **Documentação:** Melhoria contínua nos comentários, organização dos repositórios e atualização deste README.

---

## Tecnologias Utilizadas

### Frontend

- **HTML5** – Estruturação das páginas.
- **CSS3** – Estilização personalizada e responsiva.
- **Bootstrap 5** – Framework para design responsivo.
- **JavaScript** – Validações, interatividade e integração com a API.

### Backend

- **Node.js** – Plataforma para execução do JavaScript no servidor.
- **Express.js** – Framework web para Node.js.
- **MySQL** – Banco de dados relacional para armazenamento das informações.
- **mysql2** – Driver para conexão Node.js <-> MySQL.
- **CORS** – Middleware para controle de acesso.
- **Estrutura MVC** – Separação clara entre Models, Views e Controllers.

---

## Como Executar o Projeto

### Frontend

1. Clone o repositório:
   ```bash
   git clone https://github.com/JoaoGSB/DoacaoAlimentos.git
   ```
2. Navegue até a pasta do projeto e abra o arquivo `Views/index.html` (ou outro de sua preferência) em seu navegador.

### Backend

1. Instale as dependências:
   ```bash
   cd backend
   npm install
   ```
2. Configure o banco de dados MySQL conforme indicado em `backend/db.js` (ajuste usuário, senha e porta se necessário).
3. Inicie o servidor:
   ```bash
   node server.js
   ```
   O backend estará disponível em [http://localhost:3000](http://localhost:3000).

---

## Estrutura de Pastas

```
/Views        # Páginas HTML do frontend
/Styles       # Arquivos CSS
/Scripts      # Scripts JavaScript do frontend
/backend      # Código do backend (Node.js, Express, rotas, controllers, models)
/backend/db.js
```

---

## Colaboradores

- JoaoGSB

---

## Próximos Passos

- Finalizar autenticação e painel de usuários.
- Implementar envio de e-mails de confirmação.
- Disponibilizar deploy online do sistema.
- Melhorar a documentação e adicionar testes automatizados.

---

## Licença

Projeto acadêmico sem fins lucrativos. Para fins de estudo e colaboração.
