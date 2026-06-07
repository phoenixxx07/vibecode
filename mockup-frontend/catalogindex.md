<!DOCTYPE html>

<html class="dark" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Catalog Index - Vibe Dir</title>
<link href="https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script id="tailwind-config">
  tailwind.config = {
    darkMode: "class",
    theme: {
      extend: {
        colors: {
          "primary": "#13ec49",
          "background-light": "#f6f8f6",
          "background-dark": "#050505",
          "surface": "#111111",
          "text-main": "#E4E4E7",
          "muted": "#52525B",
          "accent": "#FFB000",
        },
        fontFamily: {
          "display": ["Space Mono", "monospace"],
          "sans": ["Space Mono", "monospace"],
          "mono": ["Space Mono", "monospace"]
        },
        borderRadius: {"DEFAULT": "0px", "sm": "0px", "lg": "0px", "xl": "0px", "full": "0px"},
        boxShadow: {
          'neon': '0 0 8px #13ec49',
        }
      },
    },
  }
</script>
<style>
  body {
    background-color: theme('colors.background-dark');
    color: theme('colors.text-main');
    font-family: theme('fontFamily.mono');
  }
  
  .terminal-scrollbar::-webkit-scrollbar {
    width: 8px;
  }
  .terminal-scrollbar::-webkit-scrollbar-track {
    background: theme('colors.background-dark');
    border-left: 1px solid theme('colors.muted');
  }
  .terminal-scrollbar::-webkit-scrollbar-thumb {
    background: theme('colors.muted');
  }
  .terminal-scrollbar::-webkit-scrollbar-thumb:hover {
    background: theme('colors.primary');
  }

  .crt-glow:hover {
    box-shadow: 0 0 8px theme('colors.primary');
    border-color: theme('colors.primary');
    cursor: crosshair;
  }

  .blinking-cursor::after {
    content: '_';
    animation: blink 1s step-end infinite;
  }
  
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }

  input[type="text"]:focus {
    outline: none;
    box-shadow: none;
    border-color: theme('colors.primary');
  }
</style>
</head>
<body class="h-screen w-full overflow-hidden flex selection:bg-primary selection:text-background-dark">
<!-- Sidebar -->
<aside class="w-[250px] h-full flex flex-col bg-surface border-r border-muted shrink-0 z-10 relative">
<div class="p-4 border-b border-muted">
<h1 class="text-primary text-xl font-bold uppercase tracking-wider">&gt; VIBE_DIR</h1>
<p class="text-muted text-xs mt-1 uppercase">v1.0.4-stable</p>
</div>
<div class="p-4 flex-1 overflow-y-auto terminal-scrollbar flex flex-col gap-6">
<div class="flex flex-col gap-2">
<h2 class="text-muted text-sm uppercase mb-2">Filters //</h2>
<button class="flex items-center gap-3 px-2 py-1.5 text-left text-primary bg-primary/10 border border-primary group">
<span class="text-sm font-bold w-6">[X]</span>
<span class="text-sm font-medium uppercase group-hover:text-primary transition-colors">AI_AGENTS</span>
</button>
<button class="flex items-center gap-3 px-2 py-1.5 text-left text-text-main border border-transparent hover:border-muted group">
<span class="text-muted text-sm font-bold w-6 group-hover:text-text-main transition-colors">[ ]</span>
<span class="text-sm font-medium uppercase group-hover:text-primary transition-colors">TERMINAL_UI</span>
</button>
<button class="flex items-center gap-3 px-2 py-1.5 text-left text-text-main border border-transparent hover:border-muted group">
<span class="text-muted text-sm font-bold w-6 group-hover:text-text-main transition-colors">[ ]</span>
<span class="text-sm font-medium uppercase group-hover:text-primary transition-colors">BUILD_TOOLS</span>
</button>
<button class="flex items-center gap-3 px-2 py-1.5 text-left text-text-main border border-transparent hover:border-muted group">
<span class="text-muted text-sm font-bold w-6 group-hover:text-text-main transition-colors">[ ]</span>
<span class="text-sm font-medium uppercase group-hover:text-primary transition-colors">DOC_PROC</span>
</button>
<button class="flex items-center gap-3 px-2 py-1.5 text-left text-text-main border border-transparent hover:border-muted group">
<span class="text-muted text-sm font-bold w-6 group-hover:text-text-main transition-colors">[ ]</span>
<span class="text-sm font-medium uppercase group-hover:text-primary transition-colors">FRAMEWORKS</span>
</button>
</div>
<div class="mt-auto">
<button class="w-full flex items-center justify-center h-10 border border-primary bg-primary text-background-dark text-sm font-bold uppercase hover:bg-background-dark hover:text-primary transition-colors focus:outline-none">
          &gt; APPEND_DB
        </button>
