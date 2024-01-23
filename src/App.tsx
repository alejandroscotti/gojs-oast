/*
 *  Copyright (C) 1998-2022 by Northwoods Software Corporation. All Rights Reserved.
 */

import { useImmer } from "use-immer";
import { useRef, useState } from "react";
import { ReactDiagram, ReactPalette } from "gojs-react";
import * as go from "gojs";
import {
  Checkbox,
  FormGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from "@mui/material";
import GoJSWrapper from "./components/GoJSWrapper";
import { diagramDataInit } from "./components/dataSource/diagramData";
import { paletteDataInit } from "./components/dataSource/paletteData";
import goJsCategory from "./components/dataSource/goJsCategoryConfiguration";
import "./App.css";

export default function App() {
  // Defined React GoJs Refs
  const diagramRef = useRef<ReactDiagram>(null);
  const paletteRef = useRef<ReactPalette>(null);

  const [diagramData, updateDiagramData] = useImmer<any>({
    linkDataArray: diagramDataInit.linkDataArray,
    nodeDataArray: diagramDataInit.nodeDataArray,
    paletteData: paletteDataInit,
    selectedData: null,
    skipsDiagramUpdate: false,
  });

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

  refreshNodeIndex(diagramData.nodeDataArray);
  refreshLinkIndex(diagramData.linkDataArray);

  const handleDiagramEvent = (e: any) => {
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
  };

  const handleModelChange = (obj: any) => {
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
  };

  const handleLinkChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const diagram: go.Diagram | null | undefined =
      diagramRef?.current?.getDiagram();

    if (!diagram) return;

    diagram.startTransaction();

    const dModel = diagram.model as go.GraphLinksModel;
    const selNode = diagram?.selection.first() as go.Node;

    if (!selNode) return;

    // Add Link
    if (selNode && event.target.checked) {
      dModel.addLinkData({ from: selNode.key, to: event.target.name });
    } else {
      // Remove Link
      const links = selNode.findLinksOutOf();

      var it = links.iterator;
      while (it.next()) {
        const item = it.value;
        if (item.data.to === event.target.name) {
          dModel.removeLinkData(item.data);
        }
      }
    }

    diagram.commitTransaction();
  };

  const getImportNodeLinks = (importNode: go.Part) => {
    const docletTypeNodes = diagramData.linkDataArray?.filter((link: any) => {
      return link.from === importNode.key;
    });
    return docletTypeNodes;
  };

  const infoDrawerBody = () => {
    const diagram: go.Diagram | null | undefined =
      diagramRef?.current?.getDiagram();

    const selNode = diagram?.selection.first();

    const docletTypes = diagramData.nodeDataArray?.filter((nodeTypes: any) => {
      return nodeTypes.category === goJsCategory.DocletTypeNode;
    });

    if (
      selNode &&
      docletTypes &&
      selNode.category === goJsCategory.ImportNode
    ) {
      const importNodeLinks = getImportNodeLinks(selNode);

      return (
        <FormControl component="fieldset">
          <FormLabel component="legend">
            <span>Create or Remove Link from Import Node&nbsp;</span>
            <strong>{selNode.data.text}</strong>
            <span>&nbsp;into Doclet Type Node</span>
          </FormLabel>
          <FormGroup aria-label="position">
            {docletTypes.map((docletType: any) => {
              let checked = false;

              const linked = importNodeLinks.find((link: any) => {
                return link.to === docletType.key;
              });

              if (linked) {
                checked = true;
              }

              return (
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={handleLinkChange}
                      name={docletType.key}
                      checked={checked}
                    />
                  }
                  value={docletType.key}
                  label={docletType.title}
                />
              );
            })}
          </FormGroup>
        </FormControl>
      );
    }
  };

  return (
    <GoJSWrapper
      diagramRef={diagramRef}
      drawerBody={infoDrawerBody()}
      paletteRef={paletteRef}
      linkDataArray={diagramData.linkDataArray}
      nodeDataArray={diagramData.nodeDataArray}
      onDiagramEvent={handleDiagramEvent}
      onModelChange={handleModelChange}
      paletteData={diagramData.paletteData}
      skipsDiagramUpdate={diagramData.skipsDiagramUpdate}
    />
  );
}
