import './style.css';

import { state } from './state.js';
import { uid, showInfo } from './utils.js';
import { renderCanvas, zoomStep, toggleSnap } from './canvas.js';
import { renderRoomList, setActiveRoom, updateActiveRoom, openAddRoomModal, closeModal, confirmAddRoom, initRoomsCallbacks, deleteRoom, duplicateRoom } from './rooms.js';
import { renderWallPalette, renderFurniturePalette, renderSwatches, cancelWallTool } from './palette.js';
import { showFurnSettings, updateActiveFurn, syncFurnRotFromSlider, syncFurnRotFromField, deleteFurnSel, rotateFurnSel, deleteFurn } from './furniture.js';
import { showOpeningSettings, updateActiveWo, deleteSelWo, initOpeningsCallbacks } from './openings.js';
import { toggleBatchMode, batchAddItem, batchFurnish, batchSelectFurniture, initBatchCallbacks } from './batch.js';
import { saveDesign, loadDesign, deleteDesign, renderSavesList, toggleSavesPanel, initSavesCallbacks } from './saves.js';
import { openPrintModal, closePrintModal, doPrint } from './print.js';
import { initFurnitureCallbacks, placeFurniture } from './furniture.js';
import { pushHistory, undo, redo } from './history.js';

// Wire up cross-module callbacks to break circular deps
initRoomsCallbacks(renderCanvas, showFurnSettings, showOpeningSettings);
initOpeningsCallbacks(renderCanvas, renderRoomList);
initFurnitureCallbacks(renderCanvas, renderRoomList);
initBatchCallbacks(renderCanvas, renderRoomList);
initSavesCallbacks(renderCanvas, renderRoomList);

// ─── TOOLBAR BUTTONS ───
document.getElementById('zoomMinus').addEventListener('click', () => zoomStep(-1));
document.getElementById('zoomPlus').addEventListener('click', () => zoomStep(1));
document.getElementById('zoomSlider').addEventListener('input', () => setTimeout(() => renderCanvas(), 0));
document.getElementById('cancelToolBtn').addEventListener('click', cancelWallTool);
document.getElementById('batchBtn').addEventListener('click', toggleBatchMode);
document.getElementById('clearFurnBtn').addEventListener('click', () => {
  const r = state.rooms.find(r => r.id === state.activeRoomId);
  if (!r) return;
  pushHistory();
  r.furniture = [];
  renderCanvas();
});
document.getElementById('printBtn').addEventListener('click', openPrintModal);
document.getElementById('savesBtn').addEventListener('click', toggleSavesPanel);
document.getElementById('snapBtn').addEventListener('click', toggleSnap);
document.getElementById('undoBtn').addEventListener('click', () => undo(renderCanvas, renderRoomList));
document.getElementById('redoBtn').addEventListener('click', () => redo(renderCanvas, renderRoomList));

// ─── SIDEBAR INPUTS ───
document.getElementById('editName').addEventListener('input', updateActiveRoom);
document.getElementById('editW').addEventListener('input', updateActiveRoom);
document.getElementById('editH').addEventListener('input', updateActiveRoom);
document.getElementById('editWoSize').addEventListener('input', updateActiveWo);
document.getElementById('editWoOffset').addEventListener('input', updateActiveWo);
document.getElementById('editFurnW').addEventListener('input', updateActiveFurn);
document.getElementById('editFurnH').addEventListener('input', updateActiveFurn);
document.getElementById('editFurnX').addEventListener('input', updateActiveFurn);
document.getElementById('editFurnY').addEventListener('input', updateActiveFurn);
document.getElementById('editFurnName').addEventListener('input', updateActiveFurn);
document.getElementById('editRugColor').addEventListener('input', updateActiveFurn);
document.getElementById('editFurnRot').addEventListener('input', syncFurnRotFromSlider);
document.getElementById('editFurnRotVal').addEventListener('input', syncFurnRotFromField);
document.getElementById('deleteFurnBtn').addEventListener('click', deleteFurnSel);
document.getElementById('deleteWoBtn').addEventListener('click', deleteSelWo);

// ─── MODALS ───
document.getElementById('addRoomBtn').addEventListener('click', openAddRoomModal);
document.getElementById('cancelRoomModal').addEventListener('click', closeModal);
document.getElementById('confirmRoomModal').addEventListener('click', confirmAddRoom);
document.getElementById('cancelPrintModal').addEventListener('click', closePrintModal);
document.getElementById('confirmPrintModal').addEventListener('click', doPrint);

// ─── BATCH ───
document.getElementById('batchAddBtn').addEventListener('click', batchAddItem);
document.getElementById('batchFurnishBtn').addEventListener('click', batchFurnish);

// ─── SAVES ───
document.getElementById('saveDesignBtn').addEventListener('click', saveDesign);
document.getElementById('saveNameInput').addEventListener('keydown', e => { if (e.key === 'Enter') saveDesign(); });

