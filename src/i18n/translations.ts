import { Terminal as TerminalIcon, Server, Box, Shield, Zap, Database, Wifi, Activity } from 'lucide-react';

export const TRANSLATIONS = {
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
      digitalArchitect: "DIGITAL ARCHITECT",
      dossierRecords: "DOSSIER_RECORDS",
      systemBreaches: "SYSTEM_BREACHES",
      technicalArsenal: "TECHNICAL_ARSENAL",
      footerText: "Property of Mourtada. All usage is subject to Central Active Monitoring.",
      downloadCv: "[DOWNLOAD_CV]",
      github: "GITHUB",
      linkedin: "LINKEDIN",
      aboutMePart1: "I am a passionate software engineer and ",
      aboutMePart2: " with a background in automation at IFMIA, currently studying at ",
      aboutMePart3: " coding school. I have a deep interest in low-level programming, distributed systems, and creating robust, scalable applications. I thrive in challenging environments, constantly pushing the boundaries of what's possible with code."
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
      digitalArchitect: "ARCHITECTE NUMÉRIQUE",
      dossierRecords: "DOSSIERS_ENREGISTREMENTS",
      systemBreaches: "BRÈCHES_SYSTÈME",
      technicalArsenal: "ARSENAL_TECHNIQUE",
      footerText: "Propriété de Mourtada. Toute utilisation est soumise à la Surveillance Active Centrale.",
      downloadCv: "[TÉLÉCHARGER_CV]",
      github: "GITHUB",
      linkedin: "LINKEDIN",
      aboutMePart1: "Je suis un ingénieur logiciel et ",
      aboutMePart2: " passionné avec une formation en automatisation à l'IFMIA, étudiant actuellement à l'école de programmation ",
      aboutMePart3: ". J'ai un profond intérêt pour la programmation bas niveau, les systèmes distribués et la création d'applications robustes et évolutives. Je m'épanouis dans des environnements stimulants, repoussant constamment les limites de ce qui est possible avec le code."
    }
  }
};
