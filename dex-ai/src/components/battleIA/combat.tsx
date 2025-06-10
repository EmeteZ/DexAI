"use client";
import React, { useState } from 'react';

export default function Combat() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setLoading(true);
    try {
      const respostaGemini = await fetch('http://localhost:3000/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      const data = await respostaGemini.json();
      setResponse(data.text);
    } catch (error) {
      setResponse('Erro ao conectar com a IA. Verifique o backend.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">
            Pergunte à IA
          </label>
          <input
            id="prompt"
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Digite sua pergunta..."
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Enviando...' : 'Enviar'}
        </button>
      </form>
      {response && (
        <div className="mt-4 p-4 bg-gray-100 rounded-md">
          <h3 className="font-medium text-gray-800">Resposta da IA:</h3>
          <p className="mt-2 text-gray-700">{response}</p>
        </div>
      )}
    </div>
  );
}
