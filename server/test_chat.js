import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: 'AIzaSyDW1l6676w4uTjtteay7pDrNt9U82Mm85Q' });

async function run() {
  try {
    const response = await ai.models.generateContent({
      model: 'gemma-4-31b-it',
      contents: "Hello, world!"
    });
    console.log("Response:", response.text);
  } catch (e) {
    console.error("Error:", e.message);
  }
}

run();
