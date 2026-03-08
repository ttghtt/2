const state = {
  level: 1,
  xp: 0,
  focus: 0,
  unlocked: ["Базовый ноутбук"],
};

const tasks = [
  {
    id: "article",
    name: "Прочитать небольшую статью",
    desc: "5 минут полезного чтения по разработке.",
    focus: 25,
    xp: 20,
  },
  {
    id: "vibe-coding",
    name: "Вайб‑кодинг с таймером",
    desc: "10 минут кода в спокойном темпе.",
    focus: 40,
    xp: 35,
  },
  {
    id: "review",
    name: "Мини‑ревью заметок",
    desc: "Укрепи знания и структурируй идеи.",
    focus: 15,
    xp: 15,
  },
];

const upgrades = [
  { name: "Второй монитор", cost: 60, level: 1, sprite: "secondMonitor" },
  { name: "Эргономичный стол", cost: 120, level: 2, sprite: "desk" },
  { name: "Комната с панорамным окном", cost: 200, level: 3, sprite: "panoramaRoom" },
  { name: "Премиум кресло", cost: 300, level: 4, sprite: "chair" },
  { name: "Неоновый декор", cost: 380, level: 5, sprite: "neon" },
];

const studioItems = {
  "Базовый ноутбук": { sprite: "laptop", x: 27, y: 24 },
  "Второй монитор": { sprite: "secondMonitor", x: 39, y: 22 },
  "Эргономичный стол": { sprite: "desk", x: 18, y: 25 },
  "Комната с панорамным окном": { sprite: "panoramaRoom", x: 2, y: 3 },
  "Премиум кресло": { sprite: "chair", x: 14, y: 26 },
  "Неоновый декор": { sprite: "neon", x: 50, y: 8 },
};

const PALETTE = {
  B: null,
  k: "#0b1020",
  g: "#2a3557",
  s: "#8fa0ff",
  l: "#b8c7ff",
  w: "#dff5ff",
  t: "#5a4330",
  p: "#46d5ff",
  n: "#ff4af2",
  y: "#ffe46e",
  c: "#4fd39f",
};

const SPRITES = {
  laptop: [
    "BBBBBBBB",
    "BBssssBB",
    "BBswwsBB",
    "BBssssBB",
    "BggggggB",
    "BggkkggB",
  ],
  secondMonitor: [
    "BBBBBBBBBB",
    "BssssssssB",
    "BswwwwwwsB",
    "BssssssssB",
    "BBBgggBBBB",
    "BBBgggBBBB",
  ],
  desk: [
    "tttttttttttttt",
    "tttttttttttttt",
    "BBttttttttttBB",
    "BBttttttttttBB",
    "BBttBBBBttttBB",
    "BBttBBBBttttBB",
    "BBttBBBBttttBB",
  ],
  chair: [
    "BBccccBB",
    "BccccccB",
    "BccccccB",
    "BBccccBB",
    "BBBccBBB",
    "BBccccBB",
    "BBBccBBB",
  ],
  neon: [
    "BBnnnnnnBB",
    "BnBBBBBBnB",
    "BnBnyynBnB",
    "BnBnyynBnB",
    "BnBBBBBBnB",
    "BBnnnnnnBB",
  ],
  panoramaRoom: [
    "kkkkkkkkkkkkkkkkkkkkkkkk",
    "kssssssssssssssssssssssk",
    "kswwwwwwwwwwwwwwwwwwwwsk",
    "kswpwwwwwwpwwwwwwpwwwpsk",
    "kswwwwwwwwwwwwwwwwwwwwsk",
    "kswwwwpwwwwwwpwwwwwwwwsk",
    "kswwwwwwwwwwwwwwwwwwwwsk",
    "kssssssssssssssssssssssk",
  ],
};

const refs = {
  level: document.getElementById("level"),
  xp: document.getElementById("xp"),
  nextLevelXp: document.getElementById("nextLevelXp"),
  focus: document.getElementById("focus"),
  tasks: document.getElementById("tasks"),
  shop: document.getElementById("shop"),
  workspace: document.getElementById("workspace"),
  canvas: document.getElementById("studioCanvas"),
};

