<!DOCTYPE html>

<html class="dark" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Project Preview - DOC_PARSER_V2</title>
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
                        "background-dark": "#050505",
                        "surface": "#111111",
                        "text-main": "#E4E4E7",
                        "muted": "#52525B",
                        "accent": "#FFB000",
                    },
                    fontFamily: {
                        "display": ["Space Mono", "monospace"],
                        "body": ["Space Mono", "monospace"]
                    },
                    borderRadius: { "DEFAULT": "0.125rem", "sm": "0.125rem", "lg": "0.25rem", "xl": "0.5rem", "full": "0.75rem" },
                    boxShadow: {
                        'crt': 'inset 0 0 10px rgba(0,0,0,0.8)',
                        'glow': '0 0 8px #13ec49'
                    },
                    keyframes: {
                        flicker: {
                            '0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100%': { opacity: '1' },
                            '20%, 21.999%, 63%, 63.999%, 65%, 69.999%': { opacity: '0.4' },
                        },
                        slideUp: {
                            '0%': { transform: 'translateY(100vh)' },
                            '100%': { transform: 'translateY(0)' },
                        }
                    },
                    animation: {
                        'boot': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards, flicker 0.15s ease-in 0.3s forwards',
                        'flicker-only': 'flicker 0.15s ease-in'
                    }
                },
            },
        }
    </script>
<style>
        body {
            font-family: 'Space Mono', monospace;
            background-color: #050505;
            color: #E4E4E7;
            overflow: hidden; /* Prevent scrolling behind modal */
        }
        
        /* CRT Scanline overlay */
        .scanlines::before {
            content: " ";
            display: block;
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
            z-index: 10;
            background-size: 100% 2px, 3px 100%;
            pointer-events: none;
        }
    </style>
