<!DOCTYPE html>

<html class="dark" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>VibeDir Terminal - Project Editor</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&amp;display=swap" rel="stylesheet"/>
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
        body {
            background-color: theme('colors.background-dark');
            color: theme('colors.on-background');
            background-image: radial-gradient(circle at center, rgba(12, 22, 11, 0) 0%, rgba(5, 5, 5, 0.8) 100%);
            min-height: 100vh;
        }

        /* Scanline effect */
        body::before {
            content: " ";
            display: block;
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
            z-index: 100;
            background-size: 100% 2px, 3px 100%;
            pointer-events: none;
        }

        /* Custom Scrollbar */
        ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }
        ::-webkit-scrollbar-track {
            background: theme('colors.surface-container-highest');
            border-left: 1px solid theme('colors.muted-gray');
        }
        ::-webkit-scrollbar-thumb {
            background: theme('colors.muted-gray');
        }
        ::-webkit-scrollbar-thumb:hover {
            background: theme('colors.primary');
            box-shadow: 0 0 8px theme('colors.primary');
        }

        /* Glow classes */
        .hover\:glow-primary:hover {
            box-shadow: 0 0 8px theme('colors.primary');
            border-color: theme('colors.primary');
        }
        
        .glow-active {
            box-shadow: 0 0 8px theme('colors.primary');
        }

        /* Terminal Input styling */
        .terminal-input-wrapper {
            position: relative;
            display: flex;
            align-items: center;
        }
        .terminal-input-wrapper::before {
            content: ">";
            position: absolute;
            left: 12px;
            color: theme('colors.muted-gray');
            font-family: 'Space Mono', monospace;
        }
        .terminal-input {
            width: 100%;
            background: transparent;
            border: 1px solid theme('colors.muted-gray');
            color: theme('colors.primary');
            padding: 8px 12px 8px 28px;
            font-family: 'Space Mono', monospace;
            font-size: 14px;
            outline: none;
            transition: all 0.2s;
        }
        .terminal-input:focus {
            border-color: theme('colors.primary');
            box-shadow: 0 0 8px theme('colors.primary-glow');
        }
        .terminal-input::placeholder {
            color: theme('colors.muted-gray');
            text-transform: uppercase;
        }
        
        /* Terminal Textarea */
        .terminal-textarea {
             width: 100%;
            background: transparent;
            border: 1px solid theme('colors.muted-gray');
            color: theme('colors.primary');
            padding: 12px;
            font-family: 'Space Mono', monospace;
            font-size: 14px;
            outline: none;
            transition: all 0.2s;
            resize: vertical;
            min-height: 120px;
        }
        .terminal-textarea:focus {
             border-color: theme('colors.primary');
            box-shadow: 0 0 8px theme('colors.primary-glow');
        }

        /* Custom Checkbox */
        .tech-checkbox input {
            display: none;
        }
        .tech-checkbox .box {
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 1px solid theme('colors.muted-gray');
            margin-right: 8px;
            vertical-align: middle;
            position: relative;
            cursor: pointer;
        }
        .tech-checkbox input:checked + .box {
            border-color: theme('colors.primary');
            background-color: theme('colors.primary-glow');
        }
        .tech-checkbox input:checked + .box::after {
            content: "x";
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: theme('colors.primary');
            font-family: 'Space Mono', monospace;
            font-size: 12px;
            line-height: 1;
        }
        
        /* Matrix Green Button */
        .btn-matrix {
            background-color: theme('colors.primary');
            color: theme('colors.on-primary');
            border: 1px solid theme('colors.primary');
            transition: all 0.2s;
        }
        .btn-matrix:hover {
            background-color: theme('colors.background-dark');
            color: theme('colors.primary');
            box-shadow: 0 0 12px theme('colors.primary');
        }
        
        /* Warning Amber Button */
        .btn-warning {
            background-color: transparent;
            color: theme('colors.secondary-container');
            border: 1px solid theme('colors.muted-gray');
            transition: all 0.2s;
        }
        .btn-warning:hover {
            border-color: theme('colors.secondary-container');
            box-shadow: 0 0 8px rgba(253, 175, 0, 0.3);
        }
    </style>
