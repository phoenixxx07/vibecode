<!DOCTYPE html>

<html class="dark" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>VibeDir Terminal - Overview</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "tertiary-fixed": "#ffdbcc",
                        "on-primary-fixed": "#002204",
                        "tertiary": "#ffe3d7",
                        "on-error-container": "#ffdad6",
                        "muted-gray": "#52525B",
                        "secondary": "#ffd393",
                        "tertiary-container": "#ffbea0",
                        "primary-glow": "rgba(19, 236, 73, 0.2)",
                        "secondary-container": "#fdaf00",
                        "on-tertiary-container": "#7a4b33",
                        "on-tertiary-fixed-variant": "#683b25",
                        "secondary-fixed": "#ffddaf",
                        "outline": "#859580",
                        "on-background": "#dae6d4",
                        "inverse-on-surface": "#293327",
                        "background": "#0c160b",
                        "inverse-primary": "#006e1c",
                        "on-secondary-container": "#694600",
                        "surface-container-low": "#141e13",
                        "on-secondary-fixed": "#281800",
                        "surface-base": "#111111",
                        "error": "#ffb4ab",
                        "inverse-surface": "#dae6d4",
                        "on-primary-container": "#006519",
                        "on-primary": "#00390a",
                        "on-secondary": "#432c00",
                        "on-surface-variant": "#bacbb4",
                        "on-tertiary": "#4d2611",
                        "outline-variant": "#3c4b39",
                        "surface-tint": "#00e545",
                        "tertiary-fixed-dim": "#f8b89a",
                        "on-primary-fixed-variant": "#005313",
                        "surface-container-highest": "#2d372b",
                        "surface-variant": "#2d372b",
                        "background-dark": "#050505",
                        "on-surface": "#dae6d4",
                        "surface-dim": "#0c160b",
                        "primary-fixed": "#70ff76",
                        "surface-container": "#182217",
                        "surface": "#0c160b",
                        "surface-container-high": "#232d21",
                        "on-tertiary-fixed": "#331202",
                        "surface-bright": "#323c2f",
                        "text-main": "#E4E4E7",
                        "surface-container-lowest": "#071007",
                        "error-container": "#93000a",
                        "secondary-fixed-dim": "#ffba43",
                        "primary-fixed-dim": "#00e545",
                        "on-error": "#690005",
                        "primary-container": "#13ec49",
                        "primary": "#9eff99",
                        "on-secondary-fixed-variant": "#614000"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "full": "9999px"
                    },
                    "spacing": {
                        "container-padding": "24px",
                        "unit": "4px",
                        "header-height": "64px",
                        "gutter": "16px",
                        "sidebar-width": "250px"
                    },
                    "fontFamily": {
                        "body-base": ["Space Mono"],
                        "headline-md": ["Space Mono"],
                        "label-code": ["Space Mono"],
                        "body-sm": ["Space Mono"],
                        "headline-xl": ["Space Mono"]
                    },
                    "fontSize": {
                        "body-base": ["14px", { "lineHeight": "20px", "fontWeight": "400" }],
                        "headline-md": ["16px", { "lineHeight": "24px", "letterSpacing": "0.02em", "fontWeight": "700" }],
                        "label-code": ["10px", { "lineHeight": "12px", "letterSpacing": "0.1em", "fontWeight": "700" }],
                        "body-sm": ["12px", { "lineHeight": "18px", "fontWeight": "400" }],
                        "headline-xl": ["20px", { "lineHeight": "28px", "letterSpacing": "0.05em", "fontWeight": "700" }]
                    }
                }
            }
        }
    </script>
<style>
        /* Cyber-Brutalism specific overrides that tailwind config doesn't perfectly capture */
        body {
            background-color: #050505;
            color: #dae6d4;
            /* Subtle CRT Vignette */
            background-image: radial-gradient(circle at center, rgba(17,17,17,0) 40%, rgba(5,5,5,1) 100%);
            min-height: 100vh;
        }

        .neon-glow:hover {
            box-shadow: 0 0 8px #9eff99;
            border-color: #9eff99;
        }

        .terminal-input:focus {
            outline: none;
            border-color: #9eff99;
            box-shadow: 0 0 8px rgba(158, 255, 153, 0.5);
        }

        /* Custom Scrollbar */
        ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }
        ::-webkit-scrollbar-track {
            background: #111111;
            border-left: 1px solid #52525B;
        }
        ::-webkit-scrollbar-thumb {
            background: #52525B;
            border: 1px solid #111111;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #9eff99;
            box-shadow: 0 0 8px #9eff99;
        }

        /* Scanline effect */
        .scanlines {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: linear-gradient(
                to bottom,
                rgba(255,255,255,0),
                rgba(255,255,255,0) 50%,
                rgba(0,0,0,0.1) 50%,
                rgba(0,0,0,0.1)
            );
            background-size: 100% 4px;
            pointer-events: none;
            z-index: 9999;
        }

        .blink {
            animation: blinker 1s linear infinite;
        }
        @keyframes blinker {
            50% { opacity: 0; }
        }
    </style>
