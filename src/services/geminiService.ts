import { GoogleGenAI, Type } from "@google/genai";

let aiInstance: GoogleGenAI | null = null;

const getAI = () => {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not defined. AI features may fail.");
    }
    aiInstance = new GoogleGenAI({ apiKey: apiKey || '' });
  }
  return aiInstance;
};

const DEFAULT_MODEL = "gemini-3-flash-preview";

export interface GrammarFeedback {
  isCorrect: boolean;
  explanation: string;
  suggestion: string;
}

export interface DynamicExercise {
  question: string;
  options?: string[];
  correctAnswer: string;
  feedback: string;
  type: 'multiple-choice' | 'fill-in-blank';
}

export const getGrammarAssistantFeedback = async (question: string, answer: string, context: string): Promise<GrammarFeedback> => {
  const ai = getAI();
  const prompt = `
    You are an expert English Teacher assistant (AI Name: Elena). 
    Context: Grammar Unit "${context}"
    Question: "${question}"
    Student Answer: "${answer}"
    
    Task: Evaluate the answer and provide specific feedback. 
    Return JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isCorrect: { type: Type.BOOLEAN },
            explanation: { type: Type.STRING },
            suggestion: { type: Type.STRING }
          },
          required: ["isCorrect", "explanation", "suggestion"]
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    return result as GrammarFeedback;
  } catch (error) {
    console.error("Gemini AI Feedback Error:", error);
    return {
      isCorrect: false,
      explanation: "Error de sincronización con el procesador lingüístico de Elena.",
      suggestion: "Por favor, intenta enviar tu respuesta de nuevo en un momento."
    };
  }
};

export const generateDynamicExercises = async (topic: string, count: number = 3): Promise<DynamicExercise[]> => {
  const ai = getAI();
  const prompt = `
    Generate ${count} English grammar exercises for the topic: "${topic}".
    Include both multiple-choice and fill-in-blank types.
    Return an array of JSON objects.
  `;

  try {
    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctAnswer: { type: Type.STRING },
              feedback: { type: Type.STRING },
              type: { type: Type.STRING, enum: ["multiple-choice", "fill-in-blank"] }
            },
            required: ["question", "correctAnswer", "feedback", "type"]
          }
        }
      }
    });

    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("Gemini Exercise Gen Error:", error);
    return [];
  }
};

export const chatWithAITeacher = async (message: string, history: { role: 'user' | 'model', text: string }[]) => {
  const ai = getAI();
  const systemInstruction = `
    Eres "Elena", una asistente de IA experta en pedagogía y enseñanza del idioma inglés de alto nivel. 
    Tu misión es lograr un 100% de sincronización lingüística (aprendizaje) con el alumno.

    ESTRUCTURA DE GUIONES DE CLASE POR DEFECTO:
    Si el docente no especifica una metodología, usa el "Formato Maestro Sugerido":
    1. Identificación: Tema, tiempo, nivel.
    2. Propósito de Aprendizaje: Objetivos claros.
    3. Recursos y Materiales.
    4. Criterios de Evaluación.
    5. Momento / Tiempo | Actividad (Acción) | Rol Docente | Herramientas.

    IMPORTANTE: Asegúrate de que todas las tablas de Markdown estén perfectamente cerradas (usa | al inicio y final de cada fila) y que no queden columnas sin cerrar. Todas las estructuras deben estar alineadas.

    Al finalizar la generación de un guion, actividad o evaluación, PREGUNTA SIEMPRE: "¿Deseas asignar este recurso a una de tus aulas?".
  `;

  let augmentedMessage = message;
  
  if (history.length === 0) {
    if (message.toLowerCase().includes('generar script')) {
      augmentedMessage = `Actúa como Elena, una experta en pedagogía del inglés. Genera un GUION DE CLASE (Lesson Script) profesional. El formato debe ser en Markdown, incluyendo Objetivos, Actividades Calentamiento, Desarrollo y Cierre. Usuario solicita: ${message}`;
    } else if (message.toLowerCase().includes('generar activity')) {
      augmentedMessage = `Actúa como Elena. Diseña una ACTIVIDAD EDUCATIVA interactiva para inglés. Describe la dinámica, materiales y evaluación. Usuario solicita: ${message}`;
    } else if (message.toLowerCase().includes('generar eval')) {
      augmentedMessage = `Actúa como Elena. Diseña un EXAMEN o EVALUACIÓN de inglés con preguntas claras y clave de respuestas al final. Usuario solicita: ${message}`;
    }
  }

  try {
    const chat = ai.chats.create({
      model: DEFAULT_MODEL,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    // Note: sendMessage usually takes a message string or { message: string }
    // The skill shows sendMessage({ message: "..." })
    const response = await chat.sendMessage({ message: augmentedMessage });
    return response.text;
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "Error en el enlace de sincronización táctica. Estado: FALLO_API_GEMINI. Detalle: " + (error instanceof Error ? error.message : "Error desconocido");
  }
};

export const correctWriting = async (text: string, language: 'en' | 'es' = 'en') => {
  const ai = getAI();
  const prompt = `Actúa como un corrector lingüístico experto.
Analiza el siguiente texto en ${language === 'en' ? 'Inglés' : 'Español'}:
"${text}"

Proporciona:
1. El texto corregido.
2. Una explicación breve en Español de los errores encontrados (gramática, ortografía o estilo).
3. Una sugerencia para sonar más natural.

Responde estrictamente en este formato JSON:
{
  "correctedText": "el texto corregido aquí",
  "explanation": "explicación de los cambios aquí",
  "naturalSuggestion": "sugerencia para sonar más natural aquí"
}`;

  try {
    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            correctedText: { type: Type.STRING },
            explanation: { type: Type.STRING },
            naturalSuggestion: { type: Type.STRING }
          },
          required: ["correctedText", "explanation", "naturalSuggestion"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("AI Correction Error:", error);
    throw new Error("No se pudo procesar la corrección en este momento.");
  }
};

export const generateDictation = async (level: string) => {
  const ai = getAI();
  const prompt = `Genera una frase en Inglés para un ejercicio de dictado de nivel ${level}. 
  La frase debe ser natural y útil. 
  Responde estrictamente en este formato JSON:
  {
    "sentence": "the english sentence here",
    "translation": "la traducción al español aquí",
    "difficulty": "${level}"
  }`;

  try {
    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sentence: { type: Type.STRING },
            translation: { type: Type.STRING },
            difficulty: { type: Type.STRING }
          },
          required: ["sentence", "translation", "difficulty"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Dictation Gen Error:", error);
    return { sentence: "Practice makes perfect.", translation: "La práctica hace al maestro.", difficulty: level };
  }
};