</head>
<body class="font-body-base text-body-base overflow-x-hidden selection:bg-primary selection:text-on-primary">
<!-- TopAppBar -->
<header class="bg-surface-container-low dark:bg-surface-container-low font-headline-md text-headline-md uppercase fixed top-0 w-full z-50 border-b border-muted-gray flex justify-between items-center h-header-height px-container-padding flat no shadows">
<div class="flex items-center gap-4">
<span class="font-headline-xl text-headline-xl text-primary dark:text-primary tracking-tighter">VIBEDIR_TERMINAL_V1.0.4</span>
</div>
<div class="flex items-center gap-6">
<!-- Search placeholder (on_left in JSON but usually means left of trailing actions) -->
<div class="hidden md:flex border border-muted-gray px-3 py-1 hover:border-primary transition-colors duration-150">
<span class="material-symbols-outlined text-muted-gray text-[18px]">search</span>
<input class="bg-transparent border-none outline-none text-primary ml-2 w-48 text-body-sm font-body-sm placeholder:text-muted-gray" placeholder="QUERY..." type="text"/>
</div>
<div class="flex items-center gap-4 text-primary dark:text-primary">
<span class="material-symbols-outlined hover:border-primary hover:text-primary transition-colors duration-150 Active: opacity-80 cursor-pointer">terminal</span>
<span class="material-symbols-outlined hover:border-primary hover:text-primary transition-colors duration-150 Active: opacity-80 cursor-pointer">notifications</span>
<span class="material-symbols-outlined hover:border-primary hover:text-primary transition-colors duration-150 Active: opacity-80 cursor-pointer">sensors</span>
<div class="w-8 h-8 border border-muted-gray bg-surface-base flex items-center justify-center overflow-hidden hover:border-primary transition-colors duration-150">
<img alt="USER_AVATAR" class="w-full h-full object-cover grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-300" data-alt="A macro shot of a glowing green circuit board microchip acting as a digital avatar. Cyberpunk lighting." src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4XG5PVcdJjDDYfMW7ur2vQMR4YN688yNZTKRjjWr0uZ0kDdQM-LOTFKAqKqIYPK-tpblBhaqE5OkgFNtaAvuOomUWkv1r6Vh1zJlDzbDtoNv0IzON3oLubi_ZAZu_jswK9vv_iHX8GD4voRPnobwwZFSapshE-kB-Zm9h7HwPpdpXlZB8AzI_xlvu8is__l9tT-slEiaUKutzYlf7ZMDNUr2Fv4Db8y4b_X2qNEismOnP9MW5-HWctGDgoNBhUB0vzKGaktwjAg"/>
</div>
</div>
</div>
</header>
<div class="flex w-full pt-[64px]">
<!-- SideNavBar -->
<nav class="hidden md:flex bg-surface-base dark:bg-surface-base font-body-base text-body-base uppercase tracking-widest fixed left-0 top-header-height h-full w-sidebar-width border-r border-muted-gray flat no shadows flex-col py-gutter h-[calc(100vh-64px)] z-40">
<!-- Header area -->
<div class="px-4 py-4 mb-4 border-b border-muted-gray border-dashed">
<div class="flex items-center gap-3 mb-2">
<div class="w-10 h-10 border border-primary p-0.5">
<img alt="DEV_ID_09" class="w-full h-full object-cover grayscale filter contrast-125" data-alt="A low-res wireframe 3D render of a geometric face, retro digital style." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKq5R9DqIqO1wPttT4im7gYEjDVtvCjGL1uvIy7zea0QZ-sseXjomHV0xUJ4_3ElL-Wjwr0uUpmg31y-44h4hPv-m6Ibai1xQcx3BjIJc1bWP_CBibFMnRVbgl1scQP6cs2r_k80odpJmXTjPBhNzV0dxn1LEiJxmO6fbDbzAISBaDAROP34E_7AmXkE-9DHTo8LsRrDyue1EdNocol2ZoZnoJjI-NEYO4JSOERFOQf-ui1TV4yHC8DhflZxzeE0e8YByqlkxayA"/>
</div>
<div>
<div class="text-primary font-headline-md text-headline-md text-sm">SESSION_ACTIVE</div>
<div class="text-muted-gray text-[10px] font-label-code">ID:8823-X9</div>
</div>
</div>
</div>
<!-- CTA -->
<div class="px-4 mb-6">
<button class="w-full border border-primary text-primary py-2 hover:bg-primary hover:text-on-primary transition-colors text-sm font-bold flex justify-center items-center gap-2 group">
<span class="material-symbols-outlined text-[18px]">add</span>
                    [NEW_DEPLOY]
                </button>
