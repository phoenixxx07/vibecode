<!DOCTYPE html>

<html class="dark" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>VibeDir Terminal - My Projects</title>
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
                        "DEFAULT": "0px",
                        "lg": "0px",
                        "xl": "0px",
                        "full": "0px"
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
        body {
            background-color: #050505;
            color: #dae6d4;
            background-image: radial-gradient(circle at 50% 50%, rgba(20, 30, 19, 0.5) 0%, transparent 100%);
        }
        
        /* CRT Scanline Effect */
        body::before {
            content: " ";
            display: block;
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
            z-index: 999;
            background-size: 100% 2px, 3px 100%;
            pointer-events: none;
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
            border-radius: 0;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #9eff99;
        }

        /* Glitch / Blinking cursor */
        .cursor-blink::after {
            content: '_';
            animation: blink 1s step-end infinite;
        }
        @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
        }

        .glow-hover:hover {
            box-shadow: 0 0 8px rgba(19, 236, 73, 0.5);
            border-color: #9eff99;
            color: #9eff99;
        }
        
        .glow-focus:focus-within {
            box-shadow: 0 0 8px rgba(19, 236, 73, 0.5);
            border-color: #9eff99;
        }
    </style>
</head>
<body class="font-body-base text-body-base antialiased min-h-screen overflow-x-hidden">
<!-- TopAppBar -->
<header class="bg-surface-container-low dark:bg-surface-container-low fixed top-0 w-full z-50 border-b border-muted-gray flex justify-between items-center h-header-height px-container-padding">
<div class="flex items-center gap-4">
<span class="font-headline-xl text-headline-xl text-primary dark:text-primary tracking-tighter cursor-blink">VIBEDIR_TERMINAL_V1.0.4</span>
</div>
<div class="flex items-center gap-6">
<!-- Search on left of actions -->
<div class="hidden md:flex items-center border border-muted-gray bg-surface-base px-2 py-1 glow-focus group transition-all duration-150">
<span class="text-muted-gray mr-2 group-focus-within:text-primary">&gt;</span>
<input class="bg-transparent border-none outline-none text-body-sm font-body-sm text-on-surface placeholder:text-muted-gray uppercase w-48 focus:ring-0 p-0 h-6" placeholder="SYS_SEARCH..." type="text"/>
</div>
<div class="flex items-center gap-4">
<span class="material-symbols-outlined text-primary dark:text-primary hover:border-primary hover:text-primary transition-colors duration-150 opacity-80 cursor-pointer" data-icon="terminal">terminal</span>
<span class="material-symbols-outlined text-primary dark:text-primary hover:border-primary hover:text-primary transition-colors duration-150 opacity-80 cursor-pointer" data-icon="notifications">notifications</span>
<span class="material-symbols-outlined text-primary dark:text-primary hover:border-primary hover:text-primary transition-colors duration-150 opacity-80 cursor-pointer" data-icon="sensors">sensors</span>
<div class="w-8 h-8 border border-muted-gray overflow-hidden ml-2 glow-hover">
<img alt="USER_AVATAR" class="w-full h-full object-cover grayscale" data-alt="A heavily pixelated, cyberpunk-style avatar of a mysterious figure wearing a glowing visor. The image is rendered in high contrast with deep blacks and stark neon green highlights. The aesthetic resembles early 90s digital art and low-resolution monitor displays. The mood is secretive and highly technical." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdwcl4VP3rhtMT6YxC7ILshTDDaks-Tdjw1VjuBWq_0CcxV6vNPTlOKl6vAAV3aaWHXkfKoGQE2ptODd9LomxduefB9yAgYt0wredl-i-SSEmT0qwXLyp8mt4L-LaPuPZE_kR1UBEmWclSyb4iW-0xIU1td7RH_EMoCNlpeRHeS3iQdIFtVCYdoPLVz-Tt4C2BjEeqb2_F16NAgkex0-ArXLqFXHBuohX6rK_iv-tijFnPnTijviwkgjWKbxLZcxZJUIXIezQUaA"/>
</div>
</div>
</div>
</header>
<!-- Main Layout Grid -->
<div class="flex pt-header-height min-h-screen">
<!-- SideNavBar -->
<aside class="hidden md:flex bg-surface-base dark:bg-surface-base fixed left-0 top-header-height h-full w-sidebar-width border-r border-muted-gray flex-col py-gutter h-[calc(100vh-64px)] z-40">
<!-- User Info Header -->
<div class="px-4 pb-6 mb-4 border-b border-muted-gray border-dashed">
<div class="flex items-center gap-3 mb-2">
<div class="w-10 h-10 border border-primary overflow-hidden">
<img alt="DEV_ID_09" class="w-full h-full object-cover grayscale" data-alt="A close up of a retro computer motherboard illuminated by stark green LED lights. The image features dense circuitry, microchips, and metallic solders in a brutalist, high-contrast style. Shadows are deep and inky, while the highlights glow with an artificial, digital intensity. The overall vibe is raw hardware hacking." src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7932a460hXpXW0Okim5CqBp5fnNI47hSZYpDQ9myB8qf-Q8bEWTgzv6Dk50mYEQWgvGMwmfXh8yJ2vay71hWAi5nw2cms-iPh6hWwwfINuzPra1r30NZqgjw-GuROMzknVPBNLmhWNa8E7OJ7GQwwXDLbwlm_QYTS9xeEhnYSE9iDuRUsPrYDH3q1SE_VoNxbBHRy5dXa0jaRIUdu2wTSJfmLSPIPkRQnKFPSurUJfkT-Z-XrVeG_G4kcrPRgdnzBHMxBJ4LhGA"/>
</div>
<div>
<div class="font-headline-md text-headline-md text-primary">SESSION_ACTIVE</div>
<div class="font-label-code text-label-code text-muted-gray">ID:8823-X9</div>
</div>
</div>
<button class="w-full border border-primary bg-primary text-on-primary font-headline-md text-headline-md uppercase py-2 mt-4 hover:bg-black hover:text-primary transition-colors duration-150">
                    [NEW_DEPLOY]
                </button>
