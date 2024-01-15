export interface LinkType {
  from: string;
  to: string;
}

// Helper function to convert a GoJS iterator to an array of GoJS Nodes
const getNodesFromIterator = (list: go.Iterator<go.Node>) => {
  const nodes: go.Node[] = [];
  var it = list.iterator;
  while (it.next()) {
    const item = it.value;
    nodes.push(item);
  }
  return nodes;
};

export const useAlignImportNodes = (go: any, goJsCategory: any) => {
  const alignNodes = (diagram: go.Diagram): Promise<void> => {
    return new Promise<void>((resolve) => {
      const dModel = diagram.model as go.GraphLinksModel;
      const nodes: go.Node[] = getNodesFromIterator(diagram.nodes);
      let yPosition = 5;

      const importNodes: go.Node[] = nodes.filter(
        (node) => node.category === goJsCategory.ImportNode,
      );

      importNodes.forEach((importNode) => {
        dModel.set(
          importNode,
          "position",
          new go.Point(-250, (yPosition += 35)),
        );
      });

      resolve();
    });
  };

  return { alignNodes };
};
