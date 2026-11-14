// Flow English — decorative illustration kit (presentation only).
//
// Every illustration here is generated as an inline SVG string and painted
// with CSS classes (fa-*) whose colours come from the theme variables in
// style.css, so light/dark themes recolour the art automatically. Nothing
// here touches lesson logic, progress or auth; app.js calls these through
// a tiny guarded helper, so if this file failed to load the app would
// simply render without the pictures.
(() => {
  "use strict";

  const svg = (cls, viewBox, body, extra = "") =>
    `<svg class="fa ${cls}" viewBox="${viewBox}" ${extra} aria-hidden="true" focusable="false">${body}</svg>`;

  // ---------- London ↔ America skyline poster ----------
  // Left half: phone box, Big Ben, Westminster, Tower Bridge with a red
  // double-decker crossing it. Right half: national-park peaks, a Manhattan
  // skyline, the Golden Gate and a yellow cab. A striped mid-century sun
  // sits between the two.
  function skyline() {
    const win = (x, y, w = 2, h = 4) => `<rect x="${x}" y="${y}" width="${w}" height="${h}"/>`;
    let cityWindows = "";
    [[208, 70], [213, 70], [208, 80], [213, 80], [208, 90], [213, 90],
     [225, 64], [229, 64], [233, 64], [225, 74], [229, 74], [233, 74], [225, 84], [229, 84], [233, 84], [225, 94], [233, 94],
     [245, 76], [250, 76], [245, 86], [250, 86], [262, 62], [267, 62], [262, 72], [267, 72], [262, 82], [267, 82],
     [195, 84], [195, 92], [277, 86], [282, 86], [277, 94]]
      .forEach(([x, y]) => { cityWindows += win(x, y, 2.2, 3.4); });
    const body = `
      <rect class="fa-sky" width="360" height="120"/>
      <g class="fa-cloud">
        <path d="M22 26c0-4 4-6 7-4 2-5 10-5 12 0 4-1 7 2 6 5H22z"/>
        <path d="M296 18c0-3 3-5 6-3 2-4 8-4 10 0 3-1 6 1 5 4h-21z"/>
      </g>
      <circle class="fa-sun" cx="180" cy="80" r="40"/>
      <rect class="fa-sky" x="134" y="82" width="92" height="2.5"/>
      <rect class="fa-sky" x="134" y="89" width="92" height="3.5"/>
      <rect class="fa-sky" x="134" y="97" width="92" height="4.5"/>
      <path class="fa-hill" d="M190 104L246 50l26 24 28-34 60 56v8z"/>
      <path class="fa-snow" d="M246 50l10.8 10-5.8-2-5 4-5-4-6.3 2z"/>
      <path class="fa-snow" d="M300 40l12.9 12-6.9-2-6 5-6-5-9.9 2z"/>
      <path class="fa-meadow" d="M0 94q40-14 90-5t96 2v13H0z"/>
      <g class="fa-far">
        <rect x="192" y="80" width="12" height="24"/>
        <rect x="242" y="72" width="16" height="32"/>
        <rect x="274" y="82" width="14" height="22"/>
      </g>
      <g class="fa-city">
        <rect x="205" y="66" width="13" height="38"/>
        <rect x="222" y="60" width="18" height="44"/>
        <rect x="225" y="49" width="12" height="12"/>
        <rect x="228" y="39" width="6" height="11"/>
        <rect x="230.3" y="22" width="1.4" height="18"/>
        <rect x="260" y="58" width="12" height="46"/>
        <path d="M260 58l6-13 6 13z"/>
        <rect x="265.4" y="36" width="1.2" height="10"/>
      </g>
      <g class="fa-window">${cityWindows}</g>
      <g class="fa-orange">
        <rect x="290" y="85" width="70" height="3"/>
        <rect x="318" y="40" width="3" height="64"/>
        <rect x="327" y="40" width="3" height="64"/>
        <rect x="318" y="46" width="12" height="2.6"/>
        <rect x="318" y="61" width="12" height="2.6"/>
        <rect x="318" y="76" width="12" height="2.6"/>
      </g>
      <path class="fa-cable" d="M290 85q24-14 29.5-44M328.5 41q8 26 31.5 34"/>
      <g class="fa-stone">
        <rect x="35" y="36" width="14" height="68"/>
        <rect x="33" y="33" width="18" height="5"/>
        <path d="M34 33l8-22 8 22z"/>
        <rect x="41.3" y="4" width="1.4" height="8"/>
        <rect x="50" y="88" width="24" height="16"/>
        <path d="M52 88v-4h2v4M58 88v-5h2v5M64 88v-4h2v4M70 88v-5h2v5"/>
        <rect x="84" y="50" width="14" height="54"/>
        <rect x="128" y="50" width="14" height="54"/>
        <path d="M84 50l7-14 7 14zM128 50l7-14 7 14z"/>
        <rect x="98" y="53" width="30" height="3"/>
        <rect x="98" y="59" width="30" height="2"/>
      </g>
      <circle class="fa-face" cx="42" cy="45" r="5"/>
      <path class="fa-hand" d="M42 45v-3.2M42 45l2.4 1.2"/>
      <g class="fa-window-soft">
        ${win(38, 57)}${win(44, 57)}${win(38, 70)}${win(44, 70)}${win(38, 83)}${win(44, 83)}
        ${win(88.5, 62, 2, 5)}${win(93.5, 62, 2, 5)}${win(132.5, 62, 2, 5)}${win(137.5, 62, 2, 5)}
        ${win(54, 93, 3, 4)}${win(60, 93, 3, 4)}${win(66, 93, 3, 4)}
      </g>
      <path class="fa-chain" d="M60 82q16-10 24-26M142 56q8 16 28 26"/>
      <rect class="fa-deck" x="58" y="82" width="114" height="3.5"/>
      <g class="fa-red">
        <rect x="101" y="67" width="24" height="14" rx="2"/>
        <rect x="9" y="80" width="11" height="24" rx="1"/>
        <path d="M8.5 81q6-6 12 0z"/>
      </g>
      <g class="fa-window">
        <rect x="103" y="69" width="5" height="3"/><rect x="109.5" y="69" width="5" height="3"/><rect x="116" y="69" width="5" height="3"/><rect x="122" y="69" width="1.6" height="3"/>
        <rect x="103" y="74.5" width="5" height="3"/><rect x="109.5" y="74.5" width="5" height="3"/><rect x="116" y="74.5" width="7.6" height="3"/>
        <rect x="11" y="85" width="3" height="3"/><rect x="15" y="85" width="3" height="3"/>
        <rect x="11" y="89.5" width="3" height="3"/><rect x="15" y="89.5" width="3" height="3"/>
        <rect x="11" y="94" width="3" height="3"/><rect x="15" y="94" width="3" height="3"/>
      </g>
      <g class="fa-ink">
        <circle cx="106" cy="81.5" r="2"/><circle cx="120" cy="81.5" r="2"/>
      </g>
      <rect class="fa-ground" x="0" y="104" width="360" height="16"/>
      <path class="fa-ripple" d="M8 110h18M40 110h26M84 110h14M112 110h30M150 110h12M20 115h22M60 115h30M106 115h20M136 115h28"/>
      <path class="fa-road" d="M196 112h12M220 112h12M244 112h12M268 112h12M292 112h12M316 112h12M340 112h12"/>
      <g class="fa-yellow">
        <path d="M244 104v-5q1-3 4-3h4l3-4.4h8l3 4.4h3.5q3 0 3 3v5z"/>
        <rect x="256.6" y="88.5" width="5" height="2.6" rx=".6"/>
      </g>
      <path class="fa-window" d="M255.8 92.4h3v3.6h-5.4zM260.4 92.4h2.6l2.3 3.6h-4.9z"/>
      <path class="fa-checker" d="M245 100.5h28"/>
      <g class="fa-ink"><circle cx="249.5" cy="104" r="2.4"/><circle cx="267.5" cy="104" r="2.4"/></g>
      <path class="fa-bird" d="M150 30q3-3 6 0q3-3 6 0M164 22q2-2 4 0q2-2 4 0M196 28q2.5-2.5 5 0q2.5-2.5 5 0"/>
    `;
    return svg("fa-skyline", "0 0 360 120", body, 'preserveAspectRatio="xMidYMax slice"');
  }

  // ---------- CEFR level badges (enamel-pin roundels) ----------
  // The course reads as a journey: London (A1–B1+) across the Atlantic to
  // America (B2–C1). Each level has its own colour and landmark.
  const MOTIFS = {
    a1: `<rect class="fa-red" x="25" y="16" width="14" height="25" rx="1.5"/><path class="fa-red" d="M24 17q8-8 16 0z"/>
         <rect class="fa-window" x="27" y="19.5" width="10" height="2"/>
         <g class="fa-window"><rect x="27.5" y="23.5" width="3.8" height="3.8"/><rect x="32.7" y="23.5" width="3.8" height="3.8"/><rect x="27.5" y="28.6" width="3.8" height="3.8"/><rect x="32.7" y="28.6" width="3.8" height="3.8"/></g>`,
    a2: `<rect class="fa-red" x="14" y="16" width="36" height="23" rx="3"/>
         <g class="fa-window"><rect x="17" y="19" width="6.5" height="5" rx="1"/><rect x="25" y="19" width="6.5" height="5" rx="1"/><rect x="33" y="19" width="6.5" height="5" rx="1"/><rect x="41" y="19" width="6" height="5" rx="1"/>
         <rect x="17" y="27.5" width="6.5" height="5" rx="1"/><rect x="25" y="27.5" width="6.5" height="5" rx="1"/><rect x="33" y="27.5" width="14" height="5" rx="1"/></g>
         <g class="fa-ink"><circle cx="21" cy="39" r="3"/><circle cx="43" cy="39" r="3"/></g>`,
    b1: `<rect class="fa-stone" x="27" y="19" width="10" height="23"/><path class="fa-stone" d="M26 20l6-14 6 14z"/>
         <circle class="fa-face" cx="32" cy="25" r="3.6"/><path class="fa-hand" d="M32 25v-2.4M32 25l1.8.9"/>
         <g class="fa-window-soft"><rect x="29.5" y="31" width="1.6" height="4"/><rect x="32.9" y="31" width="1.6" height="4"/></g>`,
    b1plus: `<g class="fa-oxfordfill"><rect x="17" y="17" width="8" height="25"/><rect x="39" y="17" width="8" height="25"/><path d="M17 17l4-7 4 7zM39 17l4-7 4 7z"/>
         <rect x="25" y="19" width="14" height="2.6"/><rect x="10" y="31" width="44" height="2.6"/></g>
         <path class="fa-chain" d="M10 31q7-4 8-12M46 19q1 8 8 12"/>
         <g class="fa-window"><rect x="19.8" y="22" width="2.4" height="4" rx="1"/><rect x="41.8" y="22" width="2.4" height="4" rx="1"/></g>`,
    b2: `<path class="fa-yellow" d="M13 38v-6q1-4 5-4h5l4.5-6.5h10L42 28h5q4 0 4 4v6z"/>
         <rect class="fa-yellow" x="29" y="17" width="7" height="3.6" rx=".8"/>
         <path class="fa-window" d="M28.3 23h3.6v5h-7.2zM33.6 23h3.2l3.3 5h-6.5z"/>
         <path class="fa-checker" d="M14 33.2h36"/>
         <g class="fa-ink"><circle cx="20.5" cy="38.5" r="3.4"/><circle cx="43.5" cy="38.5" r="3.4"/></g>`,
    b2plus: `<g class="fa-orange"><rect x="23.5" y="10" width="3.2" height="32"/><rect x="37.3" y="10" width="3.2" height="32"/>
         <rect x="23.5" y="14" width="17" height="2.4"/><rect x="23.5" y="22" width="17" height="2.4"/><rect x="23.5" y="30" width="17" height="2.4"/>
         <rect x="6" y="35" width="52" height="2.6"/></g>
         <path class="fa-cable" d="M6 35q14-3 19-24M39 11q5 21 19 24"/>`,
    c1: `<circle class="fa-sun" cx="41" cy="18" r="6"/>
         <path class="fa-hill" d="M8 41l17-25 9 13 6-7 16 19z"/>
         <path class="fa-snow" d="M25 16l4.8 7-2.8-1.4-2 2.4-2-2.4-2.8 1.4z"/>
         <g class="fa-pine"><path d="M14 41l3-7 3 7zM46 41l3-8 3 8zM51 41l2.4-6 2.4 6z"/></g>`,
  };

  function badge(levelId, label, size = 56) {
    const id = MOTIFS[levelId] ? levelId : "a1";
    const text = String(label || id.toUpperCase());
    const body = `
      <circle cx="32" cy="32" r="31" class="fa-badge-rim"/>
      <circle cx="32" cy="32" r="28.5" class="fa-badge-ring"/>
      <circle cx="32" cy="32" r="23.5" class="fa-badge-face"/>
      <circle cx="32" cy="32" r="21.5" class="fa-badge-dash"/>
      ${MOTIFS[id]}
      <rect x="4" y="41" width="56" height="12" rx="2" class="fa-badge-bar"/>
      <text x="32" y="50.6" text-anchor="middle" class="fa-badge-text">${text}</text>
      <path class="fa-badge-shine" d="M14 20a20 20 0 0112-10"/>
    `;
    return svg("fa-badge", "0 0 64 64", body, `data-level="${id}" width="${size}" height="${size}"`);
  }

  // ---------- progress ring ----------
  function ring(pct) {
    const p = Math.max(0, Math.min(100, Number(pct) || 0));
    const r = 42;
    const c = 2 * Math.PI * r;
    const len = (c * p) / 100;
    const body = `
      <circle cx="50" cy="50" r="${r}" class="fa-ring-track"/>
      <circle cx="50" cy="50" r="${r}" class="fa-ring-fill" stroke-dasharray="${len.toFixed(2)} ${c.toFixed(2)}" transform="rotate(-90 50 50)"/>
      <circle cx="50" cy="50" r="33" class="fa-ring-inner"/>
    `;
    return svg("fa-ring", "0 0 100 100", body);
  }

  // ---------- celebration medal (lesson complete) ----------
  function star(cx, cy, R, r, n = 5) {
    let d = "";
    for (let i = 0; i < n * 2; i++) {
      const rad = i % 2 === 0 ? R : r;
      const a = -Math.PI / 2 + (i * Math.PI) / n;
      d += `${i ? "L" : "M"}${(cx + rad * Math.cos(a)).toFixed(2)} ${(cy + rad * Math.sin(a)).toFixed(2)}`;
    }
    return d + "Z";
  }
  function celebrate() {
    const cx = 120, cy = 82;
    let rays = "";
    const N = 20;
    for (let i = 0; i < N; i++) {
      const a1 = (i / N) * Math.PI * 2;
      const a2 = ((i + 0.5) / N) * Math.PI * 2;
      const R = 150;
      rays += `M${cx} ${cy}L${(cx + R * Math.cos(a1)).toFixed(1)} ${(cy + R * Math.sin(a1)).toFixed(1)}L${(cx + R * Math.cos(a2)).toFixed(1)} ${(cy + R * Math.sin(a2)).toFixed(1)}Z`;
    }
    let leaves = "";
    for (let side = -1; side <= 1; side += 2) {
      for (let k = 0; k < 7; k++) {
        const a = Math.PI / 2 + side * (0.55 + k * 0.29);
        const x = cx + 46 * Math.cos(a);
        const y = cy + 46 * Math.sin(a);
        const rot = (a * 180) / Math.PI + (side > 0 ? 90 : -90) + side * 25;
        leaves += `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="3.2" ry="7.5" transform="rotate(${rot.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)})"/>`;
      }
    }
    const body = `
      <defs>
        <radialGradient id="faRayFade" cx="${cx}" cy="${cy}" r="118" gradientUnits="userSpaceOnUse">
          <stop offset="0.35" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>
        </radialGradient>
        <mask id="faRayMask"><rect width="240" height="170" fill="url(#faRayFade)"/></mask>
      </defs>
      <g mask="url(#faRayMask)"><path class="fa-rays" d="${rays}"/></g>
      <g class="fa-ribbon-red"><path d="M104 108l-12 46 12-6 8 10 8-44z"/></g>
      <g class="fa-ribbon-blue"><path d="M136 108l12 46-12-6-8 10-8-44z"/></g>
      <g class="fa-laurel">${leaves}</g>
      <circle cx="${cx}" cy="${cy}" r="37" class="fa-medal-rim"/>
      <circle cx="${cx}" cy="${cy}" r="31" class="fa-medal-face"/>
      <circle cx="${cx}" cy="${cy}" r="27.5" class="fa-medal-dash"/>
      <path class="fa-medal-star" d="${star(cx, cy - 1, 17, 7)}"/>
      <path class="fa-spark" d="${star(36, 34, 7, 2, 4)}${star(206, 46, 6, 1.8, 4)}${star(196, 124, 4, 1.2, 4)}${star(48, 118, 5, 1.5, 4)}"/>
    `;
    return svg("fa-celebrate", "0 0 240 170", body);
  }

  // ---------- small empty-state illustrations ----------
  function teacup() {
    const body = `
      <path class="fa-steam" d="M50 30c-5-6 5-9 0-16M60 30c-5-6 5-9 0-16M70 30c-5-6 5-9 0-16"/>
      <ellipse class="fa-saucer" cx="60" cy="74" rx="40" ry="7"/>
      <path class="fa-cup" d="M34 38h52v8a26 26 0 01-52 0z"/>
      <path class="fa-cup-line" d="M86 44h4a8 8 0 010 16h-6"/>
      <path class="fa-cup-band" d="M35 42h50"/>
      <path class="fa-tag-string" d="M78 38v14"/>
      <rect class="fa-tag" x="74" y="52" width="9" height="11" rx="1"/>
      <g class="fa-book"><path d="M2 84h34v4H2zM6 80h30v4H6z"/></g>
      <g class="fa-book-alt"><path d="M84 84h34v4H84z"/></g>
    `;
    return svg("fa-empty fa-teacup", "0 0 120 90", body);
  }
  function roadSign() {
    const body = `
      <path class="fa-hill" d="M0 58l26-30 14 14 18-22 30 30 14-12 18 20z"/>
      <path class="fa-snow" d="M58 20l6.6 8.6-3.6-1.6-3 3-3-3-3.6 1.6z"/>
      <path class="fa-road-bed" d="M46 80l10-24h8l10 24z"/>
      <path class="fa-road-line" d="M60 58v4M60 66v5M60 75v5"/>
      <rect class="fa-post" x="92" y="40" width="2.4" height="40"/>
      <path class="fa-shield" d="M84 26h18v10q0 8-9 11-9-3-9-11z"/>
      <path class="fa-shield-mark" d="M88.5 33h9M95 30l3 3-3 3"/>
      <rect class="fa-ground" x="0" y="80" width="120" height="4" rx="2"/>
    `;
    return svg("fa-empty fa-roadsign", "0 0 120 84", body);
  }

  // Static placeholders in index.html (e.g. the sign-in card art) opt in
  // with data-art="skyline"; filled once here, before auth.js reveals them.
  function hydrate(root) {
    (root || document).querySelectorAll("[data-art]").forEach(el => {
      const fn = api[el.dataset.art];
      if (typeof fn === "function" && !el.firstElementChild) el.innerHTML = fn();
    });
  }

  const api = { skyline, badge, ring, celebrate, teacup, roadSign, hydrate };
  window.FlowArt = api;
  hydrate();
})();
