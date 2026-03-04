import { FURNITURE, FURNITURE_SVGS } from './constants.js';
import { state } from './state.js';
import { uid, ins } from './utils.js';
import { renderSwatchesSplit } from './palette.js';
import { pushHistory } from './history.js';

let _renderCanvas = null;
let _renderRoomList = null;
export function initFurnitureCallbacks(renderCanvas, renderRoomList) {
  _renderCanvas = renderCanvas;
  _renderRoomList = renderRoomList;
}

export function showFurnSettings(f) {
  document.querySelector('.sidebar').scrollTop = 0;
  const fdef = FURNITURE.find(x => x.id === f.type);
  const isCustom = f.type === 'custom';
  const isRug = f.type === 'rug';
  const isCircular = !!fdef?.circular;
  document.getElementById('contextPanel').style.display = 'block';
  document.getElementById('roomSettings').style.display = 'none';
  document.getElementById('openingSettings').style.display = 'none';
  document.getElementById('furnSettings').style.display = 'block';
  document.getElementById('furnNameRow').style.display = isCustom ? 'flex' : 'none';
  document.getElementById('rugColorRow').style.display = isRug ? 'flex' : 'none';
  document.getElementById('furnDiamRow').style.display = isCircular ? 'flex' : 'none';
  document.getElementById('furnWidthRow').style.display = isCircular ? 'none' : 'flex';
  document.getElementById('furnDepthRow').style.display = isCircular ? 'none' : 'flex';
  if (isCustom) document.getElementById('editFurnName').value = f.customLabel || '';
  if (isRug) {
    const col = f.rugColor || '#c8a882';
    document.getElementById('editRugColor').value = col;
    document.getElementById('rugColorHex').textContent = col;
  }
  document.getElementById('furnSettingsTitle').textContent = (f.customLabel || fdef?.label || 'Furniture') + ' Settings';
  if (isCircular) {
    document.getElementById('editFurnDiam').value = f.w;
  } else {
    document.getElementById('editFurnW').value = f.w;
    document.getElementById('editFurnH').value = f.h;
  }
  document.getElementById('editFurnX').value = Math.round(f.x);
  document.getElementById('editFurnY').value = Math.round(f.y);
  const rot = f.rot || 0;
  document.getElementById('editFurnRot').value = rot;
  document.getElementById('editFurnRotVal').value = rot;
}

export function updateActiveFurn() {
  if (!state.selFurn) return;
  const room = state.rooms.find(r => r.furniture.some(f => f.id === state.selFurn));
  if (!room) return;
  const f = room.furniture.find(x => x.id === state.selFurn);
  if (!f) return;
  const fdef = FURNITURE.find(x => x.id === f.type);
  const nx = parseInt(document.getElementById('editFurnX').value);
  const ny = parseInt(document.getElementById('editFurnY').value);
  if (fdef?.circular) {
    const nd = parseInt(document.getElementById('editFurnDiam').value);
    if (nd >= 1) { f.w = nd; f.h = nd; }
  } else {
    const nw = parseInt(document.getElementById('editFurnW').value);
    const nh = parseInt(document.getElementById('editFurnH').value);
    if (nw >= 1) f.w = nw;
    if (nh >= 1) f.h = nh;
  }
  if (!isNaN(nx) && nx >= 0) f.x = nx;
  if (!isNaN(ny) && ny >= 0) f.y = ny;
  if (f.type === 'custom') {
    f.customLabel = document.getElementById('editFurnName').value;
    document.getElementById('furnSettingsTitle').textContent = (f.customLabel || 'Custom') + ' Settings';
  }
  if (f.type === 'rug') {
    const col = document.getElementById('editRugColor').value;
    f.rugColor = col;
    document.getElementById('rugColorHex').textContent = col;
  }
  const rot = parseInt(document.getElementById('editFurnRot').value) || 0;
  f.rot = rot;
  setTimeout(() => _renderCanvas && _renderCanvas(), 0);
}

export function syncFurnRotFromSlider() {
  const rot = parseInt(document.getElementById('editFurnRot').value) || 0;
  document.getElementById('editFurnRotVal').value = rot;
  updateActiveFurn();
}

export function syncFurnRotFromField() {
  let rot = parseInt(document.getElementById('editFurnRotVal').value);
  if (isNaN(rot)) return;
  rot = Math.min(359, Math.max(0, rot));
  document.getElementById('editFurnRotVal').value = rot;
  document.getElementById('editFurnRot').value = rot;
  updateActiveFurn();
}

