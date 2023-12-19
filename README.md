- Source code from https://github.com/NorthwoodsSoftware/gojs-react-samples/tree/main/gojs-react-palette-hooks-js
- Converted to TS.
- `npm install`
- `npm start` (runs in port 4001).

### Steps to reproduce issue
- Drop Node from Palette onto Orange Node "Prepend Doclet Type".
- Look at **targetNode** json data output to the right side of the Diagram; only the first Node drop works as expected. On subsequent drops on the same Orange node the **targetNode** no longer is the Orange Node "Prepend Doclet Type".
- Also, notice that on the first Node Drop, on hover the orange oval gets a blue border; this blue border on hover gets lost after 1st drop.
