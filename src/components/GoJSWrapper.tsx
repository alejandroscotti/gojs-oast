/*
 *  Copyright (C) 1998-2022 by Northwoods Software Corporation. All Rights Reserved.
 */

import { useEffect, useRef, useState } from "react";
import * as go from "gojs";
import { ReactDiagram, ReactPalette } from "gojs-react";
import { paletteDataInit } from "./dataSource/paletteData";
import "./GoJSWrapper.css";
import useGoJsTemplateTemplates from "./useGoJsTemplates";

const goJsCategory = {
  DropDocletType: "DropDocletType",
  DocletTypeNode: "DocletTypeNode",
};

export default function GoJSWrapper(props: any) {
  // Defined React GoJs Refs
  const diagramRef = useRef<ReactDiagram>(null);

  const [output, setOutput] = useState<any>();

  // add/remove listeners
  useEffect(() => {
    if (diagramRef.current === null) return;
    const diagram = diagramRef.current.getDiagram();
    if (diagram instanceof go.Diagram) {
      diagram.addDiagramListener("ChangedSelection", props.onDiagramEvent);
    }
    return () => {
      if (diagram instanceof go.Diagram) {
        diagram.removeDiagramListener("ChangedSelection", props.onDiagramEvent);
      }
    };
  }, [props.onDiagramEvent]);

  const handleDocletTypeDrop = (
    newNode: go.ObjectData,
    targetNode: go.Part,
    dModel: go.GraphLinksModel,
    diagram: go.Diagram,
  ) => {
    diagram.startTransaction("handleDocletTypeDrop");

    let linkToRemove: any;
    let nextNode: any;

    /* 
		This Target Node should ALWAYS be the Node where the Drop occured.
		*/
    setOutput(targetNode.data);

    linkToRemove = dModel.linkDataArray[0];
    nextNode = dModel.nodeDataArray[1];

    dModel.removeLinkData(linkToRemove);

    dModel.addLinkDataCollection([
      {
        from: linkToRemove.from,
        to: newNode.key,
      },
      {
        from: newNode.key,
        to: nextNode.key,
      },
    ]);

    diagram.commitTransaction("handleDocletTypeDrop");
  };

  const externalObjectsDropped = (ev: go.DiagramEvent) => {
    // Declare Diagram
    const diagram: go.Diagram | null | undefined =
      diagramRef?.current?.getDiagram();

    // NULL check
    if (!diagram) return;

    // Declare Models
    const dModel = diagram.model as go.GraphLinksModel;

    // Declare Nodes
    const newNode: go.Node = ev.diagram?.selection.first() as go.Node;
    const targetNode = diagram.findPartAt(
      new go.Point(newNode.position.x, newNode.position.y),
    ) as go.Part;

    // NULL check
    if (!targetNode || !newNode) return;

    handleDocletTypeDrop(newNode.data, targetNode, dModel, diagram);
  };

  // Destructure Templates
  const { docletTypeNodes, dropDocletType, linkTemplate } =
    useGoJsTemplateTemplates(go);

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
      layout: $(go.TreeLayout),
    });

    palette.nodeTemplateMap.add(goJsCategory.DocletTypeNode, docletTypeNodes);
    palette.nodeTemplateMap.add(goJsCategory.DropDocletType, dropDocletType);
    palette.linkTemplate = $(go.Link);

    return palette;
  }

  return (
    <div className="gojs-wrapper-div">
      <ReactPalette
        divClassName="palette-component"
        initPalette={initPalette}
        nodeDataArray={paletteDataInit}
      />
      <ReactDiagram
        ref={diagramRef}
        divClassName="diagram-component"
        initDiagram={initDiagram}
        nodeDataArray={props.nodeDataArray}
        linkDataArray={props.linkDataArray}
        onModelChange={props.onModelChange}
        skipsDiagramUpdate={props.skipsDiagramUpdate}
      />
      <output>{JSON.stringify(output)}</output>
    </div>
  );
}
