/*
 *  Copyright (C) 1998-2022 by Northwoods Software Corporation. All Rights Reserved.
 */

import { useEffect } from "react"
import * as go from "gojs"
import { ReactDiagram, ReactPalette } from "gojs-react"
import useGoJsTemplateTemplates from "./useGoJsTemplates"
import { GoJsNodeState } from "./dataSource/goJsNodeState"
import { useAlignImportNodes } from "./useAlignImportNodes"
import "./GoJSWrapper.css"
import { CustomTreeLayout } from "./customTreeLayout"
import OastInfoDrawer from "./OastInfoDrawer/OastInfoDrawer"

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
  SpacerNode: "SpacerNode",
}

export default function GoJSWrapper(props: any) {
  const {
    paletteData,
    onDiagramEvent,
    nodeDataArray,
    linkDataArray,
    skipsDiagramUpdate,
  } = props

  const { alignNodes } = useAlignImportNodes(go, goJsCategory)

  // Destructure Templates
  const {
    docletTypeNodes,
    dropDocletType,
    linkTemplate,
    imports,
    importNode,
    paletteDocletGroup,
    spacerNode,
  } = useGoJsTemplateTemplates(go)

  useEffect(() => {
    if (diagramRef.current === null) return
    const diagram = diagramRef.current.getDiagram()
    if (diagram instanceof go.Diagram) {
      diagram.addDiagramListener("ChangedSelection", onDiagramEvent)
    }
    return () => {
      if (diagram instanceof go.Diagram) {
        diagram.removeDiagramListener("ChangedSelection", onDiagramEvent)
      }
    }
  }, [onDiagramEvent, diagramRef])

  const handleDocletTypeDrop = (
    newNode: go.Node,
    targetNode: go.Node,
    diagram: go.Diagram,
    palette: go.Palette
  ) => {
    // Declare Palette and Diagram Models
    const dModel = diagram.model as go.GraphLinksModel
    const pModel = palette.model as go.GraphLinksModel

    let targetLink: go.Link | null
    let nextNode: go.Node | null

    diagram.startTransaction()
    palette.startTransaction()

    if (targetNode.key === "append") {
      targetLink = targetNode.findLinksInto().first()
      if (!targetLink) return
      nextNode = targetLink.toNode
      if (!nextNode) return
    } else {
      targetLink = targetNode.findLinksOutOf().first()
      if (!targetLink) return
      nextNode = targetLink.toNode
      if (!nextNode) return
    }

    targetLink.toNode = newNode
    dModel.addLinkData({ from: newNode.data.key, to: nextNode.data.key })

    // Change Node state in Diagram Model
    dModel.nodeDataArray.forEach((dNode: go.ObjectData) => {
      if (dNode.key === newNode.key) {
        dModel.set(dNode, "state", GoJsNodeState.Diagram)
      }
    })

    // Change Node state in Palette Model
    pModel.nodeDataArray.forEach((pNode: go.ObjectData) => {
      if (pNode.title === newNode.data.title) {
        pModel.set(pNode, "state", GoJsNodeState.Copied)
      }
    })

    diagram.commitTransaction()
    palette.commitTransaction()
  }

  const handleImportNodeDrop = async (
    newNode: go.Node,
    diagram: go.Diagram,
    palette: go.Palette
  ) => {
    // Declare Palette and Diagram Models
    const dModel = diagram.model as go.GraphLinksModel
    const pModel = palette.model as go.GraphLinksModel

    diagram.startTransaction()
    palette.startTransaction()

    // Change Node state in Diagram Model
    dModel.nodeDataArray.forEach((dNode: go.ObjectData) => {
      if (dNode.key === newNode.key) {
        dModel.set(dNode, "state", GoJsNodeState.Diagram)
        dModel.set(dNode, "isSelected", true)
        // dModel.set(dNode, "isLayoutPositioned", false) :TODO
        const Node = diagram.findNodeForKey(dNode.key)

        if (Node) {
          Node.isSelected = true
        }
      }
    })

    // Change Node state in Palette Model
    pModel.nodeDataArray.forEach((pNode: go.ObjectData) => {
      if (pNode.key === newNode.key) {
        pModel.set(pNode, "state", GoJsNodeState.Copied)
      }
    })

    await alignNodes(diagram)

    diagram.commitTransaction()
    palette.commitTransaction()
  }

  const linkMouseDrop = (
    newNode: go.Node,
    link: go.Link,
    diagram: go.Diagram,
    palette: go.Palette
  ) => {
    diagram.startTransaction();
    palette.startTransaction();
  
    const dModel = diagram.model as go.GraphLinksModel;
    const pModel = palette.model as go.GraphLinksModel;

    const fromKey = link.data.from;
    // check nodeDataArray to see if fromKey is of category ImportNode
    const fromNode = dModel.nodeDataArray.find((node: go.ObjectData) => node.key === fromKey);
    if (fromNode?.category === goJsCategory.ImportNode) {
      // remove new node
      dModel.removeNodeData(newNode.data);
      return;
    }
    // Remove the existing link
    dModel.removeLinkData(link.data);
  
    // Add the new node to the diagram
    dModel.set(newNode, "state", GoJsNodeState.Diagram);
    // Create two new links
    const newLink1 = { from: link?.fromNode?.key, to: newNode.data.key };
    const newLink2 = { from: newNode.data.key, to: link?.toNode?.key };
    dModel.addLinkData(newLink1);
    dModel.addLinkData(newLink2);
  
    // update palette node state
    pModel.nodeDataArray.forEach((pNode: go.ObjectData) => {
      if (pNode.key === newNode.data.key) {
        pModel.set(pNode, "state", GoJsNodeState.Copied);
      }
    });
  
    diagram.commitTransaction();
    palette.commitTransaction();
  };

  const handleReplaceExistingNodeDrop = (
    newNode: go.Node,
    targetNode: go.Node,
    diagram: go.Diagram,
    palette: go.Palette
  ) => {
    diagram.startTransaction()
    palette.startTransaction()

    // Declare Palette and Diagram Models
    const dModel = diagram.model as go.GraphLinksModel
    const pModel = palette.model as go.GraphLinksModel

    // Find the links connected to the target node
    const connectedLinks = targetNode.findLinksConnected()
    const linksToUpdate: go.ObjectData = []
    connectedLinks.each((link: go.Link) => {
      linksToUpdate.push({from: link.fromNode?.key, to: link.toNode?.key});
    });

    // Remove Existing Node
    diagram.remove(targetNode)
    dModel.set(newNode, "state", GoJsNodeState.Diagram)

    // Update links to connect to/from new node
    linksToUpdate.forEach((link: go.ObjectData) => {
      if (link.from === targetNode.data.key) {
        dModel.removeLinkData(link)
        dModel.addLinkData({ from: newNode.data.key, to: link.to })
      } else if (link.to === targetNode.data.key) {
        dModel.removeLinkData(link)
        dModel.addLinkData({ from: link.from, to: newNode.data.key })
      }
    })

    // Update Palette Model
    pModel.nodeDataArray.forEach((pNode: go.ObjectData) => {
      // grey out the dragged node in the palette
      if (pNode.title === newNode.data.title) {
        pModel.set(pNode, "state", GoJsNodeState.Copied)
      }
      // mark previous node to be available in the palette
      if (pNode.title === targetNode.data.title) {
        pModel.set(pNode, "state", GoJsNodeState.Palette)
      }
    })

    diagram.commitTransaction()
    palette.commitTransaction()
  }

  const externalObjectsDropped = (ev: go.DiagramEvent) => {
    // Declare Diagram & Palette
    const palette: go.Palette | null | undefined =
      paletteRef?.current?.getPalette()

    const diagram: go.Diagram | null | undefined =
      diagramRef?.current?.getDiagram()

    // NULL check
    if (!diagram || !palette) return

    // Declare Nodes
    const newNode: go.Node = ev.diagram?.selection.first() as go.Node;
    const targetNode: any = diagram.findPartAt(
      new go.Point(newNode.position.x, newNode.position.y),
    ) as go.Node;

    // Always delete dropped Node IF it is a Doclet Type Node drop on Canvas
    if (!targetNode && newNode.data.category === goJsCategory.DocletTypeNode) {
      diagram?.commandHandler?.deleteSelection()
      return
    }

    // Add an Import Node
    if (newNode.category === goJsCategory.ImportNode) {
      handleImportNodeDrop(newNode, diagram, palette)
      return
    }

    // NULL check
    if (!targetNode) return

    // Add a Doclet Type Node
    if (newNode.category === goJsCategory.DocletTypeNode) {
      switch (targetNode.category) {
        case goJsCategory.DocletTypeNode:
          // Replace existing Node
          handleReplaceExistingNodeDrop(newNode, targetNode, diagram, palette)
          break

        case goJsCategory.DropDocletType:
          // Append or Prepend a Node
          handleDocletTypeDrop(newNode, targetNode, diagram, palette)
          break

        default:
          // Add Node in a Link
          linkMouseDrop(newNode, targetNode, diagram, palette)
      }
      return
    }
  };
  const greyPaletteNodesOnLoad = () => {
    // Get the model for the palette 
    const paletteModel = paletteRef?.current?.getPalette()?.model as go.GraphLinksModel;
    const diagramModel = diagramRef?.current?.getDiagram()?.model as go.GraphLinksModel;
    const diagramNodeTitles: string[] = [];
    // Iterate over the nodes in the diagram
    diagramModel?.nodeDataArray.forEach((diagramNode: go.ObjectData) => {
      // Find the corresponding node in the palette
      diagramNodeTitles.push(diagramNode.title);
    });
    // Iterate over the nodes in the palette
    paletteModel.nodeDataArray.forEach((paletteNode: go.ObjectData) => {
      // ignore imports category
      if (paletteNode.category === "ImportNode") return;
      // change state to copied if the node is in the diagram
      if (diagramNodeTitles.includes(paletteNode.title)) {
        paletteModel.set(paletteNode, "state", GoJsNodeState.Copied);
    }});
  }
  function initDiagram() {
    const $ = go.GraphObject.make
    // set your license key here before creating the diagram: go.Diagram.licenseKey = "...";
    const diagram = $(go.Diagram, {
      "undoManager.isEnabled": true, // must be set to allow for model change listening
      // 'undoManager.maxHistoryLength': 0,  // uncomment disable undo/redo functionality
      // layout: $(go.TreeLayout, {
      //   angle: 90,
      //   layerSpacing: 10,
      // }), // CustomTreeLayout
      layout: $(CustomTreeLayout),
      model: $(go.GraphLinksModel, {
        linkKeyProperty: "key", // IMPORTANT! must be defined for merges and data sync when using GraphLinksModel
        // positive keys for nodes
        makeUniqueKeyFunction: (m: any, data: any) => {
          let k = data.key || 1
          while (m.findNodeDataForKey(k)) k++
          return k
        },
        // negative keys for links
        makeUniqueLinkKeyFunction: (m: any, data: any) => {
          let k = data.key || -1
          while (m.findLinkDataForKey(k)) k--
          return k
        },
      }),
    })

    // Add Node Templates
    diagram.nodeTemplateMap.add(goJsCategory.DocletTypeNode, docletTypeNodes)
    diagram.nodeTemplateMap.add(goJsCategory.DropDocletType, dropDocletType)
    diagram.nodeTemplateMap.add(goJsCategory.Imports, imports)
    diagram.nodeTemplateMap.add(goJsCategory.ImportNode, importNode)
    diagram.nodeTemplateMap.add(goJsCategory.SpacerNode, spacerNode)

    // Add Link Template
    diagram.linkTemplateMap.add("", linkTemplate)

    diagram.addDiagramListener(
      "ExternalObjectsDropped",
      externalObjectsDropped,
    );
    /* 
      "InitialLayoutCompleted", the whole diagram layout has updated for the first time 
      since a major change to the Diagram, such as replacing the Model;
      if you make any changes, you do not need to perform a transaction.
      - https://gojs.net/latest/api/symbols/DiagramEvent.html
    */
    diagram.addDiagramListener("InitialLayoutCompleted", greyPaletteNodesOnLoad);
    return diagram;
  }

  function initPalette() {
    const $ = go.GraphObject.make

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
    })

    // Add Node Templates
    palette.nodeTemplateMap.add(goJsCategory.Imports, imports)
    palette.nodeTemplateMap.add(goJsCategory.DocletTypeNode, docletTypeNodes)
    palette.nodeTemplateMap.add(goJsCategory.ImportNode, importNode)
    palette.nodeTemplateMap.add(
      goJsCategory.PaletteDocletGroup,
      paletteDocletGroup
    )

    palette.linkTemplate = $(go.Link)
    palette.model = $(go.TreeModel, { nodeParentKeyProperty: "group" })

    return palette
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
  )
}