</div>
<!-- Main Nav Links -->
<div class="flex-1 flex flex-col gap-1">
<a class="text-muted-gray hover:text-primary px-4 py-2 border-l-4 border-transparent hover:bg-surface-container-highest dark:hover:bg-surface-container-highest hover:glow-primary Active: scale-95 transition-transform flex items-center gap-3" href="#">
<span class="material-symbols-outlined text-[20px]">dashboard</span>
                    [OVERVIEW]
                </a>
<a class="text-on-primary bg-primary dark:bg-primary dark:text-on-primary px-4 py-2 border-l-4 border-primary hover:bg-surface-container-highest dark:hover:bg-surface-container-highest hover:glow-primary Active: scale-95 transition-transform flex items-center gap-3 glow-active" href="#">
<span class="material-symbols-outlined text-[20px]">folder_open</span>
                    [MY_PROJECTS]
                </a>
<a class="text-muted-gray hover:text-primary px-4 py-2 border-l-4 border-transparent hover:bg-surface-container-highest dark:hover:bg-surface-container-highest hover:glow-primary Active: scale-95 transition-transform flex items-center gap-3" href="#">
<span class="material-symbols-outlined text-[20px]">add_box</span>
                    [SUBMIT_NEW]
                </a>
<a class="text-muted-gray hover:text-primary px-4 py-2 border-l-4 border-transparent hover:bg-surface-container-highest dark:hover:bg-surface-container-highest hover:glow-primary Active: scale-95 transition-transform flex items-center gap-3" href="#">
<span class="material-symbols-outlined text-[20px]">settings</span>
                    [SETTINGS]
                </a>
</div>
<!-- Footer Nav Links -->
<div class="mt-auto border-t border-muted-gray border-dashed pt-4 flex flex-col gap-1">
<a class="text-muted-gray hover:text-primary px-4 py-2 border-l-4 border-transparent hover:bg-surface-container-highest hover:glow-primary transition-all flex items-center gap-3" href="#">
<span class="material-symbols-outlined text-[20px]">logout</span>
                    LOGOUT
                </a>
<a class="text-muted-gray hover:text-primary px-4 py-2 border-l-4 border-transparent hover:bg-surface-container-highest hover:glow-primary transition-all flex items-center gap-3" href="#">
<span class="material-symbols-outlined text-[20px]">help_outline</span>
                    HELP
                </a>
</div>
</nav>
<!-- Main Content Area -->
<main class="flex-1 md:ml-[250px] p-container-padding min-h-[calc(100vh-64px)]">
<!-- Page Header -->
<div class="mb-8 border-b border-muted-gray pb-4">
<div class="flex items-center gap-2 text-muted-gray font-label-code text-label-code mb-2">
<span>SYS_PATH:</span>
<span class="text-primary">~/my_projects/edit/alpha_protocol</span>
</div>
<h1 class="font-headline-xl text-headline-xl text-primary uppercase tracking-wider flex items-center gap-3">
<span class="material-symbols-outlined text-3xl">edit_document</span>
                    EDIT_PROJECT::ALPHA_PROTOCOL
                </h1>
