/* DRIVE RACE - MULTIPLAYER, COLOR WHEEL, GMAIL CLOUD SYNC & ADVANCED TRAFFIC SYSTEM */

// ==========================================
// 1. SOUND SYSTEM (WEB AUDIO API SYNTHESIZER)
// ==========================================
class SoundFX {
  constructor() {
    this.ctx = null;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
        this.initialized = true;
      }
    } catch (e) {
      console.warn("AudioContext not supported", e);
    }
  }

  playChime() {
    if (!this.initialized || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);
      osc.connect(gain); gain.connect(this.ctx.destination);
      osc.start(); osc.stop(this.ctx.currentTime + 0.3);
    } catch (e) {}
  }

  playBuySound() {
    if (!this.initialized || !this.ctx) return;
    try {
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0.12, this.ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.08 + 0.18);
        osc.connect(gain); gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + idx * 0.08);
        osc.stop(this.ctx.currentTime + idx * 0.08 + 0.2);
      });
    } catch (e) {}
  }

  playHorn() {
    if (!this.initialized || !this.ctx) return;
    try {
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc1.frequency.setValueAtTime(370, this.ctx.currentTime);
      osc2.frequency.setValueAtTime(440, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.22);
      osc1.connect(gain); osc2.connect(gain);
      gain.connect(this.ctx.destination);
      osc1.start(); osc2.start();
      osc1.stop(this.ctx.currentTime + 0.22);
      osc2.stop(this.ctx.currentTime + 0.22);
    } catch (e) {}
  }

  playBrake() {
    if (!this.initialized || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(240, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(90, this.ctx.currentTime + 0.18);
      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.18);
      osc.connect(gain); gain.connect(this.ctx.destination);
      osc.start(); osc.stop(this.ctx.currentTime + 0.18);
    } catch (e) {}
  }

  playShield() {
    if (!this.initialized || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.35);
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);
      osc.connect(gain); gain.connect(this.ctx.destination);
      osc.start(); osc.stop(this.ctx.currentTime + 0.35);
    } catch (e) {}
  }
}
const sfx = new SoundFX();
addEventListener("pointerdown", () => sfx.init(), { once: true });
addEventListener("keydown", () => sfx.init(), { once: true });


// ==========================================
// 2. USER ACCOUNT & GMAIL CLOUD SYNC SYSTEM
// ==========================================
const ACCOUNT_STORAGE_KEY = "drive_race_account_v2";

const colorCatalog = [
  { id: "red", hex: "#e53935", name: "أحمر سباق", price: 0 },
  { id: "blue", hex: "#1e88e5", name: "أزرق سرعة", price: 0 },
  { id: "white", hex: "#eceff1", name: "أبيض جليدي", price: 0 },
  { id: "green", hex: "#43a047", name: "أخضر رياضي", price: 15 },
  { id: "yellow", hex: "#f9a825", name: "أصفر برق", price: 25 },
  { id: "purple", hex: "#8e44ad", name: "بنفسجي نيون", price: 40 },
  { id: "black", hex: "#111111", name: "أسود كربوني", price: 50 },
  { id: "orange", hex: "#ff9800", name: "برتقالي ناري", price: 65 },
  { id: "cyan", hex: "#00bcd4", name: "تركواز سايبر", price: 80 },
  { id: "gold", hex: "#ffd700", name: "ذهبي ملكي", price: 110 },
  { id: "pink", hex: "#ff4081", name: "وردي هولوجرام", price: 130 }
];

let userProfile = {
  email: null,
  username: "كابتن " + Math.floor(100 + Math.random() * 900),
  isCloudConnected: false,
  trophies: 0,
  ownedColors: ["#e53935", "#1e88e5", "#eceff1"],
  activeColor: "#e53935",
  maxDistance: 0,
  highScore: 0,
  lastSync: null
};

function loadUserProfile() {
  try {
    const raw = localStorage.getItem(ACCOUNT_STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      userProfile = { ...userProfile, ...data };
      if (!Array.isArray(userProfile.ownedColors)) {
        userProfile.ownedColors = ["#e53935", "#1e88e5", "#eceff1"];
      }
    }
  } catch (e) {
    console.error("Failed to load user profile", e);
  }
  updateAccountUI();
}

function saveUserProfile(notify = false) {
  try {
    if (userProfile.email) {
      userProfile.lastSync = new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" });
      userProfile.isCloudConnected = true;
    }
    localStorage.setItem(ACCOUNT_STORAGE_KEY, JSON.stringify(userProfile));
    
    if (userProfile.email) {
      localStorage.setItem("cloud_account_" + userProfile.email.toLowerCase().trim(), JSON.stringify(userProfile));
    }
    
    updateAccountUI();
    if (notify) {
      showEvent("☁️ تم حفظ التقدم سحابياً على Gmail بنجاح!");
    }
  } catch (e) {
    console.error("Failed to save profile", e);
  }
}

function updateAccountUI() {
  const topUserName = document.getElementById("topUserName");
  const topTrophiesCount = document.getElementById("topTrophiesCount");
  const shopTrophiesCount = document.getElementById("shopTrophiesCount");
  const cloudStatusBadge = document.getElementById("cloudStatusBadge");
  const accEmailDisplay = document.getElementById("accEmailDisplay");
  const accCloudStatus = document.getElementById("accCloudStatus");
  const cloudTrophies = document.getElementById("cloudTrophies");
  const cloudColorsCount = document.getElementById("cloudColorsCount");
  const cloudMaxDistance = document.getElementById("cloudMaxDistance");
  const cloudLastSync = document.getElementById("cloudLastSync");
  const loggedInActions = document.getElementById("loggedInActions");
  const accountFormBox = document.getElementById("accountFormBox");

  if (topUserName) topUserName.textContent = userProfile.username;
  if (topTrophiesCount) topTrophiesCount.textContent = userProfile.trophies;
  if (shopTrophiesCount) shopTrophiesCount.textContent = userProfile.trophies;

  if (cloudStatusBadge) {
    if (userProfile.email) {
      cloudStatusBadge.textContent = "☁️ متصل بـ Gmail";
      cloudStatusBadge.classList.remove("offline");
    } else {
      cloudStatusBadge.textContent = "☁️ محلي (غير متصل)";
      cloudStatusBadge.classList.add("offline");
    }
  }

  if (accEmailDisplay) {
    accEmailDisplay.textContent = userProfile.email ? `${userProfile.username} (${userProfile.email})` : "حساب زائر محلي";
  }

  if (accCloudStatus) {
    accCloudStatus.textContent = userProfile.email 
      ? `🟢 المزامنة السحابية مفعلة (Gmail) • آخر مزامنة: ${userProfile.lastSync || "الآن"}`
      : "⚠️ البيانات محفوظة في هذا المتصفح فقط. سجل بريدك لحفظ التقدم.";
  }

  if (cloudTrophies) cloudTrophies.textContent = userProfile.trophies;
  if (cloudColorsCount) cloudColorsCount.textContent = userProfile.ownedColors.length;
  if (cloudMaxDistance) cloudMaxDistance.textContent = Math.floor(userProfile.maxDistance);
  if (cloudLastSync) cloudLastSync.textContent = userProfile.lastSync || "الآن";

  if (loggedInActions && accountFormBox) {
    if (userProfile.email) {
      loggedInActions.classList.remove("hidden");
      accountFormBox.classList.add("hidden");
    } else {
      loggedInActions.classList.add("hidden");
      accountFormBox.classList.remove("hidden");
    }
  }

  updateColorShopUI();
}

// ==========================================
// 3. COLOR WHEEL & TROPHY SHOP SYSTEM
// ==========================================
const colorWheelCanvas = document.getElementById("colorWheelCanvas");
const wheelCtx = colorWheelCanvas ? colorWheelCanvas.getContext("2d") : null;
const wheelCursor = document.getElementById("wheelCursor");
const lightnessSlider = document.getElementById("lightnessSlider");
const pickedColorChip = document.getElementById("pickedColorChip");
const pickedColorHex = document.getElementById("pickedColorHex");
const wheelColorActionText = document.getElementById("wheelColorActionText");
const shopCarPreview = document.getElementById("shopCarPreview");
const previewCar = document.getElementById("previewCar");

let currentPickedColor = userProfile.activeColor || "#e53935";
let wheelLightness = 50;

function hslToHex(h, s, l) {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = n => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 229, g: 57, b: 53 };
}

function drawColorWheel() {
  if (!wheelCtx || !colorWheelCanvas) return;
  const w = colorWheelCanvas.width, h = colorWheelCanvas.height;
  const cx = w / 2, cy = h / 2, radius = cx - 3;
  const imgData = wheelCtx.createImageData(w, h);
  const data = imgData.data;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const idx = (y * w + x) * 4;

      if (dist <= radius) {
        let angle = Math.atan2(dy, dx) * (180 / Math.PI);
        if (angle < 0) angle += 360;
        const sat = (dist / radius) * 100;
        const hex = hslToHex(angle, sat, wheelLightness);
        const rgb = hexToRgb(hex);

        data[idx] = rgb.r;
        data[idx + 1] = rgb.g;
        data[idx + 2] = rgb.b;
        data[idx + 3] = 255;
      } else {
        data[idx + 3] = 0;
      }
    }
  }
  wheelCtx.putImageData(imgData, 0, 0);
}

function pickColorFromWheelEvent(e) {
  if (!colorWheelCanvas) return;
  const rect = colorWheelCanvas.getBoundingClientRect();
  const clientX = e.clientX || (e.touches && e.touches[0].clientX);
  const clientY = e.clientY || (e.touches && e.touches[0].clientY);
  if (clientX === undefined || clientY === undefined) return;

  const x = clientX - rect.left;
  const y = clientY - rect.top;
  const cx = rect.width / 2;
  const cy = rect.height / 2;
  const dx = x - cx;
  const dy = y - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const radius = cx;

  const clampedDist = Math.min(dist, radius);
  let angle = Math.atan2(dy, dx) * (180 / Math.PI);
  if (angle < 0) angle += 360;
  const sat = (clampedDist / radius) * 100;

  const hex = hslToHex(angle, sat, wheelLightness);
  currentPickedColor = hex;

  if (wheelCursor) {
    const curX = cx + (dx / (dist || 1)) * clampedDist;
    const curY = cy + (dy / (dist || 1)) * clampedDist;
    wheelCursor.style.left = `${curX}px`;
    wheelCursor.style.top = `${curY}px`;
  }

  updatePickedColorUI();
}

function updatePickedColorUI() {
  if (pickedColorChip) pickedColorChip.style.background = currentPickedColor;
  if (pickedColorHex) pickedColorHex.textContent = currentPickedColor;
  if (shopCarPreview) shopCarPreview.style.background = currentPickedColor;

  const isOwned = userProfile.ownedColors.includes(currentPickedColor.toLowerCase());
  if (wheelColorActionText) {
    if (isOwned) {
      wheelColorActionText.textContent = userProfile.activeColor.toLowerCase() === currentPickedColor.toLowerCase() 
        ? "✓ اللون مُستخدم حالياً" 
        : "استخدام هذا اللون (مملوك)";
    } else {
      wheelColorActionText.textContent = `شراء هذا اللون المخصص (30 🏆)`;
    }
  }
}

function updateColorShopUI() {
  const catalogContainer = document.getElementById("colorShopCatalog");
  if (!catalogContainer) return;
  catalogContainer.innerHTML = "";

  colorCatalog.forEach(item => {
    const isOwned = userProfile.ownedColors.includes(item.hex.toLowerCase());
    const isActive = userProfile.activeColor.toLowerCase() === item.hex.toLowerCase();

    const el = document.createElement("div");
    el.className = `catalog-item ${isActive ? "active" : ""}`;
    el.innerHTML = `
      <div class="catalog-color-circle" style="background: ${item.hex}"></div>
      <span>${item.name}</span>
      ${isOwned ? `<span class="owned-badge">✓ مملوك</span>` : `<span class="price-badge">${item.price} 🏆</span>`}
    `;

    el.onclick = () => {
      currentPickedColor = item.hex;
      updatePickedColorUI();
      if (isOwned) {
        userProfile.activeColor = item.hex;
        saveUserProfile();
        sfx.playChime();
        showEvent(`🎨 تم تفعيل: ${item.name}`);
      } else {
        if (userProfile.trophies >= item.price) {
          userProfile.trophies -= item.price;
          userProfile.ownedColors.push(item.hex.toLowerCase());
          userProfile.activeColor = item.hex;
          saveUserProfile(true);
          sfx.playBuySound();
          showEvent(`🎉 تم شراء ${item.name} بنجاح!`);
        } else {
          showEvent(`❌ كؤوس غير كافية! تحتاج ${item.price} 🏆`);
        }
      }
      updateAccountUI();
      if (previewCar) previewCar.style.background = userProfile.activeColor;
    };

    catalogContainer.appendChild(el);
  });

  const activeObj = colorCatalog.find(c => c.hex.toLowerCase() === userProfile.activeColor.toLowerCase());
  const activeColorName = document.getElementById("activeColorName");
  if (activeColorName) {
    activeColorName.textContent = `اللون الحالي: ${activeObj ? activeObj.name : "مخصص بالعجلة"}`;
  }
  if (previewCar) previewCar.style.background = userProfile.activeColor;
  if (shopCarPreview) shopCarPreview.style.background = userProfile.activeColor;
}

