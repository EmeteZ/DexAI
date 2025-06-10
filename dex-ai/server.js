require('dotenv').config();
const express = require('express');
const { GoogleGenAI } = require('@google/genai');

// 1. Criar a instância do Express
const app = express();
const port = 3000;

const genAI = new GoogleGenAI(process.env.GOOGLE_GEMINI_API_KEY);

// 2. Configurar middlewares (depois de criar o app)
app.use(express.json());

const cors = require('cors');
app.use(cors());


// 3. Definir rotas
app.post('/gemini', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'A mensagem não pode estar vazia.' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    res.json({ text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao gerar resposta da IA.' });
  }
});

// 4. Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
