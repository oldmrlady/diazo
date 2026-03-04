export const GRID = 6;
export const S = { get: () => parseFloat(document.getElementById('zoomSlider').value) };

export const COLORS = [
  { b: '#2e6fc4', bg: 'rgba(46,111,196,0.09)' },
  { b: '#c44d2e', bg: 'rgba(196,77,46,0.09)' },
  { b: '#2ea87e', bg: 'rgba(46,168,126,0.09)' },
  { b: '#9b59b6', bg: 'rgba(155,89,182,0.09)' },
  { b: '#e67e22', bg: 'rgba(230,126,34,0.09)' },
  { b: '#1a7a6e', bg: 'rgba(26,122,110,0.09)' },
];

export const FURNITURE = [
  { id:'custom',    label:'Custom',        icon:'✏️', w:36,  h:36,  section:'Custom'      },
  { id:'armchair',  label:'Armchair',      icon:'💺', w:36,  h:36,  section:'Living Room' },
  { id:'bookcase',  label:'Bookcase',      icon:'📚', w:36,  h:12,  section:'Living Room' },
  { id:'coffee',    label:'Coffee Table',  icon:'☕', w:48,  h:24,  section:'Living Room' },
  { id:'credenza',  label:'Credenza',      icon:'🗃️', w:60,  h:18,  section:'Living Room' },
  { id:'lamp',         label:'Floor Lamp',   icon:'💡', w:12,  h:12,  section:'Living Room', circular:true },
  { id:'air-purifier', label:'Air Purifier', icon:'🌀', w:12,  h:12,  section:'Living Room', circular:true },
  { id:'subwoofer',    label:'Subwoofer',    icon:'🔊', w:12,  h:12,  section:'Living Room', circular:true },
  { id:'loveseat',  label:'Loveseat',      icon:'🪑', w:54,  h:34,  section:'Living Room' },
  { id:'plant',     label:'Plant',         icon:'🌿', w:18,  h:18,  section:'Living Room' },
  { id:'rug',       label:'Area Rug',      icon:'🟫', w:96,  h:120, section:'Living Room' },
  { id:'sofa',      label:'Sofa',          icon:'🛋️', w:84,  h:36,  section:'Living Room' },
  { id:'tv-unit',   label:'Television',    icon:'📺', w:55,  h:14,  section:'Living Room' },
  { id:'bed-k',     label:'King Bed',      icon:'🛏️', w:76,  h:80,  section:'Bedroom'     },
  { id:'bed-q',     label:'Queen Bed',     icon:'🛏️', w:60,  h:80,  section:'Bedroom'     },
  { id:'bed-t',     label:'Twin Bed',      icon:'🛏️', w:38,  h:75,  section:'Bedroom'     },
  { id:'desk',      label:'Desk',          icon:'🖥️', w:60,  h:30,  section:'Bedroom'     },
  { id:'dresser',   label:'Dresser',       icon:'🗄️', w:42,  h:18,  section:'Bedroom'     },
  { id:'sidetable', label:'Side Table',    icon:'🪵', w:18,  h:18,  section:'Bedroom'     },
  { id:'dining',    label:'Dining Table',  icon:'🍽️', w:60,  h:36,  section:'Dining'      },
  { id:'fridge',    label:'Fridge',        icon:'🧊', w:30,  h:30,  section:'Kitchen'     },
  { id:'sink',      label:'Sink',          icon:'🚿', w:24,  h:22,  section:'Kitchen'     },
  { id:'stove',     label:'Stove',         icon:'🍳', w:30,  h:28,  section:'Kitchen'     },
  { id:'ktable',    label:'Table',         icon:'🍽️', w:36,  h:36,  section:'Kitchen'     },
  { id:'trash',     label:'Trash Can',     icon:'🗑️', w:12,  h:12,  section:'Kitchen'     },
  { id:'washer',    label:'Washer',        icon:'🫧', w:27,  h:28,  section:'Kitchen'     },
  { id:'bathtub',   label:'Bathtub',       icon:'🛁', w:30,  h:60,  section:'Bathroom'    },
  { id:'toilet',    label:'Toilet',        icon:'🚽', w:18,  h:30,  section:'Bathroom'    },
];

