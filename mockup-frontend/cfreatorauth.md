<!DOCTYPE html>

<html class="dark" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>VIBEDIR_TERMINAL // AUTH_GATE</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&amp;family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@100..900&amp;display=swap" rel="stylesheet"/>
<style>
        @keyframes pulse-glow {
            0% { box-shadow: 0 0 5px rgba(158, 255, 153, 0.2); }
            50% { box-shadow: 0 0 20px rgba(158, 255, 153, 0.6); }
            100% { box-shadow: 0 0 5px rgba(158, 255, 153, 0.2); }
        }
        .glow-pulse:hover {
            animation: pulse-glow 1.5s infinite;
        }
        .terminal-cursor {
            display: inline-block;
            width: 8px;
            height: 1.2em;
            background-color: #9eff99;
            animation: blink 1s step-end infinite;
            vertical-align: middle;
        }
        @keyframes blink {
            from, to { opacity: 1; }
            50% { opacity: 0; }
        }
        .scanline {
            width: 100%;
            height: 2px;
            background: rgba(158, 255, 153, 0.1);
            position: absolute;
            top: 0;
            left: 0;
            pointer-events: none;
            animation: scan 8s linear infinite;
        }
        @keyframes scan {
            0% { top: 0; }
            100% { top: 100%; }
        }
        body {
            background-color: #050505;
            overflow: hidden;
        }
        .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: #111111;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #52525B;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #9eff99;
        }
    </style>
<script id="tailwind-config">
        tailwind.config = {
          darkMode: "class",
          theme: {
            extend: {
              "colors": {
                      "tertiary-container": "#ffbea0",
                      "on-surface": "#dae6d4",
                      "on-secondary-container": "#694600",
                      "surface-bright": "#323c2f",
                      "primary-glow": "rgba(19, 236, 73, 0.2)",
                      "surface-container-high": "#232d21",
                      "surface-container-highest": "#2d372b",
                      "secondary": "#ffd393",
                      "surface-container-low": "#141e13",
                      "error-container": "#93000a",
                      "on-primary-fixed-variant": "#005313",
                      "outline-variant": "#3c4b39",
                      "on-tertiary": "#4d2611",
                      "surface-variant": "#2d372b",
                      "background": "#0c160b",
                      "surface-container": "#182217",
                      "on-primary-container": "#006519",
                      "surface-tint": "#00e545",
                      "on-tertiary-fixed-variant": "#683b25",
                      "primary-fixed": "#70ff76",
                      "on-surface-variant": "#bacbb4",
                      "surface": "#0c160b",
                      "tertiary-fixed": "#ffdbcc",
                      "surface-container-lowest": "#071007",
                      "on-error": "#690005",
                      "on-tertiary-container": "#7a4b33",
                      "text-main": "#E4E4E7",
                      "on-primary-fixed": "#002204",
                      "on-secondary-fixed": "#281800",
                      "inverse-primary": "#006e1c",
                      "tertiary-fixed-dim": "#f8b89a",
                      "secondary-container": "#fdaf00",
                      "background-dark": "#050505",
                      "secondary-fixed-dim": "#ffba43",
                      "surface-base": "#111111",
                      "primary-container": "#13ec49",
                      "primary": "#9eff99",
                      "on-background": "#dae6d4",
                      "tertiary": "#ffe3d7",
                      "error": "#ffb4ab",
                      "on-primary": "#00390a",
                      "inverse-on-surface": "#293327",
                      "outline": "#859580",
                      "primary-fixed-dim": "#00e545",
                      "surface-dim": "#0c160b",
                      "inverse-surface": "#dae6d4",
                      "on-secondary": "#432c00",
                      "muted-gray": "#52525B",
                      "on-tertiary-fixed": "#331202",
                      "on-secondary-fixed-variant": "#614000",
                      "on-error-container": "#ffdad6",
                      "secondary-fixed": "#ffddaf"
              },
              "borderRadius": {
                      "DEFAULT": "0px",
                      "lg": "0px",
                      "xl": "0px",
                      "full": "9999px"
              },
              "spacing": {
                      "header-height": "64px",
                      "unit": "4px",
                      "gutter": "16px",
                      "sidebar-width": "250px",
                      "container-padding": "24px"
              },
              "fontFamily": {
                      "headline-md": ["Space Mono"],
                      "label-code": ["Space Mono"],
                      "headline-xl": ["Space Mono"],
                      "body-base": ["Space Mono"],
                      "body-sm": ["Space Mono"]
              },
              "fontSize": {
                      "headline-md": ["16px", {"lineHeight": "24px", "letterSpacing": "0.02em", "fontWeight": "700"}],
                      "label-code": ["10px", {"lineHeight": "12px", "letterSpacing": "0.1em", "fontWeight": "700"}],
                      "headline-xl": ["20px", {"lineHeight": "28px", "letterSpacing": "0.05em", "fontWeight": "700"}],
                      "body-base": ["14px", {"lineHeight": "20px", "fontWeight": "400"}],
                      "body-sm": ["12px", {"lineHeight": "18px", "fontWeight": "400"}]
              }
            },
          },
        }
    </script>
