import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const CTASection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(contentRef.current, {
        scrollTrigger: {
          trigger: contentRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
        opacity: 0,
        scale: 0.95,
        duration: 1,
        ease: 'power3.out',
      });

      // Floating sparkles animation
      gsap.to('.sparkle', {
        y: -10,
        duration: 2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        stagger: 0.3,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-24 md:py-32 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-glow-secondary/10 to-primary/10 animate-gradient-shift bg-400%" />
      
      <div className="section-container relative">
        <div
          ref={contentRef}
          className="relative max-w-4xl mx-auto text-center p-8 md:p-16 glass rounded-3xl glow-box overflow-hidden"
        >
          {/* Decorative sparkles */}
          <Sparkles className="sparkle absolute top-8 left-8 w-6 h-6 text-primary/50" />
          <Sparkles className="sparkle absolute top-12 right-16 w-4 h-4 text-glow-secondary/50" />
          <Sparkles className="sparkle absolute bottom-16 left-16 w-5 h-5 text-primary/50" />
          <Sparkles className="sparkle absolute bottom-8 right-8 w-6 h-6 text-glow-secondary/50" />

          {/* Content */}
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Pronto para dar vida à sua{' '}
              <span className="gradient-text">próxima ideia</span>?
            </h2>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Estou buscando oportunidades para crescer como desenvolvedor e contribuir 
              com projetos que fazem a diferença. Vamos criar algo incrível juntos.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#contact"
                className="magnetic-button group"
              >
                <span>Fale comigo</span>
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              
              <a
                href="mailto:contato@viniciusbrizi.com"
                className="px-6 py-4 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors link-underline"
              >
                contato@viniciusbrizi.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;