<!DOCTYPE html>

<html class="dark" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Dynamic Stream - Category Matrix</title>
<link href="https://fonts.googleapis.com" rel="preconnect"/>
<link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&amp;family=Space+Grotesk:wght@400;500;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script id="tailwind-config">
  tailwind.config = {
    darkMode: "class",
    theme: {
      extend: {
        colors: {
          "primary": "#06f9a8",
          "background-light": "#f5f8f7",
          "background-dark": "#0A001A",
          "surface": "rgba(255, 255, 255, 0.05)",
          "surface-hover": "rgba(255, 255, 255, 0.1)",
          "text-main": "#F4F4F5",
          "text-muted": "#A1A1AA",
          "accent-games": "#39FF14"
        },
        fontFamily: {
          "display": ["Outfit", "sans-serif"],
          "body": ["Space Grotesk", "sans-serif"]
        },
        borderRadius: {"DEFAULT": "0.5rem", "lg": "1rem", "xl": "1.5rem", "full": "9999px"},
        backgroundImage: {
            'mesh-gradient': 'radial-gradient(at 40% 20%, hsla(280,100%,74%,0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(189,100%,56%,0.15) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(355,100%,93%,0.1) 0px, transparent 50%)',
        }
      },
    },
  }
</script>
<style>
    body {
        font-family: 'Space Grotesk', sans-serif;
        background-color: theme('colors.background-dark');
        color: theme('colors.text-main');
        overflow-x: hidden;
    }
    h1, h2, h3, h4, h5, h6, .font-display {
        font-family: 'Outfit', sans-serif;
    }
    
    .glass-panel {
        background-color: var(--color-surface, rgba(255, 255, 255, 0.05));
        backdrop-filter: blur(40px);
        -webkit-backdrop-filter: blur(40px);
        border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .glass-panel-hover:hover {
        background-color: var(--color-surface-hover, rgba(255, 255, 255, 0.1));
        border-color: rgba(255, 255, 255, 0.3);
        box-shadow: 0 24px 48px rgba(57, 255, 20, 0.1);
        transform: scale(1.02);
    }

    .hero-glow {
        text-shadow: 0 0 40px rgba(57, 255, 20, 0.6), 0 0 80px rgba(57, 255, 20, 0.3);
    }

    .card-transition {
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    /* Shared Component overrides to fit theme */
    header { background: rgba(10, 0, 26, 0.8) !important; backdrop-filter: blur(20px) !important; border-bottom: 1px solid rgba(255,255,255,0.1) !important; }
    .form-input { background: rgba(255,255,255,0.05) !important; color: white !important; }
    .form-input::placeholder { color: #A1A1AA !important; }
    label > div > div { background: rgba(255,255,255,0.05) !important; }
</style>
</head>
<body class="min-h-screen bg-mesh-gradient fixed inset-0 overflow-y-auto">
<!-- Shared TopNavBar (Modified for theme integration via CSS, structure preserved) -->
<div class="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
<div class="layout-container flex h-full grow flex-col">
<div class="px-4 md:px-10 lg:px-40 flex flex-1 justify-center py-5">
<div class="layout-content-container flex flex-col w-full max-w-[1200px] flex-1">
<header class="flex items-center justify-between whitespace-nowrap px-6 py-4 rounded-full glass-panel mb-8 sticky top-4 z-50">
<div class="flex items-center gap-8">
<div class="flex items-center gap-3 text-white">
<div class="size-6 text-primary">
<svg fill="none" viewbox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
<path d="M13.8261 30.5736C16.7203 29.8826 20.2244 29.4783 24 29.4783C27.7756 29.4783 31.2797 29.8826 34.1739 30.5736C36.9144 31.2278 39.9967 32.7669 41.3563 33.8352L24.8486 7.36089C24.4571 6.73303 23.5429 6.73303 23.1514 7.36089L6.64374 33.8352C8.00331 32.7669 11.0856 31.2278 13.8261 30.5736Z" fill="currentColor"></path>
<path clip-rule="evenodd" d="M39.998 35.764C39.9944 35.7463 39.9875 35.7155 39.9748 35.6706C39.9436 35.5601 39.8949 35.4259 39.8346 35.2825C39.8168 35.2403 39.7989 35.1993 39.7813 35.1602C38.5103 34.2887 35.9788 33.0607 33.7095 32.5189C30.9875 31.8691 27.6413 31.4783 24 31.4783C20.3587 31.4783 17.0125 31.8691 14.2905 32.5189C12.0012 33.0654 9.44505 34.3104 8.18538 35.1832C8.17384 35.2075 8.16216 35.233 8.15052 35.2592C8.09919 35.3751 8.05721 35.4886 8.02977 35.589C8.00356 35.6848 8.00039 35.7333 8.00004 35.7388C8.00004 35.739 8 35.7393 8.00004 35.7388C8.00004 35.7641 8.0104 36.0767 8.68485 36.6314C9.34546 37.1746 10.4222 37.7531 11.9291 38.2772C14.9242 39.319 19.1919 40 24 40C28.8081 40 33.0758 39.319 36.0709 38.2772C37.5778 37.7531 38.6545 37.1746 39.3151 36.6314C39.9006 36.1499 39.9857 35.8511 39.998 35.764ZM4.95178 32.7688L21.4543 6.30267C22.6288 4.4191 25.3712 4.41909 26.5457 6.30267L43.0534 32.777C43.0709 32.8052 43.0878 32.8338 43.104 32.8629L41.3563 33.8352C43.104 32.8629 43.1038 32.8626 43.104 32.8629L43.1051 32.865L43.1065 32.8675L43.1101 32.8739L43.1199 32.8918C43.1276 32.906 43.1377 32.9246 43.1497 32.9473C43.1738 32.9925 43.2062 33.0545 43.244 33.1299C43.319 33.2792 43.4196 33.489 43.5217 33.7317C43.6901 34.1321 44 34.9311 44 35.7391C44 37.4427 43.003 38.7775 41.8558 39.7209C40.6947 40.6757 39.1354 41.4464 37.385 42.0552C33.8654 43.2794 29.133 44 24 44C18.867 44 14.1346 43.2794 10.615 42.0552C8.86463 41.4464 7.30529 40.6757 6.14419 39.7209C4.99695 38.7775 3.99999 37.4427 3.99999 35.7391C3.99999 34.8725 4.29264 34.0922 4.49321 33.6393C4.60375 33.3898 4.71348 33.1804 4.79687 33.0311C4.83898 32.9556 4.87547 32.8935 4.9035 32.8471C4.91754 32.8238 4.92954 32.8043 4.93916 32.7889L4.94662 32.777L4.95178 32.7688ZM35.9868 29.004L24 9.77997L12.0131 29.004C12.4661 28.8609 12.9179 28.7342 13.3617 28.6282C16.4281 27.8961 20.0901 27.4783 24 27.4783C27.9099 27.4783 31.5719 27.8961 34.6383 28.6282C35.082 28.7342 35.5339 28.8609 35.9868 29.004Z" fill="currentColor" fill-rule="evenodd"></path>
</svg>
</div>
<h2 class="text-white text-xl font-bold font-display tracking-tight">Dynamic Stream</h2>
</div>
<div class="hidden md:flex items-center gap-9">
<a class="text-white text-sm font-medium hover:text-primary transition-colors" href="#">Feed</a>
<a class="text-white text-sm font-medium hover:text-primary transition-colors" href="#">Submit</a>
</div>
</div>
<div class="flex flex-1 justify-end gap-4 md:gap-8">
<label class="flex flex-col min-w-[120px] md:min-w-40 !h-10 max-w-64">
<div class="flex w-full flex-1 items-stretch rounded-full h-full border border-white/10 overflow-hidden">
<div class="text-text-muted flex border-none items-center justify-center pl-4 bg-transparent border-r-0" data-icon="search" data-size="20px" data-weight="regular">
<span class="material-symbols-outlined text-[20px]">search</span>
</div>
<input class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden text-white focus:outline-0 focus:ring-0 border-none bg-transparent focus:border-none h-full placeholder:text-text-muted px-4 rounded-l-none border-l-0 pl-2 text-sm font-normal" placeholder="Search vibes..." value=""/>
</div>
</label>
</div>
</header>
<!-- Main Content Area -->
<div class="flex flex-col flex-1 w-full relative z-10">
<!-- Category Hero -->
<div class="w-full flex items-center justify-center py-16 mb-8 border-b border-white/5">
<h1 class="text-6xl md:text-8xl font-black font-display text-transparent bg-clip-text bg-gradient-to-b from-white to-accent-games hero-glow uppercase tracking-tighter">
            Games
        </h1>
</div>
<div class="flex flex-col lg:flex-row gap-8 w-full">
<!-- Sidebar (Shared component structure adapted) -->
<aside class="w-full lg:w-[240px] flex-shrink-0">
<div class="glass-panel rounded-xl p-4 sticky top-[104px]">
<h3 class="text-xs uppercase tracking-[0.1em] text-text-muted font-bold mb-4 px-3">Filter by Tech</h3>
<div class="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 hide-scrollbar">
<button class="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-primary/10 border border-primary/30 text-primary transition-all whitespace-nowrap">
<p class="text-sm font-medium leading-normal">All Games</p>
</button>
<button class="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/10 text-text-main transition-all whitespace-nowrap">
<p class="text-sm font-medium leading-normal">WebGL</p>
</button>
<button class="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/10 text-text-main transition-all whitespace-nowrap">
<p class="text-sm font-medium leading-normal">Canvas</p>
</button>
<button class="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/10 text-text-main transition-all whitespace-nowrap">
<p class="text-sm font-medium leading-normal">React Fiber</p>
</button>
<button class="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/10 text-text-main transition-all whitespace-nowrap">
<p class="text-sm font-medium leading-normal">Three.js</p>
</button>
</div>
</div>
</aside>
<!-- Matrix Grid -->
<div class="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 auto-rows-max">
<!-- Card 1 -->
<article class="glass-panel rounded-xl overflow-hidden flex flex-col h-[280px] cursor-pointer glass-panel-hover card-transition group">
<div class="h-[160px] w-full bg-black/40 relative overflow-hidden flex-shrink-0">
<div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
<div class="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" data-alt="A vibrant, retro-futuristic arcade game screen displaying neon glowing geometric shapes and lasers against a deep space black background. The lighting is high-energy cyan and magenta, capturing a playful, tech-optimist vibe coding aesthetic. Highly detailed, 4k, glassmorphic UI elements overlay the scene." style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuBUhoCVnDJkUk06LcvbgsPfeBCn9COCOIOgUZAjXOh9g-8I9y5wqG0Zh_U-thmiVVlAs1_QNNqD-Kg2JPX2vHt-DAP11eVwIF2mRqSRaMJr3KTcDMC8GVNSP6LNngzIZ6JqgVd8OTmsuYCXrDWwVMUvXbZgMrpQPWJ0xOnZD1AsMSCw7g2ZbURyF5w5o-12iWbi241E_HHBiu8rHTab7y9Re4fkzRCAAp8TxvvwaTYZWUbR4JXvXNRXpEjboBjI7FPl8VKmW2az-w');"></div>
<div class="absolute bottom-3 left-3 z-20 flex items-center gap-2">
<span class="w-2 h-2 rounded-full bg-accent-games shadow-[0_0_8px_rgba(57,255,20,0.8)]"></span>
<span class="text-[11px] uppercase tracking-wider text-white font-bold bg-black/50 px-2 py-0.5 rounded backdrop-blur-sm border border-white/10">WebGL</span>
</div>
</div>
<div class="p-5 flex flex-col flex-1 justify-center">
<h3 class="font-display font-bold text-xl text-white mb-1 group-hover:text-primary transition-colors line-clamp-1">Neon Drift</h3>
<p class="text-text-muted text-sm font-medium flex items-center gap-2">
<span class="material-symbols-outlined text-[16px]">account_circle</span>
                        by @cybercoder
                    </p>
</div>
</article>
<!-- Card 2 -->
<article class="glass-panel rounded-xl overflow-hidden flex flex-col h-[280px] cursor-pointer glass-panel-hover card-transition group">
<div class="h-[160px] w-full bg-black/40 relative overflow-hidden flex-shrink-0">
<div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
<div class="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" data-alt="An isometric view of a minimalist 3D puzzle game. Soft glowing pastel colors illuminate floating glass cubes in a dark, atmospheric void. The aesthetic is modern, tech-optimistic, and heavily features soft ambient occlusion lighting and subtle mesh gradients in the background." style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuAreCPNflRjEndnpwBU5q1FHSRdg1MQYzI_Mx_L6KfDZU-10TWXiuAF8soe43xcYVJV-wWSXrdmj9aecBtVqMUNUcBPPlG-fX_ddEt680ID08FOWWGpCW6YhprjiDjJrr5O5J1iU--qWohIYR82Atj_cBHAUcnCbWMehwcnwdWPTRx8QwlCRtVOakxa8MeDtWwD7-ljO3j3UN76xWJkC8LrEW18mPizGZSTFly5ZpCcbsisIjBP9Wt-Zym88JqFi1cI1Pw-irbPYQ');"></div>
<div class="absolute bottom-3 left-3 z-20 flex items-center gap-2">
<span class="w-2 h-2 rounded-full bg-accent-games shadow-[0_0_8px_rgba(57,255,20,0.8)]"></span>
<span class="text-[11px] uppercase tracking-wider text-white font-bold bg-black/50 px-2 py-0.5 rounded backdrop-blur-sm border border-white/10">Three.js</span>
</div>
</div>
<div class="p-5 flex flex-col flex-1 justify-center">
<h3 class="font-display font-bold text-xl text-white mb-1 group-hover:text-primary transition-colors line-clamp-1">IsoCube Flow</h3>
<p class="text-text-muted text-sm font-medium flex items-center gap-2">
<span class="material-symbols-outlined text-[16px]">account_circle</span>
                        by @zenbuilder
                    </p>
</div>
</article>
<!-- Card 3 -->
<article class="glass-panel rounded-xl overflow-hidden flex flex-col h-[280px] cursor-pointer glass-panel-hover card-transition group">
<div class="h-[160px] w-full bg-black/40 relative overflow-hidden flex-shrink-0">
<div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
<div class="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" data-alt="A chaotic, fast-paced 2D platformer game screenshot showing vibrant pixel art particles exploding against a dark grid background. Bright cyan and lime green UI overlays indicate score and combo meters. The mood is frenetic, joyful, and deeply rooted in rapid vibe coding culture." style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuC6Bh9GDsYh9Z2Nwyw-UXKJnBZWGknifNq6wtbX0GWA1Xi4MyYvxf71DRO3fPMUsVoj0Z-1LxWPC3xaptZQRkJYdj3mozZwa5ZbqLJ1uCCz2EuVCgvv7kJ624WXW-2QIvXox5E6Ntu4ci8Xm9WRvovRcfn0L5rZSTmoJKaMX8nMEKq6GADJYKeSbxAcUorI7CG2y5C_pqOsNazbIhyZdMEFRBNdBTBfm6RixinoRHEbf1frdm98JQ8rJ4mwEq9Qab9RONqBO7TIgA');"></div>
<div class="absolute bottom-3 left-3 z-20 flex items-center gap-2">
<span class="w-2 h-2 rounded-full bg-accent-games shadow-[0_0_8px_rgba(57,255,20,0.8)]"></span>
<span class="text-[11px] uppercase tracking-wider text-white font-bold bg-black/50 px-2 py-0.5 rounded backdrop-blur-sm border border-white/10">Canvas</span>
</div>
</div>
<div class="p-5 flex flex-col flex-1 justify-center">
<h3 class="font-display font-bold text-xl text-white mb-1 group-hover:text-primary transition-colors line-clamp-1">Particle Dash</h3>
<p class="text-text-muted text-sm font-medium flex items-center gap-2">
<span class="material-symbols-outlined text-[16px]">account_circle</span>
                        by @vibehacker
                    </p>
</div>
</article>
<!-- Card 4 -->
<article class="glass-panel rounded-xl overflow-hidden flex flex-col h-[280px] cursor-pointer glass-panel-hover card-transition group">
<div class="h-[160px] w-full bg-black/40 relative overflow-hidden flex-shrink-0">
<div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
<div class="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" data-alt="A sleek, futuristic chess game interface floating in a digital void. The board is made of translucent frosted glass, and the pieces are glowing neon wireframes in bright white and electric cyan. The lighting is cinematic, casting soft, colorful caustics onto the dark background plane." style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuCY8dIsaS_PKFVpMtKViezn5lOgnDfi2w9J3PZ8o9eQIl1MWBblVR3cL5xazv_-yRcigx6USn5Fz4gSvV87bOLQ6j6LRpfhmWyJWr8Xtx0NGcoAJLFl0py8hP588_9S8--GL7E9wRWMqSPguhoajkPZylfZ8kFZUFi3Y-S0jpnjgroOQoaGjPz1ni0ZuLRTcFwo1Xnj2i85PyN2dwQFOrfuhryIBx_S7p4wbhae0fT7ZoX4N5FnOMPY4tvNQEZXgZW-EmJ_kIAXxA');"></div>
<div class="absolute bottom-3 left-3 z-20 flex items-center gap-2">
<span class="w-2 h-2 rounded-full bg-accent-games shadow-[0_0_8px_rgba(57,255,20,0.8)]"></span>
<span class="text-[11px] uppercase tracking-wider text-white font-bold bg-black/50 px-2 py-0.5 rounded backdrop-blur-sm border border-white/10">React Fiber</span>
</div>
</div>
<div class="p-5 flex flex-col flex-1 justify-center">
<h3 class="font-display font-bold text-xl text-white mb-1 group-hover:text-primary transition-colors line-clamp-1">HoloChess V2</h3>
<p class="text-text-muted text-sm font-medium flex items-center gap-2">
<span class="material-symbols-outlined text-[16px]">account_circle</span>
                        by @promptgod
                    </p>
</div>
</article>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
<style>
    /* Utility for hiding scrollbar in sidebar but keeping functionality */
    .hide-scrollbar::-webkit-scrollbar {
        display: none;
    }
    .hide-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
</style>
</body></html>