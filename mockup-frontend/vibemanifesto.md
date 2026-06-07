<!DOCTYPE html>

<html class="dark" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Vibe Manifesto - Terminal Directory</title>
<!-- Fonts -->
<link href="https://fonts.googleapis.com" rel="preconnect"/>
<link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
<link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;600;700&amp;family=Space+Mono:ital,wght@0,400;0,700;1,400&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<!-- Tailwind CSS -->
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<!-- Theme Configuration -->
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "primary": "#00FF41",
                        "background-light": "#111111",
                        "background-dark": "#050505",
                        "surface": "#111111",
                        "text-main": "#E4E4E7",
                        "muted": "#52525B",
                        "accent": "#FFB000",
                    },
                    fontFamily: {
                        "heading": ["'Fira Code'", "monospace"],
                        "body": ["'Space Mono'", "monospace"],
                    },
                    borderRadius: {
                        "DEFAULT": "0px",
                        "sm": "0px",
                        "md": "0px",
                        "lg": "0px",
                        "xl": "0px",
                        "2xl": "0px",
                        "3xl": "0px",
                        "full": "0px"
                    },
                },
            },
        }
    </script>
<style>
        /* Terminal aesthetics base rules */
        body {
            background-color: #050505;
            color: #E4E4E7;
            font-family: 'Space Mono', monospace;
        }

        h1, h2, h3, h4, h5, h6, .font-heading {
            font-family: 'Fira Code', monospace;
        }

        /* CRT effects */
        .crt-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
            background-size: 100% 2px, 3px 100%;
            z-index: 50;
            pointer-events: none;
            opacity: 0.15;
        }

        /* Text selection */
        ::selection {
            background-color: #00FF41;
            color: #050505;
        }

        /* Nav hover effect */
        .nav-link:hover::before {
            content: "> ";
            color: #00FF41;
        }
    </style>
</head>
<body class="min-h-screen overflow-x-hidden selection:bg-primary selection:text-background-dark">
<div class="crt-overlay"></div>
<div class="max-w-[800px] mx-auto px-6 py-12 md:px-12 md:py-20 flex flex-col items-start min-h-screen border-l border-r border-muted/30 bg-background-dark relative">
<!-- Navigation Header -->
<nav class="mb-16 w-full flex items-center justify-between border-b border-muted pb-4">
<a class="nav-link text-primary font-heading font-bold uppercase tracking-widest flex items-center gap-2 group transition-colors" href="#">
<span class="material-symbols-outlined text-xl transition-transform group-hover:-translate-x-1" data-icon="arrow_back">arrow_back</span>
<span>cd ../</span>
</a>
<div class="text-muted font-body text-xs">
                [SYSTEM_STATUS: ONLINE]
            </div>
</nav>
<!-- Main Content Column -->
<main class="w-full max-w-[65ch] text-left flex flex-col gap-8">
<!-- Oversized Title -->
<header>
<h1 class="font-heading font-bold text-5xl md:text-6xl text-text-main tracking-tighter uppercase mb-2 drop-shadow-[0_0_8px_rgba(228,228,231,0.2)]">
                    readme.md
                </h1>
<div class="h-px w-full bg-muted mt-6"></div>
</header>
<!-- ASCII Art Banner -->
<pre class="text-primary font-body text-xs md:text-sm leading-tight whitespace-pre overflow-x-auto py-4 select-none drop-shadow-[0_0_8px_rgba(0,255,65,0.4)]">  ____  _                  ____          _ _             
 |  _ \(_)                / ___|        | (_)            
 | |_) |_  __ _ _ __ ___ | |     ___  __| |_ _ __   __ _ 
 |  _ &lt;| |/ _` | '__/ _ \| |    / _ \/ _` | | '_ \ / _` |
 | |_) | | (_| | | |  __/| |___| (_) | (_| | | | | | (_| |
 |____/|_|\__, |_|  \___| \____|\___/ \__,_|_|_| |_|\__, |
           __/ |                                     __/ |
          |___/                                     |___/ 
            </pre>
<!-- Manifesto Body -->
<article class="prose prose-invert max-w-none flex flex-col gap-6 font-body text-sm md:text-base leading-relaxed text-text-main/90">
<p>
                    The old world of software engineering was defined by rigid structures, exhaustive planning, and exhaustive syntax memorization. It was a world of friction. 
                </p>
<p>
<strong class="text-primary font-heading font-bold">Vibe coding</strong> is the rejection of that friction. It is the realization that the AI is an extension of intuition, a copilot that translates intent into executable reality at the speed of thought. Pure signal, zero noise.
                </p>
<div class="bg-surface p-4 border-l-2 border-accent text-muted my-4 font-body text-sm shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]">
<p class="mb-2 uppercase font-heading text-xs text-accent">&gt;&gt; Directive_01:</p>
<code class="text-text-main">Stop writing boilerplate. Start steering the model.</code>
</div>
<p>
                    We built this directory not as a marketplace, but as an arsenal. A curated index of tools, scripts, and frameworks forged by hackers riding the wave of AI-assisted creation. If a tool doesn't reduce cognitive load or accelerate the feedback loop between brain and browser, it doesn't belong here.
                </p>
<p>
                    The terminal aesthetic isn't just nostalgia; it's a statement of purpose. It represents a return to the raw metal of computation, stripped of bloated UI patterns and marketing copy. It demands technical literacy and rewards efficiency.
                </p>
<div class="bg-surface p-4 border-l-2 border-accent text-muted my-4 font-body text-sm shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]">
<p class="mb-2 uppercase font-heading text-xs text-accent">&gt;&gt; Payload_Example:</p>
<pre><code class="text-primary font-body">function synthesize_intent(prompt) {
  const pure_signal = remove_noise(prompt);
  return generate_reality(pure_signal);
}

// Execute immediately
synthesize_intent('build the future');</code></pre>
</div>
<p>
                    Submit your projects. Inspect the payload. Clone the repos. The directory is appended continuously. Stay in the flow state.
                </p>
<p class="text-primary mt-4 font-heading animate-pulse">
                    &gt; EOF_
                </p>
</article>
</main>
<!-- Footer Spacer -->
<footer class="mt-20 w-full border-t border-muted pt-6 flex justify-between items-center text-xs text-muted font-heading uppercase">
<span>[DIR_SIZE: 1.4TB]</span>
<span>[ENCRYPTED: TRUE]</span>
</footer>
</div>
</body></html>