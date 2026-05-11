import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");

export async function parseFile(fileBuffer, mimeType) {
  try {
    if (mimeType === "application/pdf") {
      const data = await pdf(fileBuffer);
      return data.text;
    } else if (mimeType === "text/plain") {
      return fileBuffer.toString("utf-8");
    } else {
      throw new Error("Format neacceptat. Te rog incarca PDF sau TXT.");
    }
  } catch (error) {
    console.error("Eroare la parsare:", error);
    throw new Error("Nu s a putut citi fisierul.");
  }
}