export const FURNITURE_SVGS = {
  armchair: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3"/><path d="M3 16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v1.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V11a2 2 0 0 0-4 0z"/><path d="M5 18v2"/><path d="M19 18v2"/></svg>`,
  'bed-k': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><g><path d="M0,0h24v24H0V0z" fill="none"/></g><g><path d="M21,10.78V8c0-1.65-1.35-3-3-3h-4c-0.77,0-1.47,0.3-2,0.78C11.47,5.3,10.77,5,10,5H6C4.35,5,3,6.35,3,8v2.78 C2.39,11.33,2,12.12,2,13v6h2v-2h16v2h2v-6C22,12.12,21.61,11.33,21,10.78z M14,7h4c0.55,0,1,0.45,1,1v2h-6V8C13,7.45,13.45,7,14,7z M5,8c0-0.55,0.45-1,1-1h4c0.55,0,1,0.45,1,1v2H5V8z M4,15v-2c0-0.55,0.45-1,1-1h14c0.55,0,1,0.45,1,1v2H4z"/></g></svg>`,
  'bed-q': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><g><path d="M0,0h24v24H0V0z" fill="none"/></g><g><path d="M21,10.78V8c0-1.65-1.35-3-3-3h-4c-0.77,0-1.47,0.3-2,0.78C11.47,5.3,10.77,5,10,5H6C4.35,5,3,6.35,3,8v2.78 C2.39,11.33,2,12.12,2,13v6h2v-2h16v2h2v-6C22,12.12,21.61,11.33,21,10.78z M14,7h4c0.55,0,1,0.45,1,1v2h-6V8C13,7.45,13.45,7,14,7z M5,8c0-0.55,0.45-1,1-1h4c0.55,0,1,0.45,1,1v2H5V8z M4,15v-2c0-0.55,0.45-1,1-1h14c0.55,0,1,0.45,1,1v2H4z"/></g></svg>`,
  'bed-t': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><g><path d="M0,0h24v24H0V0z" fill="none"/></g><g><path d="M21,10.78V8c0-1.65-1.35-3-3-3h-4c-0.77,0-1.47,0.3-2,0.78C11.47,5.3,10.77,5,10,5H6C4.35,5,3,6.35,3,8v2.78 C2.39,11.33,2,12.12,2,13v6h2v-2h16v2h2v-6C22,12.12,21.61,11.33,21,10.78z M14,7h4c0.55,0,1,0.45,1,1v2h-6V8C13,7.45,13.45,7,14,7z M5,8c0-0.55,0.45-1,1-1h4c0.55,0,1,0.45,1,1v2H5V8z M4,15v-2c0-0.55,0.45-1,1-1h14c0.55,0,1,0.45,1,1v2H4z"/></g></svg>`,
  bookcase: `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16"><path d="M2.5 0a.5.5 0 0 1 .5.5V2h10V.5a.5.5 0 0 1 1 0v15a.5.5 0 0 1-1 0V15H3v.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 .5-.5M3 14h10v-3H3zm0-4h10V7H3zm0-4h10V3H3z"/></svg>`,
  coffee: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor"><path d="M672-520H289l-11 80h404l-10-80ZM160-160l49-360H67l80-280h666l80 280H752l48 360h-80l-27-200H267l-27 200h-80Z"/></svg>`,
  credenza: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor"><path d="M160-120v-640q0-33 23.5-56.5T240-840h480q33 0 56.5 23.5T800-760v640h-80v-80H240v80h-80Zm80-400h200v-240H240v240Zm280-160h200v-80H520v80Zm0 160h200v-80H520v80ZM400-320h160v-80H400v80ZM240-440v160h480v-160H240Zm0 0v160-160Z"/></svg>`,
  desk: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M248,64H8A8,8,0,0,0,8,80h8V192a8,8,0,0,0,16,0V144H224v48a8,8,0,0,0,16,0V80h8a8,8,0,0,0,0-16ZM32,80h88v48H32Zm192,48H136V80h88ZM96,104a8,8,0,0,1-8,8H64a8,8,0,0,1,0-16H88A8,8,0,0,1,96,104Zm64,0a8,8,0,0,1,8-8h24a8,8,0,0,1,0,16H168A8,8,0,0,1,160,104Z"/></svg>`,
  dresser: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M144,192a8,8,0,0,1-8,8H120a8,8,0,0,1,0-16h16A8,8,0,0,1,144,192ZM120,72h16a8,8,0,0,0,0-16H120a8,8,0,0,0,0,16Zm16,48H120a8,8,0,0,0,0,16h16a8,8,0,0,0,0-16Zm80-80V216a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V40A16,16,0,0,1,56,24H200A16,16,0,0,1,216,40ZM56,152H200V104H56ZM56,40V88H200V40ZM200,216V168H56v48H200Z"/></svg>`,
  lamp: `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M5.04.303A.5.5 0 0 1 5.5 0h5c.2 0 .38.12.46.303l3 7a.5.5 0 0 1-.363.687h-.002q-.225.044-.45.081a33 33 0 0 1-4.645.425V13.5a.5.5 0 1 1-1 0V8.495a33 33 0 0 1-4.645-.425q-.225-.036-.45-.08h-.003a.5.5 0 0 1-.362-.688l3-7ZM3.21 7.116A31 31 0 0 0 8 7.5a31 31 0 0 0 4.791-.384L10.171 1H5.83z"/><path d="M6.493 12.574a.5.5 0 0 1-.411.575c-.712.118-1.28.295-1.655.493a1.3 1.3 0 0 0-.37.265.3.3 0 0 0-.052.075l-.001.004-.004.01V14l.002.008.016.033a.6.6 0 0 0 .145.15c.165.13.435.27.813.395.751.25 1.82.414 3.024.414s2.273-.163 3.024-.414c.378-.126.648-.265.813-.395a.6.6 0 0 0 .146-.15l.015-.033L12 14v-.004a.3.3 0 0 0-.057-.09 1.3 1.3 0 0 0-.37-.264c-.376-.198-.943-.375-1.655-.493a.5.5 0 1 1 .164-.986c.77.127 1.452.328 1.957.594C12.5 13 13 13.4 13 14c0 .426-.26.752-.544.977-.29.228-.68.413-1.116.558-.878.293-2.059.465-3.34.465s-2.462-.172-3.34-.465c-.436-.145-.826-.33-1.116-.558C3.26 14.752 3 14.426 3 14c0-.599.5-1 .961-1.243.505-.266 1.187-.467 1.957-.594a.5.5 0 0 1 .575.411"/></svg>`,
  sofa: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3"/><path d="M2 16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v1.5a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5V11a2 2 0 0 0-4 0z"/><path d="M4 18v2"/><path d="M20 18v2"/><path d="M12 4v9"/></svg>`,
  loveseat: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3"/><path d="M2 16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v1.5a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5V11a2 2 0 0 0-4 0z"/><path d="M4 18v2"/><path d="M20 18v2"/><path d="M12 4v9"/></svg>`,
  'tv-unit': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M216,64H147.31l34.35-34.34a8,8,0,1,0-11.32-11.32L128,60.69,85.66,18.34A8,8,0,0,0,74.34,29.66L108.69,64H40A16,16,0,0,0,24,80V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V80A16,16,0,0,0,216,64ZM40,80H144V200H40ZM216,200H160V80h56V200Zm-16-84a12,12,0,1,1-12-12A12,12,0,0,1,200,116Zm0,48a12,12,0,1,1-12-12A12,12,0,0,1,200,164Z"/></svg>`,
};

export const WALL_TYPES = [
  { id:'door',     label:'Door',     icon:'🚪',  size:36, sym:'door' },
  { id:'door-dbl', label:'Dbl Door', icon:'🚪🚪', size:72, sym:'door-dbl' },
  { id:'window',   label:'Window',   icon:'🪟',  size:36, sym:'window' },
  { id:'win-lg',   label:'Wide Win', icon:'🪟',  size:60, sym:'window' },
  { id:'entry',    label:'Entryway', icon:'🏠',  size:48, sym:'entry' },
  { id:'arch',     label:'Archway',  icon:'⛩️',  size:48, sym:'arch' },
];
