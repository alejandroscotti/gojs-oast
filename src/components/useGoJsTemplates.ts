import { GoJsNodeState } from "./dataSource/goJsNodeState"
import * as go from "gojs"

const useGoJsTemplateTemplates = (go: any) => {
  const $ = go.GraphObject.make

  const spacerNode = $(
    go.Node,
    "Auto",
    { movable: false, selectable: false },
    $(
      go.Shape,
      // new go.Binding("fill", "white"),
      // new go.Binding("stroke", "white"),
      {
        fill: "white",
        background: "white",
        strokeWidth: 0,
        figure: "RoundedRectangle",
        alignment: go.Spot.Center,
        height: 25,
      }
    )
    // $(
    //   go.Panel,
    //   {
    //     stretch: go.GraphObject.Horizontal,
    //     alignment: go.Spot.Center,
    //   },
    //   "Horizontal",
    //   $(
    //     go.TextBlock,
    //     {
    //       margin: new go.Margin(2, 10, 0, 5),
    //       font: "bold 10pt Barlow, sans-serif",
    //     },
    //     new go.Binding("text", "title")
    //   ),
    //   $(
    //     "Button",
    //     new go.Binding(
    //       "visible",
    //       "",
    //       (ev: go.ObjectData) => ev.state === GoJsNodeState.Diagram
    //     ),
    //     {
    //       column: 1,
    //       "ButtonBorder.figure": "Circle",
    //     },
    //     $(go.Shape, "XLine", {
    //       width: 8,
    //       height: 8,
    //       fill: "white",
    //       click: (ev: any, obj: any) => alert("hola"),
    //     })
    //   )
    // )
  )

  const docletTypeNodes = $(
    go.Node,
    "Auto",
    { movable: false },
    new go.Binding("copyable", "", (ev: go.ObjectData) => {
      return ev.state !== GoJsNodeState.Copied
    }),
    $(
      go.Shape,
      new go.Binding("fill", "", (ev: go.ObjectData) => {
        if (ev.state === GoJsNodeState.Copied) return "#ccc"

        if (
          ev.state === GoJsNodeState.Palette ||
          ev.state === GoJsNodeState.Diagram
        )
          return "white"
      }),
      new go.Binding("stroke", "", (ev: go.ObjectData) => {
        if (ev.state === GoJsNodeState.Copied) return "#ccc"

        if (
          ev.state === GoJsNodeState.Palette ||
          ev.state === GoJsNodeState.Diagram
        )
          return "#1776D2"
      }),
      {
        strokeWidth: 1,
        figure: "RoundedRectangle",
        alignment: go.Spot.Center,
      }
    ),
    $(
      go.Panel,
      {
        stretch: go.GraphObject.Horizontal,
        alignment: go.Spot.Center,
      },
      "Horizontal",
      $(
        go.TextBlock,
        {
          margin: new go.Margin(2, 10, 0, 5),
          font: "bold 10pt Barlow, sans-serif",
        },
        new go.Binding("text", "title")
      ),
      $(
        "Button",
        new go.Binding(
          "visible",
          "",
          (ev: go.ObjectData) => ev.state === GoJsNodeState.Diagram
        ),
        {
          column: 1,
          "ButtonBorder.figure": "Circle",
        },
        $(go.Shape, "XLine", {
          width: 8,
          height: 8,
          fill: "white",
          click: (ev: any, obj: any) => alert("hola"),
        })
      )
    )
  )

  const linkTemplate = $(
    go.Link,
    {
      layerName: "Background",
      movable: false,
      routing: go.Link.Orthogonal,
      corner: 5,
    },
    $(go.Shape, { isPanelMain: true, strokeWidth: 1 }),
    $(go.Shape, { toArrow: "OpenTriangle", strokeWidth: 1 })
  )

  const dropDocletType = $(
    go.Node,
    "Auto",
    {
      movable: false,
      mouseDragEnter: (ev: go.InputEvent, obj: go.Node) => {
        const node = obj.elt(0) as go.Shape
        if (node) node.stroke = "#1776D2"
      },
      mouseDragLeave: (ev: go.InputEvent, obj: go.Node) => {
        const node = obj.elt(0) as go.Shape
        if (node) node.stroke = "#ffc74c"
      },
    },
    $(go.Shape, {
      strokeWidth: 1,
      stroke: "#ffc74c",
      figure: "Ellipse",
      fill: "#ffc74c",
    }),
    $(
      go.TextBlock,
      {
        margin: new go.Margin(3, 0, 3, 0),
        alignment: go.Spot.Center,
      },
      new go.Binding("text", "text")
    )
  )

  /**
   * Document Category Bar
   */
  const paletteDocletGroup = $(
    go.Node,
    "Auto",
    { selectionAdorned: false, width: 200, height: 35, movable: false },
    $(go.Shape, {
      fill: "#2e7d32",
      strokeWidth: 0,
      figure: "RoundedRectangle",
      margin: new go.Margin(5, 0, 5, 0),
    }),
    $(
      go.Panel,
      "Horizontal",
      $("TreeExpanderButton", {
        width: 15,
        margin: 4,
        "ButtonBorder.fill": "white",
        "ButtonBorder.stroke": null,
        _treeExpandedFigure: "LineDown",
        _treeCollapsedFigure: "LineRight",
        _buttonFillOver: "whitesmoke",
        _buttonStrokeOver: null,
      }),
      $(go.TextBlock, {
        text: "Doclet Type Nodes",
        font: "bold 11pt Barlow, sans-serif",
        stroke: "white",
        width: 180,
        margin: new go.Margin(4, 0, 0, 2),
      })
    )
  )

  /**
   * Imports Item
   */
  const imports = $(
    go.Node,
    "Auto",
    { selectionAdorned: false, width: 200, height: 35, movable: false },
    $(go.Shape, {
      fill: "#2e7d32",
      strokeWidth: 0,
      figure: "RoundedRectangle",
      margin: new go.Margin(5, 0, 5, 0),
    }),
    $(
      go.Panel,
      "Horizontal",
      $("TreeExpanderButton", {
        width: 15,
        margin: 4,
        "ButtonBorder.fill": "white",
        "ButtonBorder.stroke": null,
        _treeExpandedFigure: "LineDown",
        _treeCollapsedFigure: "LineRight",
        _buttonFillOver: "whitesmoke",
        _buttonStrokeOver: null,
      }),
      $(go.TextBlock, new go.Binding("text").makeTwoWay(), {
        font: "bold 11pt Barlow, sans-serif",
        stroke: "white",
        width: 180,
        margin: new go.Margin(4, 0, 0, 2),
      })
    )
  )

  /**
   * Import Item
   */
  const importNode = $(
    go.Node,
    "Auto",
    { movable: false },
    new go.Binding("isLayoutPositioned", "isLayoutPositioned"),
    new go.Binding("position", "position", go.Point.parse).makeTwoWay(
      go.Point.stringify
    ),
    new go.Binding(
      "copyable",
      "",
      (ev: any) => ev.state !== GoJsNodeState.Copied
    ),
    {
      defaultAlignment: go.Spot.Left,
      height: 25,
    },
    $(
      go.Shape,
      {
        strokeWidth: 0,
        figure: "RoundedRectangle",
      },
      new go.Binding("fill", "", (ev: any) => {
        if (ev.state === GoJsNodeState.Copied) return "#ccc"

        if (
          ev.state === GoJsNodeState.Palette ||
          ev.state === GoJsNodeState.Diagram
        )
          return "#1776D2"
      })
    ),
    $(
      go.Panel,
      "Horizontal",
      $(go.Picture, {
        width: 15,
        height: 20,
        margin: new go.Margin(0, 4, 0, 4),
        imageStretch: go.GraphObject.Uniform,
        source: "/icons/input.png",
      }),
      $(go.TextBlock, new go.Binding("text"), {
        font: "bold 11pt Barlow, sans-serif",
        stroke: "white",
        margin: new go.Margin(4, 5, 0, 2),
      }),
      $(
        "Button",
        new go.Binding(
          "visible",
          "",
          (ev: any) => ev.state === GoJsNodeState.Diagram
        ),
        {
          column: 1,
          "ButtonBorder.figure": "Circle",
        },
        $(go.Shape, "XLine", {
          width: 8,
          height: 8,
          click: (ev: any, obj: any) => alert("hola"),
        })
      )
    )
  )

  /**
   * Return All Templates
   */
  return {
    dropDocletType,
    docletTypeNodes,
    linkTemplate,
    imports,
    importNode,
    paletteDocletGroup,
    spacerNode,
  }
}

export default useGoJsTemplateTemplates
