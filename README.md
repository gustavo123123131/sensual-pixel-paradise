
# Isabella Santos - Landing Page Premium

Landing page sofisticada e sensual com foco em alta conversão emocional e visual.

## 🎨 Design e Estilo

- **Paleta de cores**: Fundo escuro (preto/bordô) com detalhes em rosa bebê, dourado suave, lilás e rosé gold
- **Tipografia**: 
  - Playfair Display (títulos)
  - Great Vibes (detalhes cursivos) 
  - Inter (corpo do texto)
- **Visual**: Intimista, exclusivo e luxuoso

## 📱 Seções Principais

### Hero Section
- Foto circular da modelo com borda rosé gold
- Nome + subtítulo "Sua musa particular 💋"
- Texto promocional com personalização por geolocalização

### Pacotes
- 4 opções de pacotes com preços de R$ 17 a R$ 37
- Cards elegantes com animações
- Modal de checkout integrado

### Depoimentos
- Avaliações discretas e provocantes
- Iniciais + cidade dos clientes

### Footer
- Botão fixo do WhatsApp
- Informações da marca

## 🔧 Integrações Futuras

### 📍 Geolocalização por IP
```javascript
// TODO: Implementar em src/utils/geolocation.ts
// Substituir [CIDADE DO IP] dinamicamente
```

### 💳 API PushingPay
```javascript
// TODO: Implementar em src/utils/payment.ts
// - Gerar QR Code Pix dinâmico
// - Verificar status do pagamento
// - Webhook para confirmação
```

## 🚀 Como usar

1. Clone o repositório
2. Instale as dependências: `npm install`
3. Execute o projeto: `npm run dev`

## 📋 Próximos Passos

1. **Configurar Geolocalização**:
   - Adicionar API key em `src/utils/geolocation.ts`
   - Implementar detecção de cidade por IP

2. **Integrar PushingPay**:
   - Configurar credenciais da API
   - Implementar geração de QR Code Pix
   - Configurar webhook para verificação

3. **Personalização**:
   - Substituir imagens placeholder
   - Ajustar textos e informações
   - Configurar número do WhatsApp

## 🛠️ Tecnologias

- React + TypeScript
- Tailwind CSS
- Vite
- Lucide React (ícones)

## 📱 Responsividade

- Design mobile-first
- Otimizado para todas as telas
- Animações suaves e performáticas
