<!DOCTYPE html>

<html class="dark" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Dynamic Stream - Discovery Feed</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&amp;family=Space+Grotesk:wght@400;500&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
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
          "border-glass": "rgba(255, 255, 255, 0.1)",
          "accent-games": "#39FF14",
          "accent-tools": "#FF007F",
          "accent-art": "#FF5E00",
          "accent-bots": "#7000FF",
        },
        fontFamily: {
          "display": ["Outfit", "sans-serif"],
          "body": ["Space Grotesk", "sans-serif"],
        },
        borderRadius: {"DEFAULT": "0.5rem", "sm": "12px", "md": "24px", "lg": "32px", "xl": "1.5rem", "full": "9999px"},
        backgroundImage: {
          'mesh': 'radial-gradient(at 40% 20%, rgba(112, 0, 255, 0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(255, 0, 127, 0.15) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(6, 249, 168, 0.15) 0px, transparent 50%)',
        },
        animation: {
          'blob': 'blob 15s infinite alternate',
        },
        keyframes: {
          blob: {
            '0%': { transform: 'translate(0px, 0px) scale(1)' },
            '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
            '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
            '100%': { transform: 'translate(0px, 0px) scale(1)' },
          }
        }
      },
    },
  }
</script>
<style>
  body {
    font-family: 'Space Grotesk', sans-serif;
    background-color: theme('colors.background-dark');
    color: #F4F4F5;
    overflow-x: hidden;
  }
  
  h1, h2, h3, h4, h5, h6, .font-display {
    font-family: 'Outfit', sans-serif;
  }

  .glass-panel {
    background: theme('colors.surface');
    backdrop-filter: blur(40px);
    -webkit-backdrop-filter: blur(40px);
    border: 1px solid theme('colors.border-glass');
  }

  .glass-nav {
    background: rgba(10, 0, 26, 0.5);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid transparent;
    transition: all 0.3s ease;
  }

  .glass-nav.scrolled {
    background: rgba(10, 0, 26, 0.8);
    border-bottom: 1px solid theme('colors.border-glass');
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  }

  /* Masonry Grid Setup */
  .masonry-grid {
    column-count: 1;
    column-gap: 24px;
  }
  @media (min-width: 640px) { .masonry-grid { column-count: 2; } }
  @media (min-width: 1024px) { .masonry-grid { column-count: 3; } }
  @media (min-width: 1280px) { .masonry-grid { column-count: 4; } }

  .masonry-item {
    break-inside: avoid;
    margin-bottom: 24px;
  }

  /* Card Hover Effects */
  .vibe-card {
    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), border-color 0.3s ease, box-shadow 0.3s ease;
  }
  
  .vibe-card:hover {
    transform: scale(1.02);
    border-color: rgba(255, 255, 255, 0.3);
  }

  .vibe-card.cat-games:hover { box-shadow: 0 24px 48px rgba(57, 255, 20, 0.15); }
  .vibe-card.cat-tools:hover { box-shadow: 0 24px 48px rgba(255, 0, 127, 0.15); }
  .vibe-card.cat-art:hover { box-shadow: 0 24px 48px rgba(255, 94, 0, 0.15); }
  .vibe-card.cat-bots:hover { box-shadow: 0 24px 48px rgba(112, 0, 255, 0.15); }

  /* Hide scrollbar for filter track */
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
</style>
</head>
<body class="relative min-h-screen text-gray-100">
<!-- Animated Background -->
<div class="fixed inset-0 z-[-1] bg-background-dark overflow-hidden pointer-events-none">
<div class="absolute inset-0 bg-mesh opacity-60"></div>
<!-- Abstract Blobs for extra movement -->
<div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[radial-gradient(circle,rgba(112,0,255,0.2)_0%,transparent_70%)] blur-3xl animate-blob"></div>
<div class="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[radial-gradient(circle,rgba(6,249,168,0.15)_0%,transparent_70%)] blur-3xl animate-blob" style="animation-delay: -5s;"></div>
</div>
<!-- Shared Component: TopNavBar -->
<div class="fixed top-0 left-0 right-0 z-50 flex flex-col group/design-root" style='font-family: "Outfit", sans-serif;'>
<div class="layout-container flex h-full grow flex-col">
<div class="px-6 md:px-10 lg:px-20 flex flex-1 justify-center py-2 glass-nav" id="main-nav">
<div class="layout-content-container flex flex-col w-full max-w-[1400px] flex-1">
<header class="flex items-center justify-between whitespace-nowrap px-4 py-3">
<div class="flex items-center gap-4 text-white">
<div class="size-6 text-primary drop-shadow-[0_0_10px_rgba(6,249,168,0.5)]">
<svg fill="none" viewbox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
<path d="M13.8261 30.5736C16.7203 29.8826 20.2244 29.4783 24 29.4783C27.7756 29.4783 31.2797 29.8826 34.1739 30.5736C36.9144 31.2278 39.9967 32.7669 41.3563 33.8352L24.8486 7.36089C24.4571 6.73303 23.5429 6.73303 23.1514 7.36089L6.64374 33.8352C8.00331 32.7669 11.0856 31.2278 13.8261 30.5736Z" fill="currentColor"></path>
<path clip-rule="evenodd" d="M39.998 35.764C39.9944 35.7463 39.9875 35.7155 39.9748 35.6706C39.9436 35.5601 39.8949 35.4259 39.8346 35.2825C39.8168 35.2403 39.7989 35.1993 39.7813 35.1602C38.5103 34.2887 35.9788 33.0607 33.7095 32.5189C30.9875 31.8691 27.6413 31.4783 24 31.4783C20.3587 31.4783 17.0125 31.8691 14.2905 32.5189C12.0012 33.0654 9.44505 34.3104 8.18538 35.1832C8.17384 35.2075 8.16216 35.233 8.15052 35.2592C8.09919 35.3751 8.05721 35.4886 8.02977 35.589C8.00356 35.6848 8.00039 35.7333 8.00004 35.7388C8.00004 35.739 8 35.7393 8.00004 35.7388C8.00004 35.7641 8.0104 36.0767 8.68485 36.6314C9.34546 37.1746 10.4222 37.7531 11.9291 38.2772C14.9242 39.319 19.1919 40 24 40C28.8081 40 33.0758 39.319 36.0709 38.2772C37.5778 37.7531 38.6545 37.1746 39.3151 36.6314C39.9006 36.1499 39.9857 35.8511 39.998 35.764ZM4.95178 32.7688L21.4543 6.30267C22.6288 4.4191 25.3712 4.41909 26.5457 6.30267L43.0534 32.777C43.0709 32.8052 43.0878 32.8338 43.104 32.8629L41.3563 33.8352C43.104 32.8629 43.1038 32.8626 43.104 32.8629L43.1051 32.865L43.1065 32.8675L43.1101 32.8739L43.1199 32.8918C43.1276 32.906 43.1377 32.9246 43.1497 32.9473C43.1738 32.9925 43.2062 33.0545 43.244 33.1299C43.319 33.2792 43.4196 33.489 43.5217 33.7317C43.6901 34.1321 44 34.9311 44 35.7391C44 37.4427 43.003 38.7775 41.8558 39.7209C40.6947 40.6757 39.1354 41.4464 37.385 42.0552C33.8654 43.2794 29.133 44 24 44C18.867 44 14.1346 43.2794 10.615 42.0552C8.86463 41.4464 7.30529 40.6757 6.14419 39.7209C4.99695 38.7775 3.99999 37.4427 3.99999 35.7391C3.99999 34.8725 4.29264 34.0922 4.49321 33.6393C4.60375 33.3898 4.71348 33.1804 4.79687 33.0311C4.83898 32.9556 4.87547 32.8935 4.9035 32.8471C4.91754 32.8238 4.92954 32.8043 4.93916 32.7889L4.94662 32.777L4.95178 32.7688ZM35.9868 29.004L24 9.77997L12.0131 29.004C12.4661 28.8609 12.9179 28.7342 13.3617 28.6282C16.4281 27.8961 20.0901 27.4783 24 27.4783C27.9099 27.4783 31.5719 27.8961 34.6383 28.6282C35.082 28.7342 35.5339 28.8609 35.9868 29.004Z" fill="currentColor" fill-rule="evenodd"></path>
</svg>
</div>
<h2 class="text-white text-2xl font-bold leading-tight tracking-tight">Dynamic Stream</h2>
</div>
<!-- Category Track (Injected into header layout) -->
<div class="hidden md:flex gap-3 px-8 flex-1 justify-center hide-scrollbar overflow-x-auto">
<button class="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white/10 border border-white/20 px-6 hover:bg-white/20 transition-colors text-primary shadow-[0_0_15px_rgba(6,249,168,0.2)]">
<p class="text-sm font-semibold tracking-wide uppercase">All Vibes</p>
</button>
<button class="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full bg-surface border border-border-glass px-6 hover:bg-surface-hover transition-colors">
<span class="w-2 h-2 rounded-full bg-accent-games shadow-[0_0_8px_#39FF14]"></span>
<p class="text-sm font-semibold tracking-wide uppercase text-gray-300">Games</p>
</button>
<button class="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full bg-surface border border-border-glass px-6 hover:bg-surface-hover transition-colors">
<span class="w-2 h-2 rounded-full bg-accent-tools shadow-[0_0_8px_#FF007F]"></span>
<p class="text-sm font-semibold tracking-wide uppercase text-gray-300">Tools</p>
</button>
<button class="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full bg-surface border border-border-glass px-6 hover:bg-surface-hover transition-colors">
<span class="w-2 h-2 rounded-full bg-accent-art shadow-[0_0_8px_#FF5E00]"></span>
<p class="text-sm font-semibold tracking-wide uppercase text-gray-300">Art</p>
</button>
<button class="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full bg-surface border border-border-glass px-6 hover:bg-surface-hover transition-colors">
<span class="w-2 h-2 rounded-full bg-accent-bots shadow-[0_0_8px_#7000FF]"></span>
<p class="text-sm font-semibold tracking-wide uppercase text-gray-300">Bots</p>
</button>
</div>
<div class="flex justify-end gap-4">
<label class="flex flex-col min-w-40 !h-10 max-w-64">
<div class="flex w-full flex-1 items-stretch rounded-full h-full border border-border-glass bg-surface hover:bg-surface-hover transition-colors">
<div class="text-gray-400 flex items-center justify-center pl-4 rounded-l-full" data-icon="search" data-size="20px">
<span class="material-symbols-outlined text-[20px]">search</span>
</div>
<input class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-full text-white focus:outline-0 focus:ring-0 border-none bg-transparent h-full placeholder:text-gray-500 px-4 rounded-l-none pl-2 text-sm font-body" placeholder="Search vibes..." value=""/>
</div>
</label>
<button class="hidden lg:flex items-center justify-center h-10 px-6 rounded-full bg-primary text-background-dark font-display font-bold hover:brightness-110 transition-all shadow-[0_0_20px_rgba(6,249,168,0.4)]">
                Launch
              </button>
