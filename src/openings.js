import { WALL_TYPES } from './constants.js';
import { state } from './state.js';
import { ins } from './utils.js';
import { renderSwatchesSplit } from './palette.js';
import { pushHistory } from './history.js';

let _renderCanvas = null;
let _renderRoomList = null;
export function initOpeningsCallbacks(renderCanvas, renderRoomList) {
  _renderCanvas = renderCanvas;
  _renderRoomList = renderRoomList;
}

export function renderWallOpening(canvas, room, wo, sc, col, roomX, roomY) {
  const wt = WALL_TYPES.find(w => w.id === wo.type) || WALL_TYPES[0];
  const isHoriz = wo.wall === 'top' || wo.wall === 'bottom';
  const sizePx = wo.size * sc;
  const WALL = 6;
  const HIT = 20;

  const el = document.createElement('div');
  el.className = 'wall-opening' + (wo.id === state.selWo ? ' selected-wo' : '');
  el.dataset.woid = wo.id;
  el.dataset.rid = room.id;
  el.style.position = 'absolute';
  el.style.cursor = 'pointer';
  el.style.zIndex = '25';

  if (isHoriz) {
    const wallCY = wo.wall === 'top' ? roomY : roomY + room.h * sc;
    el.style.left = `${roomX + wo.offset * sc}px`;
    el.style.top = `${wallCY - HIT / 2}px`;
    el.style.width = `${sizePx}px`;
    el.style.height = `${HIT}px`;
  } else {
    const wallCX = wo.wall === 'left' ? roomX : roomX + room.w * sc;
    el.style.left = `${wallCX - HIT / 2}px`;
    el.style.top = `${roomY + wo.offset * sc}px`;
    el.style.width = `${HIT}px`;
    el.style.height = `${sizePx}px`;
  }

  const svgW = isHoriz ? sizePx : HIT;
  const svgH = isHoriz ? HIT : sizePx;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', svgW);
  svg.setAttribute('height', svgH);
  svg.style.cssText = 'position:absolute;left:0;top:0;overflow:visible;';

  const ns = 'http://www.w3.org/2000/svg';
  const mid = HIT / 2;

  const gap = document.createElementNS(ns, 'rect');
  if (isHoriz) {
    gap.setAttribute('x', 0); gap.setAttribute('y', mid - WALL / 2);
    gap.setAttribute('width', sizePx); gap.setAttribute('height', WALL);
  } else {
    gap.setAttribute('x', mid - WALL / 2); gap.setAttribute('y', 0);
    gap.setAttribute('width', WALL); gap.setAttribute('height', sizePx);
  }
  gap.setAttribute('fill', '#f5f0e8');
  svg.appendChild(gap);

  if (wt.sym === 'window') {
    const outline = document.createElementNS(ns, 'rect');
    if (isHoriz) {
      outline.setAttribute('x', 0); outline.setAttribute('y', mid - WALL / 2);
      outline.setAttribute('width', sizePx); outline.setAttribute('height', WALL);
    } else {
      outline.setAttribute('x', mid - WALL / 2); outline.setAttribute('y', 0);
      outline.setAttribute('width', WALL); outline.setAttribute('height', sizePx);
    }
    outline.setAttribute('fill', 'none');
    outline.setAttribute('stroke', '#000');
    outline.setAttribute('stroke-width', '1');
    svg.appendChild(outline);

  } else if (wt.sym === 'door' || wt.sym === 'door-dbl') {
    const roomSide = isHoriz
      ? (wo.wall === 'top' ? 1 : -1)
      : (wo.wall === 'left' ? 1 : -1);

    if (wt.sym === 'door') {
      const hinge = document.createElementNS(ns, 'line');
      const arc = document.createElementNS(ns, 'path');
      const ARC = sizePx;
      if (isHoriz) {
        hinge.setAttribute('x1', 0); hinge.setAttribute('y1', mid); hinge.setAttribute('x2', 0); hinge.setAttribute('y2', mid + roomSide * WALL);
        arc.setAttribute('d', roomSide > 0
          ? `M 0,${mid} A ${ARC},${ARC} 0 0,1 ${sizePx},${mid}`
          : `M 0,${mid} A ${ARC},${ARC} 0 0,0 ${sizePx},${mid}`);
      } else {
        hinge.setAttribute('x1', mid); hinge.setAttribute('y1', 0); hinge.setAttribute('x2', mid + roomSide * WALL); hinge.setAttribute('y2', 0);
        arc.setAttribute('d', roomSide > 0
          ? `M ${mid},0 A ${ARC},${ARC} 0 0,1 ${mid},${sizePx}`
          : `M ${mid},0 A ${ARC},${ARC} 0 0,0 ${mid},${sizePx}`);
      }
      hinge.setAttribute('stroke', col.b); hinge.setAttribute('stroke-width', '1.5');
      arc.setAttribute('stroke', col.b); arc.setAttribute('stroke-width', '1'); arc.setAttribute('fill', 'none'); arc.setAttribute('stroke-dasharray', '3,2');
      svg.appendChild(hinge); svg.appendChild(arc);
    } else {
      const half = sizePx / 2;
      const arc1 = document.createElementNS(ns, 'path');
      const arc2 = document.createElementNS(ns, 'path');
      if (isHoriz) {
        arc1.setAttribute('d', roomSide > 0 ? `M 0,${mid} A ${half},${half} 0 0,1 ${half},${mid}` : `M 0,${mid} A ${half},${half} 0 0,0 ${half},${mid}`);
        arc2.setAttribute('d', roomSide > 0 ? `M ${sizePx},${mid} A ${half},${half} 0 0,0 ${half},${mid}` : `M ${sizePx},${mid} A ${half},${half} 0 0,1 ${half},${mid}`);
      } else {
        arc1.setAttribute('d', roomSide > 0 ? `M ${mid},0 A ${half},${half} 0 0,1 ${mid},${half}` : `M ${mid},0 A ${half},${half} 0 0,0 ${mid},${half}`);
        arc2.setAttribute('d', roomSide > 0 ? `M ${mid},${sizePx} A ${half},${half} 0 0,0 ${mid},${half}` : `M ${mid},${sizePx} A ${half},${half} 0 0,1 ${mid},${half}`);
      }
      [arc1, arc2].forEach(a => { a.setAttribute('stroke', col.b); a.setAttribute('stroke-width', '1'); a.setAttribute('fill', 'none'); a.setAttribute('stroke-dasharray', '3,2'); svg.appendChild(a); });
    }

  } else if (wt.sym === 'entry') {
    // plain white gap

  } else {
    // archway
    const d1 = document.createElementNS(ns, 'line');
    const d2 = document.createElementNS(ns, 'line');
    if (isHoriz) {
      d1.setAttribute('x1', 0); d1.setAttribute('y1', mid - WALL / 2); d1.setAttribute('x2', 0); d1.setAttribute('y2', mid + WALL / 2);
      d2.setAttribute('x1', sizePx); d2.setAttribute('y1', mid - WALL / 2); d2.setAttribute('x2', sizePx); d2.setAttribute('y2', mid + WALL / 2);
    } else {
      d1.setAttribute('x1', mid - WALL / 2); d1.setAttribute('y1', 0); d1.setAttribute('x2', mid + WALL / 2); d1.setAttribute('y2', 0);
      d2.setAttribute('x1', mid - WALL / 2); d2.setAttribute('y1', sizePx); d2.setAttribute('x2', mid + WALL / 2); d2.setAttribute('y2', sizePx);
    }
    [d1, d2].forEach(d => { d.setAttribute('stroke', col.b); d.setAttribute('stroke-width', '2'); svg.appendChild(d); });
  }

  if (wo.id === state.selWo) {
    const hl = document.createElementNS(ns, 'rect');
    hl.setAttribute('x', isHoriz ? 0 : mid - HIT / 2);
    hl.setAttribute('y', isHoriz ? mid - HIT / 2 : 0);
    hl.setAttribute('width', isHoriz ? sizePx : HIT);
    hl.setAttribute('height', isHoriz ? HIT : sizePx);
    hl.setAttribute('fill', 'none'); hl.setAttribute('stroke', '#2e6fc4'); hl.setAttribute('stroke-width', '1.5'); hl.setAttribute('stroke-dasharray', '4,2'); hl.setAttribute('rx', '2');
    svg.appendChild(hl);
  }

  el.appendChild(svg);

  el.addEventListener('click', e => {
    e.stopPropagation();
    if (state.activeWallTool) return;
    state.selFurn = null;
    state.selWo = wo.id;
    document.querySelectorAll('.wall-opening').forEach(x => x.classList.remove('selected-wo'));
    el.classList.add('selected-wo');
    showOpeningSettings(wo);
  });

  makeWoDraggable(el, room, wo, sc, isHoriz, HIT, roomX, roomY);
  canvas.appendChild(el);
}

