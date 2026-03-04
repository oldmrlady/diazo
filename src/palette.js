import { COLORS, FURNITURE, FURNITURE_SVGS, WALL_TYPES } from './constants.js';
import { state } from './state.js';
import { ins } from './utils.js';

export function renderSwatches(containerId, activeIdx, cb) {
  const el = document.getElementById(containerId);
  el.innerHTML = '';
  COLORS.forEach((c, i) => {
    const s = document.createElement('div');
    s.className = 'swatch' + (i === activeIdx ? ' active' : '');
    s.style.background = c.b;
    s.onclick = () => cb(i);
    el.appendChild(s);
  });
}

export function renderSwatchesSplit(activeIdx, cb) {
  ['colorSwatchesTop', 'colorSwatchesBottom'].forEach((id, half) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = '';
    COLORS.slice(half * 3, half * 3 + 3).forEach((c, j) => {
      const i = half * 3 + j;
      const s = document.createElement('div');
      s.className = 'swatch split-swatch' + (i === activeIdx ? ' active' : '');
      s.style.background = c.b;
      s.onclick = () => {
        document.querySelectorAll('.split-swatch').forEach(sw => sw.classList.remove('active'));
        s.classList.add('active');
        cb(i);
      };
      el.appendChild(s);
    });
  });
}

export function renderWallPalette() {
  const g = document.getElementById('wallGrid');
  WALL_TYPES.forEach(wt => {
    const el = document.createElement('div');
    el.className = 'wall-item';
    el.id = 'wt-' + wt.id;
    el.innerHTML = `<span class="wall-icon">${wt.icon}</span>${wt.label}<div style="font-size:0.48rem;color:#999;margin-top:1px">${ins(wt.size)}</div>`;
    el.onclick = () => toggleWallTool(wt.id);
    g.appendChild(el);
  });
}

export function toggleWallTool(id) {
  if (state.activeWallTool === id) { cancelWallTool(); return; }
  state.activeWallTool = id;
  document.querySelectorAll('.wall-item').forEach(e => e.classList.remove('active-tool'));
  document.getElementById('wt-' + id).classList.add('active-tool');
  const wt = WALL_TYPES.find(w => w.id === id);
  const mi = document.getElementById('modeIndicator');
  mi.textContent = `Placing: ${wt.label} — click near a wall`;
  mi.classList.add('show');
  document.getElementById('cancelToolBtn').style.display = 'inline-block';
}

export function cancelWallTool() {
  state.activeWallTool = null;
  document.querySelectorAll('.wall-item').forEach(e => e.classList.remove('active-tool'));
  document.getElementById('modeIndicator').classList.remove('show');
  document.getElementById('cancelToolBtn').style.display = 'none';
}

const FURN_SECTION_STATE = {};

export function renderFurniturePalette(onFurnClick) {
  const g = document.getElementById('furnitureGrid');
  g.innerHTML = '';

  const sections = [];
  const sectionMap = {};
  FURNITURE.forEach(f => {
    if (!sectionMap[f.section]) {
      sectionMap[f.section] = [];
      sections.push(f.section);
    }
    sectionMap[f.section].push(f);
  });

  sections.forEach(section => {
    const header = document.createElement('div');
    header.className = 'furn-section-header' + (FURN_SECTION_STATE[section] ? ' collapsed' : '');
    header.innerHTML = `<span>${section}</span><span class="furn-section-arrow">▾</span>`;
    header.addEventListener('click', () => {
      FURN_SECTION_STATE[section] = !FURN_SECTION_STATE[section];
      grid.style.display = FURN_SECTION_STATE[section] ? 'none' : 'grid';
      header.classList.toggle('collapsed', FURN_SECTION_STATE[section]);
    });
    g.appendChild(header);

    const grid = document.createElement('div');
    grid.style.cssText = 'display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:4px;margin-bottom:2px;';
    if (FURN_SECTION_STATE[section]) grid.style.display = 'none';

    sectionMap[section].forEach(f => {
      const el = document.createElement('div');
      el.className = 'furn-item';
      el.draggable = true;
      const paletteIconHtml = FURNITURE_SVGS[f.id]
        ? `<span class="furn-icon" style="display:flex;align-items:center;justify-content:center;width:1.1rem;height:1.1rem;margin:0 auto 2px;color:#333;">${FURNITURE_SVGS[f.id].replace('<svg ', '<svg style="width:100%;height:100%;" ')}</span>`
        : `<span class="furn-icon">${f.icon}</span>`;
      el.innerHTML = `${paletteIconHtml}${f.label}<div style="font-size:0.44rem;color:#999;margin-top:1px">${ins(f.w)}×${ins(f.h)}</div>`;
      el.addEventListener('dragstart', e => { state.dragFurnType = f.id; e.dataTransfer.effectAllowed = 'copy'; });
      el.addEventListener('dragend', () => { state.dragFurnType = null; });
      el.addEventListener('click', () => onFurnClick(f));
      grid.appendChild(el);
    });
    g.appendChild(grid);
  });
}