export function rotateFurnSel() {
  if (!state.selFurn) return;
  const room = state.rooms.find(r => r.furniture.some(f => f.id === state.selFurn));
  if (!room) return;
  rotateFurn(room.id, state.selFurn);
  const f = room.furniture.find(x => x.id === state.selFurn);
  if (f) showFurnSettings(f);
}

export function deleteFurnSel() {
  if (!state.selFurn) return;
  const room = state.rooms.find(r => r.furniture.some(f => f.id === state.selFurn));
  if (room) deleteFurn(room.id, state.selFurn);
}

export function placeFurniture(fdef, roomId, x, y) {
  const room = state.rooms.find(r => r.id === roomId);
  if (!room) return;
  const f = { id: uid(), type: fdef.id, x, y, w: fdef.w, h: fdef.h, rot: 0 };
  room.furniture.push(f);
  pushHistory();
  state.selFurn = f.id;
  state.selWo = null;
  _renderCanvas && _renderCanvas();
  showFurnSettings(f);
  document.querySelector('.sidebar').scrollTop = 0;
}

export function rotateFurn(roomId, furnId) {
  const room = state.rooms.find(r => r.id === roomId);
  const f = room?.furniture.find(x => x.id === furnId);
  if (!f) return;
  [f.w, f.h] = [f.h, f.w];
  _renderCanvas && _renderCanvas();
}

export function deleteFurn(roomId, furnId) {
  const room = state.rooms.find(r => r.id === roomId);
  if (!room) return;
  room.furniture = room.furniture.filter(f => f.id !== furnId);
  pushHistory();
  state.selFurn = null;
  document.getElementById('contextPanel').style.display = 'block';
  document.getElementById('roomSettings').style.display = 'block';
  document.getElementById('furnSettings').style.display = 'none';
  document.getElementById('openingSettings').style.display = 'none';
  document.getElementById('editName').value = room.name;
  document.getElementById('editW').value = room.w;
  document.getElementById('editH').value = room.h;
  renderSwatchesSplit(room.colorIdx, i => { room.colorIdx = i; _renderRoomList && _renderRoomList(); _renderCanvas && _renderCanvas(); });
  _renderCanvas && _renderCanvas();
}

export function clearFurniture() {
  const r = state.rooms.find(r => r.id === state.activeRoomId);
  if (!r) return;
  r.furniture = [];
  _renderCanvas && _renderCanvas();
}

export function makeFurnDraggable(el, room, f, showInfo, hideInfo) {
  let didDrag = false;
  el.addEventListener('mousedown', e => {
    if (e.target.closest('.furn-controls')) return;
    if (state.spaceDown) return;
    e.stopPropagation();
    didDrag = false;
    state.selFurn = f.id;
    state.selWo = null;

    // setActiveRoom without circular import — just update DOM
    state.activeRoomId = room.id;
    document.querySelectorAll('.room-canvas').forEach(el => el.classList.toggle('selected', el.dataset.rid === room.id));

    // Update selection visuals without a full re-render
    document.querySelectorAll('.furn-placed').forEach(fe => fe.classList.toggle('selected-f', fe.dataset.fid === f.id));
    document.querySelectorAll('.wall-opening').forEach(wo => wo.classList.remove('selected-wo'));

    const sc = parseFloat(document.getElementById('zoomSlider').value);
    const ox = e.clientX, oy = e.clientY, sx = f.x, sy = f.y;
    const mv = ev => {
      didDrag = true;
      const snapEnabled = state.snapEnabled;
      const GRID = 6;
      const snap = v => snapEnabled ? Math.round(v / GRID) * GRID : v;
      f.x = snap(sx + (ev.clientX - ox) / sc);
      f.y = snap(sy + (ev.clientY - oy) / sc);
      f.x = Math.max(0, Math.min(room.w - f.w, f.x));
      f.y = Math.max(0, Math.min(room.h - f.h, f.y));
      _renderCanvas && _renderCanvas();
      showInfo(`${FURNITURE.find(x => x.id === f.type)?.label} — ${ins(f.x)} from left · ${ins(f.y)} from top`);
    };
    const up = () => {
      window.removeEventListener('mousemove', mv);
      window.removeEventListener('mouseup', up);
      hideInfo();
      if (!didDrag) {
        showFurnSettings(f);
        document.querySelector('.sidebar').scrollTop = 0;
      } else {
        pushHistory();
        const xEl = document.getElementById('editFurnX');
        const yEl = document.getElementById('editFurnY');
        if (xEl) xEl.value = Math.round(f.x);
        if (yEl) yEl.value = Math.round(f.y);
      }
    };
    window.addEventListener('mousemove', mv);
    window.addEventListener('mouseup', up);
    e.preventDefault();
  });
}
