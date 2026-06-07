<!DOCTYPE html>

<html class="dark" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Project Inspect Modal</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "primary": "#13ec49",
                        "background-light": "#f6f8f6",
                        "background-dark": "#102215",
                        "surface": "#111111",
                        "void": "#050505",
                        "muted": "#52525B",
                        "accent": "#FFB000",
                        "text-main": "#E4E4E7"
                    },
                    fontFamily: {
                        "display": ["Space Mono", "monospace"],
                        "body": ["Space Mono", "monospace"]
                    },
                    borderRadius: { "DEFAULT": "0.125rem", "lg": "0.25rem", "xl": "0.5rem", "full": "0.75rem", "sm": "0.125rem" },
                    animation: {
                        'blink': 'blink 1s step-end infinite',
                        'crt-flicker': 'crt-flicker 0.15s ease-in-out',
                    },
                    keyframes: {
                        blink: {
                            '0%, 100%': { opacity: '1' },
                            '50%': { opacity: '0' },
                        },
                        'crt-flicker': {
                            '0%': { opacity: '0.8' },
                            '50%': { opacity: '1' },
                            '100%': { opacity: '0.9' },
                        }
                    }
                },
            },
        }
    </script>
<style>
        body {
            background-color: #050505; /* True void black */
            color: #E4E4E7;
            font-family: 'Space Mono', monospace;
        }
        
        /* Custom scrollbar for brutalist look */
        ::-webkit-scrollbar {
            width: 8px;
        }
        ::-webkit-scrollbar-track {
            background: #050505;
            border-left: 1px solid #52525B;
        }
        ::-webkit-scrollbar-thumb {
            background: #52525B;
            border-radius: 0;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #13ec49;
        }

        .crt-shadow {
            box-shadow: inset 0 0 10px rgba(0,0,0,0.5);
        }
        
        .neon-hover:hover {
            box-shadow: 0 0 8px #13ec49;
            border-color: #13ec49;
        }
    </style>
</head>
<body class="min-h-screen flex items-center justify-center relative overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]">
<!-- Mock Background Content (to show blur effect) -->
<div class="absolute inset-0 z-0 opacity-30 pointer-events-none p-8 grid grid-cols-4 gap-4">
<!-- Mock cards -->
<div class="border border-muted p-4 h-32 bg-surface text-muted font-display text-xs">PROJECT_NODE_A</div>
<div class="border border-muted p-4 h-32 bg-surface text-muted font-display text-xs">PROJECT_NODE_B</div>
<div class="border border-muted p-4 h-32 bg-surface text-muted font-display text-xs">PROJECT_NODE_C</div>
<div class="border border-muted p-4 h-32 bg-surface text-muted font-display text-xs">PROJECT_NODE_D</div>
<div class="border border-muted p-4 h-32 bg-surface text-muted font-display text-xs">PROJECT_NODE_E</div>
<div class="border border-muted p-4 h-32 bg-surface text-muted font-display text-xs">PROJECT_NODE_F</div>
</div>
<!-- Overlay Backdrop -->
<div class="fixed inset-0 bg-void/80 backdrop-blur-sm z-10" id="modal-backdrop"></div>
<!-- Modal Container -->
<div aria-labelledby="modal-title" aria-modal="true" class="relative z-20 w-[90vw] md:w-[600px] bg-surface border border-muted shadow-[0_0_20px_rgba(0,0,0,0.8)] rounded-sm flex flex-col max-h-[921px] animate-crt-flicker" id="inspect-modal" role="dialog">
<!-- Terminal Header -->
<header class="flex items-center justify-between whitespace-nowrap border-b border-muted bg-[#111111] px-4 py-2 rounded-t-sm">
<div class="flex items-center gap-3 text-text-main">
<span class="material-symbols-outlined text-sm text-primary">terminal</span>
<h2 class="text-text-main text-sm font-bold leading-tight tracking-wide font-display" id="modal-title">Terminal - Vibe_C0der_Alpha</h2>
</div>
<button aria-label="Close modal" class="flex items-center justify-center cursor-pointer text-muted hover:text-primary transition-colors h-6 w-6 border border-transparent hover:border-primary rounded-sm" id="close-modal">
<span class="material-symbols-outlined text-sm" style="font-variation-settings: 'FILL' 0;">close</span>
</button>
</header>
<!-- Content Area -->
<div class="p-6 flex-1 overflow-y-auto crt-shadow">
<!-- Loading State (Initially hidden via JS, shown here for structure if needed, but PRD implies we see it before data) -->
<div class="hidden mb-6" id="loading-state">
<p class="text-primary text-sm font-display leading-normal">
                    &gt; DECRYPTING_PAYLOAD... <span class="animate-blink">_</span>
