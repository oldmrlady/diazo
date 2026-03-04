// Shared mutable application state
export const state = {
  snapEnabled: true,
  rooms: [],
  activeRoomId: null,
  newRoomColor: 0,
  selFurn: null,
  selWo: null,
  dragFurnType: null,
  activeWallTool: null,
  batchMode: false,
  batchQueue: [],
  batchPendingFdef: null,
};
