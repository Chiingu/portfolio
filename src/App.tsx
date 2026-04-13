import React, { useState, useEffect, useRef, useContext } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Terminal as TerminalIcon, Cpu, Server, Box, Shield, Zap, Database, Wifi, Activity, Github, Linkedin, Mail, FileDown } from 'lucide-react';

import mbLogo from './assets/mb-logo.svg';
import scanlineOverlay from './assets/scanline-overlay.svg';
import cornerTl from './assets/corner-tl.svg';
import cornerTr from './assets/corner-tr.svg';
import cornerBl from './assets/corner-bl.svg';
import cornerBr from './assets/corner-br.svg';
import barcodeBars from './assets/barcode-bars.svg';

// --- TRANSLATIONS ---
const TRANSLATIONS = {
  en: {
    projects: [
      { id: '01', title: "MINISHELL", icon: TerminalIcon, desc: "A robust Unix shell implementation in C. Features command piping, redirections, and signal handling. Engineered for stability and memory efficiency.", tags: ["C", "POSIX", "KERNEL"] },
      { id: '02', title: "INCEPTION", icon: Server, desc: "Infrastructure as Code. A complex Docker-based system with Nginx, MariaDB, and WordPress, all orchestrated with security-first TLS/SSL configurations.", tags: ["DOCKER", "LINUX", "DEVOPS"] },
      { id: '03', title: "CUB3D", icon: Box, desc: "First-person 3D engine based on raycasting. Built entirely in C, featuring texture mapping, sprite rendering, and collision detection.", tags: ["C", "MATH", "ALGORITHMS"] },
      { id: '04', title: "LIBFT", icon: Database, desc: "A custom C standard library implementation. Recreated core functions, memory manipulation, and complex data structures from scratch.", tags: ["C", "ALGORITHMS", "DATA_STRUCTURES"] },
      { id: '05', title: "MINITALK", icon: Wifi, desc: "A client-server communication program utilizing UNIX signals (SIGUSR1/SIGUSR2) to transmit strings reliably across processes.", tags: ["C", "POSIX", "SIGNALS"] },
      { id: '06', title: "BORN2BEROOT", icon: Shield, desc: "System administration and virtualization. Configured a secure Debian server with strict LVM, UFW, SSH, and password policies.", tags: ["LINUX", "SYSADMIN", "SECURITY"] },
      { id: '07', title: "PHILOSOPHERS", icon: Activity, desc: "Solved the classic dining philosophers problem. Implemented multithreading and mutexes to prevent data races and deadlocks.", tags: ["C", "THREADS", "CONCURRENCY"] },
    ],
    phases: [
      { 
        id: 'P1', 
        title: "AUTOMATION", 
        role: "Industrial Tech", 
        period: "2018-2020", 
        desc: "Mastered PLC logic and heavy machine integration. The foundation of my algorithmic thinking.",
        details: [
          "Institute: IFIMIA Casablanca",
          "Journey: Started my journey diving deep into the world of industrial automation. The curriculum heavily emphasized practical application alongside theory.",
          "Key Learnings:",
          "- Programmable Logic Controllers (PLC) programming and ladder logic.",
          "- Integration of heavy machinery and robotic arms.",
          "- Troubleshooting complex electrical and mechanical systems.",
          "Training Periods: Completed multiple rotational training periods in real industrial environments, gaining hands-on experience under high pressure."
        ]
      },
      { 
        id: 'P2', 
        title: "PRECISION", 
        role: "Dental Tech", 
        period: "2020-2022", 
        desc: "Engineered medical prosthetics with 10-micron accuracy. Where hardware met biological constraints.",
        details: [
          "Journey: Transitioned into a field requiring extreme precision. Working as a dental technician taught me the importance of exactness and adapting hardware to biological constraints.",
          "Key Learnings:",
          "- Meticulous attention to detail (10-micron accuracy).",
          "- CAD/CAM software for medical design.",
          "- Material science in relation to prosthetics."
        ]
      },
      { 
        id: 'P3', 
        title: "STRATEGY", 
        role: "Pro-Gamer", 
        period: "2022-2023", 
        desc: "Represented Morocco in KIC Seoul. High-pressure decision making on a global stage.",
        details: [
          "Journey: Competed at the highest level of electronic sports. This period honed my strategic thinking, teamwork, and ability to perform under extreme pressure.",
          "Key Highlights:",
          "- Represented Morocco internationally at KIC Seoul.",
          "- Developed split-second decision-making skills.",
          "- Learned to analyze opponent strategies and adapt on the fly."
        ]
      },
      { 
        id: 'P4', 
        title: "SOFTWARE", 
        role: "1337 Agent", 
        period: "PRESENT", 
        desc: "Forging low-level systems and secure architectures in the heart of 1337 (42 Network).",
        details: [
          "Institute: 1337 (42 Network)",
          "Journey: Currently deeply immersed in low-level programming and system architecture. The peer-to-peer learning model has accelerated my growth exponentially.",
          "Key Learnings:",
          "- C/C++ memory management and optimization.",
          "- Network programming, system calls, and concurrency.",
          "- Project-based learning emphasizing real-world problem solving."
        ]
      }
    ],
    ui: {
      identityVerified: "IDENTITY VERIFIED",
      deptId: "DEPT ID",
      class: "CLASS",
      fullName: "FULL NAME",
      login: "LOGIN",
      enteringSystem: "ENTERING SYSTEM",
      systemArchitect: "SYSTEM ARCHITECT",
      exportGithub: "[EXPORT_GITHUB_PROFILE]",
      dossierRecords: "DOSSIER_RECORDS",
      systemBreaches: "SYSTEM_BREACHES",
      technicalArsenal: "TECHNICAL_ARSENAL",
      footerText: "Property of Mourtada. All usage is subject to Central Active Monitoring.",
      githubExportTitle: "GITHUB_PROFILE_EXPORT",
      close: "[CLOSE]",
      assetsGenerated: "ASSETS GENERATED: github-header.svg, github-readme.md",
      downloadSvg: "[DOWNLOAD_SVG]",
      copyMarkdown: "COPY_MARKDOWN",
      copiedToClipboard: "COPIED_TO_CLIPBOARD",
      viewDetails: "[VIEW_DETAILS]",
      downloadCv: "[DOWNLOAD_CV]",
      github: "GITHUB",
      linkedin: "LINKEDIN",
      email: "EMAIL"
    }
  },
  fr: {
    projects: [
      { id: '01', title: "MINISHELL", icon: TerminalIcon, desc: "Une implémentation robuste d'un shell Unix en C. Comprend le piping de commandes, les redirections et la gestion des signaux. Conçu pour la stabilité et l'efficacité de la mémoire.", tags: ["C", "POSIX", "NOYAU"] },
      { id: '02', title: "INCEPTION", icon: Server, desc: "Infrastructure as Code. Un système complexe basé sur Docker avec Nginx, MariaDB et WordPress, le tout orchestré avec des configurations TLS/SSL axées sur la sécurité.", tags: ["DOCKER", "LINUX", "DEVOPS"] },
      { id: '03', title: "CUB3D", icon: Box, desc: "Moteur 3D à la première personne basé sur le raycasting. Entièrement construit en C, avec mappage de texture, rendu de sprites et détection de collision.", tags: ["C", "MATH", "ALGORITHMES"] },
      { id: '04', title: "LIBFT", icon: Database, desc: "Une implémentation personnalisée de la bibliothèque standard C. Recréation des fonctions de base, de la manipulation de la mémoire et des structures de données complexes à partir de zéro.", tags: ["C", "ALGORITHMES", "STRUCTURES_DE_DONNÉES"] },
      { id: '05', title: "MINITALK", icon: Wifi, desc: "Un programme de communication client-serveur utilisant les signaux UNIX (SIGUSR1/SIGUSR2) pour transmettre des chaînes de manière fiable entre les processus.", tags: ["C", "POSIX", "SIGNAUX"] },
      { id: '06', title: "BORN2BEROOT", icon: Shield, desc: "Administration système et virtualisation. Configuration d'un serveur Debian sécurisé avec des politiques strictes LVM, UFW, SSH et de mots de passe.", tags: ["LINUX", "SYSADMIN", "SÉCURITÉ"] },
      { id: '07', title: "PHILOSOPHERS", icon: Activity, desc: "Résolution du problème classique des philosophes qui dînent. Implémentation du multithreading et des mutex pour éviter les courses aux données et les blocages.", tags: ["C", "THREADS", "CONCURRENCE"] },
    ],
    phases: [
      { 
        id: 'P1', 
        title: "AUTOMATISATION", 
        role: "Tech Industriel", 
        period: "2018-2020", 
        desc: "Maîtrise de la logique API et de l'intégration de machines lourdes. La base de ma pensée algorithmique.",
        details: [
          "Institut: IFIMIA Casablanca",
          "Parcours: J'ai commencé mon parcours en plongeant profondément dans le monde de l'automatisation industrielle. Le programme mettait fortement l'accent sur l'application pratique en plus de la théorie.",
          "Apprentissages clés:",
          "- Programmation d'automates programmables industriels (API) et langage Ladder.",
          "- Intégration de machines lourdes et de bras robotiques.",
          "- Dépannage de systèmes électriques et mécaniques complexes.",
          "Périodes de stage: J'ai effectué plusieurs stages rotatifs dans des environnements industriels réels, acquérant une expérience pratique sous haute pression."
        ]
      },
      { 
        id: 'P2', 
        title: "PRÉCISION", 
        role: "Tech Dentaire", 
        period: "2020-2022", 
        desc: "Ingénierie de prothèses médicales avec une précision de 10 microns. Où le matériel rencontre les contraintes biologiques.",
        details: [
          "Parcours: Transition vers un domaine exigeant une précision extrême. Travailler comme prothésiste dentaire m'a appris l'importance de l'exactitude et de l'adaptation du matériel aux contraintes biologiques.",
          "Apprentissages clés:",
          "- Attention méticuleuse aux détails (précision de 10 microns).",
          "- Logiciels de CAO/FAO pour la conception médicale.",
          "- Science des matériaux en relation avec les prothèses."
        ]
      },
      { 
        id: 'P3', 
        title: "STRATÉGIE", 
        role: "Pro-Gamer", 
        period: "2022-2023", 
        desc: "Représentation du Maroc au KIC Séoul. Prise de décision sous haute pression sur une scène mondiale.",
        details: [
          "Parcours: J'ai concouru au plus haut niveau des sports électroniques. Cette période a affiné ma pensée stratégique, mon travail d'équipe et ma capacité à performer sous une pression extrême.",
          "Points forts:",
          "- Représentation du Maroc à l'international au KIC Séoul.",
          "- Développement de compétences de prise de décision en une fraction de seconde.",
          "- Apprentissage de l'analyse des stratégies adverses et de l'adaptation à la volée."
        ]
      },
      { 
        id: 'P4', 
        title: "LOGICIEL", 
        role: "Agent 1337", 
        period: "PRÉSENT", 
        desc: "Forge de systèmes de bas niveau et d'architectures sécurisées au cœur de 1337 (Réseau 42).",
        details: [
          "Institut: 1337 (Réseau 42)",
          "Parcours: Actuellement profondément plongé dans la programmation de bas niveau et l'architecture système. Le modèle d'apprentissage de pair à pair a accéléré ma croissance de manière exponentielle.",
          "Apprentissages clés:",
          "- Gestion et optimisation de la mémoire en C/C++.",
          "- Programmation réseau, appels système et concurrence.",
          "- Apprentissage par projet mettant l'accent sur la résolution de problèmes du monde réel."
        ]
      }
    ],
    ui: {
      identityVerified: "IDENTITÉ VÉRIFIÉE",
      deptId: "ID DÉPARTEMENT",
      class: "CLASSE",
      fullName: "NOM COMPLET",
      login: "CONNEXION",
      enteringSystem: "ENTRÉE DANS LE SYSTÈME",
      systemArchitect: "ARCHITECTE SYSTÈME",
      exportGithub: "[EXPORTER_PROFIL_GITHUB]",
      dossierRecords: "DOSSIERS_ENREGISTREMENTS",
      systemBreaches: "BRÈCHES_SYSTÈME",
      technicalArsenal: "ARSENAL_TECHNIQUE",
      footerText: "Propriété de Mourtada. Toute utilisation est soumise à la Surveillance Active Centrale.",
      githubExportTitle: "EXPORTATION_PROFIL_GITHUB",
      close: "[FERMER]",
      assetsGenerated: "ACTIFS GÉNÉRÉS : github-header.svg, github-readme.md",
      downloadSvg: "[TÉLÉCHARGER_SVG]",
      copyMarkdown: "COPIER_MARKDOWN",
      copiedToClipboard: "COPIÉ_DANS_LE_PRESSE_PAPIERS",
      viewDetails: "[VOIR_DÉTAILS]",
      downloadCv: "[TÉLÉCHARGER_CV]",
      github: "GITHUB",
      linkedin: "LINKEDIN",
      email: "EMAIL"
    }
  }
};

