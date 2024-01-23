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
      isLayoutPositioned: true,
    },
  ],
  linkDataArray: [
    {
      from: "prepend",
      to: "1f409525-7df2-4bb6-b406-3e6be8e9b347",
      key: 1,
    },
    {
      from: "1f409525-7df2-4bb6-b406-3e6be8e9b347",
      to: "2bb59c76-b54d-4b49-abbd-a0c6595d77bd",
      key: 2,
    },
    {
      from: "2bb59c76-b54d-4b49-abbd-a0c6595d77bd",
      to: "fc386d42-4874-4e3e-bb36-2e38430a17f8",
      key: 3,
    },
    {
      from: "fc386d42-4874-4e3e-bb36-2e38430a17f8",
      to: "append",
      key: 4,
    },
    {
      from: "fc386d42",
      to: "1f409525-7df2-4bb6-b406-3e6be8e9b347",
      key: 5,
    },
  ],
};
