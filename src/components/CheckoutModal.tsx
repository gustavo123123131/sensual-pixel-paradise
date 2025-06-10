import React, { useState, useEffect } from 'react';
import { Package } from '../types';
import { createPixPayment, checkPaymentStatus } from '../api/pushingpay';
import { Button } from './ui/button';
import { Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CheckoutModalProps {
  package: Package;
  isOpen: boolean;
  onClose: () => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ package: pkg, isOpen, onClose }) => {
  const [paymentStatus, setPaymentStatus] = useState<'waiting' | 'processing' | 'completed' | 'error'>('waiting');
  const [qrCodeImage, setQrCodeImage] = useState<string>('');
  const [pixKey, setPixKey] = useState<string>('');
  const [paymentId, setPaymentId] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      initializePayment();
    }
  }, [isOpen]);

  const initializePayment = async () => {
    try {
      setPaymentStatus('processing');
      
      // Integração real com PushingPay
      const payment = await createPixPayment({
        amount: pkg.price,
        description: `${pkg.name} - ${pkg.description}`,
        customer_email: 'cliente@exemplo.com'
      });
      
      setQrCodeImage(payment.qr_code_base64);
      setPixKey(payment.qr_code);
      setPaymentId(payment.id);
      setPaymentStatus('waiting');
      
      // Iniciar polling para verificar pagamento
      const interval = setInterval(async () => {
        try {
          const statusResponse = await checkPaymentStatus(payment.id);
          
          if (statusResponse.status === 'paid') {
            setPaymentStatus('completed');
            clearInterval(interval);
          }
        } catch (error) {
          console.error('Erro ao verificar status:', error);
        }
      }, 3000);
      
      // Limpar interval após 10 minutos
      setTimeout(() => clearInterval(interval), 600000);
      
    } catch (error) {
      console.error('Erro ao inicializar pagamento:', error);
      setPaymentStatus('error');
    }
  };

  const copyPixKey = async () => {
    try {
      await navigator.clipboard.writeText(pixKey);
      toast({
        title: "PIX Copiado!",
        description: "A chave PIX foi copiada para a área de transferência.",
      });
    } catch (error) {
      // Fallback para browsers mais antigos
      const textArea = document.createElement('textarea');
      textArea.value = pixKey;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      toast({
        title: "PIX Copiado!",
        description: "A chave PIX foi copiada para a área de transferência.",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="card-gradient rounded-2xl p-6 max-w-md w-full border border-gray-800 animate-scale-in">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-playfair text-2xl font-bold text-gradient">
            Finalizar Compra
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        {/* Package Summary */}
        <div className="border border-gray-700 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl">{pkg.emoji}</span>
            <span className="text-xl font-bold text-gradient">
              R$ {pkg.price.toFixed(2).replace('.', ',')}
            </span>
          </div>
          <h4 className="font-playfair text-lg font-semibold text-white mb-2">
            {pkg.name}
          </h4>
          <p className="text-rose-baby text-sm mb-3">
            {pkg.description}
          </p>
          <ul className="space-y-1">
            {pkg.features.map((feature, idx) => (
              <li key={idx} className="text-gray-300 text-sm flex items-center">
                <span className="text-rose-baby mr-2">•</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Payment Section */}
        <div className="text-center">
          {paymentStatus === 'processing' && (
            <div className="py-8">
              <div className="animate-spin w-8 h-8 border-2 border-rose-baby border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-300">Gerando pagamento Pix...</p>
            </div>
          )}

          {paymentStatus === 'waiting' && (
            <div className="py-4">
              {qrCodeImage && (
                <div className="mb-4">
                  <img 
                    src={qrCodeImage} 
                    alt="QR Code PIX" 
                    className="w-48 h-48 mx-auto bg-white rounded-xl p-4"
                  />
                </div>
              )}
              
              <p className="text-rose-baby font-semibold mb-2">
                Escaneie o QR Code para pagar
              </p>
              <p className="text-gray-400 text-sm mb-4">
                Pagamento via Pix • Aprovação instantânea
              </p>
              
              {pixKey && (
                <div className="bg-gray-800 rounded-lg p-3 mb-4">
                  <p className="text-xs text-gray-400 mb-2">Chave Pix:</p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-white font-mono break-all flex-1">
                      {pixKey}
                    </p>
                    <Button
                      onClick={copyPixKey}
                      size="sm"
                      variant="outline"
                      className="shrink-0"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
              
              <p className="text-xs text-gray-500 mb-4">
                Após o pagamento, você receberá o acesso no WhatsApp em até 5 minutos
              </p>
            </div>
          )}

          {paymentStatus === 'completed' && (
            <div className="py-8 text-center">
              <div className="text-green-500 text-5xl mb-4">✅</div>
              <h4 className="text-xl font-bold text-green-500 mb-2">
                Pagamento Confirmado!
              </h4>
              <p className="text-gray-300 mb-4">
                Seu acesso foi liberado. Verifique seu WhatsApp!
              </p>
              <button
                onClick={onClose}
                className="btn-primary text-black font-semibold px-6 py-3 rounded-xl"
              >
                Fechar
              </button>
            </div>
          )}

          {paymentStatus === 'error' && (
            <div className="py-8 text-center">
              <div className="text-red-500 text-5xl mb-4">❌</div>
              <h4 className="text-xl font-bold text-red-500 mb-2">
                Erro no Pagamento
              </h4>
              <p className="text-gray-300 mb-4">
                Ocorreu um erro. Tente novamente.
              </p>
              <button
                onClick={initializePayment}
                className="btn-primary text-black font-semibold px-6 py-3 rounded-xl mr-2"
              >
                Tentar Novamente
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white px-6 py-3"
              >
                Cancelar
              </button>
            </div>
          )}
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            🔒 Pagamento seguro via PushingPay • Seus dados estão protegidos
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
