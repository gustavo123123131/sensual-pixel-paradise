
import React, { useState, useEffect } from 'react';
import { Package } from '../types';
import { createPixPayment, checkPaymentStatus } from '../api/pushingpay';
import { Button } from './ui/button';
import { Copy, Check } from 'lucide-react';
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
  const [copied, setCopied] = useState(false);
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
      setCopied(true);
      toast({
        title: "PIX Copiado!",
        description: "A chave PIX foi copiada para a área de transferência.",
      });
      
      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      // Fallback para browsers mais antigos
      const textArea = document.createElement('textarea');
      textArea.value = pixKey;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      setCopied(true);
      toast({
        title: "PIX Copiado!",
        description: "A chave PIX foi copiada para a área de transferência.",
      });
      
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="card-gradient rounded-2xl p-4 sm:p-6 w-full max-w-sm sm:max-w-md border border-gray-800 animate-scale-in max-h-[95vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h3 className="font-playfair text-xl sm:text-2xl font-bold text-gradient">
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
        <div className="border border-gray-700 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xl sm:text-2xl">{pkg.emoji}</span>
            <span className="text-lg sm:text-xl font-bold text-gradient">
              R$ {pkg.price.toFixed(2).replace('.', ',')}
            </span>
          </div>
          <h4 className="font-playfair text-base sm:text-lg font-semibold text-white mb-2">
            {pkg.name}
          </h4>
          <p className="text-rose-baby text-xs sm:text-sm mb-3">
            {pkg.description}
          </p>
          <ul className="space-y-1">
            {pkg.features.map((feature, idx) => (
              <li key={idx} className="text-gray-300 text-xs sm:text-sm flex items-center">
                <span className="text-rose-baby mr-2">•</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Payment Section */}
        <div className="text-center">
          {paymentStatus === 'processing' && (
            <div className="py-6 sm:py-8">
              <div className="animate-spin w-6 h-6 sm:w-8 sm:h-8 border-2 border-rose-baby border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-300 text-sm">Gerando pagamento Pix...</p>
            </div>
          )}

          {paymentStatus === 'waiting' && (
            <div className="py-3 sm:py-4">
              {qrCodeImage && (
                <div className="mb-4">
                  <img 
                    src={qrCodeImage}
                    alt="QR Code PIX" 
                    className="w-32 h-32 sm:w-48 sm:h-48 mx-auto bg-white rounded-xl p-2 sm:p-4"
                  />
                </div>
              )}
              
              <p className="text-rose-baby font-semibold mb-2 text-sm sm:text-base">
                Escaneie o QR Code para pagar
              </p>
              <p className="text-gray-400 text-xs sm:text-sm mb-4">
                Pagamento via Pix • Aprovação instantânea
              </p>
              
              {pixKey && (
                <div className="bg-gray-800 rounded-lg p-3 mb-4">
                  <p className="text-xs text-gray-400 mb-2">Chave Pix:</p>
                  <div className="mb-3">
                    <p className="text-xs sm:text-sm text-white font-mono break-all bg-gray-900 p-2 rounded">
                      {pixKey}
                    </p>
                  </div>
                  
                  <button
                    onClick={copyPixKey}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base ${
                      copied 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gradient-to-r from-orange-400 to-orange-500 text-white hover:from-orange-500 hover:to-orange-600'
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 sm:h-5 sm:w-5" />
                        Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 sm:h-5 sm:w-5" />
                        Copiar chave Pix
                      </>
                    )}
                  </button>
                </div>
              )}
              
              <p className="text-xs text-gray-500 mb-4">
                Após o pagamento, você será redirecionado para o WhatsApp da modelo em até 5 minutos
              </p>
            </div>
          )}

          {paymentStatus === 'completed' && (
            <div className="py-6 sm:py-8 text-center">
              <div className="text-green-500 text-4xl sm:text-5xl mb-4">✅</div>
              <h4 className="text-lg sm:text-xl font-bold text-green-500 mb-2">
                Pagamento Confirmado!
              </h4>
              <p className="text-gray-300 mb-4 text-sm sm:text-base">
                Você será redirecionado para o WhatsApp da modelo!
              </p>
              <button
                onClick={onClose}
                className="btn-primary text-black font-semibold px-6 py-3 rounded-xl text-sm sm:text-base"
              >
                Fechar
              </button>
            </div>
          )}

          {paymentStatus === 'error' && (
            <div className="py-6 sm:py-8 text-center">
              <div className="text-red-500 text-4xl sm:text-5xl mb-4">❌</div>
              <h4 className="text-lg sm:text-xl font-bold text-red-500 mb-2">
                Erro no Pagamento
              </h4>
              <p className="text-gray-300 mb-4 text-sm sm:text-base">
                Ocorreu um erro. Tente novamente.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={initializePayment}
                  className="btn-primary text-black font-semibold px-6 py-3 rounded-xl text-sm sm:text-base"
                >
                  Tentar Novamente
                </button>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white px-6 py-3 text-sm sm:text-base"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Security Notice */}
        <div className="mt-4 sm:mt-6 text-center">
          <p className="text-xs text-gray-500">
            🔒 Pagamento seguro via PushingPay • Seus dados estão protegidos
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
