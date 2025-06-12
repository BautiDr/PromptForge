// Importa el SDK de Google Generative AI (asegúrate de que esté instalado con npm install @google/generative-ai)
import { GoogleGenerativeAI } from '@google/generative-ai';

// Esta es tu función serverless. Vercel la ejecutará cuando el frontend le haga una petición.
export default async function (req, res) {
  // Solo procesamos peticiones POST para enviar prompts
  if (req.method === 'POST') {
    // Extraemos el 'promptInput' del cuerpo de la petición (lo que envíe el frontend)
    const { promptInput } = req.body;

    // Verificamos si se envió un prompt
    if (!promptInput) {
      return res.status(400).json({ error: 'Prompt input es requerido.' });
    }

    try {
      // Accede a la clave API de Gemini de forma SEGURA desde las variables de entorno de Vercel.
      // Esta variable debe configurarse en el dashboard de Vercel (no en tu .env local para producción).
      const apiKey = process.env.GEMINI_API_KEY; 

      // Si la clave API no está configurada, devolvemos un error del servidor
      if (!apiKey) {
        console.error("GEMINI_API_KEY no está definida en las variables de entorno de Vercel.");
        return res.status(500).json({ error: 'Error de configuración del servidor: La clave API de Gemini no está configurada.' });
      }

      // El prompt que se enviará al LLM para la evaluación
      const promptForLLM = `Quiero que actúes como un evaluador experto de prompts para modelos de lenguaje. A continuación, te daré un prompt. Tu tarea es:

1. Evaluar su claridad, tono y sesgos.
2. Sugerir una versión mejorada.
3. Asignar una puntuación del 1 al 10 a su efectividad.
4. Explicar por qué lo reescribiste.

Responde en JSON con el siguiente formato:
{
  "clarity": "...",
  "tone": "...",
  "bias": "...",
  "rewritten_prompt": "...",
  "score": ...,
  "explanation": "..."
}

Prompt original:
${promptInput}`;

      // Inicializa el cliente del SDK de Google Generative AI con tu clave API
      const gemini = new GoogleGenerativeAI(apiKey);
      const model = gemini.getGenerativeModel({ 
        model: "gemini-2.0-flash", // Especifica el modelo a usar
        generationConfig: {
          responseMimeType: "application/json", // Solicita que la respuesta del LLM sea en formato JSON
        },
      });

      // Envía el contenido (el prompt) al modelo de Gemini
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: promptForLLM }] }],
      });
      
      const responseFromLLM = await result.response;
      // El SDK tiene un método .text() para obtener la respuesta del LLM como string
      const jsonString = responseFromLLM.text(); 
      // Parseamos la cadena JSON a un objeto JavaScript
      const analysis = JSON.parse(jsonString);

      // Enviamos el objeto de análisis estructurado de vuelta al frontend con un código 200 (OK)
      return res.status(200).json(analysis);

    } catch (error) {
      console.error("Error al procesar el prompt en la función backend:", error);
      // Manejo de errores más específico para el frontend
      if (error.message && error.message.includes("403")) {
          return res.status(403).json({ error: 'Error de API: Acceso denegado (código 403). Verifica tu clave API o los permisos en Google AI Studio.' });
      } else if (error.message && error.message.includes("JSON")) {
          return res.status(500).json({ error: 'Error de respuesta del LLM: El modelo no devolvió un JSON válido. Intenta con un prompt diferente.' });
      } else {
          // Captura otros errores inesperados
          return res.status(500).json({ error: 'Error interno del servidor durante el análisis del prompt.' });
      }
    }
  } else {
    // Si la petición no es POST, devolvemos un error de método no permitido
    return res.status(405).json({ message: 'Método no permitido. Esta función solo acepta peticiones POST.' });
  }
}
