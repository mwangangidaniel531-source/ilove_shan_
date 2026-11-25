/* ========== EDIT THIS PART ========== */
const CONFIG = {
  herName: "My Love",            // shown in the big heading
  yourName: "Shan",         // signs the last page
  passcode: "2609",              // 4–6 digits. Tip: your anniversary
  hint: "Hint: The date I made you mine",
  typedLines: ["I love", "I love you, to the moon and back."],
  letterGreeting: "My Dearest,",
  letter:
`I’m writing this because words sometimes catch in my throat when I look at you, overwhelmed by how much you mean to me.

Please keep this little note as a token of my heart: a quiet reminder of a love that belongs entirely to you.`,
  // Photos and videos shown together on the first page.
  media: [
    { type: "photo", src: "photo1.jpeg" },
    { type: "video", src: "video1.mp4" },
    { type: "photo", src: "photo2.jpeg" },
    { type: "photo", src: "photo3.jpeg" },
    { type: "photo", src: "photo4.jpeg" },
    { type: "video", src: "video2.mp4" },
    { type: "photo", src: "photo5.jpeg" },
    { type: "photo", src: "photo6.jpeg" },
    { type: "photo", src: "photo7.jpeg" }
  ]
};
/* ==================================== */

const $ = s => document.querySelector(s);
const wait = ms => new Promise(r => setTimeout(r, ms));
$("#title").textContent = `I love you so much, ${CONFIG.herName}`;
$("#greet").textContent = CONFIG.letterGreeting;
$("#sign").textContent = CONFIG.yourName;
$("#hint").textContent = CONFIG.hint;

/* floating golden bokeh */
for (let i = 0; i < 16; i++) {
  const b = document.createElement("i"), s = 20 + Math.random() * 70;
  b.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*100}%;width:${s}px;height:${s}px;--t:${6+Math.random()*8}s;--x:${Math.random()*80-40}px;opacity:${.2+Math.random()*.4}`;
  $("#bokeh").appendChild(b);
}

/* ---------- passcode ---------- */
const len = CONFIG.passcode.length;
let entry = "";
const dots = $("#dots"), pad = $("#pad");
dots.innerHTML = "<i></i>".repeat(len);
["1","2","3","4","5","6","7","8","9","","0","⌫"].forEach(k => {
  if (!k) { pad.appendChild(document.createElement("span")); return; }
  const b = document.createElement("button");
  b.type = "button"; b.textContent = k; b.setAttribute("aria-label", k === "⌫" ? "Delete" : k);
  b.onclick = () => press(k); pad.appendChild(b);
});
addEventListener("keydown", e => {
  if ($("#lock")) { if (/^\d$/.test(e.key)) press(e.key); else if (e.key === "Backspace") press("⌫"); }
  else if (e.key === "ArrowRight") go(cur + 1); else if (e.key === "ArrowLeft") go(cur - 1);
});
function paint() { [...dots.children].forEach((d, i) => d.classList.toggle("on", i < entry.length)); }
function press(k) {
  if (k === "⌫") entry = entry.slice(0, -1); else if (entry.length < len) entry += k;
  paint();
  if (entry.length === len) {
    if (entry === CONFIG.passcode) unlock();
    else {
      const l = $("#lock"); l.classList.add("shake"); $("#hint").textContent = "Not quite, try again ♥";
      setTimeout(() => { l.classList.remove("shake"); entry = ""; paint(); }, 450);
    }
  }
}

/* ---------- flower bloom ---------- */
function flowers(el, n) {
  const pal = [["#e8475f","#ff9aa9"],["#f4b942","#ffe08a"],["#5aa9e6","#a8d4ff"],["#7bc77e","#c8efc9"],["#f4f1f2","#cfc8ca"],["#9b6bd1","#d3b8f2"],["#ef7b2f","#ffc08f"]];
  for (let i = 0; i < n; i++) {
    const [c, d] = pal[Math.floor(Math.random() * pal.length)];
    const f = document.createElement("span"); f.className = "fl";
    f.style.cssText = `--c:${c};--d:${d};--a:${Math.floor(Math.random()*360)}deg`; el.appendChild(f);
  }
}
async function unlock() {
  const lock = $("#lock"), bloom = $("#bloom");
  flowers(bloom.querySelector(".l"), 60); flowers(bloom.querySelector(".r"), 60);
  bloom.style.display = "block";
  lock.style.opacity = 0; await wait(800); lock.remove();
  go(0);
  await wait(700); bloom.classList.add("open");
  await wait(2500); bloom.remove();
}

/* ---------- memories wall (photos + videos together) ---------- */
const spots = [[2,8],[38,3],[70,8],[0,36],[74,34],[3,62],[66,60],[36,64],[80,48],[84,10],[-2,22],[24,84]];
function buildWall() {
  const wall = $("#wall");
  CONFIG.media.forEach((m, i) => {
    const [x, y] = spots[i % spots.length];
    const p = document.createElement("div");
    p.className = "pol" + (m.type === "video" ? " vid" : "");
    p.style.cssText = `left:${x}%;top:${y}%;--r:${(i % 2 ? 1 : -1) * (4 + i * 2 % 9)}deg;--d:-${i * .9}s`;
    const box = document.createElement("div");
    if (m.type === "video") {
      const v = document.createElement("video");
      v.src = m.src; v.muted = true; v.loop = true; v.playsInline = true; v.preload = "metadata";
      v.setAttribute("aria-label", "A video of us (tap for sound)");
      v.onclick = () => { v.muted = !v.muted; if (!v.muted) { v.play(); p.classList.remove("vid"); } else p.classList.add("vid"); };
      box.appendChild(v);
    } else {
      const im = document.createElement("img"); im.src = m.src; im.alt = "Us"; box.appendChild(im);
    }
    p.appendChild(box); wall.appendChild(p);
  });
}
const playVideos = on => document.querySelectorAll("#wall video").forEach(v => {
  if (on) v.play().catch(() => {}); else { v.pause(); v.muted = true; }
});

/* ---------- typing ---------- */
let run = 0;
async function typeInto(el, lines, speed, id) {
  el.classList.add("caret");
  for (const line of lines) {
    el.textContent = "";
    for (const ch of line) { if (id !== run) return; el.textContent += ch; await wait(speed); }
    await wait(1400);
  }
}
async function typeText(el, text, speed, id) {
  el.textContent = "";
  for (const ch of text) { if (id !== run) return; el.textContent += ch; await wait(speed); }
}

/* ---------- page navigation ---------- */
const pages = [...document.querySelectorAll(".page")];
let cur = -1;
pages.forEach((pg, i) => {
  const nav = document.createElement("nav"); nav.className = "nav";
  if (i > 0 && i < pages.length - 1) nav.innerHTML = `<button type="button" data-d="-1">‹ Back</button>`;
  nav.innerHTML += `<button type="button" class="primary" data-d="1">${pg.dataset.next}</button>`;
  nav.onclick = e => { const d = e.target.dataset.d; if (d) go(i === pages.length - 1 ? 0 : i + Number(d)); };
  pg.appendChild(nav);
});
function go(n) {
  if (n < 0 || n >= pages.length || n === cur) return;
  cur = n; const id = ++run;
  pages.forEach((p, i) => p.classList.toggle("active", i === n));
  playVideos(pages[n].id === "memories");
  if (pages[n].id === "hearts") typeInto($("#typed"), CONFIG.typedLines, 90, id);
  if (pages[n].id === "letter") typeText($("#body"), CONFIG.letter, 38, id);
}
buildWall();