</div>
<!-- Navigation Links -->
<nav class="flex-1 flex flex-col gap-1 font-body-base text-body-base uppercase tracking-widest">
<a class="text-muted-gray hover:text-primary px-4 py-2 border-l-4 border-transparent hover:bg-surface-container-highest dark:hover:bg-surface-container-highest hover:glow-primary flex items-center gap-3 group" href="#">
<span class="material-symbols-outlined text-muted-gray group-hover:text-primary" data-icon="dashboard">dashboard</span>
                    [OVERVIEW]
                </a>
<a class="text-on-primary bg-primary dark:bg-primary dark:text-on-primary px-4 py-2 border-l-4 border-primary hover:bg-surface-container-highest dark:hover:bg-surface-container-highest hover:glow-primary flex items-center gap-3 scale-95 transition-transform group" href="#">
<span class="material-symbols-outlined text-on-primary group-hover:text-primary" data-icon="folder_open">folder_open</span>
                    [MY_PROJECTS]
                </a>
<a class="text-muted-gray hover:text-primary px-4 py-2 border-l-4 border-transparent hover:bg-surface-container-highest dark:hover:bg-surface-container-highest hover:glow-primary flex items-center gap-3 group" href="#">
<span class="material-symbols-outlined text-muted-gray group-hover:text-primary" data-icon="add_box">add_box</span>
                    [SUBMIT_NEW]
                </a>
<a class="text-muted-gray hover:text-primary px-4 py-2 border-l-4 border-transparent hover:bg-surface-container-highest dark:hover:bg-surface-container-highest hover:glow-primary flex items-center gap-3 group" href="#">
<span class="material-symbols-outlined text-muted-gray group-hover:text-primary" data-icon="settings">settings</span>
                    [SETTINGS]
                </a>
</nav>
<!-- Footer Links -->
<div class="mt-auto border-t border-muted-gray border-dashed pt-4 font-body-base text-body-base uppercase tracking-widest">
<a class="text-muted-gray hover:text-primary px-4 py-2 flex items-center gap-3 group hover:bg-surface-container-highest transition-colors" href="#">
<span class="material-symbols-outlined" data-icon="logout">logout</span>
                    LOGOUT
                </a>
