import { useRef } from "react";
import { ReactDiagram, ReactPalette } from "gojs-react";
import { RootState, useAppDispatch, useAppSelector } from "./store/store";
import {
  onModelChange,
  clearSelection,
  changedSelection,
} from "./store/slices";
import * as go from "gojs";
import {
  Checkbox,
  FormGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from "@mui/material";
import GoJSWrapper from "./components/GoJSWrapper";
import goJsCategory from "./components/dataSource/goJsCategoryConfiguration";
import "./App.css";

const App = () => {
  const dispatch = useAppDispatch();

  const { linkDataArray, nodeDataArray, paletteData, skipsDiagramUpdate } =
    useAppSelector((state: RootState) => state.goJs);

  // Defined React GoJs Refs
  const diagramRef = useRef<ReactDiagram>(null);
  const paletteRef = useRef<ReactPalette>(null);

  const handleDiagramEvent = (e: any) => {
    const name = e.name;
    switch (name) {
      case "ChangedSelection": {
        const sel = e.subject.first();

        if (sel) {
          dispatch(changedSelection(sel));
        } else {
          dispatch(clearSelection());
        }

        break;
      }
      default:
        break;
    }
  };

  const handleLinkChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const diagram: go.Diagram | null | undefined =
      diagramRef?.current?.getDiagram();

    if (!diagram) return;

    diagram.startTransaction();

    const dModel = diagram.model as go.GraphLinksModel;
    const selNode = diagram?.selection.first() as go.Node;

    if (!selNode) return;

    // Add Link
    if (selNode && event.target.checked) {
      dModel.addLinkData({ from: selNode.key, to: event.target.name });
    } else {
      // Remove Link
      const links = selNode.findLinksOutOf();

      var it = links.iterator;
      while (it.next()) {
        const item = it.value;
        if (item.data.to === event.target.name) {
          dModel.removeLinkData(item.data);
        }
      }
    }

    diagram.commitTransaction();
  };

  const infoDrawerBody = () => {
    const diagram: go.Diagram | null | undefined =
      diagramRef?.current?.getDiagram();

    const selImportNode = diagram?.selection.first();

    const docletTypes = nodeDataArray?.filter((nodeTypes: any) => {
      return nodeTypes.category === goJsCategory.DocletTypeNode;
    });

    if (
      selImportNode &&
      docletTypes &&
      selImportNode.category === goJsCategory.ImportNode
    ) {
      const importNodeLinks = linkDataArray?.filter(
        (link: any) => link.from === selImportNode.key,
      );

      const importNodes = nodeDataArray?.filter((node: any) => {
        return node.category === goJsCategory.ImportNode;
      });

      return (
        <FormControl component="fieldset">
          <FormLabel component="legend">
            <span>Create or Remove Link from Import Node&nbsp;</span>
            <strong>{selImportNode.data.text}</strong>
            <span>&nbsp;into Doclet Type Node</span>
          </FormLabel>
          <FormGroup aria-label="position">
            {docletTypes.map((docletType: any, idx: number) => {
              let checked = false;
              let linkedToOther;

              const linkedToSelection = importNodeLinks.find(
                (link: any) => link.to === docletType.key,
              );

              if (linkedToSelection) {
                checked = true;
              } else {
                linkedToOther = linkDataArray.find((link: any) => {
                  if (
                    link.to === docletType.key &&
                    link.from !== selImportNode.key
                  ) {
                    return importNodes?.find((node: any) => {
                      return node.key === link.from;
                    });
                  } else {
                    return false;
                  }
                });
              }

              return (
                <FormControlLabel
                  key={idx}
                  control={
                    <Checkbox
                      onChange={handleLinkChange}
                      name={docletType.key}
                      checked={checked}
                      disabled={linkedToOther ? true : false}
                    />
                  }
                  value={docletType.key}
                  label={docletType.title}
                />
              );
            })}
          </FormGroup>
        </FormControl>
      );
    }
  };

  return (
    <GoJSWrapper
      diagramRef={diagramRef}
      drawerBody={infoDrawerBody()}
      paletteRef={paletteRef}
      linkDataArray={linkDataArray}
      nodeDataArray={nodeDataArray}
      onDiagramEvent={handleDiagramEvent}
      onModelChange={(obj: any) => {
        dispatch(onModelChange(obj));
      }}
      paletteData={paletteData}
      skipsDiagramUpdate={skipsDiagramUpdate}
    />
  );
};

export default App;
