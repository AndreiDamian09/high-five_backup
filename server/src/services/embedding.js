import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateEmbedding(text) {
  try {
    const res = await genAI.models.embedContent({
      model: "gemini-embedding-001",
      contents: text,
      config: { outputDimensionality: 1536 },
    });

    const values =
      res.embedding?.values ??
      res.embeddings?.[0]?.values;

    if (!values) {
      throw new Error("Nu am primit embedding values din raspuns.");
    }

    return values;
  } catch (error) {
    console.error("Eroare generare embedding:", error.message);
    throw new Error(`Nu s a putut genera embedding: ${error.message}`);
  }
}

export function cosinusSimilarity(vectorA, vectorB) {
  let prod = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vectorA.length; i++) {
    prod += vectorA[i] * vectorB[i];
    normA += vectorA[i] * vectorA[i];
    normB += vectorB[i] * vectorB[i];
  }

  return prod / (Math.sqrt(normA) * Math.sqrt(normB));
}