</div>
</div>
</aside>
<!-- Main Content -->
<main class="flex-1 h-full flex flex-col bg-background-dark relative overflow-hidden">
<!-- Header / Search -->
<header class="h-16 shrink-0 border-b border-muted bg-background-dark flex items-center px-6 relative z-10">
<div class="flex items-center w-full max-w-4xl h-12 border border-muted focus-within:border-primary focus-within:shadow-neon transition-all bg-surface">
<span class="text-primary font-bold px-4">&gt;</span>
<input class="w-full h-full bg-transparent border-none text-text-main placeholder-muted focus:ring-0 text-sm uppercase blinking-cursor" placeholder="SEARCH_INDEX..." type="text" value="AGENT_SWARM"/>
<button class="px-4 text-muted hover:text-primary h-full flex items-center justify-center transition-colors">
<span class="material-symbols-outlined" style="font-size: 20px;">close</span>
</button>
</div>
<div class="ml-auto text-muted text-xs uppercase flex items-center gap-2">
<span>MATCHES: <span class="text-primary">24</span></span>
<span class="w-2 h-4 bg-primary inline-block animate-pulse"></span>
</div>
</header>
<!-- Grid Area -->
<div class="flex-1 overflow-y-auto terminal-scrollbar p-6 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-surface/20 via-background-dark to-background-dark">
<!-- Content Grid -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-max">
<!-- Card 1 -->
<article class="bg-surface border border-muted p-4 flex flex-col gap-3 crt-glow transition-all duration-150 relative overflow-hidden group">
<div class="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
<span class="material-symbols-outlined text-primary" style="font-size: 16px;">open_in_new</span>
</div>
<h3 class="text-text-main text-base font-bold uppercase truncate pr-6 group-hover:text-primary transition-colors">SwarmCLI</h3>
<p class="text-muted text-xs leading-relaxed h-10 overflow-hidden line-clamp-2">Multi-agent orchestration via direct TTY streams. Bypasses standard I/O for direct DOM manipulation.</p>
<div class="flex flex-wrap gap-2 mt-auto pt-2">
<span class="text-[10px] text-primary border border-dashed border-primary/50 px-1.5 py-0.5 uppercase tracking-wide">AI_AGENTS</span>
<span class="text-[10px] text-muted border border-dashed border-muted px-1.5 py-0.5 uppercase tracking-wide">CLI</span>
</div>
<div class="pt-3 mt-1 border-t border-muted/30 flex justify-between items-center">
<span class="text-[10px] text-muted">SYS_UP: 99.9%</span>
<button class="text-xs text-text-main hover:text-primary uppercase font-bold tracking-wider">[INSPECT]</button>
</div>
</article>
<!-- Card 2 -->
<article class="bg-surface border border-muted p-4 flex flex-col gap-3 crt-glow transition-all duration-150 relative overflow-hidden group">
<h3 class="text-text-main text-base font-bold uppercase truncate pr-6 group-hover:text-primary transition-colors">NeuralDB_Lite</h3>
<p class="text-muted text-xs leading-relaxed h-10 overflow-hidden line-clamp-2">In-memory vector store optimized for constrained environments. Uses hyper-dimensional computing.</p>
<div class="flex flex-wrap gap-2 mt-auto pt-2">
<span class="text-[10px] text-primary border border-dashed border-primary/50 px-1.5 py-0.5 uppercase tracking-wide">AI_AGENTS</span>
<span class="text-[10px] text-muted border border-dashed border-muted px-1.5 py-0.5 uppercase tracking-wide">DB</span>
</div>
<div class="pt-3 mt-1 border-t border-muted/30 flex justify-between items-center">
<span class="text-[10px] text-muted">LATENCY: 4ms</span>
<button class="text-xs text-text-main hover:text-primary uppercase font-bold tracking-wider">[INSPECT]</button>
</div>
</article>
<!-- Card 3 -->
<article class="bg-surface border border-muted p-4 flex flex-col gap-3 crt-glow transition-all duration-150 relative overflow-hidden group">
<h3 class="text-text-main text-base font-bold uppercase truncate pr-6 group-hover:text-primary transition-colors">GhostWriter</h3>
<p class="text-muted text-xs leading-relaxed h-10 overflow-hidden line-clamp-2">Autonomous PR generation based on git diffs and commit histories. Self-healing markdown.</p>
<div class="flex flex-wrap gap-2 mt-auto pt-2">
<span class="text-[10px] text-primary border border-dashed border-primary/50 px-1.5 py-0.5 uppercase tracking-wide">AI_AGENTS</span>
<span class="text-[10px] text-muted border border-dashed border-muted px-1.5 py-0.5 uppercase tracking-wide">GIT</span>
</div>
<div class="pt-3 mt-1 border-t border-muted/30 flex justify-between items-center">
<span class="text-[10px] text-muted">AUTO_MERGE: ON</span>
<button class="text-xs text-text-main hover:text-primary uppercase font-bold tracking-wider">[INSPECT]</button>
</div>
</article>
<!-- Card 4 -->
<article class="bg-surface border border-muted p-4 flex flex-col gap-3 crt-glow transition-all duration-150 relative overflow-hidden group">
<h3 class="text-text-main text-base font-bold uppercase truncate pr-6 group-hover:text-primary transition-colors">TermUX_Gen</h3>
<p class="text-muted text-xs leading-relaxed h-10 overflow-hidden line-clamp-2">Generative terminal interfaces. Speaks raw ANSI escape codes. No DOM required.</p>
<div class="flex flex-wrap gap-2 mt-auto pt-2">
<span class="text-[10px] text-primary border border-dashed border-primary/50 px-1.5 py-0.5 uppercase tracking-wide">TERMINAL_UI</span>
<span class="text-[10px] text-muted border border-dashed border-muted px-1.5 py-0.5 uppercase tracking-wide">GEN</span>
</div>
<div class="pt-3 mt-1 border-t border-muted/30 flex justify-between items-center">
<span class="text-[10px] text-muted">FRAME_RATE: 60fps</span>
<button class="text-xs text-text-main hover:text-primary uppercase font-bold tracking-wider">[INSPECT]</button>
</div>
</article>
<!-- Card 5 -->
<article class="bg-surface border border-muted p-4 flex flex-col gap-3 crt-glow transition-all duration-150 relative overflow-hidden group">
<h3 class="text-text-main text-base font-bold uppercase truncate pr-6 group-hover:text-primary transition-colors">Void_Scanner</h3>
<p class="text-muted text-xs leading-relaxed h-10 overflow-hidden line-clamp-2">Deep network packet inspection using LLMs to detect anomaly vibes. High false positive rate, high entertainment value.</p>
<div class="flex flex-wrap gap-2 mt-auto pt-2">
<span class="text-[10px] text-primary border border-dashed border-primary/50 px-1.5 py-0.5 uppercase tracking-wide">AI_AGENTS</span>
<span class="text-[10px] text-muted border border-dashed border-muted px-1.5 py-0.5 uppercase tracking-wide">SEC</span>
</div>
<div class="pt-3 mt-1 border-t border-muted/30 flex justify-between items-center">
<span class="text-[10px] text-accent">STATUS: WARN</span>
<button class="text-xs text-text-main hover:text-primary uppercase font-bold tracking-wider">[INSPECT]</button>
</div>
</article>
</div>
<!-- End of List Indicator -->
<div class="w-full text-center mt-12 mb-8 text-muted text-xs uppercase flex items-center justify-center gap-4">
<span class="w-12 h-px bg-muted/50"></span>
        EOF
        <span class="w-12 h-px bg-muted/50"></span>
</div>
</div>
</main>
</body></html>