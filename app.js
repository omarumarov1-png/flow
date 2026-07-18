(() => {
  "use strict";

  const PROGRESS_KEY = "flow-progress-v1";
  const THEME_KEY = "flow-theme";
  const SOUND_KEY = "flow-sound";
  const MAX_MISSED = 150;
  const REVISION_SIZE = 20;
  const ADVANCE_DELAY_CORRECT = 900;
  const ADVANCE_DELAY_WRONG = 2500;

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
  const mobileMenuEl = document.getElementById("mobileMenu");
  const menuToggleBtnEl = document.getElementById("menuToggleBtn");
  const mobileMenuPanelEl = document.getElementById("mobileMenuPanel");
  const hoardModal = document.getElementById("hoardModal");

  let course = null;
  let flatLessons = [];
  let progress = null;
  let session = null;
  let currentLevelId = null;
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
  function beep(freq, dur) {
    if (soundMuted) return;
    try {
      const ctx = beep._ctx || (beep._ctx = new (window.AudioContext || window.webkitAudioContext)());
      if (ctx.state === "suspended") ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = freq;
      osc.type = "sine";
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + dur);
    } catch (e) { /* audio unavailable */ }
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

  // Browser-native text-to-speech (Web Speech Synthesis API) — free, no API
  // key, no per-sentence audio files, works for the entire sentence bank
  // automatically since it reads text live. Voice list loads async on some
  // browsers, so we cache it once populated and prefer a real en-US voice.
  // Ranked by how natural/pleasant they sound among voices that ship free
  // with the browser/OS (no paid API, no extra download): Chrome's Google
  // voices and Edge's neural voices lead, macOS's Samantha is a solid classic,
  // then other common system voices before falling back to anything en-*.
  const VOICE_RANK = [
    /Google US English/i,
    /Microsoft (Aria|Jenny|Emma).*(Natural|Online)/i,
    /Samantha/i,
    /Microsoft Zira/i,
    /Ava|Nicky|Zoe/i,
    /Microsoft (David|Mark)/i,
  ];
  let _voices = [];
  let _preferredVoice = null;
  function refreshVoices() {
    if (!("speechSynthesis" in window)) return;
    _voices = window.speechSynthesis.getVoices() || [];
    const enUS = _voices.filter(v => v.lang === "en-US");
    for (const pattern of VOICE_RANK) {
      const match = enUS.find(v => pattern.test(v.name));
      if (match) { _preferredVoice = match; return; }
    }
    _preferredVoice = enUS[0] || _voices.find(v => /^en/i.test(v.lang)) || null;
  }
  if ("speechSynthesis" in window) {
    refreshVoices();
    window.speechSynthesis.onvoiceschanged = refreshVoices;
  }
  function speak(text) {
    if (soundMuted || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "en-US";
      u.rate = 0.92;
      if (_preferredVoice) u.voice = _preferredVoice;
      window.speechSynthesis.speak(u);
    } catch (e) { /* TTS unavailable */ }
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
        progress.missedBank.unshift({ ru: ex.ru, en: ex.en });
        progress.missedBank = progress.missedBank.slice(0, MAX_MISSED);
      }
    }
    saveProgress();
    refreshTopStats();
    speak(ex.en);
  }

  function renderFeedback(correct, answerText) {
    return `
      <div class="feedback ${correct ? "correct" : "incorrect"}">
        <div class="feedback-main">
          <button class="speak-btn" id="feedbackSpeakBtn" title="Прослушать произношение" aria-label="Прослушать произношение">🔊</button>
          <div>
            <div class="feedback-text">${correct ? "Верно! ✓" : "Не совсем"}</div>
            <div class="feedback-answer">${answerText}</div>
          </div>
        </div>
        <div class="feedback-next-hint">${session && session.queue.length > 1 ? "→ Enter" : "Готово"}</div>
      </div>
    `;
  }
  function wireFeedbackReplay(text) {
    const btn = document.getElementById("feedbackSpeakBtn");
    if (btn) btn.addEventListener("click", () => speak(text));
  }

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
    const pct = Math.round((session.index / session.total) * 100);
    screenEl.innerHTML = `
      <div class="lesson-bar">
        <button class="exit-btn" id="exitBtn">&times;</button>
        <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
        ${session.mode !== "lesson" ? '<span class="infinity-badge">&infin;</span>' : ""}
      </div>
      ${bodyHtml}
    `;
    document.getElementById("exitBtn").addEventListener("click", () => {
      cancelAdvance();
      session = null;
      renderHome();
    });
  }

  function renderExercise() {
    cancelAdvance();
    const item = session.queue[session.index];
    const ex = item.ex;
    if (!ex) { nextExercise(); return; }
    ex._sourceLesson = session.mode === "lesson" ? session.lesson : (flatLessons.find(l => l.id === (item.gid.split(":")[0])) || { exercises: [] });
    if (ex.type === "multiple-choice") renderMultipleChoice(ex);
    else if (ex.type === "word-bank") renderWordBank(ex);
    else renderTypeAnswer(ex);
  }

  function renderMultipleChoice(ex) {
    const siblingTexts = (ex._sourceLesson.exercises || [])
      .filter(e => !(e.ru === ex.ru && e.en === ex.en))
      .map(e => e.en);
    const pool = Array.from(new Set(siblingTexts.filter(t => t !== ex.en)));
    const distractors = shuffled(pool).slice(0, 3);
    const options = shuffled([ex.en, ...distractors]);
    const answerIndex = options.indexOf(ex.en);

    renderLessonChrome(`
      <div class="card">
        <div class="prompt-kicker"><span>Выбери перевод</span></div>
        <div class="prompt-native">${ex.ru}</div>
        <div class="options" id="options">
          ${options.map((opt, i) => `<button class="option" data-i="${i}">${opt}</button>`).join("")}
        </div>
      </div>
    `);

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
        const delay = correct ? ADVANCE_DELAY_CORRECT : ADVANCE_DELAY_WRONG;
        screenEl.insertAdjacentHTML("beforeend", renderFeedback(correct, ex.en));
        wireFeedbackReplay(ex.en);
        scheduleAdvance(delay);
      });
    });
  }

  function renderWordBank(ex) {
    const tgtTokens = enTokens(ex.en);
    const bank = shuffled(tgtTokens);
    let placed = [];

    renderLessonChrome(`
      <div class="card">
        <div class="prompt-kicker"><span>Собери перевод</span></div>
        <div class="prompt-native">${ex.ru}</div>
        <div class="bank-target" id="bankTarget"></div>
        <div class="bank-pool" id="bankPool"></div>
      </div>
    `);

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
      const delay = correct ? ADVANCE_DELAY_CORRECT : ADVANCE_DELAY_WRONG;
      screenEl.insertAdjacentHTML("beforeend", renderFeedback(correct, tgtTokens.join(" ")));
      wireFeedbackReplay(ex.en);
      scheduleAdvance(delay);
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
    renderLessonChrome(`
      <div class="card">
        <div class="prompt-kicker"><span>Напиши перевод</span></div>
        <div class="prompt-native">${ex.ru}</div>
        <form class="type-answer-form" id="typeForm">
          <input class="type-answer-input" id="typeInput" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Введите перевод на английском..." />
          <button class="type-submit-btn" id="typeSubmitBtn" type="submit" disabled>Проверить</button>
          <div class="type-answer-hint">Небольшие опечатки — это нормально, система их учитывает.</div>
        </form>
      </div>
    `);
    const input = document.getElementById("typeInput");
    const submitBtn = document.getElementById("typeSubmitBtn");
    input.addEventListener("input", () => { submitBtn.disabled = !input.value.trim(); });
    setTimeout(() => input.focus(), 50);

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
      const delay = correct ? ADVANCE_DELAY_CORRECT : ADVANCE_DELAY_WRONG;
      screenEl.insertAdjacentHTML("beforeend", renderFeedback(correct, ex.en));
      wireFeedbackReplay(ex.en);
      scheduleAdvance(delay);
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
      renderHome();
    });
  }

  // ---------- boot ----------
  async function loadCourseData() {
    const res = await fetch("data/course.json");
    if (!res.ok) throw new Error("Failed to load course data");
    const data = await res.json();
    course = data.course;

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

    let nodesHtml = "";
    levelLessons.forEach((lesson, i) => {
      const flatIndex = flatLessons.indexOf(lesson);
      const unlocked = isLessonUnlocked(flatIndex);
      const done = progress.completedLessons.includes(lesson.id);
      const isCurrent = unlocked && !done;
      const offset = ["center", "left", "right"][i % 3];
      nodesHtml += `
        <div class="roadmap-row ${offset}">
          <button class="roadmap-node ${done ? "done" : unlocked ? "unlocked" : "locked"} ${isCurrent ? "current" : ""}" data-lesson="${lesson.id}" ${unlocked ? "" : "disabled"} aria-label="${lesson.title}">
            ${done ? "✓" : unlocked ? lesson.number : "🔒"}
          </button>
          <div class="roadmap-label"><span class="roadmap-label-en">${lesson.title}</span><span class="roadmap-label-native">${lesson.titleNative || ""}</span></div>
        </div>
      `;
    });
    if (levelComplete && nextLevel) {
      nodesHtml += `
        <div class="roadmap-row center">
          <button class="roadmap-next-node" id="nextLevelBtn" aria-label="Следующий уровень">🏁</button>
          <div class="roadmap-label"><span class="roadmap-label-en">Уровень пройден!</span><span class="roadmap-label-native">Следующий: ${nextLevel.badge}</span></div>
        </div>
      `;
    }

    screenEl.innerHTML = `
      <div class="level-progress-card">
        <div class="waveform">${waveformBars(overallPct)}</div>
        <div class="level-progress-info">
          <div class="pct">${overallPct}%</div>
          <div class="label">Общий прогресс</div>
          <div class="count">${doneLessons} / ${totalLessons} уроков</div>
        </div>
      </div>
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
        : `<div class="roadmap" id="roadmapEl">${nodesHtml}</div>`
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
    const nextLevelBtn = document.getElementById("nextLevelBtn");
    if (nextLevelBtn) {
      nextLevelBtn.addEventListener("click", () => {
        if (!nextLevel) return;
        currentLevelId = nextLevel.id;
        renderLevelRoadmap();
      });
    }
    screenEl.querySelectorAll(".roadmap-node:not(.locked)").forEach(node => {
      node.addEventListener("click", () => {
        const lesson = flatLessons.find(l => l.id === node.dataset.lesson);
        if (lesson) startLesson(lesson);
      });
    });

    const target = screenEl.querySelector(".roadmap-node.current") || screenEl.querySelector(".roadmap-node.unlocked");
    if (target) {
      requestAnimationFrame(() => target.scrollIntoView({ block: "center", behavior: "auto" }));
    }
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
          ${options.map((opt, i) => `<button class="option" data-i="${i}">${opt}</button>`).join("")}
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
    const hasContent = flatLessons.some(l => l.levelId === placedLevelId);

    screenEl.innerHTML = `
      <div class="placement-result">
        <h2>Результат теста</h2>
        <p>Ваш стартовый уровень:</p>
        <div class="level-pill">${placedLevel.badge} · ${placedLevel.label}</div>
        <p>${hasContent ? "Соответствующие уроки уже разблокированы ниже." : "Уроки этого уровня скоро появятся — а пока доступен весь материал уровня A1 и выше, до момента их готовности."}</p>
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

  // ---------- boot ----------
  async function boot() {
    initTheme();
    initSound();
    await loadCourseData();
    await loadPlacementData();
    progress = loadProgress();
    if (window.CloudSync && window.CloudSync.user) {
      try {
        const remote = await window.CloudSync.pullProgress();
        if (remote) { progress = Object.assign({ placementLevelIndex: -1, placementDone: false }, remote); saveProgress(); }
        else window.CloudSync.pushProgress(progress);
      } catch (e) { /* offline — continue with local progress */ }
    }
    refreshTopStats();
    if (!progress.placementDone) renderPlacementIntro();
    else renderHome();
    wireGlobalUi();
  }

  function wireGlobalUi() {
    themeToggleEl.addEventListener("click", toggleTheme);
    soundToggleEl.addEventListener("click", toggleSound);
    placementToggleEl.addEventListener("click", () => {
      cancelAdvance();
      session = null;
      renderPlacementIntro();
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
