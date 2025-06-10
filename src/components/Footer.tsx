
import React from 'react';

const Footer = () => {
  return (
    <footer className="py-12 px-4 border-t border-gray-800">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-6">
          <h3 className="font-playfair text-2xl font-bold text-gradient mb-2">
            Isabella Santos
          </h3>
          <p className="font-great-vibes text-lg text-rose-baby">
            Sua musa particular
          </p>
        </div>
        
        <div className="text-gray-400 text-sm">
          <p className="mb-2">Conteúdo exclusivo para maiores de 18 anos</p>
          <p>© 2024 Isabella Santos. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
