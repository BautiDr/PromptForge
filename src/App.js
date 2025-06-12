import React, { useState, useEffect } from 'react';
import { Lightbulb, Code, Target, Zap, TrendingUp, Handshake, DollarSign, Brain, Gem, ShieldCheck, RefreshCw, Layers, Upload, TestTube, Rocket, MessageSquareText, ThumbsUp, XCircle, ChevronRight, BarChart3, Loader2 } from 'lucide-react';
// Importación del SDK de Google Generative AI
import { GoogleGenerativeAI } from '@google/generative-ai';

// Componente del Modal de Solicitud de Demo
const RequestDemoModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    useCase: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // --- ¡IMPORTANTE! REEMPLAZA 'YOUR_FORMSPREE_FORM_ID' CON EL ID REAL DE TU FORMULARIO EN FORMSPREE.IO ---
    // ID de Formspree proporcionado por el usuario: https://formspree.io/f/mrbkqpjq
    const formspreeUrl = "https://formspree.io/f/mrbkqpjq"; 

    try {
      const response = await fetch(formspreeUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json' // Importante para que Formspree devuelva una respuesta JSON
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('¡Gracias por tu solicitud de demo! Nos pondremos en contacto en breve.');
        onClose(); // Cierra el modal al enviar exitosamente
      } else {
        // Manejo de errores de Formspree (por ejemplo, si faltan campos requeridos en su configuración)
        const errorData = await response.json();
        console.error("Error al enviar a Formspree:", errorData);
        alert('Hubo un error al enviar tu solicitud. Por favor, inténtalo de nuevo.');
      }
    } catch (error) {
      // Manejo de errores de red o del fetch
      console.error("Error de red al enviar a Formspree:", error);
      alert('Hubo un error de red. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-3xl font-bold"
        >
          &times;
        </button>
        <h3 className="text-3xl font-extrabold text-indigo-700 mb-6 text-center">Solicita una Demo</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">Nombre</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">Email de Trabajo</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label htmlFor="company" className="block text-gray-700 font-semibold mb-2">Empresa</label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label htmlFor="useCase" className="block text-gray-700 font-semibold mb-2">Caso de Uso Principal</label>
            <textarea
              id="useCase"
              name="useCase"
              value={formData.useCase}
              onChange={handleChange}
              rows="3"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Ej.: Automatización de soporte al cliente, generación de contenido, base de conocimiento interna"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-700 text-white px-6 py-3 rounded-full text-lg font-bold shadow-md hover:bg-indigo-800 transition-colors duration-300"
          >
            Enviar Solicitud
          </button>
        </form>
      </div>
    </div>
  );
};

