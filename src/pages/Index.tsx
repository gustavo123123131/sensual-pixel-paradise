
import { useState } from 'react';
import HeroSection from '../components/HeroSection';
import PackagesSection from '../components/PackagesSection';
import TestimonialsSection from '../components/TestimonialsSection';
import Footer from '../components/Footer';
import CheckoutModal from '../components/CheckoutModal';
import { Package } from '../types';

const Index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);

  const handlePackageSelect = (pkg: Package) => {
    setSelectedPackage(pkg);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPackage(null);
  };

  return (
    <div className="min-h-screen">
      {/* 
        TODO: Implementar script de geolocalização por IP aqui
        O script deve capturar a cidade do visitante e armazenar em uma variável
        que será passada para o HeroSection para substituir [CIDADE DO IP]
        
        Exemplo de integração futura:
        useEffect(() => {
          // API de geolocalização por IP
          fetch('https://api.ipgeolocation.io/ipgeo?apiKey=SEU_API_KEY')
            .then(response => response.json())
            .then(data => setCidade(data.city))
            .catch(() => setCidade('São Paulo')); // fallback
        }, []);
      */}
      
      <HeroSection />
      <PackagesSection onPackageSelect={handlePackageSelect} />
      <TestimonialsSection />
      <Footer />
      
      {selectedPackage && (
        <CheckoutModal 
          package={selectedPackage}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default Index;
