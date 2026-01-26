import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Code2, Rocket, Target, Zap } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const skills = [
  { name: 'React', level: 90 },
  { name: 'TypeScript', level: 85 },
  { name: 'CSS/Tailwind', level: 95 },
  { name: 'JavaScript', level: 90 },
  { name: 'GSAP', level: 75 },
  { name: 'Git', level: 80 },
];

const values = [
  {
    icon: Code2,
    title: 'Código Limpo',
    description: 'Priorizo legibilidade e manutenção em cada linha.',
  },
  {
    icon: Rocket,
    title: 'Performance',
    description: 'Experiências rápidas e otimizadas sempre.',
  },
  {
    icon: Target,
    title: 'Foco em Resultados',
    description: 'Entregas que geram impacto real.',
  },
  {
    icon: Zap,
    title: 'Aprendizado Contínuo',
    description: 'Evolução constante é minha meta diária.',
  },
];

const AboutSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
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

      // Content animation
      gsap.from('.about-content', {
        scrollTrigger: {
          trigger: contentRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
        opacity: 0,
        x: -60,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.2,
      });

      // Values cards animation
      gsap.from('.value-card', {
        scrollTrigger: {
          trigger: '.values-grid',
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.15,
      });

      // Skills bars animation
      gsap.from('.skill-bar-fill', {
        scrollTrigger: {
          trigger: skillsRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
        scaleX: 0,
        transformOrigin: 'left',
        duration: 1.2,
        ease: 'power3.out',
        stagger: 0.1,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="about" className="relative py-24 md:py-32">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />

      <div className="section-container relative">
        {/* Section title */}
        <div ref={titleRef} className="mb-16">
          <span className="text-primary text-sm uppercase tracking-widest font-medium">
            Sobre mim
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2">
            Transformando <span className="gradient-text">paixão</span> em código
          </h2>
        </div>

        <div ref={contentRef} className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left column - Story */}
          <div className="space-y-6">
            <p className="about-content text-lg text-muted-foreground leading-relaxed">
              Minha jornada no desenvolvimento começou com uma curiosidade simples: 
              <span className="text-foreground"> como criar algo do zero que impacte pessoas?</span>
            </p>
            <p className="about-content text-lg text-muted-foreground leading-relaxed">
              Desde então, cada projeto se tornou uma oportunidade de evoluir. Não apenas 
              tecnicamente, mas como profissional que entende o <span className="text-primary">valor de cada detalhe</span>.
            </p>
            <p className="about-content text-lg text-muted-foreground leading-relaxed">
              Busco meu primeiro emprego na área com a determinação de quem sabe que 
              disciplina e consistência superam qualquer obstáculo.
            </p>

            {/* Values grid */}
            <div className="values-grid grid grid-cols-2 gap-4 pt-8">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="value-card p-4 glass rounded-xl hover:bg-card/80 transition-colors group"
                >
                  <value.icon className="w-6 h-6 text-primary mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="font-semibold text-sm mb-1">{value.title}</h3>
                  <p className="text-xs text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right column - Skills */}
          <div ref={skillsRef} className="space-y-6">
            <h3 className="text-xl font-semibold mb-8">Stack & Habilidades</h3>
            
            <div className="space-y-5">
              {skills.map((skill, index) => (
                <div key={index} className="skill-item">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">{skill.name}</span>
                    <span className="text-sm text-muted-foreground">{skill.level}%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="skill-bar-fill h-full bg-gradient-to-r from-primary to-glow-secondary rounded-full"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8">
              <div className="text-center p-4 glass rounded-xl">
                <span className="block text-3xl font-bold gradient-text">10+</span>
                <span className="text-xs text-muted-foreground">Projetos</span>
              </div>
              <div className="text-center p-4 glass rounded-xl">
                <span className="block text-3xl font-bold gradient-text">1+</span>
                <span className="text-xs text-muted-foreground">Ano Estudando</span>
              </div>
              <div className="text-center p-4 glass rounded-xl">
                <span className="block text-3xl font-bold gradient-text">100%</span>
                <span className="text-xs text-muted-foreground">Dedicação</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;