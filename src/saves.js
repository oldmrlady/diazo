import { state } from './state.js';
import { uid, showInfo, hideInfo } from './utils.js';

const SAVES_KEY = 'diazo_saves';

let _renderCanvas = null;
let _renderRoomList = null;
export function initSavesCallbacks(renderCanvas, renderRoomList) {
  _renderCanvas = renderCanvas;
  _renderRoomList = renderRoomList;
}

function getSaves() {
  try { return JSON.parse(localStorage.getItem(SAVES_KEY) || '[]'); } catch { return []; }
}

export function saveDesign() {
  const input = document.getElementById('saveNameInput');
  const name = input.value.trim() || ('Design ' + new Date().toLocaleDateString());
  const saves = getSaves();
  const entry = { id: uid(), name, date: new Date().toISOString(), rooms: JSON.parse(JSON.stringify(state.rooms)) };
  saves.unshift(entry);
  localStorage.setItem(SAVES_KEY, JSON.stringify(saves.slice(0, 20)));
  input.value = '';
  renderSavesList();
  showInfo('Saved: ' + name);
  setTimeout(hideInfo, 2500);
}

export function loadDesign(id) {
  const saves = getSaves();
  const entry = saves.find(s => s.id === id);
  if (!entry) return;
  state.rooms = JSON.parse(JSON.stringify(entry.rooms));
  state.activeRoomId = state.rooms[0]?.id || null;
  state.selFurn = null;
  state.selWo = null;
  document.getElementById('savesDropdown').style.display = 'none';
  _renderRoomList && _renderRoomList();
  _renderCanvas && _renderCanvas();
  showInfo('Loaded: ' + entry.name);
  setTimeout(hideInfo, 2500);
}

export function deleteDesign(id) {
  const saves = getSaves();
  localStorage.setItem(SAVES_KEY, JSON.stringify(saves.filter(s => s.id !== id)));
  renderSavesList();
}

export function renderSavesList() {
  const saves = getSaves();
  const el = document.getElementById('savesList');
  if (!saves.length) {
    el.innerHTML = '<div style="font-size:0.62rem;color:var(--muted)">No saves yet</div>';
    return;
  }
  el.innerHTML = '';
  saves.forEach(s => {
    const d = new Date(s.date);
    const dateStr = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    const row = document.createElement('div');
    row.className = 'save-item';
    row.innerHTML = `
      <div style="flex:1;overflow:hidden">
        <div class="save-name">${s.name}</div>
        <div class="save-date">${dateStr}</div>
      </div>
      <div class="save-actions">
        <button data-load="${s.id}" title="Load">📂</button>
        <button data-delete="${s.id}" title="Delete" style="color:var(--accent)">✕</button>
      </div>`;
    row.querySelector('[data-load]').addEventListener('click', () => loadDesign(s.id));
    row.querySelector('[data-delete]').addEventListener('click', () => deleteDesign(s.id));
    el.appendChild(row);
  });
}

export function toggleSavesPanel() {
  const dd = document.getElementById('savesDropdown');
  const open = dd.style.display === 'none';
  dd.style.display = open ? 'block' : 'none';
  if (open) {
    renderSavesList();
    setTimeout(() => document.getElementById('saveNameInput').focus(), 50);
  }
}
