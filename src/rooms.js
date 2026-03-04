import { COLORS } from './constants.js';
import { state } from './state.js';
import { uid, ins } from './utils.js';
import { renderSwatches, renderSwatchesSplit } from './palette.js';

// Imported lazily to avoid circular deps — set via init
let _renderCanvas = null;
let _showFurnSettings = null;
let _showOpeningSettings = null;
export function initRoomsCallbacks(renderCanvas, showFurnSettings, showOpeningSettings) {
  _renderCanvas = renderCanvas;
  _showFurnSettings = showFurnSettings;
  _showOpeningSettings = showOpeningSettings;
}

export function renderRoomList() {
  const list = document.getElementById('roomList');
  list.innerHTML = '';
  document.getElementById('emptyState').style.display = state.rooms.length ? 'none' : 'flex';

  state.rooms.forEach(r => {
    const el = document.createElement('div');
    el.className = 'room-item' + (r.id === state.activeRoomId ? ' active' : '');
    const dupSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style="width:13px;height:13px;"><path d="M7 3.5A1.5 1.5 0 0 1 8.5 2h3.879a1.5 1.5 0 0 1 1.06.44l3.122 3.12A1.5 1.5 0 0 1 17 6.622V12.5a1.5 1.5 0 0 1-1.5 1.5h-1v-3.379a3 3 0 0 0-.879-2.121L10.5 5.379A3 3 0 0 0 8.379 4.5H7v-1Z"/><path d="M4.5 6A1.5 1.5 0 0 0 3 7.5v9A1.5 1.5 0 0 0 4.5 18h7a1.5 1.5 0 0 0 1.5-1.5v-5.879a1.5 1.5 0 0 0-.44-1.06L9.44 6.439A1.5 1.5 0 0 0 8.378 6H4.5Z"/></svg>`;
    el.innerHTML = `<div class="room-dot" style="background:${COLORS[r.colorIdx].b}"></div><div class="room-name">${r.name}</div><button class="dup-room" data-dup="${r.id}" title="Duplicate room">${dupSvg}</button><button class="del-room" data-del="${r.id}">✕</button>`;
    el.addEventListener('click', () => setActiveRoom(r.id));
    list.appendChild(el);
  });

  const a = state.rooms.find(r => r.id === state.activeRoomId);
  if (state.batchMode) { showBatchPanelRef(); return; }

  if (state.selWo) {
    const woRoom = state.rooms.find(r => r.openings?.some(w => w.id === state.selWo));
    const wo = woRoom?.openings.find(w => w.id === state.selWo);
    if (wo) _showOpeningSettings && _showOpeningSettings(wo);
    else state.selWo = null;
  } else if (state.selFurn) {
    const furnRoom = state.rooms.find(r => r.furniture.some(f => f.id === state.selFurn));
    const f = furnRoom?.furniture.find(x => x.id === state.selFurn);
    if (f) _showFurnSettings && _showFurnSettings(f);
    else state.selFurn = null;
  }

  if (!state.selWo && !state.selFurn) {
    if (a) {
      document.getElementById('contextPanel').style.display = 'block';
      document.getElementById('roomSettings').style.display = 'block';
      document.getElementById('openingSettings').style.display = 'none';
      document.getElementById('furnSettings').style.display = 'none';
      document.getElementById('editName').value = a.name;
      document.getElementById('editW').value = a.w;
      document.getElementById('editH').value = a.h;
      renderSwatchesSplit(a.colorIdx, i => { a.colorIdx = i; renderRoomList(); _renderCanvas && _renderCanvas(); });
    } else {
      document.getElementById('contextPanel').style.display = 'none';
    }
  }
}

// Reference to showBatchPanel — set from batch.js
let showBatchPanelRef = () => {};
export function setShowBatchPanelRef(fn) { showBatchPanelRef = fn; }

export function setActiveRoom(id) {
  state.activeRoomId = id;
  state.selWo = null;
  renderRoomList();
  document.querySelectorAll('.room-canvas').forEach(el => el.classList.toggle('selected', el.dataset.rid === id));
}

export function updateActiveRoom() {
  const r = state.rooms.find(r => r.id === state.activeRoomId);
  if (!r) return;
  r.name = document.getElementById('editName').value || r.name;
  r.w = parseFloat(document.getElementById('editW').value) || r.w;
  r.h = parseFloat(document.getElementById('editH').value) || r.h;
  _renderCanvas && _renderCanvas();
  renderRoomList();
}

export function deleteRoom(id, e) {
  e.stopPropagation();
  state.rooms = state.rooms.filter(r => r.id !== id);
  if (state.activeRoomId === id) state.activeRoomId = state.rooms[0]?.id || null;
  renderRoomList();
  _renderCanvas && _renderCanvas();
}

export function duplicateRoom(id, e) {
  e.stopPropagation();
  const src = state.rooms.find(r => r.id === id);
  if (!src) return;
  const baseName = src.name.replace(/ \d+$/, '');
  let n = 2;
  while (state.rooms.some(r => r.name === (n === 2 && !src.name.match(/ \d+$/) ? baseName + ' 2' : baseName + ' ' + n))) n++;
  const newName = baseName + ' ' + n;
  const copy = JSON.parse(JSON.stringify(src));
  const sc = parseFloat(document.getElementById('zoomSlider').value);
  copy.id = uid();
  copy.name = newName;
  copy.x = src.x + Math.round(src.w * sc) + 40;
  copy.y = src.y;
  copy.furniture = copy.furniture.map(f => ({ ...f, id: uid() }));
  copy.openings = (copy.openings || []).map(w => ({ ...w, id: uid() }));
  state.rooms.push(copy);
  state.activeRoomId = copy.id;
  renderRoomList();
  _renderCanvas && _renderCanvas();
}

export function openAddRoomModal() {
  renderSwatches('modalSwatches', state.newRoomColor, i => {
    state.newRoomColor = i;
    renderSwatches('modalSwatches', state.newRoomColor, () => {});
  });
  document.getElementById('addRoomModal').classList.add('open');
  document.getElementById('newRoomName').focus();
}

export function closeModal() {
  document.getElementById('addRoomModal').classList.remove('open');
}

export function confirmAddRoom() {
  const name = document.getElementById('newRoomName').value || 'Room';
  const w = parseFloat(document.getElementById('newRoomW').value) || 192;
  const h = parseFloat(document.getElementById('newRoomH').value) || 156;
  const room = { id: uid(), name, w, h, colorIdx: state.newRoomColor, x: 30 + state.rooms.length * 25, y: 30 + state.rooms.length * 18, furniture: [], openings: [] };
  state.newRoomColor = (state.newRoomColor + 1) % COLORS.length;
  state.rooms.push(room);
  state.activeRoomId = room.id;
  closeModal();
  renderRoomList();
  _renderCanvas && _renderCanvas();
}