<a class="text-muted-gray hover:text-primary px-4 py-2 flex items-center gap-3 group hover:bg-surface-container-highest transition-colors" href="#">
<span class="material-symbols-outlined" data-icon="help_outline">help_outline</span>
                    HELP
                </a>
</div>
</aside>
<!-- Main Content Area -->
<main class="flex-1 ml-0 md:ml-sidebar-width p-gutter md:p-container-padding w-full max-w-7xl mx-auto">
<!-- Page Header & Actions -->
<div class="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-muted-gray pb-4">
<div>
<h1 class="font-headline-xl text-headline-xl text-primary mb-1">&gt; DIR /USER/PROJECTS</h1>
<p class="font-label-code text-label-code text-muted-gray">SYSTEM.QUERY_EXEC() :: 4 RECORDS FOUND</p>
</div>
<div class="flex items-center border border-muted-gray bg-surface-base px-3 py-2 w-full md:w-auto glow-focus group">
<span class="material-symbols-outlined text-muted-gray mr-2 group-focus-within:text-primary text-sm" data-icon="search">search</span>
<input class="bg-transparent border-none outline-none text-body-base font-body-base text-on-surface placeholder:text-muted-gray uppercase w-full md:w-64 focus:ring-0 p-0" placeholder="FILTER_PROJECTS..." type="text"/>
</div>
</div>
<!-- Data Table / List -->
<div class="border border-muted-gray bg-surface-base flex flex-col">
<!-- Table Header -->
<div class="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-muted-gray border-dashed bg-surface-container-highest font-label-code text-label-code text-primary tracking-widest">
<div class="col-span-4">TARGET_NAME</div>
<div class="col-span-3">ROUTING_URL</div>
<div class="col-span-2">CLASS_TYPE</div>
<div class="col-span-2">NODE_STATUS</div>
<div class="col-span-1 text-right">EXEC</div>
</div>
<!-- Row 1 -->
<div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 p-4 border-b border-muted-gray hover:bg-surface-container-highest transition-colors group">
<div class="col-span-1 md:col-span-4 flex items-center gap-3">
<span class="material-symbols-outlined text-primary" data-icon="public">public</span>
<div>
<div class="font-headline-md text-headline-md text-on-surface group-hover:text-primary transition-colors">NEURAL_NET_V2</div>
<div class="font-label-code text-label-code text-muted-gray md:hidden">ROUTING_URL: nn.vibedir.net/v2</div>
</div>
</div>
<div class="hidden md:flex col-span-3 items-center font-body-sm text-body-sm text-muted-gray">
                        nn.vibedir.net/v2
                    </div>
<div class="col-span-1 md:col-span-2 flex items-center">
<span class="border border-primary border-dashed px-2 py-1 font-label-code text-label-code text-primary">WEB_APP</span>
</div>
<div class="col-span-1 md:col-span-2 flex items-center gap-2">
<div class="w-2 h-2 bg-primary"></div>
<span class="font-label-code text-label-code text-primary">ONLINE</span>
</div>
<div class="col-span-1 md:col-span-1 flex items-center justify-start md:justify-end mt-2 md:mt-0">
<button class="font-label-code text-label-code text-muted-gray hover:text-primary border border-transparent hover:border-primary px-2 py-1 transition-all">
                            [EDIT]
                        </button>
</div>
</div>
<!-- Row 2 -->
<div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 p-4 border-b border-muted-gray hover:bg-surface-container-highest transition-colors group">
<div class="col-span-1 md:col-span-4 flex items-center gap-3">
<span class="material-symbols-outlined text-muted-gray" data-icon="api">api</span>
<div>
<div class="font-headline-md text-headline-md text-on-surface group-hover:text-primary transition-colors">DATA_SCRAPER_BOT</div>
<div class="font-label-code text-label-code text-muted-gray md:hidden">ROUTING_URL: internal.svc.local/ds</div>
</div>
</div>
<div class="hidden md:flex col-span-3 items-center font-body-sm text-body-sm text-muted-gray">
                        internal.svc.local/ds
                    </div>
