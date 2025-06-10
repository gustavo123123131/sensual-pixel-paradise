
/*
  TODO: IMPLEMENTAÇÃO DE GEOLOCALIZAÇÃO POR IP
  
  Este arquivo deve conter a lógica para detectar a cidade do visitante
  baseado no seu endereço IP usando serviços como:
  
  - ipgeolocation.io
  - ipapi.com
  - ip-api.com
  
  Exemplo de implementação futura:
  
  export const getUserCity = async (): Promise<string> => {
    try {
      const response = await fetch('https://api.ipgeolocation.io/ipgeo?apiKey=SEU_API_KEY');
      const data = await response.json();
      return data.city || 'São Paulo'; // fallback
    } catch (error) {
      console.error('Erro ao obter localização:', error);
      return 'São Paulo'; // fallback
    }
  };
  
  export const getUserState = async (): Promise<string> => {
    try {
      const response = await fetch('https://api.ipgeolocation.io/ipgeo?apiKey=SEU_API_KEY');
      const data = await response.json();
      return data.state_prov || 'SP'; // fallback
    } catch (error) {
      console.error('Erro ao obter estado:', error);
      return 'SP'; // fallback
    }
  };
*/

// Função placeholder que retorna cidade padrão
export const getUserCity = async (): Promise<string> => {
  // TODO: Implementar API de geolocalização
  return 'São Paulo';
};

export const getUserState = async (): Promise<string> => {
  // TODO: Implementar API de geolocalização  
  return 'SP';
};
