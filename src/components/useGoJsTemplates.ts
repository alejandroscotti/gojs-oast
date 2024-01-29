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
    "Spot", // Changed to 'Spot' to allow precise port positioning
    { movable: false },
    new go.Binding("copyable", "", (data: any) => data.state !== GoJsNodeState.Copied),

    // Main content of the node wrapped in an Auto Panel
    $(go.Panel, "Auto", 
        $(go.Shape, "RoundedRectangle", 
            new go.Binding("fill", "state", (state: any) => state === GoJsNodeState.Copied ? "#ccc" : (state === GoJsNodeState.Palette || state === GoJsNodeState.Diagram ? "white" : null)),
            new go.Binding("stroke", "state", (state: any) => state === GoJsNodeState.Copied ? "#ccc" : (state === GoJsNodeState.Palette || state === GoJsNodeState.Diagram ? "#1776D2" : null)),
            {
              strokeWidth: 1,
              width: 200,
              maxSize: new go.Size(200, NaN),
              alignment: go.Spot.Center,
            }
        ),
        $(go.Panel, "Horizontal",
            { stretch: go.GraphObject.Horizontal, alignment: go.Spot.Center },
            "Horizontal",
            $(go.TextBlock, {
                margin: new go.Margin(2, 10, 0, 5),
                width: 150,
                wrap: go.TextBlock.WrapDesiredSize,
                textAlign: 'center',
                font: "bold 10pt Barlow, sans-serif",
            }, new go.Binding("text", "title")),
            $("Button", new go.Binding("visible", "state", (state: any) => state === GoJsNodeState.Diagram), {
                column: 1,
                "ButtonBorder.figure": "Circle",
            }, $(go.Shape, "XLine", {
                width: 8,
                height: 8,
                fill: "white",
                click: (ev: any, obj: any) => alert("hola"),
            }))
        )
    ),

    // Conditional Ports
    $(go.Shape, "Circle", {
        portId: "left",
        alignment: new go.Spot(0, 0.5),
        desiredSize: new go.Size(8, 8),
        fill: "#1776D2",
        fromLinkable: true,
        toLinkable: true,
        visible: false,
      },
      new go.Binding("visible", "state", (state: any) => state === GoJsNodeState.Diagram)
    ),
    $(go.Shape, "Circle", {
        portId: "top",
        alignment: go.Spot.TopCenter,
        desiredSize: new go.Size(8, 8),
        fill: "#1776D2",
        fromLinkable: true,
        toLinkable: true,
        visible: false,
      },
      new go.Binding("visible", "state", (state: any) => state === GoJsNodeState.Diagram)
    ),
    $(go.Shape, "Circle", {
        portId: "bottom",
        alignment: go.Spot.BottomCenter,
        desiredSize: new go.Size(8, 8),
        fill: "#1776D2",
        fromLinkable: true,
        toLinkable: true,
        visible: false,
      },
      new go.Binding("visible", "state", (state: any) => state === GoJsNodeState.Diagram)
    )
  );


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
    },
    $(go.Shape, "RoundedRectangle", { 
      strokeWidth: 1, 
      stroke: "#ffc74c", 
      fill: "#ffc74c",
    }),
    $(go.Panel, "Vertical", {
      width: 200,
      maxSize: new go.Size(200, NaN),
    },
      // Adjust the internal layout to match docletTypeNodes
      $("Button", { visible: false }), // Invisible button to mimic layout
      $(go.TextBlock,
        {
          margin: new go.Margin(2, 10, 0, 5), // Adjust margins to match docletTypeNodes
          textAlign: "center",
          font: "bold 10pt Barlow, sans-serif"
        },
        new go.Binding("text", "text")
      )
    )
);

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
