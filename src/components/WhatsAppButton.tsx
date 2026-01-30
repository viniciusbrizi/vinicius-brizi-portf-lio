import { MessageCircle } from 'lucide-react';

const WhatsAppButton = () => {
  const phoneNumber = '5515997631368';
  const defaultMessage = 'Olá Vinicius! Vi seu portfólio e gostaria de conversar.';
  
  const handleClick = () => {
    const encodedMessage = encodeURIComponent(defaultMessage);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 group"
      aria-label="Enviar mensagem no WhatsApp"
    >
      <div className="relative">
        {/* Pulse animation rings */}
        <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-25" />
        <div className="absolute inset-0 rounded-full bg-green-500 animate-pulse opacity-40" style={{ animationDelay: '0.5s' }} />
        
        {/* Main button */}
        <div className="relative flex items-center justify-center w-14 h-14 bg-green-500 rounded-full shadow-lg shadow-green-500/30 transition-all duration-300 group-hover:scale-110 group-hover:shadow-green-500/50 group-hover:shadow-xl">
          <MessageCircle className="w-7 h-7 text-white fill-white" />
        </div>
        
        {/* Tooltip */}
        <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-2 bg-card border border-border rounded-lg text-sm text-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          Fale comigo no WhatsApp
        </div>
      </div>
    </button>
  );
};

export default WhatsAppButton;