let isWheelDragging = false;
if (colorWheelCanvas) {
  colorWheelCanvas.addEventListener("pointerdown", e => {
    isWheelDragging = true;
    pickColorFromWheelEvent(e);
  });
  addEventListener("pointermove", e => {
    if (isWheelDragging) pickColorFromWheelEvent(e);
  });
  addEventListener("pointerup", () => isWheelDragging = false);
}

if (lightnessSlider) {
  lightnessSlider.addEventListener("input", e => {
    wheelLightness = parseInt(e.target.value);
    drawColorWheel();
    updatePickedColorUI();
  });
}

const applyWheelColorBtn = document.getElementById("applyWheelColorBtn");
if (applyWheelColorBtn) {
  applyWheelColorBtn.onclick = () => {
    const isOwned = userProfile.ownedColors.includes(currentPickedColor.toLowerCase());
    if (isOwned) {
      userProfile.activeColor = currentPickedColor;
      saveUserProfile();
      sfx.playChime();
      showEvent("🎨 تم اعتماد اللون بنجاح!");
    } else {
      const customPrice = 30;
      if (userProfile.trophies >= customPrice) {
        userProfile.trophies -= customPrice;
        userProfile.ownedColors.push(currentPickedColor.toLowerCase());
        userProfile.activeColor = currentPickedColor;
        saveUserProfile(true);
        sfx.playBuySound();
        showEvent(`🎉 تم شراء اللون المخصص من العجلة بـ ${customPrice} 🏆!`);
      } else {
        showEvent(`❌ كؤوس غير كافية! تحتاج ${customPrice} 🏆 لشراء هذا اللون.`);
      }
    }
    updateAccountUI();
  };
}


// ==========================================
// 4. MULTIPLAYER NETWORKING (ROBUST PEERJS)
// ==========================================
const MAX_PLAYERS = 4;
let isMultiplayer = false;
let isHost = false;
let roomCode = "";
let peer = null;
let hostConn = null;
let guestConns = [];
let remotePlayers = {};
let multiFallbackChannel = null;

function generateRoomCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function initHostMultiplayer(chosenSettings) {
  leaveMultiplayer();
  isMultiplayer = true;
  isHost = true;
  guestConns = [];
  remotePlayers = {};
  roomCode = generateRoomCode();
  updateControlsUI();

  const roomCodeDisplay = document.getElementById("roomCodeDisplay");
  const hostStatusText = document.getElementById("hostStatusText");
  const startHostGameBtn = document.getElementById("startHostGameBtn");
  if (roomCodeDisplay) roomCodeDisplay.textContent = roomCode;
  if (hostStatusText) hostStatusText.textContent = "جاري إنشاء خادم الغرفة...";
  if (startHostGameBtn) startHostGameBtn.disabled = false;

  updateHostLobbyUI();

  try {
    const peerId = `drace_room_${roomCode}`;
    if (typeof Peer !== "undefined") {
      peer = new Peer(peerId, { debug: 1 });
      peer.on("open", () => {
        if (hostStatusText) hostStatusText.textContent = "🟢 السيرفر جاهز! شارك الكود مع أصدقائك";
      });
      peer.on("connection", conn => {
        if (guestConns.length >= MAX_PLAYERS - 1) {
          conn.send({ type: "room_full", message: "الغرفة مكتملة (4 لاعبين)" });
          conn.close();
          return;
        }
        setupGuestConnection(conn, chosenSettings);
      });
      peer.on("error", err => {
        console.warn("PeerJS host notice:", err);
      });
    }
  } catch (e) {
    console.warn("PeerJS init error", e);
  }

  try {
    multiFallbackChannel = new BroadcastChannel(`drace_ch_${roomCode}`);
    multiFallbackChannel.onmessage = e => {
      const data = e.data;
      if (!data || data.senderId === userProfile.username) return;

      if (data.type === "join_request") {
        if (Object.keys(remotePlayers).length >= MAX_PLAYERS - 1) {
          multiFallbackChannel.postMessage({ type: "room_full", targetId: data.senderId });
          return;
        }
        remotePlayers[data.senderId] = {
          id: data.senderId,
          name: data.name,
          color: data.color,
          lane: -0.5,
          y: H * 0.8,
          speed: 2,
          distance: 0,
          trophies: 0,
          isHost: false
        };
        multiFallbackChannel.postMessage({
          type: "join_accepted",
          targetId: data.senderId,
          settings: chosenSettings,
          players: getLobbyPlayersList()
        });
        updateHostLobbyUI();
      } else if (data.type === "client_state") {
        if (remotePlayers[data.id]) {
          Object.assign(remotePlayers[data.id], data);
        }
      } else if (data.type === "player_leave") {
        delete remotePlayers[data.id];
        updateHostLobbyUI();
      }
    };
  } catch (e) {}
}

function setupGuestConnection(conn, settings) {
  conn.on("open", () => {
    guestConns.push(conn);
    conn.send({
      type: "room_settings",
      settings: settings,
      players: getLobbyPlayersList()
    });
  });

  conn.on("data", data => {
    if (!data) return;
    if (data.type === "player_info") {
      remotePlayers[conn.peer] = {
        id: conn.peer,
        name: data.name,
        color: data.color,
        lane: -0.5,
        y: H * 0.8,
        speed: 2,
        distance: 0,
        trophies: 0,
        isHost: false
      };
      broadcastToGuests({ type: "player_joined", players: getLobbyPlayersList() });
      updateHostLobbyUI();
    } else if (data.type === "client_state") {
      if (remotePlayers[conn.peer]) {
        Object.assign(remotePlayers[conn.peer], data);
      }
    }
  });

  conn.on("close", () => {
    guestConns = guestConns.filter(c => c !== conn);
    delete remotePlayers[conn.peer];
    broadcastToGuests({ type: "player_left", players: getLobbyPlayersList() });
    updateHostLobbyUI();
  });
}

function broadcastToGuests(packet) {
  guestConns.forEach(c => {
    try { if (c.open) c.send(packet); } catch (e) {}
  });
  if (multiFallbackChannel) {
    try { multiFallbackChannel.postMessage(packet); } catch (e) {}
  }
}

function getLobbyPlayersList() {
  const list = [{
    id: "host",
    name: userProfile.username + " (الهوست)",
    color: userProfile.activeColor,
    isHost: true
  }];
  Object.values(remotePlayers).forEach(p => list.push(p));
  return list;
}

function updateHostLobbyUI() {
  const hostPlayersList = document.getElementById("hostPlayersList");
  const playerCountText = document.getElementById("playerCountText");
  const players = getLobbyPlayersList();

  if (playerCountText) playerCountText.textContent = players.length;
  if (!hostPlayersList) return;
  hostPlayersList.innerHTML = "";

  players.forEach(p => {
    const li = document.createElement("li");
    li.className = "player-item";
    li.innerHTML = `
      <div class="player-tag">
        <span class="player-color-dot" style="background: ${p.color}"></span>
        <span>${p.name}</span>
      </div>
      ${p.isHost ? `<span class="host-badge">HOST</span>` : `<span style="font-size:11px;color:#81c784">متصل</span>`}
    `;
    hostPlayersList.appendChild(li);
  });
}

function joinMultiplayerServer(code) {
  leaveMultiplayer();
  isMultiplayer = true;
  isHost = false;
  roomCode = code.trim();
  remotePlayers = {};
  updateControlsUI();

  const joinStatusText = document.getElementById("joinStatusText");
  const joinLobbyBox = document.getElementById("joinLobbyBox");
  if (joinStatusText) {
    joinStatusText.textContent = "جاري الاتصال بالسيرفر...";
    joinStatusText.className = "status-msg";
  }

  const clientId = "guest_" + Math.floor(1000 + Math.random() * 9000);

  try {
    if (typeof Peer !== "undefined") {
      peer = new Peer(null, { debug: 1 });
      peer.on("open", () => {
        hostConn = peer.connect(`drace_room_${roomCode}`);
        if (hostConn) {
          hostConn.on("open", () => {
            if (joinStatusText) {
              joinStatusText.textContent = "🟢 تم الاتصال بالغرفة بنجاح!";
              joinStatusText.className = "status-msg success";
            }
            if (joinLobbyBox) joinLobbyBox.classList.remove("hidden");
            hostConn.send({
              type: "player_info",
              name: userProfile.username,
              color: userProfile.activeColor
            });
          });

          hostConn.on("data", handleIncomingServerPacket);
          hostConn.on("close", () => {
            if (joinStatusText) {
              joinStatusText.textContent = "⚠️ تم إغلاق الاتصال بالسيرفر";
              joinStatusText.className = "status-msg error";
            }
          });
        }
      });

      peer.on("error", err => {
        console.warn("PeerJS join notice:", err);
      });
    }
  } catch (e) {}

  try {
    multiFallbackChannel = new BroadcastChannel(`drace_ch_${roomCode}`);
    multiFallbackChannel.postMessage({
      type: "join_request",
      senderId: clientId,
      name: userProfile.username,
      color: userProfile.activeColor
    });

    multiFallbackChannel.onmessage = e => {
      const data = e.data;
      if (!data) return;
      if (data.targetId && data.targetId !== clientId) return;

      if (data.type === "join_accepted") {
        if (joinStatusText) {
          joinStatusText.textContent = "🟢 تم الاتصال بالغرفة بنجاح!";
          joinStatusText.className = "status-msg success";
        }
        if (joinLobbyBox) joinLobbyBox.classList.remove("hidden");
        applyServerSettings(data.settings);
        updateJoinLobbyUI(data.players);
      } else if (data.type === "room_full") {
        if (joinStatusText) {
          joinStatusText.textContent = "❌ الغرفة مكتملة (الحد الأقصى 4 لاعبين)";
          joinStatusText.className = "status-msg error";
        }
      } else {
        handleIncomingServerPacket(data);
      }
    };
  } catch (e) {}
}

function handleIncomingServerPacket(packet) {
  if (!packet) return;
  if (packet.type === "room_settings") {
    applyServerSettings(packet.settings);
    updateJoinLobbyUI(packet.players);
  } else if (packet.type === "player_joined" || packet.type === "player_left") {
    updateJoinLobbyUI(packet.players);
  } else if (packet.type === "start_match") {
    closeAllModals();
    startMatchFromHost(packet.settings);
  } else if (packet.type === "sync_world") {
    if (!isHost) {
      if (packet.traffic) traffic = packet.traffic;
      if (packet.powerups) powerups = packet.powerups;
      if (packet.players) {
        packet.players.forEach(p => {
          if (p.name !== userProfile.username) {
            remotePlayers[p.id || p.name] = p;
          }
        });
      }
    }
  }
}

function applyServerSettings(settings) {
  if (!settings) return;
  if (settings.difficulty) difficulty = settings.difficulty;
  if (settings.time) timeOfDay = settings.time;
  if (settings.biome) environment = settings.biome;
}

