import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ExternalLink, Github, ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    id: 1,
    title: 'E-commerce Dashboard',
    description: 'Dashboard completo com gráficos interativos, gestão de produtos e análise de vendas em tempo real.',
    tags: ['React', 'TypeScript', 'Tailwind', 'Recharts'],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    github: '#',
    live: '#',
    featured: true,
  },
  {
    id: 2,
    title: 'App de Finanças',
    description: 'Aplicação para controle financeiro pessoal com categorização automática e visualização de gastos.',
    tags: ['React', 'Node.js', 'MongoDB', 'Chart.js'],
    image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&q=80',
    github: '#',
    live: '#',
    featured: true,
  },
  {
    id: 3,
    title: 'Landing Page SaaS',
    description: 'Landing page moderna e otimizada para conversão, com animações suaves e design responsivo.',
    tags: ['React', 'GSAP', 'Tailwind'],
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    github: '#',
    live: '#',
    featured: false,
  },
  {
    id: 4,
    title: 'Task Manager',
    description: 'Gerenciador de tarefas com drag-and-drop, filtros avançados e sincronização em tempo real.',
    tags: ['React', 'DnD Kit', 'Supabase'],
    image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&q=80',
    github: '#',
    live: '#',
    featured: false,
  },
];

const PortfolioSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);

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

      // Project cards animation
      gsap.from('.project-card', {
        scrollTrigger: {
          trigger: '.projects-grid',
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
        opacity: 0,
        y: 60,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.15,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // 3D Tilt effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, projectId: number) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;

    gsap.to(card, {
      rotateX: rotateX,
      rotateY: rotateY,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.5,
      ease: 'power2.out',
    });
  };

  return (
    <section ref={sectionRef} id="portfolio" className="relative py-24 md:py-32">
      <div className="section-container">
        {/* Section title */}
        <div ref={titleRef} className="mb-16 text-center">
          <span className="text-primary text-sm uppercase tracking-widest font-medium">
            Portfólio
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2">
            Projetos em <span className="gradient-text">destaque</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Uma seleção dos meus trabalhos mais recentes, demonstrando habilidades técnicas e atenção aos detalhes.
          </p>
        </div>

        {/* Projects grid */}
        <div className="projects-grid grid md:grid-cols-2 gap-6 lg:gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="project-card tilt-card group"
              onMouseMove={(e) => handleMouseMove(e, project.id)}
              onMouseLeave={handleMouseLeave}
              onMouseEnter={() => setHoveredProject(project.id)}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div
                className={`relative overflow-hidden rounded-2xl glass transition-all duration-500 ${
                  project.featured ? 'md:row-span-2' : ''
                } ${hoveredProject === project.id ? 'glow-box' : ''}`}
                style={{ transform: 'translateZ(20px)' }}
              >
                {/* Project image */}
                <div className="relative h-48 md:h-64 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent opacity-60" />
                  
                  {/* Overlay links */}
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <a
                      href={project.github}
                      className="p-2 glass rounded-lg hover:bg-primary/20 transition-colors"
                      aria-label="View on GitHub"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                    <a
                      href={project.live}
                      className="p-2 glass rounded-lg hover:bg-primary/20 transition-colors"
                      aria-label="View live site"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* Project info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                  </div>
                  
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-xs bg-secondary/50 text-muted-foreground rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View all button */}
        <div className="text-center mt-12">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 glass rounded-full text-sm font-medium hover:bg-primary/10 transition-colors group"
          >
            Ver todos no GitHub
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;