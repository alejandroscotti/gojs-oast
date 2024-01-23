import * as go from "gojs"

export class CustomTreeLayout extends go.Layout {
  private _mainLayout: go.TreeLayout
  private _sideLayout: go.Layout
  private _side: go.Spot
  private _spacing: go.Size

  constructor() {
    super()
    const mainLayout = new go.TreeLayout({
      layerSpacing: 10,
      angle: 90,
    })
    this._mainLayout = mainLayout
    const sideLayout = new go.TreeLayout({
      layerSpacing: 10,
      angle: 90,
    })
    this._sideLayout = sideLayout
    console.log("CustomTreeLayout constructor")
    this._side = go.Spot.LeftSide
    this._spacing = new go.Size(250, 200)
  }

  /**
   * Gets or sets the side {@link Spot} where the side nodes and links should be laid out,
   * relative to the results of the main Layout.
   * The default value is Spot.BottomSide.
   *
   * If the value is Spot.Bottom, Spot.Top, Spot.Right, or Spot.Left,
   * the side nodes will be centered along that side.
   *
   * Currently only handles a single side.
   * @name ArrangingLayout#side
   * @return {Spot}
   */
  get side(): go.Spot {
    return this._side
  }
  set side(val: go.Spot) {
    if (
      !(val instanceof go.Spot) ||
      !(
        val.isSide() ||
        val.equals(go.Spot.Top) ||
        val.equals(go.Spot.Right) ||
        val.equals(go.Spot.Bottom) ||
        val.equals(go.Spot.Left)
      )
    ) {
      throw new Error(
        "new value for ArrangingLayout.side must be a side or middle-side Spot, not: " +
          val
      )
    }
    if (!this._side.equals(val)) {
      this._side = val.copy()
      this.invalidateLayout()
    }
  }

  override doLayout(coll: go.Diagram | go.Group | go.Iterable<go.Part>) {
    // Select nodes for the main layout
    const coll2 = this.collectParts(coll)
    if (coll2.count === 0) return

    let diagram = this.diagram
    if (diagram === null) diagram = coll2.first()!.diagram
    if (diagram === null) return

    const mainColl = new go.Set<go.Part>()
    const sideColl = new go.Set<go.Part>()
    // Run main layout
    diagram.startTransaction("Arranging Main Layout")

    this.splitParts(coll2, mainColl, sideColl)
    this._mainLayout.doLayout(mainColl)
    diagram.commitTransaction("Arranging Main Layout")

    // Run Side layout
    diagram.startTransaction("Arranging Side Layout")
    this._sideLayout.doLayout(sideColl)
    diagram.commitTransaction("Arranging Side Layout")

    this.moveSideCollection(sideColl)
  }

  /**
   * Gets or sets the space between the main layout and the side layout.
   * The default value is Size(20, 20).
   * @name ArrangingLayout#spacing
   * @return {Size}
   */
  get spacing(): go.Size {
    return this._spacing
  }
  set spacing(val: go.Size) {
    if (!(val instanceof go.Size))
      throw new Error(
        "new value for ArrangingLayout.spacing must be a Size, not: " + val
      )
    if (!this._spacing.equals(val)) {
      this._spacing = val.copy()
      this.invalidateLayout()
    }
  }

  /**
   * This method is called just after the sideLayout has been performed in order to move
   * its parts to the desired area relative to the results of the main layouts.
   * By default this calls {@link Diagram#moveParts} on the sidecoll collection to the {@link #side} of the mainbounds.
   * This won't get called if there are no Parts in the sidecoll collection.
   * @param {Set} sidecoll a collection of Parts that were laid out by the sideLayout
   * @param {Rect} mainbounds the area occupied by the results of the main layouts
   * @param {Rect} sidebounds the area occupied by the results of the sideLayout
   */
  moveSideCollection(sidecoll: go.Set<go.Part>) {
    const mainbounds = new go.Rect(500, 0, 500, 500)
    const sidebounds = new go.Rect(0, 0, 500, 500)
    const diagram = this.diagram
    if (!diagram) return
    let pos: go.Point | null = null
    if (this.side.equals(go.Spot.Bottom)) {
      pos = new go.Point(
        mainbounds.centerX - sidebounds.width / 2,
        mainbounds.y + mainbounds.height + this.spacing.height
      )
    } else if (this.side.equals(go.Spot.Right)) {
      pos = new go.Point(
        mainbounds.x + mainbounds.width + this.spacing.width,
        mainbounds.centerY - sidebounds.height / 2
      )
    } else if (this.side.equals(go.Spot.Top)) {
      pos = new go.Point(
        mainbounds.centerX - sidebounds.width / 2,
        mainbounds.y - sidebounds.height - this.spacing.height
      )
    } else if (this.side.equals(go.Spot.Left)) {
      pos = new go.Point(
        mainbounds.x - sidebounds.width - this.spacing.width,
        mainbounds.centerY - sidebounds.height / 2
      )
    } else if (this.side.includesSide(go.Spot.BottomSide)) {
      pos = new go.Point(
        mainbounds.x,
        mainbounds.y + mainbounds.height + this.spacing.height
      )
    } else if (this.side.includesSide(go.Spot.RightSide)) {
      pos = new go.Point(
        mainbounds.x + mainbounds.width + this.spacing.width,
        mainbounds.y
      )
    } else if (this.side.includesSide(go.Spot.TopSide)) {
      pos = new go.Point(
        mainbounds.x,
        mainbounds.y - sidebounds.height - this.spacing.height
      )
    } else if (this.side.includesSide(go.Spot.LeftSide)) {
      pos = new go.Point(
        mainbounds.x - sidebounds.width - this.spacing.width,
        mainbounds.y
      )
    }
    if (pos !== null) {
      diagram.moveParts(sidecoll, pos.subtract(sidebounds.position))
    }
  }

  private splitParts = (
    coll: go.Set<go.Part>,
    mainColl: go.Set<go.Part>,
    sideColl: go.Set<go.Part>
  ) => {
    coll.each((part) => {
      if (
        part.data.category === "ImportNode" ||
        part.data.category === "SpacerNode"
      ) {
        sideColl.add(part)
      } else {
        mainColl.add(part)
      }
    })
  }
}