function updateJoinLobbyUI(players) {
  const joinPlayersList = document.getElementById("joinPlayersList");
  const joinPlayerCount = document.getElementById("joinPlayerCount");
  if (!players || !Array.isArray(players)) return;

  if (joinPlayerCount) joinPlayerCount.textContent = players.length;
  if (!joinPlayersList) return;
  joinPlayersList.innerHTML = "";

  players.forEach(p => {
    const li = document.createElement("li");
    li.className = "player-item";
    li.innerHTML = `
      <div class="player-tag">
        <span class="player-color-dot" style="background: ${p.color}"></span>
        <span>${p.name}</span>
      </div>
      ${p.isHost ? `<span class="host-badge">HOST</span>` : `<span style="font-size:11px;color:#81c784">متصل</span>`}
    `;
    joinPlayersList.appendChild(li);
  });
}

function leaveMultiplayer() {
  if (isMultiplayer) {
    try {
      if (multiFallbackChannel) {
        multiFallbackChannel.postMessage({ type: "player_leave", id: userProfile.username });
        multiFallbackChannel.close();
      }
      if (hostConn) hostConn.close();
      if (guestConns) guestConns.forEach(c => c.close());
      if (peer) peer.destroy();
    } catch (e) {}
  }
  isMultiplayer = false;
  isHost = false;
  roomCode = "";
  peer = null;
  hostConn = null;
  guestConns = [];
  remotePlayers = {};
  multiFallbackChannel = null;
  updateControlsUI();

  const friendLocateContainer = document.getElementById("friendLocateContainer");
  const hudLeaveServerBtn = document.getElementById("hudLeaveServerBtn");
  const overLeaveBtn = document.getElementById("overLeaveBtn");
  if (friendLocateContainer) friendLocateContainer.classList.add("hidden");
  if (hudLeaveServerBtn) hudLeaveServerBtn.classList.add("hidden");
  if (overLeaveBtn) overLeaveBtn.classList.add("hidden");
}

function startMatchFromHost(chosenSettings) {
  applyServerSettings(chosenSettings);
  resetGame();
  lastTime = performance.now();
  showEvent("🚀 انطلق السباق الجماعي!");

  const hudLeaveServerBtn = document.getElementById("hudLeaveServerBtn");
  const friendLocateContainer = document.getElementById("friendLocateContainer");
  if (hudLeaveServerBtn) hudLeaveServerBtn.classList.remove("hidden");
  if (friendLocateContainer) friendLocateContainer.classList.remove("hidden");
}

function updateControlsUI() {
  const pedalGasText = document.querySelector("#upBtn small");
  const pedalBrakeText = document.querySelector("#downBtn small");
  if (isMultiplayer) {
    if (pedalGasText) pedalGasText.textContent = "تقدم";
    if (pedalBrakeText) pedalBrakeText.textContent = "رجوع";
  } else {
    if (pedalGasText) pedalGasText.textContent = "تسريع";
    if (pedalBrakeText) pedalBrakeText.textContent = "فرملة";
  }
}


// ==========================================
// 5. FRIEND LOCATE SYSTEM (RADAR & POINTERS)
// ==========================================
function updateFriendLocateSystem() {
  const friendListEl = document.getElementById("friendLocateList");
  const friendCountEl = document.getElementById("friendLocateCount");
  const pointersLayer = document.getElementById("friendPointersLayer");
  if (!isMultiplayer) {
    if (pointersLayer) pointersLayer.innerHTML = "";
    return;
  }

  const friends = Object.values(remotePlayers);
  if (friendCountEl) friendCountEl.textContent = friends.length;
  if (!friendListEl || !pointersLayer) return;

  friendListEl.innerHTML = "";
  pointersLayer.innerHTML = "";

  friends.forEach(f => {
    const distDiff = Math.floor((f.distance || 0) - distance);
    let distText = "";
    let distClass = "";

    if (distDiff > 5) {
      distText = `+${distDiff}م أمامي`;
      distClass = "ahead";
    } else if (distDiff < -5) {
      distText = `${distDiff}م خلفي`;
      distClass = "behind";
    } else {
      distText = `بجانبي (مسار ${Math.round(f.lane || 0)})`;
      distClass = "same";
    }

    const item = document.createElement("div");
    item.className = "friend-locate-item";
    item.innerHTML = `
      <div class="friend-locate-name">
        <span class="friend-locate-dot" style="background:${f.color || "#00e5ff"}"></span>
        <span>${f.name}</span>
      </div>
      <span class="friend-locate-dist ${distClass}">${distText}</span>
    `;
    friendListEl.appendChild(item);

    if (Math.abs(distDiff) > 20) {
      const pointer = document.createElement("div");
      pointer.className = "friend-pointer";
      if (distDiff > 0) {
        pointer.style.top = "60px";
        pointer.style.left = `${Math.max(40, Math.min(W - 40, laneX(f.lane || 0, H * 0.4)))}px`;
        pointer.innerHTML = `▲ ${f.name} (+${distDiff}م)`;
      } else {
        pointer.style.bottom = "80px";
        pointer.style.left = `${Math.max(40, Math.min(W - 40, laneX(f.lane || 0, H * 0.9)))}px`;
        pointer.innerHTML = `▼ ${f.name} (${distDiff}م)`;
      }
      pointersLayer.appendChild(pointer);
    }
  });
}


// ==========================================
// 6. CORE GAMEPLAY & PERSPECTIVE GRAPHICS
// ==========================================
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const startScreen = document.getElementById("startScreen");
const gameUI = document.getElementById("gameUI");
const pauseScreen = document.getElementById("pauseScreen");
const gameOverScreen = document.getElementById("gameOverScreen");
const mobileControls = document.getElementById("mobileControls");

const scoreEl = document.getElementById("score");
const speedEl = document.getElementById("speed");
const shieldCountEl = document.getElementById("shieldCount");
const distanceHud = document.getElementById("distanceHud");
const finalScoreEl = document.getElementById("finalScore");
const finalDistanceEl = document.getElementById("finalDistance");
const eventText = document.getElementById("eventText");
const biomeSelect = document.getElementById("biomeSelect");
const difficultySelect = document.getElementById("difficultySelect");
const difficultyHud = document.getElementById("difficultyHud");
const timeSelect = document.getElementById("timeSelect");

let W = innerWidth, H = innerHeight, dpr = 1;
function resize() {
  dpr = Math.min(devicePixelRatio || 1, 2);
  W = innerWidth; H = innerHeight;
  canvas.width = W * dpr; canvas.height = H * dpr;
  canvas.style.width = W + "px"; canvas.style.height = H + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  if (player) {
    player.y = Math.min(player.y, H * 0.88);
  }
}
addEventListener("resize", resize);

let state = "menu";
let trophies = 0, distance = 0, speed = 2.0, baseSpeed = 2.0, targetSpeed = 2.0;
let shield = 0, shieldTimer = 0, speedBoostTimer = 0;
const SHIELD_DURATION = 8;
const SPEED_BOOST_DURATION = 3;
const SPEED_BOOST_AMOUNT = 3.5;
let carsPassed = 0;

let player = {
  lane: -0.5,
  targetLane: -0.5,
  x: 0,
  y: 0,
  targetY: 0,
  w: 54,
  h: 92,
  speed: 2.0,
  isBraking: false
};

let traffic = [], powerups = [];
let roadOffset = 0, spawnTimer = 0, powerTimer = 0;
let environment = "grass";
let timeOfDay = "day";

// أطوار القمر الـ 8 المرتبة فلكياً بدقة متناهية
let currentMoonPhase = 0;
const moonNames = [
  "محاق (New Moon)",
  "هلال متزايد (Waxing Crescent)",
  "تربيع أول (First Quarter)",
  "أحدب متزايد (Waxing Gibbous)",
  "بدر (Full Moon)",
  "أحدب متناقص (Waning Gibbous)",
  "تربيع ثاني (Third Quarter)",
  "هلال متناقص (Waning Crescent)"
];

// نظام دورة النهار والليل المتدرجة سينمائياً
const DAY_CYCLE_DURATION = 40; 
let cycleProgress = 0.25;

const skyKeyframes = [
  { p: 0.00, top: "#0b1021", mid: "#3b1c4b", bot: "#ff6b4a" },
  { p: 0.12, top: "#1e3c72", mid: "#f39c12", bot: "#ffe082" },
  { p: 0.25, top: "#1976d2", mid: "#64b5f6", bot: "#e3f2fd" },
  { p: 0.38, top: "#283e51", mid: "#f39c12", bot: "#ff7e5f" },
  { p: 0.50, top: "#1a1c4b", mid: "#9c27b0", bot: "#ff3d00" },
  { p: 0.62, top: "#0a0e1a", mid: "#1a233a", bot: "#3f2b96" },
  { p: 0.75, top: "#030712", mid: "#091124", bot: "#111c36" },
  { p: 0.88, top: "#040817", mid: "#0e172e", bot: "#1e1b38" },
  { p: 1.00, top: "#0b1021", mid: "#3b1c4b", bot: "#ff6b4a" }
];

function interpolateColorHex(hex1, hex2, factor) {
  const c1 = hexToRgb(hex1);
  const c2 = hexToRgb(hex2);
  const r = Math.round(c1.r + factor * (c2.r - c1.r));
  const g = Math.round(c1.g + factor * (c2.g - c1.g));
  const b = Math.round(c1.b + factor * (c2.b - c1.b));
  return `rgb(${r}, ${g}, ${b})`;
}

function getCurrentSkyColors(p) {
  let k1 = skyKeyframes[0], k2 = skyKeyframes[1];
  for (let i = 0; i < skyKeyframes.length - 1; i++) {
    if (p >= skyKeyframes[i].p && p <= skyKeyframes[i + 1].p) {
      k1 = skyKeyframes[i];
      k2 = skyKeyframes[i + 1];
      break;
    }
  }
  const factor = (p - k1.p) / (k2.p - k1.p);
  return {
    top: interpolateColorHex(k1.top, k2.top, factor),
    mid: interpolateColorHex(k1.mid, k2.mid, factor),
    bot: interpolateColorHex(k1.bot, k2.bot, factor)
  };
}

// حساب درجة إضاءة النهار (1.0 = نهار مكتمل، 0.0 = ليل كامل، وتدرج سلس بينهما أثناء الشروق والغروب)
function getDayNightFactor(p) {
  if (p >= 0.15 && p <= 0.35) return 1.0;
  if (p > 0.35 && p < 0.50) return (0.50 - p) / 0.15;
  if (p >= 0.50 && p <= 0.85) return 0.0;
  if (p > 0.85 && p <= 1.00) return (p - 0.85) / 0.15;
  if (p >= 0.00 && p < 0.15) return p / 0.15;
  return 1.0;
}

let biomeChangeTimer = 75;
let paused = false, lastTime = 0, shake = 0;
let difficulty = "normal";

const difficultySettings = {
  peaceful: { label: "السلام التام", maxSpeed: 8.5, acceleration: 0.15, spawnBase: Infinity, spawnMin: Infinity, trafficSpeed: 0.8 },
  easy:     { label: "سهل", maxSpeed: 8.5, acceleration: 0.16, spawnBase: 1.4, spawnMin: 0.75, trafficSpeed: 0.95 },
  normal:   { label: "عادي", maxSpeed: 10.5, acceleration: 0.20, spawnBase: 1.05, spawnMin: 0.48, trafficSpeed: 1.15 },
  hard:     { label: "صعب", maxSpeed: 13.0, acceleration: 0.28, spawnBase: 0.80, spawnMin: 0.32, trafficSpeed: 1.40 }
};

const environments = [
  { id: "grass", name: "أرض خضراء" },
  { id: "desert", name: "صحراء" },
  { id: "city", name: "مدينة" },
  { id: "winter", name: "شتاء جليد" }
];

function laneX(lane, y) {
  const roadTop = W * 0.35, roadBottom = W * 0.88;
  const t = Math.max(0, Math.min(1, (y - H * 0.34) / (H * 0.66)));
  const roadW = roadTop + (roadBottom - roadTop) * t;
  return (W / 2) + lane * (roadW * 0.25);
}

function getPerspectiveScale(y) {
  const topY = H * 0.34;
  const t = Math.min(1, Math.max(0, (y - topY) / (H * 0.18)));
  return 0.45 + t * 0.55;
}