<div class="col-span-1 md:col-span-2 flex items-center">
<span class="border border-muted-gray border-dashed px-2 py-1 font-label-code text-label-code text-muted-gray">MICROSERVICE</span>
</div>
<div class="col-span-1 md:col-span-2 flex items-center gap-2">
<div class="w-2 h-2 bg-muted-gray"></div>
<span class="font-label-code text-label-code text-muted-gray">OFFLINE</span>
</div>
<div class="col-span-1 md:col-span-1 flex items-center justify-start md:justify-end mt-2 md:mt-0">
<button class="font-label-code text-label-code text-muted-gray hover:text-primary border border-transparent hover:border-primary px-2 py-1 transition-all">
                            [EDIT]
                        </button>
</div>
</div>
<!-- Row 3 -->
<div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 p-4 border-b border-muted-gray hover:bg-surface-container-highest transition-colors group">
<div class="col-span-1 md:col-span-4 flex items-center gap-3">
<span class="material-symbols-outlined text-primary" data-icon="terminal">terminal</span>
<div>
<div class="font-headline-md text-headline-md text-on-surface group-hover:text-primary transition-colors">CLI_TOOLKIT</div>
<div class="font-label-code text-label-code text-muted-gray md:hidden">ROUTING_URL: pkg.vibedir.net/cli</div>
</div>
</div>
<div class="hidden md:flex col-span-3 items-center font-body-sm text-body-sm text-muted-gray">
                        pkg.vibedir.net/cli
                    </div>
<div class="col-span-1 md:col-span-2 flex items-center">
<span class="border border-primary border-dashed px-2 py-1 font-label-code text-label-code text-primary">PACKAGE</span>
</div>
<div class="col-span-1 md:col-span-2 flex items-center gap-2">
<div class="w-2 h-2 bg-primary"></div>
<span class="font-label-code text-label-code text-primary">ONLINE</span>
</div>
<div class="col-span-1 md:col-span-1 flex items-center justify-start md:justify-end mt-2 md:mt-0">
<button class="font-label-code text-label-code text-muted-gray hover:text-primary border border-transparent hover:border-primary px-2 py-1 transition-all">
                            [EDIT]
                        </button>
</div>
</div>
<!-- Row 4 -->
<div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 p-4 hover:bg-surface-container-highest transition-colors group">
<div class="col-span-1 md:col-span-4 flex items-center gap-3">
<span class="material-symbols-outlined text-error" data-icon="warning">warning</span>
<div>
<div class="font-headline-md text-headline-md text-error group-hover:text-error transition-colors">LEGACY_AUTH_SYS</div>
<div class="font-label-code text-label-code text-muted-gray md:hidden">ROUTING_URL: old.auth.net/v1</div>
</div>
</div>
<div class="hidden md:flex col-span-3 items-center font-body-sm text-body-sm text-muted-gray line-through">
                        old.auth.net/v1
                    </div>
<div class="col-span-1 md:col-span-2 flex items-center">
<span class="border border-error border-dashed px-2 py-1 font-label-code text-label-code text-error">DEPRECATED</span>
</div>
<div class="col-span-1 md:col-span-2 flex items-center gap-2">
<div class="w-2 h-2 border border-error bg-transparent"></div>
<span class="font-label-code text-label-code text-error cursor-blink">ERR_CONNECTION</span>
</div>
<div class="col-span-1 md:col-span-1 flex items-center justify-start md:justify-end mt-2 md:mt-0">
<button class="font-label-code text-label-code text-muted-gray hover:text-primary border border-transparent hover:border-primary px-2 py-1 transition-all">
                            [EDIT]
                        </button>
</div>
</div>
</div>
<!-- Pagination / Footer Info -->
<div class="mt-4 flex justify-between items-center font-label-code text-label-code text-muted-gray">
<div>DISPLAYING 1-4 OF 4</div>
<div class="flex gap-2">
<button class="border border-muted-gray px-2 py-1 hover:border-primary hover:text-primary transition-colors opacity-50 cursor-not-allowed">[PREV]</button>
<button class="border border-muted-gray px-2 py-1 hover:border-primary hover:text-primary transition-colors opacity-50 cursor-not-allowed">[NEXT]</button>
</div>
</div>
</main>
</div>
</body></html>