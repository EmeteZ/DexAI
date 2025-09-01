# Documentação do Projeto DexAI

Esta documentação detalha a estrutura e o funcionamento do projeto DexAI, uma aplicação que integra um frontend Next.js com um backend Node.js/Express para interagir com a API Gemini do Google, focando em funcionalidades relacionadas a Pokémon.

## Visão Geral do Projeto

O DexAI é uma aplicação full-stack que permite aos usuários interagir com informações de Pokémon por meio de funcionalidades como quizzes, exibição de dados e, de forma exclusiva, batalhas simuladas utilizando inteligência artificial. O projeto é dividido em duas partes principais: o frontend, desenvolvido com Next.js, e o backend, desenvolvido com Node.js e Express, que serve como ponte para a API Gemini, utilizada apenas na simulação de batalhas.


## Estrutura do Projeto

O projeto DexAI é organizado em dois diretórios principais:

### Frontend (Next.js)

Localizado no diretório `dex-ai/`.

-   **`package.json`**: Contém as dependências do projeto frontend, incluindo:
    -   `next`: O framework React para produção.
    -   `react`, `react-dom`: Bibliotecas essenciais para a construção da interface do usuário.
    -   `@google/genai`: Para integração com a API Gemini diretamente no frontend (embora o backend também a utilize).
    -   `axios`: Cliente HTTP para fazer requisições.
    -   `react-icons`: Biblioteca de ícones.
    -   `react-markdown`: Para renderizar conteúdo Markdown.
-   **`next.config.ts`**: Arquivo de configuração do Next.js, onde são definidas configurações como `remotePatterns` para permitir o carregamento de imagens de URLs externas (neste caso, da PokeAPI).
-   **`src/`**: Contém o código-fonte principal da aplicação Next.js.
    -   **`src/app/`**: Define as rotas e layouts da aplicação.
        -   `battleIA/`: Módulos relacionados a funcionalidades de batalha com IA.
        -   `pokedex/`: Módulos para a funcionalidade de Pokédex.
        -   `quizPokemon/`: Módulos para o quiz de Pokémon.
        -   `topPokemons/`: Módulos para exibir os Pokémons com base em suas estatísticas.
        -   `layout.tsx`: O layout global da aplicação.
        -   `page.tsx`: A página inicial da aplicação.
    -   **`src/components/`**: Contém componentes React reutilizáveis.
    -   **`src/styles/`**: Contém arquivos de estilo, utilizando Tailwind CSS.

### Backend (Node.js/Express com Gemini API)

Localizado no diretório `dex-ai/gemini-backend/`.

-   **`package.json`**: Contém as dependências do projeto backend, incluindo:
    -   `@google/generative-ai`: A biblioteca oficial do Google para interagir com a API Gemini.
    -   `dotenv`: Para carregar variáveis de ambiente de um arquivo `.env`.
    -   `express`: O framework web para Node.js.
-   **`server.js`**: Este é o ponto de entrada do servidor backend. Ele:
    -   Carrega variáveis de ambiente usando `dotenv`.
    -   Inicializa uma aplicação Express.
    -   Configura `express.json()` para processar corpos de requisição JSON.
    -   Habilita CORS para permitir requisições do frontend.
    -   Define uma rota POST `/gemini` que recebe um `prompt`.
    -   Usa a API Gemini (`gemini-1.5-flash`) para gerar conteúdo baseado no `prompt`.
    -   Retorna a resposta de texto gerada pela IA para o frontend.

## Comunicação entre Frontend e Backend

O frontend, desenvolvido em Next.js, interage com o backend Node.js/Express através de requisições HTTP. Especificamente, o frontend envia requisições POST para o endpoint `/gemini` do backend, passando um `prompt` no corpo da requisição. O backend processa este `prompt` usando a API Gemini e retorna a resposta gerada pela IA para o frontend, que então a exibe ao usuário.


## Configuração e Execução do Projeto

Para configurar e executar o projeto DexAI, siga os passos abaixo:

### Pré-requisitos

-   Node.js (versão 18 ou superior recomendada)
-   npm ou Yarn
-   Uma chave de API do Google Gemini (para o backend)

### Configuração do Backend

1.  Navegue até o diretório do backend:
    ```bash
    cd dex-ai/gemini-backend
    ```
2.  Instale as dependências:
    ```bash
    npm install
    # ou yarn install
    ```
3.  Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:
    ```
    GOOGLE_GEMINI_API_KEY=SUA_CHAVE_API_AQUI
    ```
    Substitua `SUA_CHAVE_API_AQUI` pela sua chave de API do Google Gemini.

### Configuração do Frontend

1.  Navegue até o diretório raiz do frontend:
    ```bash
    cd dex-ai
    ```
2.  Instale as dependências:
    ```bash
    npm install
    # ou yarn install
    ```
3.  Inicie a aplicação Next.js:
    ```bash
    npm run dev
    # ou yarn dev
    ```
    A aplicação estará disponível em `http://localhost:3000` (ou outra porta, se configurado no Next.js).

### Observações

-   Certifique-se de que o backend esteja rodando antes de iniciar o frontend, pois o frontend dependerá dele para as funcionalidades da IA.
-   As imagens de Pokémon são carregadas diretamente da PokeAPI, conforme configurado no `next.config.ts`.



