
import React from 'react';
import { Package } from '../types';

interface PackagesSectionProps {
  onPackageSelect: (pkg: Package) => void;
}

const PackagesSection: React.FC<PackagesSectionProps> = ({ onPackageSelect }) => {
  const packages: Package[] = [
    {
      id: 1,
      name: "Grupo VIP",
      description: "Acesso semanal",
      price: 17.00,
      emoji: "✨",
      features: ["Acesso ao grupo por 1 semana", "Conteúdo exclusivo diário", "Chat direto comigo", "Fotos e vídeos sensuais"]
    },
    {
      id: 2,
      name: "Grupo VIP",
      description: "Acesso mensal",
      price: 27.00,
      emoji: "✨",
      features: ["Acesso ao grupo por 1 mês", "Todo conteúdo exclusivo", "Chat direto prioritário", "Vídeos íntimos completos"],
      popular: true
    },
    {
      id: 3,
      name: "Grupo VIP",
      description: "Acesso vitalício",
      price: 37.00,
      emoji: "✨",
      features: ["Acesso permanente ao grupo", "Todo o conteúdo premium", "Chat VIP comigo", "Conteúdo personalizado", "Prioridade total"],
      vip: true
    },
    {
      id: 4,
      name: "Chamada Privada",
      description: "Chamada de vídeo privada",
      price: 35.00,
      emoji: "📱",
      features: ["Chamada de vídeo 15min", "Conversa íntima", "Momento exclusivo", "Agendamento flexível"]
    }
  ];

  const handleWhatsAppCall = () => {
    const phoneNumber = "5511999999999";
    const message = "Olá Isabella! Quero agendar uma chamada privada 💋";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section id="packages" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-playfair text-3xl md:text-5xl font-bold text-gradient mb-4">
            Grupos VIP Exclusivos
          </h2>
          <p className="font-great-vibes text-xl md:text-2xl text-rose-baby">
            Escolha seu plano de acesso
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {packages.map((pkg, index) => (
            <div 
              key={pkg.id}
              className={`relative card-gradient rounded-2xl p-6 border border-gray-800 hover:border-rose-gold transition-all duration-300 hover:scale-105 animate-fade-in ${
                pkg.popular ? 'ring-2 ring-gold-soft' : ''
              } ${pkg.vip ? 'ring-2 ring-rose-baby' : ''}`}
              style={{animationDelay: `${index * 0.1}s`}}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gold-soft text-black px-4 py-1 rounded-full text-sm font-semibold">
                  Mais Popular
                </div>
              )}
              
              {pkg.vip && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-rose-baby text-black px-4 py-1 rounded-full text-sm font-semibold">
                  Melhor Custo
                </div>
              )}

              <div className="text-center mb-6">
                <div className="text-4xl mb-4">{pkg.emoji}</div>
                <h3 className="font-playfair text-xl font-bold text-white mb-2">
                  {pkg.name}
                </h3>
                <p className="text-rose-baby text-sm mb-4">
                  {pkg.description}
                </p>
                <div className="text-3xl font-bold text-gradient">
                  R$ {pkg.price.toFixed(2).replace('.', ',')}
                </div>
              </div>

              <ul className="space-y-2 mb-6">
                {pkg.features.map((feature, idx) => (
                  <li key={idx} className="text-gray-300 text-sm flex items-center">
                    <span className="text-rose-baby mr-2">•</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={pkg.name === "Chamada Privada" ? handleWhatsAppCall : () => onPackageSelect(pkg)}
                className="w-full btn-primary text-black font-semibold py-3 rounded-xl hover:scale-105 transition-transform duration-300"
              >
                {pkg.name === "Chamada Privada" ? "Agendar Agora" : "Assinar Agora"} 💖
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PackagesSection;
