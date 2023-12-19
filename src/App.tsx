/*
 *  Copyright (C) 1998-2022 by Northwoods Software Corporation. All Rights Reserved.
 */

import { useImmer } from "use-immer";
import * as go from "gojs";
import GoJSWrapper from "./components/GoJSWrapper";
import { diagramDataInit } from "./components/dataSource/diagramData";
import "./App.css";

export default function App() {
  const [diagramData, updateDiagramData] = useImmer({
    nodeDataArray: diagramDataInit.nodeDataArray,
    linkDataArray: diagramDataInit.linkDataArray,
    selectedData: null,
    skipsDiagramUpdate: false,
  });

  // maps for faster state modification
  const mapNodeKeyIdx = new Map();
  const mapLinkKeyIdx = new Map();
  refreshNodeIndex(diagramData.nodeDataArray);
  refreshLinkIndex(diagramData.linkDataArray);

  function refreshNodeIndex(nodeArr: any) {
    mapNodeKeyIdx.clear();
    nodeArr.forEach((n: any, idx: any) => {
      mapNodeKeyIdx.set(n.key, idx);
    });
  }

  function refreshLinkIndex(linkArr: any) {
    mapLinkKeyIdx.clear();
    linkArr.forEach((l: any, idx: any) => {
      mapLinkKeyIdx.set(l.key, idx);
    });
  }

  function handleDiagramEvent(e: any) {
    const name = e.name;
    switch (name) {
      case "ChangedSelection": {
        const sel = e.subject.first();
        updateDiagramData((draft: any) => {
          if (sel) {
            if (sel instanceof go.Node) {
              const idx = mapNodeKeyIdx.get(sel.key);
              if (idx !== undefined && idx >= 0) {
                const nd = draft.nodeDataArray[idx];
                draft.selectedData = nd;
              }
            } else if (sel instanceof go.Link) {
              const idx = mapLinkKeyIdx.get(sel.key);
              if (idx !== undefined && idx >= 0) {
                const ld = draft.linkDataArray[idx];
                draft.selectedData = ld;
              }
            }
          } else {
            draft.selectedData = null;
          }
        });
        break;
      }
      default:
        break;
    }
  }

  function handleModelChange(obj: any) {
    const insertedNodeKeys = obj.insertedNodeKeys;
    const modifiedNodeData = obj.modifiedNodeData;
    const removedNodeKeys = obj.removedNodeKeys;
    const insertedLinkKeys = obj.insertedLinkKeys;
    const modifiedLinkData = obj.modifiedLinkData;
    const removedLinkKeys = obj.removedLinkKeys;

    // maintain maps of modified data so insertions don't need slow lookups
    const modifiedNodeMap = new Map();
    const modifiedLinkMap = new Map();

    updateDiagramData((draft: any) => {
      let narr = draft.nodeDataArray;
      if (modifiedNodeData) {
        modifiedNodeData.forEach((nd: any) => {
          modifiedNodeMap.set(nd.key, nd);
          const idx = mapNodeKeyIdx.get(nd.key);
          if (idx !== undefined && idx >= 0) {
            narr[idx] = nd;
            if (draft.selectedData && draft.selectedData.key === nd.key) {
              draft.selectedData = nd;
            }
          }
        });
      }
      if (insertedNodeKeys) {
        insertedNodeKeys.forEach((key: any) => {
          const nd = modifiedNodeMap.get(key);
          const idx = mapNodeKeyIdx.get(key);
          if (nd && idx === undefined) {
            // nodes won't be added if they already exist
            mapNodeKeyIdx.set(nd.key, narr.length);
            narr.push(nd);
          }
        });
      }
      if (removedNodeKeys) {
        narr = narr.filter((nd: any) => {
          if (removedNodeKeys.includes(nd.key)) {
            return false;
          }
          return true;
        });
        draft.nodeDataArray = narr;
        refreshNodeIndex(narr);
      }

      let larr = draft.linkDataArray;
      if (modifiedLinkData) {
        modifiedLinkData.forEach((ld: any) => {
          modifiedLinkMap.set(ld.key, ld);
          const idx = mapLinkKeyIdx.get(ld.key);
          if (idx !== undefined && idx >= 0) {
            larr[idx] = ld;
            if (draft.selectedData && draft.selectedData.key === ld.key) {
              draft.selectedData = ld;
            }
          }
        });
      }
      if (insertedLinkKeys) {
        insertedLinkKeys.forEach((key: any) => {
          const ld = modifiedLinkMap.get(key);
          const idx = mapLinkKeyIdx.get(key);
          if (ld && idx === undefined) {
            // links won't be added if they already exist
            mapLinkKeyIdx.set(ld.key, larr.length);
            larr.push(ld);
          }
        });
      }
      if (removedLinkKeys) {
        larr = larr.filter((ld: any) => {
          if (removedLinkKeys.includes(ld.key)) {
            return false;
          }
          return true;
        });
        draft.linkDataArray = larr;
        refreshLinkIndex(larr);
      }

      draft.skipsDiagramUpdate = true; // the GoJS model already knows about these updates
    });
  }

  return (
    <GoJSWrapper
      nodeDataArray={diagramData.nodeDataArray}
      linkDataArray={diagramData.linkDataArray}
      skipsDiagramUpdate={diagramData.skipsDiagramUpdate}
      onDiagramEvent={handleDiagramEvent}
      onModelChange={handleModelChange}
    />
  );
}
