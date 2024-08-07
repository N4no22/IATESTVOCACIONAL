import React, { useEffect } from 'react';
import './Bubbles.css';

const Bubbles = () => {
  useEffect(() => {
    const burbujasContainer = document.querySelector('.burbujas');
    const burbujaCount = 50; // Número de burbujas a generar

    for (let i = 0; i < burbujaCount; i++) {
      const span = document.createElement('span');
      const size = Math.random() * 22 + 10; // Tamaño aleatorio entre 10 y 30px
      const posX = Math.random() * 101; // Posición X aleatoria en porcentaje
      const delay = Math.random() * 15; // Retraso aleatorio para la animación
      const duration = Math.random() * 10 + 5; // Duración aleatoria de la animación

      span.style.width = `${size}px`;
      span.style.height = `${size}px`;
      span.style.left = `${posX}%`;
      span.style.animationDelay = `${delay}s`;
      span.style.animationDuration = `${duration}s`;

      burbujasContainer.appendChild(span);
    }
  }, []);

  return (
    <div className="container">
      <div className="burbujas"></div>
    </div>
  );
};

export default Bubbles;