const App = () => {
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [promptInput, setPromptInput] = useState('');
  const [mockRewrittenPrompt, setMockRewrittenPrompt] = useState('');
  const [mockScore, setMockScore] = useState('');
  const [mockRedTeamResult, setMockRedTeamResult] = useState('');
  const [promptsTestedCount, setPromptsTestedCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false); // Nuevo estado para indicar carga

  // Simular la carga inicial del contador (en una app real, vendría del backend)
  useEffect(() => {
    const initialCount = parseInt(localStorage.getItem('promptsTestedCountMock') || '0', 10);
    setPromptsTestedCount(initialCount);
  }, []);

  const handleAnalyzePrompt = async () => {
    if (!promptInput.trim()) {
      alert('Por favor, ingresa un prompt para analizar.');
      return;
    }

    setIsLoading(true); // Activa el estado de carga
    setMockRewrittenPrompt(''); // Limpia resultados anteriores
    setMockScore('');
    setMockRedTeamResult('');

    try {
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

      // Usa la clave API del archivo .env
      const apiKey = process.env.REACT_APP_GEMINI_API_KEY; 

      // Verifica si la API Key está definida
      if (!apiKey) {
        console.error("GEMINI_API_KEY no está definida en el archivo .env o no se cargó correctamente.");
        alert("Error de configuración: La clave API de Gemini no está configurada. Consulta la consola.");
        setIsLoading(false);
        return;
      }

      // Inicializa el cliente de la API de Google Generative AI
      const gemini = new GoogleGenerativeAI(apiKey);
      const model = gemini.getGenerativeModel({ 
        model: "gemini-2.0-flash", // Utiliza el modelo gemini-2.0-flash
        generationConfig: {
          responseMimeType: "application/json", // Solicita una respuesta JSON
        },
      });

      // Envía la solicitud al modelo
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: promptForLLM }] }],
      });
      
      const response = await result.response;
      const jsonString = response.text(); // El SDK tiene un método .text() para obtener la respuesta como string
      const analysis = JSON.parse(jsonString);

      // Actualiza los estados con los datos reales del LLM
      setMockRewrittenPrompt(analysis.rewritten_prompt);
      setMockScore(`Puntuación: ${analysis.score}/10 (Claridad: ${analysis.clarity}, Tono: ${analysis.tone})`);
      setMockRedTeamResult(`Sesgo: ${analysis.bias}. Explicación: ${analysis.explanation}`);

      // Incrementar el contador de prompts simulados/analizados
      setPromptsTestedCount(prevCount => {
        const newCount = prevCount + 1;
        localStorage.setItem('promptsTestedCountMock', newCount.toString());
        return newCount;
      });

    } catch (error) {
      console.error("Error al analizar el prompt con LLM:", error);
      // Muestra un mensaje de error más específico si el error es de red o de la API
      if (error.message && error.message.includes("403")) {
          alert('Error de API: Acceso denegado (código 403). Verifica tu clave API o los permisos en Google AI Studio.');
      } else if (error.message && error.message.includes("JSON")) {
          alert('Error de formato de respuesta: El LLM no devolvió un JSON válido. Intenta con un prompt diferente o revisa la consola.');
      } else {
          alert('Hubo un error al procesar tu prompt. Por favor, revisa la consola para más detalles.');
      }
    } finally {
      setIsLoading(false); // Desactiva el estado de carga
    }
  };

  return (
    // Contenedor principal con fuente Inter y un fondo sutil
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 antialiased">
      {/* Barra de Navegación - simple y limpia */}
      <nav className="bg-white shadow-sm p-4 sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-extrabold text-indigo-700">PromptForge<span className="text-xl">™</span></h1>
          <ul className="flex space-x-6">
            <li><a href="#problem" className="text-gray-600 hover:text-indigo-700 font-medium">Problema</a></li>
            <li><a href="#solution" className="text-gray-600 hover:text-indigo-700 font-medium">Solución</a></li>
            <li><a href="#features" className="text-gray-600 hover:text-indigo-700 font-medium">Características</a></li>
            <li><a href="#how-it-works" className="text-gray-600 hover:text-indigo-700 font-medium">Cómo Funciona</a></li>
            <li><a href="#customers" className="text-gray-600 hover:text-indigo-700 font-medium">Clientes</a></li>
            <li><button onClick={() => setShowDemoModal(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-indigo-700 transition-colors">Solicitar Demo</button></li>
          </ul>
        </div>
      </nav>

      {/* Sección Hero */}
      <section className="relative bg-gradient-to-br from-indigo-700 to-purple-800 text-white py-24 px-4 overflow-hidden rounded-b-3xl shadow-xl">
        {/* Blobs de fondo para interés visual */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

        <div className="container mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6 animate-fade-in-up">
            PromptForge: <span className="block text-indigo-200 mt-2">La Capa de Infraestructura para Ingeniería de Prompts a Escala</span>
          </h2>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto opacity-90 animate-fade-in-up animation-delay-500">
            Aportando una estructura tipo DevOps a la ingeniería de prompts.
            <br className="hidden md:inline" />
            Piénsalo como: <span className="font-bold text-indigo-100">“El MLOps + GitHub + DataDog para la Ingeniería de Prompts”</span>
          </p>
          <button
            onClick={() => setShowDemoModal(true)}
            className="bg-white text-indigo-700 px-8 py-4 rounded-full text-lg font-bold shadow-lg hover:bg-indigo-100 transform hover:scale-105 transition-all duration-300 ease-in-out animate-fade-in-up animation-delay-1000"
          >
            Solicitar una Demo
          </button>
        </div>
      </section>

      {/* Sección de Prueba Social / Compatibilidad */}
      <section id="social-proof" className="py-16 px-4 bg-gray-100">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-bold text-gray-700 mb-8">Construido para una compatibilidad perfecta con los principales modelos y frameworks de IA</h3>
          <div className="flex flex-wrap justify-center items-center gap-10">
            <img src="https://placehold.co/150x50/F3F4F6/6B7280?text=OpenAI" alt="OpenAI Logo" className="h-12 opacity-80 hover:opacity-100 transition-opacity" />
            <img src="https://placehold.co/150x50/F3F4F6/6B7280?text=Anthropic" alt="Anthropic Logo" className="h-12 opacity-80 hover:opacity-100 transition-opacity" />
            <img src="https://placehold.co/150x50/F3F4F6/6B7280?text=MistralAI" alt="MistralAI Logo" className="h-12 opacity-80 hover:opacity-100 transition-opacity" />
            <img src="https://placehold.co/150x50/F3F4F6/6B7280?text=GoogleAI" alt="Google AI Logo" className="h-12 opacity-80 hover:opacity-100 transition-opacity" />
            <img src="https://placehold.co/150x50/F3F4F6/6B7280?text=LangChain" alt="LangChain Logo" className="h-12 opacity-80 hover:opacity-100 transition-opacity" />
            <img src="https://placehold.co/150x50/F3F4F6/6B7280?text=LlamaIndex" alt="LlamaIndex Logo" className="h-12 opacity-80 hover:opacity-100 transition-opacity" />
          </div>
          <p className="text-xl italic text-gray-600 mt-12 max-w-2xl mx-auto">
            "PromptForge nos hubiera ahorrado meses de ajuste de prompts; es la pieza que falta para la IA empresarial. ¡Altamente recomendado!"
            <br />
            <span className="font-semibold">- Ingeniero Líder de ML, Innovador de Fortune 500</span>
          </p>
        </div>
      </section>

      {/* Sección del Problema */}
      <section id="problem" className="py-20 px-4 bg-white rounded-b-3xl shadow-lg">
        <div className="container mx-auto text-center">
          <h3 className="text-4xl font-extrabold mb-12 text-gray-900 flex items-center justify-center">
            <Lightbulb className="mr-3 text-yellow-500" size={36} /> El Problema: Ingeniería de Prompts Manual, No Escalable y No Estandarizada
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              {
                title: "Falta de Escalabilidad",
                description: "Las empresas luchan por escalar el diseño y la optimización de prompts en diversos casos de uso y numerosos equipos, lo que lleva a inconsistencias e ineficiencias."
              },
              {
                title: "Sin Estandarización ni Control de Versiones",
                description: "A diferencia del código, los prompts carecen de prácticas estandarizadas, control de versiones o gestión adecuada, lo que hace que la colaboración y la auditoría sean casi imposibles."
              },
              {
                title: "Manual Testing & Monitoring",
                description: "Las pruebas de prompts, el monitoreo del rendimiento y el establecimiento de barandales suelen ser manuales, ad hoc o totalmente ausentes, lo que arriesga resultados subóptimos de IA."
              },
              {
                title: "Alucinaciones e Inconsistencia",
                description: "Las alucinaciones incontroladas y las respuestas inconsistentes de los LLM limitan la adopción de la IA en dominios críticos y regulados como la salud, el derecho y las finanzas."
              },
              {
                title: "Falta de Hub de Colaboración",
                description: "No existe un equivalente a GitHub para gestionar, colaborar y auditar prompts, lo que dificulta la eficiencia del equipo y el intercambio de conocimientos."
              }
            ].map((item, index) => (
              <div key={index} className="bg-gray-100 p-8 rounded-2xl shadow-md transform hover:scale-105 transition-transform duration-300 ease-in-out">
                <h4 className="text-2xl font-bold mb-4 text-indigo-700">{item.title}</h4>
                <p className="text-lg text-gray-700">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección de la Solución */}
      <section id="solution" className="py-20 px-4 bg-gray-50 rounded-b-3xl shadow-lg">
        <div className="container mx-auto text-center">
          <h3 className="text-4xl font-extrabold mb-12 text-gray-900 flex items-center justify-center">
            <Code className="mr-3 text-green-500" size={36} /> La Solución: PromptForge – Plataforma Integral de PromptOps
          </h3>
          <p className="text-xl md:text-2xl mb-10 max-w-4xl mx-auto text-gray-700 leading-relaxed">
            PromptForge es un SaaS empresarial B2B que aporta estructura y rigor tipo DevOps a la ingeniería de prompts. Actúa como la capa de infraestructura faltante, permitiendo a las empresas implementar IA generativa con **confianza, control y rendimiento**.
          </p>
          <div className="flex justify-center">
            <img
              src="https://placehold.co/800x400/818CF8/FFFFFF?text=PromptForge+Dashboard+Mockup"
              alt="Mockup del Dashboard de PromptForge"
              className="rounded-xl shadow-2xl border-4 border-indigo-200 max-w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* Sección de Características Principales */}
      <section id="features" className="py-20 px-4 bg-white rounded-b-3xl shadow-lg">
        <div className="container mx-auto">
          <h3 className="text-4xl font-extrabold mb-12 text-gray-900 text-center flex items-center justify-center">
            <Zap className="mr-3 text-orange-500" size={36} /> Características Principales
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              {
                icon: <Gem className="text-blue-500" size={48} />,
                title: "Control de Versiones y Colaboración de Prompts",
                description: "Repositorios de prompts estilo Git para equipos, incluyendo historial de cambios, bifurcaciones, aprobaciones y reversiones. Uso compartido seguro de prompts y control de acceso granular."
              },
              {
                icon: <TestTube className="text-purple-500" size={48} />, // Icono actualizado para evaluación
                title: "Suite de Evaluación de Prompts",
                description: "Realiza pruebas A/B de variantes de prompts, utiliza evaluaciones sintéticas con jueces basados en GPT e integra flujos de trabajo de revisión con intervención humana. Capacidades automatizadas de 'red teaming' y detección de sesgos."
              },
              {
                icon: <ShieldCheck className="text-red-500" size={48} />,
                title: "Barandales de Prompts",
                description: "Define 'límites de respuesta aceptables' utilizando similitud semántica. Bloquea automáticamente respuestas tóxicas o fuera de marca y monitorea la desviación del comportamiento de los LLM en tiempo real."
              },
              {
                icon: <RefreshCw className="text-green-500" size={48} />,
                title: "Motor de Optimización Automática de Prompts (APOE)",
                description: "Agentes de IA ajustan y evolucionan prompts automáticamente basándose en KPI predefinidos (precisión, brevedad, tono de marca). Sistemas de auto-mejora que iteran sobre la redacción de prompts a medida que llegan resultados del mundo real."
              },
              {
                icon: <Layers className="text-yellow-500" size={48} />,
                title: "Interoperabilidad Multi-Modelo",
                description: "Prueba prompts en varios proveedores de LLM como OpenAI, Anthropic, Mistral, Claude y Gemini. Compara el rendimiento entre APIs para evitar la dependencia del proveedor y asegurar las mejores opciones."
              }
            ].map((feature, index) => (
              <div key={index} className="bg-gray-100 p-8 rounded-2xl shadow-md text-center transform hover:scale-105 transition-transform duration-300 ease-in-out flex flex-col items-center">
                <div className="mb-4">{feature.icon}</div>
                <h4 className="text-2xl font-bold mb-4 text-indigo-700">{feature.title}</h4>
                <p className="text-lg text-gray-700 flex-grow">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección Cómo Funciona */}
      <section id="how-it-works" className="py-20 px-4 bg-gray-50 rounded-b-3xl shadow-lg">
        <div className="container mx-auto text-center">
          <h3 className="text-4xl font-extrabold mb-12 text-gray-900 flex items-center justify-center">
            <Rocket className="mr-3 text-purple-500" size={36} /> Cómo Funciona
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="flex flex-col items-center p-8 bg-white rounded-2xl shadow-md transform hover:scale-105 transition-transform duration-300">
              <div className="text-indigo-600 mb-4">
                <Upload size={64} />
              </div>
              <h4 className="text-2xl font-bold mb-3 text-indigo-700">Paso 1: Ingesta y Gestión de Prompts</h4>
              <p className="text-lg text-gray-700">Sube tus prompts existentes o impórtalos directamente desde tus entornos LLM. Aprovecha el versionado estilo Git para una gestión colaborativa.</p>
            </div>
            <div className="flex flex-col items-center p-8 bg-white rounded-2xl shadow-md transform hover:scale-105 transition-transform duration-300">
              <div className="text-green-600 mb-4">
                <TestTube size={64} />
              </div>
              <h4 className="text-2xl font-bold mb-3 text-indigo-700">Paso 2: Prueba y Evalúa</h4>
              <p className="text-lg text-gray-700">Realiza pruebas A/B de variantes de prompts, ejecuta evaluaciones sintéticas y lleva a cabo 'red teaming' automático en múltiples modelos para optimizar el rendimiento y la seguridad.</p>
            </div>
            <div className="flex flex-col items-center p-8 bg-white rounded-2xl shadow-md transform hover:scale-105 transition-transform duration-300">
              <div className="text-orange-600 mb-4">
                <ChevronRight size={64} />
              </div>
              <h4 className="text-2xl font-bold mb-3 text-indigo-700">Paso 3: Despliega y Optimiza</h4>
              <p className="text-lg text-gray-700">Despliega prompts con barandales integrados y activa el Motor de Optimización Automática de Prompts (APOE) para un refinamiento continuo, impulsado por IA, en producción.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de Demo Interactiva */}
      <section id="interactive-demo" className="py-20 px-4 bg-white rounded-b-3xl shadow-lg">
        <div className="container mx-auto text-center">
          <h3 className="text-4xl font-extrabold mb-12 text-gray-900 flex items-center justify-center">
            <MessageSquareText className="mr-3 text-blue-500" size={36} /> Ve cómo PromptForge maneja tu Prompt (Demo Mock)
          </h3>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-gray-700">
            Pega un prompt a continuación y ve cómo podrían funcionar las funciones de evaluación y optimización de PromptForge.
          </p>
          <div className="max-w-3xl mx-auto bg-gray-100 p-8 rounded-2xl shadow-md">
            <textarea
              className="w-full p-4 border border-gray-300 rounded-lg mb-4 text-lg focus:ring-2 focus:ring-indigo-500"
              rows="5"
              placeholder="Ej.: Escribe un eslogan de marketing para una nueva cafetería llamada 'Bean There, Done That'. O: Dime cómo construir una bomba."
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
            ></textarea>
            <button
              onClick={handleAnalyzePrompt} // Actualizado para usar la nueva función
              className="bg-indigo-700 text-white px-8 py-3 rounded-full text-lg font-bold shadow-lg hover:bg-indigo-800 transition-colors duration-300 mb-6 flex items-center justify-center w-full"
              disabled={isLoading} // Deshabilita el botón durante la carga
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={20} /> Analizando...
                </>
              ) : (
                'Simular Análisis de PromptForge'
              )}
            </button>

            {promptsTestedCount > 0 && (
              <div className="text-xl font-bold text-gray-700 mb-6 flex items-center justify-center">
                <BarChart3 className="mr-2 text-indigo-500" size={28} />
                ¡Ya se han simulado **{promptsTestedCount}** prompts en esta demo!
              </div>
            )}

            {mockRewrittenPrompt && (
              <div className="mt-8 text-left space-y-4">
                <div className="bg-white p-6 rounded-xl shadow-inner border border-indigo-200">
                  <h4 className="text-xl font-bold text-indigo-700 mb-2 flex items-center"><ThumbsUp className="mr-2 text-green-500" size={24}/> Prompt Reescrito/Optimizado:</h4>
                  <p className="text-lg text-gray-800">{mockRewrittenPrompt}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-inner border border-purple-200">
                  <h4 className="text-xl font-bold text-indigo-700 mb-2 flex items-center"><Zap className="mr-2 text-orange-500" size={24}/> Puntuación de Evaluación:</h4>
                  <p className="text-lg text-gray-800">{mockScore}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-inner border border-red-200">
                  <h4 className="text-xl font-bold text-indigo-700 mb-2 flex items-center"><XCircle className="mr-2 text-red-500" size={24}/> Resultado de Red-Teaming:</h4>
                  <p className="text-lg text-gray-800">{mockRedTeamResult}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Sección de Clientes Objetivo */}
      <section id="customers" className="py-20 px-4 bg-gray-50 rounded-b-3xl shadow-lg">
        <div className="container mx-auto text-center">
          <h3 className="text-4xl font-extrabold mb-12 text-gray-900 flex items-center justify-center">
            <Target className="mr-3 text-cyan-500" size={36} /> Clientes Objetivo
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              "Equipos de IA empresariales (finanzas, salud, derecho, retail)",
              "Proveedores de automatización de soporte al cliente",
              "Empresas de productos nativos de IA",
              "Agencias que construyen copilotos / asistentes"
            ].map((customer, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out transform hover:scale-105">
                <p className="text-xl font-semibold text-gray-800">{customer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección Por Qué Es Disruptivo */}
      <section className="py-20 px-4 bg-white rounded-b-3xl shadow-lg">
        <div className="container mx-auto text-center">
          <h3 className="text-4xl font-extrabold mb-12 text-gray-900 flex items-center justify-center">
            <TrendingUp className="mr-3 text-teal-500" size={36} /> Por Qué Esto Es Disruptivo
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-gray-100 p-8 rounded-2xl shadow-md transform hover:scale-105 transition-transform duration-300">
              <h4 className="text-2xl font-bold mb-4 text-indigo-700">Pionero en PromptOps</h4>
              <p className="text-lg text-gray-700">El primero en construir una infraestructura dedicada en torno al paradigma emergente de 'PromptOps'.</p>
            </div>
            <div className="bg-gray-100 p-8 rounded-2xl shadow-md transform hover:scale-105 transition-transform duration-300">
              <h4 className="text-2xl font-bold mb-4 text-indigo-700">Habilita Confianza y Control</h4>
              <p className="text-lg text-gray-700">Permite la confianza, el rendimiento y el control en el despliegue de IA generativa, especialmente para aplicaciones de misión crítica.</p>
            </div>
            <div className="bg-gray-100 p-8 rounded-2xl shadow-md transform hover:scale-105 transition-transform duration-300">
              <h4 className="text-2xl font-bold mb-4 text-indigo-700">La Capa Faltante</h4>
              <p className="text-lg text-gray-700">Proporciona la capa crucial que falta en la IA empresarial: complementando datos (Scale AI) y modelos (OpenAI) con un control inteligente del comportamiento de los prompts.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sección Cómo Aprovecha la IA en Sí Misma */}
      <section className="py-20 px-4 bg-gray-50 rounded-b-3xl shadow-lg">
        <div className="container mx-auto text-center">
          <h3 className="text-4xl font-extrabold mb-12 text-gray-900 flex items-center justify-center">
            <Brain className="mr-3 text-pink-500" size={36} /> Cómo Aprovecha la IA en Sí Misma
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-md transform hover:scale-105 transition-transform duration-300">
              <h4 className="text-2xl font-bold mb-4 text-indigo-700">Sistemas LLM-in-the-Loop</h4>
              <p className="text-lg text-gray-700">Utiliza sistemas LLM-in-the-Loop para evaluar, reescribir y probar los prompts bajo estrés, asegurando un rendimiento óptimo.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-md transform hover:scale-105 transition-transform duration-300">
              <h4 className="text-2xl font-bold mb-4 text-indigo-700">Modelos Ajustados para Control</h4>
              <p className="text-lg text-gray-700">Emplea modelos ajustados para la clasificación de prompts, detección de alucinaciones y aplicación de la seguridad, proporcionando un control robusto.</p>
            </div>
            <div className="md:col-span-2 bg-white p-8 rounded-2xl shadow-md transform hover:scale-105 transition-transform duration-300">
              <h4 className="text-2xl font-bold mb-4 text-indigo-700">"Agentes de IA Optimizando Prompts de IA"</h4>
              <p className="text-lg text-gray-700">Esto crea un potente efecto de arranque, donde la propia IA se utiliza para refinar y mejorar los prompts que impulsan otros sistemas de IA.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de Futuras Expansiones */}
      <section className="py-20 px-4 bg-white rounded-b-3xl shadow-lg">
        <div className="container mx-auto text-center">
          <h3 className="text-4xl font-extrabold mb-12 text-gray-900 flex items-center justify-center">
            <Handshake className="mr-3 text-indigo-500" size={36} /> Futuras Expansiones
          </h3>
          <ul className="list-none space-y-4 text-xl text-gray-700 max-w-3xl mx-auto">
            <li className="bg-gray-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">Mercados de prompts para casos de uso verticales</li>
            <li className="bg-gray-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">Integración con LangChain, LlamaIndex, etc.</li>
            <li className="bg-gray-100 p-4 rounded-xl shadow-sm hover:hover:shadow-md transition-shadow">Plugins para Figma, IDEs, Notion para pruebas de prompts en contexto</li>
          </ul>
        </div>
      </section>

      {/* Sección del Modelo de Negocio */}
      <section className="py-20 px-4 bg-gray-50 rounded-b-3xl shadow-lg">
        <div className="container mx-auto text-center">
          <h3 className="text-4xl font-extrabold mb-12 text-gray-900 flex items-center justify-center">
            <DollarSign className="mr-3 text-green-600" size={36} /> Modelo de Negocio
          </h3>
          <ul className="list-none space-y-4 text-xl text-gray-700 max-w-3xl mx-auto">
            <li className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">Precios basados en el uso + planes escalonados por asiento/equipo</li>
            <li className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">Opciones de marca blanca empresarial para equipos de IA internos</li>
            <li className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">Tarifas de integración para acceso basado en API por herramientas de desarrollo</li>
          </ul>
        </div>
      </section>

      {/* Pie de Página */}
      <footer className="bg-gray-800 text-white py-10 px-4 mt-12 rounded-t-3xl">
        <div className="container mx-auto text-center">
          <p className="text-lg">&copy; {new Date().getFullYear()} PromptForge. Todos los derechos reservados.</p>
          <p className="text-sm mt-2">El futuro de la IA es diseñado, no solo incitado.</p>
          <button
            onClick={() => setShowDemoModal(true)}
            className="mt-6 bg-indigo-600 text-white px-6 py-3 rounded-full text-lg font-bold shadow-md hover:bg-indigo-700 transition-colors duration-300"
          >
            Solicitar una Demo
          </button>
        </div>
      </footer>

      {/* Modal de Solicitud de Demo */}
      {showDemoModal && <RequestDemoModal onClose={() => setShowDemoModal(false)} />}

      {/* Estilos y Animaciones de Tailwind CSS */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

        body {
          font-family: 'Inter', sans-serif;
        }

        .animate-blob {
          animation: blob 7s infinite cubic-bezier(0.4, 0, 0.2, 1);
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        @keyframes blob {
          0% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0, 0) scale(1);
          }
        }

        .animate-fade-in-up {
          animation: fadeInFromBottom 1s ease-out forwards;
          opacity: 0;
          transform: translateY(20px);
        }

        .animation-delay-500 {
          animation-delay: 0.5s;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }

        @keyframes fadeInFromBottom {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default App;
