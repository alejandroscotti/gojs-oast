import { GoJsNodeState } from "./dataSource/goJsNodeState";
import * as go from "gojs";

const useGoJsTemplateTemplates = (go: any) => {
  const $ = go.GraphObject.make;

  const docletTypeNodes = $(
    go.Node,
    "Auto",
    new go.Binding("copyable", "", (ev: go.ObjectData) => {
      return ev.state !== GoJsNodeState.Copied;
    }),
    $(
      go.Shape,
      new go.Binding("fill", "", (ev: go.ObjectData) => {
        if (ev.state === GoJsNodeState.Copied) return "#ccc";

        if (
          ev.state === GoJsNodeState.Palette ||
          ev.state === GoJsNodeState.Diagram
        )
          return "white";
      }),
      new go.Binding("stroke", "", (ev: go.ObjectData) => {
        if (ev.state === GoJsNodeState.Copied) return "#ccc";

        if (
          ev.state === GoJsNodeState.Palette ||
          ev.state === GoJsNodeState.Diagram
        )
          return "#1776D2";
      }),
      {
        strokeWidth: 1,
        figure: "RoundedRectangle",
        alignment: go.Spot.Center,
      },
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
        new go.Binding("text", "title"),
      ),
      $(
        "Button",
        new go.Binding("visible", "", (ev: go.ObjectData) => {
          console.table(ev);
          return ev.state === GoJsNodeState.Diagram;
        }),
        {
          width: 22,
          height: 22,
          "ButtonBorder.stroke": null,
          _buttonStrokeOver: null,
          "ButtonBorder.fill": null,
          _buttonFillOver: null,
        },
        $(go.Picture, {
          desiredSize: new go.Size(17, 17),
          source: "/icons/circle-xmark-regular-black.png",
        }),
      ),
    ),
  );

  const linkTemplate = $(
    go.Link,
    { layerName: "Background" },
    $(go.Shape, { isPanelMain: true, strokeWidth: 1 }),
    $(go.Shape, {
      isPanelMain: true,
      stroke: "transparent",
      strokeWidth: 50,
    }),
    $(go.Shape, {
      toArrow: "Feather",
      strokeWidth: 2,
    }),
  );

  const dropDocletType = $(
    go.Node,
    "Auto",
    {
      mouseDragEnter: (ev: go.InputEvent, obj: go.Node) => {
        const node = obj.elt(0) as go.Shape;
        if (node) node.stroke = "#1776D2";
      },
      mouseDragLeave: (ev: go.InputEvent, obj: go.Node) => {
        const node = obj.elt(0) as go.Shape;
        if (node) node.stroke = "#ffc74c";
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
      new go.Binding("text", "text"),
    ),
  );

  /**
   * Document Category Bar
   */
  const paletteDocletGroup = $(
    go.Node,
    "Auto",
    { selectionAdorned: false, width: 200, height: 35 },
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
      }),
    ),
  );

  /**
   * Imports Item
   */
  const imports = $(
    go.Node,
    "Auto",
    { selectionAdorned: false, width: 200, height: 35 },
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
      }),
    ),
  );

  /**
   * PCD Import Item
   */
  const importNode = $(
    go.Node,
    "Auto",
    new go.Binding(
      "copyable",
      "",
      (ev: any) => ev.state !== GoJsNodeState.Copied,
    ),
    {
      defaultAlignment: go.Spot.Left,
      selectionAdorned: false,
      height: 25,
    },
    $(
      go.Shape,
      {
        strokeWidth: 0,
        figure: "RoundedRectangle",
      },
      new go.Binding("fill", "", (ev: any) => {
        if (ev.state === GoJsNodeState.Copied) return "#ccc";

        if (
          ev.state === GoJsNodeState.Palette ||
          ev.state === GoJsNodeState.Diagram
        )
          return "#1776D2";
      }),
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
          (ev: any) => ev.state === GoJsNodeState.Diagram,
        ),
        {
          width: 22,
          height: 22,
          "ButtonBorder.stroke": null,
          _buttonStrokeOver: null,
          "ButtonBorder.fill": null,
          _buttonFillOver: null,
          click: (ev: any, obj: any) => alert("hola"),
        },
        $(go.Picture, {
          desiredSize: new go.Size(17, 17),
          source: "/icons/circle-xmark-regular-white.png",
        }),
      ),
    ),
  );

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
  };
};

export default useGoJsTemplateTemplates;
