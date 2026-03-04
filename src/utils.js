import { GRID } from './constants.js';
import { state } from './state.js';

export { S } from './constants.js';

let nid = 1;
export function uid() { return 'i' + (nid++); }

export function ins(v) {
  const ft = Math.floor(Math.abs(v) / 12), inch = Math.round(Math.abs(v) % 12);
  if (ft === 0) return `${inch}"`;
  if (inch === 0) return `${ft}'`;
  return `${ft}' ${inch}"`;
}

export function snapV(v) {
  return state.snapEnabled ? Math.round(v / GRID) * GRID : v;
}

export function showInfo(m) {
  const p = document.getElementById('infoPanel');
  p.textContent = m;
  p.classList.add('show');
}

export function hideInfo() {
  document.getElementById('infoPanel').classList.remove('show');
}