function makeWoDraggable(el, room, wo, sc, isHoriz, HIT, roomX, roomY) {
  el.addEventListener('mousedown', e => {
    if (state.activeWallTool) return;
    e.stopPropagation();
    const startMouse = isHoriz ? e.clientX : e.clientY;
    const startOff = wo.offset;
    const onMove = ev => {
      const cur = isHoriz ? ev.clientX : ev.clientY;
      wo.offset = Math.max(0, startOff + (cur - startMouse) / sc);
      if (isHoriz) el.style.left = `${roomX + wo.offset * sc}px`;
      else el.style.top = `${roomY + wo.offset * sc}px`;
    };
    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      pushHistory();
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    e.preventDefault();
  });
}

export function showOpeningSettings(wo) {
  const wt = WALL_TYPES.find(w => w.id === wo.type) || WALL_TYPES[0];
  document.getElementById('contextPanel').style.display = 'block';
  document.getElementById('roomSettings').style.display = 'none';
  document.getElementById('openingSettings').style.display = 'block';
  document.getElementById('furnSettings').style.display = 'none';
  document.getElementById('openingSettingsTitle').textContent = wt.label + ' Settings';
  document.getElementById('editWoSize').value = wo.size;
  document.getElementById('editWoOffset').value = wo.offset;
}

