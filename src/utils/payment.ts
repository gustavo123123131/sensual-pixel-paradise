
/*
  INTEGRAÇÃO COM API DA PUSHINPAY
  
  Este arquivo contém todas as funções relacionadas ao pagamento
  usando a API da PushinPay para gerar QR Codes Pix dinâmicos
  e verificar status dos pagamentos.
*/

import { PaymentData } from '../types';

// API Key da PushinPay
const API_KEY = '33167|tUJdsOZftZbNpRK1oGjp9OZAKv5Mp9TNDw0BNrcWde3b6e56';
const PUSHINPAY_BASE_URL = 'https://api.pushinpay.com.br/api';

export const createPixPayment = async (data: {
  amount: number;
  description: string;
  packageId: number;
}): Promise<PaymentData> => {
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

    const paymentResponse = await response.json();
    console.log('Pagamento criado com sucesso:', paymentResponse);
    
    return {
      qrCode: `data:image/png;base64,${paymentResponse.qr_code_base64}`,
      pixKey: paymentResponse.qr_code,
      amount: data.amount,
      status: 'pending',
      transactionId: paymentResponse.id || paymentResponse.transaction_id || Date.now().toString()
    };
  } catch (error) {
    console.error('Erro na API PushinPay:', error);
    throw error;
  }
};

export const checkPaymentStatus = async (paymentId: string): Promise<PaymentData> => {
  try {
    console.log('Verificando status do pagamento:', paymentId);
    
    // Para verificação de status, simulação temporária
    // até ter a documentação completa da API para status
    return {
      qrCode: '',
      pixKey: '',
      amount: 0,
      status: Math.random() > 0.7 ? 'paid' : 'pending',
      transactionId: paymentId
    };
  } catch (error) {
    console.error('Erro ao verificar pagamento:', error);
    throw error;
  }
};
