
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import './ChatComponent.css'; 

const genAi = new GoogleGenerativeAI(); //APIKEY
const model = genAi.getGenerativeModel({ model: 'gemini-pro' });


const questions = [
  "Hola Soy tu test vocacional y estoy aquí para ayudarte",
  "¿Prefieres trabajar en interiores o al aire libre?",
  "¿Te gusta trabajar en un entorno tranquilo o en uno dinámico?",
  "Basado en tu preferencia de entorno, ¿te sientes más productivo(a) trabajando en equipo o individualmente?",
  "Cuando trabajas en equipo, ¿prefieres seguir instrucciones detalladas o tener libertad creativa?",
  "¿Disfrutas resolviendo problemas complejos?",
  "¿Te consideras una persona creativa? Si es así, ¿en qué tipo de actividades creativas te destacas?",
  "¿Qué tipo de tareas te resultan más satisfactorias, las que requieren creatividad o las que requieren análisis?",
  "¿Te sientes cómodo(a) trabajando con números y datos? ¿Puedes dar un ejemplo?",
  "¿Tienes habilidades técnicas, como programación o diseño? ¿Qué tipo de proyectos has realizado?",
  "¿Qué te motiva más: el reconocimiento profesional o la satisfacción personal de un trabajo bien hecho?",
  "¿Te gusta investigar y aprender cosas nuevas constantemente? ¿Hay algún tema en particular que te apasione?",
  "¿Prefieres un trabajo físico o de escritorio? ¿Por qué?",
  "¿Te sientes cómodo(a) hablando en público? ¿Has tenido experiencias donde tuviste que hacerlo?",
  "¿Te consideras una persona organizada? ¿Cómo gestionas tus tareas diarias?",
  "¿Prefieres trabajos estructurados o flexibles? ¿Puedes explicar tu elección?",
  "¿Te interesa el funcionamiento de los negocios y la economía? ¿Por qué?",
  "¿Te gustaría tener un trabajo que implique viajar? ¿Qué te atrae de viajar por trabajo?",
  "¿Te gusta enseñar o capacitar a otros? ¿Has tenido alguna experiencia haciendo esto?",
  "¿Te interesa ayudar a las personas? ¿En qué capacidad te gustaría hacerlo?",
  "¿Te interesa el cuidado y bienestar de los animales? ¿Tienes experiencia en este campo?",
  "Reflexionando sobre tus respuestas anteriores, ¿qué tipo de carrera crees que podría alinearse mejor con tus intereses y habilidades?",
  "¿Hay algún otro aspecto de tu personalidad o intereses que crees que es importante considerar para una sugerencia vocacional?",
  "¿Tienes alguna preferencia o interés específico en cuanto a dónde te gustaría estudiar en Argentina?"
]

