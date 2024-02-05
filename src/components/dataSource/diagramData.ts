export const diagramDataInit = {
  nodeDataArray: [
    {
      category: "DropDocletType",
      key: "prepend",
      id: "prepend",
      text: "Prepend Doclet Type",
    },
    {
      category: "DocletTypeNode",
      state: "Diagram",
      key: "1f409525-7df2-4bb6-b406-3e6be8e9b347",
      id: "1f409525-7df2-4bb6-b406-3e6be8e9b347",
      tags: "",
      templateIndex: "-",
      title: "Description of Work",
    },
    {
      category: "DocletTypeNode",
      state: "Diagram",
      key: "2bb59c76-b54d-4b49-abbd-a0c6595d77bd",
      id: "2bb59c76-b54d-4b49-abbd-a0c6595d77bd",
      tags: "",
      templateIndex: "-",
      title: "Engagement Contacts",
    },
    {
      category: "DocletTypeNode",
      state: "Diagram",
      key: "fc386d42-4874-4e3e-bb36-2e38430a17f8",
      id: "fc386d42-4874-4e3e-bb36-2e38430a17f8",
      tags: "",
      templateIndex: "-",
      title: "Communications Plan",
    },
    {
      category: "SpacerNode",
      key: "111",
      id: "111",
    },
    {
      category: "ImportNode",
      state: "Diagram",
      key: "sds1",
      id: "sds1",
      text: "PCD",
    },
    {
      category: "ImportNode",
      state: "Diagram",
      key: "sds2",
      id: "sds2",
      text: "neo4j Query",
    },
    {
      category: "DropDocletType",
      key: "append",
      id: "append",
      text: "Append Doclet Type",
    },
    {
      category: "ImportNode",
      key: "fc386d42",
      id: "fc386d42",
      state: "Diagram",
      text: "R Script",
      //  isLayoutPositioned: false,
    },
  ],
  linkDataArray: [
    {
      from: "prepend",
      fromPort: "prepend",
      to: "1f409525-7df2-4bb6-b406-3e6be8e9b347",
      toPort: "top",
      key: 1,
    },
    {
      from: "1f409525-7df2-4bb6-b406-3e6be8e9b347",
      fromPort: "bottom",
      to: "2bb59c76-b54d-4b49-abbd-a0c6595d77bd",
      toPort: "top",
      key: 2,
    },
    {
      from: "2bb59c76-b54d-4b49-abbd-a0c6595d77bd",
      fromPort: "bottom",
      to: "fc386d42-4874-4e3e-bb36-2e38430a17f8",
      toPort: "top",
      key: 3,
    },
    {
      from: "fc386d42-4874-4e3e-bb36-2e38430a17f8",
      fromPort: "bottom",
      to: "append",
      toPort: "append",
      key: 4,
    },
    {
      from: "fc386d42",
      fromPort: "import",
      to: "1f409525-7df2-4bb6-b406-3e6be8e9b347",
      toPort: "left",
      key: 5,
    },
  ],
}
