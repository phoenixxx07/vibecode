const NOTIF_SOUND_URL = "/sound/notif.wav";

let audioCtx: AudioContext | null = null;
let audioUnlocked = false;

function playBeep() {
  if (typeof window === "undefined") return;

  try {
    audioCtx = audioCtx ?? new AudioContext();
    void audioCtx.resume().then(() => {
      if (!audioCtx) return;

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.18);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(audioCtx.currentTime);
      osc.stop(audioCtx.currentTime + 0.18);
    });
  } catch {
    // ignore
  }
}

export function unlockNotificationAudio() {
  if (typeof window === "undefined") return;

  try {
    audioCtx = audioCtx ?? new AudioContext();
    void audioCtx.resume();

    const probe = new Audio(NOTIF_SOUND_URL);
    probe.volume = 0.001;
    void probe.play().then(() => {
      probe.pause();
      audioUnlocked = true;
    }).catch(() => {});
  } catch {
    // ignore
  }
}

let unlockListenersAttached = false;

function attachUnlockListeners() {
  if (unlockListenersAttached || typeof window === "undefined") return;
  unlockListenersAttached = true;

  const unlock = () => unlockNotificationAudio();
  window.addEventListener("pointerdown", unlock, { passive: true });
  window.addEventListener("keydown", unlock);
}

export function playNotificationSound() {
  if (typeof window === "undefined") return;
  attachUnlockListeners();

  const playback = new Audio(NOTIF_SOUND_URL);
  playback.preload = "auto";
  playback.volume = 1;

  void playback.play().then(() => {
    audioUnlocked = true;
  }).catch(() => {
    if (audioUnlocked) {
      const retry = new Audio(NOTIF_SOUND_URL);
      void retry.play().catch(() => playBeep());
      return;
    }
    playBeep();
  });
}

export async function requestNotificationPermission() {
  if (typeof window === "undefined" || !("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  const result = await Notification.requestPermission();
  return result === "granted";
}

export function showChatNotification(title: string, body: string) {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission !== "granted") return;
  if (!document.hidden) return;

  const preview = body.length > 120 ? `${body.slice(0, 117)}...` : body;
  new Notification(title, {
    body: preview,
    tag: "vibecatalog-chat",
  });
}
