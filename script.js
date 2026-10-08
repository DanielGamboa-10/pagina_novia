/**
 * ==========================================================================
 * SISTEMA DIDÁCTICO E INTERACTIVO DE AMOR
 * Código limpio, optimizado y sin dependencias externas pesadas.
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. ESTADO Y CONFIGURACIÓN PERSISTENTE (LOCALSTORAGE)
     ========================================================================== */
  const DEFAULT_CONFIG = {
    girlfriendName: 'Mi Princesa Hermosa',
    yourName: 'Con todo mi amor',
    anniversaryDate: '2026-05-28',
    letterMessage: `Hace ya un tiempo decente estamos juntos, no he pedido que seas mi novia (qué falla, pero confía en el proceso, amor).\n\nVolviendo al tema, te hice esto para que veas que programo mucho SAKDJSKA mentiras, es como una muestra de demostrar lo mucho que te amo. Cada día contigo es más especial que el anterior, realmente te amo y quiero estar contigo para siempre. Eres el amor de mi vida; tus ojos, tu voz, cada cosa de ti es perfecta y la amo, para mí eres perfecta mi amor y agradezco eternamente el día que te conocí. Sé que no soy perfecto y fallo demasiado, soy muy celoso, encimoso, hasta llego a ser fastidioso, pero recuerda que te amo. Intentaré mejorar cada día, dar más de mí mismo, ser la mejor versión de mí para que tú me ames y nunca dejes de hacerlo. Quiero un futuro contigo, quiero todo contigo, te amo mi amor, eres lo mejor de mi vida.\n\nQuiero una vida llena de aura y felicidad contigo mi amor, te amo, ser felices, casarnos y vivir enamorados hasta el día de nuestra muerte, y cuando estemos en el cielo prometo buscarte y enamorarte de nuevo para estar toda la eternidad contigo.`
  };

  function loadConfig() {
    try {
      const saved = localStorage.getItem('romantic_page_config');
      const loaded = saved ? { ...DEFAULT_CONFIG, ...JSON.parse(saved) } : { ...DEFAULT_CONFIG };
      if (loaded.girlfriendName === 'Mi Niña Hermosa') {
        loaded.girlfriendName = 'Mi Princesa Hermosa';
      }
      if (!saved || loaded.anniversaryDate === '2024-01-01') {
        loaded.anniversaryDate = DEFAULT_CONFIG.anniversaryDate;
      }
      // Actualizar automáticamente a la nueva carta personalizada
      loaded.letterMessage = DEFAULT_CONFIG.letterMessage;
      saveConfig(loaded);
      return loaded;
    } catch (e) {
      return { ...DEFAULT_CONFIG };
    }
  }

  function saveConfig(config) {
    try {
      localStorage.setItem('romantic_page_config', JSON.stringify(config));
    } catch (e) {
      console.warn('No se pudo guardar la configuración en localStorage', e);
    }
  }

  let currentConfig = loadConfig();

  function applyConfigToUI() {
    const gfNameElements = [
      document.getElementById('display-girlfriend-name'),
      document.getElementById('footer-girlfriend-name')
    ];
    gfNameElements.forEach(el => {
      if (el) el.textContent = currentConfig.girlfriendName;
    });

    const signatureEl = document.getElementById('letter-signature');
    if (signatureEl) signatureEl.textContent = `${currentConfig.yourName} 💕`;

    // Actualizar texto de fecha visible
    const dateTagEl = document.getElementById('display-anniversary-date');
    if (dateTagEl && currentConfig.anniversaryDate) {
      const parts = currentConfig.anniversaryDate.split('-');
      if (parts.length === 3) {
        const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        const day = parts[2];
        const monthName = months[parseInt(parts[1], 10) - 1] || '';
        const year = parts[0];
        dateTagEl.textContent = `${day} de ${monthName} del ${year}`;
      }
    }

    // Carta
    const letterBody = document.querySelector('.parchment-body');
    if (letterBody && currentConfig.letterMessage) {
      letterBody.innerHTML = currentConfig.letterMessage
        .split('\n\n')
        .map(paragraph => `<p>${paragraph.trim()}</p>`)
        .join('');
    }

    // Formulario modal
    const inputGf = document.getElementById('input-girlfriend-name');
    const inputYour = document.getElementById('input-your-name');
    const inputDate = document.getElementById('input-anniversary-date');
    const inputLetter = document.getElementById('input-custom-letter');
    if (inputGf) inputGf.value = currentConfig.girlfriendName;
    if (inputYour) inputYour.value = currentConfig.yourName;
    if (inputDate) inputDate.value = currentConfig.anniversaryDate;
    if (inputLetter) inputLetter.value = currentConfig.letterMessage;
  }

  applyConfigToUI();

  /* ==========================================================================
     2. MOTOR DE SONIDO (WEB AUDIO API)
     Música ambiental y efectos tiernos sin necesidad de archivos externos.
     ========================================================================== */
  class RomanticAudioEngine {
    constructor() {
      this.ctx = null;
      this.audioEl = document.getElementById('romantic-bg-audio');
      this.isPlayingMusic = false;
      this.isUsingHtmlAudio = false;
      this.musicTimer = null;
      this.currentChord = 0;
      this.scale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25]; // Escala pentatónica mayor cálida
      this.chords = [
        [261.63, 329.63, 392.00, 523.25], // C mayor
        [220.00, 261.63, 329.63, 440.00], // A menor
        [174.61, 220.00, 261.63, 349.23], // F mayor
        [196.00, 246.94, 293.66, 392.00]  // G mayor
      ];
    }

    init() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    // Nota suave estilo campana/caja musical
    playBellNote(freq, timeOffset = 0, duration = 1.2, gainVol = 0.08) {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime + timeOffset;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(gainVol, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    }

    // Efecto tierno de clic o corazón
    playPop() {
      this.init();
      this.playBellNote(587.33, 0, 0.25, 0.05);
      this.playBellNote(880.00, 0.06, 0.35, 0.04);
    }

    // Efecto de apertura de carta / premio
    playChime() {
      this.init();
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        this.playBellNote(freq, idx * 0.1, 1.4, 0.07);
      });
    }

    // Fanfarria de victoria / acierto en trivia
    playFanfare() {
      this.init();
      const notes = [392.00, 523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        this.playBellNote(freq, idx * 0.09, 1.6, 0.09);
      });
    }

    // Melodía romántica en bucle suave
    toggleMusic(btnElement) {
      this.init();
      if (this.isPlayingMusic) {
        this.stopMusic();
        if (btnElement) {
          btnElement.classList.remove('active-music');
          btnElement.querySelector('.btn-icon').textContent = '🎵';
        }
      } else {
        this.startMusic();
        if (btnElement) {
          btnElement.classList.add('active-music');
          btnElement.querySelector('.btn-icon').textContent = '🎶';
        }
      }
    }

    startMusic() {
      this.isPlayingMusic = true;

      // 1. Intentar reproducir el archivo de música (.mp3) si existe
      if (this.audioEl && this.audioEl.src) {
        this.audioEl.volume = 0.75;
        const playPromise = this.audioEl.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              this.isUsingHtmlAudio = true;
            })
            .catch(() => {
              // Si el archivo cancion.mp3 aún no está presente o el navegador lo bloquea, reproducir melodía sintetizada
              this.isUsingHtmlAudio = false;
              this.startSynthesizedMusic();
            });
          return;
        }
      }

      this.startSynthesizedMusic();
    }

    startSynthesizedMusic() {
      let step = 0;
      const playNextStep = () => {
        if (!this.isPlayingMusic || !this.ctx || this.isUsingHtmlAudio) return;
        
        const currentChord = this.chords[Math.floor(step / 4) % this.chords.length];
        const noteIndex = step % currentChord.length;
        const noteFreq = currentChord[noteIndex];

        // Tocar nota arpegiada
        this.playBellNote(noteFreq, 0, 1.8, 0.04);

        // Ocasional nota alta de acompañamiento
        if (step % 2 === 0) {
          const highFreq = noteFreq * 1.5;
          this.playBellNote(highFreq, 0.15, 1.4, 0.02);
        }

        step++;
        this.musicTimer = setTimeout(playNextStep, 550);
      };

      playNextStep();
    }

    stopMusic() {
      this.isPlayingMusic = false;
      this.isUsingHtmlAudio = false;
      if (this.audioEl) {
        this.audioEl.pause();
      }
      if (this.musicTimer) {
        clearTimeout(this.musicTimer);
        this.musicTimer = null;
      }
    }
  }

  const audio = new RomanticAudioEngine();
  const musicToggleBtn = document.getElementById('music-toggle-btn');
  if (musicToggleBtn) {
    musicToggleBtn.addEventListener('click', () => {
      audio.toggleMusic(musicToggleBtn);
    });
  }

  // Manejador para cargar canción desde el modal de ajustes
  const inputMusicFile = document.getElementById('input-music-file');
  const currentSongStatus = document.getElementById('current-song-status');
  if (inputMusicFile) {
    inputMusicFile.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const fileUrl = URL.createObjectURL(file);
      if (audio.audioEl) {
        audio.audioEl.src = fileUrl;
        if (audio.isPlayingMusic) {
          audio.stopMusic();
          audio.startMusic();
        }
      }

      if (currentSongStatus) {
        currentSongStatus.textContent = `🎵 Canción lista: "${file.name}"`;
        currentSongStatus.style.color = '#087f5b';
        currentSongStatus.style.fontWeight = '600';
      }

      audio.playPop();
    });
  }

  /* ==========================================================================
     3. MOTOR DE PARTÍCULAS AMBIENTALES (CORAZONES Y DESTELLOS EN CANVAS)
     ========================================================================== */
  const canvas = document.getElementById('ambient-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const PARTICLE_COUNT = 32;

    class RomanticParticle {
      constructor() {
        this.reset(true);
      }

      reset(init = false) {
        this.x = Math.random() * width;
        this.y = init ? Math.random() * height : height + 20;
        this.size = Math.random() * 14 + 10;
        this.speedY = -(Math.random() * 0.8 + 0.3);
        this.speedX = Math.sin(Math.random() * Math.PI) * 0.5;
        this.opacity = Math.random() * 0.45 + 0.2;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
        this.isHeart = Math.random() > 0.4; // 60% corazones, 40% destellos
        this.color = Math.random() > 0.5 ? 'rgba(214, 51, 108,' : 'rgba(247, 131, 172,';
      }

      update() {
        this.y += this.speedY;
        this.x += Math.sin(this.y * 0.01) * 0.4 + this.speedX;
        this.rotation += this.rotationSpeed;

        if (this.y < -30 || this.x < -20 || this.x > width + 20) {
          this.reset();
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.fillStyle = `${this.color} ${this.opacity})`;

        if (this.isHeart) {
          // Dibujar un corazón estilizado
          const s = this.size / 15;
          ctx.beginPath();
          ctx.moveTo(0, -5 * s);
          ctx.bezierCurveTo(5 * s, -12 * s, 12 * s, -5 * s, 0, 8 * s);
          ctx.bezierCurveTo(-12 * s, -5 * s, -5 * s, -12 * s, 0, -5 * s);
          ctx.fill();
        } else {
          // Dibujar un destello brillante (estrella de 4 puntas)
          const r = this.size * 0.4;
          ctx.beginPath();
          for (let i = 0; i < 4; i++) {
            const angle = (i * Math.PI) / 2;
            const x1 = Math.cos(angle) * r;
            const y1 = Math.sin(angle) * r;
            const x2 = Math.cos(angle + Math.PI / 4) * (r * 0.25);
            const y2 = Math.sin(angle + Math.PI / 4) * (r * 0.25);
            if (i === 0) ctx.moveTo(x1, y1);
            else ctx.lineTo(x1, y1);
            ctx.lineTo(x2, y2);
          }
          ctx.closePath();
          ctx.fill();
        }

        ctx.restore();
      }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new RomanticParticle());
    }

    function animateAmbient() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animateAmbient);
    }
    animateAmbient();
  }

  /* ==========================================================================
     4. EXPLOSIÓN DE CONFETI Y CORAZONES CELEBRATORIOS
     ========================================================================== */
  function fireRomanticConfetti(originX = 0.5, originY = 0.5, count = 70) {
    const container = document.body;
    const colors = ['#e63946', '#f783ac', '#d6336c', '#ffd166', '#ff758f', '#ffffff'];
    const emojis = ['❤️', '💖', '✨', '💕', '🥰', '🌸'];

    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      const isEmoji = Math.random() > 0.5;

      el.style.position = 'fixed';
      el.style.left = `${originX * 100}vw`;
      el.style.top = `${originY * 100}vh`;
      el.style.zIndex = '9999';
      el.style.pointerEvents = 'none';

      if (isEmoji) {
        el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        el.style.fontSize = `${Math.random() * 16 + 14}px`;
      } else {
        const size = Math.random() * 10 + 6;
        el.style.width = `${size}px`;
        el.style.height = `${size}px`;
        el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        el.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      }

      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 260 + 100;
      const destX = Math.cos(angle) * velocity;
      const destY = Math.sin(angle) * velocity + 150; // Gravedad
      const rotate = (Math.random() - 0.5) * 720;
      const duration = Math.random() * 1.4 + 1.2;

      el.style.transition = `transform ${duration}s cubic-bezier(0.25, 1, 0.5, 1), opacity ${duration}s ease`;
      el.style.transform = 'translate(-50%, -50%) scale(0.5)';
      el.style.opacity = '1';

      container.appendChild(el);

      requestAnimationFrame(() => {
        el.style.transform = `translate(calc(-50% + ${destX}px), calc(-50% + ${destY}px)) rotate(${rotate}deg) scale(${Math.random() * 0.6 + 0.8})`;
        el.style.opacity = '0';
      });

      setTimeout(() => {
        if (el.parentNode) el.parentNode.removeChild(el);
      }, duration * 1000 + 100);
    }
  }

  /* ==========================================================================
     5. PANTALLA 1: APERTURA DEL SOBRE
     ========================================================================== */
  const envelopeScreen = document.getElementById('envelope-screen');
  const envelopeElement = document.getElementById('envelope-element');
  const mainContent = document.getElementById('main-content');

  function openEnvelope() {
    if (envelopeElement.classList.contains('open')) return;
    envelopeElement.classList.add('open');
    audio.playChime();
    fireRomanticConfetti(0.5, 0.45, 60);

    setTimeout(() => {
      envelopeScreen.classList.add('fade-out');
      mainContent.classList.remove('hidden');

      // Calibrar lienzos de raspa y gana con el tamaño real renderizado en celular
      requestAnimationFrame(() => {
        scratchCards.forEach(card => {
          if (card._setupScratchCanvas) card._setupScratchCanvas();
        });
      });

      // Iniciar suavemente la música de fondo al abrir si el navegador lo permite
      if (!audio.isPlayingMusic && musicToggleBtn) {
        audio.toggleMusic(musicToggleBtn);
      }
    }, 1200);

    setTimeout(() => {
      envelopeScreen.style.display = 'none';
    }, 2000);
  }

  if (envelopeElement) {
    envelopeElement.addEventListener('click', openEnvelope);
    envelopeElement.addEventListener('touchstart', (e) => {
      // Permitir apertura táctil inmediata en móviles
      openEnvelope();
    }, { passive: true });
    envelopeElement.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openEnvelope();
      }
    });
  }

  /* ==========================================================================
     6. CONTADOR DE TIEMPO JUNTOS
     ========================================================================== */
  function updateAnniversaryTimer() {
    const daysEl = document.getElementById('counter-days');
    const hoursEl = document.getElementById('counter-hours');
    const minutesEl = document.getElementById('counter-minutes');
    const secondsEl = document.getElementById('counter-seconds');

    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

    const startDate = new Date(currentConfig.anniversaryDate + 'T00:00:00');
    const now = new Date();
    const diffMs = now - startDate;

    if (isNaN(diffMs)) {
      daysEl.textContent = '0';
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';
      return;
    }

    const totalSeconds = Math.floor(Math.abs(diffMs) / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    daysEl.textContent = days.toLocaleString();
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  setInterval(updateAnniversaryTimer, 1000);
  updateAnniversaryTimer();

  /* ==========================================================================
     7. DINÁMICA 1: VALES DE AMOR (RASPA Y GANA EN CANVAS)
     ========================================================================== */
  const scratchCards = document.querySelectorAll('.scratch-card-wrapper');

  scratchCards.forEach(cardWrapper => {
    const canvas = cardWrapper.querySelector('.scratch-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    let isScratching = false;
    let isRevealed = cardWrapper.classList.contains('revealed');

    // Redimensionar canvas a su tamaño real CSS y renderizar textura
    function setupScratchCanvas() {
      if (isRevealed) return;
      const rect = cardWrapper.getBoundingClientRect();
      const w = Math.round(rect.width) || 300;
      const h = Math.round(rect.height) || 220;

      // Si las dimensiones son idénticas y ya fue pintado, omitir
      if (canvas.width === w && canvas.height === h && canvas._hasDrawn) return;

      canvas.width = w;
      canvas.height = h;
      canvas._hasDrawn = true;

      // Fondo metálico dorado/rosado raspable
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      grad.addColorStop(0, '#f9c5d1');
      grad.addColorStop(0.3, '#f783ac');
      grad.addColorStop(0.7, '#e0a96d');
      grad.addColorStop(1, '#f9c5d1');

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Destellos y textura elegante
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      for (let i = 0; i < 50; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const r = Math.random() * 2 + 1;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Texto decorativo sobre el canvas perfectamente centrado
      const fontSize = Math.max(13, Math.min(17, Math.round(canvas.width / 19)));
      ctx.font = `bold ${fontSize}px Outfit, sans-serif`;
      ctx.fillStyle = '#5c0f2b';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('✨ Raspa para descubrir ✨', canvas.width / 2, canvas.height / 2);
    }

    cardWrapper._setupScratchCanvas = setupScratchCanvas;
    setupScratchCanvas();

    function scratch(e) {
      if (!isScratching || isRevealed) return;
      if (e && e.cancelable) e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const clientX = e.touches && e.touches.length > 0 ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches && e.touches.length > 0 ? e.touches[0].clientY : e.clientY;

      // Coordenadas escaladas para coincidir exactamente con el pixelado interno del canvas
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = (clientX - rect.left) * scaleX;
      const y = (clientY - rect.top) * scaleY;

      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      // Radio ergonómico según el ancho en celular
      const radius = Math.max(20, Math.min(28, canvas.width / 12));
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();

      checkScratchPercentage();
    }

    let checkThrottle = 0;
    function checkScratchPercentage() {
      const now = Date.now();
      if (now - checkThrottle < 120) return;
      checkThrottle = now;

      try {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        let transparentPixels = 0;
        const sampleStep = 32;

        for (let i = 3; i < pixels.length; i += 4 * sampleStep) {
          if (pixels[i] === 0) {
            transparentPixels++;
          }
        }

        const totalSampled = pixels.length / (4 * sampleStep);
        const percentage = (transparentPixels / totalSampled) * 100;

        if (percentage > 40 && !isRevealed) {
          isRevealed = true;
          isScratching = false;
          cardWrapper.classList.add('revealed');
          canvas.style.transition = 'opacity 0.6s ease';
          canvas.style.opacity = '0';
          setTimeout(() => {
            canvas.style.pointerEvents = 'none';
          }, 600);

          audio.playFanfare();
          const r = cardWrapper.getBoundingClientRect();
          const originX = (r.left + r.width / 2) / window.innerWidth;
          const originY = (r.top + r.height / 2) / window.innerHeight;
          fireRomanticConfetti(originX, originY, 40);
        }
      } catch (err) {}
    }

    // Eventos Mouse
    canvas.addEventListener('mousedown', (e) => {
      isScratching = true;
      scratch(e);
    });
    window.addEventListener('mouseup', () => (isScratching = false));
    canvas.addEventListener('mousemove', scratch);

    // Eventos Táctiles (Mobile)
    canvas.addEventListener('touchstart', (e) => {
      isScratching = true;
      if (e.cancelable) e.preventDefault();
      scratch(e);
    }, { passive: false });
    window.addEventListener('touchend', () => (isScratching = false));
    canvas.addEventListener('touchmove', (e) => {
      if (isScratching && e.cancelable) e.preventDefault();
      scratch(e);
    }, { passive: false });
  });

  // Re-calibrar al cambiar tamaño u orientación de pantalla
  let scratchResizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(scratchResizeTimer);
    scratchResizeTimer = setTimeout(() => {
      scratchCards.forEach(card => {
        if (!card.classList.contains('revealed') && card._setupScratchCanvas) {
          card._setupScratchCanvas();
        }
      });
    }, 250);
  });

  /* ==========================================================================
     8. DINÁMICA 2: TRIVIA INTERACTIVA ("¿QUÉ TANTO NOS CONOCEMOS?")
     ========================================================================== */
  const TRIVIA_QUESTIONS = [
    {
      question: '¿Qué es lo que más me enamora de ti todos los días?',
      options: [
        '¡Absolutamente todo de ti, no cambiaría nada! ❤️',
        'La forma tan tierna y dulce en que me miras ✨',
        'Tu gran corazón y lo increíblemente inteligente que eres 💖',
        'Tu hermosa sonrisa que ilumina hasta mi peor día 🥰'
      ],
      correctIndex: 0, // Opción A
      feedback: '¡Exacto! Cada detalle tuyo me tiene completamente enamorado, ¡eres perfecta tal y como eres!',
      wrongFeedback: '¡Casi! Aunque todo de ti me fascina, ¡la respuesta es absolutamente TODO! 🥰'
    },
    {
      question: '¿Quién es indiscutiblemente el único amor de mi vida?',
      options: [
        'Un marciano verde con sombrero 👽',
        'Karen (la mujer más hermosa y perfecta de este mundo) ❤️',
        'Shrek viviendo en su pantano 🧅',
        'Una empanada con ají 🥟'
      ],
      correctIndex: 1, // Opción B
      feedback: '¡Pues claro que sí! Eres tú, Karen, mi princesa hermosa y el único gran amor de mi vida entera. 🥰',
      wrongFeedback: '¡Claro que no! Nada se compara al inmenso amor que te tengo.'
    },
    {
      question: '¿Quién es la dueña indiscutible de mis pensamientos y mi corazón?',
      options: [
        'La chica de la mirada más bonita del mundo ✨',
        'Mi princesa consentida 💖',
        '¡Tú, Karen, y absolutamente nadie más en este planeta! 👑❤️',
        'Una sirenita en el océano 🧜‍♀️'
      ],
      correctIndex: 2, // Opción C
      feedback: '¡No había ninguna duda! Eres y siempre serás la única reina de mi corazón. 🥰',
      wrongFeedback: '¡Casi! Aunque eres todo eso, ¡tú eres la única dueña de mi corazón! ❤️'
    },
    {
      question: '¿Cuál es mi superpoder favorito que tú tienes?',
      options: [
        'El poder de hacerme sonreír con un solo mensaje tuyo 📱',
        'Hacer que cualquier abrazo tuyo se sienta como el mejor hogar 🏡❤️',
        'Tener los ojos más hermosos del universo entero ✨',
        'Poder teletransportarte a mis brazos cuando te extraño 💫'
      ],
      correctIndex: 1, // Opción B
      feedback: '¡Totalmente cierto! En tus brazos encuentro la paz más bonita del mundo.',
      wrongFeedback: '¡Ese también me encanta! Pero cuando me abrazas, todo mi mundo se calma. 🏡❤️'
    },
    {
      question: '¿Cuánto te amo y pienso amarte?',
      options: [
        'Muchísimo 💖',
        'Hasta la luna en pasitos de tortuga 🐢🌙',
        'Hasta el infinito y más allá, multiplicado por mil millones ✨',
        'Más de lo que todas las palabras y estrellas de este universo pueden explicar ❤️'
      ],
      correctIndex: 3, // Opción D
      feedback: '¡Amor infinito! Ni todas las estrellas del cielo alcanzan para medir lo mucho que te amo.',
      wrongFeedback: '¡Te amo muchísimo más que eso! Mi amor por ti rompe cualquier medida. ❤️'
    }
  ];

  let triviaCurrentIndex = 0;
  let triviaScore = 0;

  const triviaQuestionEl = document.getElementById('trivia-question-text');
  const triviaOptionsContainer = document.getElementById('trivia-options');
  const triviaStepEl = document.getElementById('trivia-step-text');
  const triviaScoreEl = document.getElementById('trivia-score-text');
  const triviaProgressEl = document.getElementById('trivia-progress');
  const triviaFeedbackEl = document.getElementById('trivia-feedback');
  const feedbackMsgEl = document.getElementById('feedback-msg');
  const triviaNextBtn = document.getElementById('trivia-next-btn');
  const triviaCardEl = document.getElementById('trivia-card');
  const triviaCompletedEl = document.getElementById('trivia-completed');
  const triviaRestartBtn = document.getElementById('trivia-restart-btn');

  function renderTriviaQuestion() {
    const q = TRIVIA_QUESTIONS[triviaCurrentIndex];
    triviaQuestionEl.textContent = q.question;
    triviaStepEl.textContent = `Pregunta ${triviaCurrentIndex + 1} de ${TRIVIA_QUESTIONS.length}`;
    triviaScoreEl.textContent = `Puntuación: ${triviaScore} ❤️`;
    triviaProgressEl.style.width = `${((triviaCurrentIndex + 1) / TRIVIA_QUESTIONS.length) * 100}%`;

    triviaOptionsContainer.innerHTML = '';
    triviaFeedbackEl.classList.add('hidden');

    q.options.forEach((optText, idx) => {
      const btn = document.createElement('button');
      btn.className = 'trivia-opt-btn';
      btn.innerHTML = `<span class="opt-letter">${String.fromCharCode(65 + idx)}.</span> <span>${optText}</span>`;
      btn.addEventListener('click', () => handleTriviaAnswer(idx, btn));
      triviaOptionsContainer.appendChild(btn);
    });
  }

  function handleTriviaAnswer(selectedIdx, btnElement) {
    const q = TRIVIA_QUESTIONS[triviaCurrentIndex];
    const allButtons = triviaOptionsContainer.querySelectorAll('.trivia-opt-btn');
    allButtons.forEach(b => (b.disabled = true));

    const feedbackIconEl = document.getElementById('feedback-icon');

    if (selectedIdx === q.correctIndex) {
      btnElement.classList.add('correct');
      triviaScore++;
      triviaScoreEl.textContent = `Puntuación: ${triviaScore} ❤️`;
      audio.playChime();
      fireRomanticConfetti(0.5, 0.6, 30);
      if (feedbackIconEl) feedbackIconEl.textContent = '🎉';
      feedbackMsgEl.textContent = q.feedback;
    } else {
      btnElement.classList.add('wrong');
      allButtons[q.correctIndex].classList.add('correct');
      audio.playPop();
      if (feedbackIconEl) feedbackIconEl.textContent = '🙈';
      feedbackMsgEl.textContent = q.wrongFeedback || '¡Claro que no! Nada se compara al inmenso amor que te tengo.';
    }

    triviaFeedbackEl.classList.remove('hidden');
  }

  if (triviaNextBtn) {
    triviaNextBtn.addEventListener('click', () => {
      triviaCurrentIndex++;
      if (triviaCurrentIndex < TRIVIA_QUESTIONS.length) {
        renderTriviaQuestion();
      } else {
        showTriviaSummary();
      }
    });
  }

  function showTriviaSummary() {
    triviaCardEl.classList.add('hidden');
    triviaCompletedEl.classList.remove('hidden');
    const summaryText = document.getElementById('trivia-summary-text');
    if (summaryText) {
      summaryText.textContent = `¡Obtuviste ${triviaScore} de ${TRIVIA_QUESTIONS.length} respuestas correctas con mención de honor! 🏆❤️`;
    }
    audio.playFanfare();
    fireRomanticConfetti(0.5, 0.5, 80);
  }

  if (triviaRestartBtn) {
    triviaRestartBtn.addEventListener('click', () => {
      triviaCurrentIndex = 0;
      triviaScore = 0;
      triviaCompletedEl.classList.add('hidden');
      triviaCardEl.classList.remove('hidden');
      renderTriviaQuestion();
    });
  }

  renderTriviaQuestion();

  /* ==========================================================================
     9. DINÁMICA 3: EL FRASCO DE RAZONES
     ========================================================================== */
  const ROMANTIC_REASONS = [
    "Amo la paz inmensa que siento en el pecho cada vez que me abrazas.",
    "Amo cómo se te arruga la naricita o cómo sonríes cuando algo te da mucha risa.",
    "Amo que con solo un mensaje tuyo eres capaz de cambiar por completo un día difícil.",
    "Amo tu mirada, porque en ella encontré mi lugar favorito en el mundo.",
    "Amo cómo apoyas mis sueños y cómo siempre crees en mí incluso cuando yo dudo.",
    "Amo escuchar tu voz, es mi melodía preferida para calmar el corazón.",
    "Amo quedarme dormido pensando en ti y despertar con ganas de escribirte.",
    "Amo que eres mi mejor amiga, mi confidente y el amor de mi vida al mismo tiempo.",
    "Amo lo dulce, atenta y noble que eres con quienes amas.",
    "Amo nuestras charlas interminables sobre cualquier tontería que nos hace reír.",
    "Amo la forma en que encajan nuestras manos cuando caminamos juntos.",
    "Amo que me inspiras a ser una mejor versión de mí mismo todos los días.",
    "Amo tu inteligencia y la pasión que le pones a las cosas que te importan.",
    "Amo cómo hueles; tu aroma se queda grabado en mi ropa y en mi memoria.",
    "Amo que cada pequeño plan contigo se convierte en una gran aventura.",
    "Amo tu ternura infinita cuando me consientes.",
    "Amo que contigo puedo ser 100% yo mismo, sin miedos ni máscaras.",
    "Amo cuando me cuentas tus cosas y se te iluminan los ojos de emoción.",
    "Amo que no necesito pedirle nada más a la vida porque contigo lo tengo todo.",
    "Amo que eres y siempre serás mi princesa hermosa preferida.",
    "Amo la calidez de tus besos cuando nos saludamos o nos despedimos.",
    "Amo cómo defiendes con firmeza lo que crees y lo que sientes.",
    "Amo tu paciencia infinita y tu capacidad de entenderme con una sola mirada.",
    "Amo cada parte de ti, desde tu hermosa sonrisa y tu gran corazón, hasta cada pequeño detalle que te hace única y perfecta para mí.",
    "Amo cuando me abrazas por sorpresa y el tiempo parece detenerse.",
    "Amo la forma tan bonita en que pronuncias mi nombre.",
    "Amo que juntos podemos pasar de una conversación profunda a reírnos como niños.",
    "Amo tus detalles inesperados que demuestran lo mucho que te importo.",
    "Amo cada vez que siempre hablamos para resolver nuestros problemas y estar en paz.",
    "Amo cómo tus ojitos brillan cuando ves algo que te hace muy feliz.",
    "Amo que celebras mis logros como si fueran tuyos.",
    "Amo tu sentido del humor único que solo nosotros dos entendemos.",
    "Amo que en tus brazos cualquier lugar se convierte en mi hogar.",
    "Amo la valentía con la que enfrentas cada obstáculo en tu vida.",
    "Amo que nunca dejas de sorprenderme con tus ocurrencias.",
    "Amo caminar contigo sin prisa, simplemente disfrutando de tu compañía.",
    "Amo cuando te ríes tan fuerte que se te escapa la risa de verdad.",
    "Amo que respetas mis tiempos y mis espacios, y que me cuidas tanto.",
    "Amo esa forma tan tierna en la que pides que te abrace o te mime.",
    "Amo que convertiste mis días comunes en recuerdos inolvidables.",
    "Amo lo hermosa que te ves tanto recién levantada como cuando te arreglas.",
    "Amo tu sencillez y lo grande que es tu corazón.",
    "Amo recordar el día en que te conocí y darme cuenta de lo afortunado que fui.",
    "Te amo, Karen Sofía ❤️",
    "Amo cómo me miras cuando crees que no me doy cuenta.",
    "Amo que me escuches con tanta atención cuando te cuento algo que me apasiona.",
    "Amo tu lado consentidor y también tu lado divertido y travieso.",
    "Amo que eres mi refugio seguro cada vez que las cosas se complican.",
    "Amo cómo me enseñas a ver el lado positivo de las cosas.",
    "Amo que contigo el amor se siente fácil, bonito y en paz.",
    "Amo la complicidad que tenemos en medio de una habitación llena de gente.",
    "Amo que tus abrazos tienen el poder mágico de quitarme el estrés.",
    "Amo tu forma de caminar y el compás con el que vas a mi lado.",
    "Amo tus manitas y lo suave que se siente cuando entrelazas tus dedos con los míos.",
    "Amo cuando me dices 'te amo' de la nada y me reinicias la vida.",
    "Amo que siempre buscas la manera de sacarme una sonrisa si me notas apagado.",
    "Amo planear viajes, salidas y metas a futuro a tu lado.",
    "Amo tu lado detallista y tierno.",
    "Amo que me hagas sentir el hombre más afortunado del planeta.",
    "Amo tu lealtad incondicional y el valor que le das a lo nuestro.",
    "Amo esos pequeños besitos rápidos que me robas sin avisar.",
    "Amo que compartas tus miedos y vulnerabilidades conmigo con total confianza.",
    "Amo tu generosidad y la empatía con la que tratas a los demás.",
    "Amo que me conozcas tan bien que sabes lo que pienso antes de hablar.",
    "Amo la emoción con la que me recibes cada vez que nos vemos.",
    "Amo que eres hermosa por fuera, pero mil veces más hermosa por dentro.",
    "Amo cómo cuidas a las personas que quieres con tanto esmero.",
    "Amo quedarme despierto hablando contigo por teléfono o en persona hasta tarde.",
    "Amo que siempre tienes las palabras exactas para reconfortarme.",
    "Amo cuando te pruebas ropa o te peinas y me preguntas cómo te ves (siempre perfecta).",
    "Amo que cada aniversario o fecha especial a tu lado sea un motivo de celebración.",
    "Amo que eres mi prioridad y la razón de mis mayores sonrisas.",
    "Amo la fuerza con la que te levantas cada vez que algo sale mal.",
    "Amo tu capacidad de hacer que cualquier comida sencilla sepa deliciosa si es contigo.",
    "Amo que nuestro amor no es perfecto, pero es real, sincero y único.",
    "Amo la suavidad de tu piel y la calma de tu respiración a mi lado.",
    "Amo que no necesito fingir nada contigo, me amas tal como soy.",
    "Amo tus fotos y cómo iluminas mi galería con tu belleza.",
    "Amo que seas la primera persona a la que quiero contarle una buena noticia.",
    "Amo cuando te emocionas con tus series, películas o libros favoritos.",
    "Amo que contigo aprendí lo que realmente significa amar con el alma.",
    "Amo la ilusión con la que sueñas y construyes tu futuro.",
    "Amo cuando me tomas del brazo mientras caminamos por la calle.",
    "Amo la ternura con la que me dices palabras cariñosas.",
    "Amo que tu felicidad se convirtió en mi mayor alegría.",
    "Amo cómo se siente apoyarme en tu hombro y respirar hondo.",
    "Amo que eres mi amor de hoy, de mañana y de todos los días que vengan.",
    "Amo que sabes cómo calmarme en mis momentos de caos.",
    "Amo cada chiste interno que solo tú y yo comprendemos.",
    "Amo el brillo de tus ojos bajo la luz de la luna o de los atardeceres.",
    "Amo que me elijas todos los días, así como yo te elijo a ti.",
    "Amo que eres mi persona favorita en todo el universo.",
    "Amo la paz que dejas en mi vida con tu sola presencia.",
    "Amo que no hay nadie más en el mundo que se compare a ti.",
    "Amo los recuerdos tan hermosos que ya hemos construido juntos.",
    "Amo todos los recuerdos increíbles que todavía nos faltan por vivir.",
    "Amo tu dulzura infinita que nunca deja de derretir mi corazón.",
    "Amo que me haces sentir amado, valorado y especial cada día.",
    "Amo todo lo que fuiste, todo lo que eres y todo lo que serás.",
    "Amo simplemente que existas y que hayas decidido compartir tu vida conmigo, mi princesa hermosa."
  ];

  let currentReasonIndex = 0;
  const jarClickable = document.getElementById('jar-clickable');
  const drawAnotherBtn = document.getElementById('draw-another-note-btn');
  const noteBadge = document.getElementById('note-counter-badge');
  const noteQuote = document.getElementById('note-quote-text');
  const noteBox = document.getElementById('extracted-note-box');

  function drawNextReason() {
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * ROMANTIC_REASONS.length);
    } while (nextIndex === currentReasonIndex && ROMANTIC_REASONS.length > 1);

    currentReasonIndex = nextIndex;
    audio.playPop();

    // Reanimar la tarjeta
    noteBox.style.animation = 'none';
    noteBox.offsetHeight; // Forzar reflujo
    noteBox.style.animation = 'notePop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';

    noteBadge.textContent = `Razón #${currentReasonIndex + 1} de ${ROMANTIC_REASONS.length}`;
    noteQuote.textContent = `"${ROMANTIC_REASONS[currentReasonIndex]}"`;

    // Efecto de partículas pequeñas sobre el frasco
    const rect = jarClickable.getBoundingClientRect();
    const originX = (rect.left + rect.width / 2) / window.innerWidth;
    const originY = (rect.top + rect.height / 2) / window.innerHeight;
    fireRomanticConfetti(originX, originY, 20);
  }

  if (jarClickable) jarClickable.addEventListener('click', drawNextReason);
  if (drawAnotherBtn) drawAnotherBtn.addEventListener('click', drawNextReason);

  // Inicializar badge con el total de 100
  if (noteBadge) {
    noteBadge.textContent = `Razón #1 de ${ROMANTIC_REASONS.length}`;
  }

  // Modal para ver las 100 razones completas
  const allReasonsModal = document.getElementById('all-reasons-modal');
  const viewAllReasonsBtn = document.getElementById('view-all-reasons-btn');
  const allReasonsCloseBtn = document.getElementById('all-reasons-close-btn');
  const allReasonsDoneBtn = document.getElementById('all-reasons-done-btn');
  const allReasonsList = document.getElementById('all-reasons-list');

  function renderAllReasonsList() {
    if (!allReasonsList) return;
    allReasonsList.innerHTML = '';
    ROMANTIC_REASONS.forEach((reason, i) => {
      const item = document.createElement('div');
      item.className = 'reason-item-card';
      item.innerHTML = `
        <span class="reason-index-chip">#${i + 1}</span>
        <p class="reason-item-text">"${reason}"</p>
      `;
      allReasonsList.appendChild(item);
    });
  }

  if (viewAllReasonsBtn && allReasonsModal) {
    viewAllReasonsBtn.addEventListener('click', () => {
      renderAllReasonsList();
      allReasonsModal.showModal();
      audio.playPop();
    });
  }

  if (allReasonsCloseBtn) {
    allReasonsCloseBtn.addEventListener('click', () => allReasonsModal.close());
  }
  if (allReasonsDoneBtn) {
    allReasonsDoneBtn.addEventListener('click', () => allReasonsModal.close());
  }
  if (allReasonsModal) {
    allReasonsModal.addEventListener('click', (e) => {
      if (e.target === allReasonsModal) allReasonsModal.close();
    });
  }

  /* ==========================================================================
     10. DINÁMICA 5: GALERÍA POLAROID (LIGHTBOX Y SUBIR FOTOS)
     ========================================================================== */
  const photoModal = document.getElementById('photo-modal');
  const modalImg = document.getElementById('modal-img');
  const modalCaption = document.getElementById('modal-caption-text');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  function attachPolaroidEvents() {
    const polaroidItems = document.querySelectorAll('.polaroid-item');
    polaroidItems.forEach(item => {
      item.onclick = () => {
        const photoSrc = item.getAttribute('data-photo') || item.querySelector('img').src;
        const caption = item.getAttribute('data-caption') || item.querySelector('.polaroid-caption').textContent;
        modalImg.src = photoSrc;
        modalCaption.textContent = caption;
        photoModal.showModal();
        audio.playPop();
      };
    });
  }
  attachPolaroidEvents();

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', () => photoModal.close());
  }
  if (photoModal) {
    photoModal.addEventListener('click', (e) => {
      if (e.target === photoModal) photoModal.close();
    });
  }

  // Subir fotos reales personalizadas
  const photoFileInput = document.getElementById('photo-file-input');
  const polaroidGrid = document.getElementById('polaroid-grid');

  if (photoFileInput && polaroidGrid) {
    photoFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const newImgData = event.target.result;
        const newFigure = document.createElement('figure');
        newFigure.className = 'polaroid-item';
        newFigure.tabIndex = 0;
        newFigure.setAttribute('role', 'button');
        newFigure.setAttribute('data-photo', newImgData);
        newFigure.setAttribute('data-caption', 'Un recuerdo nuestro inolvidable e irrepetible. ❤️');

        newFigure.innerHTML = `
          <div class="polaroid-tape"></div>
          <div class="polaroid-img-wrapper">
            <img src="${newImgData}" alt="Nuestra foto juntos">
          </div>
          <figcaption class="polaroid-caption">Nuestro Momento ❤️</figcaption>
        `;

        polaroidGrid.appendChild(newFigure);
        attachPolaroidEvents();
        audio.playChime();
        fireRomanticConfetti(0.5, 0.7, 45);

        // Guardar foto en almacenamiento local si es pequeña
        try {
          localStorage.setItem('romantic_custom_photo', newImgData);
        } catch (err) {
          console.log('La imagen es demasiado grande para localStorage, se mantendrá en esta sesión.');
        }
      };
      reader.readAsDataURL(file);
    });

    // Cargar foto guardada previa si existe
    try {
      const savedPhoto = localStorage.getItem('romantic_custom_photo');
      if (savedPhoto) {
        const savedFigure = document.createElement('figure');
        savedFigure.className = 'polaroid-item';
        savedFigure.tabIndex = 0;
        savedFigure.setAttribute('role', 'button');
        savedFigure.setAttribute('data-photo', savedPhoto);
        savedFigure.setAttribute('data-caption', 'Nuestro recuerdo favorito guardado con amor.');
        savedFigure.innerHTML = `
          <div class="polaroid-tape"></div>
          <div class="polaroid-img-wrapper">
            <img src="${savedPhoto}" alt="Foto personalizada">
          </div>
          <figcaption class="polaroid-caption">Nosotros Siempre ✨</figcaption>
        `;
        polaroidGrid.appendChild(savedFigure);
        attachPolaroidEvents();
      }
    } catch (e) {}
  }

  /* ==========================================================================
     11. DINÁMICA 6: EL BOTÓN ESCURRIDIZO ("NO" ESCAPA, "SÍ" CELEBRA)
     ========================================================================== */
  const btnYes = document.getElementById('btn-yes');
  const btnNo = document.getElementById('btn-no');
  const buttonsBox = document.getElementById('easter-buttons-box');
  const runawayHint = document.getElementById('runaway-hint-text');
  const celebrationModal = document.getElementById('celebration-modal');
  const celebrationCloseBtn = document.getElementById('celebration-close-btn');

  let runawayCount = 0;
  const runawayPhrases = [
    "¡Ups, se me resbaló! 😜",
    "¡Ese botón no funciona, amor! 🙈",
    "¡Oye, por ahí no es! Elige el grandote ❤️",
    "¿Estás 100% segura? Piénsalo bien... 🥺",
    "¡El botón de la izquierda tiene chocolates y besos! 🍫",
    "¡No te resistas a mi amor! 🥰"
  ];

  function dodgeButton(e) {
    if (e && e.cancelable) e.preventDefault();
    runawayCount++;

    const boxRect = buttonsBox.getBoundingClientRect();
    const btnRect = btnNo.getBoundingClientRect();

    // Rango seguro que jamás se desborda en pantallas pequeñas de celular
    const isMobile = window.innerWidth <= 600;
    const maxShiftX = isMobile 
      ? Math.max(20, Math.min((boxRect.width - btnRect.width) / 2 - 10, 80))
      : Math.min((boxRect.width - btnRect.width) / 2, 140);
    const maxShiftY = isMobile ? 35 : 55;

    const randomX = (Math.random() - 0.5) * (maxShiftX * 2);
    const randomY = (Math.random() - 0.5) * (maxShiftY * 2);

    btnNo.style.position = 'relative';
    btnNo.style.transform = `translate(${randomX}px, ${randomY}px)`;

    // Agrandar progresivamente el botón del Sí
    const currentScale = 1 + Math.min(runawayCount * 0.08, 0.4);
    btnYes.style.transform = `scale(${currentScale})`;

    if (runawayHint) {
      runawayHint.textContent = runawayPhrases[runawayCount % runawayPhrases.length];
    }

    audio.playPop();
  }

  if (btnNo) {
    btnNo.addEventListener('mouseenter', dodgeButton);
    btnNo.addEventListener('touchstart', dodgeButton, { passive: false });
    btnNo.addEventListener('click', dodgeButton);
  }

  if (btnYes) {
    btnYes.addEventListener('click', () => {
      audio.playFanfare();
      fireRomanticConfetti(0.5, 0.5, 100);
      celebrationModal.showModal();

      // Ráfaga continua de confeti de 3 segundos
      const interval = setInterval(() => {
        fireRomanticConfetti(Math.random(), Math.random() * 0.6, 30);
      }, 500);

      setTimeout(() => clearInterval(interval), 3000);
    });
  }

  if (celebrationCloseBtn) {
    celebrationCloseBtn.addEventListener('click', () => {
      celebrationModal.close();
    });
  }

  /* ==========================================================================
     12. MODAL DE PERSONALIZACIÓN Y AJUSTES
     ========================================================================== */
  const customizerModal = document.getElementById('customizer-modal');
  const customizeToggleBtn = document.getElementById('customize-toggle-btn');
  const customizerCloseBtn = document.getElementById('customizer-close-btn');
  const customizerForm = document.getElementById('customizer-form');
  const btnResetDefaults = document.getElementById('btn-reset-defaults');

  if (customizeToggleBtn) {
    customizeToggleBtn.addEventListener('click', () => {
      customizerModal.showModal();
    });
  }

  if (customizerCloseBtn) {
    customizerCloseBtn.addEventListener('click', () => {
      customizerModal.close();
    });
  }

  if (customizerForm) {
    customizerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const gfName = document.getElementById('input-girlfriend-name').value.trim();
      const yourName = document.getElementById('input-your-name').value.trim();
      const annivDate = document.getElementById('input-anniversary-date').value;
      const letter = document.getElementById('input-custom-letter').value.trim();

      currentConfig = {
        girlfriendName: gfName || DEFAULT_CONFIG.girlfriendName,
        yourName: yourName || DEFAULT_CONFIG.yourName,
        anniversaryDate: annivDate || DEFAULT_CONFIG.anniversaryDate,
        letterMessage: letter || DEFAULT_CONFIG.letterMessage
      };

      saveConfig(currentConfig);
      applyConfigToUI();
      updateAnniversaryTimer();
      customizerModal.close();

      audio.playChime();
      fireRomanticConfetti(0.5, 0.4, 40);
    });
  }

  if (btnResetDefaults) {
    btnResetDefaults.addEventListener('click', () => {
      currentConfig = { ...DEFAULT_CONFIG };
      saveConfig(currentConfig);
      applyConfigToUI();
      updateAnniversaryTimer();
      audio.playPop();
    });
  }

  // Botón Volver Arriba
  const backToTopBtn = document.getElementById('back-to-top-btn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

});