</head>
<body class="font-body-base text-body-base selection:bg-primary selection:text-background overflow-x-hidden">
<div class="scanlines"></div>
<!-- TopAppBar -->
<header class="bg-surface-container-low dark:bg-surface-container-low fixed top-0 w-full z-50 border-b border-muted-gray flex justify-between items-center h-header-height px-container-padding">
<div class="flex items-center gap-4">
<!-- Mobile Menu Toggle (Visible md:hidden) -->
<button class="md:hidden text-primary dark:text-primary hover:text-primary transition-colors duration-150 active:opacity-80 cursor-pointer">
<span class="material-symbols-outlined">menu</span>
</button>
<div class="font-headline-xl text-headline-xl text-primary dark:text-primary tracking-tighter">
                VIBEDIR_TERMINAL_V1.0.4
            </div>
</div>
<!-- Search Bar (on_left configuration relative to trailing actions) -->
<div class="hidden md:flex items-center bg-surface-base border border-muted-gray focus-within:border-primary transition-colors flex-grow max-w-md mx-8 px-3 py-1">
<span class="text-primary mr-2">&gt;</span>
<input class="terminal-input bg-transparent text-on-surface w-full font-body-sm text-body-sm uppercase placeholder:text-muted-gray border-none focus:ring-0 p-0" placeholder="EXECUTE_QUERY..." type="text"/>
<span class="material-symbols-outlined text-muted-gray text-[18px]">search</span>
</div>
<div class="flex items-center gap-4 font-headline-md text-headline-md uppercase text-primary dark:text-primary">
<button class="text-on-surface-variant hover:border-primary hover:text-primary transition-colors duration-150 active:opacity-80 cursor-pointer flex items-center justify-center p-2 rounded-none border border-transparent">
<span class="material-symbols-outlined">terminal</span>
</button>
<button class="text-on-surface-variant hover:border-primary hover:text-primary transition-colors duration-150 active:opacity-80 cursor-pointer flex items-center justify-center p-2 rounded-none border border-transparent">
<span class="material-symbols-outlined">notifications</span>
</button>
<button class="text-on-surface-variant hover:border-primary hover:text-primary transition-colors duration-150 active:opacity-80 cursor-pointer flex items-center justify-center p-2 rounded-none border border-transparent">
<span class="material-symbols-outlined">sensors</span>
</button>
<!-- Profile Image Placeholder -->
<div class="w-8 h-8 bg-surface-variant border border-muted-gray ml-2 overflow-hidden neon-glow cursor-pointer">
<img alt="USER_AVATAR" class="w-full h-full object-cover grayscale opacity-80 hover:grayscale-0 transition-all" data-alt="A low-resolution, high-contrast digital avatar of a mysterious figure obscured by shadows, illuminated only by the harsh green glow of a CRT monitor. The image should have a pixelated, retro-hacker aesthetic with distinct terminal scanlines and a cyberpunk vibe." src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_iVmRZX1wtbiUIwpcZfbErgRw5EPyaFGT2L2-RbEB5-G-HLrMGJItaP95SHS6amGOTbTXAfNTUdur1Y22EuyzPpFUnK6Qd5Ve5hWB_FI0oIcaDLmyFiK3SGeTt71XMJotBUgnH7pp9blTqc724BSRCXK6mFHJPod9gEybzyoMJsmmQRgZp6hRHYqQNSpaZimMo0LZfGUyyb1nNFkegJT6QdVvBMpovnG318P920_qwhkMAF_K9yG8VtlNFK8OA_ZZm28bB5kxzg"/>
</div>
</div>
</header>
<div class="flex pt-[64px] min-h-screen">
<!-- SideNavBar -->
<nav class="hidden md:flex flex-col py-gutter h-[calc(100vh-64px)] bg-surface-base dark:bg-surface-base fixed left-0 top-header-height w-sidebar-width border-r border-muted-gray font-body-base text-body-base uppercase tracking-widest z-40 overflow-y-auto">
<!-- Header Section -->
<div class="px-4 py-6 border-b border-muted-gray border-dashed mb-4">
<div class="flex items-center gap-3 mb-2">
<div class="w-10 h-10 bg-primary/20 border border-primary flex items-center justify-center">
<span class="material-symbols-outlined text-primary">terminal</span>
</div>
<div>
<div class="font-headline-md text-headline-md text-primary">SESSION_ACTIVE</div>
<div class="font-label-code text-label-code text-muted-gray">ID:8823-X9</div>
</div>
</div>
</div>
<!-- CTA -->
<div class="px-4 mb-6">
<button class="w-full bg-primary text-background font-headline-md text-headline-md py-2 px-4 hover:bg-background hover:text-primary border border-primary transition-colors duration-150 text-center">
                    [NEW_DEPLOY]
                </button>