</head>
<body class="bg-background-dark min-h-screen relative w-full flex items-center justify-center">
<!-- Mock Background Catalog (Blurred) -->
<div class="absolute inset-0 z-0 grid grid-cols-4 gap-4 p-8 opacity-30 select-none">
<div class="border border-muted p-4 h-48"></div>
<div class="border border-muted p-4 h-48"></div>
<div class="border border-muted p-4 h-48"></div>
<div class="border border-muted p-4 h-48"></div>
<div class="border border-muted p-4 h-48"></div>
<div class="border border-muted p-4 h-48"></div>
<div class="border border-muted p-4 h-48"></div>
<div class="border border-muted p-4 h-48"></div>
</div>
<!-- Modal Backdrop -->
<div class="fixed inset-0 z-40 bg-background-dark/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-8" id="modal-backdrop">
<!-- Modal Container -->
<div aria-labelledby="modal-title" aria-modal="true" class="w-[90vw] h-[921px] bg-surface border border-muted rounded-sm flex flex-col shadow-2xl relative overflow-hidden animate-boot" role="dialog">
<!-- Structural lines -->
<div class="absolute top-0 left-0 w-full h-[1px] bg-primary/20"></div>
<div class="absolute bottom-0 left-0 w-full h-[1px] bg-primary/20"></div>
<div class="absolute top-0 left-0 h-full w-[1px] bg-primary/20"></div>
<div class="absolute top-0 right-0 h-full w-[1px] bg-primary/20"></div>
<!-- Header -->
<header class="flex items-center justify-between border-b border-muted bg-[#111111] px-4 py-3 shrink-0 relative z-20">
<div class="flex items-center gap-3">
<span class="text-primary material-symbols-outlined text-xl">terminal</span>
<h2 class="text-text-main text-sm md:text-base font-bold uppercase tracking-wider" id="modal-title">Terminal - DOC_PARSER_V2</h2>
</div>
<div class="flex items-center gap-6">
<div class="hidden sm:flex items-center gap-2">
<span class="text-muted text-xs">AUTHOR:</span>
<span class="text-text-main text-xs font-bold">_VOID_HACKER</span>
</div>
<button aria-label="Close modal" class="text-muted hover:text-primary transition-colors flex items-center justify-center">
<span class="material-symbols-outlined text-xl" data-icon="close">close</span>
</button>
</div>
</header>
<!-- Preview Area -->
<div class="flex-1 relative bg-background-dark overflow-hidden p-2 sm:p-4 z-10 flex flex-col">
<!-- Inner frame -->
<div class="w-full h-full border border-muted relative shadow-crt scanlines bg-[#0a0a0a] flex items-center justify-center overflow-hidden">
<!-- Loading State (Initially visible, hides when image loads) -->
<div class="absolute inset-0 flex flex-col items-center justify-center z-20 bg-[#0a0a0a]" id="preview-loader">
<p class="text-primary text-sm mb-4 animate-pulse">INITIATING_PREVIEW_STREAM...</p>
<p class="text-muted text-xs font-mono tracking-widest">[██████░░░░]</p>
</div>
<!-- Placeholder Image (Simulating iframe) -->
<img alt="A high-contrast, brutalist interface showing dense data visualization grids. The aesthetic is dark mode, featuring a deep void black background with sharp neon green accents. Monospaced terminal typography fills the screen alongside wireframe geometric shapes. The mood is highly technical, reminiscent of an underground hacker terminal or advanced AI monitoring dashboard." class="w-full h-full object-cover object-left-top opacity-0 transition-opacity duration-700 absolute inset-0 z-10" data-alt="A high-contrast, brutalist interface showing dense data visualization grids. The aesthetic is dark mode, featuring a deep void black background with sharp neon green accents. Monospaced terminal typography fills the screen alongside wireframe geometric shapes. The mood is highly technical, reminiscent of an underground hacker terminal or advanced AI monitoring dashboard." onload="document.getElementById('preview-loader').style.display='none'; this.classList.remove('opacity-0');" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBf3tPgQWHX4FrZ85tbGZmnAO_gjjElG7efLtxdepEzOr5RnnWNVtC4OtrFUA6ywAJMUV5DLEBJkDvn4lWiSjJucmwm-2G_vQVDW6GG9V8J2VEpNnmq1mQhhSHpJzSiEdIvY4eEEDHd3XS5cr94z32kO7VwHjXCXkqNwtm2o7v9bKQFALWJzDdWgiiN7vCUSIRvBlSBI7FzlNKq4IXdp71XdE8_-2iseFRfxsEjQ1doEq1iV_43jmzAQTClr_W8Q4BiNu8e1djaRw"/>
</div>
</div>
<!-- Action Bar -->
<footer class="border-t border-muted bg-surface p-4 flex items-center justify-between shrink-0 relative z-20">
<div class="flex items-center gap-4 text-xs text-muted">
<span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span> SYSTEM_ONLINE</span>
<span class="hidden sm:inline">| STATUS: 200 OK</span>
</div>
<a class="group relative px-6 py-2.5 bg-primary text-background-dark font-bold text-sm uppercase tracking-wider overflow-hidden rounded-sm transition-all hover:shadow-glow inline-flex items-center gap-2" href="#">
<span class="relative z-10 flex items-center gap-2">
<span class="opacity-70">&gt;</span> VISIT_WEBSITE
                    </span>
<!-- Hover effect background -->
<div class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-200 ease-out z-0"></div>
</a>
</footer>
</div>
</div>
<script>
        // Simple script to handle close interaction for demonstration
        document.querySelector('button[aria-label="Close modal"]').addEventListener('click', () => {
            const modal = document.querySelector('.animate-boot');
            modal.style.transform = 'translateY(100vh)';
            modal.style.transition = 'transform 0.3s ease-in';
            setTimeout(() => {
                document.getElementById('modal-backdrop').style.display = 'none';
            }, 300);
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelector('button[aria-label="Close modal"]').click();
            }
        });
    </script>
</body></html>