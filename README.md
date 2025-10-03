# 🚀 LarColabs Frontend

Aplicação desenvolvida em **React + Vite** para gerenciamento de **colaboradores e telefones**, integrada com a API **LarColabs WebApi**.

---

## ✨ Funcionalidades

- ✅ CRUDs
- ✅ Vinculação de telefones a colaboradores  
- ✅ Máscara e visualização segura de **CPF**  
- ✅ Validações de formulários e notificações visuais  
- ✅ Componentes reutilizáveis (**ModalCrud**, **ConfirmModal**, **AlertaPopup**, **ModalVincular**)  
- ✅ Dashboard com métricas básicas e tabela de colaboradores

---

## 📂 Estrutura de Pastas

```
LarColabs.Frontend/
├── public/                # Arquivos públicos (favicon, index.html)
├── src/
│   ├── components/         # Componentes reutilizáveis (ModalCrud, ConfirmModal, etc.)
│   ├── pages/              # Páginas principais (Home, Colaboradores, Telefones, etc.)
│   ├── services/           # Configuração de API (axios)
│   ├── utils/              # Funções utilitárias (ex: cpf.utils.js)
│   ├── App.jsx             # Roteamento principal
│   └── main.jsx            # Entrada da aplicação
├── package.json
├── vite.config.js
└── README.md
```

---

## 🛠 Preparando o ambiente

### 1) Instalar o **Node.js (>=18)**  
👉 [Download Node.js](https://nodejs.org/)

### 2) Clonar o projeto
```bash
git clone https://github.com/seu-repositorio/larcolabs-frontend.git
cd larcolabs-frontend
```

### 3) Instalar dependências
```bash
npm install
```

### 4) Executar aplicação em modo desenvolvimento
```bash
npm run dev
```

Aplicação disponível em:  
👉 [http://localhost:5173](http://localhost:5173)

### 5) Gerar build de produção
```bash
npm run build
```

### 6) Rodar preview da build
```bash
npm run preview
```

---

## 📚 Tecnologias & Bibliotecas

- [React](https://react.dev/) — biblioteca principal para construção da UI.  
- [Vite](https://vitejs.dev/) — bundler rápido e moderno.  
- [Axios](https://axios-http.com/) — cliente HTTP para consumo da API.  
- [Bootstrap 5](https://getbootstrap.com/) — estilos e componentes responsivos.  
- [React Data Table Component](https://www.npmjs.com/package/react-data-table-component) — tabelas dinâmicas e paginadas.  
- [React Router](https://reactrouter.com/) — navegação entre páginas.  

---

## ✅ Conclusão

O **LarColabs Frontend** foi construído para consumir a API, apresentando uma interface moderna e intuitiva com componentes reutilizáveis e integração total com os serviços.

## 🧑‍💻 Autor

Desenvolvido por **George Lucas** 🤖  