// ─── CANVAS CLICK DESELECT ───
document.getElementById('canvasScroll').addEventListener('click', e => {
  if (e.target === document.getElementById('canvasScroll') || e.target === document.getElementById('canvas')) {
    state.selFurn = null;
    state.selWo = null;
    renderCanvas();
    renderRoomList();
  }
});

// ─── SAVES DROPDOWN CLOSE ON OUTSIDE CLICK ───
document.addEventListener('click', e => {
  const dd = document.getElementById('savesDropdown');
  if (dd.style.display === 'none') return;
  if (!dd.contains(e.target) && e.target.id !== 'savesBtn') dd.style.display = 'none';
});

// ─── CTRL+SCROLL ZOOM ───
document.getElementById('canvasScroll').addEventListener('wheel', e => {
  if (!e.ctrlKey && !e.metaKey) return;
  e.preventDefault();
  const sl = document.getElementById('zoomSlider');
  const delta = e.deltaY > 0 ? -0.25 : 0.25;
  sl.value = Math.min(6, Math.max(0.5, parseFloat(sl.value) + delta));
  renderCanvas();
}, { passive: false });

// ─── SPACEBAR PAN ───
const canvasScroll = document.getElementById('canvasScroll');
document.addEventListener('keydown', e => {
  if (e.code === 'Space' && !e.target.matches('input, textarea')) {
    e.preventDefault();
    if (!state.spaceDown) {
      state.spaceDown = true;
      canvasScroll.style.cursor = 'grab';
    }
  }
});
document.addEventListener('keyup', e => {
  if (e.code === 'Space') {
    state.spaceDown = false;
    canvasScroll.style.cursor = '';
  }
});
canvasScroll.addEventListener('scroll', () => {
  const canvas = document.getElementById('canvas');
  const minW = canvasScroll.clientWidth + canvasScroll.scrollLeft + 500;
  const minH = canvasScroll.clientHeight + canvasScroll.scrollTop + 500;
  if (minW > (parseInt(canvas.style.width) || 0)) canvas.style.width = minW + 'px';
  if (minH > (parseInt(canvas.style.height) || 0)) canvas.style.height = minH + 'px';
});

canvasScroll.addEventListener('mousedown', e => {
  if (!state.spaceDown) return;
  e.preventDefault();
  canvasScroll.style.cursor = 'grabbing';
  const startX = e.clientX + canvasScroll.scrollLeft;
  const startY = e.clientY + canvasScroll.scrollTop;
  const mv = ev => {
    canvasScroll.scrollLeft = startX - ev.clientX;
    canvasScroll.scrollTop = startY - ev.clientY;
  };
  const up = () => {
    window.removeEventListener('mousemove', mv);
    window.removeEventListener('mouseup', up);
    canvasScroll.style.cursor = state.spaceDown ? 'grab' : '';
  };
  window.addEventListener('mousemove', mv);
  window.addEventListener('mouseup', up);
});

// ─── KEYBOARD ───
document.addEventListener('keydown', e => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
    e.preventDefault();
    if (e.shiftKey) redo(renderCanvas, renderRoomList);
    else undo(renderCanvas, renderRoomList);
    return;
  }
  if (e.key === 'Delete' || e.key === 'Backspace') {
    if (e.target.tagName === 'INPUT') return;
    if (state.selFurn) {
      const r = state.rooms.find(r => r.furniture.some(f => f.id === state.selFurn));
      if (r) deleteFurn(r.id, state.selFurn);
    } else if (state.selWo) {
      deleteSelWo();
    }
  }
  if (e.key === 'Escape') {
    state.selFurn = null;
    state.selWo = null;
    cancelWallTool();
    renderCanvas();
    renderRoomList();
  }
});

// ─── PALETTES ───
renderWallPalette();
renderFurniturePalette(f => {
  if (state.batchMode) { batchSelectFurniture(f); return; }
  const room = state.rooms.find(r => r.id === state.activeRoomId);
  if (!room) { showInfo('Select a room first'); return; }
  placeFurniture(f, room.id, Math.max(0, room.w / 2 - f.w / 2), Math.max(0, room.h / 2 - f.h / 2));
});
renderSwatches('modalSwatches', state.newRoomColor, i => {
  state.newRoomColor = i;
  renderSwatches('modalSwatches', state.newRoomColor, () => {});
});

// ─── INIT ───
renderRoomList();
renderSavesList();

// Starter room
(() => {
  const r = { id: 'i1', name: 'Living Room', w: 137, h: 182, colorIdx: 0, x: 50, y: 50, furniture: [], openings: [] };
  state.rooms.push(r);
  state.activeRoomId = r.id;
  renderRoomList();
  renderCanvas();
  pushHistory();
})();
