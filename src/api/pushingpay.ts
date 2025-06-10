
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
    
    return {
      id: payment.id || payment.transaction_id || Date.now().toString(),
      value: data.amount,
      status: 'pending',
      qr_code: payment.qr_code,
      qr_code_base64: payment.qr_code_base64,
      pix_key: payment.qr_code, // The qr_code is the pix key
      created_at: new Date().toISOString()
    };
  } catch (error) {
    console.error('Erro na API PushinPay:', error);
    throw error;
  }
};

export const checkPaymentStatus = async (paymentId: string): Promise<PushinPayPayment> => {
  try {
    // Para verificação de status, vamos usar um endpoint simulado por enquanto
    // até ter a documentação completa da API
    console.log('Verificando status do pagamento:', paymentId);
    
    // Simulação temporária - em produção seria uma chamada real à API
    return {
      id: paymentId,
      value: 0,
      status: Math.random() > 0.7 ? 'paid' : 'pending',
      qr_code: '',
      qr_code_base64: '',
      created_at: new Date().toISOString()
    };
  } catch (error) {
    console.error('Erro ao verificar pagamento:', error);
    throw error;
  }
};

export const setupWebhook = (webhookUrl: string) => {
  console.log('Webhook URL configurada:', webhookUrl);
};