</div>
</header>
<!-- Mobile Category Track -->
<div class="md:hidden flex gap-3 px-4 pb-4 overflow-x-auto hide-scrollbar">
<button class="flex h-8 shrink-0 items-center justify-center rounded-full bg-white/10 border border-white/20 px-4 text-primary text-xs font-semibold uppercase tracking-wide">All Vibes</button>
<button class="flex h-8 shrink-0 items-center justify-center gap-2 rounded-full bg-surface border border-border-glass px-4 text-gray-300 text-xs font-semibold uppercase tracking-wide"><span class="w-1.5 h-1.5 rounded-full bg-accent-games"></span>Games</button>
<button class="flex h-8 shrink-0 items-center justify-center gap-2 rounded-full bg-surface border border-border-glass px-4 text-gray-300 text-xs font-semibold uppercase tracking-wide"><span class="w-1.5 h-1.5 rounded-full bg-accent-tools"></span>Tools</button>
</div>
</div>
</div>
</div>
</div>
<!-- Main Content: Masonry Grid -->
<main class="pt-[140px] pb-24 px-6 md:px-10 lg:px-20 max-w-[1600px] mx-auto">
<div class="masonry-grid">
<!-- Card 1: Art -->
<div class="masonry-item">
<div class="glass-panel rounded-md overflow-hidden vibe-card cat-art cursor-pointer group">
<div class="relative w-full h-64 overflow-hidden bg-gray-900">
<img alt="A vibrant digital art piece featuring swirling, luminous orange and red liquid textures against a deep black background. The composition is highly abstract and dynamic, suggesting chaotic energy. The lighting is intense and glowing, emphasizing a futuristic, generative aesthetic. The mood is energetic and visually arresting." class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 mix-blend-screen" data-alt="A vibrant digital art piece featuring swirling, luminous orange and red liquid textures against a deep black background. The composition is highly abstract and dynamic, suggesting chaotic energy. The lighting is intense and glowing, emphasizing a futuristic, generative aesthetic. The mood is energetic and visually arresting." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHtzgEG4Rojxb1CyOlgx7pkWJjNoEGEgt8QNc-pYT7_s7_WU7HireoqLsFroy8IQcRL8oIi28RV4zvfLL95JkqW3b9Ngkc22ZjvcMfCBgFwspLAczUmw-f3WYpFL__mREURUyjsoG8FoigE0bzPDdMCbGR7cIbA4S9HRLFu5mwGbX7uWtCExmlopcm8IRzNypYxF6jpD44bkmU53gLpg6yQV5SOH9yB3qDhsNFmmZpcH5bFsaTlSWpSMwwZb54yO6I_q8WCmEe7Q"/>
</div>
<div class="p-5 flex flex-col gap-2">
<div class="flex justify-between items-start">
<h3 class="font-display font-bold text-xl leading-tight">Fluid Synesthesia</h3>
<span class="w-3 h-3 rounded-full bg-accent-art shadow-[0_0_10px_#FF5E00] mt-1 shrink-0"></span>
</div>
<p class="text-sm text-gray-400 font-body">by @generative_god</p>
<div class="mt-3 flex items-center gap-2">
<span class="material-symbols-outlined text-gray-500 text-[16px]">visibility</span>
<span class="text-xs text-gray-500 font-semibold tracking-wide">12.4K</span>
</div>
</div>
</div>
</div>
<!-- Card 2: Games -->
<div class="masonry-item">
<div class="glass-panel rounded-md overflow-hidden vibe-card cat-games cursor-pointer group">
<div class="relative w-full h-80 overflow-hidden bg-gray-900">
<img alt="A retro-futuristic arcade game interface showcasing a neon green wireframe landscape on a CRT monitor. The lighting is dark, with intense lime green glowing elements creating a nostalgic yet tech-forward mood. The visual style mimics an 80s synthwave aesthetic combined with modern clean glassmorphic UI elements overlaying the screen." class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90" data-alt="A retro-futuristic arcade game interface showcasing a neon green wireframe landscape on a CRT monitor. The lighting is dark, with intense lime green glowing elements creating a nostalgic yet tech-forward mood. The visual style mimics an 80s synthwave aesthetic combined with modern clean glassmorphic UI elements overlaying the screen." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAyxnqaI02nISJ-tBF4F8wIddrQMrEOtCJx5YEHq7Z3qsZyC_jL1cdXR9F6af_iR9OL9bp03KsIUspOktouROsZA18jUGIsvi06peDYrbKhfTtv9D9dgxlE47RdF5Au-NPfwwCHOrgmCN7PTPOO98WkJ05SmlzmdmjDh20oYCvCctUQLV5czBEb4DrP2BZ5wXJ1YKAgO4udCCttohluSGT4t50ycvqQumaqCGugQikSjsLqg6RG7KjF2PPiLvbcoVb8jg1dxHxgXg"/>
</div>
<div class="p-5 flex flex-col gap-2">
<div class="flex justify-between items-start">
<h3 class="font-display font-bold text-xl leading-tight">Neon Rider WebGL</h3>
<span class="w-3 h-3 rounded-full bg-accent-games shadow-[0_0_10px_#39FF14] mt-1 shrink-0"></span>
</div>
<p class="text-sm text-gray-400 font-body">by @pixel_punk</p>
<p class="text-sm text-gray-300 mt-2 line-clamp-2">A high-speed procedural racer built entirely with a single prompt. Dodge geometry.</p>
</div>
</div>
</div>
<!-- Card 3: Tools -->
<div class="masonry-item">
<div class="glass-panel rounded-md overflow-hidden vibe-card cat-tools cursor-pointer group">
<div class="p-6 flex flex-col gap-4">
<div class="flex justify-between items-start">
<div class="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-accent-tools">
<span class="material-symbols-outlined text-[28px]">code_blocks</span>
</div>
<span class="w-3 h-3 rounded-full bg-accent-tools shadow-[0_0_10px_#FF007F] shrink-0"></span>
</div>
<div>
<h3 class="font-display font-bold text-xl leading-tight mt-2">Regex Whisperer</h3>
<p class="text-sm text-gray-400 font-body mt-1">by @dev_dude</p>
</div>
<p class="text-sm text-gray-300 line-clamp-3">Describe what you want to match in plain English, get perfect Regex instantly. Vibe coded in 4 minutes.</p>
<button class="mt-2 text-xs font-semibold uppercase tracking-widest text-accent-tools hover:text-white transition-colors self-start flex items-center gap-1">
              Try Tool <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
