<!DOCTYPE html>

<html class="dark" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Dynamic Stream - Project Preview</title>
<!-- Fonts -->
<link href="https://fonts.googleapis.com" rel="preconnect"/>
<link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&amp;family=Outfit:wght@400;500;600;700;800&amp;family=Space+Grotesk:wght@400;500&amp;display=swap" rel="stylesheet"/>
<!-- Material Symbols -->
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<!-- Tailwind CSS -->
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<!-- Tailwind Configuration -->
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            colors: {
              "primary": "#06f9a8",
              "background-light": "#f5f8f7",
              "background-dark": "#0f231c",
            },
            fontFamily: {
              "display": ["Outfit", "sans-serif"],
              "body": ["Space Grotesk", "sans-serif"],
              "mono": ["JetBrains Mono", "monospace"],
            },
            borderRadius: {"DEFAULT": "0.5rem", "lg": "1rem", "xl": "1.5rem", "full": "9999px"},
            animation: {
                'spring-in': 'springIn 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.1) forwards',
                'fade-in': 'fadeIn 0.4s ease-out forwards',
            },
            keyframes: {
                springIn: {
                    '0%': { transform: 'scale(0.9)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                }
            }
          },
        },
      }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        
        /* Custom scrollbar for the modal content if needed */
        ::-webkit-scrollbar {
            width: 8px;
        }
        ::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.02);
        }
        ::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.2);
        }

        /* Accordion transition */
        .accordion-content {
            transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease;
            max-height: 0;
            opacity: 0;
            overflow: hidden;
        }
        .accordion-content.expanded {
            max-height: 500px; /* Arbitrary large value to accommodate content */
            opacity: 1;
        }
        
        /* Button Glow Hover */
        .glow-hover:hover {
            box-shadow: 0 0 30px rgba(6, 249, 168, 0.4);
        }
    </style>
</head>
<body class="bg-background-dark text-white font-body overflow-hidden antialiased selection:bg-primary selection:text-background-dark">
<!-- Simulated Background Context (The Feed) -->
<div class="fixed inset-0 z-0 opacity-30 flex items-center justify-center pointer-events-none">
<div class="absolute w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] top-[-20%] left-[-10%]"></div>
<div class="absolute w-[600px] h-[600px] bg-[#7000FF]/20 rounded-full blur-[100px] bottom-[-10%] right-[-10%]"></div>
</div>
<!-- Full Screen Modal Overlay -->
<div class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-12" id="modal-container">
<!-- Backdrop -->
<div class="absolute inset-0 bg-black/60 backdrop-blur-3xl opacity-0 animate-fade-in" id="modal-backdrop"></div>
<!-- Modal Content Container -->
<div class="relative w-full max-w-[1000px] bg-white/[0.03] border border-white/10 rounded-xl shadow-[0_24px_48px_rgba(0,0,0,0.5)] flex flex-col max-h-full overflow-y-auto overflow-x-hidden opacity-0 scale-90 animate-spring-in" id="modal-card">
<!-- Close Button -->
<button aria-label="Close Modal" class="absolute top-4 right-4 z-10 p-2 bg-black/40 hover:bg-black/60 border border-white/10 rounded-full text-white/70 hover:text-white transition-colors flex items-center justify-center">
<span class="material-symbols-outlined text-xl" data-icon="close">close</span>
</button>
<!-- Live Preview / Header Image Area -->
<div class="w-full h-[400px] md:h-[600px] bg-black/50 relative border-b border-white/10 flex-shrink-0">
<img alt="Project Preview" class="w-full h-full object-cover" data-alt="A striking digital interface screenshot showcasing a vibrant web application set against a deep space background. The visual composition features high-energy glowing elements, with electric cyan and hyper violet accentuating abstract geometric data visualizations. The layout utilizes heavy glassmorphic panels that sit slightly transparently over a fluid mesh gradient. The lighting is artificial and high-contrast, creating a highly polished, tech-optimist aesthetic that feels both futuristic and playfully chaotic." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAw4tl3BU3bs90kE3YWu4s5n3uxbs0fZjfomV3cf4BhFEups5Ln3lH1kRzJzRgYnZ3NP4w5ajNEzA9WhnxT24TW_g5RR-EOnP6hHGh82OZj2bMva-bHv6EEUXIWHRCJnK-lWZEVDEMyTj0s8jFA-6r8rc3HfMjA20UbX61BsPZUgTQY4LpvDHxcNnhqauRuGtLcZPL9A4NI7j6rxmNrU9vu63Qs77rLXz69K7Vn62R9h3iatlR71dBBj34-xUiLP9lIG6qBBf5w5Q"/>
<!-- Overlay Category Badge -->
<div class="absolute top-6 left-6 px-3 py-1.5 bg-[#39FF14]/10 border border-[#39FF14]/30 rounded-full flex items-center gap-2 backdrop-blur-md">
<div class="w-2 h-2 rounded-full bg-[#39FF14] animate-pulse"></div>
<span class="text-[#39FF14] text-xs font-medium uppercase tracking-widest font-body">Games</span>
</div>
</div>
<!-- Content Area -->
<div class="p-8 md:p-10 flex flex-col gap-8 flex-grow">
<!-- Header Info -->
<div class="flex flex-col md:flex-row md:items-start justify-between gap-6">
<div class="flex flex-col gap-2 max-w-2xl">
<h1 class="text-4xl md:text-5xl font-display font-bold tracking-tight text-white leading-tight">Neon Synth Weaver</h1>
<p class="text-white/60 text-lg font-body flex items-center gap-2">
                            created by <span class="text-white font-medium hover:text-primary transition-colors cursor-pointer">@vibecoder</span>