</head>
<body class="bg-background-dark text-on-surface font-body-base antialiased flex items-center justify-center min-h-screen">
<!-- ATMOSPHERIC ELEMENTS -->
<div class="scanline"></div>
<div class="fixed inset-0 pointer-events-none opacity-10 overflow-hidden select-none font-label-code text-muted-gray" id="background-stream">
<!-- JS populated stream -->
</div>
<!-- MAIN LOGIN CONTAINER -->
<main class="relative z-10 w-full max-w-md p-gutter">
<!-- BRANDING HEADER -->
<div class="mb-8 text-center">
<h1 class="font-headline-xl text-headline-xl text-primary tracking-tighter uppercase mb-2">
                VIBEDIR_TERMINAL_V1.0.4
            </h1>
<div class="flex items-center justify-center gap-2 font-label-code text-muted-gray uppercase tracking-widest">
<span class="material-symbols-outlined text-[14px]">sensors</span>
                SYSTEM_STATUS: ONLINE
                <span class="mx-2">|</span>
                UPLINK_STABLE
            </div>
</div>
<!-- LOGIN CARD -->
<div class="bg-surface-base border border-muted-gray p-8 relative">
<!-- Decorative Corners -->
<div class="absolute -top-px -left-px w-2 h-2 bg-primary"></div>
<div class="absolute -top-px -right-px w-2 h-2 bg-primary"></div>
<div class="absolute -bottom-px -left-px w-2 h-2 bg-primary"></div>
<div class="absolute -bottom-px -right-px w-2 h-2 bg-primary"></div>
<!-- Header Info -->
<div class="mb-10 border-b border-dashed border-muted-gray pb-4">
<div class="font-label-code text-primary uppercase mb-1">PROMPT_SEQUENCE_REQUESTED</div>
<div class="font-body-sm text-muted-gray uppercase">Enter credentials for secure environment access.</div>
</div>
<!-- AUTH FORM -->
<form class="space-y-8" id="auth_form">
<!-- DEVELOPER_ID -->
<div class="relative group">
<label class="block font-label-code text-primary uppercase mb-2 tracking-widest" for="dev_id">
                        [01] DEVELOPER_ID:
                    </label>
<div class="flex items-center border border-muted-gray focus-within:border-primary transition-colors bg-surface-container-lowest">
<span class="pl-4 font-headline-md text-primary">&gt;</span>
<input class="w-full bg-transparent border-none focus:ring-0 text-primary font-headline-md uppercase placeholder:opacity-30 placeholder:text-muted-gray" id="dev_id" placeholder="UID_XXXXX" required="" type="text"/>
</div>
</div>
<!-- ACCESS_KEY -->
<div class="relative group">
<label class="block font-label-code text-primary uppercase mb-2 tracking-widest" for="access_key">
                        [02] ACCESS_KEY:
                    </label>
<div class="flex items-center border border-muted-gray focus-within:border-primary transition-colors bg-surface-container-lowest">
<span class="pl-4 font-headline-md text-primary">&gt;</span>
<input class="w-full bg-transparent border-none focus:ring-0 text-primary font-headline-md placeholder:opacity-30 placeholder:text-muted-gray" id="access_key" placeholder="********" required="" type="password"/>
</div>
</div>
<!-- BUTTONS -->
<div class="pt-4 space-y-4">
<button class="w-full py-4 bg-primary text-on-primary font-headline-md uppercase glow-pulse active:scale-95 transition-all duration-150 flex items-center justify-center gap-2" type="submit">
                        [AUTH_INITIATE]
                        <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">terminal</span>
</button>
<div class="flex justify-between items-center">
<a class="font-label-code text-muted-gray hover:text-primary transition-colors uppercase decoration-dashed underline underline-offset-4" href="#">
                            ERROR_RECOVERY
                        </a>
