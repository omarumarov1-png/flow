(() => {
  "use strict";

  const PROGRESS_KEY = "flow-progress-v1";
  const THEME_KEY = "flow-theme";
  const SOUND_KEY = "flow-sound";
  const PASSAGE_VOICE_KEY = "flow-passage-voice";
  const MAX_MISSED = 150;
  const REVISION_SIZE = 20;
  const ADVANCE_DELAY_CORRECT = 900;
  const ADVANCE_DELAY_WRONG = 2500;

  // A small shared icon set (currentColor throughout, so each one just
  // inherits whatever color its container already sets) used in place of
  // emoji across the app -- emoji render inconsistently across
  // platforms/fonts, these don't.
  const ICON_CHECK = `<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M5 12.5l4.3 4.3L19 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const ICON_CHECK_BIG = `<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M4 12.5l5.5 5.5L20 6.5" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const ICON_X_BIG = `<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>`;
  const ICON_LOCK = `<svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2.2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8 11V7.6a4 4 0 018 0V11" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`;
  const ICON_BOOK = `<svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true"><path d="M12 5.5c-1.6-1.2-3.8-1.8-6.5-1.8v13.6c2.7 0 4.9.6 6.5 1.8m0-13.6c1.6-1.2 3.8-1.8 6.5-1.8v13.6c-2.7 0-4.9.6-6.5 1.8m0-13.6v13.6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"/></svg>`;
  const ICON_FLAG = `<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M6.5 3v18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M6.5 4.2h10.5l-2.8 3.8 2.8 3.8H6.5z" fill="currentColor" opacity="0.9"/></svg>`;
  const ICON_SPEAKER = `<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" style="vertical-align:-2px"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/><path d="M16.5 9a3.5 3.5 0 010 6M19 6.5a7 7 0 010 11" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`;
  const ICON_STOP = `<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" style="vertical-align:-2px"><rect x="5" y="5" width="14" height="14" rx="2" fill="currentColor"/></svg>`;
  const ICON_SLOW = `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M4 12a8 8 0 1116 0 8 8 0 01-16 0z" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M12 8v4l2.6 2.6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M2.5 12h1.5M20 12h1.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="1 2.4"/></svg>`;
  const ICON_HINT = `<svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" style="vertical-align:-2px"><path d="M9 18h6M10 21h4M12 3a6 6 0 00-3.6 10.8c.6.45 1.1 1.1 1.1 1.95V16h5v-.25c0-.85.5-1.5 1.1-1.95A6 6 0 0012 3z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/></svg>`;
  const ICON_MAN = `<svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" style="vertical-align:-2px"><circle cx="12" cy="7" r="3.4" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M4.5 20c1.4-3.6 4.4-5.5 7.5-5.5s6.1 1.9 7.5 5.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`;
  const ICON_WOMAN = `<svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" style="vertical-align:-2px"><circle cx="12" cy="6.5" r="3.2" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M12 9.7v5.3M9 13h6M8 20l4-5 4 5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const ICON_CLOUD = `<svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" style="vertical-align:-2px"><path d="M7 18a4 4 0 01-.5-7.97A5 5 0 0116.9 9.1 3.5 3.5 0 0116.5 16H7z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>`;
  const ICON_CHEVRON_DOWN = `<svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true" style="vertical-align:-1px"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const ICON_MISTAKES = `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M9 9l6 6M15 9l-6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`;

  // Russian has three plural forms depending on the last digit/last two
  // digits of the count (1 ошибка, 2-4 ошибки, 5+/11-14 ошибок) -- this
  // covers that instead of hardcoding a single plural form.
  function pluralRu(n, one, few, many) {
    const mod10 = n % 10, mod100 = n % 100;
    if (mod10 === 1 && mod100 !== 11) return one;
    if (mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14)) return few;
    return many;
  }

  // Mobile Safari keeps a tapped <button> focused, which leaves the
  // browser's focus outline stuck on the last-tapped tile/option even
  // though the user just touched it, not navigated with a keyboard.
  // event.detail is 0 for a keyboard-triggered click and >=1 for a real
  // pointer/touch click, so this only blurs (clears the ring) on taps.
  document.addEventListener("click", e => {
    const btn = e.target.closest("button");
    if (btn && e.detail !== 0) btn.blur();
  });

  const screenEl = document.getElementById("screen");
  const streakEl = document.getElementById("streakCount");
  const xpEl = document.getElementById("xpCount");
  const wordsEl = document.getElementById("wordsCount");
  const wordsStatEl = document.getElementById("wordsStat");
  const mistakesEl = document.getElementById("mistakesCount");
  const mistakesStatEl = document.getElementById("mistakesStat");
  const practiceEl = document.getElementById("practiceCount");
  const practiceStatEl = document.getElementById("practiceStat");
  const themeToggleEl = document.getElementById("themeToggle");
  const soundToggleEl = document.getElementById("soundToggle");
  const placementToggleEl = document.getElementById("placementToggle");
  const vocabToggleEl = document.getElementById("vocabToggleBtn");
  const mobileMenuEl = document.getElementById("mobileMenu");
  const menuToggleBtnEl = document.getElementById("menuToggleBtn");
  const mobileMenuPanelEl = document.getElementById("mobileMenuPanel");
  const hoardModal = document.getElementById("hoardModal");
  const dialogueModal = document.getElementById("dialogueModal");

  let course = null;
  // text -> {file, voice}, loaded from data/audio/manifest.json alongside
  // course.json. Real pre-generated Kokoro voice lines (via the user's
  // local Voicebox app), keyed by the literal English sentence -- far more
  // natural than browser speechSynthesis, which stays as the fallback for
  // anything not in the manifest (or when a slower replay rate is asked
  // for, since only one normal-speed recording exists per sentence).
  let audioManifest = {};
  let flatLessons = [];
  let progress = null;
  let session = null;
  let currentLevelId = null;
  // Which screen an exercise session should return to on exit/finish --
  // "home" (grammar roadmap, the default) or "vocabulary" (the vocab hub),
  // set right before starting a vocab-set session. A one-shot flag: reset
  // to "home" as soon as it's read.
  let returnScreen = "home";
  let advanceTimer = null;
  let soundMuted = false;
  let placementQuestions = [];
  let placementState = null; // { idx, answers: [] }

  // ---------- theme ----------
  function initTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "light" || stored === "dark") {
      document.documentElement.setAttribute("data-theme", stored);
    }
  }
  function currentEffectiveTheme() {
    const attr = document.documentElement.getAttribute("data-theme");
    if (attr === "light" || attr === "dark") return attr;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  function toggleTheme() {
    const next = currentEffectiveTheme() === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem(THEME_KEY, next);
  }

  // ---------- sound ----------
  function initSound() {
    soundMuted = localStorage.getItem(SOUND_KEY) === "muted";
    updateSoundToggleUI();
  }
  function updateSoundToggleUI() {
    soundToggleEl.classList.toggle("muted", soundMuted);
  }
  function toggleSound() {
    soundMuted = !soundMuted;
    localStorage.setItem(SOUND_KEY, soundMuted ? "muted" : "on");
    updateSoundToggleUI();
  }
  let _lastBeepError = null;
  function beep(freq, dur) {
    if (soundMuted) return;
    try {
      const ctx = beep._ctx || (beep._ctx = new (window.AudioContext || window.webkitAudioContext)());
      const playTone = () => {
        try {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.frequency.value = freq;
          osc.type = "sine";
          gain.gain.setValueAtTime(0.08, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
          osc.connect(gain).connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + dur);
          _lastBeepError = null;
        } catch (e) { _lastBeepError = e.message || String(e); }
      };
      // resume() is async; scheduling the oscillator via ctx.currentTime
      // before it actually resolves means the tone gets scheduled into a
      // context that isn't running yet and never actually plays. iOS
      // suspends the context again after any idle gap, so this bites
      // every beep, not just the first one — must wait for the real resume.
      if (ctx.state === "suspended") ctx.resume().then(playTone).catch(e => { _lastBeepError = "resume failed: " + (e.message || e); });
      else playTone();
    } catch (e) { _lastBeepError = e.message || String(e); }
  }
  function playCorrectSound() { beep(880, 0.15); }
  function playIncorrectSound() { beep(220, 0.25); }
  // Mobile browsers suspend AudioContext until a genuine user gesture
  // unlocks it; warm it up on the very first tap anywhere on the page so
  // the first real beep (an answer tap) isn't the one that gets dropped.
  function warmAudio() {
    try {
      const ctx = beep._ctx || (beep._ctx = new (window.AudioContext || window.webkitAudioContext)());
      if (ctx.state === "suspended") ctx.resume();
    } catch (e) { /* audio unavailable */ }
  }
  document.addEventListener("pointerdown", warmAudio, { once: true, passive: true });

  // iOS Safari leaves the speech engine "asleep" until it's spoken from
  // inside a real user gesture at least once; a silent, near-empty
  // utterance on the very first tap wakes it up so the first real answer
  // isn't the one that gets silently dropped.
  function warmSpeech() {
    if (!("speechSynthesis" in window)) return;
    try {
      const u = new SpeechSynthesisUtterance(" ");
      u.volume = 0;
      window.speechSynthesis.speak(u);
    } catch (e) { /* speech unavailable */ }
  }
  document.addEventListener("pointerdown", warmSpeech, { once: true, passive: true });

  // Browser-native text-to-speech (Web Speech Synthesis API) — free, no API
  // key, no per-sentence audio files, works for the entire sentence bank
  // automatically since it reads text live. Voice list loads async on some
  // browsers, so we cache it once populated and prefer a real English voice.
  // Ranked by how natural/pleasant they sound among voices that ship free
  // with the browser/OS (no paid API, no extra download): Chrome's Google
  // voices and Edge's neural voices lead, macOS's Samantha is a solid classic,
  // then other common system voices. Deliberately female-only — no male
  // voice is ever ranked, so a bad match falls through to the (unranked,
  // gender-agnostic) last-resort pick below rather than us actively
  // choosing a male voice.
  const FEMALE_VOICE_RANK = [
    /Microsoft (Aria|Jenny|Emma|Libby|Sonia)/i,
    /Samantha/i,
    /Ava|Nicky|Zoe|Karen|Moira|Tessa|Kate|Fiona|Susan|Allison/i,
    /Google US English/i,
    /Microsoft Zira/i,
    /Google UK English Female/i,
  ];
  // Best free natural-sounding male voices, same tiering logic as the female
  // list. Only used where a male voice is explicitly requested (the
  // reading-passage playback toggle) — general app TTS still defaults to
  // the female ranking above.
  const MALE_VOICE_RANK = [
    /Microsoft (Guy|Ryan|Christopher|Eric)/i,
    /Alex/i,
    /Daniel/i,
    /Fred|Oliver|Aaron/i,
    /Google UK English Male/i,
    /Microsoft David/i,
  ];
  let _voices = [];
  let _preferredVoice = null;
  let _preferredVoiceMale = null;
  // macOS/iOS ship both a compact default voice and a much better-sounding
  // "(Enhanced)"/"(Premium)" download of the exact same named voice (e.g.
  // "Samantha" vs "Samantha (Enhanced)"); Edge similarly ships its neural
  // voices tagged "(Natural)"/"(Online)". A plain name-only match picks
  // whichever variant the browser's array happens to list first — often
  // the compact/default one — which is how a genuinely natural voice can
  // silently regress to sounding robotic with zero code change on our end,
  // purely from OS/browser voice-list ordering. Always prefer ANY
  // high-quality-tier match, across the whole ranked list, before ever
  // falling back to a bare/default-tier one.
  function pickVoice(pool, rank) {
    const isHighTier = v => /(Enhanced|Premium|Natural|Online)/i.test(v.name);
    for (const pattern of rank) {
      const match = pool.find(v => pattern.test(v.name) && isHighTier(v));
      if (match) return match;
    }
    for (const pattern of rank) {
      const match = pool.find(v => pattern.test(v.name));
      if (match) return match;
    }
    return null;
  }
  function refreshVoices() {
    if (!("speechSynthesis" in window)) return;
    _voices = window.speechSynthesis.getVoices() || [];
    // Only exact "en-US" excludes plenty of legitimate English voices some
    // platforms tag differently (e.g. "en_US" underscore form on some
    // Android WebViews, or "en-GB"/other English locales) — those voices
    // would silently skip ranking entirely and fall straight to the
    // unranked last-resort pick, which is how a good female voice pick
    // could get replaced by a random (sometimes male) one after a browser/
    // OS update changed how it reports the voice's lang tag.
    const en = _voices.filter(v => /^en[-_]/i.test(v.lang) || /^en$/i.test(v.lang));
    _preferredVoice = pickVoice(en, FEMALE_VOICE_RANK) || en[0] || _voices.find(v => /^en/i.test(v.lang)) || null;
    _preferredVoiceMale = pickVoice(en, MALE_VOICE_RANK) || _preferredVoice;
  }
  if ("speechSynthesis" in window) {
    refreshVoices();
    window.speechSynthesis.onvoiceschanged = refreshVoices;
  }
  // Many mobile browsers (Android Chrome especially, but also iOS Safari on
  // a cold load) return an empty voice list on the first synchronous
  // getVoices() call and never reliably fire onvoiceschanged (a long-standing
  // Chromium bug) — unlike most desktop browsers, where onvoiceschanged
  // alone is enough. speak() still works without a matched voice (it falls
  // back to the browser's own en-US default via u.lang), but polling for up
  // to ~9s after load lets the higher-quality ranked voice take over as soon
  // as the real voice list finishes loading, instead of staying stuck on
  // whatever generic default the OS picked on the very first utterance.
  let _voicePollAttempts = 0;
  function pollVoicesUntilFound() {
    if (!("speechSynthesis" in window)) return;
    refreshVoices();
    if (_preferredVoice || _voicePollAttempts >= 30) return;
    _voicePollAttempts++;
    setTimeout(pollVoicesUntilFound, 300);
  }
  const SPEECH_RATE = 0.85;
  const SPEECH_RATE_SLOW = 0.55;
  let _currentUtterance = null;
  let _speakToken = 0;
  let _currentBundledAudio = null;
  // Plays a pre-generated recording instead of speechSynthesis. Stops any
  // other bundled clip first (rapid re-taps/replays), same spirit as the
  // speechSynthesis cancel-before-speak guard below.
  function playBundledAudio(entry, onEnd) {
    if (_currentBundledAudio) { _currentBundledAudio.pause(); _currentBundledAudio = null; }
    const audio = new Audio(`data/audio/${entry.file}`);
    _currentBundledAudio = audio;
    let settled = false;
    const settle = () => { if (settled) return; settled = true; if (onEnd) onEnd(); };
    audio.addEventListener("ended", settle, { once: true });
    audio.addEventListener("error", settle, { once: true });
    audio.play().catch(settle);
  }
  // Speaking immediately with no voice set lets the browser fall back to
  // its own raw system default for the language — often a noticeably worse,
  // more robotic voice than the ranked one refreshVoices() would have
  // picked, just not loaded yet (voice lists load async, up to ~9s on some
  // platforms). Rather than ever using that fallback, wait in short bursts
  // for the ranked voice to show up first — up to ~1.8s, which is enough on
  // every platform tested. If it truly never loads (no voices at all on
  // this device), speak anyway after that so audio-dependent exercises
  // (listening) aren't permanently silent — some voice beats none.
  function speak(text, onEnd, rate, _waitMs) {
    if (soundMuted) { if (onEnd) onEnd(); return; }
    // Only the normal rate has a bundled recording -- slow replay and any
    // sentence missing from the manifest fall through to speechSynthesis.
    const bundled = (!rate || rate === SPEECH_RATE) && audioManifest[text];
    if (bundled) {
      if (window.speechSynthesis && (window.speechSynthesis.speaking || window.speechSynthesis.pending)) {
        window.speechSynthesis.cancel();
      }
      playBundledAudio(bundled, onEnd);
      return;
    }
    if (!("speechSynthesis" in window)) { if (onEnd) onEnd(); return; }
    if (!_preferredVoice && (_waitMs || 0) < 1800) {
      setTimeout(() => speak(text, onEnd, rate, (_waitMs || 0) + 150), 150);
      return;
    }
    const token = ++_speakToken;
    let settled = false;
    try {
      // Calling cancel() immediately before speak() is a well-known iOS
      // Safari trap: the following speak() can get silently dropped. Only
      // cancel when something is actually queued/playing.
      if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
        window.speechSynthesis.cancel();
      }
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "en-US";
      u.rate = rate || SPEECH_RATE;
      if (_preferredVoice) u.voice = _preferredVoice;
      if (onEnd) {
        u.onend = () => { settled = true; onEnd(); };
        u.onerror = () => { settled = true; onEnd(); };
      }
      _currentUtterance = u; // keep a live reference — some browsers silently
      // drop speech if the utterance is garbage-collected before it plays
      window.speechSynthesis.speak(u);
      // Some Android builds silently drop an utterance entirely — no error
      // event, no end event, nothing ever plays. Since advanceAfterSpeech()
      // gates moving to the next exercise on onEnd firing, a silent drop
      // used to hang the lesson forever. This watchdog forces onEnd after a
      // timeout so the app never gets stuck waiting for an event that isn't
      // coming.
      if (onEnd) {
        setTimeout(() => {
          if (settled || token !== _speakToken) return;
          settled = true;
          onEnd();
        }, 4000);
      }
    } catch (e) { if (onEnd) onEnd(); }
  }
  // Advance the instant the spoken answer finishes playing — no estimate,
  // no added pause, synced exactly to the real TTS "end" event. Falls back
  // to the fixed delay only when there's nothing to speak (sound off/
  // unavailable), so the learner still gets a moment to read.
  function advanceAfterSpeech(text, fallbackDelay) {
    if (!text || soundMuted || !("speechSynthesis" in window)) {
      scheduleAdvance(fallbackDelay);
      return;
    }
    speak(text, () => scheduleAdvance(0));
  }

  // ---------- persistence ----------
  function loadProgress() {
    try {
      const raw = localStorage.getItem(PROGRESS_KEY);
      if (raw) return Object.assign({ placementLevelIndex: -1, placementDone: false }, JSON.parse(raw));
    } catch (e) { /* corrupt storage, fall through to defaults */ }
    return {
      xp: 0, streak: 0, lastActiveDate: null,
      completedLessons: [], missedBank: [], wordHoard: [],
      placementLevelIndex: -1, placementDone: false,
    };
  }
  function saveProgress() {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
    if (window.CloudSync && window.CloudSync.user) {
      window.CloudSync.pushProgress(progress);
    }
  }
  // Merge, not overwrite: boot() used to do a blind
  // `progress = Object.assign({}, remote)`, which meant every launch
  // while signed in pulled whatever was in the cloud and silently
  // replaced local progress with it outright -- including progress made
  // THIS session that just hadn't reached the 800ms debounced push yet
  // (finishing a lesson, then reloading or closing the tab quickly), and
  // any real progress made on a device that had gone a while without
  // syncing. Object.assign-based (not a literal object with named
  // fields) so any field neither side of this function explicitly knows
  // about -- migratedSplitIdsV1, or a future field -- survives instead of
  // silently getting dropped.
  function mergeProgress(local, remote) {
    if (!local) return remote;
    if (!remote) return local;
    const union = (a, b) => Array.from(new Set([...(a || []), ...(b || [])]));
    // missedBank holds {ru, en} objects, not plain strings like the other
    // arrays here -- a Set-based union uses reference equality, so it
    // would keep two structurally-identical entries as "different" and
    // never actually dedupe. Union by a composite key instead.
    function unionMissed(a, b) {
      const seen = new Map();
      [...(a || []), ...(b || [])].forEach(m => { if (m) seen.set(`${m.ru} ${m.en}`, m); });
      return Array.from(seen.values()).slice(-MAX_MISSED);
    }
    // lastActiveDate is stored via toDateString() ("Mon Aug 09 2026") --
    // weekday-first, NOT safe to compare as a plain string (weekday names
    // don't sort in date order). Parse both sides for a real comparison.
    const localTime = local.lastActiveDate ? new Date(local.lastActiveDate).getTime() : 0;
    const remoteTime = remote.lastActiveDate ? new Date(remote.lastActiveDate).getTime() : 0;
    return Object.assign({}, remote, local, {
      xp: Math.max(local.xp || 0, remote.xp || 0),
      streak: Math.max(local.streak || 0, remote.streak || 0),
      lastActiveDate: remoteTime > localTime ? remote.lastActiveDate : local.lastActiveDate,
      completedLessons: union(local.completedLessons, remote.completedLessons),
      missedBank: unionMissed(local.missedBank, remote.missedBank),
      wordHoard: union(local.wordHoard, remote.wordHoard),
      // Placement is a one-time, in-order flow -- once done on either
      // side, it should stay done; a higher placementLevelIndex reflects
      // a more advanced placement result.
      placementDone: !!(local.placementDone || remote.placementDone),
      placementLevelIndex: Math.max(
        local.placementLevelIndex === undefined ? -1 : local.placementLevelIndex,
        remote.placementLevelIndex === undefined ? -1 : remote.placementLevelIndex
      ),
    });
  }
  function updateStreakOnCompletion() {
    const today = new Date().toDateString();
    if (progress.lastActiveDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      progress.streak = progress.lastActiveDate === yesterday ? progress.streak + 1 : 1;
      progress.lastActiveDate = today;
    }
    saveProgress();
  }
  function revisionPool() {
    const completedLessons = flatLessons.filter(l => progress.completedLessons.includes(l.id));
    const pool = [];
    completedLessons.forEach(lesson => {
      lesson.exercises.forEach((ex, i) => pool.push({ gid: `${lesson.id}:${i}`, lesson }));
    });
    return pool;
  }
  function refreshTopStats() {
    streakEl.textContent = progress.streak;
    xpEl.textContent = progress.xp;
    wordsEl.textContent = progress.wordHoard.length;
    mistakesEl.textContent = progress.missedBank.length;
    mistakesStatEl.classList.toggle("hidden", progress.missedBank.length === 0);
    const poolSize = revisionPool().length;
    practiceEl.textContent = poolSize;
    practiceStatEl.classList.toggle("hidden", poolSize === 0);
  }

  // ---------- helpers ----------
  function shuffled(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function enTokens(s) {
    return s.trim().replace(/[.,!?;:"'—–]/g, "").split(/\s+/).filter(Boolean);
  }
  function normalizeAnswer(s) {
    return s.toLowerCase().trim().replace(/[.,!?;:"'—–]/g, "").replace(/\s+/g, " ");
  }
  function levenshtein(a, b) {
    const m = a.length, n = b.length;
    if (m === 0) return n;
    if (n === 0) return m;
    const dp = new Array(n + 1);
    for (let j = 0; j <= n; j++) dp[j] = j;
    for (let i = 1; i <= m; i++) {
      let prev = dp[0];
      dp[0] = i;
      for (let j = 1; j <= n; j++) {
        const tmp = dp[j];
        dp[j] = a[i - 1] === b[j - 1] ? prev : 1 + Math.min(prev, dp[j], dp[j - 1]);
        prev = tmp;
      }
    }
    return dp[n];
  }

  function isLessonUnlocked(flatIndex) {
    if (window.CloudSync && window.CloudSync.isOwner) return true;
    const lesson = flatLessons[flatIndex];
    const levelIdx = course.levels.findIndex(lv => lv.id === lesson.levelId);
    const levelStartFlatIndex = flatLessons.findIndex(l => l.levelId === lesson.levelId);
    if (flatIndex === levelStartFlatIndex) {
      if (levelIdx === 0) return true;
      if (levelIdx <= progress.placementLevelIndex) return true;
      const prevLevel = course.levels[levelIdx - 1];
      const prevLevelLessons = flatLessons.filter(l => l.levelId === (prevLevel && prevLevel.id));
      return prevLevelLessons.length > 0 && prevLevelLessons.every(l => progress.completedLessons.includes(l.id));
    }
    return progress.completedLessons.includes(flatLessons[flatIndex - 1].id);
  }

  function harvestWords(ex) {
    const words = enTokens(ex.en);
    let added = 0;
    words.forEach(w => {
      const key = w.toLowerCase();
      if (!progress.wordHoard.includes(key)) { progress.wordHoard.push(key); added++; }
    });
    if (added) refreshTopStats();
  }

  function afterAnswer(correct, ex) {
    if (correct) {
      progress.xp += 10;
      playCorrectSound();
      harvestWords(ex);
      progress.missedBank = progress.missedBank.filter(m => !(m.ru === ex.ru && m.en === ex.en));
    } else {
      playIncorrectSound();
      if (session) session.mistakes++;
      if (!progress.missedBank.some(m => m.ru === ex.ru && m.en === ex.en)) {
        const topicId = ex.topicId || (ex._sourceLesson && ex._sourceLesson.topicId);
        progress.missedBank.unshift({ ru: ex.ru, en: ex.en, topicId });
        progress.missedBank = progress.missedBank.slice(0, MAX_MISSED);
      }
    }
    saveProgress();
    refreshTopStats();
  }

  // Resolves the grammar topic behind whatever exercise is currently on
  // screen -- works both for live lessons (topicId lives on _sourceLesson)
  // and mistake-review replays (topicId is snapshotted directly onto the
  // missedBank entry in afterAnswer, since review items have no
  // _sourceLesson of their own).
  function currentTopic() {
    if (!session) return null;
    const item = session.queue[session.index];
    const ex = item && item.ex;
    if (!ex) return null;
    const topicId = ex.topicId || (ex._sourceLesson && ex._sourceLesson.topicId);
    return (topicId && course.grammarTopics && course.grammarTopics[topicId]) || null;
  }

  // showSpeak defaults true (most exercises show English answer text worth
  // replaying) — comprehension and matching pass false, since their
  // feedback text is Russian (or a plain UI string) and was showing a
  // speaker icon that wireFeedbackReplay() was never actually wired up for.
  function renderFeedback(correct, answerText, showSpeak = true) {
    const topic = !correct ? currentTopic() : null;
    return `
      <div class="feedback ${correct ? "correct" : "incorrect"}">
        <div class="feedback-row">
          <div class="feedback-main">
            <span class="feedback-icon">${correct ? ICON_CHECK_BIG : ICON_X_BIG}</span>
            ${showSpeak ? `<button class="speak-btn" id="feedbackSpeakBtn" title="Прослушать произношение" aria-label="Прослушать произношение">${ICON_SPEAKER}</button>` : ""}
            <div>
              <div class="feedback-text">${correct ? "Верно!" : "Не совсем"}</div>
              <div class="feedback-answer">${answerText}</div>
              ${topic ? `<button class="feedback-why-btn" id="feedbackWhyBtn" type="button">Почему? ${ICON_CHEVRON_DOWN}</button>` : ""}
            </div>
          </div>
          <div class="feedback-next-hint">${session && session.queue.length > 1 ? "→ Enter" : "Готово"}</div>
        </div>
        ${topic ? `<div class="feedback-explain hidden" id="feedbackExplain"><p>${topic.explanation}</p></div>` : ""}
      </div>
    `;
  }
  function wireFeedbackReplay(text) {
    const btn = document.getElementById("feedbackSpeakBtn");
    if (btn) btn.addEventListener("click", () => speak(text));
  }
  // Delegated (not wired per-renderFeedback call) since two call sites
  // (comprehension, matching) skip wireFeedbackReplay entirely when
  // showSpeak is false -- this way the "Почему?" toggle works everywhere
  // renderFeedback's explanation block can appear, with a single listener.
  document.addEventListener("click", e => {
    const whyBtn = e.target.closest && e.target.closest("#feedbackWhyBtn");
    if (!whyBtn) return;
    cancelAdvance();
    const explain = document.getElementById("feedbackExplain");
    if (explain) explain.classList.remove("hidden");
    whyBtn.remove();
  });

  function cancelAdvance() {
    if (advanceTimer) { clearTimeout(advanceTimer); advanceTimer = null; }
  }
  function scheduleAdvance(delay) {
    cancelAdvance();
    advanceTimer = setTimeout(() => { advanceTimer = null; nextExercise(); }, delay);
  }

  // ---------- session ----------
  function startLesson(lesson) {
    session = { mode: "lesson", lesson, queue: lesson.exercises.map((ex, i) => ({ ex, gid: `${lesson.id}:${i}` })), index: 0, total: lesson.exercises.length, mistakes: 0 };
    renderExercise();
  }
  function startRevision() {
    const pool = shuffled(revisionPool()).slice(0, REVISION_SIZE);
    if (!pool.length) return;
    const queue = pool.map(p => ({ ex: exerciseByGid(p.gid), gid: p.gid }));
    session = { mode: "practice", queue, index: 0, total: queue.length, mistakes: 0 };
    renderExercise();
  }
  function startReview() {
    if (!progress.missedBank.length) return;
    const items = shuffled(progress.missedBank.slice());
    const queue = items.map((m, i) => ({ ex: m, gid: `review:${i}` }));
    session = { mode: "mistakes", queue, index: 0, total: queue.length, mistakes: 0 };
    renderExercise();
  }
  function exerciseByGid(gid) {
    const [lessonId, i] = gid.split(":");
    const lesson = flatLessons.find(l => l.id === lessonId);
    return lesson ? lesson.exercises[Number(i)] : null;
  }

  function nextExercise() {
    session.index++;
    if (session.index >= session.queue.length) { finishSession(); return; }
    renderExercise();
  }

  function renderLessonChrome(bodyHtml) {
    if (_passagePlaying) {
      _passageToken++;
      window.speechSynthesis.cancel();
      _passagePlaying = false;
    }
    const pct = Math.round((session.index / session.total) * 100);
    screenEl.innerHTML = `
      <div class="lesson-bar">
        <button class="exit-btn" id="exitBtn" aria-label="Выйти из урока"><svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></button>
        <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
        ${session.mode !== "lesson" ? '<span class="infinity-badge">&infin;</span>' : ""}
      </div>
      ${bodyHtml}
    `;
    document.getElementById("exitBtn").addEventListener("click", () => {
      cancelAdvance();
      if (_passagePlaying) { _passageToken++; window.speechSynthesis.cancel(); _passagePlaying = false; }
      session = null;
      goToReturnScreen();
    });
  }

  // Reads returnScreen (set by startVocabSet before a vocab session
  // starts) and navigates there, then resets it back to "home" -- a
  // one-shot flag so a later ordinary lesson never inherits it by mistake.
  function goToReturnScreen() {
    const dest = returnScreen;
    returnScreen = "home";
    if (dest === "vocabulary") renderVocabularyHub();
    else renderHome();
  }

  function renderExercise() {
    cancelAdvance();
    const item = session.queue[session.index];
    const ex = item.ex;
    if (!ex) { nextExercise(); return; }
    ex._sourceLesson = session.mode === "lesson" ? session.lesson : (flatLessons.find(l => l.id === (item.gid.split(":")[0])) || { exercises: [] });
    if (ex.type === "comprehension") renderComprehension(ex);
    else if (ex.type === "multiple-choice") renderMultipleChoice(ex);
    else if (ex.type === "word-bank") renderWordBank(ex);
    else if (ex.type === "listening") renderListening(ex);
    else if (ex.type === "listening-choice") renderListeningChoice(ex);
    else if (ex.type === "listening-tap") renderListeningTap(ex);
    else if (ex.type === "fill-blank") renderFillBlank(ex);
    else if (ex.type === "matching") renderMatching(ex);
    else renderTypeAnswer(ex);
  }

  // ---------- reading comprehension ----------
  let _passagePlaying = false;
  let _passageToken = 0;
  function passageVoiceGender() {
    return localStorage.getItem(PASSAGE_VOICE_KEY) === "male" ? "male" : "female";
  }
  function renderPassagePanel(lesson) {
    const rows = lesson.readingPassage.paragraphs.map((p, i) => `
      <div class="passage-line" data-line="${i}">
        <p class="passage-en">${p.en}</p>
        <p class="passage-ru hidden">${p.ru}</p>
      </div>
    `).join("");
    const context = lesson.readingPassage.context
      ? `<p class="context-note">${lesson.readingPassage.context}</p>` : "";
    const isMale = passageVoiceGender() === "male";
    return `
      <details class="passage-panel" open>
        <summary>${lesson.title} <span class="ru-summary">${lesson.titleNative || ""}</span></summary>
        ${context}
        <div class="passage-controls">
          <button class="translit-toggle" id="passageToggle">Показать перевод</button>
          <button class="passage-listen-btn" id="passageVoiceToggle" title="Сменить голос" aria-label="Сменить голос диктора">${isMale ? `${ICON_MAN} Мужской` : `${ICON_WOMAN} Женский`}</button>
          <button class="passage-listen-btn" id="passageListenBtn" title="Слушать текст" aria-label="Слушать текст">${ICON_SPEAKER} Слушать</button>
        </div>
        ${rows}
      </details>
    `;
  }

  function wirePassageToggle() {
    const btn = document.getElementById("passageToggle");
    if (!btn) return;
    btn.addEventListener("click", () => {
      const lines = document.querySelectorAll(".passage-ru");
      const hide = !lines[0].classList.contains("hidden");
      lines.forEach(l => l.classList.toggle("hidden", hide));
      btn.textContent = hide ? "Показать перевод" : "Скрыть перевод";
    });
  }

  // iOS/Safari's SpeechSynthesis can fire onend/onerror twice — or early —
  // for the same utterance, and calling speak() again while the previous
  // one is still technically "speaking" can silently cut it off. A plain
  // recursive onend->speak() chain is therefore not reliable for reading
  // several paragraphs in strict order: duplicate/early events double-
  // advance the index and paragraphs end up skipped or overlapping.
  // Fix: a session token invalidates any callback from a stopped/replaced
  // chain, a per-step "already advanced" guard absorbs duplicate end
  // events, and a small gap between utterances avoids WebKit's glitch
  // when speak() is called immediately from inside another onend.
  function stopPassagePlayback(btn, lineEls) {
    _passageToken++;
    window.speechSynthesis.cancel();
    if (_currentBundledAudio) { _currentBundledAudio.pause(); _currentBundledAudio = null; }
    _passagePlaying = false;
    if (btn) btn.innerHTML = `${ICON_SPEAKER} Слушать`;
    lineEls.forEach(l => l.classList.remove("speaking"));
  }

  function wirePassageVoiceToggle(lesson) {
    const btn = document.getElementById("passageVoiceToggle");
    if (!btn) return;
    btn.addEventListener("click", () => {
      if (_passagePlaying) stopPassagePlayback(document.getElementById("passageListenBtn"), Array.from(document.querySelectorAll(".passage-line")));
      const next = passageVoiceGender() === "male" ? "female" : "male";
      localStorage.setItem(PASSAGE_VOICE_KEY, next);
      btn.innerHTML = next === "male" ? `${ICON_MAN} Мужской` : `${ICON_WOMAN} Женский`;
    });
  }

  function wirePassageListen(lesson) {
    const btn = document.getElementById("passageListenBtn");
    if (!btn) return;
    const paragraphs = lesson.readingPassage.paragraphs;
    const lineEls = Array.from(document.querySelectorAll(".passage-line"));
    btn.addEventListener("click", () => {
      if (_passagePlaying) { stopPassagePlayback(btn, lineEls); return; }
      if (soundMuted) return;
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
      _passagePlaying = true;
      btn.innerHTML = `${ICON_STOP} Стоп`;
      const token = ++_passageToken;
      let i = 0;
      function step(waitMs) {
        if (token !== _passageToken || i >= paragraphs.length) {
          if (token === _passageToken) { _passagePlaying = false; btn.innerHTML = `${ICON_SPEAKER} Слушать`; }
          lineEls.forEach(l => l.classList.remove("speaking"));
          return;
        }
        // A bundled recording has one fixed voice already baked in (picked
        // for the sentence's content, e.g. matching a named character's
        // gender) -- the male/female toggle only affects paragraphs that
        // fall back to speechSynthesis, and bundled playback never needs
        // to wait for a browser voice to finish loading.
        const bundled = audioManifest[paragraphs[i].en];
        if (bundled) {
          lineEls.forEach(l => l.classList.remove("speaking"));
          if (lineEls[i]) lineEls[i].classList.add("speaking");
          playBundledAudio(bundled, () => {
            if (token !== _passageToken) return;
            i++;
            setTimeout(step, 150);
          });
          return;
        }
        // Same reasoning as speak(): don't fall back to an unset voice while
        // the ranked one is still loading — wait briefly first.
        const voice = passageVoiceGender() === "male" ? _preferredVoiceMale : _preferredVoice;
        if (!voice && (waitMs || 0) < 1800) {
          setTimeout(() => step((waitMs || 0) + 150), 150);
          return;
        }
        lineEls.forEach(l => l.classList.remove("speaking"));
        if (lineEls[i]) lineEls[i].classList.add("speaking");
        const u = new SpeechSynthesisUtterance(paragraphs[i].en);
        u.lang = "en-US";
        u.rate = SPEECH_RATE;
        if (voice) u.voice = voice;
        let advanced = false;
        u.onend = u.onerror = () => {
          if (advanced || token !== _passageToken) return;
          advanced = true;
          i++;
          setTimeout(step, 150);
        };
        window.speechSynthesis.speak(u);
      }
      step();
    });
  }

  const OPTION_LETTERS = ["A", "B", "C", "D", "E", "F"];
  function optionBtn(opt, attr, i) {
    return `<button class="option" ${attr}><span class="option-letter">${OPTION_LETTERS[i] || i + 1}</span><span class="option-text">${opt}</span></button>`;
  }
  function renderComprehension(ex) {
    const lesson = ex._sourceLesson;
    const options = ex.options.map((opt, i) =>
      optionBtn(opt, `data-i="${i}"`, i)
    ).join("");

    renderLessonChrome(`
      ${renderPassagePanel(lesson)}
      <div class="card">
        <div class="prompt-kicker"><span>Проверь понимание текста</span></div>
        <div class="prompt-native">${ex.question}</div>
        <div class="options" id="options">${options}</div>
      </div>
    `);
    wirePassageToggle();
    wirePassageVoiceToggle(lesson);
    wirePassageListen(lesson);

    let answered = false;
    document.querySelectorAll("#options .option").forEach(btn => {
      btn.addEventListener("click", () => {
        if (answered) return;
        answered = true;
        const i = Number(btn.dataset.i);
        const correct = i === ex.answerIndex;
        document.querySelectorAll("#options .option").forEach(b => b.disabled = true);
        btn.classList.add(correct ? "correct" : "incorrect");
        if (!correct) document.querySelector(`#options .option[data-i="${ex.answerIndex}"]`).classList.add("correct");
        // Mistake review only stores a plain {ru, en} snapshot, not the
        // exercise type, and the question/options here are both Russian
        // (testing comprehension without requiring English output) — so
        // reuse a real paragraph pair instead, which actually has an
        // English side, rather than mislabeling Russian text as "en".
        afterAnswer(correct, lesson.readingPassage.paragraphs[0]);
        screenEl.insertAdjacentHTML("beforeend", renderFeedback(correct, ex.options[ex.answerIndex], false));
        scheduleAdvance(correct ? ADVANCE_DELAY_CORRECT : ADVANCE_DELAY_WRONG);
      });
    });
  }

  // ---------- grammar notes ----------
  function currentExercise() {
    return session.queue[session.index].ex;
  }
  function grammarPanel() {
    const lesson = currentExercise()._sourceLesson || session.lesson;
    const topic = lesson.topicId && course.grammarTopics && course.grammarTopics[lesson.topicId];
    if (!topic) return "";
    return `
      <details class="grammar-panel">
        <summary>Грамматика</summary>
        <h4>${topic.title}</h4>
        <p class="grammar-pattern">${topic.pattern}</p>
        <p class="grammar-explanation">${topic.explanation}</p>
        <div class="fact-box">
          <span class="fact-label">Знаете ли вы?</span>
          <p>${topic.fact}</p>
        </div>
        <button class="btn-ghost btn-small" id="dialogueBtn" type="button">Пример диалога</button>
      </details>
    `;
  }

  function wireGrammarPanel() {
    const btn = document.getElementById("dialogueBtn");
    if (!btn) return;
    const lesson = currentExercise()._sourceLesson || session.lesson;
    const topic = course.grammarTopics[lesson.topicId];
    btn.addEventListener("click", () => showDialogue(topic));
  }

  function showDialogue(topic) {
    document.getElementById("dialogueTitle").textContent = topic.title;
    document.getElementById("dialogueList").innerHTML = topic.dialogue.map(turn => `
      <div class="dialogue-turn">
        <span class="dialogue-speaker">${turn.sp}</span>
        <p class="dialogue-en">${turn.en}</p>
        <p class="dialogue-ru">${turn.ru}</p>
      </div>
    `).join("");
    dialogueModal.classList.remove("hidden");
  }

  function renderMultipleChoice(ex) {
    const siblingTexts = (ex._sourceLesson.exercises || [])
      .filter(e => !(e.ru === ex.ru && e.en === ex.en))
      .map(e => e.en)
      .filter(Boolean);
    const pool = Array.from(new Set(siblingTexts.filter(t => t !== ex.en)));
    const distractors = shuffled(pool).slice(0, 3);
    const options = shuffled([ex.en, ...distractors]);
    const answerIndex = options.indexOf(ex.en);

    renderLessonChrome(`
      ${grammarPanel()}
      <div class="card">
        <div class="prompt-kicker"><span>Выбери перевод</span></div>
        <div class="prompt-native">${ex.ru}</div>
        <div class="options" id="options">
          ${options.map((opt, i) => optionBtn(opt, `data-i="${i}"`, i)).join("")}
        </div>
      </div>
    `);
    wireGrammarPanel();

    let answered = false;
    document.querySelectorAll("#options .option").forEach(btn => {
      btn.addEventListener("click", () => {
        if (answered) return;
        answered = true;
        const i = Number(btn.dataset.i);
        const correct = i === answerIndex;
        document.querySelectorAll("#options .option").forEach(b => b.disabled = true);
        btn.classList.add(correct ? "correct" : "incorrect");
        if (!correct) document.querySelector(`#options .option[data-i="${answerIndex}"]`).classList.add("correct");
        afterAnswer(correct, ex);
        screenEl.insertAdjacentHTML("beforeend", renderFeedback(correct, ex.en));
        wireFeedbackReplay(ex.en);
        advanceAfterSpeech(ex.en, correct ? ADVANCE_DELAY_CORRECT : ADVANCE_DELAY_WRONG);
      });
    });
  }

  function renderWordBank(ex) {
    const tgtTokens = enTokens(ex.en);
    const bank = shuffled(tgtTokens);
    let placed = [];

    renderLessonChrome(`
      ${grammarPanel()}
      <div class="card">
        <div class="prompt-kicker"><span>Собери перевод</span></div>
        <div class="prompt-native">${ex.ru}</div>
        <div class="bank-target" id="bankTarget"></div>
        <div class="bank-pool" id="bankPool"></div>
      </div>
    `);
    wireGrammarPanel();

    const targetEl = document.getElementById("bankTarget");
    const poolEl = document.getElementById("bankPool");
    let submitted = false;

    function submit() {
      if (submitted) return;
      submitted = true;
      poolEl.querySelectorAll(".bank-tile").forEach(b => b.disabled = true);
      targetEl.querySelectorAll(".bank-tile").forEach(b => b.disabled = true);
      const correct = placed.length === tgtTokens.length && placed.every((w, i) => w === tgtTokens[i]);
      afterAnswer(correct, ex);
      screenEl.insertAdjacentHTML("beforeend", renderFeedback(correct, tgtTokens.join(" ")));
      wireFeedbackReplay(ex.en);
      advanceAfterSpeech(ex.en, correct ? ADVANCE_DELAY_CORRECT : ADVANCE_DELAY_WRONG);
    }

    function renderTiles() {
      targetEl.innerHTML = placed.map((w, i) => `<button class="bank-tile" data-target-i="${i}">${w}</button>`).join("");
      const usedIdx = new Set();
      placed.forEach(w => {
        const idx = bank.findIndex((b, i) => b === w && !usedIdx.has(i));
        if (idx !== -1) usedIdx.add(idx);
      });
      poolEl.innerHTML = bank.map((w, i) =>
        `<button class="bank-tile ${usedIdx.has(i) ? "placed" : ""}" data-pool-i="${i}" ${usedIdx.has(i) ? "disabled" : ""}>${w}</button>`
      ).join("");

      poolEl.querySelectorAll(".bank-tile:not(.placed)").forEach(btn => {
        btn.addEventListener("click", () => {
          placed.push(btn.textContent);
          renderTiles();
          if (placed.length === tgtTokens.length) setTimeout(submit, 150);
        });
      });
      targetEl.querySelectorAll(".bank-tile").forEach(btn => {
        btn.addEventListener("click", () => {
          if (submitted) return;
          const i = Number(btn.dataset.targetI);
          placed.splice(i, 1);
          renderTiles();
        });
      });
    }
    renderTiles();
  }

  function renderTypeAnswer(ex) {
    const targetWords = ex.en.split(/\s+/).filter(Boolean);
    let hintsRevealed = 0;
    renderLessonChrome(`
      <div class="card">
        <div class="prompt-kicker"><span>Напиши перевод</span></div>
        <div class="prompt-native">${ex.ru}</div>
        <form class="type-answer-form" id="typeForm">
          <input class="type-answer-input" id="typeInput" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Введите перевод на английском..." />
          <button class="type-submit-btn" id="typeSubmitBtn" type="submit" disabled>Проверить</button>
          <div class="hint-row">
            <button type="button" class="hint-btn" id="hintBtn">${ICON_HINT} Подсказка</button>
            <div class="hint-text" id="hintText"></div>
          </div>
          <div class="type-answer-hint">Небольшие опечатки — это нормально, система их учитывает.</div>
        </form>
      </div>
    `);
    const input = document.getElementById("typeInput");
    const submitBtn = document.getElementById("typeSubmitBtn");
    const hintBtn = document.getElementById("hintBtn");
    const hintText = document.getElementById("hintText");
    input.addEventListener("input", () => { submitBtn.disabled = !input.value.trim(); });
    setTimeout(() => input.focus(), 50);

    // Progressive hint: each tap reveals one more word of the target answer,
    // masking the rest with dots matching word length — free to use, no
    // score/XP penalty, just a comfort aid for when you're stuck.
    hintBtn.addEventListener("click", () => {
      if (hintsRevealed < targetWords.length) hintsRevealed++;
      hintText.textContent = targetWords
        .map((w, i) => (i < hintsRevealed ? w : "•".repeat(Math.max(1, w.replace(/[.,!?;:"']/g, "").length))))
        .join(" ");
      if (hintsRevealed >= targetWords.length) hintBtn.disabled = true;
    });

    document.getElementById("typeForm").addEventListener("submit", e => {
      e.preventDefault();
      if (!input.value.trim()) return;
      const userNorm = normalizeAnswer(input.value);
      const targetNorm = normalizeAnswer(ex.en);
      const dist = levenshtein(userNorm, targetNorm);
      const tolerance = Math.max(1, Math.floor(targetNorm.length * 0.08));
      const correct = dist <= tolerance;
      input.disabled = true;
      submitBtn.disabled = true;
      input.classList.add(correct ? "correct" : "incorrect");
      afterAnswer(correct, ex);
      screenEl.insertAdjacentHTML("beforeend", renderFeedback(correct, ex.en));
      wireFeedbackReplay(ex.en);
      advanceAfterSpeech(ex.en, correct ? ADVANCE_DELAY_CORRECT : ADVANCE_DELAY_WRONG);
    });
  }

  // ---------- listening ----------
  // A shared audio "stage" used by all three listening variants: a big
  // circular play button with pulsing rings that animate while the TTS
  // is actually speaking (not just while "clicked"), plus a slow-motion
  // (turtle) replay at a reduced rate — the two things every serious
  // listening exercise in a language app needs and Flow didn't have.
  function audioStageHtml(big) {
    return `
      <div class="audio-stage${big ? " audio-stage-lg" : ""}">
        <button class="listen-play-btn" id="listenPlayBtn" type="button" aria-label="Слушать">
          <span class="audio-rings"><span></span><span></span><span></span></span>
          <span class="audio-icon">${ICON_SPEAKER}</span>
        </button>
        <button class="listen-slow-btn" id="listenSlowBtn" type="button" title="Медленно" aria-label="Слушать медленно">${ICON_SLOW}</button>
      </div>
    `;
  }
  function wireAudioStage(text) {
    const stage = document.querySelector(".audio-stage");
    const playBtn = document.getElementById("listenPlayBtn");
    const slowBtn = document.getElementById("listenSlowBtn");
    function play(rate) {
      stage.classList.add("playing");
      speak(text, () => stage.classList.remove("playing"), rate);
    }
    playBtn.addEventListener("click", () => play());
    slowBtn.addEventListener("click", () => play(SPEECH_RATE_SLOW));
    return play;
  }

  // ---- listening: dictation (hear it, type it) ----
  function renderListening(ex) {
    renderLessonChrome(`
      <div class="card">
        <div class="prompt-kicker"><span>Прослушай и напиши</span></div>
        ${audioStageHtml(false)}
        <form class="type-answer-form" id="typeForm">
          <input class="type-answer-input" id="typeInput" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Напиши то, что услышал..." />
          <button class="type-submit-btn" id="typeSubmitBtn" type="submit" disabled>Проверить</button>
          <button type="button" class="translit-toggle" id="listenTranslitToggle">Показать перевод</button>
          <p class="translit hidden" id="listenTranslitText">${ex.ru}</p>
        </form>
      </div>
    `);
    const play = wireAudioStage(ex.en);
    const input = document.getElementById("typeInput");
    const submitBtn = document.getElementById("typeSubmitBtn");
    const translitToggle = document.getElementById("listenTranslitToggle");
    input.addEventListener("input", () => { submitBtn.disabled = !input.value.trim(); });
    translitToggle.addEventListener("click", () => {
      const t = document.getElementById("listenTranslitText");
      t.classList.toggle("hidden");
      translitToggle.textContent = t.classList.contains("hidden") ? "Показать перевод" : "Скрыть перевод";
    });
    setTimeout(play, 300);

    document.getElementById("typeForm").addEventListener("submit", e => {
      e.preventDefault();
      if (!input.value.trim()) return;
      const dist = levenshtein(normalizeAnswer(input.value), normalizeAnswer(ex.en));
      const tolerance = Math.max(1, Math.floor(normalizeAnswer(ex.en).length * 0.08));
      const correct = dist <= tolerance;
      input.disabled = true;
      submitBtn.disabled = true;
      input.classList.add(correct ? "correct" : "incorrect");
      afterAnswer(correct, ex);
      screenEl.insertAdjacentHTML("beforeend", renderFeedback(correct, ex.en));
      wireFeedbackReplay(ex.en);
      advanceAfterSpeech(ex.en, correct ? ADVANCE_DELAY_CORRECT : ADVANCE_DELAY_WRONG);
    });
  }

  // ---- listening: pure-audio multiple choice (hear it, pick the meaning —
  // no text shown upfront, unlike regular multiple-choice) ----
  function renderListeningChoice(ex) {
    const siblingTexts = (ex._sourceLesson.exercises || [])
      .filter(e => !(e.ru === ex.ru && e.en === ex.en))
      .map(e => e.en)
      .filter(Boolean);
    const pool = Array.from(new Set(siblingTexts.filter(t => t !== ex.en)));
    const distractors = shuffled(pool).slice(0, 3);
    const options = shuffled([ex.en, ...distractors]);
    const answerIndex = options.indexOf(ex.en);

    renderLessonChrome(`
      <div class="card">
        <div class="prompt-kicker"><span>Послушай и выбери перевод</span></div>
        ${audioStageHtml(true)}
        <div class="options" id="options">
          ${options.map((opt, i) => optionBtn(opt, `data-i="${i}"`, i)).join("")}
        </div>
      </div>
    `);
    const play = wireAudioStage(ex.en);
    setTimeout(play, 300);

    let answered = false;
    document.querySelectorAll("#options .option").forEach(btn => {
      btn.addEventListener("click", () => {
        if (answered) return;
        answered = true;
        const i = Number(btn.dataset.i);
        const correct = i === answerIndex;
        document.querySelectorAll("#options .option").forEach(b => b.disabled = true);
        btn.classList.add(correct ? "correct" : "incorrect");
        if (!correct) document.querySelector(`#options .option[data-i="${answerIndex}"]`).classList.add("correct");
        afterAnswer(correct, ex);
        screenEl.insertAdjacentHTML("beforeend", renderFeedback(correct, ex.en));
        wireFeedbackReplay(ex.en);
        scheduleAdvance(correct ? ADVANCE_DELAY_CORRECT : ADVANCE_DELAY_WRONG);
      });
    });
  }

  // ---- listening: pure-audio word reconstruction (hear it, tap the words
  // in order — no text shown upfront, unlike regular word-bank) ----
  function renderListeningTap(ex) {
    const tgtTokens = enTokens(ex.en);
    const bank = shuffled(tgtTokens);
    let placed = [];

    renderLessonChrome(`
      <div class="card">
        <div class="prompt-kicker"><span>Послушай и собери фразу</span></div>
        ${audioStageHtml(false)}
        <div class="bank-target" id="bankTarget"></div>
        <div class="bank-pool" id="bankPool"></div>
      </div>
    `);
    const play = wireAudioStage(ex.en);
    setTimeout(play, 300);

    const targetEl = document.getElementById("bankTarget");
    const poolEl = document.getElementById("bankPool");
    let submitted = false;

    function submit() {
      if (submitted) return;
      submitted = true;
      poolEl.querySelectorAll(".bank-tile").forEach(b => b.disabled = true);
      targetEl.querySelectorAll(".bank-tile").forEach(b => b.disabled = true);
      const correct = placed.length === tgtTokens.length && placed.every((w, i) => w === tgtTokens[i]);
      afterAnswer(correct, ex);
      screenEl.insertAdjacentHTML("beforeend", renderFeedback(correct, tgtTokens.join(" ")));
      wireFeedbackReplay(ex.en);
      advanceAfterSpeech(ex.en, correct ? ADVANCE_DELAY_CORRECT : ADVANCE_DELAY_WRONG);
    }

    function renderTiles() {
      targetEl.innerHTML = placed.map((w, i) => `<button class="bank-tile" data-target-i="${i}">${w}</button>`).join("");
      const usedIdx = new Set();
      placed.forEach(w => {
        const idx = bank.findIndex((b, i) => b === w && !usedIdx.has(i));
        if (idx !== -1) usedIdx.add(idx);
      });
      poolEl.innerHTML = bank.map((w, i) =>
        `<button class="bank-tile ${usedIdx.has(i) ? "placed" : ""}" data-pool-i="${i}" ${usedIdx.has(i) ? "disabled" : ""}>${w}</button>`
      ).join("");

      poolEl.querySelectorAll(".bank-tile:not(.placed)").forEach(btn => {
        btn.addEventListener("click", () => {
          placed.push(btn.textContent);
          renderTiles();
          if (placed.length === tgtTokens.length) setTimeout(submit, 150);
        });
      });
      targetEl.querySelectorAll(".bank-tile").forEach(btn => {
        btn.addEventListener("click", () => {
          if (submitted) return;
          const i = Number(btn.dataset.targetI);
          placed.splice(i, 1);
          renderTiles();
        });
      });
    }
    renderTiles();
  }

  // ---------- fill in the blank ----------
  function renderFillBlank(ex) {
    const options = shuffled(ex.options);
    renderLessonChrome(`
      <div class="card">
        <div class="prompt-kicker"><span>Заполни пропуск</span></div>
        <div class="prompt-native">${ex.ru}</div>
        <div class="fill-blank-sentence">${ex.blankedEn}</div>
        <div class="options" id="options">
          ${options.map((opt, i) => optionBtn(opt, `data-word="${opt}"`, i)).join("")}
        </div>
      </div>
    `);
    let answered = false;
    document.querySelectorAll("#options .option").forEach(btn => {
      btn.addEventListener("click", () => {
        if (answered) return;
        answered = true;
        const correct = btn.dataset.word === ex.answer;
        document.querySelectorAll("#options .option").forEach(b => b.disabled = true);
        btn.classList.add(correct ? "correct" : "incorrect");
        if (!correct) document.querySelector(`#options .option[data-word="${ex.answer}"]`).classList.add("correct");
        const fullSentence = ex.blankedEn.replace("___", ex.answer);
        afterAnswer(correct, { ru: ex.ru, en: fullSentence });
        screenEl.insertAdjacentHTML("beforeend", renderFeedback(correct, fullSentence));
        wireFeedbackReplay(fullSentence);
        advanceAfterSpeech(fullSentence, correct ? ADVANCE_DELAY_CORRECT : ADVANCE_DELAY_WRONG);
      });
    });
  }

  // ---------- matching pairs ----------
  function renderMatching(ex) {
    const leftOrder = shuffled(ex.pairs.map((p, i) => i));
    const rightOrder = shuffled(ex.pairs.map((p, i) => i));
    renderLessonChrome(`
      <div class="card">
        <div class="prompt-kicker"><span>Найди пары</span></div>
        <div class="matching-grid">
          <div class="matching-col" id="matchLeft">
            ${leftOrder.map(i => `<button class="match-card" data-i="${i}" data-side="ru">${ex.pairs[i].ru}</button>`).join("")}
          </div>
          <div class="matching-col" id="matchRight">
            ${rightOrder.map(i => `<button class="match-card" data-i="${i}" data-side="en">${ex.pairs[i].en}</button>`).join("")}
          </div>
        </div>
      </div>
    `);
    let selectedLeft = null, selectedRight = null, matchedCount = 0, mistakes = 0;
    const total = ex.pairs.length;
    function tryMatch() {
      if (selectedLeft === null || selectedRight === null) return;
      const leftBtn = document.querySelector(`.match-card[data-side="ru"][data-i="${selectedLeft}"]`);
      const rightBtn = document.querySelector(`.match-card[data-side="en"][data-i="${selectedRight}"]`);
      if (selectedLeft === selectedRight) {
        leftBtn.classList.add("matched");
        rightBtn.classList.add("matched");
        leftBtn.disabled = true;
        rightBtn.disabled = true;
        matchedCount++;
        if (matchedCount === total) {
          const correct = mistakes === 0;
          // Mistake review only stores a plain {ru, en} snapshot, not the
          // exercise type — reuse a real pair from this set (rather than a
          // placeholder like "Find the pairs") so a missed match resurfaces
          // in review mode as an actual, meaningful sentence to translate.
          afterAnswer(correct, ex.pairs[0]);
          screenEl.insertAdjacentHTML("beforeend", renderFeedback(correct, "Все пары найдены", false));
          scheduleAdvance(correct ? ADVANCE_DELAY_CORRECT : ADVANCE_DELAY_WRONG);
        }
      } else {
        mistakes++;
        [leftBtn, rightBtn].forEach(b => { b.classList.add("mismatch"); setTimeout(() => b.classList.remove("mismatch"), 350); });
      }
      selectedLeft = null; selectedRight = null;
      document.querySelectorAll(".match-card.selected").forEach(b => b.classList.remove("selected"));
    }
    document.querySelectorAll('.match-card[data-side="ru"]').forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll('.match-card[data-side="ru"]').forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
        selectedLeft = Number(btn.dataset.i);
        tryMatch();
      });
    });
    document.querySelectorAll('.match-card[data-side="en"]').forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll('.match-card[data-side="en"]').forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
        selectedRight = Number(btn.dataset.i);
        tryMatch();
      });
    });
  }

  // ---------- SESSION COMPLETE ----------
  function finishSession() {
    const perfect = session.mistakes === 0;
    if (session.mode === "lesson") {
      if (!progress.completedLessons.includes(session.lesson.id)) {
        progress.completedLessons.push(session.lesson.id);
      }
      updateStreakOnCompletion();
    } else {
      progress.xp += 5;
      saveProgress();
    }
    refreshTopStats();

    const title = session.mode === "lesson" ? "Урок завершён"
      : session.mode === "mistakes" ? "Повторение завершено"
      : "Практика завершена";

    screenEl.innerHTML = `
      <div class="summary">
        <h2>${title}</h2>
        <p>${perfect ? "Без единой ошибки — отлично!" : "Практика — путь к беглости."}</p>
        <div class="summary-stats">
          <div class="stat-block"><span class="num">${session.total}</span><span class="lbl">Предложений</span></div>
          <div class="stat-block"><span class="num">+${session.mode === "lesson" ? session.total * 10 : 5}</span><span class="lbl">Опыта</span></div>
        </div>
        <button class="continue-btn" id="continueHome">Продолжить</button>
      </div>
    `;
    document.getElementById("continueHome").addEventListener("click", () => {
      session = null;
      goToReturnScreen();
    });
  }

  // ---------- boot ----------
  async function loadCourseData() {
    const [res, manifestRes] = await Promise.all([
      fetch("data/course.json"),
      fetch("data/audio/manifest.json").catch(() => null),
    ]);
    if (!res.ok) throw new Error("Failed to load course data");
    const data = await res.json();
    course = data.course;
    if (manifestRes && manifestRes.ok) {
      try { audioManifest = await manifestRes.json(); } catch (e) { audioManifest = {}; }
    }
    _voicePollAttempts = 0;
    pollVoicesUntilFound();

    flatLessons = [];
    course.levels.forEach(level => {
      level.lessons.forEach(lesson => {
        flatLessons.push({ ...lesson, levelId: level.id });
      });
    });
    document.title = `Flow — ${course.title}`;
  }

  async function loadPlacementData() {
    try {
      const res = await fetch("data/placement.json");
      if (!res.ok) return;
      const data = await res.json();
      placementQuestions = data.questions || [];
    } catch (e) { placementQuestions = []; }
  }

  function waveformBars(pct, count = 14) {
    const filled = Math.round((pct / 100) * count);
    let html = "";
    for (let i = 0; i < count; i++) {
      const h = 8 + Math.round(Math.sin((i / count) * Math.PI) * 22);
      html += `<div class="bar${i < filled ? " filled" : ""}" style="height:${h}px"></div>`;
    }
    return html;
  }

  // The level whose roadmap should show by default: the one containing the
  // first unlocked-but-not-yet-completed lesson (i.e. "where the user is"),
  // falling back to the first built level.
  function pickDefaultLevel() {
    for (const level of course.levels) {
      const levelLessons = flatLessons.filter(l => l.levelId === level.id);
      if (!levelLessons.length) continue;
      const hasCurrent = levelLessons.some(l => !progress.completedLessons.includes(l.id) && isLessonUnlocked(flatLessons.indexOf(l)));
      if (hasCurrent) return level.id;
    }
    const firstBuilt = course.levels.find(lv => flatLessons.some(l => l.levelId === lv.id));
    return firstBuilt ? firstBuilt.id : course.levels[0].id;
  }

  function renderHome() {
    if (!currentLevelId || !course.levels.some(l => l.id === currentLevelId)) {
      currentLevelId = pickDefaultLevel();
    }
    renderLevelRoadmap();
  }

  // Each level gets its own roadmap: lessons as round nodes running bottom
  // (lesson 1) to top (last lesson), like climbing toward the level's peak.
  // Completing the level unlocks a "next level" node above the last lesson.
  // Opens on a featured "continue where you left off" card for wherever
  // you actually are, with the rest of the level laid out below as a real
  // index -- no path, no circles, nothing to climb. Replaces the old
  // circle-and-rail trail entirely.
  function renderLevelRoadmap() {
    const totalLessons = flatLessons.length;
    const doneLessons = flatLessons.filter(l => progress.completedLessons.includes(l.id)).length;
    const overallPct = totalLessons ? Math.round((doneLessons / totalLessons) * 100) : 0;

    const level = course.levels.find(l => l.id === currentLevelId);
    const builtLevels = course.levels.filter(lv => flatLessons.some(l => l.levelId === lv.id));
    const builtIdx = builtLevels.findIndex(lv => lv.id === currentLevelId);
    const prevLevel = builtIdx > 0 ? builtLevels[builtIdx - 1] : null;
    const nextLevel = builtIdx >= 0 && builtIdx < builtLevels.length - 1 ? builtLevels[builtIdx + 1] : null;

    const levelLessons = flatLessons.filter(l => l.levelId === level.id);
    const levelDone = levelLessons.filter(l => progress.completedLessons.includes(l.id)).length;
    const levelComplete = levelLessons.length > 0 && levelDone === levelLessons.length;

    let currentLesson = null;
    for (const lesson of levelLessons) {
      const flatIndex = flatLessons.indexOf(lesson);
      const done = progress.completedLessons.includes(lesson.id);
      if (!done && isLessonUnlocked(flatIndex)) { currentLesson = lesson; break; }
    }

    let heroHtml = "";
    if (currentLesson) {
      const isReading = !!currentLesson.readingPassage;
      heroHtml = `
        <div class="chapter-hero">
          <div class="chapter-hero-eyebrow">Продолжить с этого места</div>
          <div class="chapter-hero-main">
            <div class="chapter-hero-num">${isReading ? ICON_BOOK : currentLesson.number}</div>
            <div class="chapter-hero-text">
              <h3>${currentLesson.title}</h3>
              ${currentLesson.titleNative ? `<span class="chapter-hero-native">${currentLesson.titleNative}</span>` : ""}
            </div>
          </div>
          <button class="primary-btn" id="heroStartBtn" data-lesson="${currentLesson.id}">Начать урок</button>
        </div>
      `;
    } else if (levelComplete) {
      heroHtml = `
        <div class="chapter-hero chapter-hero--complete">
          <div class="chapter-hero-eyebrow">Уровень пройден</div>
          <div class="chapter-hero-main">
            <div class="chapter-hero-num">${ICON_FLAG}</div>
            <div class="chapter-hero-text">
              <h3>Все уроки этого уровня завершены.</h3>
              ${nextLevel ? `<span class="chapter-hero-native">Дальше: ${nextLevel.badge} — ${nextLevel.label}</span>` : `<span class="chapter-hero-native">Новые уровни уже готовятся.</span>`}
            </div>
          </div>
          ${nextLevel ? `<button class="primary-btn" id="heroNextLevelBtn">Начать ${nextLevel.badge}</button>` : ""}
        </div>
      `;
    }

    const indexRowsHtml = levelLessons.map(lesson => {
      const flatIndex = flatLessons.indexOf(lesson);
      const unlocked = isLessonUnlocked(flatIndex);
      const done = progress.completedLessons.includes(lesson.id);
      const isCurrent = !!currentLesson && lesson.id === currentLesson.id;
      const isReading = !!lesson.readingPassage;
      const stateClass = done ? "done" : isCurrent ? "current" : unlocked ? "unlocked" : "locked";
      const status = done ? ICON_CHECK : isCurrent ? `<span class="index-dot"></span>` : !unlocked ? ICON_LOCK : isReading ? ICON_BOOK : "";
      return `
        <button class="chapter-index-row ${stateClass}" data-lesson="${lesson.id}" ${unlocked ? "" : "disabled"}>
          <span class="index-num">${lesson.number}</span>
          <span class="index-text"><span class="index-title">${lesson.title}</span><span class="index-native">${lesson.titleNative || ""}</span></span>
          <span class="index-status">${status}</span>
        </button>
      `;
    }).join("");

    const mistakesCount = progress.missedBank.length;
    const mistakesReminderHtml = mistakesCount > 0 ? `
      <button class="mistakes-reminder" id="mistakesReminderBtn">
        <span class="mistakes-reminder-icon">${ICON_MISTAKES}</span>
        <span class="mistakes-reminder-text">
          <strong>${mistakesCount}</strong> ${pluralRu(mistakesCount, "ошибка", "ошибки", "ошибок")} ${pluralRu(mistakesCount, "ждёт", "ждут", "ждут")} повторения
        </span>
        <span class="mistakes-reminder-cta">Повторить</span>
      </button>
    ` : "";

    screenEl.innerHTML = `
      <div class="level-progress-card">
        <div class="waveform">${waveformBars(overallPct)}</div>
        <div class="level-progress-info">
          <div class="pct">${overallPct}%</div>
          <div class="label">Общий прогресс</div>
          <div class="count">${doneLessons} / ${totalLessons} уроков</div>
        </div>
      </div>
      ${mistakesReminderHtml}
      <div class="roadmap-header">
        <button class="roadmap-arrow" id="prevLevelBtn" ${prevLevel ? "" : "disabled"} aria-label="Предыдущий уровень">‹</button>
        <div class="roadmap-level-info">
          <span class="level-badge">${level.badge}</span>
          <h2>${level.label}</h2>
          <span class="level-count">${levelLessons.length ? `${levelDone}/${levelLessons.length}` : "скоро"}</span>
        </div>
        <button class="roadmap-arrow" id="nextLevelNavBtn" ${nextLevel ? "" : "disabled"} aria-label="Следующий уровень">›</button>
      </div>
      ${!levelLessons.length
        ? `<div class="level-locked-note">Уроки уровня ${level.badge} уже готовятся и скоро появятся здесь.</div>`
        : `${heroHtml}
           <div class="chapter-index-wrap">
             <div class="chapter-index-label">Все уроки &middot; ${level.badge}</div>
             <div class="chapter-index">${indexRowsHtml}</div>
           </div>`
      }
    `;

    document.getElementById("prevLevelBtn").addEventListener("click", () => {
      if (!prevLevel) return;
      currentLevelId = prevLevel.id;
      renderLevelRoadmap();
    });
    document.getElementById("nextLevelNavBtn").addEventListener("click", () => {
      if (!nextLevel) return;
      currentLevelId = nextLevel.id;
      renderLevelRoadmap();
    });
    const mistakesReminderBtn = document.getElementById("mistakesReminderBtn");
    if (mistakesReminderBtn) {
      mistakesReminderBtn.addEventListener("click", () => {
        cancelAdvance();
        startReview();
      });
    }
    const heroNextLevelBtn = document.getElementById("heroNextLevelBtn");
    if (heroNextLevelBtn) {
      heroNextLevelBtn.addEventListener("click", () => {
        if (!nextLevel) return;
        currentLevelId = nextLevel.id;
        renderLevelRoadmap();
      });
    }
    const heroStartBtn = document.getElementById("heroStartBtn");
    if (heroStartBtn) {
      heroStartBtn.addEventListener("click", () => {
        const lesson = flatLessons.find(l => l.id === heroStartBtn.dataset.lesson);
        if (lesson) startLesson(lesson);
      });
    }
    screenEl.querySelectorAll(".chapter-index-row:not(:disabled)").forEach(row => {
      row.addEventListener("click", () => {
        const lesson = flatLessons.find(l => l.id === row.dataset.lesson);
        if (lesson) startLesson(lesson);
      });
    });
  }

  // ---------- vocabulary track ----------
  // A separate content track from the grammar-topic lessons above: themed
  // word lists, no sequential unlock, organized by CEFR level for
  // browsing only. Reuses startLesson()/renderExercise() as-is (confirmed
  // they only need {id, exercises} -- no grammar-lesson-specific fields
  // are read anywhere in the exercise-rendering path), so a vocab set
  // just needs its word list turned into that same exercise shape.
  function renderVocabularyHub() {
    const sets = course.vocabularySets || [];
    const byLevel = {};
    sets.forEach(s => { (byLevel[s.level] = byLevel[s.level] || []).push(s); });

    let groupsHtml = "";
    course.levels.forEach(level => {
      const group = byLevel[level.id];
      if (!group || !group.length) return;
      groupsHtml += `
        <div class="vocab-level-group">
          <div class="vocab-level-label"><span class="level-badge">${level.badge}</span><span>${level.label}</span></div>
          <div class="vocab-grid">
            ${group.map(set => {
              const done = progress.completedLessons.includes(set.id);
              return `
                <button class="vocab-card ${done ? "done" : ""}" data-vocab="${set.id}">
                  <span class="vocab-icon">${set.icon || "📘"}</span>
                  <span class="vocab-title">${set.title}</span>
                  <span class="vocab-title-native">${set.titleNative || ""}</span>
                  ${done ? `<span class="vocab-done-check">${ICON_CHECK}</span>` : ""}
                </button>`;
            }).join("")}
          </div>
        </div>`;
    });

    screenEl.innerHTML = `
      <div class="vocab-hub">
        <div class="vocab-hub-header">
          <button class="roadmap-arrow" id="vocabBackBtn" aria-label="Назад">‹</button>
          <h2>Лексика</h2>
        </div>
        <p class="vocab-hub-sub">Тематические наборы слов по уровням — отдельно от грамматических уроков.</p>
        ${groupsHtml || '<div class="level-locked-note">Наборы слов уже готовятся и скоро появятся здесь.</div>'}
      </div>
    `;
    document.getElementById("vocabBackBtn").addEventListener("click", () => renderHome());
    screenEl.querySelectorAll(".vocab-card").forEach(card => {
      card.addEventListener("click", () => {
        const set = sets.find(s => s.id === card.dataset.vocab);
        if (set) startVocabSet(set);
      });
    });
  }

  function buildVocabExercises(words) {
    const types = ["word-bank", "listening-choice", "multiple-choice", "type-answer", "listening", "listening-tap"];
    const exercises = words.map((w, i) => ({ type: types[i % types.length], ru: w.ru, en: w.en }));
    if (words.length >= 4) {
      exercises.push({ type: "matching", pairs: words.slice(0, 4).map(w => ({ ru: w.ru, en: w.en })) });
    }
    return exercises;
  }

  function startVocabSet(set) {
    cancelAdvance();
    returnScreen = "vocabulary";
    startLesson({ id: set.id, exercises: buildVocabExercises(set.words) });
  }

  // ---------- placement test ----------
  function renderPlacementIntro() {
    screenEl.innerHTML = `
      <div class="placement-intro">
        <h2>Тест на определение уровня</h2>
        <p>28 предложений разной сложности — от простых до самых продвинутых. Тест покажет, с какого уровня вам стоит начать, чтобы не терять время на слишком лёгком материале.</p>
        <div class="placement-actions">
          <button class="primary-btn" id="startPlacementBtn">Пройти тест (5 минут)</button>
          <button class="secondary-btn" id="skipPlacementBtn">Начать с A1</button>
        </div>
      </div>
    `;
    document.getElementById("startPlacementBtn").addEventListener("click", startPlacementTest);
    document.getElementById("skipPlacementBtn").addEventListener("click", () => {
      progress.placementDone = true;
      saveProgress();
      renderHome();
    });
  }

  function startPlacementTest() {
    if (!placementQuestions.length) { progress.placementDone = true; saveProgress(); renderHome(); return; }
    placementState = { idx: 0, correctByLevel: {} };
    renderPlacementQuestion();
  }

  function renderPlacementQuestion() {
    const q = placementQuestions[placementState.idx];
    const options = shuffled([q.en, ...q.distractors]);
    const answerIndex = options.indexOf(q.en);
    const pct = Math.round((placementState.idx / placementQuestions.length) * 100);

    screenEl.innerHTML = `
      <div class="lesson-bar">
        <button class="exit-btn" id="exitPlacementBtn">&times;</button>
        <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
      </div>
      <div class="card">
        <div class="prompt-kicker"><span>Выбери перевод</span></div>
        <div class="prompt-native">${q.ru}</div>
        <div class="options" id="options">
          ${options.map((opt, i) => optionBtn(opt, `data-i="${i}"`, i)).join("")}
        </div>
      </div>
    `;
    document.getElementById("exitPlacementBtn").addEventListener("click", () => {
      placementState = null;
      renderHome();
    });
    let answered = false;
    document.querySelectorAll("#options .option").forEach(btn => {
      btn.addEventListener("click", () => {
        if (answered) return;
        answered = true;
        const i = Number(btn.dataset.i);
        const correct = i === answerIndex;
        document.querySelectorAll("#options .option").forEach(b => b.disabled = true);
        btn.classList.add(correct ? "correct" : "incorrect");
        if (!correct) document.querySelector(`#options .option[data-i="${answerIndex}"]`).classList.add("correct");

        const lvl = q.level;
        if (!placementState.correctByLevel[lvl]) placementState.correctByLevel[lvl] = { correct: 0, total: 0 };
        placementState.correctByLevel[lvl].total++;
        if (correct) placementState.correctByLevel[lvl].correct++;

        setTimeout(() => {
          placementState.idx++;
          if (placementState.idx >= placementQuestions.length) finishPlacementTest();
          else renderPlacementQuestion();
        }, 700);
      });
    });
  }

  function finishPlacementTest() {
    const order = ["a1", "a2", "b1", "b1plus", "b2", "b2plus", "c1"];
    let placedLevelId = "a1";
    order.forEach(lvlId => {
      const r = placementState.correctByLevel[lvlId];
      if (r && r.correct / r.total >= 0.75) placedLevelId = lvlId;
    });
    const placedIdx = course.levels.findIndex(l => l.id === placedLevelId);
    progress.placementLevelIndex = Math.max(progress.placementLevelIndex, placedIdx);
    progress.placementDone = true;
    saveProgress();
    const placedLevel = course.levels[placedIdx];

    screenEl.innerHTML = `
      <div class="placement-result">
        <h2>Результат теста</h2>
        <p>Ваш стартовый уровень:</p>
        <div class="level-pill">${placedLevel.badge} · ${placedLevel.label}</div>
        <p>Соответствующие уроки уже разблокированы ниже.</p>
        <div class="placement-actions">
          <button class="primary-btn" id="placementDoneBtn">К урокам</button>
        </div>
      </div>
    `;
    document.getElementById("placementDoneBtn").addEventListener("click", () => {
      placementState = null;
      renderHome();
    });
  }

  // Lessons have been split into shorter "-p1"/"-p2" parts a few times now
  // (20->10 sentences, then again when reading-comprehension lessons were
  // interleaved), which changes lesson ids. A learner's completedLessons
  // list still has the old, now-nonexistent ids, so every one of those
  // lessons silently reads as "not done" and the roadmap looks reset. This
  // recovers it: any old id that isn't in the current course but has a
  // "-p1"/"-p2" descendant gets replaced by that descendant, crediting the
  // learner for what they already finished. Runs once (flagged), then saves.
  function migrateSplitLessonIds() {
    if (progress.migratedSplitIdsV1) return;
    const allIds = new Set(flatLessons.map(l => l.id));
    const migrated = [];
    (progress.completedLessons || []).forEach(oldId => {
      if (allIds.has(oldId)) { migrated.push(oldId); return; }
      const p1 = `${oldId}-p1`, p2 = `${oldId}-p2`;
      if (allIds.has(p1)) migrated.push(p1);
      if (allIds.has(p2)) migrated.push(p2);
    });
    progress.completedLessons = Array.from(new Set(migrated));
    progress.migratedSplitIdsV1 = true;
    saveProgress();
  }

  // Pulls the cloud copy, merges it into local progress, and always pushes
  // the merged result back up -- not only when the cloud had nothing. A
  // cloud document can exist with progress that's missing or behind what
  // this device already has (e.g. a push from this account genuinely
  // never landed) -- pulling alone would silently leave that gap in place
  // until the next lesson happens to trigger a save. Used by both boot()
  // (runs once automatically) and the "Sync now" button, which exists
  // because a device only ever auto-pulls once, at boot -- progress made
  // on another device afterward never shows up here until either a full
  // reload or an explicit manual sync.
  async function syncFromCloud() {
    if (!(window.CloudSync && window.CloudSync.user)) return { found: false };
    const remote = await window.CloudSync.pullProgress();
    const found = !!remote;
    if (remote) {
      progress = mergeProgress(progress, remote);
      saveProgress();
    }
    // Awaited (not fire-and-forget): a caller reporting "uploaded" to the
    // user needs that to mean the write actually happened, not just that
    // it was scheduled.
    await window.CloudSync.pushProgressNow(progress);
    return { found, lessonsInCloud: found ? (remote.completedLessons || []).length : 0 };
  }

  // ---------- boot ----------
  async function boot() {
    initTheme();
    initSound();
    await loadCourseData();
    await loadPlacementData();
    progress = loadProgress();
    if (window.CloudSync && window.CloudSync.user) {
      try { await syncFromCloud(); } catch (e) { /* offline — continue with local progress */ }
    }
    migrateSplitLessonIds();
    refreshTopStats();
    if (!progress.placementDone) renderPlacementIntro();
    else renderHome();
    wireGlobalUi();
  }

  function wireGlobalUi() {
    themeToggleEl.addEventListener("click", toggleTheme);
    soundToggleEl.addEventListener("click", toggleSound);
    const testSoundBtn = document.getElementById("testSoundBtn");
    if (testSoundBtn) {
      testSoundBtn.addEventListener("click", () => {
        playCorrectSound();
        setTimeout(() => {
          const diagEl = document.getElementById("audioDiagnostic");
          if (!diagEl) return;
          if (_lastBeepError) {
            diagEl.textContent = `Ошибка воспроизведения: ${_lastBeepError}`;
            return;
          }
          // On iPhone/iPad, the physical silent switch mutes generated sound
          // effects like this one (a real iOS behavior, not a bug) — but not
          // spoken audio, which is why voice playback still works either way.
          diagEl.textContent = "Если звук не слышен: на iPhone/iPad проверьте боковой переключатель бесшумного режима — он отключает короткие звуковые эффекты, хотя голос всё равно звучит.";
        }, 250);
      });
    }
    const syncNowBtn = document.getElementById("syncNowBtn");
    const syncStatusEl = document.getElementById("syncStatus");
    if (syncNowBtn) {
      syncNowBtn.addEventListener("click", async () => {
        if (!(window.CloudSync && window.CloudSync.user)) {
          if (syncStatusEl) syncStatusEl.textContent = "Не выполнен вход.";
          return;
        }
        syncNowBtn.disabled = true;
        if (syncStatusEl) syncStatusEl.textContent = "Синхронизация…";
        try {
          const result = await syncFromCloud();
          refreshTopStats();
          if (document.querySelector(".level-progress-card")) renderHome();
          if (syncStatusEl) {
            syncStatusEl.textContent = result.found
              ? `Синхронизировано — найдено ${result.lessonsInCloud} уроков в облаке; прогресс этого устройства тоже загружен.`
              : "В облаке не было сохранённого прогресса для этого аккаунта — прогресс этого устройства загружен.";
          }
        } catch (e) {
          syncStatusEl && (syncStatusEl.textContent = `Ошибка синхронизации: ${(e && (e.code || e.message)) || "неизвестная ошибка"}`);
        } finally {
          syncNowBtn.disabled = false;
        }
      });
    }
    placementToggleEl.addEventListener("click", () => {
      cancelAdvance();
      session = null;
      renderPlacementIntro();
    });
    vocabToggleEl.addEventListener("click", () => {
      cancelAdvance();
      session = null;
      renderVocabularyHub();
    });

    wordsStatEl.addEventListener("click", () => {
      renderHoard();
      hoardModal.classList.remove("hidden");
    });
    mistakesStatEl.addEventListener("click", () => {
      if (progress.missedBank.length === 0) return;
      cancelAdvance();
      startReview();
    });
    practiceStatEl.addEventListener("click", () => {
      cancelAdvance();
      startRevision();
    });

    document.getElementById("hoardClose").addEventListener("click", () => {
      hoardModal.classList.add("hidden");
    });
    hoardModal.addEventListener("click", e => {
      if (e.target === hoardModal) hoardModal.classList.add("hidden");
    });

    document.getElementById("dialogueClose").addEventListener("click", () => {
      dialogueModal.classList.add("hidden");
    });
    dialogueModal.addEventListener("click", e => {
      if (e.target === dialogueModal) dialogueModal.classList.add("hidden");
    });

    function closeMobileMenu() {
      mobileMenuPanelEl.classList.remove("open");
      menuToggleBtnEl.setAttribute("aria-expanded", "false");
    }
    menuToggleBtnEl.addEventListener("click", () => {
      const nowOpen = mobileMenuPanelEl.classList.toggle("open");
      menuToggleBtnEl.setAttribute("aria-expanded", String(nowOpen));
    });
    mobileMenuPanelEl.querySelectorAll("button").forEach(btn => {
      btn.addEventListener("click", closeMobileMenu);
    });
    document.addEventListener("click", e => {
      if (mobileMenuPanelEl.classList.contains("open") && !mobileMenuEl.contains(e.target)) {
        closeMobileMenu();
      }
    });

    document.addEventListener("keydown", e => {
      if (advanceTimer && e.key === "Enter") { e.preventDefault(); cancelAdvance(); nextExercise(); return; }
      if (session && /^[1-4]$/.test(e.key)) {
        const opts = Array.from(document.querySelectorAll(".options .option:not(:disabled)"));
        const idx = Number(e.key) - 1;
        if (opts[idx]) opts[idx].click();
      }
    });
  }

  function renderHoard() {
    const list = document.getElementById("hoardList");
    if (!progress.wordHoard.length) {
      list.innerHTML = `<div class="hoard-empty">Пока пусто — переведи несколько предложений правильно, и слова появятся здесь.</div>`;
      return;
    }
    list.innerHTML = progress.wordHoard.slice().sort().map(w => `<span class="hoard-word">${w}</span>`).join("");
  }

  window.__appReady = boot;
})();
