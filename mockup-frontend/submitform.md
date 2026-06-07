<!DOCTYPE html>

<html class="dark" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Submit Project Form | VIBE_INDEX</title>
<link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;600;700&amp;family=Space+Mono:wght@400;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "primary": "#00FF41",
                        "background": "#050505",
                        "surface": "#111111",
                        "text-main": "#E4E4E7",
                        "muted": "#52525B",
                        "accent": "#FFB000",
                    },
                    fontFamily: {
                        "heading": ["Fira Code", "monospace"],
                        "body": ["Space Mono", "monospace"],
                    },
                    borderRadius: {
                        "none": "0px",
                        "sm": "0px",
                        DEFAULT: "0px",
                        "md": "0px",
                        "lg": "0px",
                        "xl": "0px",
                        "2xl": "0px",
                        "3xl": "0px",
                        "full": "0px",
                    },
                    boxShadow: {
                        'neon': '0 0 8px #00FF41',
                    }
                },
            },
        }
    </script>
<style>
        body {
            background-color: var(--color-background, #050505);
            color: var(--color-text-main, #E4E4E7);
            font-family: 'Space Mono', monospace;
        }
        h1, h2, h3, h4, h5, h6, .font-heading {
            font-family: 'Fira Code', monospace;
        }
        
        /* CRT Glow Effect for active inputs */
        .input-group:focus-within label {
            color: #00FF41;
            transform: translateY(-4px);
        }
        .input-group label {
            transition: all 0.2s ease-in-out;
        }

        .input-field {
            border: none;
            border-bottom: 1px solid #52525B;
            background: transparent;
            color: #E4E4E7;
            font-family: 'Space Mono', monospace;
            border-radius: 0;
            padding-left: 0;
            padding-right: 0;
        }
        
        .input-field:focus {
            outline: none;
            box-shadow: none;
            border-color: #00FF41;
        }

        /* Success Flash Animation */
        @keyframes successFlash {
            0% { border-color: transparent; }
            50% { border-color: #00FF41; box-shadow: inset 0 0 20px rgba(0, 255, 65, 0.5); }
            100% { border-color: transparent; }
        }
        
        .flash-success {
            animation: successFlash 0.3s ease-out;
            border: 2px solid transparent;
        }

        /* Nav link hover */
        .nav-link:hover::before {
            content: "> ";
            color: #00FF41;
        }
    </style>
</head>
<body class="min-h-screen w-full flex flex-col items-center justify-start flash-success-target overflow-x-hidden selection:bg-primary selection:text-background border-2 border-transparent">
<!-- Explicitly excluded TopAppBar as this is a focused form view -->
<!-- Minimal Header (Back-to-Main Exception) -->
<header class="w-full max-w-[800px] flex items-center justify-between px-6 py-8">
<a class="nav-link text-text-main font-heading font-semibold text-sm uppercase tracking-wide hover:text-primary transition-colors flex items-center gap-2" href="#">
<span class="material-symbols-outlined text-sm" data-icon="arrow_back" data-weight="fill" style="font-variation-settings: 'FILL' 1;">arrow_back</span>
            cd ../
        </a>
</header>
<main class="w-full max-w-[600px] flex-1 px-6 pb-20 flex flex-col">
<!-- Banner -->
<div class="mb-12">
<h1 class="text-primary font-heading font-bold text-[32px] md:text-[48px] uppercase tracking-tighter leading-none mb-4">
                &gt; APPEND_DB
            </h1>
<p class="text-muted text-sm border-l-2 border-accent pl-4 py-1">
                // Input raw project telemetry.<br/>
                // Awaiting validated payload...
            </p>
</div>
<!-- Form -->
<form class="space-y-8 flex flex-col flex-1" id="submit-form">
<div class="input-group flex flex-col relative pt-4">
<label class="absolute top-0 text-muted text-xs font-heading font-semibold uppercase tracking-wider" for="project_url">PROJECT_URL [required]</label>
<input class="input-field w-full h-10 mt-2 placeholder:text-muted/50" id="project_url" name="project_url" placeholder="https://" required="" type="url"/>
</div>
<div class="input-group flex flex-col relative pt-4">
<label class="absolute top-0 text-muted text-xs font-heading font-semibold uppercase tracking-wider" for="project_title">PROJECT_TITLE [required]</label>
<input class="input-field w-full h-10 mt-2 placeholder:text-muted/50" id="project_title" name="project_title" placeholder="Terminal Aesthetic Generator" required="" type="text"/>
</div>
<div class="input-group flex flex-col relative pt-4">
<label class="absolute top-0 text-muted text-xs font-heading font-semibold uppercase tracking-wider" for="author_id">AUTHOR_ID</label>
<input class="input-field w-full h-10 mt-2 placeholder:text-muted/50" id="author_id" name="author_id" placeholder="@username" type="text"/>
</div>
<div class="input-group flex flex-col relative pt-4">
<label class="absolute top-0 text-muted text-xs font-heading font-semibold uppercase tracking-wider" for="description">DESCRIPTION</label>
<textarea class="input-field w-full mt-2 placeholder:text-muted/50 resize-none" id="description" name="description" placeholder="Brief summary of the tool or project..." rows="3"></textarea>
</div>
<div class="input-group flex flex-col relative pt-4">
<label class="absolute top-0 text-muted text-xs font-heading font-semibold uppercase tracking-wider" for="categories">TAGS [comma separated]</label>
<input class="input-field w-full h-10 mt-2 placeholder:text-muted/50" id="categories" name="categories" placeholder="AI, UI, GENERATOR" type="text"/>
</div>
<div class="mt-auto pt-12">
<button class="w-full bg-surface border border-muted hover:border-primary hover:text-primary hover:shadow-neon text-text-main font-heading font-bold text-sm uppercase tracking-wider py-4 transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-primary flex items-center justify-center gap-2 group" id="submit-btn" type="submit">
<span class="group-hover:animate-pulse">&gt;</span> WRITE_TO_DISK
                </button>
</div>
</form>
</main>
<script>
        document.addEventListener('DOMContentLoaded', () => {
            const form = document.getElementById('submit-form');
            const submitBtn = document.getElementById('submit-btn');
            const body = document.querySelector('.flash-success-target');

            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Simulate Loading
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<span class="animate-pulse">_</span> PROCESSING_TRANSACTION...';
                submitBtn.classList.add('text-accent', 'border-accent');
                submitBtn.disabled = true;

                // Simulate API Call
                setTimeout(() => {
                    // Reset Button
                    submitBtn.innerHTML = originalText;
                    submitBtn.classList.remove('text-accent', 'border-accent');
                    submitBtn.disabled = false;
                    
                    // Clear Form
                    form.reset();

                    // Flash Success
                    body.classList.add('flash-success');
                    setTimeout(() => {
                        body.classList.remove('flash-success');
                    }, 300);

                }, 1200);
            });
        });
    </script>
</body></html>