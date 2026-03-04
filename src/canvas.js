import { COLORS, FURNITURE, FURNITURE_SVGS, WALL_TYPES, S } from './constants.js';

export const CANVAS_PAD = 500;
import { state } from './state.js';
import { ins, snapV, showInfo, hideInfo } from './utils.js';
import { renderWallOpening, showOpeningSettings } from './openings.js';
import { makeFurnDraggable, showFurnSettings, placeFurniture, deleteFurn } from './furniture.js';
import { setActiveRoom, renderRoomList } from './rooms.js';
import { cancelWallTool } from './palette.js';
import { pushHistory } from './history.js';

export function renderCanvas() {
  const canvas = document.getElementById('canvas');
  canvas.querySelectorAll('.room-canvas, .wall-opening').forEach(el => el.remove());
  const sc = S.get();
  let maxX = 200, maxY = 200;

  state.rooms.forEach(room => {
    const col = COLORS[room.colorIdx];
    const pw = room.w * sc, ph = room.h * sc;
    const el = document.createElement('div');
    el.className = 'room-canvas' + (room.id === state.activeRoomId ? ' selected' : '');
    el.dataset.rid = room.id;
    el.style.cssText = `left:${room.x + CANVAS_PAD}px;top:${room.y + CANVAS_PAD}px;width:${pw}px;height:${ph}px;border-color:${col.b};background:${col.bg};`;

    el.innerHTML = `
      <div class="room-label" style="color:${col.b}">${room.name}</div>
      <div class="room-dims-label">${ins(room.w)} × ${ins(room.h)}</div>
      <div class="resize-handle"></div>
    `;

    const dTop = document.createElement('div');
    dTop.className = 'dim-horiz';
    dTop.style.cssText = 'top:-26px;left:0;right:0;';
    dTop.innerHTML = `<div class="dim-bar-h"></div><div class="dim-txt">${ins(room.w)}</div><div class="dim-bar-h"></div>`;
    el.appendChild(dTop);

    const dLeft = document.createElement('div');
    dLeft.className = 'dim-vert';
    dLeft.style.cssText = 'left:-26px;top:0;bottom:0;';
    dLeft.innerHTML = `<div class="dim-bar-v"></div><div class="dim-txt-v">${ins(room.h)}</div><div class="dim-bar-v"></div>`;
    el.appendChild(dLeft);

    const sortedFurniture = [...room.furniture].sort((a, b) => (a.type === 'rug' ? -1 : 0) - (b.type === 'rug' ? -1 : 0));
    sortedFurniture.forEach(f => {
      const fdef = FURNITURE.find(x => x.id === f.type);
      if (!fdef) return;
      const fw = f.w * sc, fh = f.h * sc;
      const isSel = f.id === state.selFurn;

      const fel = document.createElement('div');
      fel.className = 'furn-placed' + (isSel ? ' selected-f' : '');
      fel.dataset.fid = f.id;
      const isRug = f.type === 'rug';
      const furnBg = col.bg.replace(/[\d.]+\)$/, '0.34)');
      const rugBg = isRug ? (f.rugColor || '#c8a882') : furnBg;
      const rugOpacity = isRug ? '0.55' : '1';
      const frot = f.rot || 0;
      fel.style.cssText = `left:${f.x * sc}px;top:${f.y * sc}px;width:${fw}px;height:${fh}px;background:${rugBg};opacity:${rugOpacity};z-index:${isRug ? 1 : 5};${f.type === 'lamp' ? 'border-radius:50%;' : ''}transform:rotate(${frot}deg);transform-origin:center center;`;

      if (f.type !== 'lamp') {
        const dimTop = document.createElement('div');
        dimTop.className = 'fd-top';
        dimTop.innerHTML = `
          <div style="position:relative;width:100%;height:100%;">
            <div class="fd-line-h"></div>
            <div class="fd-cap" style="left:0;top:50%;width:1px;height:8px;transform:translateY(-50%)"></div>
            <div class="fd-cap" style="right:0;top:50%;width:1px;height:8px;transform:translateY(-50%)"></div>
            <div class="fd-txt-h">${ins(f.w)}</div>
          </div>`;
        fel.appendChild(dimTop);

        const dimLeft = document.createElement('div');
        dimLeft.className = 'fd-left';
        dimLeft.innerHTML = `
          <div style="position:relative;width:100%;height:100%;">
            <div class="fd-line-v"></div>
            <div class="fd-cap" style="top:0;left:50%;height:1px;width:8px;transform:translateX(-50%)"></div>
            <div class="fd-cap" style="bottom:0;left:50%;height:1px;width:8px;transform:translateX(-50%)"></div>
            <div class="fd-txt-v">${ins(f.h)}</div>
          </div>`;
        fel.appendChild(dimLeft);
      }

      const ctrl = document.createElement('div');
      ctrl.className = 'furn-controls';
      ctrl.innerHTML = `<button data-delete-furn="${room.id}|${f.id}">✕</button>`;
      fel.appendChild(ctrl);

      if (!isRug) {
        const iconSize = f.type === 'lamp' ? Math.min(fw, fh) * 0.7 : Math.min(fw, fh) * 0.45;
        if (FURNITURE_SVGS[f.type]) {
          const iconWrap = document.createElement('div');
          iconWrap.className = 'f-icon';
          iconWrap.style.cssText = `width:${iconSize}px;height:${iconSize}px;display:flex;align-items:center;justify-content:center;color:#444;flex-shrink:0;`;
          iconWrap.innerHTML = FURNITURE_SVGS[f.type].replace('<svg ', `<svg style="width:100%;height:100%;" `);
          fel.appendChild(iconWrap);
        } else {
          const icon = document.createElement('div');
          icon.className = 'f-icon';
          icon.textContent = fdef.icon;
          icon.style.fontSize = f.type === 'lamp' ? '1rem' : `${Math.max(0.6, Math.min(fw, fh) * 0.035)}rem`;
          fel.appendChild(icon);
        }
        const name = document.createElement('div');
        name.className = 'f-name';
        name.textContent = f.customLabel || fdef.label;
        fel.appendChild(name);
      }

      makeFurnDraggable(fel, room, f, showInfo, hideInfo);
      el.appendChild(fel);
    });

    (room.openings || []).forEach(wo => renderWallOpening(canvas, room, wo, sc, col, room.x + CANVAS_PAD, room.y + CANVAS_PAD));

    makeRoomDraggable(el, room);
    makeRoomResizable(el, room);
    makeDropTarget(el, room);
    makeWallClickHandler(el, room);

    el.addEventListener('click', e => {
      if (e.target.closest('.furn-placed') || e.target.closest('.wall-opening')) return;
      state.selFurn = null;
      state.selWo = null;
      setActiveRoom(room.id);
    });

    canvas.appendChild(el);
    maxX = Math.max(maxX, room.x + CANVAS_PAD + pw + 80);
    maxY = Math.max(maxY, room.y + CANVAS_PAD + ph + 80);
  });

  // Event delegation for furn delete buttons
  canvas.querySelectorAll('[data-delete-furn]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const [roomId, furnId] = btn.dataset.deleteFurn.split('|');
      deleteFurn(roomId, furnId);
    });
  });

  const scrollEl = document.getElementById('canvasScroll');
  canvas.style.width = Math.max(maxX, scrollEl.clientWidth + scrollEl.scrollLeft + 500) + 'px';
  canvas.style.height = Math.max(maxY, scrollEl.clientHeight + scrollEl.scrollTop + 500) + 'px';
  document.getElementById('scaleInfo').textContent = `${(12 * sc).toFixed(0)}px = 1 ft`;
  document.getElementById('zoomLabel').textContent = `${Math.round(sc / 3 * 100)}%`;
}

