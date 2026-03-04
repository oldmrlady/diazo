import { state } from './state.js';
import { uid, ins, showInfo, hideInfo } from './utils.js';
import { setShowBatchPanelRef } from './rooms.js';

let _renderCanvas = null;
let _renderRoomList = null;
export function initBatchCallbacks(renderCanvas, renderRoomList) {
  _renderCanvas = renderCanvas;
  _renderRoomList = renderRoomList;
  setShowBatchPanelRef(showBatchPanel);
}

export function toggleBatchMode() {
  state.batchMode = !state.batchMode;
  state.batchQueue = [];
  state.batchPendingFdef = null;
  const btn = document.getElementById('batchBtn');
  btn.style.background = state.batchMode ? 'var(--accent2)' : '';
  btn.style.color = state.batchMode ? 'white' : '';
  btn.style.borderColor = state.batchMode ? 'var(--accent2)' : '';
  if (state.batchMode) {
    state.selFurn = null;
    state.selWo = null;
    showBatchPanel();
  } else {
    hideBatchPanel();
    _renderRoomList && _renderRoomList();
  }
}

export function showBatchPanel() {
  document.getElementById('contextPanel').style.display = 'block';
  document.getElementById('roomSettings').style.display = 'none';
  document.getElementById('openingSettings').style.display = 'none';
  document.getElementById('furnSettings').style.display = 'none';
  document.getElementById('batchSettings').style.display = 'block';
  document.getElementById('batchCurrent').style.display = 'none';
  renderBatchQueue();
}

export function hideBatchPanel() {
  state.batchMode = false;
  const btn = document.getElementById('batchBtn');
  btn.style.background = '';
  btn.style.color = '';
  btn.style.borderColor = '';
  document.getElementById('batchSettings').style.display = 'none';
}

export function batchSelectFurniture(fdef) {
  if (!state.batchMode) return;
  state.batchPendingFdef = fdef;
  document.getElementById('batchCurrent').style.display = 'block';
  document.getElementById('batchCurrentLabel').textContent = fdef.icon + ' ' + fdef.label;
  document.getElementById('batchW').value = fdef.w;
  document.getElementById('batchH').value = fdef.h;
  const isCustom = fdef.id === 'custom';
  document.getElementById('batchNameRow').style.display = isCustom ? 'flex' : 'none';
  if (isCustom) document.getElementById('batchFurnName').value = '';
  document.querySelector('.sidebar').scrollTop = 0;
}

export function batchAddItem() {
  if (!state.batchPendingFdef) return;
  const w = parseInt(document.getElementById('batchW').value) || state.batchPendingFdef.w;
  const h = parseInt(document.getElementById('batchH').value) || state.batchPendingFdef.h;
  const customLabel = state.batchPendingFdef.id === 'custom'
    ? (document.getElementById('batchFurnName').value || 'Custom')
    : null;
  state.batchQueue.push({ id: uid(), fdef: state.batchPendingFdef, w, h, customLabel });
  state.batchPendingFdef = null;
  document.getElementById('batchCurrent').style.display = 'none';
  renderBatchQueue();
}

function renderBatchQueue() {
  const wrap = document.getElementById('batchQueueWrap');
  const list = document.getElementById('batchQueue');
  document.getElementById('batchCount').textContent = state.batchQueue.length;
  wrap.style.display = state.batchQueue.length ? 'block' : 'none';
  list.innerHTML = '';
  state.batchQueue.forEach(item => {
    const label = item.customLabel || item.fdef.label;
    const row = document.createElement('div');
    row.style.cssText = 'display:flex;align-items:center;gap:6px;padding:5px 8px;background:var(--paper);border:1px solid var(--grid);border-radius:4px;cursor:pointer;font-size:0.68rem;';
    row.innerHTML = `
      <span style="font-size:0.9rem">${item.fdef.icon}</span>
      <span style="flex:1">${label} <span style="color:var(--muted);font-size:0.6rem">${ins(item.w)}×${ins(item.h)}</span></span>
      <button data-batch-remove="${item.id}" style="background:none;border:none;cursor:pointer;color:var(--accent);font-size:0.75rem;padding:0 2px">✕</button>`;
    row.addEventListener('click', e => {
      if (e.target.tagName === 'BUTTON') return;
      batchEditItem(item);
    });
    row.querySelector('[data-batch-remove]').addEventListener('click', e => {
      e.stopPropagation();
      batchRemoveItem(item.id);
    });
    list.appendChild(row);
  });
}

function batchEditItem(item) {
  state.batchPendingFdef = item.fdef;
  document.getElementById('batchCurrent').style.display = 'block';
  document.getElementById('batchCurrentLabel').textContent = item.fdef.icon + ' ' + (item.customLabel || item.fdef.label);
  document.getElementById('batchW').value = item.w;
  document.getElementById('batchH').value = item.h;
  const isCustom = item.fdef.id === 'custom';
  document.getElementById('batchNameRow').style.display = isCustom ? 'flex' : 'none';
  if (isCustom) document.getElementById('batchFurnName').value = item.customLabel || '';
  document.querySelector('.sidebar').scrollTop = 0;
  const addBtn = document.querySelector('#batchCurrent button');
  addBtn.textContent = '✓ Update';
  addBtn.onclick = () => {
    item.w = parseInt(document.getElementById('batchW').value) || item.w;
    item.h = parseInt(document.getElementById('batchH').value) || item.h;
    if (isCustom) item.customLabel = document.getElementById('batchFurnName').value || 'Custom';
    state.batchPendingFdef = null;
    document.getElementById('batchCurrent').style.display = 'none';
    addBtn.textContent = '+ Add to List';
    addBtn.onclick = batchAddItem;
    renderBatchQueue();
  };
}

function batchRemoveItem(id) {
  state.batchQueue = state.batchQueue.filter(i => i.id !== id);
  renderBatchQueue();
}

export function batchFurnish() {
  const room = state.rooms.find(r => r.id === state.activeRoomId);
  if (!room) { showInfo('Select a room first'); setTimeout(hideInfo, 2000); return; }
  if (!state.batchQueue.length) return;

  const MARGIN = 12;
  let cx = MARGIN, cy = MARGIN, rowH = 0;

  state.batchQueue.forEach(item => {
    if (cx + item.w + MARGIN > room.w && cx > MARGIN) {
      cx = MARGIN; cy += rowH + MARGIN; rowH = 0;
    }
    const f = { id: uid(), type: item.fdef.id, x: cx, y: cy, w: item.w, h: item.h, rot: 0 };
    if (item.customLabel) f.customLabel = item.customLabel;
    room.furniture.push(f);
    cx += item.w + MARGIN;
    rowH = Math.max(rowH, item.h);
  });

  state.batchQueue = [];
  toggleBatchMode();
  _renderCanvas && _renderCanvas();
  showInfo(`${room.furniture.length} items placed`);
  setTimeout(hideInfo, 2500);
}