type Language = 'en' | 'fr';

type Phase = typeof TRANSLATIONS.en.phases[0];
type Project = typeof TRANSLATIONS.en.projects[0];

const LanguageContext = React.createContext<{
  lang: Language;
  setLang: (lang: Language) => void;
  t: typeof TRANSLATIONS.en;
}>({
  lang: 'en',
  setLang: () => {},
  t: TRANSLATIONS.en
});

// --- COMPONENTS ---

const LanguageSwitcher = React.memo(() => {
  const { lang, setLang } = useContext(LanguageContext);
  
  return (
    <div className="absolute top-4 right-4 md:top-8 md:right-8 z-[60] flex gap-2">
      <button 
        aria-label="Switch to English"
        onClick={() => setLang('en')}
        className={`text-[10px] md:text-xs px-2 py-1 border transition-colors ${lang === 'en' ? 'border-cyan-400 text-cyan-400 bg-cyan-400/10' : 'border-white/20 text-white/40 hover:text-white hover:border-white/40'}`}
      >
        EN
      </button>
      <button 
        aria-label="Switch to French"
        onClick={() => setLang('fr')}
        className={`text-[10px] md:text-xs px-2 py-1 border transition-colors ${lang === 'fr' ? 'border-cyan-400 text-cyan-400 bg-cyan-400/10' : 'border-white/20 text-white/40 hover:text-white hover:border-white/40'}`}
      >
        FR
      </button>
    </div>
  );
});

