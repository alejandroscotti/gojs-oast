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
        new go.Binding(
          "visible",
          "",
          (ev: any) => ev.part.data.state === GoJsNodeState.Diagram,
        ).ofObject(),
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
    $(go.Shape, { isPanelMain: true, strokeWidth: 1 }),
    $(go.Shape, {
      isPanelMain: true,
      stroke: "transparent",
      strokeWidth: 150,
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
   * Return All Templates
   */
  return {
    dropDocletType,
    docletTypeNodes,
    linkTemplate,
  };
};

export default useGoJsTemplateTemplates;