export function updateActiveWo() {
  if (!state.selWo) return;
  const room = state.rooms.find(r => r.openings?.some(w => w.id === state.selWo));
  if (!room) return;
  const wo = room.openings.find(w => w.id === state.selWo);
  if (!wo) return;
  const newSize = parseInt(document.getElementById('editWoSize').value);
  const newOffset = parseInt(document.getElementById('editWoOffset').value);
  if (newSize >= 1) wo.size = newSize;
  if (!isNaN(newOffset) && newOffset >= 0) wo.offset = newOffset;
  setTimeout(() => _renderCanvas && _renderCanvas(), 0);
}

export function deleteSelWo() {
  if (!state.selWo) return;
  const room = state.rooms.find(r => r.openings?.some(w => w.id === state.selWo));
  if (room) deleteWo(room.id, state.selWo);
}

export function deleteWo(roomId, woId) {
  const room = state.rooms.find(r => r.id === roomId);
  if (!room) return;
  pushHistory();
  room.openings = room.openings.filter(w => w.id !== woId);
  state.selWo = null;
  document.getElementById('openingSettings').style.display = 'none';
  document.getElementById('roomSettings').style.display = 'block';
  document.getElementById('editName').value = room.name;
  document.getElementById('editW').value = room.w;
  document.getElementById('editH').value = room.h;
  renderSwatchesSplit(room.colorIdx, i => { room.colorIdx = i; _renderRoomList && _renderRoomList(); _renderCanvas && _renderCanvas(); });
  _renderCanvas && _renderCanvas();
}