</button>
</div>
</div>
</div>
<!-- Card 4: Bots -->
<div class="masonry-item">
<div class="glass-panel rounded-md overflow-hidden vibe-card cat-bots cursor-pointer group">
<div class="relative w-full h-48 overflow-hidden bg-gray-900">
<div class="absolute inset-0 bg-gradient-to-br from-accent-bots/20 to-transparent z-10"></div>
<img alt="An abstract visualization of artificial intelligence logic gates, featuring deep purple and violet geometric structures interlocked in a dark void. The lighting is cool and localized, highlighting the nodes with a hyper-violet glow. The style is sleek, modern, and mysterious, representing a complex digital bot brain." class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-70 mix-blend-luminosity" data-alt="An abstract visualization of artificial intelligence logic gates, featuring deep purple and violet geometric structures interlocked in a dark void. The lighting is cool and localized, highlighting the nodes with a hyper-violet glow. The style is sleek, modern, and mysterious, representing a complex digital bot brain." src="https://lh3.googleusercontent.com/aida-public/AB6AXuADqMpFa2ugfQ13idykfAsUyH8z_yNh9TShu3L5ESMROQbRgVwQIqNRiqJwWFQZj8bCCHlNJJ76UxaJLNBxq2I_msESUs8HCD8H6CEhR0-Knth2AvidYToTZJBWBwMsypkBO9wm0Rb3YD7yh7f33nH8o9CUAQQ8NMw5Ztub6_toT5NtsmoQSRJWLePnnCOF2GTvYIAyBilc2wPjOSv93mfYW6vTUCEUG370xVudVWYVtUXSn-sw6GCyLwPRgETm-pFgo1fI0PDHKw"/>
</div>
<div class="p-5 flex flex-col gap-2">
<div class="flex justify-between items-start">
<h3 class="font-display font-bold text-xl leading-tight">Sarcasm Bot</h3>
<span class="w-3 h-3 rounded-full bg-accent-bots shadow-[0_0_10px_#7000FF] mt-1 shrink-0"></span>
</div>
<p class="text-sm text-gray-400 font-body">by @ai_troll</p>
</div>
</div>
</div>
<!-- Card 5: Games -->
<div class="masonry-item">
<div class="glass-panel rounded-md overflow-hidden vibe-card cat-games cursor-pointer group">
<div class="relative w-full h-64 overflow-hidden bg-black flex items-center justify-center">
<!-- Simulated CSS Art / Simple Canvas representation -->
<div class="w-24 h-24 border-4 border-accent-games rounded-full animate-ping opacity-50 absolute"></div>
<div class="w-16 h-16 bg-accent-games rounded-lg shadow-[0_0_30px_#39FF14] rotate-45 z-10"></div>
</div>
<div class="p-5 flex flex-col gap-2">
<div class="flex justify-between items-start">
<h3 class="font-display font-bold text-xl leading-tight">Cube Dodger</h3>
<span class="w-3 h-3 rounded-full bg-accent-games shadow-[0_0_10px_#39FF14] mt-1 shrink-0"></span>
</div>
<p class="text-sm text-gray-400 font-body">by @casual_coder</p>
</div>
</div>
</div>
<!-- Card 6: Tools -->
<div class="masonry-item">
<div class="glass-panel rounded-md overflow-hidden vibe-card cat-tools cursor-pointer group">
<div class="p-6 flex flex-col gap-4">
<div class="flex justify-between items-start">
<h3 class="font-display font-bold text-2xl leading-tight text-white">Color Palette Generator</h3>
<span class="w-3 h-3 rounded-full bg-accent-tools shadow-[0_0_10px_#FF007F] mt-2 shrink-0"></span>
</div>
<p class="text-sm text-gray-400 font-body -mt-2">by @ui_wizard</p>
<div class="flex h-12 w-full rounded-lg overflow-hidden mt-2">
<div class="flex-1 bg-[#0A001A]"></div>
<div class="flex-1 bg-[#7000FF]"></div>
<div class="flex-1 bg-[#FF007F]"></div>
<div class="flex-1 bg-[#06f9a8]"></div>
</div>
</div>
</div>
</div>
<!-- Card 7: Art -->
<div class="masonry-item">
<div class="glass-panel rounded-md overflow-hidden vibe-card cat-art cursor-pointer group">
<div class="relative w-full h-[400px] overflow-hidden bg-gray-900">
<img alt="A striking abstract digital painting showing aggressive, thick brushstrokes of flare orange and stark white on a dark canvas. The image has a raw, generative feel, as if painted by an algorithm. The lighting is dramatic, emphasizing the texture of the digital paint. The aesthetic aligns with a modern, high-contrast dark mode gallery." class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80" data-alt="A striking abstract digital painting showing aggressive, thick brushstrokes of flare orange and stark white on a dark canvas. The image has a raw, generative feel, as if painted by an algorithm. The lighting is dramatic, emphasizing the texture of the digital paint. The aesthetic aligns with a modern, high-contrast dark mode gallery." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBM3xNUHGu87ILcyNWGZW3kOA2N1C0Wjd9sDfLoz5fDCM6CXq5YnzDbLu5sp7npzUcHuOOhDyqmi3vfBPKFY-Kdx1BVTgnu9wQgJkDcR19HbTCVW6UxgpIYvB1853JZBmx-ka_oNgejdLRc4Tz3coTwaUBWls7ez-rR2mFr1FismNt5AoWvAPZusJi2JN1jnAKW-NEQ2PKLecaOA4xQdU_H1PBhUbHa0Tc98I24YwJ-dK3hnHBdOu33saIH7ja1H37a7AvdegZAiA"/>
</div>
<div class="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/90 to-transparent pt-20">
<div class="flex justify-between items-end">
<div>
<h3 class="font-display font-bold text-xl leading-tight">Algorithmic Canvas</h3>
<p class="text-sm text-gray-300 font-body mt-1">by @brush_bot</p>
</div>
<span class="w-3 h-3 rounded-full bg-accent-art shadow-[0_0_10px_#FF5E00] shrink-0 mb-2"></span>
</div>
</div>
</div>
</div>
</div>
</main>
<script>
    // Simple script to handle scroll effect on nav
    const nav = document.getElementById('main-nav');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    });
  </script>
</body></html>