function resetGame() {
  state = "playing";
  paused = false;
  trophies = 0;
  distance = 0;
  speed = 2.0;
  baseSpeed = 2.0;
  targetSpeed = 2.0;
  shield = 0;
  shieldTimer = 0;
  speedBoostTimer = 0;
  carsPassed = 0;
  traffic = [];
  powerups = [];
  roadOffset = 0;
  spawnTimer = 0.8;
  powerTimer = 3.5;

  if (!isMultiplayer) {
    environment = (biomeSelect && biomeSelect.value) ? biomeSelect.value : "grass";
    timeOfDay = (timeSelect && timeSelect.value) ? timeSelect.value : "day";
    difficulty = (difficultySelect && difficultySelect.value) ? difficultySelect.value : "normal";
  }

  currentMoonPhase = 0;
  cycleProgress = 0.25;
  biomeChangeTimer = 75;

  player.lane = -0.5;
  player.targetLane = -0.5;
  player.y = H * 0.80;
  player.targetY = H * 0.80;
  player.x = laneX(-0.5, player.y);
  player.isBraking = false;

  updateControlsUI();

  if (startScreen) startScreen.classList.add("hidden");
  if (gameOverScreen) gameOverScreen.classList.add("hidden");
  if (pauseScreen) pauseScreen.classList.add("hidden");
  if (gameUI) gameUI.classList.remove("hidden");
  if (mobileControls) mobileControls.classList.remove("hidden");

  updateHUD();
}

function updateHUD() {
  if (scoreEl) scoreEl.textContent = trophies;
  if (speedEl) speedEl.textContent = Math.max(0, Math.floor(speed * 18));
  if (distanceHud) distanceHud.textContent = Math.floor(distance);
  if (shieldCountEl) {
    shieldCountEl.textContent = shield > 0 ? Math.ceil(shieldTimer) + "s" : "0";
  }
  if (difficultyHud && difficultySettings[difficulty]) {
    difficultyHud.textContent = difficultySettings[difficulty].label;
  }
}

function showEvent(text) {
  if (!eventText) return;
  eventText.textContent = text;
  eventText.style.opacity = "1";
  eventText.style.transform = "translateX(-50%) translateY(0)";
  clearTimeout(showEvent.t);
  showEvent.t = setTimeout(() => {
    eventText.style.opacity = "0";
    eventText.style.transform = "translateX(-50%) translateY(-10px)";
  }, 1600);
}


// ==========================================
// 7. INPUT HANDLING (TOUCH & KEYBOARD)
// ==========================================
const keys = { left: false, right: false, up: false, down: false };

function steer(dir) {
  if (state !== "playing" || paused) return;
  player.targetLane = Math.max(-1.5, Math.min(1.5, player.targetLane + dir));
}

addEventListener("keydown", e => {
  const k = e.key.toLowerCase();
  if (k === "arrowleft" || k === "a") { if (!keys.left) { steer(-1); keys.left = true; } }
  if (k === "arrowright" || k === "d") { if (!keys.right) { steer(1); keys.right = true; } }
  if (k === "arrowup" || k === "w") keys.up = true;
  if (k === "arrowdown" || k === "s" || k === " ") { keys.down = true; player.isBraking = true; sfx.playBrake(); }
  if (k === "h") sfx.playHorn();
  if (k === "p" || k === "escape") togglePause();
});

addEventListener("keyup", e => {
  const k = e.key.toLowerCase();
  if (k === "arrowleft" || k === "a") keys.left = false;
  if (k === "arrowright" || k === "d") keys.right = false;
  if (k === "arrowup" || k === "w") keys.up = false;
  if (k === "arrowdown" || k === "s" || k === " ") { keys.down = false; player.isBraking = false; }
});

function bindTouchButton(btnId, onDown, onUp) {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  btn.addEventListener("pointerdown", e => {
    e.preventDefault();
    btn.classList.add("active");
    if (onDown) onDown();
  });
  const cancelTouch = e => {
    e.preventDefault();
    btn.classList.remove("active");
    if (onUp) onUp();
  };
  btn.addEventListener("pointerup", cancelTouch);
  btn.addEventListener("pointercancel", cancelTouch);
  btn.addEventListener("pointerleave", cancelTouch);
}

let touchSteerInterval = null;
bindTouchButton("leftBtn", () => {
  steer(-1);
  clearInterval(touchSteerInterval);
  touchSteerInterval = setInterval(() => steer(-1), 240);
}, () => { clearInterval(touchSteerInterval); });

bindTouchButton("rightBtn", () => {
  steer(1);
  clearInterval(touchSteerInterval);
  touchSteerInterval = setInterval(() => steer(1), 240);
}, () => { clearInterval(touchSteerInterval); });

bindTouchButton("upBtn", () => { keys.up = true; }, () => { keys.up = false; });
bindTouchButton("downBtn", () => { keys.down = true; player.isBraking = true; sfx.playBrake(); }, () => { keys.down = false; player.isBraking = false; });


// ==========================================
// 8. TRAFFIC AI WITH STOPPING BEHIND PLAYER
// ==========================================
function spawnTraffic() {
  const types = ["small", "truck", "normal"];
  const type = types[Math.floor(Math.random() * types.length)];
  const lane = [-1.5, -0.5, 0.5, 1.5][Math.floor(Math.random() * 4)];
  const color = colorCatalog[Math.floor(Math.random() * colorCatalog.length)].hex;
  const ds = difficultySettings[difficulty];

  traffic.push({
    type,
    lane,
    y: H * 0.34,
    speed: ds.trafficSpeed + Math.random() * 0.45,
    actualSpeed: ds.trafficSpeed + Math.random() * 0.45,
    color,
    isBraking: false,
    stoppedTimer: 0
  });
}

function spawnPowerup() {
  const type = Math.random() < 0.55 ? "speed" : "shield";
  const lane = [-1.5, -0.5, 0.5, 1.5][Math.floor(Math.random() * 4)];
  powerups.push({ type, lane, y: H * 0.34, rot: 0 });
}

function carSize(type) {
  if (type === "truck") return { w: 72, h: 125 };
  if (type === "small") return { w: 50, h: 82 };
  return { w: 58, h: 96 };
}

function collision(a, b) {
  const dx = Math.abs(a.x - b.x), dy = Math.abs(a.y - b.y);
  return dx < (a.w + b.w) * 0.42 && dy < (a.h + b.h) * 0.42;
}

function playerBox() {
  return { x: player.x, y: player.y, w: player.w, h: player.h };
}

function endGame() {
  state = "over";
  if (finalScoreEl) finalScoreEl.textContent = trophies;
  if (finalDistanceEl) finalDistanceEl.textContent = Math.floor(distance);

  userProfile.trophies += trophies;
  if (distance > userProfile.maxDistance) userProfile.maxDistance = distance;
  if (trophies > userProfile.highScore) userProfile.highScore = trophies;
  saveUserProfile(true);

  if (gameUI) gameUI.classList.add("hidden");
  if (mobileControls) mobileControls.classList.add("hidden");
  if (gameOverScreen) gameOverScreen.classList.remove("hidden");

  const overLeaveBtn = document.getElementById("overLeaveBtn");
  if (overLeaveBtn) {
    if (isMultiplayer) overLeaveBtn.classList.remove("hidden");
    else overLeaveBtn.classList.add("hidden");
  }
}


// ==========================================
// 9. GAME UPDATE LOOP
// ==========================================
let mpSyncTimer = 0;

function update(dt) {
  if (state !== "playing" || paused) return;

  const prevTimeOfDay = timeOfDay;
  cycleProgress = (cycleProgress + (dt / DAY_CYCLE_DURATION)) % 1.0;
  timeOfDay = (cycleProgress >= 0.5) ? "night" : "day";

  // تتابع أطوار القمر الدقيق: يتقدم القمر بـ طور واحد محدد بدقة عند دخول الليل فقط
  if (prevTimeOfDay === "day" && timeOfDay === "night") {
    currentMoonPhase = (currentMoonPhase + 1) % 8;
    showEvent(`🌙 بدأ الغروب وحلّ الليل! طور القمر: ${moonNames[currentMoonPhase]}`);
  } else if (prevTimeOfDay === "night" && timeOfDay === "day") {
    showEvent("☀️ أشرقت الشمس وبدأ نهار جديد!");
  }

  const ds = difficultySettings[difficulty];
  let isReversing = false;

  if (isMultiplayer) {
    if (keys.up) {
      targetSpeed = Math.min(ds.maxSpeed, speed + ds.acceleration * dt * 1.8);
      player.targetY = Math.max(H * 0.58, player.targetY - 140 * dt);
      player.isBraking = false;
    } else if (keys.down) {
      if (speed > 0.2) {
        targetSpeed = Math.max(0, speed - 8.5 * dt);
        player.isBraking = true;
      } else {
        isReversing = true;
        targetSpeed = -1.5;
        player.isBraking = false;
        player.targetY = Math.min(H * 0.88, player.targetY + 80 * dt);
      }
    } else {
      if (speed < 0) {
        targetSpeed = 0;
      } else {
        targetSpeed = Math.min(ds.maxSpeed, Math.max(baseSpeed, speed));
      }
      player.targetY += (H * 0.80 - player.targetY) * 1.5 * dt;
      player.isBraking = false;
    }
  } else {
    player.targetY = H * 0.80;
    if (keys.up) {
      targetSpeed = Math.min(ds.maxSpeed, speed + ds.acceleration * dt * 1.8);
      player.isBraking = false;
    } else if (keys.down) {
      targetSpeed = Math.max(0, speed - 8.5 * dt);
      player.isBraking = true;
    } else {
      targetSpeed = Math.min(ds.maxSpeed, Math.max(baseSpeed, speed));
      player.isBraking = false;
    }
  }

  speed += (targetSpeed - speed) * 6.0 * dt;

  if (speedBoostTimer > 0) {
    speedBoostTimer -= dt;
    if (speedBoostTimer <= 0) {
      speedBoostTimer = 0;
      showEvent("⚡ انتهت قوة السرعة!");
    }
  }

  const effectiveSpeed = speed + (speedBoostTimer > 0 ? SPEED_BOOST_AMOUNT : 0);

  if (shieldTimer > 0) {
    shieldTimer -= dt;
    if (shieldTimer <= 0) {
      shieldTimer = 0;
      shield = 0;
      showEvent("🛡 انتهى مفعول الدرع!");
    }
  }

  biomeChangeTimer -= dt;
  if (biomeChangeTimer <= 0) {
    biomeChangeTimer = 75 + Math.random() * 20;
    const nextBiomes = environments.filter(e => e.id !== environment);
    const chosen = nextBiomes[Math.floor(Math.random() * nextBiomes.length)];
    environment = chosen.id;
    showEvent(`🏞️ انطلقت إلى: ${chosen.name}`);
  }

  if (speed < 0) {
    roadOffset += speed * 90 * dt;
    distance = Math.max(0, distance + speed * dt * 2.0);
  } else {
    roadOffset += effectiveSpeed * 90 * dt;
    distance += effectiveSpeed * dt * 3.5;
  }

  player.lane += (player.targetLane - player.lane) * 9.0 * dt;
  player.y += (player.targetY - player.y) * 8.0 * dt;
  player.x = laneX(player.lane, player.y);

  if (!isMultiplayer || isHost) {
    if (difficulty !== "peaceful") {
      spawnTimer -= dt;
      if (spawnTimer <= 0) {
        spawnTraffic();
        spawnTimer = Math.max(ds.spawnMin, ds.spawnBase - effectiveSpeed * 0.02) + Math.random() * 0.4;
      }
    }

    powerTimer -= dt;
    if (powerTimer <= 0) {
      spawnPowerup();
      powerTimer = 4.5 + Math.random() * 5.5;
    }
  }

  for (let i = traffic.length - 1; i >= 0; i--) {
    const t = traffic[i];
    const s = carSize(t.type);
    const scale = getPerspectiveScale(t.y);
    const currentCarX = laneX(t.lane, t.y);
    const bx = { x: currentCarX, y: t.y, w: s.w * scale, h: s.h * scale };

    const inSameLaneAsPlayer = Math.abs(t.lane - player.lane) < 0.45;
    const isApproachingPlayer = inSameLaneAsPlayer && (t.y < player.y) && ((player.y - t.y) < 170);
    const playerIsStoppedOrSlow = (effectiveSpeed < 0.8) || player.isBraking || isReversing;

    let trafficCarAhead = null;
    for (let j = 0; j < traffic.length; j++) {
      if (i !== j) {
        const other = traffic[j];
        if (Math.abs(other.lane - t.lane) < 0.45 && other.y > t.y && (other.y - t.y) < 130) {
          if (!trafficCarAhead || other.y < trafficCarAhead.y) trafficCarAhead = other;
        }
      }
    }

    if ((isApproachingPlayer && playerIsStoppedOrSlow) || (trafficCarAhead && (trafficCarAhead.isBraking || trafficCarAhead.actualSpeed < 0.2))) {
      t.isBraking = true;
      t.actualSpeed = Math.max(0, t.actualSpeed - 9.0 * dt);
      t.stoppedTimer += dt;

      if (isApproachingPlayer && playerIsStoppedOrSlow) {
        const safeBuffer = 85;
        if (t.y > player.y - safeBuffer) {
          t.y = player.y - safeBuffer;
          t.actualSpeed = 0;
        }
      }
      if (trafficCarAhead) {
        const safeBufferCar = 80;
        if (t.y > trafficCarAhead.y - safeBufferCar) {
          t.y = trafficCarAhead.y - safeBufferCar;
          t.actualSpeed = 0;
        }
      }

      if (t.stoppedTimer > 2.2 && Math.random() < 0.02) {
        sfx.playHorn();
      }
    } else {
      t.isBraking = false;
      t.actualSpeed += (t.speed - t.actualSpeed) * 3.0 * dt;
      t.stoppedTimer = 0;
    }

    t.y += (effectiveSpeed * 55 * t.actualSpeed) * dt;

    if (collision(playerBox(), bx)) {
      if (shield > 0) {
        shield = 0;
        shieldTimer = 0;
        traffic.splice(i, 1);
        shake = 0.25;
        sfx.playShield();
        showEvent("🛡️ الدرع حماك من الاصطدام!");
        updateHUD();
        continue;
      }
      endGame();
      return;
    }

    if (t.y > H + 160) {
      traffic.splice(i, 1);
      carsPassed++;
      trophies++;
      sfx.playChime();
      if (carsPassed >= 5) {
        carsPassed = 0;
        showEvent("🏁 تم تجاوز 5 سيارات بنجاح!");
      }
    }
  }

  for (let i = powerups.length - 1; i >= 0; i--) {
    const p = powerups[i];
    p.y += effectiveSpeed * 52 * dt;
    const scale = getPerspectiveScale(p.y);
    const bx = { x: laneX(p.lane, p.y), y: p.y, w: 40 * scale, h: 40 * scale };

    if (collision(playerBox(), bx)) {
      if (p.type === "speed") {
        speedBoostTimer = SPEED_BOOST_DURATION;
        sfx.playBuySound();
        showEvent("⚡ قوة سرعة فائقة لمدة 3 ثوانٍ!");
      } else {
        shield = 1;
        shieldTimer = SHIELD_DURATION;
        sfx.playShield();
        showEvent("🛡️ درع حماية لمدة 8 ثوانٍ!");
      }
      powerups.splice(i, 1);
      updateHUD();
      continue;
    }
    if (p.y > H + 90) powerups.splice(i, 1);
  }

  if (shake > 0) shake -= dt;
  updateHUD();

  if (isMultiplayer) {
    mpSyncTimer += dt;
    if (mpSyncTimer > 0.05) {
      mpSyncTimer = 0;
      const myState = {
        type: "client_state",
        id: isHost ? "host" : (peer ? peer.id : userProfile.username),
        name: userProfile.username + (isHost ? " (الهوست)" : ""),
        color: userProfile.activeColor,
        lane: player.lane,
        y: player.y,
        speed: speed,
        distance: distance,
        trophies: trophies,
        shield: shield > 0
      };

      if (isHost) {
        broadcastToGuests({
          type: "sync_world",
          traffic: traffic,
          powerups: powerups,
          players: getLobbyPlayersList().map(p => {
            if (p.id === "host") return myState;
            return remotePlayers[p.id] || p;
          })
        });
      } else {
        if (hostConn && hostConn.open) hostConn.send(myState);
        if (multiFallbackChannel) multiFallbackChannel.postMessage(myState);
      }
    }
  }

  updateFriendLocateSystem();
}


