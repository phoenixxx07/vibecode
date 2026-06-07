<!DOCTYPE html>

<html class="dark" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Dynamic Stream - Launchpad</title>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&amp;family=Space+Grotesk:wght@400;500;600;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script id="tailwind-config">
  tailwind.config = {
    darkMode: "class",
    theme: {
      extend: {
        colors: {
          "primary": "#06f9a8",
          "background-light": "#f5f8f7",
          "background-dark": "#0A001A", // Overridden from default to match Deep Space Purple
          "accent-games": "#39FF14",
          "accent-tools": "#FF007F",
          "accent-art": "#FF5E00",
          "accent-bots": "#7000FF",
        },
        fontFamily: {
          "display": ["Outfit", "sans-serif"],
          "body": ["Space Grotesk", "sans-serif"]
        },
        borderRadius: {"DEFAULT": "0.5rem", "lg": "1.5rem", "xl": "2rem", "full": "9999px"}, // Adjusted to match radius-lg from PRD
        animation: {
          'pan-gradient': 'pan 3s linear infinite',
          'blob': 'blob 10s infinite',
          'pop': 'pop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        },
        keyframes: {
          pan: {
            '0%': { backgroundPosition: '0% 50%' },
            '100%': { backgroundPosition: '200% 50%' },
          },
          blob: {
            '0%': { transform: 'translate(0px, 0px) scale(1)' },
            '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
            '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
            '100%': { transform: 'translate(0px, 0px) scale(1)' },
          },
          pop: {
            '0%': { transform: 'scale(0.8)', opacity: '0' },
            '100%': { transform: 'scale(1)', opacity: '1' },
          }
        }
      },
    },
  }
</script>
<style>
  body {
    background-color: theme('colors.background-dark');
    color: #F4F4F5;
    font-family: theme('fontFamily.body');
    overflow-x: hidden;
  }
  
  h1, h2, h3, h4, h5, h6, .font-heading {
    font-family: theme('fontFamily.display');
  }

  .glass-panel {
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(40px);
    -webkit-backdrop-filter: blur(40px);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .glass-input {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: white;
    transition: all 0.3s ease;
  }
  
  .glass-input:focus {
    background: rgba(255, 255, 255, 0.08);
    border-color: theme('colors.primary');
    box-shadow: 0 0 20px rgba(6, 249, 168, 0.2);
    outline: none;
  }

  /* Custom Radio Cards */
  .category-radio input[type="radio"] {
    display: none;
  }
  
  .category-card {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.03);
  }

  .category-card:hover {
    background: rgba(255, 255, 255, 0.08);
    transform: translateY(-2px);
  }

  /* Radio Checked States */
  .category-radio input[value="games"]:checked + .category-card {
    border-color: theme('colors.accent-games');
    background: rgba(57, 255, 20, 0.1);
    box-shadow: 0 8px 32px rgba(57, 255, 20, 0.2);
  }
  .category-radio input[value="games"]:checked + .category-card .icon-glow { color: theme('colors.accent-games'); text-shadow: 0 0 10px theme('colors.accent-games'); }

  .category-radio input[value="tools"]:checked + .category-card {
    border-color: theme('colors.accent-tools');
    background: rgba(255, 0, 127, 0.1);
    box-shadow: 0 8px 32px rgba(255, 0, 127, 0.2);
  }
  .category-radio input[value="tools"]:checked + .category-card .icon-glow { color: theme('colors.accent-tools'); text-shadow: 0 0 10px theme('colors.accent-tools'); }

  .category-radio input[value="art"]:checked + .category-card {
    border-color: theme('colors.accent-art');
    background: rgba(255, 94, 0, 0.1);
    box-shadow: 0 8px 32px rgba(255, 94, 0, 0.2);
  }
  .category-radio input[value="art"]:checked + .category-card .icon-glow { color: theme('colors.accent-art'); text-shadow: 0 0 10px theme('colors.accent-art'); }

  .category-radio input[value="bots"]:checked + .category-card {
    border-color: theme('colors.accent-bots');
    background: rgba(112, 0, 255, 0.1);
    box-shadow: 0 8px 32px rgba(112, 0, 255, 0.2);
  }
  .category-radio input[value="bots"]:checked + .category-card .icon-glow { color: theme('colors.accent-bots'); text-shadow: 0 0 10px theme('colors.accent-bots'); }

  /* Gradient Button */
  .btn-gradient {
    background: linear-gradient(90deg, theme('colors.primary'), #00B8FF, theme('colors.primary'));
    background-size: 200% auto;
    color: #0A001A;
    font-family: theme('fontFamily.display');
    transition: all 0.3s ease;
  }
  
  .btn-gradient:hover {
    box-shadow: 0 0 30px rgba(6, 249, 168, 0.4);
    transform: translateY(-2px);
  }

  .btn-loading {
    animation: pan 2s linear infinite;
    opacity: 0.8;
    pointer-events: none;
  }

  /* Confetti Placeholder */
  .confetti-piece {
    position: absolute;
    width: 10px;
    height: 10px;
    background-color: theme('colors.primary');
    border-radius: 50%;
    opacity: 0;
  }

  #success-state {
    display: none;
  }
</style>
</head>
<body class="antialiased min-h-screen relative flex items-center justify-center selection:bg-primary/30 selection:text-white">
<!-- Minimal Header (Back to main exception) -->
<header class="absolute top-0 left-0 w-full p-6 z-50 flex items-center">
<a aria-label="Go back" class="group flex items-center gap-2 text-zinc-400 hover:text-white transition-colors duration-200" href="#">
<div class="glass-panel p-2 rounded-full flex items-center justify-center group-hover:bg-white/10 transition-colors">
<span class="material-symbols-outlined text-xl" data-icon="arrow_back">arrow_back</span>
</div>
<span class="font-display font-medium text-sm tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0 duration-300">Back</span>
</a>
</header>
<!-- Ambient Mesh Background -->
<div class="fixed inset-0 z-0 overflow-hidden pointer-events-none">
<!-- Blobs -->
<div class="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#7000FF]/20 blur-[120px] animate-blob mix-blend-screen"></div>
<div class="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#00FFAA]/10 blur-[150px] animate-blob animation-delay-2000 mix-blend-screen"></div>
<div class="absolute top-[40%] left-[60%] w-[40%] h-[40%] rounded-full bg-[#FF007F]/15 blur-[100px] animate-blob animation-delay-4000 mix-blend-screen"></div>
<!-- Grid Overlay -->
<div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiIGZpbGw9Im5vbmUiLz4KPHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz4KPC9zdmc+')] opacity-50"></div>
</div>
<!-- Main Content Container -->
<main class="relative z-10 w-full max-w-3xl px-6 py-20 flex flex-col items-center">
<!-- Form State -->
<div class="w-full flex flex-col items-center animate-pop" id="submit-state">
<!-- Hero Header -->
<div class="text-center mb-12">
<h1 class="font-heading font-black text-6xl md:text-7xl tracking-[-0.03em] text-white mb-4 drop-shadow-2xl">
          Ship Your <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#00B8FF]">Vibe</span>
</h1>
<p class="text-zinc-400 text-lg md:text-xl font-body">Drop your latest creation into the stream.</p>
</div>
<!-- Form -->
<form class="w-full space-y-8 glass-panel p-8 md:p-12 rounded-xl shadow-2xl" id="launch-form">
<!-- URL Input -->
<div class="space-y-3">
<label class="block font-display font-semibold text-zinc-300 text-sm tracking-wide uppercase ml-1" for="project-url">Project Link</label>
<div class="relative group">
<span class="absolute left-6 top-1/2 -translate-y-1/2 material-symbols-outlined text-zinc-500 text-3xl group-focus-within:text-primary transition-colors" data-icon="link">link</span>
<input autofocus="" class="glass-input w-full rounded-lg h-20 pl-16 pr-6 text-2xl font-body placeholder:text-zinc-600 focus:ring-0" id="project-url" name="url" placeholder="https://your-vibe-project.com" required="" type="url"/>
</div>
</div>
<!-- Category Grid -->
<div class="space-y-4">
<label class="block font-display font-semibold text-zinc-300 text-sm tracking-wide uppercase ml-1">Select Vibe Category</label>
<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
<label class="category-radio block w-full h-full">
<input name="category" required="" type="radio" value="games"/>
<div class="category-card rounded-lg p-6 flex items-center gap-4 h-full">
<div class="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
<span class="material-symbols-outlined text-[#39FF14] icon-glow text-2xl" data-icon="sports_esports">sports_esports</span>
</div>
<div>
<h3 class="font-heading font-bold text-xl text-white">Games</h3>
<p class="text-sm text-zinc-400">Playable experiments</p>
</div>
</div>
</label>
<label class="category-radio block w-full h-full">
<input name="category" type="radio" value="tools"/>
<div class="category-card rounded-lg p-6 flex items-center gap-4 h-full">
<div class="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
<span class="material-symbols-outlined text-[#FF007F] icon-glow text-2xl" data-icon="handyman">handyman</span>
</div>
<div>
<h3 class="font-heading font-bold text-xl text-white">Tools</h3>
<p class="text-sm text-zinc-400">Utilities &amp; builders</p>
</div>
</div>
</label>
<label class="category-radio block w-full h-full">
<input name="category" type="radio" value="art"/>
<div class="category-card rounded-lg p-6 flex items-center gap-4 h-full">
<div class="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
<span class="material-symbols-outlined text-[#FF5E00] icon-glow text-2xl" data-icon="palette">palette</span>
</div>
<div>
<h3 class="font-heading font-bold text-xl text-white">Art</h3>
<p class="text-sm text-zinc-400">Visual &amp; generative</p>
</div>
</div>
</label>
<label class="category-radio block w-full h-full">
<input name="category" type="radio" value="bots"/>
<div class="category-card rounded-lg p-6 flex items-center gap-4 h-full">
<div class="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
<span class="material-symbols-outlined text-[#7000FF] icon-glow text-2xl" data-icon="smart_toy">smart_toy</span>
</div>
<div>
<h3 class="font-heading font-bold text-xl text-white">Bots</h3>
<p class="text-sm text-zinc-400">Agents &amp; automation</p>
</div>
</div>
</label>
</div>
</div>
<!-- Submit Action -->
<div class="pt-4">
<button class="btn-gradient w-full h-20 rounded-lg flex items-center justify-center gap-3 text-2xl font-bold tracking-tight" id="submit-btn" type="submit">
<span>Launch Vibe</span>
<span class="material-symbols-outlined font-bold text-3xl" data-icon="rocket_launch">rocket_launch</span>
</button>
</div>
</form>
</div>
<!-- Success State -->
<div class="w-full flex flex-col items-center justify-center text-center py-20" id="success-state">
<div class="relative w-40 h-40 mb-8 flex items-center justify-center">
<!-- Glowing aura behind checkmark -->
<div class="absolute inset-0 bg-primary/20 blur-3xl rounded-full"></div>
<div class="w-32 h-32 rounded-full bg-primary flex items-center justify-center shadow-[0_0_50px_rgba(6,249,168,0.5)]">
<span class="material-symbols-outlined text-background-dark text-7xl font-bold" data-icon="check">check</span>
</div>
</div>
<h2 class="font-heading font-black text-5xl text-white mb-4">Vibe Shipped!</h2>
<p class="text-zinc-400 text-xl max-w-md mx-auto mb-10">Your creation is now floating in the stream. Go check it out.</p>
<button class="px-8 py-4 rounded-full glass-panel text-white font-display font-semibold hover:bg-white/10 transition-colors" onclick="resetForm()">
        Ship Another
      </button>
</div>
</main>
<script>
    const form = document.getElementById('launch-form');
    const submitBtn = document.getElementById('submit-btn');
    const submitState = document.getElementById('submit-state');
    const successState = document.getElementById('success-state');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Loading State
      submitBtn.classList.add('btn-loading');
      submitBtn.innerHTML = `
        <span>Launching...</span>
        <span class="material-symbols-outlined font-bold text-3xl animate-spin" data-icon="sync">sync</span>
      `;

      // Simulate API call
      setTimeout(() => {
        showSuccess();
      }, 1500);
    });

    function showSuccess() {
      submitState.style.display = 'none';
      successState.style.display = 'flex';
      successState.classList.add('animate-pop');
      createConfetti();
    }

    function resetForm() {
      form.reset();
      submitBtn.classList.remove('btn-loading');
      submitBtn.innerHTML = `
        <span>Launch Vibe</span>
        <span class="material-symbols-outlined font-bold text-3xl" data-icon="rocket_launch">rocket_launch</span>
      `;
      successState.style.display = 'none';
      submitState.style.display = 'flex';
      submitState.classList.add('animate-pop');
      
      // Remove confetti
      document.querySelectorAll('.confetti-piece').forEach(el => el.remove());
    }

    // Simple Confetti Effect
    function createConfetti() {
      const colors = ['#00FFAA', '#39FF14', '#FF007F', '#FF5E00', '#7000FF'];
      for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        
        // Random properties
        const color = colors[Math.floor(Math.random() * colors.length)];
        const left = 50 + (Math.random() - 0.5) * 50 + '%';
        const top = 50 + (Math.random() - 0.5) * 50 + '%';
        const size = Math.random() * 10 + 5 + 'px';
        const delay = Math.random() * 0.5 + 's';
        
        confetti.style.backgroundColor = color;
        confetti.style.left = left;
        confetti.style.top = top;
        confetti.style.width = size;
        confetti.style.height = size;
        
        // Inline animation
        confetti.animate([
          { transform: `translate(0, 0) scale(0)`, opacity: 1 },
          { transform: `translate(${(Math.random() - 0.5) * 500}px, ${(Math.random() - 0.5) * 500}px) scale(1)`, opacity: 0 }
        ], {
          duration: 1000 + Math.random() * 1000,
          easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          fill: 'forwards'
        });

        successState.appendChild(confetti);
      }
    }
  </script>
</body></html>