import { FURNITURE, WALL_TYPES } from './constants.js';
import { state } from './state.js';

export function openPrintModal() {
  const preview = document.getElementById('printPreview');
  if (!state.rooms.length) {
    preview.innerHTML = '<div style="color:var(--muted);text-align:center;padding:20px;">No rooms added yet.</div>';
  } else {
    let html = '';
    state.rooms.forEach(room => {
      html += `<div style="margin-bottom:12px;padding-bottom:12px;border-bottom:1px solid var(--grid);">
        <div style="font-weight:500;margin-bottom:2px;">${room.name}</div>
        <div style="color:var(--muted);font-size:0.62rem;margin-bottom:6px;">${room.w}" wide × ${room.h}" deep</div>`;
      const colStyle = `style="padding:2px 6px 2px 0;color:var(--muted);font-size:0.68rem;"`;
      const headStyle = `style="font-size:0.6rem;text-transform:uppercase;letter-spacing:0.08em;color:var(--muted);padding:6px 6px 2px 0;text-align:left;"`;
      html += `<table style="width:100%;border-collapse:collapse;">
        <thead><tr>
          <th ${headStyle}>Furniture</th>
          <th ${headStyle}>Width</th>
          <th ${headStyle}>Depth</th>
        </tr></thead><tbody>`;
      if (room.furniture && room.furniture.length) {
        room.furniture.forEach(f => {
          const fdef = FURNITURE.find(x => x.id === f.type);
          const label = (f.type === 'custom' && f.customLabel) ? f.customLabel : (fdef ? fdef.label : f.type);
          html += `<tr><td ${colStyle}>${label}</td><td ${colStyle}>${f.w}"</td><td ${colStyle}>${f.h}"</td></tr>`;
        });
      } else {
        html += `<tr><td colspan="3" ${colStyle} style="font-style:italic;">No furniture added</td></tr>`;
      }
      if (room.openings && room.openings.length) {
        html += `<tr><td colspan="3" ${headStyle}>Wall Openings</td></tr>`;
        html += `<tr><th ${headStyle}></th><th ${headStyle}>Size</th><th></th></tr>`;
        room.openings.forEach(wo => {
          const wt = WALL_TYPES.find(w => w.id === wo.type) || WALL_TYPES[0];
          html += `<tr><td ${colStyle}>${wt.label}</td><td ${colStyle}>${wo.size}"</td><td></td></tr>`;
        });
      }
      html += `</tbody></table></div>`;
    });
    preview.innerHTML = html;
  }
  document.getElementById('printModal').classList.add('open');
}

export function closePrintModal() {
  document.getElementById('printModal').classList.remove('open');
}

export function doPrint() {
  closePrintModal();
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  let body = '';
  state.rooms.forEach(room => {
    let rows = '';
    if (room.furniture && room.furniture.length) {
      room.furniture.forEach(f => {
        const fdef = FURNITURE.find(x => x.id === f.type);
        const label = (f.type === 'custom' && f.customLabel) ? f.customLabel : (fdef ? fdef.label : f.type);
        rows += `<tr><td>${label}</td><td>${f.w}"</td><td>${f.h}"</td></tr>`;
      });
    } else {
      rows = `<tr><td colspan="3" class="empty">No furniture added</td></tr>`;
    }
    let openingRows = '';
    if (room.openings && room.openings.length) {
      room.openings.forEach(wo => {
        const wt = WALL_TYPES.find(w => w.id === wo.type) || WALL_TYPES[0];
        openingRows += `<tr><td>${wt.label}</td><td>${wo.size}"</td><td></td></tr>`;
      });
    }
    const openingSection = openingRows ? `
        <tr class="section-row"><td colspan="3">Wall Openings</td></tr>
        <tr class="subhead-row"><th>Type</th><th>Size</th><th></th></tr>
        ${openingRows}` : '';
    body += `<div class="room">
      <div class="room-title">${room.name}</div>
      <div class="room-dims">${room.w}" wide × ${room.h}" deep</div>
      <table>
        <thead>
          <tr class="section-row"><td colspan="3">Furniture</td></tr>
          <tr class="subhead-row"><th>Item</th><th>Width</th><th>Depth</th></tr>
        </thead>
        <tbody>${rows}${openingSection}</tbody>
      </table>
    </div>`;
  });

  const win = window.open('', '_blank', 'width=720,height=960');
  win.document.write(`<!DOCTYPE html><html>
<head>
<meta charset="UTF-8">
<title>Floor Plan Report</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Poppins:wght@400;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Mono', monospace; color: #1a1612; padding: 48px; background: #fff; font-size: 11px; }
  header { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 2px solid #1a1612; padding-bottom: 14px; margin-bottom: 28px; }
  header h1 { font-family: 'Poppins', sans-serif; font-weight: 400; font-size: 24px; letter-spacing: 0.01em; }
  header .sub { font-size: 9px; color: #7a7068; text-transform: uppercase; letter-spacing: 0.12em; margin-top: 3px; }
  header .date { font-size: 10px; color: #7a7068; }
  .room { margin-bottom: 28px; page-break-inside: avoid; }
  .room-title { font-family: 'Poppins', sans-serif; font-size: 14px; font-weight: 600; margin-bottom: 2px; }
  .room-dims { color: #7a7068; font-size: 10px; margin-bottom: 10px; }
  table { width: 100%; border-collapse: collapse; }
  th { text-align: left; font-size: 9px; text-transform: uppercase; letter-spacing: 0.1em; color: #7a7068; border-bottom: 1px solid #d8d0c4; padding: 5px 10px; }
  td { padding: 6px 10px; border-bottom: 1px solid #ede8df; }
  tr:last-child td { border-bottom: none; }
  td.empty { color: #aaa; font-style: italic; }
  tr.section-row td { font-size: 9px; text-transform: uppercase; letter-spacing: 0.1em; color: #7a7068; padding: 12px 10px 4px; border-bottom: none; }
  tr.section-row:first-child td { padding-top: 0; }
  tr.subhead-row th { border-bottom: 1px solid #d8d0c4; }
  @media print { body { padding: 24px; } }
</style>
</head>
<body>
  <header>
    <div><h1>Graham</h1><div class="sub">Floor Plan Report</div></div>
    <div class="date">${date}</div>
  </header>
  ${body || '<p style="color:#7a7068">No rooms to display.</p>'}
</body></html>`);
  win.document.close();
  win.focus();
  setTimeout(() => { win.print(); win.close(); }, 500);
}
