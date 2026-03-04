import { state } from './state.js';

const MAX = 50;
let stack = [];
let index = -1;

export function pushHistory() {
  // Discard any redo states ahead of current position
  stack = stack.slice(0, index + 1);
  stack.push(JSON.stringify(state.rooms));
  if (stack.length > MAX) stack.shift();
  index = stack.length - 1;
  updateButtons();
}

export function undo(renderCanvas, renderRoomList) {
  if (index <= 0) return;
  index--;
  state.rooms = JSON.parse(stack[index]);
  state.selFurn = null;
  state.selWo = null;
  renderRoomList();
  renderCanvas();
  updateButtons();
}

export function redo(renderCanvas, renderRoomList) {
  if (index >= stack.length - 1) return;
  index++;
  state.rooms = JSON.parse(stack[index]);
  state.selFurn = null;
  state.selWo = null;
  renderRoomList();
  renderCanvas();
  updateButtons();
}

function updateButtons() {
  const undoBtn = document.getElementById('undoBtn');
  const redoBtn = document.getElementById('redoBtn');
  if (undoBtn) undoBtn.disabled = index <= 0;
  if (redoBtn) redoBtn.disabled = index >= stack.length - 1;
}