<span class="text-white/20">•</span>
<span class="text-sm">2 hours ago</span>
</p>
</div>
<!-- CTAs -->
<div class="flex items-center gap-3 shrink-0">
<button class="px-6 py-3 bg-white/10 hover:bg-white/15 border border-white/10 text-white rounded-lg font-display font-semibold transition-all flex items-center gap-2 group">
<span class="material-symbols-outlined text-[20px] text-white/70 group-hover:text-white transition-colors" data-icon="code">code</span>
                            View Code
                        </button>
<button class="px-6 py-3 bg-primary text-background-dark rounded-lg font-display font-bold transition-all flex items-center gap-2 glow-hover">
                            Visit Website
                            <span class="material-symbols-outlined text-[20px]" data-icon="open_in_new">open_in_new</span>
</button>
</div>
</div>
<div class="w-full h-px bg-white/10"></div>
<!-- Prompt Accordion -->
<div class="flex flex-col border border-white/10 rounded-lg bg-black/20 overflow-hidden">
<button class="w-full p-5 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors" id="prompt-toggle">
<div class="flex items-center gap-3">
<span class="material-symbols-outlined text-primary" data-icon="auto_awesome">auto_awesome</span>
<span class="font-display font-semibold text-lg text-white">Reveal Vibe Prompt</span>
</div>
<span class="material-symbols-outlined text-white/50 transition-transform duration-300" data-icon="expand_more" id="prompt-chevron">expand_more</span>
</button>
<div class="accordion-content border-t border-white/5 bg-black/40 relative" id="prompt-content">
<!-- Decorative top gradient -->
<div class="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
<div class="p-6 overflow-x-auto">
<pre class="font-mono text-sm text-white/80 whitespace-pre-wrap leading-relaxed"><code>Build a high-energy synth-wave audio visualizer. 

Use dark mode with a deep space purple background (#0A001A). 
Create a central canvas that reacts to microphone input, generating fluid mesh gradients that spike and distort based on volume. 

The UI should use heavy glassmorphism (backdrop-blur-2xl, 5% white background, 10% white border) for floating control panels. 
Primary accent color is electric cyan (#00FFAA) for active sliders and play buttons. 

Make it feel playful, chaotic, but extremely polished. No scrollbars. Full screen experience.</code></pre>
</div>
</div>
</div>
</div>
</div>
</div>
<script>
        document.addEventListener('DOMContentLoaded', () => {
            const toggleBtn = document.getElementById('prompt-toggle');
            const content = document.getElementById('prompt-content');
            const chevron = document.getElementById('prompt-chevron');

            toggleBtn.addEventListener('click', () => {
                content.classList.toggle('expanded');
                if (content.classList.contains('expanded')) {
                    chevron.style.transform = 'rotate(180deg)';
                    chevron.style.color = '#06f9a8'; // Primary color
                } else {
                    chevron.style.transform = 'rotate(0deg)';
                    chevron.style.color = 'rgba(255, 255, 255, 0.5)';
                }
            });
        });
    </script>
</body></html>