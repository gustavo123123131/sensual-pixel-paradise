
export interface Package {
  id: number;
  name: string;
  description: string;
  price: number;
  emoji: string;
  features: string[];
  popular?: boolean;
  vip?: boolean;
}

export interface Testimonial {
  initials: string;
  city: string;
  text: string;
  rating: number;
}

export interface PaymentData {
  qrCode: string;
  pixKey: string;
  amount: number;
  status: 'pending' | 'paid' | 'expired' | 'error';
  transactionId: string;
}
