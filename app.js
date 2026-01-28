const AUTH_KEY = "rpm_auth_user";
const DEFAULT_USER = { username: "admin", password: "admin" };
const DATA_KEY = "rpm_signal_data_v2_blueprint";

const SIGNAL_HOTSPOTS = [
  {
    "id": 1,
    "title": "Signal 1",
    "left": 3.4278959810874707,
    "top": 2.3255813953488373,
    "width": 2.8368794326241136,
    "height": 17.441860465116278
  },
  {
    "id": 2,
    "title": "Signal 2",
    "left": 8.037825059101655,
    "top": 2.3255813953488373,
    "width": 2.2458628841607564,
    "height": 17.441860465116278
  },
  {
    "id": 3,
    "title": "2/13 signal nuqtasi",
    "left": 12.411347517730496,
    "top": 2.3255813953488373,
    "width": 2.2458628841607564,
    "height": 17.441860465116278
  },
  {
    "id": 4,
    "title": "Signal 4",
    "left": 20.803782505910164,
    "top": 2.3255813953488373,
    "width": 2.3640661938534278,
    "height": 17.441860465116278
  },
  {
    "id": 5,
    "title": "Signal 5",
    "left": 27.06855791962175,
    "top": 2.3255813953488373,
    "width": 2.2458628841607564,
    "height": 17.441860465116278
  },
  {
    "id": 6,
    "title": "Signal 6",
    "left": 36.997635933806144,
    "top": 2.3255813953488373,
    "width": 2.3640661938534278,
    "height": 17.441860465116278
  },
  {
    "id": 7,
    "title": "Signal 7",
    "left": 41.60756501182033,
    "top": 2.3255813953488373,
    "width": 2.3640661938534278,
    "height": 17.441860465116278
  },
  {
    "id": 8,
    "title": "Signal 8",
    "left": 49.054373522458626,
    "top": 2.3255813953488373,
    "width": 2.3640661938534278,
    "height": 17.441860465116278
  },
  {
    "id": 9,
    "title": "Signal 9",
    "left": 66.07565011820331,
    "top": 2.3255813953488373,
    "width": 2.2458628841607564,
    "height": 17.441860465116278
  },
  {
    "id": 10,
    "title": "Signal 10",
    "left": 77.42316784869976,
    "top": 2.3255813953488373,
    "width": 2.2458628841607564,
    "height": 17.441860465116278
  },
  {
    "id": 11,
    "title": "Signal 11",
    "left": 85.9338061465721,
    "top": 2.3255813953488373,
    "width": 2.2458628841607564,
    "height": 17.441860465116278
  },
  {
    "id": 12,
    "title": "Signal 12",
    "left": 94.44444444444444,
    "top": 2.3255813953488373,
    "width": 2.7186761229314422,
    "height": 17.441860465116278
  }
];

function getSignals(){
  const raw = localStorage.getItem(DATA_KEY);
  if (raw){
    try{ return JSON.parse(raw); }catch(e){}
  }
  const arr = SIGNAL_HOTSPOTS.map(h => ({
    id: h.id,
    title: h.title,
    oddDirectionName: "Kumkurgan - Elbayan",
    oddVoltage: 11.5,
    oddLampReplacedDate: "2025-11-25",
    evenDirectionName: "Elbayan - Kumkurgan",
    evenVoltage: 11.5,
    evenLampReplacedDate: "2025-11-25",
  }));
  localStorage.setItem(DATA_KEY, JSON.stringify(arr));
  return arr;
}
function setSignals(arr){ localStorage.setItem(DATA_KEY, JSON.stringify(arr)); }

function fmtDate(iso){
  if (!iso) return "—";
  const [y,m,d] = iso.split("-");
  return `${d}.${m}.${y}`;
}

function isAuthed(){ return !!localStorage.getItem(AUTH_KEY); }

