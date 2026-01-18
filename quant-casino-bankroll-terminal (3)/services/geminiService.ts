
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

export const analyzeGameScreenshot = async (base64Image: string): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const systemInstruction = `
    Você é um sistema avançado de análise visual e tomada de decisão para jogos de cassino online.
    Seu papel é interpretar exclusivamente a IMAGEM fornecida e orientar de forma racional e matemática.
    Não use superstição. Não faça perguntas. Seja frio e quantitativo.
    
    Extraia: Nome do jogo, Provedor, Tipo de slot, Aposta, Saldo, Moeda, Estado da Sessão.
    Forneça o Plano Matemático de Ação (Stop-loss, Take-profit, Condições de saída).
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
        { text: "Analise esta tela de jogo conforme suas instruções de analista quantitativo. Responda em formato JSON estruturado." }
      ]
    },
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          diagnosticoVisual: { type: Type.STRING },
          leituraTecnica: { type: Type.STRING },
          estadoSessao: { type: Type.STRING },
          planoAcao: {
            type: Type.OBJECT,
            properties: {
              tempoGiros: { type: Type.STRING },
              stopLoss: { type: Type.STRING },
              takeProfit: { type: Type.STRING },
              condicoesSaida: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["tempoGiros", "stopLoss", "takeProfit", "condicoesSaida"]
          },
          instrucaoDireta: { type: Type.STRING }
        },
        required: ["diagnosticoVisual", "leituraTecnica", "estadoSessao", "planoAcao", "instrucaoDireta"]
      }
    }
  });

  try {
    return JSON.parse(response.text || '{}');
  } catch (e) {
    throw new Error("Falha ao processar análise da imagem.");
  }
};