const ctx = refs.canvas.getContext("2d");
const PIXEL = 8;

function xpForNextLevel(level) {
  return 100 + (level - 1) * 50;
}

function gainRewards(task) {
  state.focus += task.focus;
  state.xp += task.xp;

  while (state.xp >= xpForNextLevel(state.level)) {
    state.xp -= xpForNextLevel(state.level);
    state.level += 1;
  }

  render();
}

function buyUpgrade(item) {
  if (state.unlocked.includes(item.name)) {
    return;
  }

  if (state.focus < item.cost || state.level < item.level) {
    return;
  }

  state.focus -= item.cost;
  state.unlocked.push(item.name);
  render();
}

function drawSprite(key, x, y) {
  const sprite = SPRITES[key];
  if (!sprite) {
    return;
  }

  for (let row = 0; row < sprite.length; row += 1) {
    for (let col = 0; col < sprite[row].length; col += 1) {
      const code = sprite[row][col];
      const color = PALETTE[code];
      if (!color) {
        continue;
      }
      ctx.fillStyle = color;
      ctx.fillRect((x + col) * PIXEL, (y + row) * PIXEL, PIXEL, PIXEL);
    }
  }
}

function drawStudioBackground() {
  ctx.fillStyle = "#1b264a";
  ctx.fillRect(0, 0, refs.canvas.width, refs.canvas.height);

  ctx.fillStyle = "#212f5f";
  ctx.fillRect(0, 0, refs.canvas.width, 24 * PIXEL);

  ctx.fillStyle = "#27366a";
  ctx.fillRect(0, 24 * PIXEL, refs.canvas.width, refs.canvas.height - 24 * PIXEL);

  ctx.fillStyle = "#101935";
  ctx.fillRect(0, 30 * PIXEL, refs.canvas.width, 6 * PIXEL);
}

function renderStudio() {
  drawStudioBackground();

  for (const unlockedItem of state.unlocked) {
    const cfg = studioItems[unlockedItem];
    if (!cfg) {
      continue;
    }
    drawSprite(cfg.sprite, cfg.x, cfg.y);
  }
}

function renderTasks() {
  refs.tasks.innerHTML = "";

  for (const task of tasks) {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <strong>${task.name}</strong>
      <p class="meta">${task.desc}</p>
      <p class="meta">+${task.focus} фокуса · +${task.xp} опыта</p>
      <button>Выполнить</button>
    `;
    card.querySelector("button").addEventListener("click", () => gainRewards(task));
    refs.tasks.append(card);
  }
}

function renderShop() {
  refs.shop.innerHTML = "";

  for (const item of upgrades) {
    const owned = state.unlocked.includes(item.name);
    const lockedByLevel = state.level < item.level;
    const lockedByFocus = state.focus < item.cost;

    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <strong>${item.name}</strong>
      <p class="meta">Цена: ${item.cost} фокуса · Требуется уровень ${item.level}</p>
      <button ${owned || lockedByLevel || lockedByFocus ? "disabled" : ""}>
        ${owned ? "Куплено" : "Открыть"}
      </button>
    `;

    card.querySelector("button").addEventListener("click", () => buyUpgrade(item));
    refs.shop.append(card);
  }
}

function renderWorkspace() {
  refs.workspace.innerHTML = "";
  for (const item of state.unlocked) {
    const li = document.createElement("li");
    li.textContent = item;
    refs.workspace.append(li);
  }
}

function renderStats() {
  refs.level.textContent = state.level;
  refs.xp.textContent = state.xp;
  refs.nextLevelXp.textContent = xpForNextLevel(state.level);
  refs.focus.textContent = state.focus;
}

function render() {
  renderStats();
  renderTasks();
  renderShop();
  renderWorkspace();
  renderStudio();
}

render();