<p class="text-muted-gray mt-2 text-sm">MODIFY DEPLOYMENT PARAMETERS AND METADATA BEFORE COMMIT.</p>
</div>
<!-- Editor Form Grid -->
<div class="grid grid-cols-1 lg:grid-cols-12 gap-gutter max-w-6xl">
<!-- Main Form Column -->
<div class="lg:col-span-8 flex flex-col gap-6">
<!-- Basic Info Card -->
<div class="border border-muted-gray bg-surface-base p-6 relative hover:border-primary transition-colors duration-300">
<div class="absolute top-0 right-0 bg-muted-gray text-background-dark px-2 py-0.5 text-[10px] font-bold">SEC_01</div>
<h2 class="font-headline-md text-headline-md text-on-surface mb-6 border-b border-muted-gray border-dashed pb-2">CORE_PARAMETERS</h2>
<div class="flex flex-col gap-5">
<div>
<label class="block text-muted-gray text-xs mb-1 font-bold">PROJECT_TITLE <span class="text-primary">*</span></label>
<div class="terminal-input-wrapper">
<input class="terminal-input" placeholder="ENTER TITLE" type="text" value="ALPHA_PROTOCOL_V2"/>
</div>
</div>
<div>
<label class="block text-muted-gray text-xs mb-1 font-bold">TARGET_URL <span class="text-primary">*</span></label>
<div class="terminal-input-wrapper">
<input class="terminal-input" placeholder="HTTPS://..." type="text" value="HTTPS://APP.VIBEDIR.NET/ALPHA"/>
</div>
</div>
<div>
<label class="block text-muted-gray text-xs mb-1 font-bold">SYSTEM_DESCRIPTION</label>
<textarea class="terminal-textarea" placeholder="INITIATE DESCRIPTION SEQUENCE...">HIGH-FREQUENCY TRADING ALGORITHM INTERFACE DESIGNED FOR LOW-LATENCY ENVIRONMENTS. 
REQUIRES WEBSOCKET CONNECTION AND DIRECT DOM ACCESS.
CURRENT STATUS: STABLE.</textarea>
</div>
</div>
</div>
<!-- Actions Card -->
<div class="border border-muted-gray bg-surface-base p-6 flex justify-between items-center relative">
<div class="absolute left-0 top-0 w-1 h-full bg-primary"></div>
<div class="text-muted-gray text-xs">
                            LAST_MODIFIED: <span class="text-primary">2023-10-24T14:32:00Z</span>
</div>
<div class="flex gap-4">
<button class="btn-warning px-6 py-2 font-bold text-sm tracking-wider flex items-center gap-2">
<span class="material-symbols-outlined text-[18px]">warning</span>
                                [DELETE_PROJECT]
                            </button>
<button class="btn-matrix px-6 py-2 font-bold text-sm tracking-wider flex items-center gap-2">
<span class="material-symbols-outlined text-[18px]">save</span>
                                [SAVE_CHANGES]
                            </button>
</div>
</div>
</div>
<!-- Sidebar Form Column -->
<div class="lg:col-span-4 flex flex-col gap-6">
<!-- Categories Card -->
<div class="border border-muted-gray bg-surface-base p-6 relative">
<div class="absolute top-0 right-0 bg-muted-gray text-background-dark px-2 py-0.5 text-[10px] font-bold">SEC_02</div>
<h2 class="font-headline-md text-headline-md text-on-surface mb-4 border-b border-muted-gray border-dashed pb-2">CLASSIFICATION</h2>
<div class="text-xs text-muted-gray mb-4">ASSIGN RELEVANT TAGS FOR INDEXING.</div>
<div class="flex flex-col gap-3">
<label class="tech-checkbox flex items-center text-sm text-on-surface cursor-pointer group">
<input checked="" type="checkbox"/>
<span class="box group-hover:border-primary transition-colors"></span>
                                [TOOLS]
                            </label>
<label class="tech-checkbox flex items-center text-sm text-on-surface cursor-pointer group">
<input type="checkbox"/>
<span class="box group-hover:border-primary transition-colors"></span>
                                [CHAT]
                            </label>
<label class="tech-checkbox flex items-center text-sm text-on-surface cursor-pointer group">
<input checked="" type="checkbox"/>
<span class="box group-hover:border-primary transition-colors"></span>
                                [DOC_PROC]
                            </label>
<label class="tech-checkbox flex items-center text-sm text-on-surface cursor-pointer group">
<input type="checkbox"/>
<span class="box group-hover:border-primary transition-colors"></span>
                                [ART]
                            </label>
</div>
</div>
<!-- Status Indicator Card -->
<div class="border border-muted-gray bg-surface-container-low p-4 flex items-start gap-4">
<div class="mt-1 relative">
<span class="material-symbols-outlined text-primary text-2xl animate-pulse">check_circle</span>
<div class="absolute inset-0 rounded-full bg-primary-glow animate-ping"></div>
</div>
<div>
<div class="font-bold text-sm text-primary mb-1">SYSTEM_READY</div>
<div class="text-xs text-muted-gray">ALL REQUIRED FIELDS PRESENT. READY FOR COMPILE AND DEPLOY.</div>
</div>
</div>
</div>
</div>
</main>
</div>
<script>
        // Simple script to blink the cursor in input fields on focus, enhancing the terminal feel
        document.querySelectorAll('.terminal-input').forEach(input => {
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('glow-active');
            });
            input.addEventListener('blur', function() {
                this.parentElement.classList.remove('glow-active');
            });
        });
    </script>
</body></html>