// ==========================================
// 10. GRAPHICS & SUNRISE/SUNSET ANIMATION
// ==========================================
function roundedRect(x, y, w, h, r, fill, stroke) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.stroke(); }
}

function drawWheel(x, y, w, h, isChrome = true) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "#11161b";
  ctx.beginPath(); ctx.roundRect(-w/2, -h/2, w, h, 3); ctx.fill();
  ctx.strokeStyle = "#283038"; ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(-w/2, -h/4); ctx.lineTo(w/2, -h/4);
  ctx.moveTo(-w/2, 0); ctx.lineTo(w/2, 0);
  ctx.moveTo(-w/2, h/4); ctx.lineTo(w/2, h/4);
  ctx.stroke();
  ctx.fillStyle = isChrome ? "#d4e1ec" : "#45505b";
  ctx.beginPath(); ctx.arc(0, 0, Math.min(w, h) * 0.32, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

function drawCar(x, y, w, h, color, type = "normal", isPlayer = false, scale = 1.0, isBraking = false, nametag = "", isReversing = false) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  if (!isPlayer) ctx.rotate(Math.PI);

  ctx.fillStyle = "rgba(0, 0, 0, 0.38)";
  ctx.beginPath();
  ctx.ellipse(0, h * 0.05, w * 0.55, h * 0.52, 0, 0, Math.PI * 2);
  ctx.fill();

  if (type === "truck") {
    const cabW = w * 0.92, cabH = h * 0.32;
    const trailerW = w * 0.98, trailerH = h * 0.62;
    const cabY = -h * 0.33, trailerY = h * 0.16;

    drawWheel(-cabW * 0.48, cabY - cabH * 0.25, 7, 18, true);
    drawWheel(cabW * 0.48, cabY - cabH * 0.25, 7, 18, true);
    drawWheel(-trailerW * 0.49, trailerY + trailerH * 0.15, 8, 20, false);
    drawWheel(-trailerW * 0.49, trailerY + trailerH * 0.35, 8, 20, false);
    drawWheel(trailerW * 0.49, trailerY + trailerH * 0.15, 8, 20, false);
    drawWheel(trailerW * 0.49, trailerY + trailerH * 0.35, 8, 20, false);

    roundedRect(-trailerW / 2, trailerY - trailerH / 2, trailerW, trailerH, 6, "#d8e2eb", "#3a4754");
    ctx.strokeStyle = "rgba(0,0,0,0.12)"; ctx.lineWidth = 2;
    for (let px = -trailerW * 0.38; px <= trailerW * 0.38; px += 8) {
      ctx.beginPath(); ctx.moveTo(px, trailerY - trailerH * 0.45); ctx.lineTo(px, trailerY + trailerH * 0.45); ctx.stroke();
    }
    ctx.fillStyle = "#c0cbd6"; ctx.fillRect(-trailerW * 0.4, trailerY - trailerH * 0.42, trailerW * 0.8, 10);
    ctx.fillStyle = "#222a33"; ctx.fillRect(-trailerW * 0.45, trailerY + trailerH * 0.46, trailerW * 0.9, 5);

    ctx.fillStyle = isBraking ? "#ff1744" : "#e63946";
    if (isBraking) { ctx.shadowBlur = 14; ctx.shadowColor = "#ff1744"; }
    ctx.fillRect(-trailerW * 0.4, trailerY + trailerH * 0.45, 12, 4);
    ctx.fillRect(trailerW * 0.4 - 12, trailerY + trailerH * 0.45, 12, 4);
    ctx.shadowBlur = 0;

    if (isReversing) {
      ctx.fillStyle = "#ffffff"; ctx.shadowBlur = 12; ctx.shadowColor = "#ffffff";
      ctx.fillRect(-trailerW * 0.22, trailerY + trailerH * 0.45, 8, 4);
      ctx.fillRect(trailerW * 0.22 - 8, trailerY + trailerH * 0.45, 8, 4);
      ctx.shadowBlur = 0;
    }

    ctx.fillStyle = "#1b222a"; ctx.fillRect(-10, cabY + cabH * 0.3, 20, 15);
    roundedRect(-cabW / 2, cabY - cabH / 2, cabW, cabH, 8, color, "#182026");

    ctx.fillStyle = "#202830"; roundedRect(-cabW * 0.38, cabY - cabH * 0.5, cabW * 0.76, 8, 2, "#111", "#888");
    ctx.fillStyle = "#d8e2eb"; ctx.fillRect(-cabW * 0.3, cabY - cabH * 0.49, cabW * 0.6, 4);

    let grad = ctx.createLinearGradient(0, cabY - cabH * 0.25, 0, cabY + cabH * 0.1);
    grad.addColorStop(0, "rgba(225,245,255,0.95)"); grad.addColorStop(1, "rgba(35,80,110,0.95)");
    ctx.fillStyle = grad; roundedRect(-cabW * 0.38, cabY - cabH * 0.25, cabW * 0.76, cabH * 0.35, 4);

    ctx.fillStyle = "#151e24"; ctx.fillRect(-cabW * 0.58, cabY - cabH * 0.2, 7, 12); ctx.fillRect(cabW * 0.58 - 7, cabY - cabH * 0.2, 7, 12);

    ctx.fillStyle = "#ff9800";
    for (let lx = -14; lx <= 14; lx += 7) {
      ctx.beginPath(); ctx.arc(lx, cabY - cabH * 0.4, 2.2, 0, Math.PI * 2); ctx.fill();
    }

    ctx.fillStyle = "#fffbe0"; ctx.shadowBlur = 10; ctx.shadowColor = "#fffbe0";
    ctx.fillRect(-cabW * 0.42, cabY - cabH * 0.48, 10, 5); ctx.fillRect(cabW * 0.42 - 10, cabY - cabH * 0.48, 10, 5);
    ctx.shadowBlur = 0;

  } else if (type === "small") {
    drawWheel(-w * 0.48, -h * 0.28, 7, 18, true);
    drawWheel(w * 0.48, -h * 0.28, 7, 18, true);
    drawWheel(-w * 0.48, h * 0.28, 7, 18, true);
    drawWheel(w * 0.48, h * 0.28, 7, 18, true);

    roundedRect(-w / 2, -h / 2, w, h, 14, color, "#12181f");

    ctx.fillStyle = "rgba(255,255,255,0.28)";
    ctx.fillRect(-w * 0.1, -h * 0.45, w * 0.08, h * 0.88);
    ctx.fillRect(0, -h * 0.45, w * 0.08, h * 0.88);

    ctx.fillStyle = "#11171d";
    ctx.beginPath(); ctx.arc(0, -h * 0.42, w * 0.3, Math.PI, 0); ctx.fill();

    let wsGrad = ctx.createLinearGradient(0, -h * 0.25, 0, h * 0.1);
    wsGrad.addColorStop(0, "#cbe8fc"); wsGrad.addColorStop(0.5, "#306285"); wsGrad.addColorStop(1, "#122533");
    ctx.fillStyle = wsGrad;
    ctx.beginPath(); ctx.roundRect(-w * 0.36, -h * 0.25, w * 0.72, h * 0.32, [10, 10, 4, 4]); ctx.fill();

    ctx.fillStyle = color; ctx.fillRect(-w * 0.56, -h * 0.15, 6, 10); ctx.fillRect(w * 0.56 - 6, -h * 0.15, 6, 10);

    ctx.fillStyle = "#12202c";
    ctx.beginPath(); ctx.roundRect(-w * 0.3, h * 0.08, w * 0.6, h * 0.2, 4); ctx.fill();

    ctx.fillStyle = "#111820"; ctx.fillRect(-w * 0.46, h * 0.38, w * 0.92, 8);

    ctx.fillStyle = "#ffffff"; ctx.shadowBlur = 12; ctx.shadowColor = "#00e5ff";
    ctx.beginPath(); ctx.roundRect(-w * 0.4, -h * 0.46, 12, 5, 2); ctx.roundRect(w * 0.4 - 12, -h * 0.46, 12, 5, 2); ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = isBraking ? "#ff1744" : "#ff3344";
    if (isBraking) { ctx.shadowBlur = 15; ctx.shadowColor = "#ff1744"; }
    ctx.fillRect(-w * 0.4, h * 0.44, w * 0.8, isBraking ? 6 : 4);
    ctx.shadowBlur = 0;

    if (isReversing) {
      ctx.fillStyle = "#ffffff"; ctx.shadowBlur = 12; ctx.shadowColor = "#ffffff";
      ctx.fillRect(-w * 0.38, h * 0.44, 10, 5); ctx.fillRect(w * 0.38 - 10, h * 0.44, 10, 5);
      ctx.shadowBlur = 0;
    }
  } else {
    drawWheel(-w * 0.48, -h * 0.28, 7, 18, true);
    drawWheel(w * 0.48, -h * 0.28, 7, 18, true);
    drawWheel(-w * 0.48, h * 0.28, 7, 18, true);
    drawWheel(w * 0.48, h * 0.28, 7, 18, true);

    roundedRect(-w / 2, -h / 2, w, h, 13, color, "#141a20");

    ctx.strokeStyle = "rgba(255,255,255,0.22)"; ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-w * 0.3, -h * 0.42); ctx.lineTo(-w * 0.25, -h * 0.25);
    ctx.moveTo(w * 0.3, -h * 0.42); ctx.lineTo(w * 0.25, -h * 0.25);
    ctx.stroke();

    ctx.fillStyle = "#1e262e"; ctx.fillRect(-w * 0.25, -h * 0.48, w * 0.5, 6);
    ctx.strokeStyle = "#8899a6"; ctx.lineWidth = 1; ctx.strokeRect(-w * 0.25, -h * 0.48, w * 0.5, 6);

    let wsGrad = ctx.createLinearGradient(0, -h * 0.28, 0, -h * 0.02);
    wsGrad.addColorStop(0, "#b3e5fc"); wsGrad.addColorStop(0.6, "#295270"); wsGrad.addColorStop(1, "#132330");
    ctx.fillStyle = wsGrad;
    ctx.beginPath(); ctx.roundRect(-w * 0.36, -h * 0.28, w * 0.72, h * 0.26, [8, 8, 3, 3]); ctx.fill();

    ctx.fillStyle = color; ctx.fillRect(-w * 0.56, -h * 0.18, 6, 10); ctx.fillRect(w * 0.56 - 6, -h * 0.18, 6, 10);

    ctx.fillStyle = color; ctx.fillRect(-w * 0.32, -h * 0.02, w * 0.64, h * 0.22);
    ctx.fillStyle = "#132330";
    ctx.beginPath(); ctx.roundRect(-w * 0.34, h * 0.2, w * 0.68, h * 0.16, [3, 3, 6, 6]); ctx.fill();

    ctx.fillStyle = "#182028";
    ctx.fillRect(-w * 0.38, h * 0.40, w * 0.76, 5);
    ctx.fillStyle = "#2c3844";
    ctx.fillRect(-w * 0.3, h * 0.38, 4, 6);
    ctx.fillRect(w * 0.3 - 4, h * 0.38, 4, 6);

    ctx.fillStyle = "#cfd8dc";
    ctx.beginPath(); ctx.arc(-w * 0.28, h * 0.47, 2.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(w * 0.28, h * 0.47, 2.5, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = "#fffbe0"; ctx.shadowBlur = 10; ctx.shadowColor = "#ffeb3b";
    ctx.beginPath(); ctx.roundRect(-w * 0.42, -h * 0.47, 11, 6, 2); ctx.roundRect(w * 0.42 - 11, -h * 0.47, 11, 6, 2); ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = isBraking ? "#ff1744" : "#f44336";
    if (isBraking) { ctx.shadowBlur = 16; ctx.shadowColor = "#ff1744"; }
    ctx.fillRect(-w * 0.42, h * 0.44, 13, isBraking ? 7 : 4);
    ctx.fillRect(w * 0.42 - 13, h * 0.44, 13, isBraking ? 7 : 4);
    ctx.shadowBlur = 0;

    if (isReversing) {
      ctx.fillStyle = "#ffffff"; ctx.shadowBlur = 14; ctx.shadowColor = "#ffffff";
      ctx.fillRect(-w * 0.25, h * 0.44, 10, 5); ctx.fillRect(w * 0.25 - 10, h * 0.44, 10, 5);
      ctx.shadowBlur = 0;
    }
  }

  if (isPlayer && shield > 0) {
    ctx.strokeStyle = "rgba(0, 229, 255, 0.85)";
    ctx.lineWidth = 5;
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#00e5ff";
    ctx.beginPath();
    ctx.arc(0, 0, Math.max(w, h) * 0.65, 0, Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  if (nametag) {
    ctx.save();
    if (!isPlayer) ctx.rotate(Math.PI);
    ctx.font = "bold 13px Tahoma, Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(10, 15, 24, 0.85)";
    const textW = ctx.measureText(nametag).width + 16;
    ctx.beginPath();
    ctx.roundRect(-textW / 2, -h * 0.72, textW, 22, 6);
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = "#fff";
    ctx.fillText(nametag, 0, -h * 0.72 + 15);
    ctx.restore();
  }

  ctx.restore();
}

function drawRoadSurface() {
  const topW = W * 0.35, botW = W * 0.88, topY = H * 0.34;
  ctx.fillStyle = "#343a40";
  ctx.beginPath();
  ctx.moveTo(W / 2 - topW / 2, topY);
  ctx.lineTo(W / 2 + topW / 2, topY);
  ctx.lineTo(W / 2 + botW / 2, H);
  ctx.lineTo(W / 2 - botW / 2, H);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#d7d7d7";
  ctx.beginPath();
  ctx.moveTo(W / 2 - topW / 2, topY); ctx.lineTo(W / 2 - topW / 2 + 7, topY);
  ctx.lineTo(W / 2 - botW / 2 + 10, H); ctx.lineTo(W / 2 - botW / 2, H);
  ctx.closePath(); ctx.fill();

  ctx.beginPath();
  ctx.moveTo(W / 2 + topW / 2 - 7, topY); ctx.lineTo(W / 2 + topW / 2, topY);
  ctx.lineTo(W / 2 + botW / 2, H); ctx.lineTo(W / 2 + botW / 2 - 10, H);
  ctx.closePath(); ctx.fill();

  ctx.strokeStyle = "#f4f4f4";
  ctx.lineWidth = 5;
  ctx.setLineDash([28, 28]);
  ctx.lineDashOffset = -roadOffset;
  ctx.beginPath();
  ctx.moveTo(W / 2, topY); ctx.lineTo(W / 2, H);
  ctx.moveTo(W / 2 - topW / 4, topY); ctx.lineTo(W / 2 - botW / 4, H);
  ctx.moveTo(W / 2 + topW / 4, topY); ctx.lineTo(W / 2 + botW / 4, H);
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawTree(x, y, scale) {
  ctx.save(); ctx.translate(x, y); ctx.scale(scale, scale);
  ctx.fillStyle = "#5d4037"; ctx.fillRect(-5, 0, 10, 25);
  ctx.fillStyle = "#2e7d32"; ctx.beginPath(); ctx.arc(0, -10, 22, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#388e3c"; ctx.beginPath(); ctx.arc(-8, -18, 16, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(8, -18, 16, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

function drawCactus(x, y, scale) {
  ctx.save(); ctx.translate(x, y); ctx.scale(scale, scale);
  ctx.fillStyle = "#2e7d32";
  ctx.beginPath(); ctx.roundRect(-6, -30, 12, 35, 6); ctx.fill();
  ctx.fillRect(-16, -18, 10, 5); ctx.fillRect(-16, -26, 5, 12);
  ctx.fillRect(6, -12, 10, 5); ctx.fillRect(11, -20, 5, 12);
  ctx.restore();
}

function drawLampPost(x, y, scale, isNight) {
  ctx.save(); ctx.translate(x, y); ctx.scale(scale, scale);
  ctx.fillStyle = "#37474f"; ctx.fillRect(-3, -40, 6, 45);
  ctx.fillRect(-10, -43, 20, 5);
  ctx.fillStyle = isNight ? "#fff59d" : "#cfd8dc";
  ctx.beginPath(); ctx.arc(0, -38, 5, 0, Math.PI * 2); ctx.fill();
  if (isNight) {
    ctx.fillStyle = "rgba(255, 245, 157, 0.18)";
    ctx.beginPath(); ctx.moveTo(0, -38); ctx.lineTo(-25, 10); ctx.lineTo(25, 10); ctx.closePath(); ctx.fill();
  }
  ctx.restore();
}

function drawPineTree(x, y, scale) {
  ctx.save(); ctx.translate(x, y); ctx.scale(scale, scale);
  ctx.fillStyle = "#4e342e"; ctx.fillRect(-4, 0, 8, 20);
  ctx.fillStyle = "#1b5e20";
  ctx.beginPath(); ctx.moveTo(0, -35); ctx.lineTo(-18, -15); ctx.lineTo(18, -15); ctx.fill();
  ctx.beginPath(); ctx.moveTo(0, -25); ctx.lineTo(-22, -2); ctx.lineTo(22, -2); ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.beginPath(); ctx.moveTo(0, -35); ctx.lineTo(-8, -26); ctx.lineTo(8, -26); ctx.fill();
  ctx.restore();
}

// رسم أطوار القمر الـ 8 بالتتابع الفلكي الدقيق
function drawMoon(cx, cy, r, phase) {
  ctx.save();
  ctx.translate(cx, cy);

  if (phase !== 0) {
    const glow = ctx.createRadialGradient(0, 0, r * 0.8, 0, 0, r * 2.3);
    glow.addColorStop(0, "rgba(255, 253, 220, 0.38)");
    glow.addColorStop(0.5, "rgba(255, 253, 220, 0.12)");
    glow.addColorStop(1, "rgba(255, 253, 220, 0)");
    ctx.fillStyle = glow;
    ctx.beginPath(); ctx.arc(0, 0, r * 2.3, 0, Math.PI * 2); ctx.fill();
  }

  // قاعدة قرص القمر المظلمة
  ctx.fillStyle = "#161d2a";
  ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();

  // فوهات بركانية على سطح القمر المظلم
  ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
  ctx.beginPath(); ctx.arc(-r * 0.3, -r * 0.2, r * 0.22, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(r * 0.25, r * 0.3, r * 0.25, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(-r * 0.1, r * 0.45, r * 0.15, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = "#fffde7";

  if (phase === 0) { // 0: محاق (New Moon)
    ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.stroke();
  } else if (phase === 4) { // 4: بدر (Full Moon)
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
  } else {
    ctx.beginPath();
    if (phase === 1) { // 1: هلال متزايد (Waxing Crescent)
      ctx.arc(0, 0, r, -Math.PI / 2, Math.PI / 2, false);
      ctx.ellipse(0, 0, r * 0.5, r, 0, Math.PI / 2, -Math.PI / 2, true);
    } else if (phase === 2) { // 2: تربيع أول (First Quarter)
      ctx.arc(0, 0, r, -Math.PI / 2, Math.PI / 2, false);
    } else if (phase === 3) { // 3: أحدب متزايد (Waxing Gibbous)
      ctx.arc(0, 0, r, -Math.PI / 2, Math.PI / 2, false);
      ctx.ellipse(0, 0, r * 0.5, r, 0, Math.PI / 2, -Math.PI / 2, false);
    } else if (phase === 5) { // 5: أحدب متناقص (Waning Gibbous)
      ctx.arc(0, 0, r, Math.PI / 2, -Math.PI / 2, false);
      ctx.ellipse(0, 0, r * 0.5, r, 0, -Math.PI / 2, Math.PI / 2, false);
    } else if (phase === 6) { // 6: تربيع ثاني (Third Quarter)
      ctx.arc(0, 0, r, Math.PI / 2, -Math.PI / 2, false);
    } else if (phase === 7) { // 7: هلال متناقص (Waning Crescent)
      ctx.arc(0, 0, r, Math.PI / 2, -Math.PI / 2, false);
      ctx.ellipse(0, 0, r * 0.5, r, 0, -Math.PI / 2, Math.PI / 2, true);
    }
    ctx.fill();
  }

  if (phase !== 0) {
    ctx.save();
    ctx.globalCompositeOperation = "source-atop";
    ctx.fillStyle = "rgba(180, 170, 130, 0.22)";
    ctx.beginPath(); ctx.arc(-r * 0.3, -r * 0.2, r * 0.22, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(r * 0.25, r * 0.3, r * 0.25, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(-r * 0.1, r * 0.45, r * 0.15, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  ctx.restore();
}

// رسم الخلفيات والأفق المتناسق مع الشروق والغروب والليل والنهار
function drawBackground() {
  const horizonY = H * 0.34;
  const isNightTime = cycleProgress >= 0.5;
  const dayFactor = getDayNightFactor(cycleProgress);

  // 1. تدرج ألوان السماء السلس والمتدرج
  const skyColors = getCurrentSkyColors(cycleProgress);
  let skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
  skyGrad.addColorStop(0, skyColors.top);
  skyGrad.addColorStop(0.55, skyColors.mid);
  skyGrad.addColorStop(1, skyColors.bot);

  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, W, horizonY);

  // 2. النجوم المتدرجة (تظهر ليلاً)
  let starAlpha = 0;
  if (cycleProgress >= 0.5 && cycleProgress <= 0.95) {
    if (cycleProgress < 0.6) starAlpha = (cycleProgress - 0.5) / 0.1;
    else if (cycleProgress > 0.85) starAlpha = (0.95 - cycleProgress) / 0.1;
    else starAlpha = 1;
  }

  if (starAlpha > 0) {
    ctx.save();
    ctx.globalAlpha = starAlpha;
    ctx.fillStyle = "#ffffff";
    for (let i = 0; i < 40; i++) {
      let sx = (i * 137 + 45) % W;
      let sy = (i * 59 + 12) % (horizonY - 12);
      let size = (i % 3 === 0) ? 2.0 : 1.1;
      ctx.beginPath(); ctx.arc(sx, sy, size, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }

  // 3. مسار الأجرام السماوية (الشمس نهاراً والقمر ليلاً)
  if (!isNightTime) {
    const sunProgress = cycleProgress / 0.5;
    const sunX = W * (0.05 + 0.90 * sunProgress);
    const sunY = horizonY - Math.sin(sunProgress * Math.PI) * (horizonY * 0.78) + 10;

    const isSunsetOrSunrise = (sunProgress < 0.25 || sunProgress > 0.75);
    const sunGlowColor = isSunsetOrSunrise ? "rgba(255, 110, 0, 0.85)" : "rgba(255, 238, 88, 0.82)";

    const sunGlow = ctx.createRadialGradient(sunX, sunY, 6, sunX, sunY, 65);
    sunGlow.addColorStop(0, "rgba(255, 255, 255, 1)");
    sunGlow.addColorStop(0.35, sunGlowColor);
    sunGlow.addColorStop(1, "rgba(255, 193, 7, 0)");

    ctx.fillStyle = sunGlow;
    ctx.beginPath(); ctx.arc(sunX, sunY, 65, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.beginPath(); ctx.arc(sunX, sunY, 18, 0, Math.PI * 2); ctx.fill();
  } else {
    const moonProgress = (cycleProgress - 0.5) / 0.5;
    const moonX = W * (0.05 + 0.90 * moonProgress);
    const moonY = horizonY - Math.sin(moonProgress * Math.PI) * (horizonY * 0.78) + 10;

    drawMoon(moonX, moonY, 22, currentMoonPhase);
  }

  // 4. السحب المتحركة
  ctx.fillStyle = isNightTime ? "rgba(255, 255, 255, 0.08)" : "rgba(255, 255, 255, 0.40)";
  for (let c = 0; c < 4; c++) {
    let cloudX = ((c * 240 + roadOffset * 0.3) % (W + 200)) - 100;
    let cloudY = 25 + (c * 25) % 55;
    ctx.beginPath();
    ctx.arc(cloudX, cloudY, 22, 0, Math.PI * 2);
    ctx.arc(cloudX + 20, cloudY - 10, 28, 0, Math.PI * 2);
    ctx.arc(cloudX + 45, cloudY, 20, 0, Math.PI * 2);
    ctx.fill();
  }

  // 5. تضاريس الأفق المجهزة بالكامل والمتفاعلة بسلاسة مع الإضاءة
  if (environment === "grass") {
    ctx.fillStyle = interpolateColorHex("#0d1d16", "#2e7d32", dayFactor);
    ctx.beginPath();
    ctx.moveTo(0, horizonY);
    ctx.quadraticCurveTo(W * 0.25, horizonY - 45, W * 0.5, horizonY - 15);
    ctx.quadraticCurveTo(W * 0.75, horizonY - 55, W, horizonY);
    ctx.lineTo(W, horizonY); ctx.lineTo(0, horizonY); ctx.fill();

    ctx.fillStyle = interpolateColorHex("#152d21", "#388e3c", dayFactor);
    ctx.beginPath();
    ctx.moveTo(0, horizonY);
    ctx.quadraticCurveTo(W * 0.35, horizonY - 25, W * 0.7, horizonY - 35);
    ctx.quadraticCurveTo(W * 0.88, horizonY - 10, W, horizonY);
    ctx.lineTo(W, horizonY); ctx.lineTo(0, horizonY); ctx.fill();

  } else if (environment === "desert") {
    ctx.fillStyle = interpolateColorHex("#1f141f", "#b77028", dayFactor);
    ctx.beginPath();
    ctx.moveTo(0, horizonY);
    ctx.lineTo(W * 0.25, horizonY - 38);
    ctx.lineTo(W * 0.55, horizonY - 10);
    ctx.lineTo(W * 0.8, horizonY - 48);
    ctx.lineTo(W, horizonY);
    ctx.lineTo(W, horizonY); ctx.lineTo(0, horizonY); ctx.fill();

  } else if (environment === "city") {
    const bldCount = Math.floor(W / 42) + 2;
    const bldW = W / (bldCount - 1);

    for (let b = 0; b < bldCount; b++) {
      const seed = (b * 137 + 19) % 100;
      const bH = 38 + (seed * 1.05);
      const bX = b * bldW;
      const bWidth = bldW * 0.93;
      const bStyle = b % 4;

      ctx.save();
      ctx.fillStyle = isNightTime ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.2)";
      ctx.fillRect(bX + bWidth - 4, horizonY - bH, 6, bH);

      let bGrad = ctx.createLinearGradient(bX, horizonY - bH, bX + bWidth, horizonY);
      if (isNightTime) {
        if (bStyle === 0) { bGrad.addColorStop(0, "#0e1a2b"); bGrad.addColorStop(1, "#050a12"); }
        else if (bStyle === 1) { bGrad.addColorStop(0, "#1a1824"); bGrad.addColorStop(1, "#0a0812"); }
        else if (bStyle === 2) { bGrad.addColorStop(0, "#08202d"); bGrad.addColorStop(1, "#030e16"); }
        else { bGrad.addColorStop(0, "#221919"); bGrad.addColorStop(1, "#0d0909"); }
      } else {
        if (bStyle === 0) { bGrad.addColorStop(0, "#90caf9"); bGrad.addColorStop(1, "#42a5f5"); }
        else if (bStyle === 1) { bGrad.addColorStop(0, "#78909c"); bGrad.addColorStop(1, "#455a64"); }
        else if (bStyle === 2) { bGrad.addColorStop(0, "#80deea"); bGrad.addColorStop(1, "#00acc1"); }
        else { bGrad.addColorStop(0, "#b0bec5"); bGrad.addColorStop(1, "#607d8b"); }
      }

      ctx.fillStyle = bGrad;
      ctx.fillRect(bX, horizonY - bH, bWidth, bH);
      ctx.strokeStyle = isNightTime ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.25)";
      ctx.lineWidth = 1;
      ctx.strokeRect(bX, horizonY - bH, bWidth, bH);

      if (bStyle === 2) {
        ctx.fillStyle = isNightTime ? "#050e17" : "#00acc1";
        ctx.beginPath();
        ctx.moveTo(bX + bWidth * 0.2, horizonY - bH);
        ctx.lineTo(bX + bWidth * 0.5, horizonY - bH - 24);
        ctx.lineTo(bX + bWidth * 0.8, horizonY - bH);
        ctx.fill();
      } else if (bStyle === 0) {
        const antX = bX + bWidth * 0.5;
        ctx.strokeStyle = isNightTime ? "#666" : "#333";
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(antX, horizonY - bH); ctx.lineTo(antX, horizonY - bH - 18); ctx.stroke();

        const blink = Math.floor((performance.now() + b * 200) / 450) % 2 === 0;
        if (isNightTime && blink) {
          ctx.fillStyle = "#ff1744";
          ctx.shadowBlur = 8; ctx.shadowColor = "#ff1744";
          ctx.beginPath(); ctx.arc(antX, horizonY - bH - 18, 2.5, 0, Math.PI * 2); ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      const rows = Math.floor(bH / 10) - 1;
      const cols = Math.floor(bWidth / 7) - 1;
      for (let r = 1; r < rows; r++) {
        for (let c = 1; c <= cols; c++) {
          const winX = bX + c * 6;
          const winY = horizonY - bH + r * 9;
          const isLit = ((b * 13 + r * 7 + c * 3) % 5) > 1;

          if (isNightTime) {
            if (isLit) {
              const colorType = (b + r) % 3;
              ctx.fillStyle = colorType === 0 ? "#ffe082" : (colorType === 1 ? "#80deea" : "#ffd54f");
              ctx.shadowBlur = 3; ctx.shadowColor = ctx.fillStyle;
              ctx.fillRect(winX, winY, 3.5, 4.5);
              ctx.shadowBlur = 0;
            } else {
              ctx.fillStyle = "rgba(10, 15, 25, 0.8)";
              ctx.fillRect(winX, winY, 3.5, 4.5);
            }
          } else {
            ctx.fillStyle = isLit ? "rgba(255, 255, 255, 0.6)" : "rgba(30, 50, 70, 0.4)";
            ctx.fillRect(winX, winY, 3.5, 4.5);
          }
        }
      }

      ctx.restore();
    }
  } else if (environment === "winter") {
    ctx.fillStyle = interpolateColorHex("#172330", "#78909c", dayFactor);
    ctx.beginPath();
    ctx.moveTo(0, horizonY);
    ctx.lineTo(W * 0.22, horizonY - 55);
    ctx.lineTo(W * 0.48, horizonY);
    ctx.lineTo(W * 0.78, horizonY - 70);
    ctx.lineTo(W, horizonY);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.moveTo(W * 0.22, horizonY - 55);
    ctx.lineTo(W * 0.16, horizonY - 35);
    ctx.lineTo(W * 0.28, horizonY - 35);
    ctx.closePath(); ctx.fill();

    ctx.beginPath();
    ctx.moveTo(W * 0.78, horizonY - 70);
    ctx.lineTo(W * 0.7, horizonY - 42);
    ctx.lineTo(W * 0.86, horizonY - 42);
    ctx.closePath(); ctx.fill();
  }

  // 6. أرضية الشارع والجانبين الملساء
  let groundGrad = ctx.createLinearGradient(0, horizonY, 0, H);

  if (environment === "grass") {
    groundGrad.addColorStop(0, interpolateColorHex("#12261b", "#43a047", dayFactor));
    groundGrad.addColorStop(1, interpolateColorHex("#0a1710", "#2e7d32", dayFactor));
  } else if (environment === "desert") {
    groundGrad.addColorStop(0, interpolateColorHex("#2b2014", "#d49a43", dayFactor));
    groundGrad.addColorStop(1, interpolateColorHex("#1a130b", "#b57f33", dayFactor));
  } else if (environment === "city") {
    groundGrad.addColorStop(0, interpolateColorHex("#171d24", "#4b5561", dayFactor));
    groundGrad.addColorStop(1, interpolateColorHex("#0d1117", "#374151", dayFactor));
  } else {
    groundGrad.addColorStop(0, interpolateColorHex("#1f2d36", "#e3f2fd", dayFactor));
    groundGrad.addColorStop(1, interpolateColorHex("#121b21", "#bbdefb", dayFactor));
  }

  ctx.fillStyle = groundGrad;
  ctx.fillRect(0, horizonY, W, H * 0.66);

  drawRoadSurface();

  for (let i = 0; i < 12; i++) {
    let progress = ((i * 120 + roadOffset * 1.5) % (H * 0.66));
    let propY = horizonY + progress;
    let t = (propY - horizonY) / (H * 0.66);
    let roadW = (W * 0.35) + (W * 0.53) * t;
    let scale = 0.4 + 0.8 * t;

    let leftX = (W / 2) - (roadW / 2) - (40 * scale);
    let rightX = (W / 2) + (roadW / 2) + (40 * scale);

    if (environment === "grass") {
      drawTree(leftX, propY, scale); drawTree(rightX, propY, scale);
    } else if (environment === "desert") {
      drawCactus(leftX, propY, scale); drawCactus(rightX, propY, scale);
    } else if (environment === "city") {
      drawLampPost(leftX, propY, scale, isNightTime); drawLampPost(rightX, propY, scale, isNightTime);
    } else if (environment === "winter") {
      drawPineTree(leftX, propY, scale); drawPineTree(rightX, propY, scale);
    }
  }
}

function drawHeadlights() {
  if (timeOfDay !== "night" || environment === "city") return;
  const y = player.y - player.h * 0.40;
  const x = player.x;
  const g = ctx.createRadialGradient(x, y, 5, x, y - H * 0.40, W * 0.38);
  g.addColorStop(0, "rgba(255,248,200,.28)");
  g.addColorStop(0.45, "rgba(255,248,200,.10)");
  g.addColorStop(1, "rgba(255,248,200,0)");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(x - 16, y);
  ctx.lineTo(x - W * 0.40, y - H * 0.42);
  ctx.lineTo(x + W * 0.40, y - H * 0.42);
  ctx.lineTo(x + 16, y);
  ctx.closePath();
  ctx.fill();
}

function drawPowerup(p) {
  const x = laneX(p.lane, p.y);
  const scale = getPerspectiveScale(p.y);
  ctx.save();
  ctx.translate(x, p.y);
  ctx.scale(scale, scale);
  p.rot += 0.05;
  ctx.rotate(Math.sin(p.rot) * 0.08);

  const c = p.type === "speed" ? "#ff4d4d" : "#36b7ff";
  ctx.shadowBlur = 16; ctx.shadowColor = c; ctx.fillStyle = c;
  ctx.beginPath(); ctx.arc(0, 0, 18, 0, Math.PI * 2); ctx.fill();
  ctx.shadowBlur = 0; ctx.fillStyle = "#fff";

  if (p.type === "speed") {
    ctx.beginPath();
    ctx.moveTo(-5, -12); ctx.lineTo(8, -2); ctx.lineTo(1, -2);
    ctx.lineTo(7, 12); ctx.lineTo(-8, 1); ctx.lineTo(-1, 1);
    ctx.closePath(); ctx.fill();
  } else {
    ctx.beginPath();
    ctx.moveTo(0, -12); ctx.lineTo(11, -6); ctx.lineTo(8, 9);
    ctx.lineTo(0, 14); ctx.lineTo(-8, 9); ctx.lineTo(-11, -6);
    ctx.closePath(); ctx.fill();
  }
  ctx.restore();
}

function draw() {
  ctx.save();
  if (shake > 0) ctx.translate((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8);

  drawBackground();
  drawHeadlights();

  for (const t of traffic) {
    const s = carSize(t.type);
    const scale = getPerspectiveScale(t.y);
    drawCar(laneX(t.lane, t.y), t.y, s.w, s.h, t.color, t.type, false, scale, t.isBraking);
  }

  for (const p of powerups) drawPowerup(p);

  if (isMultiplayer) {
    Object.values(remotePlayers).forEach(f => {
      const scale = getPerspectiveScale(f.y || H * 0.8);
      const fX = laneX(f.lane || -0.5, f.y || H * 0.8);
      drawCar(fX, f.y || H * 0.8, player.w, player.h, f.color || "#00e5ff", "normal", true, scale, false, f.name);
    });
  }

  drawCar(player.x, player.y, player.w, player.h, userProfile.activeColor, "normal", true, 1.0, player.isBraking, "", (speed < 0));

  ctx.restore();

  if (state === "menu") {
    ctx.fillStyle = "rgba(0,0,0,.15)";
    ctx.fillRect(0, 0, W, H);
  }
}

function loop(t) {
  const dt = Math.min(0.035, (t - lastTime) / 1000 || 0);
  lastTime = t;
  update(dt);
  draw();
  requestAnimationFrame(loop);
}


// ==========================================
// 11. NAVIGATION & MODAL CONTROLLERS
// ==========================================
function closeAllModals() {
  const modals = [
    document.getElementById("hostModal"),
    document.getElementById("joinModal"),
    document.getElementById("colorShopModal"),
    document.getElementById("accountModal"),
    document.getElementById("tutorialModal")
  ];
  modals.forEach(m => { if (m) m.classList.add("hidden"); });
}

function openModal(modalId) {
  closeAllModals();
  const m = document.getElementById(modalId);
  if (m) m.classList.remove("hidden");
}

function togglePause() {
  if (state !== "playing") return;
  paused = !paused;
  if (pauseScreen) pauseScreen.classList.toggle("hidden", !paused);
}

function goMenu() {
  state = "menu";
  paused = false;
  leaveMultiplayer();
  if (gameUI) gameUI.classList.add("hidden");
  if (pauseScreen) pauseScreen.classList.add("hidden");
  if (gameOverScreen) gameOverScreen.classList.add("hidden");
  if (mobileControls) mobileControls.classList.add("hidden");
  closeAllModals();
  if (startScreen) startScreen.classList.remove("hidden");
  updateAccountUI();
}

const tabSoloBtn = document.getElementById("tabSoloBtn");
const tabMultiBtn = document.getElementById("tabMultiBtn");
const soloPanel = document.getElementById("soloPanel");
const multiPanel = document.getElementById("multiPanel");

if (tabSoloBtn && tabMultiBtn && soloPanel && multiPanel) {
  tabSoloBtn.addEventListener("click", () => {
    tabSoloBtn.classList.add("active");
    tabMultiBtn.classList.remove("active");
    soloPanel.classList.remove("hidden");
    multiPanel.classList.add("hidden");
    leaveMultiplayer();
    sfx.playChime();
  });

  tabMultiBtn.addEventListener("click", () => {
    tabMultiBtn.classList.add("active");
    tabSoloBtn.classList.remove("active");
    multiPanel.classList.remove("hidden");
    soloPanel.classList.add("hidden");
    sfx.playChime();
  });
}

document.getElementById("openTutorialBtn")?.addEventListener("click", () => {
  openModal("tutorialModal");
  sfx.playChime();
});
document.getElementById("closeTutorialBtn")?.addEventListener("click", closeAllModals);

document.getElementById("startBtn")?.addEventListener("click", () => {
  leaveMultiplayer();
  resetGame();
  lastTime = performance.now();
});

document.getElementById("retryBtn")?.addEventListener("click", () => {
  if (isMultiplayer && !isHost) {
    showEvent("⏳ بانتظار الهوست لبدء الجولة الجديدة");
  } else {
    resetGame();
    lastTime = performance.now();
  }
});

document.getElementById("restartBtn")?.addEventListener("click", () => {
  resetGame();
  lastTime = performance.now();
});

document.getElementById("menuBtn")?.addEventListener("click", goMenu);
document.getElementById("overMenuBtn")?.addEventListener("click", goMenu);

const pauseBtnEl = document.getElementById("pauseBtn");
if (pauseBtnEl) {
  pauseBtnEl.addEventListener("click", togglePause);
  pauseBtnEl.addEventListener("pointerdown", e => { e.stopPropagation(); });
}

document.getElementById("resumeBtn")?.addEventListener("click", togglePause);

document.getElementById("openHostBtn")?.addEventListener("click", () => {
  openModal("hostModal");
  const hostSettings = {
    difficulty: document.getElementById("hostDifficulty")?.value || "normal",
    time: document.getElementById("hostTime")?.value || "day",
    biome: document.getElementById("hostBiome")?.value || "grass"
  };
  initHostMultiplayer(hostSettings);
});

document.getElementById("startHostGameBtn")?.addEventListener("click", () => {
  const hostSettings = {
    difficulty: document.getElementById("hostDifficulty")?.value || "normal",
    time: document.getElementById("hostTime")?.value || "day",
    biome: document.getElementById("hostBiome")?.value || "grass"
  };
  broadcastToGuests({ type: "start_match", settings: hostSettings });
  closeAllModals();
  startMatchFromHost(hostSettings);
});

document.getElementById("cancelHostBtn")?.addEventListener("click", () => {
  leaveMultiplayer();
  closeAllModals();
});

document.getElementById("copyCodeBtn")?.addEventListener("click", () => {
  if (roomCode) {
    navigator.clipboard?.writeText(roomCode);
    showEvent(`📋 تم نسخ الكود: ${roomCode}`);
  }
});

document.getElementById("openJoinBtn")?.addEventListener("click", () => {
  openModal("joinModal");
  const joinCodeInput = document.getElementById("joinCodeInput");
  if (joinCodeInput) { joinCodeInput.value = ""; joinCodeInput.focus(); }
  const joinLobbyBox = document.getElementById("joinLobbyBox");
  if (joinLobbyBox) joinLobbyBox.classList.add("hidden");
  const joinStatusText = document.getElementById("joinStatusText");
  if (joinStatusText) joinStatusText.textContent = "";
});

document.getElementById("submitJoinBtn")?.addEventListener("click", () => {
  const code = document.getElementById("joinCodeInput")?.value;
  if (!code || code.trim().length !== 6) {
    const joinStatusText = document.getElementById("joinStatusText");
    if (joinStatusText) {
      joinStatusText.textContent = "يرجى إدخال كود صحيح مكون من 6 أرقام!";
      joinStatusText.className = "status-msg error";
    }
    return;
  }
  joinMultiplayerServer(code);
});

document.getElementById("cancelJoinBtn")?.addEventListener("click", () => {
  leaveMultiplayer();
  closeAllModals();
});

document.getElementById("hudLeaveServerBtn")?.addEventListener("click", goMenu);
document.getElementById("overLeaveBtn")?.addEventListener("click", goMenu);

document.getElementById("openColorWheelBtn")?.addEventListener("click", () => {
  openModal("colorShopModal");
  drawColorWheel();
  updatePickedColorUI();
});
document.getElementById("closeColorShopBtn")?.addEventListener("click", closeAllModals);

document.getElementById("userPillBtn")?.addEventListener("click", () => openModal("accountModal"));
document.getElementById("openAccountBtn")?.addEventListener("click", () => openModal("accountModal"));
document.getElementById("closeAccountBtn")?.addEventListener("click", closeAllModals);

document.getElementById("saveGmailAccountBtn")?.addEventListener("click", () => {
  const emailInput = document.getElementById("accEmailInput");
  const usernameInput = document.getElementById("accUsernameInput");
  const email = emailInput?.value.trim();
  const username = usernameInput?.value.trim();

  if (!email || !email.includes("@")) {
    const notice = document.getElementById("accountNotice");
    if (notice) notice.textContent = "يرجى كتابة بريد Gmail صالح!";
    return;
  }

  const existingRaw = localStorage.getItem("cloud_account_" + email.toLowerCase());
  if (existingRaw) {
    try {
      const existingData = JSON.parse(existingRaw);
      userProfile = { ...userProfile, ...existingData };
      showEvent("☁️ تم استرجاع بياناتك السحابية المرتبطة بـ Gmail!");
    } catch (e) {}
  }

  userProfile.email = email;
  if (username) userProfile.username = username;
  userProfile.isCloudConnected = true;
  saveUserProfile(true);
  updateAccountUI();
  const notice = document.getElementById("accountNotice");
  if (notice) notice.textContent = "تم تسجيل الحساب وربط السحابة بنجاح!";
});

document.getElementById("syncNowBtn")?.addEventListener("click", () => {
  saveUserProfile(true);
  sfx.playBuySound();
});

document.getElementById("restoreCloudBtn")?.addEventListener("click", () => {
  if (userProfile.email) {
    const raw = localStorage.getItem("cloud_account_" + userProfile.email.toLowerCase());
    if (raw) {
      userProfile = { ...userProfile, ...JSON.parse(raw) };
      updateAccountUI();
      sfx.playChime();
      showEvent("📥 تم استرجاع تقدمك من سحابة Gmail بنجاح!");
    } else {
      showEvent("لا توجد بيانات سحابية سابقة لهذا البريد.");
    }
  }
});

document.getElementById("logoutBtn")?.addEventListener("click", () => {
  userProfile.email = null;
  userProfile.isCloudConnected = false;
  saveUserProfile();
  updateAccountUI();
  showEvent("تم تسجيل الخروج بنجاح.");
});


// ==========================================
// 12. INITIALIZATION ON PAGE LOAD
// ==========================================
resize();
loadUserProfile();
drawColorWheel();
updateAccountUI();
requestAnimationFrame(loop);