const Clock = React.memo(() => {
  const { lang } = useContext(LanguageContext);
  const [time, setTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const locale = lang === 'fr' ? 'fr-FR' : 'en-US';

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(locale, { hour12: false, hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long' });
  };

  return (
    <div className="absolute top-4 left-4 md:top-8 md:left-8 flex flex-col items-start z-50">
      <div className="text-[clamp(2rem,5vw,3.75rem)] font-light tracking-widest leading-none">{formatTime(time)}</div>
      <div className="text-[clamp(0.7rem,1.5vw,0.875rem)] mt-2 text-white/60 uppercase">{formatDate(time)}</div>
    </div>
  );
});

const NodeInfo = React.memo(() => (
  <div className="absolute top-16 right-4 md:top-20 md:right-8 text-right text-[10px] md:text-xs z-50 hidden sm:block">
    <div className="flex justify-between w-32 md:w-48 border-b border-white/30 pb-1 mb-1 text-white/40">
      <span>CPU</span><span>NODE</span>
    </div>
    <div className="flex justify-between w-32 md:w-48">
      <span>Workstation</span><span>109.309.813.301</span>
    </div>
  </div>
));

const TerminalLogs = React.memo(() => {
  const [logs, setLogs] = useState<string[]>([]);
  
  useEffect(() => {
    const initialLogs = [
      '> BEGIN_LINK_ESTABLISHED - AU-3087H-INST-2',
      '> LOG_STREAM_CONNECTED // ID75252N-A698-4D95-A85D-E231A45F13F',
      '> WL_OUTPUT_PROBE: UP 1 ==> ADDR_PIN: 0xF3A56B81',
      '------------------ SYSTEM_OS_INITIALIZING ------------------',
      '> [MB_IDP] Using Protocol::TEST',
      '> [ROUTING] [ CIPHER_NEGOTIATED ==> SHA3(256)@0xAF1B-16A]',
      '> [MB_IDP] Opened session for user(system)'
    ];
    
    let i = 0;
    const interval = setInterval(() => {
      if (i < initialLogs.length) {
        setLogs(prev => [...prev, initialLogs[i]]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 300);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 text-[8px] md:text-[10px] text-white/60 font-mono w-2/3 md:w-1/3 z-50 hidden sm:block">
      {logs.map((log, i) => (
        <div key={i} className="mb-1">{log}</div>
      ))}
      <div className="mt-2 border border-white/20 p-1 inline-block">
        MBOUIZAK ver=13.37 <span className="text-white">v UM6.P</span>
      </div>
    </div>
  );
});

const RightBarcode = React.memo(() => {
  const [hex, setHex] = useState('');
  
  useEffect(() => {
    const generateHex = () => {
      let result = '';
      const chars = '0123456789ABCDEF';
      for (let i = 0; i < 40; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    };
    
    setHex(generateHex());
    const interval = setInterval(() => setHex(generateHex()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute right-2 md:right-4 top-1/4 bottom-1/4 w-6 md:w-8 flex flex-col items-center justify-between text-[6px] md:text-[8px] z-50 hidden sm:flex">
      <div className="writing-vertical-rl tracking-widest opacity-50">
        A0080B119-CF9A-4E8D-A85D-E231A45F13F-00-00-001
      </div>
      
      <img src={barcodeBars} alt="" className="my-4 w-full" />

      <div className="writing-vertical-rl tracking-widest opacity-50 break-all h-32 overflow-hidden">
        {hex}
      </div>
    </div>
  );
});

const MbLogo = React.memo(() => (
  <img src={mbLogo} alt="MB-OS" />
));

const NetworkBackground = React.memo(({ faded = false }: { faded?: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let animationFrameId: number;
    let time = 0;
    let lastTime = performance.now();

    interface Node {
      x: number;
      y: number;
      vx: number;
      vy: number;
      isTarget: boolean;
      id: string;
    }

    let nodes: Node[] = [];

    const initNetwork = () => {
      nodes = [];
      const numNodes = Math.min(Math.floor((width * height) / 15000), 120); // slightly reduced max nodes for performance
      for (let i = 0; i < numNodes; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 1.2,
          vy: (Math.random() - 0.5) * 1.2,
          isTarget: Math.random() > 0.92,
          id: `0x${Math.floor(Math.random() * 0xFFFF).toString(16).toUpperCase().padStart(4, '0')}`
        });
      }
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      initNetwork();
    };

    let resizeTimeout: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resize, 200);
    };

    window.addEventListener('resize', handleResize);
    resize();

    const draw = () => {
      const now = performance.now();
      let dt = now - lastTime;
      if (dt > 100) dt = 16;
      lastTime = now;
      time += dt;

      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      const gridSize = 60;
      const offset = (time * 0.04) % gridSize;
      
      ctx.beginPath();
      for (let x = 0; x < width + gridSize; x += gridSize) {
        ctx.moveTo(x - offset, 0);
        ctx.lineTo(x - offset, height);
      }
      for (let y = 0; y < height + gridSize; y += gridSize) {
        ctx.moveTo(0, y - offset);
        ctx.lineTo(width, y - offset);
      }
      ctx.stroke();

      for (let i = 0; i < nodes.length; i++) {
        let n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0) n.x = width;
        if (n.x > width) n.x = 0;
        if (n.y < 0) n.y = height;
        if (n.y > height) n.y = 0;
      }

      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distSq = dx * dx + dy * dy;
          const maxDist = 150;
          
          if (distSq < maxDist * maxDist) {
            const dist = Math.sqrt(distSq);
            const opacity = 1 - (dist / maxDist);
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.25})`;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        if (!n.isTarget) {
          ctx.fillRect(n.x - 1.5, n.y - 1.5, 3, 3);
        }
      }

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        if (n.isTarget) {
          ctx.strokeStyle = '#ff003c';
          ctx.lineWidth = 1;
          ctx.strokeRect(n.x - 10, n.y - 10, 20, 20);
          
          ctx.fillStyle = '#ff003c';
          ctx.fillRect(n.x - 2, n.y - 2, 4, 4);

          ctx.font = '10px "Share Tech Mono", monospace';
          ctx.fillText(`ID:${n.id}`, n.x + 15, n.y - 5);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
          ctx.fillText(`[${Math.floor(n.x)},${Math.floor(n.y)}]`, n.x + 15, n.y + 7);
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className={`fixed inset-0 z-0 pointer-events-none bg-black transition-opacity duration-1000 ease-in-out ${faded ? 'opacity-15' : 'opacity-100'}`}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%)',
        backgroundSize: '100% 4px',
        boxShadow: 'inset 0 0 150px rgba(0,0,0,0.9)'
      }}></div>
      <div className="absolute inset-0 pointer-events-none opacity-[0.06]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
      }}></div>
    </div>
  );
});

const SystemLoaderCube = React.memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rotation = 0;
    let animationFrameId: number;

    const nodes = [
      [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
      [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]
    ];
    
    const faces = [
      [0, 1, 2, 3], // Front
      [5, 4, 7, 6], // Back
      [4, 5, 1, 0], // Top
      [3, 2, 6, 7], // Bottom
      [1, 5, 6, 2], // Right
      [4, 0, 3, 7]  // Left
    ];

    const scale = 50;
    const center = 100;

    const render = () => {
      rotation += 0.01;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const projectedNodes = nodes.map(([x, y, z]) => {
        const y1 = y * Math.cos(rotation) - z * Math.sin(rotation);
        const z1 = y * Math.sin(rotation) + z * Math.cos(rotation);
        const x2 = x * Math.cos(rotation) + z1 * Math.sin(rotation);
        const z2 = -x * Math.sin(rotation) + z1 * Math.cos(rotation);
        
        return {
          x: x2 * scale + center,
          y: y1 * scale + center,
          z: z2
        };
      });

      const projectedFaces = faces.map((indices, index) => {
        const faceNodes = indices.map(i => projectedNodes[i]);
        const avgZ = faceNodes.reduce((sum, node) => sum + node.z, 0) / 4;
        return { id: index, faceNodes, avgZ };
      });

      projectedFaces.sort((a, b) => b.avgZ - a.avgZ);

      projectedFaces.forEach(face => {
        ctx.beginPath();
        ctx.moveTo(face.faceNodes[0].x, face.faceNodes[0].y);
        for (let i = 1; i < face.faceNodes.length; i++) {
          ctx.lineTo(face.faceNodes[i].x, face.faceNodes[i].y);
        }
        ctx.closePath();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(34, 211, 238, 0.8)';
        ctx.lineWidth = 2;
        ctx.lineJoin = 'round';
        ctx.shadowBlur = 15;
        ctx.shadowColor = 'rgba(34, 211, 238, 0.6)';
        ctx.stroke();
        ctx.shadowBlur = 0; // Reset for next face
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return <canvas ref={canvasRef} width={200} height={200} />;
});

const SvgFrame = React.memo(({ children, className = "", active = false }: { children: React.ReactNode, className?: string, active?: boolean }) => (
  <div className={`relative p-6 border border-white/20 ${active ? 'bg-white/5' : ''} ${className}`}>
    <img src={cornerTl} alt="" className="absolute top-0 left-0 w-4 h-4" />
    <img src={cornerTr} alt="" className="absolute top-0 right-0 w-4 h-4" />
    <img src={cornerBl} alt="" className="absolute bottom-0 left-0 w-4 h-4" />
    <img src={cornerBr} alt="" className="absolute bottom-0 right-0 w-4 h-4" />
    <div className="relative z-10 h-full flex flex-col">{children}</div>
  </div>
));

const PhaseModal = ({ phase, onClose }: { phase: Phase, onClose: () => void }) => {
  const { t } = useContext(LanguageContext);
  return (
    <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4 sm:p-8 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-3xl max-h-[90vh] bg-black border border-white/30 flex flex-col shadow-[0_0_50px_rgba(0,150,255,0.1)] relative"
      >
        <img src={cornerTl} alt="" className="absolute top-0 left-0 w-4 h-4 pointer-events-none" />
        <img src={cornerTr} alt="" className="absolute top-0 right-0 w-4 h-4 pointer-events-none" />
        <img src={cornerBl} alt="" className="absolute bottom-0 left-0 w-4 h-4 pointer-events-none" />
        <img src={cornerBr} alt="" className="absolute bottom-0 right-0 w-4 h-4 pointer-events-none" />

        <div className="flex justify-between items-center p-6 border-b border-white/20 bg-white/5">
          <div>
            <div className="text-[10px] text-cyan-500 tracking-[0.2em] mb-1">RECORD_ID // {phase.id}</div>
            <h2 className="text-2xl tracking-[0.2em] text-white">DOSSIER :: {phase.title}</h2>
          </div>
          <button aria-label="Close details" onClick={onClose} className="text-white/60 hover:text-white transition-colors">
            <span className="text-xs tracking-widest">{t.ui.close}</span>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 font-mono">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border border-white/10 bg-white/5 p-4 gap-4">
            <div>
              <div className="text-[10px] text-white/50 tracking-widest mb-1">DESIGNATION</div>
              <div className="text-sm text-cyan-400 tracking-widest">{phase.role}</div>
            </div>
            <div className="sm:text-right">
              <div className="text-[10px] text-white/50 tracking-widest mb-1">TIME_PERIOD</div>
              <div className="text-sm text-white/90 tracking-widest">{phase.period}</div>
            </div>
          </div>
          
          <div className="space-y-4">
             <div className="text-[10px] text-cyan-500 tracking-[0.2em] uppercase border-b border-white/10 pb-2">EXECUTIVE_SUMMARY</div>
             <p className="text-[clamp(0.8rem,1.5vw,1rem)] text-white/80 leading-relaxed border-l-2 border-white/20 pl-4">{phase.desc}</p>
          </div>

          <div className="space-y-4">
            <div className="text-[10px] text-cyan-500 tracking-[0.2em] uppercase border-b border-white/10 pb-2">DECRYPTED_DETAILS</div>
            <ul className="space-y-3 mt-4">
              {phase.details.map((detail: string, idx: number) => {
                const isHeader = detail.includes(':') && detail.split(':')[0].length < 20;
                if (isHeader) {
                  const parts = detail.split(':');
                  return (
                    <li key={idx} className="mt-6">
                      <span className="block text-white/90 font-bold mb-2 tracking-wide uppercase text-sm border-l-2 border-cyan-500 pl-3">
                        {parts[0]}
                      </span>
                      {parts[1] && parts[1].trim() && (
                        <span className="block text-white/60 text-sm leading-relaxed pl-4">{parts[1].trim()}</span>
                      )}
                    </li>
                  )
                }
                return (
                  <li key={idx} className="text-white/60 text-sm leading-relaxed pl-4 flex gap-2">
                    {detail.startsWith('-') ? null : <span className="text-cyan-500/50">{'>'}</span>}
                    <span>{detail.startsWith('-') ? detail.substring(1).trim() : detail}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="p-4 border-t border-white/20 bg-white/5 text-xs text-white/30 flex justify-between tracking-widest">
           <span>DB_STATUS: CONNECTED</span>
           <span>SECURE_LINK_ACTIVE</span>
        </div>
      </motion.div>
    </div>
  );
};

// --- MAIN APP ---

function AppContent() {
  const { t, lang } = useContext(LanguageContext);
  // States: 'idle', 'verified', 'entering', 'system'
  const [systemState, setSystemState] = useState<'idle' | 'verified' | 'entering' | 'system'>('idle');
  const [progress, setProgress] = useState(0);
  const [selectedPhaseId, setSelectedPhaseId] = useState<string | null>(null);
  const selectedPhase = t.phases.find(p => p.id === selectedPhaseId) || null;

  const handleLogin = () => {
    setSystemState('verified');
  };

  useEffect(() => {
    if (systemState === 'verified') {
      let p = 0;
      const interval = setInterval(() => {
        p += 2;
        setProgress(p);
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setSystemState('entering');
            setTimeout(() => setSystemState('system'), 3000);
          }, 500);
        }
      }, 50);
      return () => clearInterval(interval);
    }
  }, [systemState]);

  return (
    <div className="min-h-screen bg-transparent text-white font-mono relative overflow-hidden">
      <NetworkBackground faded={systemState === 'system' || systemState === 'entering'} />
      
      {/* Persistent Overlay Elements */}
      <AnimatePresence>
        {(systemState === 'idle' || systemState === 'verified') && (
          <motion.div
            key="hud"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 pointer-events-none z-50"
          >
            <Clock />
            <NodeInfo />
            <TerminalLogs />
            <RightBarcode />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute inset-0 flex items-center justify-center z-40">
        <AnimatePresence mode="wait">
          
          {/* STATE: AUTH FLOW (IDLE & VERIFIED) */}
          {(systemState === 'idle' || systemState === 'verified') ? (
            <motion.div 
              key="auth-flow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="flex flex-col items-center"
            >
              {/* Title Area */}
              <div className="h-16 flex items-end justify-center mb-8">
                <AnimatePresence>
                  {systemState === 'verified' && (
                    <motion.h2 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-2xl tracking-[0.3em]"
                    >
                      {t.ui.identityVerified}
                    </motion.h2>
                  )}
                </AnimatePresence>
              </div>

              {/* Main Panel (Logo -> ID Card) */}
              <motion.div 
                layout
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className={`relative overflow-hidden border ${systemState === 'idle' ? 'w-[180px] h-[60px] border-transparent mb-8' : 'w-[90vw] max-w-[500px] min-h-[220px] border-white/20 bg-black/50 backdrop-blur-sm mb-8'}`}
              >
                <AnimatePresence>
                  {systemState === 'idle' ? (
                    <motion.div 
                      key="logo"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <MbLogo />
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="card"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4, delay: 0.3 }}
                      className="absolute inset-0 p-5 sm:p-8 flex items-center gap-5 sm:gap-8"
                    >
                      <img src={cornerTl} alt="" className="absolute top-0 left-0 w-4 h-4" />
                      <img src={cornerTr} alt="" className="absolute top-0 right-0 w-4 h-4" />
                      <img src={cornerBl} alt="" className="absolute bottom-0 left-0 w-4 h-4" />
                      <img src={cornerBr} alt="" className="absolute bottom-0 right-0 w-4 h-4" />
                      
                      <div className="flex-1 flex flex-col justify-between h-full relative z-10">
                        <div className="flex justify-between border-b border-white/20 pb-3">
                          <div>
                            <div className="text-[8px] sm:text-[10px] text-white/40 tracking-widest mb-1">{t.ui.deptId}</div>
                            <div className="text-sm sm:text-base font-bold tracking-widest">XYZ-843</div>
                          </div>
                          <div className="text-right">
                            <div className="text-[8px] sm:text-[10px] text-white/40 tracking-widest mb-1">{t.ui.class}</div>
                            <div className="text-sm sm:text-base font-bold tracking-widest text-cyan-400">L5_PROV</div>
                          </div>
                        </div>
                        
                        <div className="my-auto">
                          <div className="text-[8px] sm:text-[10px] text-white/40 tracking-widest mb-1">{t.ui.fullName}</div>
                          <div className="text-xl sm:text-2xl tracking-[0.2em] leading-none uppercase">MOURTADA.B</div>
                        </div>

                        <div className="pt-3 border-t border-white/20 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 border border-white/20 flex flex-col justify-between p-1.5">
                              <div className="h-[2px] bg-white/80 w-full"></div>
                              <div className="h-[2px] bg-white/80 w-3/4"></div>
                              <div className="h-[2px] bg-white/80 w-1/2"></div>
                              <div className="h-[2px] bg-white/80 w-full"></div>
                            </div>
                            <div className="text-[8px] sm:text-[10px] tracking-widest text-white/60 font-mono">
                              7524129823004A
                            </div>
                          </div>
                          <span className="inline-block w-1.5 h-1.5 sm:w-2 sm:h-2 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)]"></span>
                        </div>
                      </div>
                      
                      <div className="w-24 h-32 sm:w-32 sm:h-40 shrink-0 border border-white/20 bg-black flex items-center justify-center relative z-10 overflow-hidden group">
                        <User className="text-white/20 w-12 h-12 sm:w-16 sm:h-16 absolute z-0" />
                        <img 
                          src="/profile.png" 
                          alt="Profile" 
                          className="absolute inset-0 w-full h-full object-cover filter grayscale contrast-[1.4] brightness-75 mix-blend-luminosity opacity-90 group-hover:opacity-100 group-hover:contrast-[1.6] transition-all duration-500 z-10"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                        
                        {/* Hacker Aesthetic Overlays */}
                        <div className="absolute inset-0 bg-[url('/src/assets/scanline-overlay.svg')] opacity-50 mix-blend-overlay pointer-events-none z-20"></div>
                        <div className="absolute inset-0 bg-cyan-500/10 mix-blend-color pointer-events-none z-20"></div>
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-b from-transparent via-white/10 to-transparent animate-scan z-20"></div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Action Panel (Login Button -> Loading Bar) */}
              <motion.div 
                layout
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className={`relative ${systemState === 'idle' ? 'w-64 sm:w-80 h-14 border border-white/30 p-1' : 'w-[90vw] max-w-[500px] h-4'}`}
              >
                <AnimatePresence>
                  {systemState === 'idle' ? (
                    <motion.div 
                      key="login-btn"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0"
                    >
                      <div className="absolute -top-3 left-2 bg-black px-1 text-[10px] text-white/60">NetPath::SYSTEM</div>
                      <div className="h-full flex items-center justify-center p-1">
                        <button 
                          onClick={handleLogin}
                          className="w-full h-full bg-white text-black font-bold hover:bg-white/80 transition-colors"
                        >
                          {t.ui.login}
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="loading-bar"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4, delay: 0.3 }}
                      className="absolute inset-0 flex gap-1"
                    >
                      {[...Array(20)].map((_, i) => (
                        <div 
                          key={i} 
                          className={`h-full flex-1 ${i < (progress / 5) ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]' : 'bg-white/10'}`}
                        />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Footer Text */}
              <div className="h-16 flex items-start mt-12">
                <AnimatePresence>
                  {systemState === 'idle' && (
                    <motion.div 
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-start gap-4 text-[10px] text-white/40 max-w-xs"
                    >
                      <div className="w-4 h-4 border border-white/40 flex-shrink-0 mt-0.5"></div>
                      <p>{t.ui.footerText}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ) : systemState === 'entering' ? (
            <motion.div 
              key="entering"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center"
            >
              <h2 className="text-2xl tracking-[0.3em] mb-16">{t.ui.enteringSystem}</h2>
              <SystemLoaderCube />
            </motion.div>
          ) : systemState === 'system' ? (
            <motion.div 
              key="system"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 overflow-y-auto pt-20 pb-20 px-6 md:pt-32 md:px-16 z-30"
            >
              <div className="max-w-7xl mx-auto space-y-24 md:space-y-32">
                
                {/* HEADER */}
                <header className="border-b border-white/20 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                  <div className="w-full">
                    <div className="flex justify-between items-start w-full">
                      <div>
                        <h1 className="text-[clamp(2.5rem,8vw,4rem)] tracking-tighter mb-2 leading-none">
                          MOURTADA.B
                        </h1>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                          <p className="text-white/50 tracking-widest text-[clamp(0.75rem,2vw,1rem)]">{t.ui.systemArchitect} // L5_PROV</p>
                        </div>
                      </div>
                      <div className="w-16 md:w-24 hidden sm:block">
                        <MbLogo />
                      </div>
                    </div>
                    
                    {/* CONTACTS & CV */}
                    <div className="flex flex-wrap items-center gap-3 mt-8">
                      <a href="https://github.com/mourtadab" target="_blank" rel="noreferrer" className="border border-white/20 bg-black/50 hover:border-cyan-500/50 hover:bg-cyan-500/10 text-white/60 hover:text-cyan-400 transition-all px-3 py-2 flex items-center gap-2">
                        <Github size={16} />
                        <span className="text-[10px] tracking-widest hidden sm:block">{t.ui.github}</span>
                      </a>
                      <a href="https://linkedin.com/in/mourtadab" target="_blank" rel="noreferrer" className="border border-white/20 bg-black/50 hover:border-cyan-500/50 hover:bg-cyan-500/10 text-white/60 hover:text-cyan-400 transition-all px-3 py-2 flex items-center gap-2">
                        <Linkedin size={16} />
                        <span className="text-[10px] tracking-widest hidden sm:block">{t.ui.linkedin}</span>
                      </a>
                      <a href="mailto:mourtada.bou.98@gmail.com" className="border border-white/20 bg-black/50 hover:border-cyan-500/50 hover:bg-cyan-500/10 text-white/60 hover:text-cyan-400 transition-all px-3 py-2 flex items-center gap-2">
                        <Mail size={16} />
                        <span className="text-[10px] tracking-widest hidden sm:block">{t.ui.email}</span>
                      </a>
                      
                      <button 
                        onClick={async (e) => {
                          e.preventDefault();
                          try {
                            const url = lang === 'fr' ? '/cv-fr.pdf' : '/cv-en.pdf';
                            const response = await fetch(url);
                            const blob = await response.blob();
                            const blobUrl = window.URL.createObjectURL(blob);
                            const link = document.createElement('a');
                            link.href = blobUrl;
                            link.download = lang === 'fr' ? 'cv-fr.pdf' : 'cv-en.pdf';
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            window.URL.revokeObjectURL(blobUrl);
                          } catch (err) {
                            console.error("Download failed", err);
                          }
                        }}
                        className="border border-cyan-500/30 bg-cyan-500/10 hover:border-cyan-400 hover:bg-cyan-400/20 text-cyan-400 transition-all px-4 py-2 flex items-center gap-2 ml-auto sm:ml-4 cursor-pointer"
                      >
                        <FileDown size={16} />
                        <span className="text-[10px] tracking-widest">{t.ui.downloadCv}</span>
                      </button>
                    </div>
                  </div>
                </header>

                {/* DOSSIER */}
                <section>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-2 h-2 bg-white"></div>
                    <h2 className="text-[clamp(1.25rem,3vw,1.5rem)] tracking-widest">{t.ui.dossierRecords}</h2>
                    <div className="flex-1 h-px bg-white/20"></div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                    {t.phases.map((phase, i) => (
                      <div key={i} onClick={() => phase.details && setSelectedPhaseId(phase.id)} className={phase.details ? "cursor-pointer" : ""}>
                        <SvgFrame className={`group transition-colors h-full flex flex-col ${phase.details ? 'hover:border-cyan-500 hover:shadow-[0_0_15px_rgba(34,211,238,0.2)]' : 'hover:border-white/50'}`}>
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                            <h3 className={`text-[clamp(1.125rem,2.5vw,1.25rem)] tracking-widest transition-colors ${phase.details ? 'group-hover:text-cyan-400 text-white/90' : 'group-hover:text-white text-white/80'}`}>{phase.title}</h3>
                            <span className="text-[clamp(0.6rem,1.5vw,0.625rem)] bg-white text-black px-2 py-1 whitespace-nowrap">{phase.period}</span>
                          </div>
                          <div className="text-[clamp(0.7rem,1.5vw,0.75rem)] text-white/40 mb-4">{phase.role}</div>
                          <p className="text-[clamp(0.8rem,2vw,0.875rem)] text-white/60 leading-relaxed flex-1">
                            {phase.desc}
                          </p>
                          {phase.details && (
                            <div className="mt-4 text-cyan-400/70 text-xs tracking-widest group-hover:text-cyan-400 transition-colors">
                              {t.ui.viewDetails}
                            </div>
                          )}
                        </SvgFrame>
                      </div>
                    ))}
                  </div>
                </section>

                {/* BREACHES */}
                <section>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-2 h-2 bg-white"></div>
                    <h2 className="text-[clamp(1.25rem,3vw,1.5rem)] tracking-widest">{t.ui.systemBreaches}</h2>
                    <div className="flex-1 h-px bg-white/20"></div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {t.projects.map((p, i) => {
                      const Icon = p.icon;
                      return (
                      <div key={i} className="relative h-[380px] sm:h-[340px] lg:h-[320px] w-full group [perspective:2000px] [transform-style:preserve-3d]">
                        {/* Folder Back (Inside) */}
                        <div className="absolute inset-0">
                          {/* Tab */}
                          <div className="absolute top-0 left-0 w-[130px] h-10 border-t border-l border-r border-white/30 bg-[#050505] rounded-t-xl flex items-center px-4 z-10">
                            <span className="text-[10px] text-white/80 tracking-widest font-bold">DIR // {p.id}</span>
                          </div>
                          {/* Back Content Area */}
                          <div className="absolute top-10 bottom-0 left-0 right-0 border border-white/30 bg-[#050505] p-6 flex flex-col items-center justify-center overflow-hidden rounded-b-xl rounded-tr-xl">
                             {/* Hide border under tab */}
                             <div className="absolute top-[-1px] left-0 w-[128px] h-[2px] bg-[#050505] z-20"></div>
                          </div>
                        </div>

                        {/* Blue Halo Light Emanating from Inside */}
                        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-4/5 h-16 bg-cyan-400/0 group-hover:bg-cyan-400/50 blur-[30px] rounded-[100%] transition-all duration-700 ease-out group-hover:-translate-y-6 pointer-events-none z-10"></div>

                        {/* Folder Front Cover */}
                        <div className="absolute top-10 bottom-0 left-0 right-0 origin-bottom transition-all duration-500 ease-out group-hover:[transform:rotateX(-15deg)] bg-[#0a0a0a] border border-white/30 p-6 flex flex-col z-20 shadow-[0_-5px_20px_rgba(0,0,0,0.6)] group-hover:border-cyan-500/50 rounded-xl group-hover:shadow-[0_-15px_40px_rgba(34,211,238,0.2)]">
                          {/* Inner top lip for 3D paper effect */}
                          <div className="absolute top-0 left-0 right-0 h-1 bg-white/10 rounded-t-xl"></div>
                          
                          <div className="flex items-center gap-4 mb-4 sm:mb-6 relative z-10 shrink-0">
                            <Icon size={24} className="text-white/60 group-hover:text-cyan-400 transition-colors shrink-0" />
                            <h3 className="text-[clamp(1rem,2vw,1.125rem)] tracking-widest group-hover:text-cyan-400 transition-colors">{p.title}</h3>
                          </div>
                          <div className="flex-1 relative z-10 overflow-y-auto pr-2 mb-6">
                            <p className="text-[clamp(0.8rem,1.8vw,0.875rem)] text-white/50 leading-relaxed">
                              {p.desc}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2 relative z-10 shrink-0">
                            {p.tags.map(t => (
                              <span key={t} className="text-[clamp(0.55rem,1.2vw,0.625rem)] border border-white/20 bg-black/50 px-2 py-1 text-white/60 rounded-md whitespace-nowrap">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )})}
                  </div>
                </section>

                {/* ARSENAL */}
                <section>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-2 h-2 bg-white"></div>
                    <h2 className="text-[clamp(1.25rem,3vw,1.5rem)] tracking-widest">{t.ui.technicalArsenal}</h2>
                    <div className="flex-1 h-px bg-white/20"></div>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
                    {[
                      {n: 'C/C++', i: Cpu}, {n: 'DOCKER', i: Server}, 
                      {n: 'RUST', i: Zap}, {n: 'BASH', i: TerminalIcon}, 
                      {n: 'REACT', i: Box}, {n: 'POSTGRES', i: Database}, 
                      {n: 'GO', i: Wifi}, {n: 'ASM', i: Activity}
                    ].map((skill, i) => {
                      const Icon = skill.i;
                      return (
                      <div key={i} className="border border-white/10 p-4 md:p-6 flex flex-col items-center justify-center gap-3 md:gap-4 hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all duration-300 h-full group">
                        <div className="text-white/40 shrink-0 group-hover:text-cyan-400 transition-colors duration-300 group-hover:scale-110 transform">
                          <Icon size={24} />
                        </div>
                        <span className="text-[clamp(0.6rem,1.5vw,0.75rem)] tracking-widest text-white/60 text-center group-hover:text-cyan-100 transition-colors duration-300">{skill.n}</span>
                      </div>
                    )})}
                  </div>
                </section>

              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* PHASE DETAILS MODAL */}
        <AnimatePresence>
          {selectedPhase && selectedPhase.details && (
            <PhaseModal phase={selectedPhase} onClose={() => setSelectedPhaseId(null)} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function App() {
  const [lang, setLang] = useState<Language>('en');

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: TRANSLATIONS[lang] }}>
      <LanguageSwitcher />
      <AppContent />
    </LanguageContext.Provider>
  );
}
