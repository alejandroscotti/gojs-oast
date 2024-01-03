/*
 *  Copyright (C) 1998-2022 by Northwoods Software Corporation. All Rights Reserved.
 */

import { useImmer } from "use-immer";
import * as go from "gojs";
import GoJSWrapper from "./components/GoJSWrapper";
import { diagramDataInit } from "./components/dataSource/diagramData";
import { paletteDataInit } from "./components/dataSource/paletteData";
import "./App.css";

export default function App() {
  const [diagramData, updateDiagramData] = useImmer({
    linkDataArray: diagramDataInit.linkDataArray,
    nodeDataArray: diagramDataInit.nodeDataArray,
    paletteData: paletteDataInit,
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
      let nodeDataArray = draft.nodeDataArray;

      if (modifiedNodeData) {
        modifiedNodeData.forEach((node: any) => {
          modifiedNodeMap.set(node.key, node);
          const idx = mapNodeKeyIdx.get(node.key);

          if (idx !== undefined && idx >= 0) {
            nodeDataArray[idx] = node;
            if (draft.selectedData && draft.selectedData.key === node.key) {
              draft.selectedData = node;
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

        draft.nodeDataArray = nodeDataArray;
        refreshNodeIndex(nodeDataArray);
      }

      let linkDataArray = draft.linkDataArray;

      if (modifiedLinkData) {
        modifiedLinkData.forEach((ld: any) => {
          modifiedLinkMap.set(ld.key, ld);
          const idx = mapLinkKeyIdx.get(ld.key);

          if (idx !== undefined && idx >= 0) {
            linkDataArray[idx] = ld;

            if (draft.selectedData && draft.selectedData.key === ld.key) {
              draft.selectedData = ld;
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

        draft.linkDataArray = linkDataArray;
        refreshLinkIndex(linkDataArray);
      }

      draft.skipsDiagramUpdate = true; // the GoJS model already knows about these updates
    });
  }

  return (
    <GoJSWrapper
      nodeDataArray={diagramData.nodeDataArray}
      linkDataArray={diagramData.linkDataArray}
      skipsDiagramUpdate={diagramData.skipsDiagramUpdate}
      paletteData={diagramData.paletteData}
      onDiagramEvent={handleDiagramEvent}
      onModelChange={handleModelChange}
    />
  );
}
