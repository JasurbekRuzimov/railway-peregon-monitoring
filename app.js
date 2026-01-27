/**
 * Railway UI static demo (HTML/CSS/JS)
 * - Login (frontend) -> dashboard
 * - Signal cards -> modal
 * - Dates saved in localStorage
 */

const AUTH_KEY = "rpm_auth_user";
const DATA_KEY = "rpm_signal_data_v1";

const DEFAULT_USER = { username: "admin", password: "admin123" };

const defaultSignals = [
  { id: 1, title: "Signal 1", status: "red",
    oddDirectionName: "Kumkurgan - Elbayan", oddVoltage: 11.5, oddLampReplacedDate: "2025-11-25",
    evenDirectionName: "Elbayan - Kumkurgan", evenVoltage: 11.5, evenLampReplacedDate: "2025-11-25"
  },
  { id: 2, title: "Signal 2", status: "yellow",
    oddDirectionName: "Kumkurgan - Elbayan", oddVoltage: 11.4, oddLampReplacedDate: "2025-11-10",
    evenDirectionName: "Elbayan - Kumkurgan", evenVoltage: 11.5, evenLampReplacedDate: "2025-11-12"
  },
  { id: 3, title: "Signal 3", status: "green",
    oddDirectionName: "Kumkurgan - Elbayan", oddVoltage: 11.6, oddLampReplacedDate: "2025-10-02",
    evenDirectionName: "Elbayan - Kumkurgan", evenVoltage: 11.6, evenLampReplacedDate: "2025-10-05"
  },
  { id: 4, title: "Signal 4", status: "green",
    oddDirectionName: "Kumkurgan - Elbayan", oddVoltage: 11.2, oddLampReplacedDate: "2025-09-15",
    evenDirectionName: "Elbayan - Kumkurgan", evenVoltage: 11.2, evenLampReplacedDate: "2025-09-18"
  },
  { id: 5, title: "Signal 5", status: "yellow",
    oddDirectionName: "Kumkurgan - Elbayan", oddVoltage: 11.5, oddLampReplacedDate: "2025-08-20",
    evenDirectionName: "Elbayan - Kumkurgan", evenVoltage: 11.5, evenLampReplacedDate: "2025-08-22"
  },
  { id: 6, title: "Signal 6", status: "red",
    oddDirectionName: "Kumkurgan - Elbayan", oddVoltage: 11.7, oddLampReplacedDate: "2025-12-01",
    evenDirectionName: "Elbayan - Kumkurgan", evenVoltage: 11.7, evenLampReplacedDate: "2025-12-02"
  },
  { id: 7, title: "Signal 7", status: "green",
    oddDirectionName: "Kumkurgan - Elbayan", oddVoltage: 11.1, oddLampReplacedDate: "2025-07-11",
    evenDirectionName: "Elbayan - Kumkurgan", evenVoltage: 11.1, evenLampReplacedDate: "2025-07-12"
  },
  { id: 8, title: "Signal 8", status: "yellow",
    oddDirectionName: "Kumkurgan - Elbayan", oddVoltage: 11.8, oddLampReplacedDate: "2025-06-03",
    evenDirectionName: "Elbayan - Kumkurgan", evenVoltage: 11.8, evenLampReplacedDate: "2025-06-04"
  }
];

function getSignals() {
  const raw = localStorage.getItem(DATA_KEY);
  if (raw) {
    try { return JSON.parse(raw); } catch(e) {}
  }
  localStorage.setItem(DATA_KEY, JSON.stringify(defaultSignals));
  return JSON.parse(localStorage.getItem(DATA_KEY));
}

function setSignals(signals) {
  localStorage.setItem(DATA_KEY, JSON.stringify(signals));
}

function fmtDate(iso) {
  if (!iso) return "—";
  const [y,m,d] = iso.split("-");
  return `${d}.${m}.${y}`;
}

function isAuthed() {
  return !!localStorage.getItem(AUTH_KEY);
}

function requireAuthOrRedirect() {
  const href = location.href;
  const isDashboard = href.includes("dashboard.html");
  const isLogin = href.endsWith("index.html") || href.endsWith("/") || href.includes("index.html");

  if (isDashboard && !isAuthed()) location.href = "index.html";
  if (isLogin && isAuthed()) location.href = "dashboard.html";
}

function logout() {
  localStorage.removeItem(AUTH_KEY);
  location.href = "index.html";
}

// Login wiring
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

// Dashboard wiring
let currentId = null;

function renderGrid() {
  const grid = document.getElementById("grid");
  if (!grid) return;

  const signals = getSignals();
  grid.innerHTML = "";
  for (const s of signals) {
    const el = document.createElement("div");
    el.className = "signal";
    el.onclick = () => openModal(s.id);

    const left = document.createElement("div");
    left.innerHTML = `<div class="title">${s.title}</div><div class="sub">Signal nuqtasi</div>`;

    const right = document.createElement("div");
    right.className = "dotrow";
    const colors = (s.status === "red") ? ["red","red","red"]
                 : (s.status === "yellow") ? ["yellow","yellow","yellow"]
                 : ["green","green","green"];
    for (const c of colors) {
      const d = document.createElement("span");
      d.className = "dot " + c;
      right.appendChild(d);
    }

    el.appendChild(left);
    el.appendChild(right);
    grid.appendChild(el);
  }
}

function openModal(id) {
  currentId = id;
  const modal = document.getElementById("modal");
  if (!modal) return;

  hideToasts();

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

function closeModal() {
  const modal = document.getElementById("modal");
  if (!modal) return;
  modal.classList.remove("open");
}

function hideToasts(){
  const ok = document.getElementById("toastOk");
  const err = document.getElementById("toastErr");
  if (ok) ok.style.display = "none";
  if (err) err.style.display = "none";
}

function showToast(type){
  const ok = document.getElementById("toastOk");
  const err = document.getElementById("toastErr");
  if (!ok || !err) return;
  ok.style.display = (type === "ok") ? "block" : "none";
  err.style.display = (type === "err") ? "block" : "none";
}

function saveDates(){
  try{
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

    showToast("ok");
    renderGrid();
  } catch(e){
    console.error(e);
    showToast("err");
  }
}

// Close modal on background click + Esc
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

// Boot
(function boot(){
  requireAuthOrRedirect();

  const who = document.getElementById("whoami");
  if (who && isAuthed()) {
    try{
      const u = JSON.parse(localStorage.getItem(AUTH_KEY));
      who.textContent = `User: ${u.username}`;
    } catch(e){}
  }
  renderGrid();
})();