</div>
<!-- Navigation Links -->
<div class="flex-grow flex flex-col gap-1">
<!-- ACTIVE TAB -->
<a class="flex items-center gap-3 text-on-primary bg-primary dark:bg-primary dark:text-on-primary px-4 py-2 border-l-4 border-primary hover:bg-surface-container-highest dark:hover:bg-surface-container-highest hover:glow-primary active:scale-95 transition-transform" href="#">
<span class="material-symbols-outlined">dashboard</span>
<span>[OVERVIEW]</span>
</a>
<!-- INACTIVE TABS -->
<a class="flex items-center gap-3 text-muted-gray hover:text-primary px-4 py-2 border-l-4 border-transparent hover:bg-surface-container-highest dark:hover:bg-surface-container-highest hover:glow-primary active:scale-95 transition-transform" href="#">
<span class="material-symbols-outlined">folder_open</span>
<span>[MY_PROJECTS]</span>
</a>
<a class="flex items-center gap-3 text-muted-gray hover:text-primary px-4 py-2 border-l-4 border-transparent hover:bg-surface-container-highest dark:hover:bg-surface-container-highest hover:glow-primary active:scale-95 transition-transform" href="#">
<span class="material-symbols-outlined">add_box</span>
<span>[SUBMIT_NEW]</span>
</a>
<a class="flex items-center gap-3 text-muted-gray hover:text-primary px-4 py-2 border-l-4 border-transparent hover:bg-surface-container-highest dark:hover:bg-surface-container-highest hover:glow-primary active:scale-95 transition-transform" href="#">
<span class="material-symbols-outlined">settings</span>
<span>[SETTINGS]</span>
</a>
</div>
<!-- Footer Links -->
<div class="border-t border-muted-gray border-dashed mt-auto pt-4 flex flex-col gap-1 pb-4">
<a class="flex items-center gap-3 text-muted-gray hover:text-primary px-4 py-2 border-l-4 border-transparent hover:bg-surface-container-highest hover:glow-primary transition-colors" href="#">
<span class="material-symbols-outlined">logout</span>
<span>LOGOUT</span>
</a>
<a class="flex items-center gap-3 text-muted-gray hover:text-primary px-4 py-2 border-l-4 border-transparent hover:bg-surface-container-highest hover:glow-primary transition-colors" href="#">
<span class="material-symbols-outlined">help_outline</span>
<span>HELP</span>
</a>
</div>
</nav>
<!-- Main Content Area -->
<main class="flex-grow w-full md:pl-[250px] p-container-padding pb-24 md:pb-container-padding relative z-10">
<!-- Page Header -->
<div class="mb-8 border-b border-muted-gray pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
<div>
<h1 class="font-headline-xl text-headline-xl text-primary uppercase flex items-center gap-2">
<span class="material-symbols-outlined">monitoring</span>
                        SYSTEM_OVERVIEW
                    </h1>