const ChatComponent = () => {
  // Definimos los estados y referencias que usaremos en el componente
  const [historialChat, setHistorialChat] = useState([]); // Historial de mensajes en el chat
  const [respuestasUsuario, setRespuestasUsuario] = useState([]); // Respuestas del usuario
  const [prompt, setPrompt] = useState(''); // Texto actual en el input
  const mensajeInicialAñadido = useRef(false); // Referencia para el mensaje inicial
  const [indicePreguntaActual, setIndicePreguntaActual] = useState(0); // Índice de la pregunta actual
  const contenedorChatRef = useRef(null); // Referencia al contenedor del chat


  // useEffect para agregar el primer mensaje de la IA cuando se monta el componente
  useEffect(() => {
    if (!mensajeInicialAñadido.current) {
      console.log("Agregando el primer mensaje de AI");
      agregarMensajeAi(questions[0]); // Agrega la primera pregunta del array
      setIndicePreguntaActual(1); // Actualiza el índice de la pregunta
      mensajeInicialAñadido.current = true; // Marca el mensaje inicial como agregado
    }
  }, []);

  // useEffect para desplazar automáticamente hacia el último mensaje
  useEffect(() => {
    if (contenedorChatRef.current) {
      contenedorChatRef.current.scrollTop = contenedorChatRef.current.scrollHeight;
    }
  }, [historialChat]);

  const agregarMensajeUsuario = (mensaje) => {
    console.log("Agregando mensaje de usuario:", mensaje);
    setHistorialChat(historialAnterior => [...historialAnterior, { rol: 'usuario', texto: mensaje }]);
  };

  const agregarMensajeAi = (mensaje) => {
    console.log("Agregando mensaje de AI:", mensaje);
    setHistorialChat(historialAnterior => [...historialAnterior, { rol: 'modelo', texto: mensaje }]);
  };

  const obtenerRespuesta = async (prompt) => {
    console.log("Prompt del usuario:", prompt);
    const nuevasRespuestas = [...respuestasUsuario, prompt];
    setRespuestasUsuario(nuevasRespuestas);

    let textoRespuesta = "";

    if (indicePreguntaActual < questions.length) {
      textoRespuesta = questions[indicePreguntaActual]; 
      setIndicePreguntaActual(indicePreguntaActual + 1); 
    } else {
      textoRespuesta = await generarSugerenciaVocacional(nuevasRespuestas); 
    }

    console.log("Respuesta de AI:", textoRespuesta);
    agregarMensajeAi(textoRespuesta); 

    
  };

  const generarSugerenciaVocacional = async (respuestas) => {
    try {
      const historialUsuario = historialChat
        .filter(entry => entry.rol === 'usuario')
        .map(entry => ({
          rol: entry.rol,
          partes: [{ texto: entry.texto }]
        }));

      const chat = await model.startChat({ historial: historialUsuario });
      const prompt = `Basado en las siguientes respuestas, por favor proporciona una sugerencia de carrera:\n\n${respuestas.join('\n')}`;
      const result = await chat.sendMessage(prompt);
      const response = await result.response;
      const text = await response.text();

      const maxLength = 600;
      const truncatedText = text.length > maxLength ? text.slice(0, maxLength) + '...' : text;

      return truncatedText;
    } catch (error) {
      console.error("Error al generar sugerencia vocacional:", error);
    }
  };

  const manejarEnvio = async (evento) => {
    evento.preventDefault();
    if (!prompt.trim()) return; 

    console.log("Prompt enviado por el usuario:", prompt);
    agregarMensajeUsuario(prompt); 
    setPrompt(''); 

    await obtenerRespuesta(prompt); 
  };

  const reiniciarTest = () => {
    setIndicePreguntaActual(0); 
    setRespuestasUsuario([]); 
    setHistorialChat([]); 
    agregarMensajeAi("El test ha sido reiniciado."); 
  };
  const obtenerOpcionesEstudio = async () => {
    try {
      const chatHistory = historialChat.filter(entry => entry.rol === 'usuario').map(entry => ({
        rol: entry.rol,
        partes: [{ texto: entry.texto }]
      }));
  
      const prompt = `¿Dónde estudiar en Argentina, teniendo en cuenta las siguientes respuestas:\n\n${respuestasUsuario.join('\n')}`;
  
      const chat = await model.startChat({ prompt });
  
      const result = await chat.sendMessage(prompt);
      const response = await result.response;
      const text = await response.text();
  
      const options = text.split('\n'); 
      const formattedOptions = options.map((option) => `- ${option}`); 
  
      agregarMensajeAi(`**Opciones de estudio en Argentina:**\n${formattedOptions.join('\n')}`);
  
    } catch (error) {
      console.error("Error al generar la respuesta de la IA:", error);
      
    }
  };
  
  return (
    <div>
      <h1 className="title">Test Vocacional</h1>
      <div id="chat-container" ref={contenedorChatRef}>
        {historialChat.map((msg, index) => (
          <div key={index} className={msg.rol === 'usuario' ? 'user-message' : 'ai-message'}>
            {msg.texto}
          </div>
        ))}
        <form id="chat-form" onSubmit={manejarEnvio}>
          <input
            id="prompt"
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button type="submit">Enviar</button>
        </form>
        <button className="action-button" onClick={obtenerOpcionesEstudio}>Dónde estudiar en Argentina</button>
        <button className="action-button" onClick={reiniciarTest}>Reiniciar Test</button>
      </div>
    </div>
  );
};

export default ChatComponent;