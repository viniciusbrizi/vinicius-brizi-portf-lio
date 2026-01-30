import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Send, User, Mail, MessageSquare, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';

gsap.registerPlugin(ScrollTrigger);

const contactSchema = z.object({
  name: z.string().trim().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100),
  email: z.string().trim().email('Email inválido').max(255),
  message: z.string().trim().min(10, 'Mensagem deve ter pelo menos 10 caracteres').max(1000),
});

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

const ContactSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [formStatus, setFormStatus] = useState<FormStatus>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        scrollTrigger: {
          trigger: titleRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
        opacity: 0,
        y: 60,
        duration: 1,
        ease: 'power3.out',
      });

      gsap.from('.contact-form', {
        scrollTrigger: {
          trigger: '.contact-form',
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'power3.out',
      });

      // Animate form fields on focus
      const inputs = document.querySelectorAll('.form-input');
      inputs.forEach((input) => {
        input.addEventListener('focus', () => {
          gsap.to(input, { scale: 1.02, duration: 0.2, ease: 'power2.out' });
        });
        input.addEventListener('blur', () => {
          gsap.to(input, { scale: 1, duration: 0.2, ease: 'power2.out' });
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const openWhatsApp = (name: string, message: string) => {
    const phoneNumber = '5515997631368';
    const whatsappMessage = `Nova mensagem do portfólio!\n\nNome: ${name}\n\nMensagem: ${message}`;
    const encodedMessage = encodeURIComponent(whatsappMessage);
    // Open WhatsApp in a new tab (won't interrupt user)
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank', 'noopener,noreferrer');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setErrorMessage('');
    setFormStatus('submitting');

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      message: formData.get('message') as string,
    };

    try {
      // Validate data
      const validatedData = contactSchema.parse(data);

      // Send email via edge function
      const { data: response, error } = await supabase.functions.invoke('send-contact-email', {
        body: validatedData,
      });

      if (error) {
        throw new Error(error.message || 'Erro ao enviar mensagem');
      }

      if (!response?.success) {
        throw new Error(response?.error || 'Erro ao enviar mensagem');
      }

      // Success - trigger WhatsApp notification
      openWhatsApp(validatedData.name, validatedData.message);

      setFormStatus('success');
      formRef.current?.reset();
      
      // Reset form status after 5 seconds
      setTimeout(() => setFormStatus('idle'), 5000);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.errors.forEach((error) => {
          if (error.path[0]) {
            fieldErrors[error.path[0] as string] = error.message;
          }
        });
        setErrors(fieldErrors);
        setFormStatus('idle');
      } else {
        setErrorMessage(err instanceof Error ? err.message : 'Erro ao enviar mensagem');
        setFormStatus('error');
        setTimeout(() => setFormStatus('idle'), 5000);
      }
    }
  };

  return (
    <section ref={sectionRef} id="contact" className="relative py-24 md:py-32">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent pointer-events-none" />

      <div className="section-container relative">
        {/* Section title */}
        <div ref={titleRef} className="mb-16 text-center">
          <span className="text-primary text-sm uppercase tracking-widest font-medium">
            Contato
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2">
            Vamos <span className="gradient-text">conversar</span>?
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Interessado em trabalhar juntos? Envie uma mensagem e entrarei em contato em breve.
          </p>
        </div>

        {/* Contact form */}
        <div className="max-w-xl mx-auto">
          <form ref={formRef} onSubmit={handleSubmit} className="contact-form space-y-6">
            {/* Success message */}
            {formStatus === 'success' && (
              <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 animate-fade-in">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <span>Mensagem enviada com sucesso! Entrarei em contato em breve.</span>
              </div>
            )}

            {/* Error message */}
            {formStatus === 'error' && (
              <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/30 rounded-xl text-destructive animate-fade-in">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{errorMessage || 'Ocorreu um erro. Tente novamente.'}</span>
              </div>
            )}

            {/* Name field */}
            <div className="group">
              <label htmlFor="name" className="flex items-center gap-2 text-sm font-medium mb-2 text-foreground/80 group-focus-within:text-primary transition-colors">
                <User className="w-4 h-4" />
                Nome
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className={`form-input ${errors.name ? 'border-destructive focus:ring-destructive/50' : ''}`}
                placeholder="Seu nome completo"
                disabled={formStatus === 'submitting'}
              />
              {errors.name && (
                <p className="text-destructive text-xs mt-1 animate-fade-in">{errors.name}</p>
              )}
            </div>

            {/* Email field */}
            <div className="group">
              <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium mb-2 text-foreground/80 group-focus-within:text-primary transition-colors">
                <Mail className="w-4 h-4" />
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className={`form-input ${errors.email ? 'border-destructive focus:ring-destructive/50' : ''}`}
                placeholder="seu@email.com"
                disabled={formStatus === 'submitting'}
              />
              {errors.email && (
                <p className="text-destructive text-xs mt-1 animate-fade-in">{errors.email}</p>
              )}
            </div>

            {/* Message field */}
            <div className="group">
              <label htmlFor="message" className="flex items-center gap-2 text-sm font-medium mb-2 text-foreground/80 group-focus-within:text-primary transition-colors">
                <MessageSquare className="w-4 h-4" />
                Mensagem
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                className={`form-input resize-none ${errors.message ? 'border-destructive focus:ring-destructive/50' : ''}`}
                placeholder="Conte-me sobre seu projeto ou oportunidade..."
                disabled={formStatus === 'submitting'}
              />
              {errors.message && (
                <p className="text-destructive text-xs mt-1 animate-fade-in">{errors.message}</p>
              )}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={formStatus === 'submitting'}
              className="w-full magnetic-button disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden relative group"
            >
              {formStatus === 'submitting' ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Enviando...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Enviar mensagem
                  <Send className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
              )}
              
              {/* Button shine effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