</p>
</div>
<!-- Metadata Table -->
<div class="space-y-0 border border-muted bg-void rounded-sm" id="metadata-content">
<!-- Row 1 -->
<div class="grid grid-cols-[120px_1fr] border-b border-muted group hover:bg-[#1a1a1a] transition-colors">
<div class="p-3 border-r border-muted text-primary text-xs font-bold font-display uppercase flex items-center">
                        AUTHOR:
                    </div>
<div class="p-3 text-text-main text-sm font-display break-all">
                        @0xNeoHack
                    </div>
</div>
<!-- Row 2 -->
<div class="grid grid-cols-[120px_1fr] border-b border-muted group hover:bg-[#1a1a1a] transition-colors">
<div class="p-3 border-r border-muted text-primary text-xs font-bold font-display uppercase flex items-center">
                        CREATED:
                    </div>
<div class="p-3 text-text-main text-sm font-display">
                        2023-10-27T08:42:11Z
                    </div>
</div>
<!-- Row 3 -->
<div class="grid grid-cols-[120px_1fr] border-b border-muted group hover:bg-[#1a1a1a] transition-colors">
<div class="p-3 border-r border-muted text-primary text-xs font-bold font-display uppercase flex items-center">
                        REPOSITORY:
                    </div>
<div class="p-3 text-sm font-display">
<a class="text-text-main hover:text-primary underline decoration-muted hover:decoration-primary underline-offset-4 transition-colors break-all" href="#">
                            github.com/0xNeoHack/vibe-coder-alpha
                        </a>
</div>
</div>
<!-- Row 4 -->
<div class="grid grid-cols-[120px_1fr] border-b border-muted group hover:bg-[#1a1a1a] transition-colors">
<div class="p-3 border-r border-muted text-primary text-xs font-bold font-display uppercase flex items-start pt-4">
                        TECH_STACK:
                    </div>
<div class="p-3 flex flex-wrap gap-2">
<span class="px-2 py-1 text-xs border border-muted text-text-main font-display">Next.js</span>
<span class="px-2 py-1 text-xs border border-muted text-text-main font-display">TypeScript</span>
<span class="px-2 py-1 text-xs border border-muted text-text-main font-display">OpenAI API</span>
<span class="px-2 py-1 text-xs border border-muted text-text-main font-display">Tailwind</span>
</div>
</div>
<!-- Row 5 -->
<div class="grid grid-cols-[120px_1fr] group hover:bg-[#1a1a1a] transition-colors">
<div class="p-3 border-r border-muted text-primary text-xs font-bold font-display uppercase flex items-center">
                        STATUS:
                    </div>
<div class="p-3 text-text-main text-sm font-display flex items-center gap-2">
<div class="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_8px_#13ec49]"></div>
                        ACTIVE_NODE
                    </div>
</div>
</div>
</div>
<!-- Action Bar / Footer -->
<div class="border-t border-muted bg-[#111111] p-4 flex justify-end rounded-b-sm">
<button class="h-10 bg-primary text-void px-6 text-sm font-bold font-display tracking-wide uppercase transition-all duration-200 hover:bg-void hover:text-primary border border-transparent hover:border-primary hover:shadow-[0_0_12px_#13ec49] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-void rounded-sm">
                [EXECUTE]
            </button>
</div>
</div>
<script>
        // Micro-interactions and state handling
        document.addEventListener('DOMContentLoaded', () => {
            const loadingState = document.getElementById('loading-state');
            const metadataContent = document.getElementById('metadata-content');
            
            // Simulate payload decryption
            loadingState.classList.remove('hidden');
            metadataContent.classList.add('opacity-0', 'transition-opacity', 'duration-500');
            
            setTimeout(() => {
                loadingState.classList.add('hidden');
                metadataContent.classList.remove('opacity-0');
            }, 800); // Simulated delay

            // Close modal logic (visual only for this demo)
            const closeModalBtn = document.getElementById('close-modal');
            const backdrop = document.getElementById('modal-backdrop');
            const modal = document.getElementById('inspect-modal');

            const closeModal = () => {
                modal.style.transform = 'scale(0.95)';
                modal.style.opacity = '0';
                modal.style.transition = 'all 0.2s ease-in-out';
                backdrop.style.opacity = '0';
                backdrop.style.transition = 'opacity 0.2s ease-in-out';
                
                setTimeout(() => {
                    modal.style.display = 'none';
                    backdrop.style.display = 'none';
                }, 200);
            };

            closeModalBtn.addEventListener('click', closeModal);
            backdrop.addEventListener('click', closeModal);

            // Escape key to close
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && modal.style.display !== 'none') {
                    closeModal();
                }
            });
        });
    </script>
</body></html>