# OAST GoJs Public Repo for debugging issues

## Issue: unable to programmatically position a Palette Node drop onto Diagram.

### Steps to reproduce pending issues

- Drop any _Blue Import Node_ from Palette onto Diagram _CANVAS_ (not onto an existing Node item).
- You will see that the new Blue Diagram Node _does not_ position to desired `new go.Point(1000, 1000)`.
- Look at function handler _handleImportNodeDrop_ line #150 `dModel.set(dNode, "location", new go.Point(1000, 1000));`. For now I'm testing a static Point value, eventualy I will calculate where I want them to go.
- How do I succesfully programmatically place a Palette Node anywhere I want whilst maintaining a Diagram `layout: $(go.TreeLayout),`?.
- I looked at your latest provided code and the _Import Node_ template you added `isLayoutPositioned: false` but this completely messed with the Palette `layout: $(go.TreeLayout),`.
- I added the required Binding to the _Import Node_ template `new go.Binding("location", "location", go.Point.parse).makeTwoWay(go.Point.stringify)`.
- All Nodes are set to `movable: false` because the user is not allowed to move any Node.