<p class="font-body-sm text-body-sm text-muted-gray mt-1">STATUS: ONLINE | LATENCY: 12ms | UPTIME: 99.9%</p>
</div>
<div class="flex items-center gap-2 text-label-code font-label-code">
<span class="text-muted-gray">LAST_SYNC:</span>
<span class="text-primary blink">10:42:01 UTC</span>
</div>
</div>
<!-- High Level Summary (Bento-ish Top Row) -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-gutter mb-gutter">
<!-- Stat Card 1 -->
<div class="bg-surface-base border border-muted-gray p-4 neon-glow transition-all duration-200 relative overflow-hidden group">
<div class="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
<span class="material-symbols-outlined text-[64px] text-primary">hub</span>
</div>
<div class="font-label-code text-label-code text-muted-gray uppercase mb-2 border-b border-muted-gray border-dashed pb-1 inline-block">SYS.ACTIVE_SESSIONS</div>
<div class="flex items-end gap-3 mt-4">
<span class="font-headline-xl text-[48px] leading-[48px] text-primary tracking-tighter">1,024</span>
<span class="font-body-sm text-body-sm text-primary flex items-center mb-1">
<span class="material-symbols-outlined text-[16px]">arrow_upward</span> 12%
                        </span>
</div>
<div class="font-body-sm text-body-sm text-on-surface-variant mt-4 opacity-80">Concurrent active connections across all nodes.</div>
</div>
<!-- Stat Card 2 -->
<div class="bg-surface-base border border-muted-gray p-4 neon-glow transition-all duration-200 relative overflow-hidden group">
<div class="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
<span class="material-symbols-outlined text-[64px] text-primary">route</span>
</div>
<div class="font-label-code text-label-code text-muted-gray uppercase mb-2 border-b border-muted-gray border-dashed pb-1 inline-block">SYS.TOTAL_REFS</div>
<div class="flex items-end gap-3 mt-4">
<span class="font-headline-xl text-[48px] leading-[48px] text-primary tracking-tighter">8,892</span>
<span class="font-body-sm text-body-sm text-error flex items-center mb-1">
<span class="material-symbols-outlined text-[16px]">arrow_downward</span> 3%
                        </span>
</div>
<div class="font-body-sm text-body-sm text-on-surface-variant mt-4 opacity-80">Accumulated outward traffic routing events.</div>
</div>
</div>
<!-- Section Header -->
<div class="mt-8 mb-4 flex items-center justify-between border-b border-muted-gray pb-2">
<h2 class="font-headline-md text-headline-md text-on-surface uppercase flex items-center gap-2">
<span class="material-symbols-outlined text-primary text-[18px]">dns</span>
                    DEPLOYED_NODES
                </h2>
<div class="flex gap-2">
<button class="border border-muted-gray text-muted-gray px-2 py-1 font-label-code text-label-code hover:border-primary hover:text-primary transition-colors">
                        [FILTER]
                    </button>
<button class="border border-muted-gray text-muted-gray px-2 py-1 font-label-code text-label-code hover:border-primary hover:text-primary transition-colors">
                        [SORT]
                    </button>
</div>
</div>
<!-- Projects Grid -->
<div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-gutter">
<!-- Node Card 1 -->
<div class="bg-surface-base border border-muted-gray flex flex-col h-full neon-glow transition-all duration-200">
<div class="p-3 border-b border-muted-gray border-dashed flex justify-between items-center bg-surface-container-low">
<div class="flex items-center gap-2">
<span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
<span class="font-headline-md text-headline-md text-primary truncate max-w-[150px]">NODE_ALPHA</span>
</div>
<span class="font-label-code text-label-code border border-primary text-primary px-1">v2.1.0</span>
</div>
<div class="p-4 flex-grow relative">
<div class="absolute right-4 top-4 text-muted-gray opacity-20">
<span class="material-symbols-outlined text-[48px]">code</span>
</div>
<div class="font-body-sm text-body-sm text-on-surface-variant mb-4 pr-12">
                            Primary routing interface for generic query processing.
                        </div>
<div class="grid grid-cols-2 gap-4 mt-auto">
<div>
<div class="font-label-code text-label-code text-muted-gray mb-1">VIEWS/H</div>
<div class="font-headline-md text-headline-md text-on-surface">342</div>
</div>
<div>
<div class="font-label-code text-label-code text-muted-gray mb-1">CLICKS/H</div>
<div class="font-headline-md text-headline-md text-on-surface">89</div>
</div>
</div>
</div>
<div class="p-3 border-t border-muted-gray bg-surface-container-low flex justify-between items-center">
<span class="font-label-code text-label-code text-muted-gray">ID: NA-990</span>
<button class="text-primary font-label-code text-label-code hover:bg-primary hover:text-background border border-transparent hover:border-primary px-2 py-1 transition-colors">
                            [INSPECT]
                        </button>