function makeRoomDraggable(el, room) {
  el.addEventListener('mousedown', e => {
    if (e.target.classList.contains('resize-handle')) return;
    if (e.target.closest('.furn-placed') || e.target.closest('.wall-opening')) return;
    if (state.activeWallTool) return;
    if (state.spaceDown) return;
    setActiveRoom(room.id);
    const ox = e.clientX, oy = e.clientY, sx = room.x, sy = room.y;
    const mv = ev => {
      room.x = Math.max(0, Math.round((sx + ev.clientX - ox) / 10) * 10);
      room.y = Math.max(0, Math.round((sy + ev.clientY - oy) / 10) * 10);
      renderCanvas();
    };
    const up = () => { window.removeEventListener('mousemove', mv); window.removeEventListener('mouseup', up); };
    window.addEventListener('mousemove', mv);
    window.addEventListener('mouseup', up);
    e.preventDefault();
  });
}

function makeRoomResizable(el, room) {
  const h = el.querySelector('.resize-handle');
  h.addEventListener('mousedown', e => {
    e.stopPropagation();
    const sc = S.get(), ox = e.clientX, oy = e.clientY, sw = room.w, sh = room.h;
    const mv = ev => {
      room.w = Math.max(48, snapV(sw + (ev.clientX - ox) / sc));
      room.h = Math.max(48, snapV(sh + (ev.clientY - oy) / sc));
      renderRoomList();
      renderCanvas();
    };
    const up = () => { window.removeEventListener('mousemove', mv); window.removeEventListener('mouseup', up); };
    window.addEventListener('mousemove', mv);
    window.addEventListener('mouseup', up);
    e.preventDefault();
  });
}

