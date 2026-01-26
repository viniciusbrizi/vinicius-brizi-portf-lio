import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Send, User, Mail, MessageSquare, Building2, Code2, Briefcase } from 'lucide-react';
import { z } from 'zod';

gsap.registerPlugin(ScrollTrigger);

const clientSchema = z.object({
  name: z.string().trim().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100),
  email: z.string().trim().email('Email inválido').max(255),
  company: z.string().trim().max(100).optional(),
  project: z.string().trim().min(10, 'Descreva seu projeto com mais detalhes').max(1000),
});

const devSchema = z.object({
  name: z.string().trim().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100),
  email: z.string().trim().email('Email inválido').max(255),
  github: z.string().trim().max(100).optional(),
  message: z.string().trim().min(10, 'Mensagem deve ter pelo menos 10 caracteres').max(1000),
});

type FormType = 'client' | 'dev';

const ContactSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const [activeForm, setActiveForm] = useState<FormType>('client');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      if (activeForm === 'client') {
        clientSchema.parse(data);
      } else {
        devSchema.parse(data);
      }

      // Simulate submission
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubmitSuccess(true);
      (e.target as HTMLFormElement).reset();
      
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.errors.forEach((error) => {
          if (error.path[0]) {
            fieldErrors[error.path[0] as string] = error.message;
          }
        });
        setErrors(fieldErrors);
      }
    } finally {
      setIsSubmitting(false);
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
            Seja para um projeto, oportunidade ou apenas trocar ideias sobre desenvolvimento.
          </p>
        </div>

        {/* Form selector tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex glass rounded-full p-1">
            <button
              type="button"
              onClick={() => {
                setActiveForm('client');
                setErrors({});
              }}
              className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                activeForm === 'client'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              Para Clientes
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveForm('dev');
                setErrors({});
              }}
              className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                activeForm === 'dev'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Code2 className="w-4 h-4" />
              Para Devs
            </button>
          </div>
        </div>

        {/* Contact form */}
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="contact-form space-y-6">
            {/* Success message */}
            {submitSuccess && (
              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 text-center">
                Mensagem enviada com sucesso! Entrarei em contato em breve.
              </div>
            )}

            {/* Name field */}
            <div>
              <label htmlFor="name" className="flex items-center gap-2 text-sm font-medium mb-2">
                <User className="w-4 h-4 text-primary" />
                Nome
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className={`form-input ${errors.name ? 'border-destructive' : ''}`}
                placeholder="Seu nome"
              />
              {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Email field */}
            <div>
              <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium mb-2">
                <Mail className="w-4 h-4 text-primary" />
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className={`form-input ${errors.email ? 'border-destructive' : ''}`}
                placeholder="seu@email.com"
              />
              {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Conditional field based on form type */}
            {activeForm === 'client' ? (
              <div>
                <label htmlFor="company" className="flex items-center gap-2 text-sm font-medium mb-2">
                  <Building2 className="w-4 h-4 text-primary" />
                  Empresa <span className="text-muted-foreground">(opcional)</span>
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  className="form-input"
                  placeholder="Nome da empresa"
                />
              </div>
            ) : (
              <div>
                <label htmlFor="github" className="flex items-center gap-2 text-sm font-medium mb-2">
                  <Code2 className="w-4 h-4 text-primary" />
                  GitHub <span className="text-muted-foreground">(opcional)</span>
                </label>
                <input
                  type="text"
                  id="github"
                  name="github"
                  className="form-input"
                  placeholder="github.com/username"
                />
              </div>
            )}

            {/* Message field */}
            <div>
              <label
                htmlFor={activeForm === 'client' ? 'project' : 'message'}
                className="flex items-center gap-2 text-sm font-medium mb-2"
              >
                <MessageSquare className="w-4 h-4 text-primary" />
                {activeForm === 'client' ? 'Sobre o projeto' : 'Mensagem'}
              </label>
              <textarea
                id={activeForm === 'client' ? 'project' : 'message'}
                name={activeForm === 'client' ? 'project' : 'message'}
                rows={5}
                className={`form-input resize-none ${
                  errors.project || errors.message ? 'border-destructive' : ''
                }`}
                placeholder={
                  activeForm === 'client'
                    ? 'Conte-me sobre seu projeto, objetivos e prazo...'
                    : 'Escreva sua mensagem, ideia de colaboração...'
                }
              />
              {(errors.project || errors.message) && (
                <p className="text-destructive text-xs mt-1">{errors.project || errors.message}</p>
              )}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full magnetic-button disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Enviando...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Enviar mensagem
                  <Send className="w-4 h-4" />
                </span>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;