<div class="flex items-center gap-2 font-label-code text-primary-fixed-dim uppercase opacity-80">
<span class="material-symbols-outlined text-[14px]" style="font-variation-settings: 'FILL' 1;">lock</span>
                            ENCRYPTION_STATUS: SECURE
                        </div>
</div>
</div>
</form>
</div>
<!-- FOOTER METADATA -->
<div class="mt-8 flex flex-col gap-2 font-label-code text-muted-gray uppercase text-center opacity-50">
<div>LOCAL_TIME: <span id="timestamp">--:--:--</span></div>
<div>KERNEL_REF: 0x8823_CYBER_BRUTAL_BUILD</div>
<div class="mt-4 flex justify-center gap-4">
<span class="hover:text-primary cursor-pointer transition-colors">[DOCS]</span>
<span class="hover:text-primary cursor-pointer transition-colors">[GITS]</span>
<span class="hover:text-primary cursor-pointer transition-colors">[SUPPORT]</span>
</div>
</div>
</main>
<!-- LOADING OVERLAY (Hidden by default) -->
<div class="hidden fixed inset-0 z-50 bg-background-dark/90 backdrop-blur-sm flex flex-col items-center justify-center" id="loading_overlay">
<div class="w-64">
<div class="font-headline-md text-primary mb-2 text-center">INITIALIZING_SESSION...</div>
<div class="h-1 w-full bg-muted-gray overflow-hidden">
<div class="h-full bg-primary animate-[shimmer_2s_infinite]" style="width: 30%; background-image: linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent); animation: slide 1.5s infinite linear;"></div>
</div>
<style>@keyframes slide { from { transform: translateX(-100%); } to { transform: translateX(300%); } }</style>
</div>
</div>
<script>
        // BACKGROUND DATA STREAM EFFECT
        const streamContainer = document.getElementById('background-stream');
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+<>?:{}|';
        const dataLines = 40;

        function generateLine() {
            let line = '';
            for(let i=0; i<120; i++) {
                line += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return line;
        }

        function initBackground() {
            for(let i=0; i<dataLines; i++) {
                const div = document.createElement('div');
                div.className = 'whitespace-nowrap leading-tight transition-opacity duration-1000';
                div.textContent = generateLine();
                div.style.fontSize = (Math.random() * 4 + 8) + 'px';
                div.style.transform = `translateX(${Math.random() * 10 - 5}%)`;
                streamContainer.appendChild(div);
            }
        }

        function updateBackground() {
            const lines = streamContainer.children;
            const target = lines[Math.floor(Math.random() * lines.length)];
            target.textContent = generateLine();
        }

        // TIMESTAMP
        function updateTime() {
            const now = new Date();
            document.getElementById('timestamp').textContent = now.toTimeString().split(' ')[0];
        }

        // FORM SUBMIT HANDLER
        const authForm = document.getElementById('auth_form');
        const loadingOverlay = document.getElementById('loading_overlay');

        authForm.addEventListener('submit', (e) => {
            e.preventDefault();
            loadingOverlay.classList.remove('hidden');
            
            // Artificial delay to simulate terminal processing
            setTimeout(() => {
                alert('ACCESS_GRANTED: REDIRECTING_TO_DASHBOARD...');
                loadingOverlay.classList.add('hidden');
            }, 2500);
        });

        // INIT
        initBackground();
        setInterval(updateBackground, 100);
        setInterval(updateTime, 1000);
        updateTime();
    </script>
<!-- IMAGE PLACEHOLDER AS SPECIFIED -->
<div class="hidden">
<img data-alt="A gritty cyberpunk terminal display showing complex data streams and green glowing code fragments on a pitch-black screen. The visual style is retro-futuristic with a high-contrast brutalist aesthetic, featuring grid lines and technical UI elements. The lighting is dominated by a neon-green monitor glow reflecting off a cold industrial metal surface. The mood is tense, technical, and high-utility." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBeRqaiaGt7p67awYQfQq1DpIJBW6IRvodAU5OjdZ3IjPg7BuoU1dFq24YCUMHNFCnXHeFUm8PI3GxdjOlxodMGZrxIs7DxJj3LWbpAruZqyDjs8qG4qKuG8mhuliMb7_pfN1AcCg5GGKuvYhotacgTcTjJEDlxXP2HjA2UmHxZFSxR6Hyu2WnFoHJVa3vRxzDU2xUD_BmExV81HT4TBFDR3agJZ0MJcyWl7lqoHUJVU_pUDlzFI-4tyTFXClK6hLnlBT1zOBdHvw"/>
</div>
</body></html>