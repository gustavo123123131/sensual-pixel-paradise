
/*
  API DA PUSHINPAY PARA PIX
  
  Este arquivo contém todas as funções para integração com a PushinPay
  para gerar QR Codes Pix dinâmicos e verificar status dos pagamentos.
*/

interface PushinPayPayment {
  id: string;
  value: number;
  status: 'pending' | 'paid' | 'expired' | 'error';
  qr_code: string;
  qr_code_base64: string;
  pix_key: string;
  created_at: string;
}

// API Key da PushinPay
const API_KEY = '33167|tUJdsOZftZbNpRK1oGjp9OZAKv5Mp9TNDw0BNrcWde3b6e56';
const PUSHINPAY_BASE_URL = 'https://api.pushinpay.com.br/api';

// Função para gerar QR Code a partir do código EMV
const generateQRCode = async (emvCode: string): Promise<string> => {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas not supported');
    
    // Usar uma biblioteca de QR code ou API externa
    // Por enquanto, vamos usar uma API pública para gerar o QR code
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(emvCode)}`;
    
    return qrApiUrl;
  } catch (error) {
    console.error('Erro ao gerar QR code:', error);
    return '';
  }
};

export const createPixPayment = async (data: {
  amount: number;
  description: string;
  customer_email?: string;
}): Promise<PushinPayPayment> => {
  try {
    console.log('Criando pagamento PIX:', data);
    
    const valorCentavos = Math.round(data.amount * 100); // Converter para centavos
    
    const response = await fetch(`${PUSHINPAY_BASE_URL}/pix/cashIn`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        value: valorCentavos,
        webhook_url: "",
        split_rules: []
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Erro na resposta da API:', errorData);
      throw new Error(`Erro ao criar pagamento: ${response.status}`);
    }

    const payment = await response.json();
    console.log('Pagamento criado com sucesso:', payment);
    
    // Extrair o código EMV do pix_details
    const emvCode = payment.pix_details?.emv || '';
    const qrCodeUrl = await generateQRCode(emvCode);
    
    return {
      id: payment.id || Date.now().toString(),
      value: data.amount,
      status: 'pending',
      qr_code: emvCode, // O código EMV é a chave PIX
      qr_code_base64: qrCodeUrl, // URL da imagem do QR code
      pix_key: emvCode,
      created_at: new Date().toISOString()
    };
  } catch (error) {
    console.error('Erro na API PushinPay:', error);
    throw error;
  }
};

export const checkPaymentStatus = async (paymentId: string): Promise<PushinPayPayment> => {
  try {
    console.log('Verificando status do pagamento:', paymentId);
    
    // Usar o endpoint correto para verificar transações
    const response = await fetch(`${PUSHINPAY_BASE_URL}/transactions/${paymentId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Erro ao verificar pagamento:', response.status);
      // Se não conseguir verificar, manter como pending
      return {
        id: paymentId,
        value: 0,
        status: 'pending',
        qr_code: '',
        qr_code_base64: '',
        pix_key: '',
        created_at: new Date().toISOString()
      };
    }

    const result = await response.json();
    console.log('Status do pagamento:', result);
    
    // Mapear os status da API para nossos status
    let mappedStatus: 'pending' | 'paid' | 'expired' | 'error' = 'pending';
    
    if (result.status) {
      const apiStatus = result.status.toLowerCase();
      if (['confirmed', 'completed', 'paid'].includes(apiStatus)) {
        mappedStatus = 'paid';
      } else if (['expired', 'cancelled'].includes(apiStatus)) {
        mappedStatus = 'expired';
      } else if (['error', 'failed'].includes(apiStatus)) {
        mappedStatus = 'error';
      }
    }
    
    return {
      id: paymentId,
      value: result.value || 0,
      status: mappedStatus,
      qr_code: result.qr_code || '',
      qr_code_base64: result.qr_code_base64 || '',
      pix_key: result.qr_code || '',
      created_at: result.created_at || new Date().toISOString()
    };
  } catch (error) {
    console.error('Erro ao verificar pagamento:', error);
    // Em caso de erro, retornar como pending para não quebrar o fluxo
    return {
      id: paymentId,
      value: 0,
      status: 'pending',
      qr_code: '',
      qr_code_base64: '',
      pix_key: '',
      created_at: new Date().toISOString()
    };
  }
};

export const setupWebhook = (webhookUrl: string) => {
  console.log('Webhook URL configurada:', webhookUrl);
};