</div>
</div>
<!-- Node Card 2 -->
<div class="bg-surface-base border border-muted-gray flex flex-col h-full neon-glow transition-all duration-200">
<div class="p-3 border-b border-muted-gray border-dashed flex justify-between items-center bg-surface-container-low">
<div class="flex items-center gap-2">
<span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
<span class="font-headline-md text-headline-md text-primary truncate max-w-[150px]">NODE_BETA</span>
</div>
<span class="font-label-code text-label-code border border-primary text-primary px-1">v1.0.4</span>
</div>
<div class="p-4 flex-grow relative">
<div class="absolute right-4 top-4 text-muted-gray opacity-20">
<span class="material-symbols-outlined text-[48px]">database</span>
</div>
<div class="font-body-sm text-body-sm text-on-surface-variant mb-4 pr-12">
                            Secondary storage layer parsing module.
                        </div>
<div class="grid grid-cols-2 gap-4 mt-auto">
<div>
<div class="font-label-code text-label-code text-muted-gray mb-1">VIEWS/H</div>
<div class="font-headline-md text-headline-md text-on-surface">128</div>
</div>
<div>
<div class="font-label-code text-label-code text-muted-gray mb-1">CLICKS/H</div>
<div class="font-headline-md text-headline-md text-on-surface">45</div>
</div>
</div>
</div>
<div class="p-3 border-t border-muted-gray bg-surface-container-low flex justify-between items-center">
<span class="font-label-code text-label-code text-muted-gray">ID: NB-402</span>
<button class="text-primary font-label-code text-label-code hover:bg-primary hover:text-background border border-transparent hover:border-primary px-2 py-1 transition-colors">
                            [INSPECT]
                        </button>
</div>
</div>
<!-- Node Card 3 (Warning State) -->
<div class="bg-surface-base border border-muted-gray flex flex-col h-full neon-glow transition-all duration-200">
<div class="p-3 border-b border-muted-gray border-dashed flex justify-between items-center bg-surface-container-low">
<div class="flex items-center gap-2">
<span class="w-2 h-2 rounded-full bg-secondary-container animate-pulse"></span>
<span class="font-headline-md text-headline-md text-secondary-container truncate max-w-[150px]">NODE_GAMMA</span>
</div>
<span class="font-label-code text-label-code border border-secondary-container text-secondary-container px-1">v0.9.beta</span>
</div>
<div class="p-4 flex-grow relative">
<div class="absolute right-4 top-4 text-muted-gray opacity-20">
<span class="material-symbols-outlined text-[48px]">warning</span>
</div>
<div class="font-body-sm text-body-sm text-on-surface-variant mb-4 pr-12">
                            Experimental load balancer. High latency detected.
                        </div>
<div class="grid grid-cols-2 gap-4 mt-auto">
<div>
<div class="font-label-code text-label-code text-muted-gray mb-1">VIEWS/H</div>
<div class="font-headline-md text-headline-md text-on-surface">1,092</div>
</div>
<div>
<div class="font-label-code text-label-code text-muted-gray mb-1">CLICKS/H</div>
<div class="font-headline-md text-headline-md text-on-surface">12</div>
</div>
</div>
</div>
<div class="p-3 border-t border-muted-gray bg-surface-container-low flex justify-between items-center">
<span class="font-label-code text-label-code text-muted-gray">ID: NG-001</span>
<button class="text-secondary-container font-label-code text-label-code hover:bg-secondary-container hover:text-background border border-transparent hover:border-secondary-container px-2 py-1 transition-colors">
                            [INSPECT]
                        </button>
</div>
</div>
<!-- Add New Node Card -->
<div class="bg-transparent border border-muted-gray border-dashed flex flex-col h-full hover:border-primary hover:bg-surface-base transition-all duration-200 cursor-pointer group min-h-[200px] items-center justify-center p-6 text-center">
<div class="w-12 h-12 rounded-full border border-muted-gray flex items-center justify-center mb-4 group-hover:border-primary group-hover:bg-primary/10 transition-colors">
<span class="material-symbols-outlined text-muted-gray group-hover:text-primary transition-colors">add</span>
</div>
<div class="font-headline-md text-headline-md text-muted-gray group-hover:text-primary transition-colors">INITIALIZE_NEW_NODE</div>
<div class="font-body-sm text-body-sm text-on-surface-variant mt-2 opacity-50">Deploy a new vibe project to the grid.</div>
</div>
</div>
</main>
</div>
</body></html>