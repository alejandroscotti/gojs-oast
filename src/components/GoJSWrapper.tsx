/*
 *  Copyright (C) 1998-2022 by Northwoods Software Corporation. All Rights Reserved.
 */

import { useEffect, useRef } from "react";
import * as go from "gojs";
import { ReactDiagram, ReactPalette } from "gojs-react";
import useGoJsTemplateTemplates from "./useGoJsTemplates";
import { GoJsNodeState } from "./dataSource/goJsNodeState";
import "./GoJSWrapper.css";

const goJsCategory = {
  DiagramDocletType: "DiagramDocletType",
  DocletType: "DocletType",
  PaletteDocletGroup: "PaletteDocletGroup",
  DocumentSection: "DocumentSection",
  DropDocletType: "DropDocletType",
  Imports: "Imports",
  PaletteDoclet: "PaletteDoclet",
  PaletteDocletSearch: "PaletteDocletSearch",
  ImportNode: "ImportNode",
  DocletTypeNode: "DocletTypeNode",
};

export default function GoJSWrapper(props: any) {
  const {
    paletteData,
    onDiagramEvent,
    nodeDataArray,
    linkDataArray,
    skipsDiagramUpdate,
    onModelChange,
  } = props;

  // Defined React GoJs Refs
  const diagramRef = useRef<ReactDiagram>(null);
  const paletteRef = useRef<ReactPalette>(null);

  // Returns position of the Node
  /* const handlePosition = (nodeData: go.ObjectData, Node: go.Node) => {
    // Declare Diagram & Palette
    const palette: go.Palette | null | undefined =
      paletteRef?.current?.getPalette();

    const diagram: go.Diagram | null | undefined =
      diagramRef?.current?.getDiagram();

    // NULL checks
    if (!diagram || !palette || !nodeData || !Node) return;

    if (
      nodeData.state === GoJsNodeState.Palette &&
      nodeData.category === goJsCategory.ImportNode
    ) {
      return new go.Point(1500, 1500);
    }
  }; */

  // Destructure Templates
  const {
    docletTypeNodes,
    dropDocletType,
    linkTemplate,
    imports,
    importNode,
    paletteDocletGroup,
  } = useGoJsTemplateTemplates(go);

  useEffect(() => {
    if (diagramRef.current === null) return;
    const diagram = diagramRef.current.getDiagram();
    if (diagram instanceof go.Diagram) {
      diagram.addDiagramListener("ChangedSelection", onDiagramEvent);
    }
    return () => {
      if (diagram instanceof go.Diagram) {
        diagram.removeDiagramListener("ChangedSelection", onDiagramEvent);
      }
    };
  }, [onDiagramEvent]);

  const handleDocletTypeDrop = (
    newNode: go.Node,
    targetNode: go.Node,
    diagram: go.Diagram,
    palette: go.Palette,
  ) => {
    // Declare Palette and Diagram Models
    const dModel = diagram.model as go.GraphLinksModel;
    const pModel = palette.model as go.GraphLinksModel;

    let targetLink: go.Link | null;
    let nextNode: go.Node | null;

    diagram.startTransaction();
    palette.startTransaction();

    if (targetNode.key === "append") {
      targetLink = targetNode.findLinksInto().first();
      if (!targetLink) return;
      nextNode = targetLink.toNode;
      if (!nextNode) return;
    } else {
      targetLink = targetNode.findLinksOutOf().first();
      if (!targetLink) return;
      nextNode = targetLink.toNode;
      if (!nextNode) return;
    }

    targetLink.toNode = newNode;
    dModel.addLinkData({ from: newNode.data.key, to: nextNode.data.key });

    // Change Node state in Diagram Model
    dModel.nodeDataArray.forEach((dNode: any) => {
      if (dNode.key === newNode.key) {
        dModel.set(dNode, "state", GoJsNodeState.Diagram);
      }
    });

    // Change Node state in Palette Model
    pModel.nodeDataArray.forEach((pNode: any) => {
      if (pNode.title === newNode.data.title) {
        pModel.set(pNode, "state", GoJsNodeState.Copied);
      }
    });

    diagram.commitTransaction();
    palette.commitTransaction();
  };

  const handleImportNodeDrop = (
    newNode: go.Node,
    diagram: go.Diagram,
    palette: go.Palette,
  ) => {
    // Declare Palette and Diagram Models
    const dModel = diagram.model as go.GraphLinksModel;
    const pModel = palette.model as go.GraphLinksModel;

    diagram.startTransaction();
    palette.startTransaction();

    // TEMP delete
    const loc = new go.Point(1000, 1000);

    // Change Node state in Diagram Model
    dModel.nodeDataArray.forEach((dNode: any) => {
      if (dNode.key === newNode.key) {
        dModel.set(dNode, "state", GoJsNodeState.Diagram);
        dModel.set(dNode, "location", loc);
      }
    });

    // Change Node state in Palette Model
    pModel.nodeDataArray.forEach((pNode: any) => {
      if (pNode.key === newNode.key) {
        pModel.set(pNode, "state", GoJsNodeState.Copied);
      }
    });

    diagram.commitTransaction();
    palette.commitTransaction();
  };

  const linkMouseDrop = (
    newNode: go.Node,
    targetNode: go.Node,
    diagram: go.Diagram,
    palette: go.Palette,
  ) => {
    diagram.startTransaction();
    palette.startTransaction();

    diagram.commitTransaction();
    palette.commitTransaction();
  };

  const handleReplaceExistingNodeDrop = (
    newNode: go.Node,
    targetNode: go.Node,
    diagram: go.Diagram,
    palette: go.Palette,
  ) => {
    //dispatch(setSelectedTemplateNode(palette));

    diagram.startTransaction();
    palette.startTransaction();

    // Declare Palette and Diagram Models
    const dModel = diagram.model as go.GraphLinksModel;
    const pModel = palette.model as go.GraphLinksModel;

    // Remove Existing Node
    diagram.remove(targetNode);

    dModel.set(newNode, "state", GoJsNodeState.Diagram);

    dModel.addLinkData({
      from: newNode.key,
      to: "1f409525-7df2-4bb6-b406-3e6be8e9b347-0",
    });

    pModel.nodeDataArray.forEach((pNode: any) => {
      if (pNode.title === newNode.data.title) {
        pModel.set(pNode, "state", GoJsNodeState.Copied);
      }
    });

    diagram.commitTransaction();
    palette.commitTransaction();
  };

  const externalObjectsDropped = (ev: go.DiagramEvent) => {
    // Declare Diagram & Palette
    const palette: go.Palette | null | undefined =
      paletteRef?.current?.getPalette();

    const diagram: go.Diagram | null | undefined =
      diagramRef?.current?.getDiagram();

    // NULL check
    if (!diagram || !palette) return;

    // Declare Nodes
    const newNode: go.Node = ev.diagram?.selection.first() as go.Node;
    const targetNode = diagram.findPartAt(
      new go.Point(newNode.position.x, newNode.position.y),
    ) as go.Node;

    // Always delete dropped Node IF it is a Doclet Type Node drop on Canvas
    if (!targetNode && newNode.data.category === goJsCategory.DocletTypeNode) {
      diagram?.commandHandler?.deleteSelection();
      return;
    }

    // Add an Import Node
    if (newNode.category === goJsCategory.ImportNode) {
      handleImportNodeDrop(newNode, diagram, palette);
      return;
    }

    // NULL check
    if (!targetNode) return;

    // Add a Doclet Type Node
    if (newNode.category === goJsCategory.DocletTypeNode) {
      switch (targetNode.category) {
        case goJsCategory.DocletTypeNode:
          // Replace existing Node
          handleReplaceExistingNodeDrop(newNode, targetNode, diagram, palette);
          break;

        case goJsCategory.DropDocletType:
          // Append or Prepend a Node
          handleDocletTypeDrop(newNode, targetNode, diagram, palette);
          break;

        default:
          // Add Node in a Link
          linkMouseDrop(newNode, targetNode, diagram, palette);
      }
      return;
    }
  };

  function initDiagram() {
    const $ = go.GraphObject.make;
    // set your license key here before creating the diagram: go.Diagram.licenseKey = "...";
    const diagram = $(go.Diagram, {
      "undoManager.isEnabled": true, // must be set to allow for model change listening
      // 'undoManager.maxHistoryLength': 0,  // uncomment disable undo/redo functionality
      layout: $(go.TreeLayout, {
        layerSpacing: 10,
        angle: 90,
      }),
      model: $(go.GraphLinksModel, {
        linkKeyProperty: "key", // IMPORTANT! must be defined for merges and data sync when using GraphLinksModel
        // positive keys for nodes
        makeUniqueKeyFunction: (m: any, data: any) => {
          let k = data.key || 1;
          while (m.findNodeDataForKey(k)) k++;
          return k;
        },
        // negative keys for links
        makeUniqueLinkKeyFunction: (m: any, data: any) => {
          let k = data.key || -1;
          while (m.findLinkDataForKey(k)) k--;
          return k;
        },
      }),
    });

    // Add Node Templates
    diagram.nodeTemplateMap.add(goJsCategory.DocletTypeNode, docletTypeNodes);
    diagram.nodeTemplateMap.add(goJsCategory.DropDocletType, dropDocletType);
    diagram.nodeTemplateMap.add(goJsCategory.Imports, imports);
    diagram.nodeTemplateMap.add(goJsCategory.ImportNode, importNode);

    // Add Link Template
    diagram.linkTemplateMap.add("", linkTemplate);

    diagram.addDiagramListener(
      "ExternalObjectsDropped",
      externalObjectsDropped,
    );

    return diagram;
  }

  function initPalette() {
    const $ = go.GraphObject.make;

    const palette = $(go.Palette, {
      "animationManager.isEnabled": false,
      "commandHandler.copiesParentKey": false,
      allowDelete: false,
      allowDragOut: true,
      allowTextEdit: false,
      contentAlignment: go.Spot.TopLeft,
      initialContentAlignment: go.Spot.TopLeft,
      isReadOnly: false,
      maxSelectionCount: 1,
      padding: new go.Margin(5, 0, 0, 4),
      layout: $(go.TreeLayout, {
        alignment: go.TreeLayout.AlignmentStart,
        angle: 0,
        compaction: go.TreeLayout.CompactionNone,
        layerSpacing: 16,
        layerSpacingParentOverlap: 1,
        nodeIndentPastParent: 1.0,
        nodeSpacing: 3,
        setsPortSpot: false,
        setsChildPortSpot: false,
        arrangementSpacing: new go.Size(0, 0),
      }),
    });

    // Add Node Templates
    palette.nodeTemplateMap.add(goJsCategory.Imports, imports);
    palette.nodeTemplateMap.add(goJsCategory.DocletTypeNode, docletTypeNodes);
    palette.nodeTemplateMap.add(goJsCategory.ImportNode, importNode);
    palette.nodeTemplateMap.add(
      goJsCategory.PaletteDocletGroup,
      paletteDocletGroup,
    );

    palette.linkTemplate = $(go.Link);
    palette.model = $(go.TreeModel, { nodeParentKeyProperty: "group" });

    return palette;
  }

  return (
    <div className="gojs-wrapper-div">
      <ReactPalette
        ref={paletteRef}
        divClassName="palette-component"
        initPalette={initPalette}
        nodeDataArray={paletteData}
      />
      <ReactDiagram
        ref={diagramRef}
        divClassName="diagram-component"
        initDiagram={initDiagram}
        nodeDataArray={nodeDataArray}
        linkDataArray={linkDataArray}
        onModelChange={onModelChange}
        skipsDiagramUpdate={skipsDiagramUpdate}
      />
    </div>
  );
}
