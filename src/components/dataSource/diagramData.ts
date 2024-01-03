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
      key: "1f409525-7df2-4bb6-b406-3e6be8e9b347-0",
      id: "1f409525-7df2-4bb6-b406-3e6be8e9b347",
      tags: "",
      templateIndex: "-",
      title: "Description of Work",
    },
    {
      category: "DocletTypeNode",
      state: "Diagram",
      key: "1f409525-7df2-4bb6-b406-3e6be8e9b347-1",
      id: "1f409525-7df2-4bb6-b406-3e6be8e9b347",
      tags: "",
      templateIndex: "-",
      title: "Description of Work",
    },
    {
      category: "DocletTypeNode",
      state: "Diagram",
      key: "2bb59c76-b54d-4b49-abbd-a0c6595d77bd-2",
      id: "2bb59c76-b54d-4b49-abbd-a0c6595d77bd",
      tags: "",
      templateIndex: "-",
      title: "Engagement Contacts",
    },
    {
      category: "DocletTypeNode",
      state: "Diagram",
      key: "fc386d42-4874-4e3e-bb36-2e38430a17f8-3",
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
  ],
  linkDataArray: [
    {
      from: "prepend",
      to: "1f409525-7df2-4bb6-b406-3e6be8e9b347-0",
    },
    {
      from: "1f409525-7df2-4bb6-b406-3e6be8e9b347-0",
      to: "1f409525-7df2-4bb6-b406-3e6be8e9b347-1",
    },
    {
      from: "1f409525-7df2-4bb6-b406-3e6be8e9b347-1",
      to: "2bb59c76-b54d-4b49-abbd-a0c6595d77bd-2",
    },
    {
      from: "2bb59c76-b54d-4b49-abbd-a0c6595d77bd-2",
      to: "fc386d42-4874-4e3e-bb36-2e38430a17f8-3",
    },
    {
      from: "fc386d42-4874-4e3e-bb36-2e38430a17f8-3",
      to: "append",
    },
  ],
};