function requireAuthOrRedirect(){
  const href = location.href;
  const isDashboard = href.includes("dashboard.html");
  const isLogin = href.endsWith("index.html") || href.endsWith("/") || href.includes("index.html");
  if (isDashboard && !isAuthed()) location.href = "index.html";
  if (isLogin && isAuthed()) location.href = "dashboard.html";
}

function logout(){
  localStorage.removeItem(AUTH_KEY);
  location.href = "index.html";
}

(function initLogin(){
  const form = document.getElementById("loginForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const u = document.getElementById("username").value.trim();
    const p = document.getElementById("password").value;

    const ok = (u === DEFAULT_USER.username && p === DEFAULT_USER.password);
    const err = document.getElementById("errorBox");
    if (!ok) { err.style.display = "block"; return; }

    err.style.display = "none";
    localStorage.setItem(AUTH_KEY, JSON.stringify({ username: u, at: Date.now() }));
    location.href = "dashboard.html";
  });
})();

let currentId = null;

function addHotspots(){
  const wrap = document.getElementById("bpWrap");
  if (!wrap) return;

  wrap.querySelectorAll(".hotspot").forEach(x => x.remove());

  for (const h of SIGNAL_HOTSPOTS){
    const hs = document.createElement("button");
    hs.className = "hotspot";
    hs.style.left = h.left + "%";
    hs.style.top = h.top + "%";
    hs.style.width = h.width + "%";
    hs.style.height = h.height + "%";
    hs.title = h.title;
    hs.onclick = () => openModal(h.id);
    wrap.appendChild(hs);
  }
}

function openModal(id){
  currentId = id;
  const modal = document.getElementById("modal");
  if (!modal) return;

  const toastOk = document.getElementById("toastOk");
  toastOk.style.display = "none";

  const signals = getSignals();
  const s = signals.find(x => x.id === id);
  if (!s) return;

  document.getElementById("modalTitle").innerText = `${s.title} • Parametrlar`;

  document.getElementById("oddDir").innerText = s.oddDirectionName;
  document.getElementById("oddVolt").innerText = `~${Number(s.oddVoltage).toFixed(1)}`;
  document.getElementById("oddDateText").innerText = fmtDate(s.oddLampReplacedDate);
  document.getElementById("oddDateInput").value = s.oddLampReplacedDate || "";

  document.getElementById("evenDir").innerText = s.evenDirectionName;
  document.getElementById("evenVolt").innerText = `~${Number(s.evenVoltage).toFixed(1)}`;
  document.getElementById("evenDateText").innerText = fmtDate(s.evenLampReplacedDate);
  document.getElementById("evenDateInput").value = s.evenLampReplacedDate || "";

  modal.classList.add("open");
}

function closeModal(){
  const modal = document.getElementById("modal");
  if (!modal) return;
  modal.classList.remove("open");
}

function saveDates(){
  const signals = getSignals();
  const idx = signals.findIndex(x => x.id === currentId);
  if (idx < 0) return;

  const odd = document.getElementById("oddDateInput").value;
  const even = document.getElementById("evenDateInput").value;

  signals[idx].oddLampReplacedDate = odd || null;
  signals[idx].evenLampReplacedDate = even || null;
  setSignals(signals);

  document.getElementById("oddDateText").innerText = fmtDate(signals[idx].oddLampReplacedDate);
  document.getElementById("evenDateText").innerText = fmtDate(signals[idx].evenLampReplacedDate);

  const toastOk = document.getElementById("toastOk");
  toastOk.style.display = "block";
}

(function modalUX(){
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
  document.addEventListener("click", (e) => {
    const modal = document.getElementById("modal");
    if (!modal || !modal.classList.contains("open")) return;
    if (e.target === modal) closeModal();
  });
})();

(function boot(){
  requireAuthOrRedirect();

  const who = document.getElementById("whoami");
  if (who && isAuthed()) {
    try {
      const u = JSON.parse(localStorage.getItem(AUTH_KEY));
      who.textContent = `User: ${u.username}`;
    } catch(e) {}
  }

  addHotspots();
})();