function makeDropTarget(el, room) {
  el.addEventListener('dragover', e => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; });
  el.addEventListener('drop', e => {
    e.preventDefault();
    if (!state.dragFurnType) return;
    const fdef = FURNITURE.find(f => f.id === state.dragFurnType);
    if (!fdef) return;
    const sc = S.get(), rect = el.getBoundingClientRect();
    let fx = (e.clientX - rect.left) / sc - fdef.w / 2;
    let fy = (e.clientY - rect.top) / sc - fdef.h / 2;
    fx = snapV(fx); fy = snapV(fy);
    fx = Math.max(0, Math.min(room.w - fdef.w, fx));
    fy = Math.max(0, Math.min(room.h - fdef.h, fy));
    placeFurniture(fdef, room.id, fx, fy);
    state.dragFurnType = null;
  });
}

function makeWallClickHandler(el, room) {
  el.addEventListener('click', e => {
    if (!state.activeWallTool) return;
    if (e.target.closest('.furn-placed') || e.target.closest('.wall-opening')) return;
    const sc = S.get();
    const rect = el.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    const pw = room.w * sc, ph = room.h * sc;
    const EDGE = 22;
    let wall = null, rawOff = 0;
    if (my < EDGE) { wall = 'top'; rawOff = mx; }
    else if (my > ph - EDGE) { wall = 'bottom'; rawOff = mx; }
    else if (mx < EDGE) { wall = 'left'; rawOff = my; }
    else if (mx > pw - EDGE) { wall = 'right'; rawOff = my; }
    if (!wall) { showInfo('Click closer to a wall edge to place'); setTimeout(hideInfo, 2500); return; }
    const wt = WALL_TYPES.find(w => w.id === state.activeWallTool);
    const wallLen = (wall === 'top' || wall === 'bottom') ? room.w : room.h;
    let off = snapV(rawOff / sc - wt.size / 2);
    off = Math.max(0, Math.min(wallLen - wt.size, off));
    if (!room.openings) room.openings = [];
    room.openings.push({ id: (Math.random().toString(36).slice(2)), type: state.activeWallTool, wall, offset: off, size: wt.size });
    pushHistory();
    cancelWallTool();
    renderCanvas();
  });
}

export function zoomStep(dir) {
  const sl = document.getElementById('zoomSlider');
  sl.value = Math.min(6, Math.max(0.5, parseFloat(sl.value) + dir * 0.5));
  renderCanvas();
}

export function toggleSnap() {
  state.snapEnabled = !state.snapEnabled;
  const btn = document.getElementById('snapBtn');
  if (state.snapEnabled) {
    btn.textContent = 'Snap: ON';
    btn.style.background = 'var(--accent2)';
    btn.style.color = 'white';
    btn.style.borderColor = 'var(--accent2)';
  } else {
    btn.textContent = 'Snap: OFF';
    btn.style.background = 'var(--paper)';
    btn.style.color = 'var(--muted)';
    btn.style.borderColor = 'var(--grid)';
  }
}
