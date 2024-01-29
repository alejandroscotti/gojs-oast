import { createSlice } from "@reduxjs/toolkit";
import * as go from "gojs";
import { diagramDataInit } from "../components/dataSource/diagramData";
import { paletteDataInit } from "../components/dataSource/paletteData";

type GoJsState = {
  linkDataArray: object[];
  nodeDataArray: object[];
  paletteData: object;
  selectedData: { key: number } | null;
  skipsDiagramUpdate: boolean;
};

const initialState: GoJsState = {
  linkDataArray: diagramDataInit.linkDataArray,
  nodeDataArray: diagramDataInit.nodeDataArray,
  paletteData: paletteDataInit,
  selectedData: null,
  skipsDiagramUpdate: false,
};

// maps for faster state modification
const mapNodeKeyIdx = new Map();
const mapLinkKeyIdx = new Map();

const refreshNodeIndex = (nodeArr: any) => {
  mapNodeKeyIdx.clear();
  nodeArr.forEach((n: any, idx: any) => {
    mapNodeKeyIdx.set(n.key, idx);
  });
};

const refreshLinkIndex = (linkArr: any) => {
  mapLinkKeyIdx.clear();
  linkArr.forEach((l: any, idx: any) => {
    mapLinkKeyIdx.set(l.key, idx);
  });
};

const goJsSlice = createSlice({
  name: "goJs",
  initialState,
  reducers: {
    changedSelection(state: GoJsState, { payload }) {
      if (payload instanceof go.Node) {
        const idx = mapNodeKeyIdx.get(payload.key);
        if (idx !== undefined && idx >= 0) {
          const nd: any = state.nodeDataArray[idx];
          state.selectedData = nd;
        }
      } else if (payload instanceof go.Link) {
        const idx = mapLinkKeyIdx.get(payload.key);
        if (idx !== undefined && idx >= 0) {
          const ld: any = state.linkDataArray[idx];
          state.selectedData = ld;
        }
      }
    },
    clearSelection(state: GoJsState) {
      state.selectedData = null;
    },
    onModelChange(state: GoJsState, { payload }) {
      refreshNodeIndex(state.nodeDataArray);
      refreshLinkIndex(state.linkDataArray);

      const insertedNodeKeys = payload.insertedNodeKeys;
      const modifiedNodeData = payload.modifiedNodeData;
      const removedNodeKeys = payload.removedNodeKeys;
      const insertedLinkKeys = payload.insertedLinkKeys;
      const modifiedLinkData = payload.modifiedLinkData;
      const removedLinkKeys = payload.removedLinkKeys;

      // maintain maps of modified data so insertions don't need slow lookups
      const modifiedNodeMap = new Map();
      const modifiedLinkMap = new Map();

      let nodeDataArray = state.nodeDataArray;

      if (modifiedNodeData) {
        modifiedNodeData.forEach((node: any) => {
          modifiedNodeMap.set(node.key, node);
          const idx = mapNodeKeyIdx.get(node.key);

          if (idx !== undefined && idx >= 0) {
            nodeDataArray[idx] = node;
            if (state.selectedData && state.selectedData.key === node.key) {
              state.selectedData = node;
            }
          }
        });
      }

      if (insertedNodeKeys) {
        insertedNodeKeys.forEach((key: any) => {
          const node = modifiedNodeMap.get(key);
          const idx = mapNodeKeyIdx.get(key);

          if (node && idx === undefined) {
            // nodes won't be added if they already exist
            mapNodeKeyIdx.set(node.key, nodeDataArray.length);
            nodeDataArray.push(node);
          }
        });
      }

      if (removedNodeKeys) {
        nodeDataArray = nodeDataArray.filter((nd: any) => {
          if (removedNodeKeys.includes(nd.key)) {
            return false;
          }
          return true;
        });

        state.nodeDataArray = nodeDataArray;
        refreshNodeIndex(nodeDataArray);
      }

      let linkDataArray = state.linkDataArray;

      if (modifiedLinkData) {
        modifiedLinkData.forEach((ld: any) => {
          modifiedLinkMap.set(ld.key, ld);
          const idx = mapLinkKeyIdx.get(ld.key);

          if (idx !== undefined && idx >= 0) {
            linkDataArray[idx] = ld;

            if (state.selectedData && state.selectedData.key === ld.key) {
              state.selectedData = ld;
            }
          }
        });
      }

      if (insertedLinkKeys) {
        insertedLinkKeys.forEach((key: any) => {
          const linkData = modifiedLinkMap.get(key);
          const idx = mapLinkKeyIdx.get(key);

          if (linkData && idx === undefined) {
            // links won't be added if they already exist
            mapLinkKeyIdx.set(linkData.key, linkDataArray.length);
            linkDataArray.push(linkData);
          }
        });
      }

      if (removedLinkKeys) {
        linkDataArray = linkDataArray.filter((ld: any) => {
          if (removedLinkKeys.includes(ld.key)) {
            return false;
          }
          return true;
        });

        state.linkDataArray = linkDataArray;
        refreshLinkIndex(linkDataArray);
      }

      state.skipsDiagramUpdate = true; // the GoJS model already knows about these updates
    },
  },
});

export const { changedSelection, clearSelection, onModelChange } =
  goJsSlice.actions;
export default goJsSlice.reducer;
